onload = main;
onresize = resize;

function main() {
	global.proxyRequests = [ ];
	global.proxyResponses = [ ];
	global.$ = window.$;

	mainWin = require('nw.gui').Window.get();

	require('./js/startup')();
	require('./js/view').init();
	require('./js/proxy')();

	native();
	resize();

	mainWin.on('close', function() {
		require('./js/finalize')();
		this.close(true);
	});
}

function resize() {
	$('#list, #fields').css('height', $(window).height() - 45 + 'px');
}