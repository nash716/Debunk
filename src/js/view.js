var selectors = require('./selectors'),
	utils = require('./utils'),
	displayObjects = require('./displayObjects'),
	ProxyStatus = require('./ProxyStatus'),
	Procedure = require('./Procedure'),
	path = require('path');

var req = new Procedure('req'),
	res = new Procedure('res');

function init() {
	$(selectors.req.PASS).click(req.pass);
	$(selectors.res.PASS).click(res.pass);
	$(selectors.req.DROP).click(req.drop);
	$(selectors.res.DROP).click(res.drop);

	$(selectors.req.DISPLAY_TYPE)
		.change(req.display)
		.val(utils.config('reqDisplay'));
	$(selectors.res.DISPLAY_TYPE)
		.change(res.display)
		.val(utils.config('resDisplay'));

	$(selectors.req.ADD_HEADER).live('click', addHeader);
	$(selectors.res.ADD_HEADER).live('click', addHeader);

	$(selectors.req.OPEN_BUTTON).live('click', openBinary);
	$(selectors.res.OPEN_BUTTON).live('click', openBinary);
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
		.html(listContent(parsedURL))
		.click(listClicked)
		.appendTo($('#list'));
}

function relate(reqId, resId) {
	$('div[' + selectors.req.ID + '="' + reqId + '"]')
		.attr(selectors.res.ID, resId);
}

function openOptions() {
	var editors = utils.config('editors'),
		ret = [ ];

	for (var i=0; i<editors.length; i++) {
		ret.push($('<option>').text(editors[i].name).val(editors[i].value));
	}

	return ret;
}

function createOpenButton(type) {
	var button = displayObjects[type].openButton.clone();

	button.children('select').append(openOptions());

	$(selectors[type].BODY).remove();
	$(selectors[type].INNER).append(button);
}

function listContent(parsedURL) {
	var config = utils.config('list');

	config = config.replace(/%P/g, parsedURL.protocol);
	config = config.replace(/%p/g, parsedURL.port || '');
	config = config.replace(/%(-?\d*)h/g, repl(parsedURL.hostname));
	config = config.replace(/%(-?\d*)H/g, repl(parsedURL.host));
	config = config.replace(/%(-?\d*)f/g, repl(parsedURL.pathname));
	config = config.replace(/%(-?\d*)F/g, repl(parsedURL.path));
	config = config.replace(/%(-?\d*)q/g, repl(parsedURL.search));
	config = config.replace(/%(-?\d*)A/g, repl(parsedURL.href));

	return config;
}

function repl(str) {
	return function(all, sub) {
		if (!str || !sub || sub.length === 0) return str;

		var len = parseInt(sub, 10),
			ret;

		if (len >= str.length) return str;

		if (len < 0) {
			ret = '…' + str.substr(str.length + len);
		} else {
			ret = str.substr(0, len) + '…';
		}

		return ret;
	};
}

function addHeader() {
	var tr = $('<tr>');

	var td1 = $('<td>'),
		td2 = $('<td>');

	td1.append(
		$('<input>')
			.attr('type', 'text')
			.css('height', '16px')
	);

	td2.append(
		$('<input>')
			.attr('type', 'text')
			.css('height', '16px')
	);

	tr.append(td1)
		.append(td2);

	$(this).parent().parent().before(tr);
}

function openBinary() {
	var type = $(this).attr('data-type'),
		filename = path.join(type, type + $(selectors[type].PARENT).attr(selectors[type].ID)),
		val = $(selectors[type].OPEN_SELECT).val();

	filename = path.normalize(path.resolve(filename));

	if (val == 'default') {
		window.openInDefault(filename);
	} else {
		var command = val.replace(/%f/g, filename);
		utils.exec(command);
	}
}

module.exports = exports = {
	createElement: createElement,
	relate: relate,
	createOpenButton: createOpenButton,
	init: init
};