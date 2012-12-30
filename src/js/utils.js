var fs = require('fs'),
	path = require('path');

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
	basicRule: {
		type: 'object',
		value: {
			beforeRequests: false,
			afterResponses: false
		},
		user: false
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
}

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

module.exports = exports = {
	storage: storage,
	config: config,
	getAll: getAllConfig,
	err: err,
	rmdir: rmdir,
	noerr: noerr,
	apply: apply,
	empty: function() { }
};