module.exports = exports = function(buffer) {
	var count = 0;//マルチバイト文字用のカウンタ
	for(var i = 0; i < buffer.length; ++i) {
		//ASCIIの範囲内
		if(buffer[i] == 0x09 ||
				buffer[i] == 0x0a ||
				buffer[i] == 0x0d ||
				(0x20 <= buffer[i] && buffer[i] < 0x7f)) {
			if(count != 0) {//二文字目以降なので
				return false;
			}
			continue;
		}
		if(count == 0) {
			//マルチバイト文字
			if(0xc2 <= buffer[i] && buffer[i] < 0xe0) {
				count = 1;//後ろに1バイト続く
				continue;
			}
			if(0xe0 <= buffer[i] && buffer[i] < 0xf0) {
				count = 2;
				continue;
			}
			if(0xf0 <= buffer[i] && buffer[i] < 0xf8) {
				count = 3;
				continue;
			}
			if(0xf8 <= buffer[i] && buffer[i] < 0xfc) {
				count = 4;
				continue;
			}
			if(0xfc <= buffer[i] && buffer[i] <= 0xfd) {
				count = 5;
				continue;
			}
		} else {//2バイト目以降
			if(0x80 <= buffer[i] && buffer[i] < 0xc0) {
				--count;
				continue;
			}
		}
		return false;
	}
	return true;
};

