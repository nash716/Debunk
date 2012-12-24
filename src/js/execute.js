// async.waterfall 的なもの
function execute() {
	var funcs = Array.prototype.slice.call(arguments),
		last = funcs.pop();

	function wrap() {
		var args = Array.prototype.slice.call(arguments);

		if (funcs.length !== 0) {
			args.unshift(wrap);
		} else {
			args.unshift(null);
			last.apply(null, args);
			return;
		}
		
		try {
			funcs.shift().apply(null, args);
		} catch(e) {
			last(e);
		}
	}
	
	wrap();
}

module.exports = exports = execute;
