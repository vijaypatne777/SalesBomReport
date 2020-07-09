/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/salesbom/culligan/salesbomdisplay/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});