sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, Jm, formatter, Filter, FilterOperator) {
	"use strict";
	var oBusyDialog = new sap.m.BusyDialog();
	var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
		maxFractionDigits: 3,
		decimalSeparator: ",",
		groupingEnabled: true
	});
	return BaseController.extend("com.salesbom.culligan.salesbomdisplay.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		// onInit : function () {
		// 	var oViewModel,
		// 		iOriginalBusyDelay,
		// 		oTable = this.byId("table");

		// 	// Put down worklist table's original value for busy indicator delay,
		// 	// so it can be restored later on. Busy handling on the table is
		// 	// taken care of by the table itself.
		// 	iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
		// 	// keeps the search state
		// 	this._aTableSearchState = [];

		// 	// Model used to manipulate control states
		// 	oViewModel = new JSONModel({
		// 		worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
		// 		saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
		// 		shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
		// 		shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
		// 		shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
		// 		tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
		// 		tableBusyDelay : 0
		// 	});
		// 	this.setModel(oViewModel, "worklistView");

		// 	// Make sure, busy indication is showing immediately so there is no
		// 	// break after the busy indication for loading the view's meta data is
		// 	// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
		// 	oTable.attachEventOnce("updateFinished", function(){
		// 		// Restore original busy indicator delay for worklist's table
		// 		oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
		// 	});
		// 	// Add the worklist page to the flp routing history
		// 	this.addHistoryEntry({
		// 		title: this.getResourceBundle().getText("worklistViewTitle"),
		// 		icon: "sap-icon://table-view",
		// 		intent: "#SalesBOMDisplay-display"
		// 	}, true);
		// },

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		// onUpdateFinished : function (oEvent) {
		// 	// update the worklist's object counter after the table update
		// 	var sTitle,
		// 		oTable = oEvent.getSource(),
		// 		iTotalItems = oEvent.getParameter("total");
		// 	// only update the counter if the length is final and
		// 	// the table is not empty
		// 	if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
		// 		sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
		// 	} else {
		// 		sTitle = this.getResourceBundle().getText("worklistTableTitle");
		// 	}
		// 	this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		// },

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		// onPress : function (oEvent) {
		// 	// The source is the list item that got pressed
		// 	this._showObject(oEvent.getSource());
		// },

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		// onShareInJamPress : function () {
		// 	var oViewModel = this.getModel("worklistView"),
		// 		oShareDialog = sap.ui.getCore().createComponent({
		// 			name: "sap.collaboration.components.fiori.sharing.dialog",
		// 			settings: {
		// 				object:{
		// 					id: location.href,
		// 					share: oViewModel.getProperty("/shareOnJamTitle")
		// 				}
		// 			}
		// 		});
		// 	oShareDialog.open();
		// },

		// onSearch : function (oEvent) {
		// 	if (oEvent.getParameters().refreshButtonPressed) {
		// 		// Search field's 'refresh' button has been pressed.
		// 		// This is visible if you select any master list item.
		// 		// In this case no new search is triggered, we only
		// 		// refresh the list binding.
		// 		this.onRefresh();
		// 	} else {
		// 		var aTableSearchState = [];
		// 		var sQuery = oEvent.getParameter("query");

		// 		if (sQuery && sQuery.length > 0) {
		// 			aTableSearchState = [new Filter("AlternativeItemGroup", FilterOperator.Contains, sQuery)];
		// 		}
		// 		this._applySearch(aTableSearchState);
		// 	}

		// },

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		// onRefresh : function () {
		// 	var oTable = this.byId("table");
		// 	oTable.getBinding("items").refresh();
		// },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		// _showObject : function (oItem) {
		// 	this.getRouter().navTo("object", {
		// 		objectId: oItem.getBindingContext().getProperty("BillOfMaterial")
		// 	});
		// },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		// _applySearch: function(aTableSearchState) {
		// 	var oTable = this.byId("table"),
		// 		oViewModel = this.getModel("worklistView");
		// 	oTable.getBinding("items").filter(aTableSearchState, "Application");
		// 	// changes the noDataText of the list in case there are no filter results
		// 	if (aTableSearchState.length !== 0) {
		// 		oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
		// 	}
		// }
		onInit: function () {
			var f = new Jm({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle")
			});
			this.getView().setModel(f, "worklistView");
			var s = new Jm({
				salesTableTitle: this.getResourceBundle().getText("salesTableTitle")
			});
			this.getView().setModel(s, "salesView");
		},
		matonDataExport: function () {
			this.onExcelDownload(this);
		},
		onSalesFinished: function (u) {
			var t, a = u.getSource(),
				i = u.getParameter("total");
			if (i && a.getBinding("items").isLengthFinal()) {
				t = this.getResourceBundle().getText("salesTableTitleCount", [i]);
			} else {
				t = this.getResourceBundle().getText("salesTableTitle");
			}
			this.getView().getModel("salesView").setProperty("/salesTableTitle", t);
		},
		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");
				if (sQuery && sQuery.length > 0) {
					var contains = sap.ui.model.FilterOperator.Contains;
					aTableSearchState = [new sap.ui.model.Filter([
						new sap.ui.model.Filter("bom", contains, sQuery)
					], false)];
				}
				this._applySearch(aTableSearchState);
			}

		},
		_applySearch: function (aTableSearchState) {
			var oTable = this.getView().byId("mattab");
			// oViewModel = this.getView().getModel("BRF");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			// if (aTableSearchState.length !== 0) {
			// 	oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			// }
		},
		onRefresh: function () {
			var oTable = this.getView().byId("mattab");
			oTable.getBinding("items").refresh();
		},
		onClear: function () {
			var oFilterBar = this.getView().byId("matbtnId");
			var oItems = oFilterBar.getAllFilterItems(true);
			oFilterBar.determineControlByFilterItem(oItems[0]).setValue("");
			oFilterBar.determineControlByFilterItem(oItems[1]).setValue("");
		},
		onUpdateFinished: function (e) {
			var t, a = e.getSource(),
				i = e.getParameter("total");
			if (i && a.getBinding("items").isLengthFinal()) {
				t = this.getResourceBundle().getText("worklistTableTitleCount", [i]);
			} else {
				t = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getView().getModel("worklistView").setProperty("/worklistTableTitle", t);

		},
		onLiveChange: function (oEvent) {
			var oPlant = oEvent.getSource().getValue();
			this.getView().byId("matidPlant").setValue(oPlant.toUpperCase());
		},
		matonGo: function () {
			oBusyDialog.open();
			var that = this;
			sap.m.MessageBox.show(
				" Do you want to proceed?.", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Search BOM",
					actions: ["OK", "Cancel"],
					onClose: function (oAction) {
						if (oAction === "OK") {
							that.onBOMSearch();
						}
						if (oAction === "Cancel") {
							oBusyDialog.close();

						}
					},
					initialFocus: "OK"
				}
			);
		},
		onBOMSearch: function () {
			var oMateriaNo = this.getView().byId("matmultiInput").getValue();
			var oPlant = this.getView().byId("matidPlant").getValue().toString();
			if (oMateriaNo.length === 0 || oPlant.length === 0) {
				sap.m.MessageBox.warning("Please enter all mandatory fields.");
				oBusyDialog.close();
			} else {
				this.connectServer();
			}
		},
		connectServer: function () {
			var ocModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(ocModel, "BRF");
			var j = 0,
				asc = [],
				q = false,
				g,
				cg,
				alt = [],
				p = true,
				rcdidx = 0,
				arr = [],
				d = [],
				zFilter = [],
				costFilter = [],
				cc = [],
				count = 0;
			var materialX = [this.getView().byId("matmultiInput").getValue()];
			var oPlant = this.getView().byId("matidPlant").getValue().toString();
			var spMod = this.getView().getModel("modelA");
			var strike = this.getView().getModel();
			$.sap.brk = strike;
			var that = this;
			var oFunc = function (far, cry, cost) {
				for (var i = 0; i < cry.length; i++) {
					d.push(new sap.ui.model.Filter({
						filters: [
							new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, cry[i]),
							new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, oPlant)
						],
						and: true
					}));
				}
				zFilter.push(new sap.ui.model.Filter({
					filters: d,
					and: false
				}));
				for (i = 0; i < cost.length; i++) {
					cc.push(new sap.ui.model.Filter({
						filters: [
							new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, cost[i]),
							new sap.ui.model.Filter("ValuationArea", sap.ui.model.FilterOperator.EQ, oPlant)
						],
						and: true
					}));
				}
				costFilter.push(new sap.ui.model.Filter({
					filters: cc,
					and: false
				}));
				var pfunc = function (z) {
						return new Promise(
							function (resolve, reject) {
								if (cry.length === 0) {
									resolve("");
								} else {
									far.read(z, {
										filters: zFilter,
										urlParameters: {
											"$select": "BillOfMaterialComponent,IsAssembly,Material,BillOfMaterialItemNumber,ComponentDescription,BillOfMaterialItemQuantity",
											"$orderby": "BillOfMaterialItemNumber"
										},
										async: false,
										success: function (x) {
											if (x.results.length === 0) {
												oBusyDialog.close();
												that.getView().byId("matidBOM").setValue("");
												that.getView().byId("matidSC").setValue("");
												sap.m.MessageToast.show("No Records Found");
												return;
											}
											resolve(x);
										},
										error: function (y) {
											reject(y);
										}
									});
								}
							});
					},
					qfunc = function (zz) {
						return new Promise(function (resolve, reject) {
							if (cry.length === 0) {
								resolve("");
							} else {
								far.read(zz, {
									filters: zFilter,
									urlParameters: {
										"$select": "BillOfMaterialVariantUsage,Material"
									},
									async: false,
									success: function (foo) {
										resolve(foo);
									},
									error: function (bar) {
										reject(bar);
									}
								});
							}
						});

					},
					rfunc = function (zzz) {
						return new Promise(function (resolve, reject) {
							spMod.read(zzz, {
								filters: costFilter,
								urlParameters: {
									"$select": "StandardPrice,Product,ValuationArea,PriceUnitQty"
								},
								async: false,
								success: function (are) {
									resolve(are);
								},
								error: function (you) {
									reject(you);
								}
							});
						});

					};
				Promise.all([pfunc("/MaterialBOMItem"), qfunc("/MaterialBOM"), rfunc("/A_ProductValuation")]).then(function (x) {
					if (x[0] === "" && x[1] === "") {
						for (i = 0; i < x[2].results.length; i++) {
							asc.push(x[2].results[i]);
						}
						for (i = 0; i < alt.length; i++) {
							for (var b = 0; b < asc.length; b++) {
								if (alt[i].bom === asc[b].Product) {
									alt[i].stc = asc[b].StandardPrice;
									alt[i].psc = parseFloat(asc[b].StandardPrice / asc[b].PriceUnitQty).toFixed(2);
									alt[i].tsc = parseFloat(alt[i].qty * (asc[b].StandardPrice / asc[b].PriceUnitQty)).toFixed(3);
								}
							}
						}
						var ice = JSON.parse(JSON.stringify(alt));
						ice[0].msp = oNumberFormat.format($.sap.spc);
						for (i = 0; i < ice.length; i++) {
							ice[i].stc = oNumberFormat.format(ice[i].stc);
							ice[i].psc = oNumberFormat.format(ice[i].psc);
							ice[i].tsc = oNumberFormat.format(ice[i].tsc);
						}
						var xmod = new sap.ui.model.json.JSONModel();
						xmod.setSizeLimit(ice.length);
						xmod.setData(ice);
						that.getView().setModel(xmod, "OPM");
						oBusyDialog.close();
						ocModel = new sap.ui.model.json.JSONModel();
						ocModel.setSizeLimit(alt.length);
						ocModel.setData(alt);
						that.getView().byId("matidBOM").setValue($.sap.usg);
						that.getView().byId("matidSC").setValue($.sap.spc);
						that.getView().byId("matidPSC").setValue($.sap.psc);
						that.getView().setModel(ocModel, "BRF");
					} else {
						count += 1;
						for (var O = 0; O < x[0].results.length; O++) {
							for (var V = 0; V < x[1].results.length; V++) {
								if (x[0].results[O].Material === x[1].results[V].Material) {
									rcdidx += 1;
									arr.push({
										mat: x[0].results[O].Material,
										itm: x[0].results[O].BillOfMaterialItemNumber,
										bom: x[0].results[O].BillOfMaterialComponent,
										asm: x[0].results[O].IsAssembly,
										des: x[0].results[O].ComponentDescription,
										qty: x[0].results[O].BillOfMaterialItemQuantity,
										usg: x[1].results[V].BillOfMaterialVariantUsage,
										stc: "",
										psc: "",
										tsc: "",
										msp: "",
										lvl: count,
										idx: rcdidx
									});
								}
							}
						}
						for (i = 0; i < x[2].results.length; i++) {
							asc.push(x[2].results[i]);
						}
						if (p) {
							$.sap.usg = x[1].results[0].BillOfMaterialVariantUsage;
							$.sap.spc = x[2].results[0].StandardPrice;
							$.sap.psc = parseFloat(x[2].results[0].StandardPrice / x[2].results[0].PriceUnitQty).toFixed(3);
							for (var f = 0; f < materialX.length; f++) {
								for (var c = 0; c < arr.length; c++) {
									if (materialX[f] === arr[c].mat) {
										alt.push(arr[c]);
									}
								}
							}
						}
						if (q) {
							for (var u = 0; u < alt.length; u++) {
								for (var v = 0; v < arr.length; v++) {
									if (alt[u].asm.length > 0) {
										if (alt[u].bom === arr[v].mat) {
											j += 1;
											alt.splice(u + j, 0, arr[v]);
										}
									}
								}
								j = 0;
							}
						}
						arr = [];
						p = false;
						q = true;
						g = [];
						cg = [];
						for (var y = 0; y < x[0].results.length; y++) {
							if (x[0].results[y].IsAssembly.length > 0) {
								g.push(x[0].results[y].BillOfMaterialComponent);
							}
							cg.push(x[0].results[y].BillOfMaterialComponent);
						}
						d = [];
						zFilter = [];
						cc = [];
						costFilter = [];
						oFunc($.sap.brk, g, cg);
					}
				}).catch(function (o) {
					oBusyDialog.close();
					var err = JSON.parse(o.responseText);
					sap.m.MessageBox.show(
						err.error.message.value, {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Dear User",
							actions: [sap.m.MessageBox.Action.YES],
							onClose: function (oAction) {
								if (oAction === "YES") {
									return;
								}
							}
						}
					);
				});
			};
			oFunc($.sap.brk, materialX, materialX);
		},
		onGoSales: function () {
			oBusyDialog.open();
			var that = this;
			sap.m.MessageBox.show(
				" Do you want to proceed?.", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Search BOM",
					actions: ["OK", "Cancel"],
					onClose: function (oAction) {
						if (oAction === "OK") {
							that.onSalesBOMSearch();
						}
						if (oAction === "Cancel") {
							oBusyDialog.close();

						}
					},
					initialFocus: "OK"
				}
			);
		},
		onSalesBOMSearch: function () {
			var oSalesNo = this.getView().byId("salesInput").getValue();
			if (oSalesNo.length === 0) {
				sap.m.MessageBox.warning("Please enter all mandatory fields.");
				oBusyDialog.close();
			} else {
				this.onSalesSearch();
			}
		},
		onSalesSearch: function () {
			var salesNum = this.getView().byId("salesInput").getValue(),
				sMod = new sap.ui.model.json.JSONModel(),
				AP1 = this.getView().getModel("modelB"),
				that = this;
			this.getView().setModel(sMod, "SAM");
			AP1.read("/A_SalesOrderItem", {
				urlParameters: {
					"$select": "SalesOrder,SalesOrderItem,Material,RequestedQuantity,ProductionPlant,SalesOrderItemText,SalesOrderItemCategory,ProductionPlant",
					"$filter": "(SalesOrder eq '" + salesNum + "')",
					"$orderby": "SalesOrderItem"
				},
				async: false,
				success: function (x) {
					sMod = new sap.ui.model.json.JSONModel();
					sMod.setSizeLimit(x.results.length);
					sMod.setData(x.results);
					oBusyDialog.close();
					that.getView().setModel(sMod, "SAM");
					//-------------only to check------------------
					var arr = [];
					var d = [];
					var zFilter = [];
					var sPlant = x.results[0].ProductionPlant;
					for (var a = 0; a < x.results.length; a++) {
						arr[a] = x.results[a].Material;
					}
					for (var i = 0; i < arr.length; i++) {
						d.push(new sap.ui.model.Filter({
							filters: [
								new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, arr[i]),
								new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, sPlant),
								new sap.ui.model.Filter("BillOfMaterialVariantUsage", sap.ui.model.FilterOperator.EQ, "1")
							],
							and: true
						}));
					}
					zFilter.push(new sap.ui.model.Filter({
						filters: d,
						and: false
					}));
					var AP2 = that.getView().getModel();
					AP2.read("/MaterialBOM", {
						filters: zFilter,
						urlParameters: {
							"$select": "Material,BillOfMaterialVariantUsage,BillOfMaterial"
						},
						async: false,
						success: function (z) {
							for (var e = 0; e < z.results.length; e++) {
								// alert(z.results[e].Material);
							}
						},
						error: function () {

						}
					});
				},
				error: function (y) {

				}
			});
		}

	});
});