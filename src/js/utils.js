var fs = require('fs'),
	path = require('path'),
	child_process = require('child_process');

var storage = function(key, value) {
	if (value) {
		window.localStorage[key] = value;
	} else {
		return window.localStorage[key];
	}
};

var defaults = {
	port: {
		type: 'number',
		value: 8888,
		user: true
	},
	reqDisplay: {
		type: 'string',
		value: 'raw',
		user: false
	},
	resDisplay: {
		type: 'string',
		value: 'raw',
		user: false
	},
	basicRule: {
		type: 'object',
		value: {
			beforeRequests: false,
			afterResponses: false
		},
		user: false
	},
	list: {
		type: 'string',
		value: '%50f<br /><span style="color: gray; font-size: small;">Host: %H</span>',
		user: true
	},
	contentLength: {
		type: 'number',
		value: 1024 * 1024,
		user: true
	},
	editors: {
		type: 'array',
		value: [
			{
				name: '既定',
				value: 'default' // 仮
			}
		],
		user: true
	}
};

var config = function(key, value) {
	if (value !== undefined) {
		saveConfig(key, value);
	} else {
		return getConfig(key);
	}
};

var saveConfig = function(key, value) {
	switch(defaults[key].type) {
	case 'number':
		value = '' + value;
		break;
	case 'boolean':
		value = value === true ? 'true' : 'false';
		break;
	case 'object':
		value = JSON.stringify(value);
		break;
	case 'string':
		value = value.toString();
		break;
	case 'array':
		value = JSON.stringify({
			array: value
		});
		break;
	default:
		break;
	}

	window.localStorage[key] = value;
};

var getConfig = function(key) {
	var val = window.localStorage[key];

	if (val) {
		switch(defaults[key].type) {
		case 'number':
			val = parseInt(val, 10);
			break;
		case 'boolean':
			val = val == 'true' ? true : false;
			break;
		case 'object':
			val = JSON.parse(val);
			break;
		case 'string':
			val = val.toString();
			break;
		case 'array':
			val = JSON.parse(val).array;
			break;
		default:
			break;
		}
	} else {
		val = defaults[key].value;
	}

	return val;
};

var getAllConfig = function() {
	var ret = { };

	for (var key in defaults) {
		ret[key] = defaults[key];
		ret[key].value = getConfig(key);
	}

	return ret;
};

var err = function(str) {
	return function(err) {
		if (err) {
			throw { message: err };
		}
	};
};

var rmdir = function(dirPath) {
	var list = fs.readdirSync(dirPath);

	for (var i=0; i<list.length; i++) {
		var filename = path.join(dirPath, list[i]);
		var stat = fs.statSync(filename);
		
		if (!(filename == '.' || filename == '..')) {
			fs.unlinkSync(filename);
		}
	}
	fs.rmdirSync(dirPath);
};

var noerr = function(next) {
	return function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift(null);
		next.apply(null, args);
	};
};

var apply = function(_this, _function) {
	return function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift(_this);
		_function.apply(null, args);
	};
};

var merge = function() {
	var l = arguments.length;
	var ret = { };
	
	for (var i=0; i<l; i++) {
		for (var key in arguments[i]) {
			ret[key] = arguments[i][key];
		}
	}
	return ret;
};

var exec = function(command) {
	child_process.exec(command);
};

module.exports = exports = {
	storage: storage,
	config: config,
	getAll: getAllConfig,
	err: err,
	rmdir: rmdir,
	noerr: noerr,
	apply: apply,
	empty: function() { },
	merge: merge,
	exec: exec
};