sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/IconPool"
], function (BaseController, Jm, formatter, Filter, FilterOperator, IconPool) {
	"use strict";
	var oBusyDialog = new sap.m.BusyDialog();
	var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
		maxFractionDigits: 3,
		decimalSeparator: ",",
		groupingEnabled: true
	});
	return BaseController.extend("com.salesbom.culligan.salesbomdisplay.controller.Worklist", {

		formatter: formatter,
		onInit: function () {
			var f = new Jm({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				bomMaterialTableCount: ""
			});
			this.getView().setModel(f, "worklistView");
			var s = new Jm({
				salesTableTitle: this.getResourceBundle().getText("salesTableTitle"),
				salesOrderTableCount: ""
			});
			this.getView().setModel(s, "salesView");
			var b = [];
			var c = {};
			//Fiori Theme font family and URI
			var t = {
				fontFamily: "SAP-icons-TNT",
				fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
			};
			//Registering to the icon pool
			IconPool.registerFont(t);
			b.push(IconPool.fontLoaded("SAP-icons-TNT"));
			c["SAP-icons-TNT"] = t;
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
			this.getView().getModel("salesView").setProperty("/salesOrderTableCount", [i]);
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
		onSaleslocalSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				this.onSalesRefresh();
			} else {
				var aSalesTableSearchState = [];
				var sQuery = oEvent.getParameter("query");
				if (sQuery && sQuery.length > 0) {
					var contains = sap.ui.model.FilterOperator.Contains;
					aSalesTableSearchState = [new sap.ui.model.Filter([
						new sap.ui.model.Filter("Material", contains, sQuery)
					], false)];
				}
				this._applySalesSearch(aSalesTableSearchState);
			}
		},
		_applySalesSearch: function (aSalesTableSearchState) {
			var oTable = this.getView().byId("tab");
			oTable.getBinding("items").filter(aSalesTableSearchState, "Application");
		},
		_applySearch: function (aTableSearchState) {
			var oTable = this.getView().byId("mattab");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
		},
		onRefresh: function () {
			var oTable = this.getView().byId("mattab");
			oTable.getBinding("items").refresh();
		},
		onSalesRefresh: function () {
			var oTable = this.getView().byId("tab");
			oTable.getBinding("items").refresh();
		},
		onClear: function () {
			var oFilterBar = this.getView().byId("matbtnId");
			var oItems = oFilterBar.getAllFilterItems(true);
			oFilterBar.determineControlByFilterItem(oItems[0]).setValue("");
			oFilterBar.determineControlByFilterItem(oItems[1]).setValue("");
		},
		onSalesFilterClear:function(){
				var oFilterBar = this.getView().byId("btnId");
			var oItems = oFilterBar.getAllFilterItems(true);
			oFilterBar.determineControlByFilterItem(oItems[0]).setValue("");
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
			this.getView().getModel("worklistView").setProperty("/bomMaterialTableCount", [i]);
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
												that.getView().byId("matmultiInput").setValue("");
												that.getView().byId("matidPlant").setValue("");
												that.getView().byId("matidSC").setValue("");
												that.getView().byId("matidBOM").setValue("");
												that.getView().byId("matidPSC").setValue("");
												that.getView().byId("matidDiff").setValue("");
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
									alt[i].psc = parseFloat(asc[b].StandardPrice / asc[b].PriceUnitQty).toFixed(3);
									alt[i].tsc = parseFloat(alt[i].qty * (asc[b].StandardPrice / asc[b].PriceUnitQty)).toFixed(3);
								}
							}
						}
						//--------------changes--------------------
						var adder = 0;
						for(b = 0; b < alt.length; b++){
							if(alt[b].lvl === 1){
								adder = adder + parseFloat(alt[b].tsc);
							}
						}
						var dispalyDiff = adder - $.sap.spc;
						//--------------changes--------------------
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
						that.getView().byId("matidDiff").setValue(parseFloat(dispalyDiff).toFixed(3));
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
				SP = this.getView().getModel("modelA"),
				that = this;
			this.getView().setModel(sMod, "SAM");
			AP1.read("/A_SalesOrderItem", {
				urlParameters: {
					"$select": "SalesOrder,SalesOrderItem,Material,RequestedQuantity,SalesOrderItemText,SalesOrderItemCategory,ProductionPlant",
					"$filter": "(SalesOrder eq '" + salesNum + "')",
					"$orderby": "SalesOrderItem"
				},
				async: false,
				success: function (x) {
					if (x.results.length === 0) {
						oBusyDialog.close();
						that.getView().byId("salesInput").setValue("");
						sap.m.MessageToast.show("No Records Found");
						return;
					}
					var disarr = [];
					for (var m = 0; m < x.results.length; m++) {
						disarr.push({
							SalesOrder: x.results[m].SalesOrder,
							SalesOrderItem: x.results[m].SalesOrderItem,
							Material: x.results[m].Material,
							RequestedQuantity: x.results[m].RequestedQuantity,
							SalesOrderItemText: x.results[m].SalesOrderItemText,
							SalesOrderItemCategory: x.results[m].SalesOrderItemCategory,
							ProductionPlant: x.results[m].ProductionPlant,
							StandardCost: "",
							CalculatedStdCost: ""
						});
					}
					//-------------only to check------------------
					var _d = [];
					var _zFilter = [];
					var arr = [];
					var d = [];
					var zFilter = [];
					var sPlant = x.results[0].ProductionPlant;
					$.sap.gplant = sPlant;
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
						_d.push(new sap.ui.model.Filter({
							filters: [
								new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, arr[i]),
								new sap.ui.model.Filter("ValuationArea", sap.ui.model.FilterOperator.EQ, sPlant)
							],
							and: true
						}));
					}
					_zFilter.push(new sap.ui.model.Filter({
						filters: _d,
						and: false
					}));
					zFilter.push(new sap.ui.model.Filter({
						filters: d,
						and: false
					}));
					var AP2 = that.getView().getModel();
					//--------promise--------
					var yFunc = function (p1, p2, p3) {
						return new Promise(function (resolve, reject) {
							AP2.read(p1, {
								filters: zFilter,
								urlParameters: {
									"$select": "Material,BillOfMaterialVariantUsage,BillOfMaterial"
								},
								async: false,
								success: function (z) {
									var sd = [],
										szFilter = [];
									$.sap.gmaterial = z.results;
									for (i = 0; i < z.results.length; i++) {
										sd.push(new sap.ui.model.Filter({
											filters: [
												new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, z.results[i].Material),
												new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, sPlant)
											],
											and: true
										}));
									}
									szFilter.push(new sap.ui.model.Filter({
										filters: sd,
										and: false
									}));
									AP2.read(p2, {
										filters: szFilter,
										urlParameters: {
											"$select": "BillOfMaterialComponent,IsAssembly,Material,BillOfMaterialItemNumber",
											"$orderby": "BillOfMaterialItemNumber"
										},
										async: false,
										success: function (oData) {
											var uData = [];
											for (var pq = 0; pq < oData.results.length; pq++) {
												uData.push({
													Material: oData.results[pq].Material,
													BillOfMaterialComponent: oData.results[pq].BillOfMaterialComponent,
													StandardPrice: ""
												});
											}
											var scc = [],
												scostFilter = [];
											for (i = 0; i < oData.results.length; i++) {
												scc.push(new sap.ui.model.Filter({
													filters: [
														new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, oData.results[i].BillOfMaterialComponent),
														new sap.ui.model.Filter("ValuationArea", sap.ui.model.FilterOperator.EQ, sPlant)
													],
													and: true
												}));
											}
											scostFilter.push(new sap.ui.model.Filter({
												filters: scc,
												and: false
											}));
											SP.read(p3, {
												filters: scostFilter,
												urlParameters: {
													"$select": "StandardPrice,Product"
												},
												async: false,
												success: function (xData) {
													for (i = 0; i < uData.length; i++) {
														for (var j = 0; j < xData.results.length; j++) {
															if (uData[i].BillOfMaterialComponent === xData.results[j].Product) {
																uData[i].StandardPrice = xData.results[j].StandardPrice;
															}
														}
													}
													var add = 0,
														display = [];
													for (i = 0; i < z.results.length; i++) {
														for (j = 0; j < uData.length; j++) {
															if (z.results[i].Material === uData[j].Material) {
																add = add + parseFloat(uData[j].StandardPrice);
															}
														}
														display.push({
															Material: z.results[i].Material,
															CalculatedSPwQ: add
														});
														add = 0;
													}
													resolve(display);

												},
												error: function (oError) {
													reject(oError);
												}
											});
										},
										error: function (error) {
											reject(error);
										}
									});
								},
								error: function (error) {
									reject(error);
								}
							});
						});
					};
					var xFunc = function (oParam) {
						return new Promise(function (resolve, reject) {
							SP.read(oParam, {
								filters: _zFilter,
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
					Promise.all([yFunc("/MaterialBOM", "/MaterialBOMItem", "/A_ProductValuation"), xFunc("/A_ProductValuation")]).then(function (
						abc) {
						for (i = 0; i < disarr.length; i++) {
							for (var j = 0; j < abc[1].results.length; j++) {
								if (disarr[i].Material === abc[1].results[j].Product) {
									disarr[i].StandardCost = abc[1].results[j].StandardPrice;
									disarr[i].CalculatedStdCost = parseFloat(abc[1].results[j].StandardPrice * disarr[i].RequestedQuantity).toFixed(3);
									j = abc[1].results.length - 1;
								}
							}
						}
						for (i = 0; i < disarr.length; i++) {
							for (j = 0; j < abc[0].length; j++) {
								if (disarr[i].Material === abc[0][j].Material) {
									disarr[i].CalculatedStdCost = parseFloat(abc[0][j].CalculatedSPwQ * disarr[i].RequestedQuantity).toFixed(3);
								}
							}
						}
						sMod = new sap.ui.model.json.JSONModel();
						sMod.setSizeLimit(disarr.length);
						sMod.setData(disarr);
						$.sap.sviewdata = JSON.parse(JSON.stringify(disarr));
						oBusyDialog.close();
						that.getView().setModel(sMod, "SAM");
					}).catch(function (o) {});

					//--------promise--------
				},
				error: function (y) {

				}
			});
		},
		onSalesexcel: function () {
			var oxModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oxModel, "XLSX");
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
			var materialX = [];
			for (var i = 0; i < $.sap.gmaterial.length; i++) {
				materialX[i] = $.sap.gmaterial[i].Material;
			}
			var oPlant = $.sap.gplant;
			var spMod = this.getView().getModel("modelA");
			var strike = this.getView().getModel();
			$.sap.brk = strike;
			var that = this;
			var oFunc = function (far, cry, cost) {
				for (i = 0; i < cry.length; i++) {
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
				Promise.all([pfunc("/MaterialBOMItem"), rfunc("/A_ProductValuation")]).then(function (x) {
					if (x[0] === "") {
						for (i = 0; i < x[1].results.length; i++) {
							asc.push(x[1].results[i]);
						}
						for (i = 0; i < alt.length; i++) {
							for (var b = 0; b < asc.length; b++) {
								if (alt[i].Material === asc[b].Product) {
									alt[i].StandardCost = asc[b].StandardPrice;
									alt[i].psc = parseFloat(asc[b].StandardPrice / asc[b].PriceUnitQty).toFixed(3);
									alt[i].CalculatedStdCost = parseFloat(alt[i].RequestedQuantity * (asc[b].StandardPrice / asc[b].PriceUnitQty)).toFixed(3);
								}
							}
						}
						var base = JSON.parse(JSON.stringify($.sap.sviewdata));
						for (var u = 0; u < base.length; u++) {
							for (var v = 0; v < alt.length; v++) {
								if (base[u].Material === alt[v].mat) {
									j += 1;
									base.splice(u + j, 0, alt[v]);
								}
							}
							j = 0;
						}
						oxModel = new sap.ui.model.json.JSONModel();
						oxModel.setSizeLimit(base.length);
						oxModel.setData(base);
						that.getView().setModel(oxModel, "XLSX");
						oBusyDialog.close();
						that.onSalesExcelDownload(that);
						// return;
					} else {
						count += 1;
						for (var O = 0; O < x[0].results.length; O++) {
							rcdidx += 1;
							arr.push({
								mat: x[0].results[O].Material,
								itm: x[0].results[O].BillOfMaterialItemNumber,
								Material: x[0].results[O].BillOfMaterialComponent,
								asm: x[0].results[O].IsAssembly,
								SalesOrderItemText: x[0].results[O].ComponentDescription,
								RequestedQuantity: x[0].results[O].BillOfMaterialItemQuantity,
								StandardCost: "",
								psc: "",
								CalculatedStdCost: "",
								msp: "",
								lvl: count,
								idx: rcdidx
							});
						}
						for (i = 0; i < x[1].results.length; i++) {
							asc.push(x[1].results[i]);
						}
						if (p) {
							for (var f = 0; f < materialX.length; f++) {
								for (var c = 0; c < arr.length; c++) {
									if (materialX[f] === arr[c].mat) {
										alt.push(arr[c]);
									}
								}
							}
						}
						if (q) {
							for (u = 0; u < alt.length; u++) {
								for (v = 0; v < arr.length; v++) {
									if (alt[u].asm.length > 0) {
										if (alt[u].Material === arr[v].mat) {
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
		salesonDataExport: function () {
			oBusyDialog.open();
			this.onSalesexcel();
		}

	});
});