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
			store.stream(type + '/head' + id, $(selectors[type].HEADERS).val(), next);
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
		$(selectors[type].HEADERS).val(data);
	}

	function tableHeader(err, data) {
		var tbody = $(selectors[type].HEADERS);

		var headers = JSON.parse(data).headers;

		for (var key in headers) {
			tbody.append(createTableRow(key, headers[key]));
		}
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
		var id = parseInt($(selectors[type].PARENT).attr(selectors[type].ID), 10);

		if (!(id > 0)) return;

		$(selectors[type].INNER).remove();

		switch($(selectors[type].DISPLAY_TYPE).val()) {
		case 'raw':
			$(selectors[type].PARENT).append(displayObjects[type].raw.clone());
			store[type](id, rawBody, rawHeader);
			break;
		case 'table':
			$(selectors[type].PARENT).append(displayObjects[type].table.clone());
			store[type](id, rawBody, tableHeader);
			break;
		}
	}

	function createTableRow(key, value, isCenter) {
		var tr = $('<tr>');

		var td1 = $('<td>').text(key).css('white-space', 'nowrap');
		
		if (isCenter) {
			td1.css('text-align', 'center');
		}
		
		var td2 = $('<td>').text(value);
		
		if (isCenter) {
			td2.css('text-align', 'center');
		}

		tr.append(td1)
			.append(td2);

		return tr;
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