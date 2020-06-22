sap.ui.define(["sap/ui/test/opaQunit","sap/ui/Device","./pages/Worklist","./pages/Browser","./pages/Object","./pages/App"],function(e,o){"use strict";var a=o.browser.msie||o.browser.edge?1500:1e3;QUnit.module("Navigation");e("Should see the objects list",function(e,o,a){e.iStartMyFLPApp({intent:"SalesBOMDisplay-display"});a.onTheWorklistPage.iShouldSeeTheTable()});e("Should react on hash change",function(e,o,a){o.onTheWorklistPage.iRememberTableItemAtPosition(2);o.onTheBrowser.iChangeTheHashToTheRememberedItem();a.onTheObjectPage.iShouldSeeTheRememberedObject()});e("Should go back to the TablePage",function(e,o,a){o.onTheBrowser.iGoBack();a.onTheWorklistPage.iShouldSeeTheTable()});e("Object Page shows the correct object Details",function(e,o,a){o.onTheWorklistPage.iRememberTableItemAtPosition(1).and.iPressTableItemAtPosition(1);a.onTheObjectPage.iShouldSeeTheRememberedObject()});e("Should be on the table page again when browser back is pressed",function(e,o,a){o.onTheBrowser.iGoBack();a.onTheWorklistPage.iShouldSeeTheTable()});e("Should be on the object page again when browser forwards is pressed",function(e,o,a){o.onTheBrowser.iGoForward();a.onTheObjectPage.iShouldSeeTheRememberedObject();a.iLeaveMyFLPApp()});e("Start the App and simulate metadata error: MessageBox should be shown",function(e,o,t){e.iStartMyFLPApp({intent:"SalesBOMDisplay-display",delay:a,metadataError:true});t.onTheAppPage.iShouldSeeTheMessageBox();o.onTheAppPage.iCloseTheMessageBox();t.iLeaveMyFLPApp()});e("Start the App and simulate bad request error: MessageBox should be shown",function(e,o,t){e.iStartMyFLPApp({intent:"SalesBOMDisplay-display",delay:a,errorType:"serverError"});t.onTheAppPage.iShouldSeeTheMessageBox();o.onTheAppPage.iCloseTheMessageBox();t.iLeaveMyFLPApp()})});