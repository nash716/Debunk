var $ = window.$,
	store = require('./store'),
	execute = require('./execute'),
	utils = require('./utils');

var selectors = {
	req: {
		PASS_BUTTON: '#reqProxy',
		HEADERS: '#reqHeader',
		BODY: '#reqBody',
		PARENT: '#request',
		REQUEST_ID: 'data-req-id'
	},
	res: {
		PASS_BUTTON: '#resProxy',
		HEADERS: '#resHeader',
		BODY: '#resBody',
		PARENT: '#response',
		RESPONSE_ID: 'data-res-id'
	}
};

function init() {
	$('#reqProxy').click(reqPass);
	$('#resProxy').click(resPass);
}

function reqPass() {
	var reqId = parseInt($(this).parent(selectors.req.PARENT).attr(selectors.req.REQUEST_ID), 10);

	execute(function(next) {
		store.stream('req/req' + reqId, $(selectors.req.BODY).val(), next);
	}, function(next) {
		store.stream('req/head' + reqId, $(selectors.req.HEADERS).val(), next);
	}, function(next) {
		proxyRequests[reqId].emit('pass');
	}, utils.err('Error in saving the request.'));
}

function resPass() {
	var resId = parseInt($(this).parent(selectors.res.PARENT).attr(selectors.res.RESPONSE_ID), 10);

	execute(function(next) {
		store.stream('res/res' + resId, $(selectors.res.BODY).val(), next);
	}, function(next) {
		store.stream('res/head' + resId, $(selectors.res.HEADERS).val(), next);
	}, function(next) {
		proxyResponses[resId].emit('pass');
	}, utils.err('Error in saving the request.'));
}

function listClicked() {
	var reqId = parseInt($(this).attr(selectors.req.REQUEST_ID), 10);
	$(selectors.req.PARENT).attr(selectors.req.REQUEST_ID, reqId);
	store.req(reqId, reqBody, reqHeader);

	var resId = parseInt($(this).attr(selectors.res.RESPONSE_ID), 10);
	$(selectors.res.PARENT).attr(selectors.res.RESPONSE_ID, resId);
	store.res(resId, resBody, resHeader);
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

function createElement(reqId, parsedURL) {
	$('<div>')
		.attr(selectors.req.REQUEST_ID, reqId)
		.attr('id','item')
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