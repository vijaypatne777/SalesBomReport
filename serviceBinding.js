function initModel() {
	var sUrl = "/OPENSAP/sap/opu/odata/sap/API_SALES_ORDER_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}