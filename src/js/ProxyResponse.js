var store = require('./store'),
	utils = require('./utils'),
	ProxyStatus = require('./ProxyStatus');

var ProxyResponse = function(pRes, res) {
	this.status = ProxyStatus.WAITING;
	this.isPassReady = false;
	this.passCalled = false;

	this.pRes = pRes;
	this.res = res;

	pRes.on('end', utils.apply(this, this.passReady));

	this.on('pass', this.pass);
	this.on('drop', this.drop);

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

	if (this.status == ProxyStatus.DROPPED) {
		return;
	}

	var that = this;

	store.stream('res/res' + this.id, function(err, data) {
		that.res.writeHead(that.pRes.statusCode, that.pRes.headers);
		that.res.end(data);
	});

};

ProxyResponse.prototype.drop = function() {
	if (this.status == ProxyStatus.PASSED) {
		return;
	}

	this.res.end();

	this.status = ProxyStatus.DROPPED;
};

module.exports = exports = ProxyResponse;