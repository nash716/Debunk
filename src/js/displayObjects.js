var selectors = require('./selectors'),
	utils = require('./utils');

function createTable(title1, title2) {
	var table = $('<table>').addClass('table table-condensed');

		var thead = $('<thead>'),
			tbody = $('<tbody>');

			var tr = $('<tr>');

				var th1 = $('<th>').text(title1)
					.css('text-align', 'center');
				var th2 = $('<th>').text(title2)
					.css('text-align', 'center');

			tr.append(th1)
				.append(th2);

		thead.append(tr);

	table.append(thead)
		.append(tbody);

	return table;
}

function openOptions() {
	var editors = utils.config('editors'),
		ret = [ ];

	for (var i=0; i<editors.length; i++) {
		ret.push($('<option>').text(editors[i].name).val(editors[i].value));
	}

	return ret;
}

module.exports = exports = {
	req: {
		raw: $('<div>').attr('id', selectors.req.INNER.substr(1)) // '#hoge' を 'hoge' に
			.append($('<span>').text('Headers:'))
			.append($('<br />'))
			.append($('<textarea>').attr('id', selectors.req.HEADERS.substr(1)))
			.append($('<br />'))
			.append($('<span>').text('Body:'))
			.append($('<br />'))
			.append($('<textarea>').attr('id', selectors.req.BODY.substr(1))),
		table: $('<div>').attr('id', selectors.req.INNER.substr(1))
			.append($('<span>').text('Headers:'))
			.append(createTable().attr('id', selectors.req.HEADERS.substr(1)))
			.append($('<span>').text('Body:'))
			.append($('<br />'))
			.append($('<textarea>').attr('id', selectors.req.BODY.substr(1))),
		openButton: $('<div>').attr('id', selectors.req.BODY.substr(1))
			.append('<span>').text('バイナリファイルのようです。どうしますか？')
			.append($('<br />'))
			.append(
				$('<select>').attr('id', selectors.req.OPEN_SELECT)
					.append(openOptions())
			)
	},
	res: {
		raw: $('<div>').attr('id', selectors.res.INNER.substr(1))
			.append($('<span>').text('Headers:'))
			.append($('<br />'))
			.append($('<textarea>').attr('id', selectors.res.HEADERS.substr(1)))
			.append($('<br />'))
			.append($('<span>').text('Body:'))
			.append($('<br />'))
			.append($('<textarea>').attr('id', selectors.res.BODY.substr(1))),
		table: $('<div>').attr('id', selectors.res.INNER.substr(1))
			.append($('<span>').text('Headers:'))
			.append(createTable().attr('id', selectors.res.HEADERS.substr(1)))
			.append($('<span>').text('Body:'))
			.append($('<br />'))
			.append($('<textarea>').attr('id', selectors.res.BODY.substr(1))),
		openButton: $('<div>').attr('id', selectors.req.BODY.substr(1))
			.append('<span>').text('バイナリファイルのようです。どうしますか？')
			.append($('<br />'))
			.append(
				$('<select>').attr('id', selectors.res.OPEN_SELECT)
					.append(openOptions())
			)
	}
};