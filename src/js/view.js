var selectors = require('./selectors'),
	ProxyStatus = require('./ProxyStatus'),
	Procedure = require('./Procedure');

var req = new Procedure('req'),
	res = new Procedure('res');

function init() {
	$(selectors.req.PASS).click(req.pass);
	$(selectors.res.PASS).click(res.pass);
	$(selectors.req.DROP).click(req.drop);
	$(selectors.res.DROP).click(res.drop);

	$(selectors.req.DISPLAY_TYPE).change(req.display);
	$(selectors.res.DISPLAY_TYPE).change(res.display);
}

function listClicked() {
	var reqId = parseInt($(this).attr(selectors.req.ID), 10);
	$(selectors.req.PARENT).attr(selectors.req.ID, reqId);
	req.display();

	var resId = parseInt($(this).attr(selectors.res.ID), 10);
	$(selectors.res.PARENT).attr(selectors.res.ID, resId);
	res.display();

	req.buttonState(proxyObjects.req[reqId].status === ProxyStatus.WAITING);
	res.buttonState(proxyObjects.res[resId] && proxyObjects.res[resId].status === ProxyStatus.WAITING);
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

module.exports = exports = {
	createElement: createElement,
	relate: relate,
	init: init
};