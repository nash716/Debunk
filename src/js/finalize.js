var utils = require('./utils');

module.exports = exports = function() {
	utils.rmdir('res');
	utils.rmdir('req');
};