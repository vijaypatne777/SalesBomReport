sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/library",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast"
], function (Controller, UIComponent, mobileLibrary, Spreadsheet, MessageToast) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return Controller.extend("com.salesbom.culligan.salesbomdisplay.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function () {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},
		onExcelDownload: function (o) {
			var aCols, aProducts, oSettings, oSheet;

			aCols = o.createColumnConfig();
			aProducts = o.getView().getModel("OPM").getProperty("/");
			var a = new Date();
			oSettings = {
				workbook: {
					columns: aCols

				},
				dataSource: aProducts,
				showProgress: false,
				fileName: "Bill Of Material Report_" + a.getUTCDate() + "-" + (a.getUTCMonth() + 1) + "-" + a.getUTCFullYear()
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then(function () {
					MessageToast.show("Excel export has finished");
				})
				.finally(function () {
					oSheet.destroy();
				});
		},
		createColumnConfig: function () {
			return [{
				label: "Header Material",
				property: "mat",
				type: sap.ui.export.EdmType.Number
			}, {
				label: "Father Standard Cost",
				property: "msp",
				type: sap.ui.export.EdmType.Number,
				delimiter: true,
				scale: 3
			}, {
				label: "Level",
				property: "lvl",
				type: sap.ui.export.EdmType.Number
			}, {
				label: "Is Assembly",
				property: "asm"

			}, {
				label: "BOM Usage",
				property: "usg",
				type: sap.ui.export.EdmType.Number
			}, {
				label: "BOM Item No",
				property: "itm",
				type: sap.ui.export.EdmType.Number
			}, {
				label: "BOM Component",
				property: "bom",
				type: sap.ui.export.EdmType.Number
			}, {
				label: "Component Description",
				property: "des"

			}, {
				label: "BOM Quantity",
				property: "qty",
				type: sap.ui.export.EdmType.Number
			}, {
				label: "Component Standard Cost",
				property: "stc",
				type: sap.ui.export.EdmType.Number,
				delimiter: true,
				scale: 3
			}, {
				label: "per Unit Standard Cost",
				property: "psc",
				type: sap.ui.export.EdmType.Number,
				delimiter: true,
				scale: 3
			}, {
				label: "Total Standard Cost",
				property: "tsc",
				type: sap.ui.export.EdmType.Number,
				delimiter: true,
				scale: 3
			}];
		},
		onSalesExcelDownload: function (p) {
			var aCols, aProducts, oSettings, oSheet;

			aCols = p.salescreateColumnConfig();
			aProducts = p.getView().getModel("XLSX").getProperty("/");
			var a = new Date();
			oSettings = {
				workbook: {
					columns: aCols

				},
				dataSource: aProducts,
				showProgress: false,
				fileName: "Sales Order BOM Report_" + a.getUTCDate() + "-" + (a.getUTCMonth() + 1) + "-" + a.getUTCFullYear()
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then(function () {
					MessageToast.show("Excel export has finished");
				})
				.finally(function () {
					oSheet.destroy();
				});
		},
		salescreateColumnConfig: function () {
			return [{
				label: "Sales Order",
				property: "SalesOrder",
				type: sap.ui.export.EdmType.Number
			}, {
				label: "Sales Order Line Item",
				property: "SalesOrderItem",
				type: sap.ui.export.EdmType.Number
			}, {
				label: "Material",
				property: "Material"

			}, {
				label: "Category",
				property: "SalesOrderItemCategory"

			}, {
				label: "Plant",
				property: "ProductionPlant"

			}, {
				label: "Material Description",
				property: "SalesOrderItemText"

			},{
				label: "Customer Material Description",
				property: "MaterialByCustomer"

			}, {
				label: "Quantity",
				property: "RequestedQuantity",
				type: sap.ui.export.EdmType.Number
			}, {
				label: "Standard Cost",
				property: "StandardCost",
				type: sap.ui.export.EdmType.Number,
				delimiter: true,
				scale: 3
			}, {
				label: "Calculated Standard Cost",
				property: "CalculatedStdCost",
				type: sap.ui.export.EdmType.Number,
				delimiter: true,
				scale: 3
			}];
		},
		/**
		 * Adds a history entry in the FLP page history
		 * @public
		 * @param {object} oEntry An entry object to add to the hierachy array as expected from the ShellUIService.setHierarchy method
		 * @param {boolean} bReset If true resets the history before the new entry is added
		 */
		addHistoryEntry: (function () {
			var aHistoryEntries = [];

			return function (oEntry, bReset) {
				if (bReset) {
					aHistoryEntries = [];
				}

				var bInHistory = aHistoryEntries.some(function (oHistoryEntry) {
					return oHistoryEntry.intent === oEntry.intent;
				});

				if (!bInHistory) {
					aHistoryEntries.push(oEntry);
					this.getOwnerComponent().getService("ShellUIService").then(function (oService) {
						oService.setHierarchy(aHistoryEntries);
					});
				}
			};
		})()

	});

});