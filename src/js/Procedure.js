var store = require('./store'),
	execute = require('./execute'),
	utils = require('./utils'),
	ProxyStatus = require('./ProxyStatus'),
	selectors = require('./selectors'),
	displayObjects = require('./displayObjects');

var Procedure = function(type) {
	function pass() {
		var id = parseInt($(selectors[type].PARENT).attr(selectors[type].ID), 10);

		if (!(id > 0)) return;

		execute(function(next) {
			store.stream(type + '/' + type + id, $(selectors[type].BODY).val(), next);
		}, function(next) {
			var value = this.toJSON();
			store.stream(type + '/head' + id, value, next);
		}, function(next) {
			proxyObjects[type][id].emit('pass');
		}, utils.err('Error in saving the ' + type + '.'));

		buttonState(false);
	}

	function drop() {
		var id = parseInt($(selectors[type].PARENT).attr(selectors[type].ID), 10);

		if (!(id > 0)) return;

		proxyObjects[type][id].emit('drop');

		buttonState(false);
	}

	function rawBody(err, data) {
		$(selectors[type].BODY).val(data);
	}

	function rawHeader(err, data) {
		var obj = JSON.parse(data),
			id = parseInt($(selectors[type].PARENT).attr(selectors[type].ID), 10);

		var headerStr = '';

		switch (type) {
		case 'req':
			headerStr += obj.method + ' ' + obj.url + ' HTTP/' + obj.httpVersion + '\r\n';
			break;
		case 'res':
			headerStr += 'HTTP/' + obj.httpVersion + ' ' + obj.statusCode +'\r\n';
			break;
		}

		for (var key in obj.headers) {
			headerStr += key + ': ' + obj.headers[key] + '\r\n';
		}

		$(selectors[type].HEADERS).val(headerStr);

		determineFileType(id, obj);

		this.toJSON = rawToJSON;
	}

	function tableHeader(err, data) {
		var tbody = $(selectors[type].HEADERS),
			id = parseInt($(selectors[type].PARENT).attr(selectors[type].ID), 10);

		var obj = JSON.parse(data);

		if (proxyObjects[type][id].status === ProxyStatus.WAITING) {
			switch (type) {
			case 'req':
				tbody.append(createTableRow('Method', obj.method, selectors.req.METHOD.substr(1), true));
				tbody.append(createTableRow('URL', obj.url, selectors.req.URL.substr(1), true));
				tbody.append(createTableRow('HTTP Version', obj.httpVersion, selectors.req.HTTP_VERSION.substr(1), true));
				break;
			case 'res':
				tbody.append(createTableRow('Status Code', obj.statusCode, selectors.res.STATUS_CODE.substr(1), true));
				tbody.append(createTableRow('HTTP Version', obj.httpVersion, selectors.res.HTTP_VERSION.substr(1), true));
				break;
			}

			for (var key in obj.headers) {
				tbody.append(createTableRow(key, obj.headers[key], false, true));
			}

			tbody.append(displayObjects[type].addHeaderButton);
		} else {
			switch (type) {
			case 'req':
				tbody.append(createTableRow('Method', obj.method, selectors.req.METHOD.substr(1)));
				tbody.append(createTableRow('URL', obj.url, selectors.req.URL.substr(1)));
				tbody.append(createTableRow('HTTP Version', obj.httpVersion, selectors.req.HTTP_VERSION.substr(1)));
				break;
			case 'res':
				tbody.append(createTableRow('Status Code', obj.statusCode, selectors.res.STATUS_CODE.substr(1)));
				tbody.append(createTableRow('HTTP Version', obj.httpVersion, selectors.res.HTTP_VERSION.substr(1)));
				break;
			}

			for (var key in obj.headers) {
				tbody.append(createTableRow(key, obj.headers[key]));
			}
		}

		determineFileType(id, obj);

		this.toJSON = tableToJSON;
	}

	function buttonState(enabled) {
		if (enabled === true) {
			$(selectors[type].PASS).removeAttr('disabled');
			$(selectors[type].DROP).removeAttr('disabled');
		} else {
			$(selectors[type].PASS).attr('disabled', 'disabled');
			$(selectors[type].DROP).attr('disabled', 'disabled');
		}
	}

	function display() {
		var id = parseInt($(selectors[type].PARENT).attr(selectors[type].ID), 10),
			value = $(selectors[type].DISPLAY_TYPE).val();

		utils.config(type + 'Display', value);

		if (!(id > 0)) return;

		$(selectors[type].INNER).remove();

		switch(value) {
		case 'raw':
			$(selectors[type].PARENT).append(displayObjects[type].raw.clone());
			store[type](id, null, rawHeader);
			break;
		case 'table':
			$(selectors[type].PARENT).append(displayObjects[type].table.clone());
			store[type](id, null, tableHeader);
			break;
		}
	}

	function createTableRow(key, value, id, textBox) {
		var tr = $('<tr>');

		var td1 = $('<td>'),
			td2 = $('<td>');

		if (textBox) {
			if (!id) {
				td1.append(
					$('<input>')
						.attr('type', 'text')
						.val(key)
						.css('height', '16px')
				);
			} else {
				td1.text(key)
					.css('white-space', 'nowrap');
			}

			td2.append(
				$('<input>')
					.attr('type', 'text')
					.val(value)
					.css('height', '16px')
			);
		} else {
			td1.text(key)
				.css('white-space', 'nowrap');

			td2.text(value);
		}

		if (id) td2.attr('id', id);

		tr.append(td1)
			.append(td2);

		return tr;
	}

	function rawToJSON() {
		var str = $(selectors[type].HEADERS).val(),
			obj = {
				headers: { }
			};

		var lines = str.split('\n');

		var firstLine = lines.shift();

		switch (type) {
		case 'req':
			var l = firstLine.split(' ');
			obj.method = l[0];
			obj.url = l[1];
			obj.httpVersion = l[2].match(/\d\.\d/)[0];
			break;
		case 'res':
			var l = firstLine.split(' ');
			obj.httpVersion = l[0].match(/\d\.\d/)[0];
			obj.statusCode = l[1];
			break;
		}

		for (var i=0; i<lines.length; i++) {
			var header = lines[i].replace(/\r/g, '').trim().split(': ');

			if (header.length != 2) continue; // [TODO] エラー表示する

			obj.headers[header[0]] = header[1];
		}

		return JSON.stringify(obj);
	}

	function tableToJSON() {
		var table = $(selectors[type].HEADERS),
			obj = {
				headers: { }
			};

		switch (type) {
		case 'req':
			obj.method = $(selectors[type].METHOD).children('input').val();
			obj.url = $(selectors[type].URL).children('input').val();
			obj.httpVersion = $(selectors[type].HTTP_VERSION).children('input').val();
			break;
		case 'res':
			obj.httpVersion = $(selectors[type].HTTP_VERSION).children('input').val();
			obj.statusCode = $(selectors[type].STATUS_CODE).children('input').val();
			break;
		}

		table.children('tbody').children('tr').each(function() {
			if ($($(this).children('td')[1]).attr('id') || $(this).children('td').length < 2) return;

			var key = $($(this).children('td')[0]).children('input').val(),
				value = $($(this).children('td')[1]).children('input').val();

			if (key.length === 0) return;

			obj.headers[key] = value;
		});

		return JSON.stringify(obj);
	}

	function determineFileType(id, obj) {
		if (isBinary(obj)) {
			require('./view').createOpenButton(type);
		} else {
			store[type](id, rawBody, null);
		}
	}

	function isBinary(obj) {
		var text;

		if (obj.statusCode == '304') return false;
// [TODO] もっと厳密にやる
		// RFC 2616 14.13, 3.6
		text = obj.headers['Content-Encoding'] || (parseInt(obj.headers['Content-Length'], 10) < utils.config('contentLength'));
		text = text && (obj.headers['Content-Type'].indexOf('text/') === 0);

		return !text;
	}

	this.pass = pass;
	this.drop = drop;
	this.rawBody = rawBody;
	this.rawHeader = rawHeader;
	this.tableHeader = tableHeader;
	this.buttonState = buttonState;
	this.createTableRow = createTableRow;
	this.display = display;
};

module.exports = exports = Procedure;