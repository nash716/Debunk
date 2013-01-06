module.exports = exports = function(buffer) {
	if(buffer[0] == 0x00) return false;
	return isAsciiText(buffer) |
		isEUCJPText(buffer) |
		isSJISText(buffer) |
		isISO2022JPText(buffer) |
		isUTF8Text(buffer) |
		isUTF16BEText(buffer) |
		isUTF16LEText(buffer) |
		isUTF32BEText(buffer) |
		isUTF32LEText(buffer);
}