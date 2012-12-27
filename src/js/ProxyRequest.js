var store = require('./store'),
	utils = require('./utils'),
	execute = require('./execute'),
	ProxyResponse = require('./ProxyResponse'),
	http = require('http'),
	https = require('https'),
	view = require('./view'),
	ProxyStatus = require('./ProxyStatus');

var mod = {
	'http:': http,
	'https:': https
};

var ProxyRequest = function(req, res) {
	this.status = ProxyStatus.WAITING;
	this.isPassReady = true;
	this.passCalled = false;

	this.req = req;
	this.res = res;

	if (req.method == 'POST') {
		req.on('end', utils.apply(this, this.passReady));
		this.isPassReady = false;
	}

	this.on('pass', this.pass);
	this.on('drop', this.drop);

	this.id = store.req(req, utils.empty);
};

ProxyRequest.prototype = new (require('events').EventEmitter)();

ProxyRequest.prototype.passReady = function(that) {
	that.isPassReady = true;

	if (that.passCalled) {
		that.pass();
	}
};

ProxyRequest.prototype.pass = function() {
	if (!this.isPassReady) {
		this.passCalled = true;
		return;
	}

	if (this.status == ProxyStatus.DROPPED) {
		return;
	}

	var that = this;

	execute(function(next) {
		store.stream('req/head' + that.id, next);

	}, function(next, err, data) {
		next(null, strToRequests(data));

	}, function(next, err, request) {
		that.request = request;

		store.stream('req/req' + that.id, next);

	}, function(next, err, data) {
		var parsedURL = require('url').parse(that.request.url);

		if (that.request.method == 'POST') {
			that.request.headers['Content-Length'] = data.length;
		}

		that.pReq = mod[parsedURL.protocol].request({
			method: that.request.method,
			host: parsedURL.hostname,
			port: parsedURL.port || 80,
			path: parsedURL.path,
			headers: that.request.headers
		}, utils.noerr(next));

		that.pReq.end(data);

	}, function(next, err, pResponse) {
		var proxyResponse = new ProxyResponse(pResponse, that.res);

		if (!utils.config('basicRule').afterResponses) {
			proxyResponse.emit('pass');
		}
	
		proxyObjects.res[proxyResponse.id] = proxyResponse;

		view.relate(that.id, proxyResponse.id);

		that.status = ProxyStatus.PASSED;

	}, utils.err('Error in creating the request.'));
};

ProxyRequest.prototype.drop = function() {
	if (this.status == ProxyStatus.PASSED) {
		return;
	}

	this.res.end();

	this.status = ProxyStatus.DROPPED;
};

function strToRequests(str) {
	return JSON.parse(str);
}

module.exports = exports = ProxyRequest;