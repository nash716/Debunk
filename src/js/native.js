/*
MenuBar
	+Rules
		+Basic Rules
			-Before Requests
			-After Responses
		+Customize Rules
			-...
	+Tools
		-Settings
*/

var utils = require('./js/utils');

var native = function() {
	var gui = require('nw.gui');

	var menubar = new gui.Menu({ type: 'menubar' });

	var ruleMenu = new gui.Menu(),
		toolMenu = new gui.Menu();

	(function generateRuleMenu(parent) {
		var basicRules = new gui.Menu(),
			customizeRules = new gui.Menu();

		(function generateBasicRules(parent) {
			var conf = utils.config('basicRule');

			var beforeRequests = new gui.MenuItem({
				label: 'Before Requests',
				type: 'checkbox',
				click: basicRulesClicked,
				checked: conf.beforeRequests
			});
			var afterResponses = new gui.MenuItem({
				label: 'After Responses',
				type: 'checkbox',
				click: basicRulesClicked,
				checked: conf.afterResponses
			});

			parent.append(beforeRequests);
			parent.append(afterResponses);

			function basicRulesClicked() {
				var currentSettings = utils.config('basicRule');
				currentSettings.beforeRequests = beforeRequests.checked;
				currentSettings.afterResponses = afterResponses.checked;
				utils.config('basicRule', currentSettings);
			}

		})(basicRules);

		(function generateCustomizeRules(parent) {
			if (true) {// [TODO] カスタマイズルールがあるかどうかの判定
				var none = new gui.MenuItem({
					label: 'None',
					enabled: false
				});

				parent.append(none);
			}

		})(customizeRules);

		parent.append(new gui.MenuItem({
			label: 'Basic Rules',
			submenu: basicRules
		}));
		parent.append(new gui.MenuItem({
			label: 'Customize Rules',
			submenu: customizeRules
		}));

	})(ruleMenu);

	(function generateToolMenu(parent) {
		var settings = new gui.MenuItem({ // [TODO] 既にウインドウを開いているときはそちらをアクティブに
			label: 'Settings',
			click: settingsClicked
		});

		parent.append(settings);

		function settingsClicked() {
			gui.Window.open('/settings/index.html', {
				resizable: false,
				width: 700,
				height: 450
			});
		}

	})(toolMenu);

	menubar.append(new gui.MenuItem({
		label: 'Rules',
		submenu: ruleMenu
	}));

	menubar.append(new gui.MenuItem({
		label: 'Tools',
		submenu: toolMenu
	}));

	mainWin.menu = menubar;
};
