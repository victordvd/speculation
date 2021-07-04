"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GlobalModel_1 = require("../models/GlobalModel");
var TextStore_1 = require("../store/TextStore");
var Top_1 = require("../views/Top");
var MaskTransferModel_1 = require("../models/MaskTransferModel");
var TopViewController_1 = require("views/TopViewController");
/*
    global opt_output version control
*/
var VersionController = /** @class */ (function () {
    function VersionController() {
    }
    VersionController.triggerOptOutputInterval = function () {
        //check per 20s
        VersionController.checkVerItv_optoutpu = setInterval(this.checkVersionChange, 20000);
    };
    VersionController.is1stTimeVerChk = true;
    //invoke this while the view is initializing
    VersionController.setLoadDataFn = function (loadDataFn) {
        VersionController.loadDataFn = loadDataFn;
    };
    VersionController.getCurrentOptOutputIds = function () {
        return VersionController.curParentIds_optoutput;
    };
    VersionController.checkVersionChange = function () {
        GlobalModel_1.default.selectLatestOptTableVersion(null, function (latestIds) {
            var isIdentical = true;
            latestIds.every(function (idObj) {
                if (VersionController.curParentIds_optoutput != null) {
                    isIdentical = VersionController.curParentIds_optoutput.includes(idObj.id);
                }
                else {
                    isIdentical = false;
                }
                return isIdentical;
            });
            // console.log('opt_output ver: ',isIdentical,latestIds,VersionController.curParentIds_optoutput)
            //replace current ids
            VersionController.curParentIds_optoutput = [];
            latestIds.forEach(function (idObj) {
                VersionController.curParentIds_optoutput.push(idObj.id);
            });
            if (VersionController.is1stTimeVerChk) {
                VersionController.is1stTimeVerChk = false;
                return;
            }
            //if version changed,trigger loadDataFn
            if (!isIdentical) {
                if (VersionController.loadDataFn)
                    VersionController.loadDataFn();
                //if page MaskTransfer , do not thing
                if (TopViewController_1.default.getCurrentPage() !== Top_1.default.ViewNames.MaskTransfer) {
                    //check mask transfer
                    var maskSwi = $$(Top_1.default.viewIds.maskSwi);
                    if (maskSwi.getValue() == 1) {
                        GlobalModel_1.default.selectLatestSetTableVersion(TextStore_1.default.MODULE.PHOTO, TextStore_1.default.SET_TABLES.SET_MASK_TRANSFER, function (verObjs) {
                            var maskTransferId = (verObjs.length === 0) ? null : verObjs[0].ID;
                            MaskTransferModel_1.default.selectMaskTransfer(maskTransferId, function (rawData) {
                                if (rawData == null || rawData.length == 0) {
                                    return;
                                }
                                if (rawData.length > 0) { //if record count > 0
                                    webix.alert({
                                        id: "MaskAlert",
                                        type: "alert-warning",
                                        title: "New Mask Transfer",
                                        text: "Mask Transfer Task has changed, please check \"Mask Transfer\" page."
                                    });
                                }
                            });
                        });
                    }
                }
            }
        });
    };
    return VersionController;
}());
exports.default = VersionController;
//# sourceMappingURL=VersionController.js.map