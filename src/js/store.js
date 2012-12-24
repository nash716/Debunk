var utils = require('./utils'),
	FileManager = require('./FileManager'),
	reqCounts = 0,
	resCounts = 0;

function range(num, a, b) {
	if (num >= a && num <= b) return true;
	return false;
}

function exchange(str, pos, char) {
	return str.substr(0, pos - 1) + char + str.substr(pos);
}

function createReqHeaderString(req) {
	var ret = { };

	ret.method = req.method;
	ret.url = req.url;
	ret.httpVersion = req.httpVersion;
	ret.headers = fixKey(req.headers);

	return JSON.stringify(ret);
}

function createResHeaderString(res) {
	var ret = { };

	ret.httpVersion = res.httpVersion;
	ret.statusCode = res.statusCode;
	ret.headers = fixKey(res.headers);

	return JSON.stringify(ret);
}

function reqStore(arg1, arg2, arg3) {
	if (typeof arg1 != 'number') { // arg1: request, arg2: function
		FileManager.pipeWrite('req/req' + (++reqCounts), arg1, null, arg2);

		FileManager.write('req/head' + reqCounts, utils.err('couldn\'t write request ' + reqCounts + '\'s header.'), createReqHeaderString(arg1));

		return reqCounts;
	} else { // arg1: id, arg[2-3]: function
		FileManager.read('req/req' + arg1, arg2);
		FileManager.read('req/head' + arg1, arg3);
	}
}

function resStore(arg1, arg2, arg3) {
	if (typeof arg1 != 'number') { // arg1: response, arg2: function
		FileManager.pipeWrite('res/res' + (++resCounts), arg1, null, arg2);

		FileManager.write('res/head' + resCounts, utils.err('couldn\'t write response ' + resCounts + '\'s header.'), createResHeaderString(arg1));

		return resCounts;
	} else { // arg1: id, arg[2-3]: function
		FileManager.read('res/res' + arg1, arg2);
		FileManager.read('res/head' + arg1, arg3);
	}
}

// [TODO] headerNames オブジェクトを使った方式へ変更
/* 
object -> string
ex)
	{ 'accept-charset': hogehoge, 'content-type': hogehoge } ->
	Accept-Charset: hogehoge
	Content-Type: hogehoge
*/
function fixKey(obj) {
	var ret = { };

	for (var key in obj) {
		var newKey = '';

		if (range(key.charCodeAt(0), 97, 122)) {
			newKey += String.fromCharCode(key.charCodeAt(0) - 32);
		}

		for (var i=1; i<key.length; i++) {
			if (key.charAt(i - 1) == '-' && range(key.charCodeAt(i), 97, 122)) {
				newKey += String.fromCharCode(key.charCodeAt(i) - 32);
			} else {
				newKey += key.charAt(i);
			}
		}

		ret[newKey] = obj[key];
	}

	return ret;
}

function streamStore(arg1, arg2, arg3) {
	if (typeof arg2 == 'function') { // read, arg1: filePath, arg2: callback
		streamRead(arg1, arg2);
	} else {
		streamWrite(arg1, arg2, arg3);
	}
}
// [TODO] ここらへん汚い
function streamRead(path, callback) {
	FileManager.read(path, callback);
}

function streamWrite(path, data, callback) { 
	FileManager.write(path, callback, data);
}

module.exports = exports = {
	req: reqStore,
	res: resStore,
	stream: streamStore
};