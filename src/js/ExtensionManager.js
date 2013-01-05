var ExtensionType = require('./ExtensionType'),
	utils = require('./utils'),
	Extension = require('./Extension'),
	fs = require('fs'),
	path = require('path');

var ExtensionManager = {
	extensions: { }
};

ExtensionManager.exec = function() {
	var ret = { },
		args = Array.prototype.slice.call(arguments);

	var type = args[0];

	for (var i=0; i<this[type].length; i++) {
		ret = utils.merge(ret, this[type][i].exec.apply(this[type][i], args))
	}

	return ret;
};

for (var key in ExtensionType) {
	var type = ExtensionType[key];

	ExtensionManager[type] = [ ];

	var list = fs.readdirSync(type);

	for (var i=0; i<list.length; i++) {
		var filename = path.join(type, list[i]);
		
		if (!(filename == '.' || filename == '..') && filename.indexOf('.js') === filename.length - 3) {
			ExtensionManager[type].push(new Extension(type, filename));
		}
	}
}

module.exports = exports = ExtensionManager;