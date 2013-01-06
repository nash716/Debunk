function isSJISText(buffer) {
	var count = 0;//2バイトカウント
	for(var i = 0; i < buffer.length; ++i) {
		//一文字目
		if(count == 0) {
			if((0x80 < buffer[i] && buffer[i] <= 0x9f) ||
					(0xe0 <= buffer[i] && buffer[i] <= 0xef)) {
				count = 1;//後ろに1文字続く
				continue;
			}
		} else {//二文字目
			if((0x40 <= buffer[i] && buffer[i] < 0x7f) ||
					(0x80 <= buffer[i] && buffer[i] <= 0xfc)) {
				--count;
				continue;
			}
		}
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
		//半角カナの範囲内
		if((0x81 <= buffer[i] && buffer[i] <= 0x9f) ||
				(0xe0 <= buffer[i] && buffer[i] <= 0xef)) {
			if(count != 0) {//二文字目以降なので
				return false;
			}
			continue;
		}
		return false;
	}
	return true;
}

