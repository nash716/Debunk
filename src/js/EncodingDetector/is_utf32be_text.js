function isUTF32BEText(buffer) {
	for(var i = 0; i < buffer.length; ++i) {
		switch(i % 4) {
			case 0://1バイト目(群)
				//1バイト目(群)は必ず0
				if(buffer[i] != 0x00) {
					return false;
				}
				break;
			case 1://2バイト目(面)
				//面00から面10まで使用可能
				if(!(0x00 <= buffer[i] && buffer[i] <= 0x0a)) {
					return false;
				}
				break;
			case 2://3バイト目(区)
				//サロゲートペアの範囲は使用しない
				if((buffer[i] & 0xf8) == 0xd8) {
					return false;
				}
				break;
			case 3://4バイト目(点)
				//4バイト目(点)は任意(0x00 to 0xff)
				//但し0は終端文字であるため除いておく
				if(buffer[i] == 0x00) {
					return false;
				}
				break;
		}
	}
	return true;
}

