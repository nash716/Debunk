module.exports = exports = function(buffer) {
	var surrogate_flag = false;//サロゲートペアか？
	for(var i = 0; i < buffer.length; ++i) {
		//2バイト目のみチェック(1バイト目は任意(0x00 to 0xff))
		if(i % 2 == 1) {
			if(!surrogate_flag) {
				//サロゲートペア1文字目の1バイト目の範囲
				if((buffer[i] & 0xfc) == 0xd8) {
					surrogate_flag = true;
					continue;
				}
				//通常文字の1バイト目の範囲
				if((0x00 <= buffer[i] && buffer[i] < 0xd8) ||
						(0xe0 <= buffer[i] && buffer[i] <= 0xff)) {
					continue;
				}
			} else {
				//サロゲートペア2文字目の1バイト目の範囲
				if((buffer[i] & 0xfc) == 0xdc) {
					surrogate_flag = false;
					continue;
				}
			}
		} else {
			//1バイト目は任意であるが、0は終端文字であるため除いておく
			if(buffer[i] == 0x00) {
				return false;
			}
			continue;
		}
		return false;
	}
	return true;
};

