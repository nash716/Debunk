var selectors = require('./selectors'),
	utils = require('./utils'),
	view = require('./view');

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
				$('<select>').attr('id', selectors.req.OPEN_SELECT.substr(1))
			)
			.append(
				$('<button>')
					.addClass('btn')
					.text('開く')
					.attr('data-type', 'req')
					.attr('id', selectors.req.OPEN_BUTTON.substr(1))
			),
		addHeaderButton: $('<tr>').append(
			$('<td>')
				.attr('colspan', '2')
				.css('text-align', 'center')
				.append(
					$('<button>')
						.addClass('btn')
						.attr('id', selectors.req.ADD_HEADER.substr(1))
						.text('+')
				)
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
				$('<select>').attr('id', selectors.res.OPEN_SELECT.substr(1))
			)
			.append(
				$('<button>')
					.addClass('btn')
					.text('開く')
					.attr('data-type', 'res')
					.attr('id', selectors.res.OPEN_BUTTON.substr(1))
			),
		addHeaderButton: $('<tr>')
			.append(
				$('<td>')
					.attr('colspan', '2')
					.css('text-align', 'center')
					.append(
						$('<button>')
							.addClass('btn')
							.attr('id', selectors.res.ADD_HEADER.substr(1))
							.text('+')
					)
			)
	}
};