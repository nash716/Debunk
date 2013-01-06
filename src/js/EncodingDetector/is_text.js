module.exports = exports = function(buffer) {
	if(buffer[0] == 0x00) return false;
	return require('./is_ascii_text')(buffer) |
		require('./is_euc-jp_text')(buffer) |
		require('./is_sjis_text')(buffer) |
		require('./is_iso2022jp_text')(buffer) |
		require('./is_utf8_text')(buffer) |
		require('./is_utf16be_text')(buffer) |
		require('./is_utf16le_text')(buffer) |
		require('./is_utf32be_text')(buffer) |
		require('./is_utf32le_text')(buffer);
}