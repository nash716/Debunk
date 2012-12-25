var store = require('./store'),
	execute = require('./execute'),
	utils = require('./utils'),
	ProxyStatus = require('./ProxyStatus');

var selectors = {
	req: {
		BUTTONS: '#reqProxy',
		PASS: '#reqForward',
		DROP: '#reqDrop',
		HEADERS: '#reqHeader',
		BODY: '#reqBody',
		PARENT: '#request',
		REQUEST_ID: 'data-req-id'
	},
	res: {
		BUTTONS: '#resProxy',
		PASS: '#resForward',
		DROP: '#resDrop',
		HEADERS: '#resHeader',
		BODY: '#resBody',
		PARENT: '#response',
		RESPONSE_ID: 'data-res-id'
	}
};

function init() { // [TODO] Drop 時の処理
	$(selectors.req.PASS).click(reqPass);
	$(selectors.res.PASS).click(resPass);
	$(selectors.req.DROP).click(reqDrop);
	$(selectors.res.DROP).click(resDrop);
}

function reqPass() {
	var reqId = parseInt($(selectors.req.PARENT).attr(selectors.req.REQUEST_ID), 10);

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
	var resId = parseInt($(selectors.res.PARENT).attr(selectors.res.RESPONSE_ID), 10);

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
	var reqId = parseInt($(selectors.req.PARENT).attr(selectors.req.REQUEST_ID), 10);

	proxyRequests[reqId].emit('drop');

	reqButtonState(false);
}

function resDrop() {
	var resId = parseInt($(selectors.res.PARENT).attr(selectors.res.RESPONSE_ID), 10);

	proxyResponses[resId].emit('drop');

	resButtonState(false);
}

function listClicked() {
	var reqId = parseInt($(this).attr(selectors.req.REQUEST_ID), 10);
	$(selectors.req.PARENT).attr(selectors.req.REQUEST_ID, reqId);
	store.req(reqId, reqBody, reqHeader);

	var resId = parseInt($(this).attr(selectors.res.RESPONSE_ID), 10);
	$(selectors.res.PARENT).attr(selectors.res.RESPONSE_ID, resId);
	store.res(resId, resBody, resHeader);

	reqButtonState(proxyRequests[reqId].status === ProxyStatus.WAITING);
	resButtonState(proxyResponses[resId] && proxyResponses[resId].status === ProxyStatus.WAITING);
}

function reqBody(err, data) {
	$(selectors.req.BODY).val(data);
}

function reqHeader(err, data) {
	$(selectors.req.HEADERS).val(data);
}

function resBody(err, data) {
	$(selectors.res.BODY).val(data);
}

function resHeader(err, data) {
	$(selectors.res.HEADERS).val(data);
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


function createElement(reqId, parsedURL) {
	$('<div>')
		.attr(selectors.req.REQUEST_ID, reqId)
		.addClass('item')
		.text(parsedURL.pathname)
		.click(listClicked)
		.appendTo($('#list'));
}

function relate(reqId, resId) {
	$('div[' + selectors.req.REQUEST_ID + '="' + reqId + '"]')
		.attr(selectors.res.RESPONSE_ID, resId);
}

module.exports = exports = {
	createElement: createElement,
	relate: relate,
	init: init
};