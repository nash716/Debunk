module.exports = exports = function(buffer) {
	var count = 0;//エスケープシーケンス用のカウント
	var esc_kind = 0;//エスケープシーケンスの2バイト目の種類
	for(var i = 0; i < buffer.length; ++i) {
		//ASCIIの範囲内
		if(count == 0) {
			if(buffer[i] == 0x09 ||
					buffer[i] == 0x0a ||
					buffer[i] == 0x0d ||
					(0x20 <= buffer[i] && buffer[i] < 0x7f)) {
				continue;
			}
		}
		//エスケープシーケンス
		if(count == 0) {//1バイト目
			if(buffer[i] == 0x1b) {
				count = 2;//後ろに2バイト続く
				continue;
			}
		} else if(count == 2) {//2バイト目
			if(buffer[i] == 0x28) {
				--count;
				esc_kind = 0;//エスケープシーケンスの1つ目のパターン
				continue;
			}
			if(buffer[i] == 0x24) {
				--count;
				esc_kind = 1;//エスケープシーケンスの2つ目のパターン
				continue;
			}
		} else if(count == 1) {//3バイト目
			if(esc_kind == 0) {//エスケープシーケンス1つ目のパターンのとき
				if(buffer[i] == 0x42 || buffer[i] == 0x4a) {
					--count;
					continue;
				}
			}
			if(esc_kind == 1) {//エスケープシーケンス2つ目のパターンのとき
				if(buffer[i] == 0x40 || buffer[i] == 0x42) {
					--count;
					continue;
				}
			}
		}
		return false;
	}
	return true;
};

