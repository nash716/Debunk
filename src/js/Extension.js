var Sandbox = require('./Sandbox');

var Extension = function(type, path) {
	this.type = type;
	this.path = path;
	this.sandbox = new Sandbox(path);
};

Extension.prototype.exec = function() {
	var args = Array.prototype.slice.call(arguments);

	return this.sandbox.exec.apply(this.sandbox, args);
};

module.exports = exports = Extension;