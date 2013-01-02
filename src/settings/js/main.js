onload = main;

var confKey = {
	port: '#input-port',
	list: '#input-list',
	editors: {
		wrapper: '#input-editors',
		domClass: '.input-editor',
		toString: function(obj) {
			return obj.name + ':' + obj.value;
		},
		toObject: function(str) {
			var arr = str.split(':');

			return {
				name: arr[0],
				value: arr[1]
			};
		}
	}
};

function main() {
	window.utils = require('../js/utils');
	window.conf = utils.getAll();

	$('#save').click(save);
	$('#cancel').click(_close);

	for (var key in conf) {
		if (conf[key].user === false) continue;

		if (conf[key].type == 'object') {
			// [TODO]
		} else if (conf[key].type == 'array') {
			for (var i=1; i<conf[key].value.length; i++) {
				var div = controlsDiv(),
					input = $('<input>').attr('type', 'text').addClass(confKey[key].domClass.substr(1)).val(confKey[key].toString(conf[key].value[i]));

				div.append(input);

				$(confKey[key].wrapper).append(div);
			}

			var buttonDiv = controlsDiv(),
				button = $('<a>').addClass('btn').text('+').click(function() {
					var div = controlsDiv(),
						input = $('<input>').attr('type', 'text').addClass(confKey[key].domClass.substr(1));

					div.append(input);

					$(this).parent().before(div);
				});

			buttonDiv.append(button)

			$(confKey[key].wrapper).append(buttonDiv);
		} else {
			$(confKey[key]).val(conf[key].value);
		}
	}
}

function controlsDiv() {
	return $('<div>').addClass('controls').css('margin-top', '5px');
}

function save() {
	for (var key in confKey) {
		if (conf[key].type == 'array') {
			var value = [ conf[key].value[0] ];

			$(confKey[key].domClass).each(function() {
				value.push(confKey[key].toObject($(this).val()));
			});

			utils.config(key, value);
		} else {
			utils.config(key, $(confKey[key]).val());
		}
	}

	_close();
	return false;
}

function _close() {
	require('nw.gui').Window.get().close();
}