/*
MenuBar
	+Rules
		+Basic Rules
			-Before Requests
			-After Responses
		+Customize Rules
			-...

*/

var utils = require('./js/utils');
// まだハリボテ
var native = function() {
	var gui = require('nw.gui');

	var menubar = new gui.Menu({ type: 'menubar' });

	var ruleMenu = new gui.Menu();

	(function generateRuleMenu(parent) {
		var basicRules = new gui.Menu(),
			customizeRules = new gui.Menu();

		(function generateBasicRules(parent) {
			var beforeRequests = new gui.MenuItem({
				label: 'Before Requests',
				type: 'checkbox',
				click: basicRulesClicked
			});
			var afterResponses = new gui.MenuItem({
				label: 'After Responses',
				type: 'checkbox',
				click: basicRulesClicked
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

	menubar.append(new gui.MenuItem({
		label: 'Rules',
		submenu: ruleMenu
	}));

	mainWin.menu = menubar;
};
