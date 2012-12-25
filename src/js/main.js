onload = main;

function main() {
	global.proxyRequests = [ ];
	global.proxyResponses = [ ];
	global.$ = window.$;

	mainWin = require('nw.gui').Window.get();

	require('./js/startup')();
	require('./js/view').init();
	require('./js/proxy')();

	native();

	mainWin.on('close', function() {
		require('./js/finalize')();
		this.close(true);
	});
}
