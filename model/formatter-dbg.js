sap.ui.define([], function () {
	"use strict";

	return {
		hideSalesbom: function (sValue, category) {
			if (sValue > 0) {
				if (category === "TAP" || category === "CBTP") {
					return "";
				}
				return sValue;
			} else {
				return "";
			}
		}
	};

});