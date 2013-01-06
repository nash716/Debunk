var http = require('http'),
	utils = require('./utils'),
	view = require('./view'),
	ProxyRequest = require('./ProxyRequest'),
	ExtensionManager = require('./ExtensionManager'),
	ExtensionType = require('./ExtensionType');

module.exports = exports = function() {
	http.createServer(function(req, res) {
		var parsedURL = require('url').parse(req.url);

		var result = executeExtension(req);

		req.headers = result.headers;

		var proxyRequest = new ProxyRequest(req, res);

		if (!utils.config('basicRule').beforeRequests) {
			proxyRequest.emit('pass');
		}

		if (result.cancel) {
			proxyRequest.emit('drop');
		}

		proxyObjects.req[proxyRequest.id] = proxyRequest;

		if (result.display !== false || utils.config('basicRule').beforeRequests || utils.config('basicRule').afterResponses) {
			view.createElement(proxyRequest.id, parsedURL);
		}

	}).listen(utils.config('port'));
};

function executeExtension(request) {
	var result = { };

	result = utils.merge(result, request);

	result = utils.merge(result, ExtensionManager.exec(ExtensionType.ON_REQUEST, request.headers));

	return result;
}