function isEUCJPText(buffer) {
	var count = 0;//2バイトカウント
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
		//2バイト文字
		if(0xa0 < buffer[i] && buffer[i] < 0xff) {
			if(count != 0) {//二文字目以降
				--count;
			} else {//一文字目
				count = 1;//後ろに2バイト文字が1つ続く
			}
			continue;
		}
		//シングルシフトスリー
		if(buffer[i] == 0x8f) {
			if(count != 0) {//二文字目以降
				return false;
			} else {//一文字目
				count = 2;//後ろに2バイト文字が2つ続く
			}
			continue;
		}
		//どれでもなければ
		return false;
	}
	return true;
}

