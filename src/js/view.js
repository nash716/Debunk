var store = require('./store'),
	execute = require('./execute'),
	utils = require('./utils'),
	ProxyStatus = require('./ProxyStatus');
// [TODO] req*** 関数は Request オブジェクトに、res*** 関数は Response オブジェクトにまとめる
var selectors = {
	req: {
		BUTTONS: '#reqProxy',
		PASS: '#reqForward',
		DROP: '#reqDrop',
		HEADERS: '#reqHeader',
		BODY: '#reqBody',
		PARENT: '#request',
		ID: 'data-req-id',
		DISPLAY_TYPE: '#reqView',
		INNER: '#req-inner'
	},
	res: {
		BUTTONS: '#resProxy',
		PASS: '#resForward',
		DROP: '#resDrop',
		HEADERS: '#resHeader',
		BODY: '#resBody',
		PARENT: '#response',
		ID: 'data-res-id',
		DISPLAY_TYPE: '#resView',
		INNER: '#res-inner'
	}
};

var display = {
	req: {
		raw: $('<div>').attr('id', selectors.req.INNER.substr(1)) // '#hoge' を 'hoge' に
			.append($('<span>').text('Headers:'))
			.append($('<br />'))
			.append($('<textarea>').attr('id', selectors.req.HEADERS.substr(1)))
			.append($('<br />'))
			.append($('<span>').text('Body:'))
			.append($('<br />'))
			.append($('<textarea>').attr('id', selectors.req.BODY.substr(1))),
		table: $('<div>').attr('id', selectors.req.INNER.substr(1))
			.append($('<span>').text('Headers:'))
			.append(createTable().attr('id', selectors.req.HEADERS.substr(1)))
			.append($('<span>').text('Body:'))
			.append($('<br />'))
			.append($('<textarea>').attr('id', selectors.req.BODY.substr(1)))
	},
	res: {
		raw: $('<div>').attr('id', selectors.res.INNER.substr(1))
			.append($('<span>').text('Headers:'))
			.append($('<br />'))
			.append($('<textarea>').attr('id', selectors.res.HEADERS.substr(1)))
			.append($('<br />'))
			.append($('<span>').text('Body:'))
			.append($('<br />'))
			.append($('<textarea>').attr('id', selectors.res.BODY.substr(1))),
		table: $('<div>').attr('id', selectors.res.INNER.substr(1))
			.append($('<span>').text('Headers:'))
			.append(createTable().attr('id', selectors.res.HEADERS.substr(1)))
			.append($('<span>').text('Body:'))
			.append($('<br />'))
			.append($('<textarea>').attr('id', selectors.res.BODY.substr(1)))
	}
}

function init() {
	$(selectors.req.PASS).click(reqPass);
	$(selectors.res.PASS).click(resPass);
	$(selectors.req.DROP).click(reqDrop);
	$(selectors.res.DROP).click(resDrop);

	$(selectors.req.DISPLAY_TYPE).change(reqDisplay);
	$(selectors.res.DISPLAY_TYPE).change(resDisplay);
}

function reqPass() {
	var reqId = parseInt($(selectors.req.PARENT).attr(selectors.req.ID), 10);

	if (!(reqId > 0)) return;

	execute(function(next) {
		store.stream('req/req' + reqId, $(selectors.req.BODY).val(), next);
	}, function(next) {
		store.stream('req/head' + reqId, $(selectors.req.HEADERS).val(), next);
	}, function(next) {
		proxyRequests[reqId].emit('pass');
	}, utils.err('Error in saving the request.'));

	reqButtonState(false);
}

function resPass() {
	var resId = parseInt($(selectors.res.PARENT).attr(selectors.res.ID), 10);

	if (!(resId > 0)) return;

	execute(function(next) {
		store.stream('res/res' + resId, $(selectors.res.BODY).val(), next);
	}, function(next) {
		store.stream('res/head' + resId, $(selectors.res.HEADERS).val(), next);
	}, function(next) {
		proxyResponses[resId].emit('pass');
	}, utils.err('Error in saving the response.'));

	resButtonState(false);
}

function reqDrop() {
	var reqId = parseInt($(selectors.req.PARENT).attr(selectors.req.ID), 10);

	if (!(reqId > 0)) return;

	proxyRequests[reqId].emit('drop');

	reqButtonState(false);
}

function resDrop() {
	var resId = parseInt($(selectors.res.PARENT).attr(selectors.res.ID), 10);

	if (!(resId > 0)) return;

	proxyResponses[resId].emit('drop');

	resButtonState(false);
}

function listClicked() {
	var reqId = parseInt($(this).attr(selectors.req.ID), 10);
	$(selectors.req.PARENT).attr(selectors.req.ID, reqId);
	reqDisplay();

	var resId = parseInt($(this).attr(selectors.res.ID), 10);
	$(selectors.res.PARENT).attr(selectors.res.ID, resId);
	resDisplay();

	reqButtonState(proxyRequests[reqId].status === ProxyStatus.WAITING);
	resButtonState(proxyResponses[resId] && proxyResponses[resId].status === ProxyStatus.WAITING);
}

function reqRawBody(err, data) {
	$(selectors.req.BODY).val(data);
}

function reqRawHeader(err, data) {
	$(selectors.req.HEADERS).val(data);
}

function reqTableHeader(err, data) {
	var tbody = $(selectors.req.HEADERS);

	var headers = JSON.parse(data).headers;

	for (var key in headers) {
		tbody.append(createTableRow(key, headers[key]));
	}
}

function resRawBody(err, data) {
	$(selectors.res.BODY).val(data);
}

function resRawHeader(err, data) {
	$(selectors.res.HEADERS).val(data);
}

function resTableHeader(err, data) {
	var tbody = $(selectors.res.HEADERS);

	var headers = JSON.parse(data).headers;

	for (var key in headers) {
		tbody.append(createTableRow(key, headers[key]));
	}
}

function reqButtonState(enabled) {
	if (enabled === true) {
		$(selectors.req.PASS).removeAttr('disabled');
		$(selectors.req.DROP).removeAttr('disabled');
	} else {
		$(selectors.req.PASS).attr('disabled', 'disabled');
		$(selectors.req.DROP).attr('disabled', 'disabled');
	}
}

function resButtonState(enabled) {
	if (enabled === true) {
		$(selectors.res.PASS).removeAttr('disabled');
		$(selectors.res.DROP).removeAttr('disabled');
	} else {
		$(selectors.res.PASS).attr('disabled', 'disabled');
		$(selectors.res.DROP).attr('disabled', 'disabled');
	}
}

function reqDisplay() {
	var reqId = parseInt($(selectors.req.PARENT).attr(selectors.req.ID), 10);

	if (!(reqId > 0)) return;

	$(selectors.req.INNER).remove();

	switch($(selectors.req.DISPLAY_TYPE).val()) {
	case 'raw':
		$(selectors.req.PARENT).append(display.req.raw.clone());
		store.req(reqId, reqRawBody, reqRawHeader);
		break;
	case 'table':
		$(selectors.req.PARENT).append(display.req.table.clone());
		store.req(reqId, reqRawBody, reqTableHeader);
		break;
	}
}

function resDisplay() {
	var resId = parseInt($(selectors.res.PARENT).attr(selectors.res.ID), 10);

	if (!(resId > 0)) return;

	$(selectors.res.INNER).remove();

	switch($(selectors.res.DISPLAY_TYPE).val()) {
	case 'raw':
		$(selectors.res.PARENT).append(display.res.raw.clone());
		store.req(resId, resRawBody, resRawHeader);
		break;
	case 'table':
		$(selectors.res.PARENT).append(display.res.table.clone());
		store.res(resId, resRawBody, resTableHeader);
		break;
	}
}

function createElement(reqId, parsedURL) {
	$('<div>')
		.attr(selectors.req.ID, reqId)
		.addClass('item')
		.text(parsedURL.pathname)
		.click(listClicked)
		.appendTo($('#list'));
}

function relate(reqId, resId) {
	$('div[' + selectors.req.ID + '="' + reqId + '"]')
		.attr(selectors.res.ID, resId);
}

function createTable(title1, title2) {
	var table = $('<table>').addClass('table table-condensed');

		var thead = $('<thead>'),
			tbody = $('<tbody>');

			var tr = $('<tr>');

				var th1 = $('<th>').text(title1)
									.css('text-align', 'center');
				var th2 = $('<th>').text(title2)
									.css('text-align', 'center');

			tr.append(th1)
				.append(th2);

		thead.append(tr);

	table.append(thead)
		.append(tbody);

	return table;
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

module.exports = exports = {
	createElement: createElement,
	relate: relate,
	init: init
};