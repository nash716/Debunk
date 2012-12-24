var store = require('./store'),
	utils = require('./utils');

var ProxyResponse = function(pRes, res) {
	this.isPassReady = false;
	this.passCalled = false;

	this.pRes = pRes;
	this.res = res;

	pRes.on('end', utils.apply(this, this.passReady));

	this.on('pass', this.pass);

	this.id = store.res(pRes, utils.empty);

};

ProxyResponse.prototype = new (require('events').EventEmitter)();

ProxyResponse.prototype.passReady = function(that) {
	that.isPassReady = true;

	if (that.passCalled) {
		that.pass();
	}
};

ProxyResponse.prototype.pass = function() {
	if (!this.isPassReady) {
		this.passCalled = true;
		return;
	}

	var that = this;

	store.stream('res/res' + this.id, function(err, data) {
		that.res.writeHead(that.pRes.statusCode, that.pRes.headers);
		that.res.end(data);
	});

};

module.exports = exports = ProxyResponse;