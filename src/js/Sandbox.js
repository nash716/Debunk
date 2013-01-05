var FileManager = require('./FileManager'),
	ArgumentNames = require('./ArgumentNames'),
	utils = require('./utils'),
	vm = require('vm');

var Sandbox = function(path) {
	this.path = path;
};

Sandbox.prototype.exec = function() {
	var args = Array.prototype.slice.call(arguments);

	var type = args.shift();

	if (!this.script) {
		this.script = vm.createScript(FileManager.syncRead(this.path));
	}

	var context = { console: console };

	for (var i=0; i<ArgumentNames[type].length; i++) {
		context[ArgumentNames[type][i]] = args[i];
	}

	this.script.runInNewContext(context);

	return context.retVal || { };
};

module.exports = exports = Sandbox;