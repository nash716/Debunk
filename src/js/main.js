onload = main;
onresize = resize;

function main() {
	global.proxyObjects = {
		req: [ ],
		res: [ ]
	};
	global.$ = window.$;

	mainWin = require('nw.gui').Window.get();

	var finalize = require('./js/finalize');

	require('./js/startup')();
	require('./js/view').init();
	require('./js/proxy')();

	native();
	resize();

	mainWin.on('close', function() {
		finalize();
		this.close(true);
	});
}

function resize() {
	$('#list, #fields').css('height', $(window).height() - 45 + 'px');
}