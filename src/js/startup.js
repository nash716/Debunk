var fs = require('fs'),
	utils = require('./utils');

module.exports = exports = function() {
	$('#list, #fields').css('height', $(window).height() - 45 + 'px');

	try {
		fs.mkdirSync('res');
		fs.mkdirSync('req');
	} catch(e) { // ちゃんとアプリケーションが閉じられなかった系なにか
		require('./finalize')();
		fs.mkdirSync('res');
		fs.mkdirSync('req'); // [TODO] 記述が一回で済むように
	}

	process.on('uncaughtException', function(err) {
		for (var key in err) {
			console.log(key + ': ' + err[key]);
		}
	});
};