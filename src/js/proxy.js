var http = require('http'),
	utils = require('./utils'),
	view = require('./view'),
	ProxyRequest = require('./ProxyRequest');

module.exports = exports = function() {
	http.createServer(function(req, res) {
		var parsedURL = require('url').parse(req.url);

		var proxyRequest = new ProxyRequest(req, res);

		if (!utils.config('basicRule').beforeRequests) {
			proxyRequest.emit('pass');
		}

		proxyRequests[proxyRequest.id] = proxyRequest;

		view.createElement(proxyRequest.id, parsedURL);

	}).listen(utils.config('port'));
};