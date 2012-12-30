onload = main;

var confKey = {
	port: '#input-port',
	list: '#input-list'
};

function main() {
	window.utils = require('../js/utils');

	$('#save').click(save);
	$('#cancel').click(_close);

	var conf = utils.getAll();

	for (var key in conf) {
		if (conf[key].user === false) continue;

		if (conf[key].type == 'object') {
			// [TODO]
		} else {
			$(confKey[key]).val(conf[key].value);
		}
	}
}

function save() {
	for (var key in confKey) {
		utils.config(key, $(confKey[key]).val());
	}

	_close();
	return false;
}

function _close() {
	require('nw.gui').Window.get().close();
}