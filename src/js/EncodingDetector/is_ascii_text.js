module.exports = exports = function(buffer) {
	for(var i = 0; i < buffer.length; ++i) {
		if(buffer[i] != 0x09 &&
			buffer[i] != 0x0a &&
			buffer[i] != 0x0d &&
			(buffer[i] < 0x20 || 0x7f <= buffer[i])) {
			return false;
		}
	}
	return true;
};
