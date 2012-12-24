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
	port: 8888
};

var config = function(key) {
	return window.localStorage[key] || defaults[key];
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

module.exports = exports = {
	storage: storage,
	config: config,
	err: err,
	rmdir: rmdir,
	noerr: noerr,
	apply: apply,
	empty: function() { }
};