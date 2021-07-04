"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GlobalController_1 = require("./GlobalController");
var GlobalStore_1 = require("../store/GlobalStore");
var GlobalModel_1 = require("../models/GlobalModel");
var TextStore_1 = require("../store/TextStore");
var Top_1 = require("../views/Top");
var OperationController = /** @class */ (function () {
    function OperationController() {
    }
    /*
      標準儲存流程:
      屏蔽畫面,禁止操作
      確認UI版本
      跳出儲存確認視窗
      確認編輯版本衝突
      取得GUID
      儲存至 SET-table
      儲存至 set_ver_control
      顯示成功訊息
      重新載入資料
      刪除20以外版本
  
      parameters:
      setTable: set table 字串
      grid: 資料表格元件
      checkAnotherVerFn: 驗證版本流程
      insertToSetTabFn: 儲存set table data流程
      insertToVerTabFn: 儲存版本流程
      reloadFn: 重新讀取流程
  
    */
    OperationController.runSavingFlow = function (setTabVo, checkAnotherVerFn, insertToSetTabFn, insertToVerTabFn, reloadFn) {
        console.log('saving flow 1.');
        OperationController.loadingWin = webix.ui({
            view: "window",
            position: "center",
            width: 150,
            height: 120,
            headHeight: 0,
            css: "loading",
            body: {
                template: "<div class=\"loader\"></div><br><p style=\"text-align: center;\">Saving...</p>"
            }
        });
        var proceedToSave = function () {
            if (TextStore_1.default.SET_TABLES.SET_MACHINEGROUP === setTabVo.setTable) {
                //6.
                console.log('saving flow 6.');
                var guids_1 = [];
                GlobalModel_1.default.getGUID(function (guid0) {
                    guids_1[0] = guid0;
                    GlobalModel_1.default.getGUID(function (guid1) {
                        guids_1[1] = guid1;
                        //7.
                        console.log('saving flow 7.');
                        insertToSetTabFn(guids_1, function () {
                            //remove view blockers
                            t.enable();
                            OperationController.loadingWin.close();
                            //8.
                            //show success msg
                            reloadFn(function () { console.log('saving flow 10.'); });
                            webix.message({ type: "success", text: TextStore_1.default.SAVESUCCESS });
                            // remainVerFn(console.log('saving flow 11'))
                            GlobalModel_1.default.remainDataIn20release(setTabVo);
                        });
                    });
                });
            }
            else {
                //6.
                console.log('saving flow 6.');
                GlobalModel_1.default.getGUID(function (guid) {
                    //7.
                    console.log('saving flow 7.');
                    insertToSetTabFn(guid, function () {
                        //8.
                        insertToVerTabFn(guid, function (isSuccessfull, msg) {
                            console.log('saving flow 8.');
                            //remove view blockers
                            t.enable();
                            OperationController.loadingWin.close();
                            //9.
                            //show success msg
                            reloadFn(function () { console.log('saving flow 10.'); });
                            webix.message({ type: "success", text: TextStore_1.default.SAVESUCCESS });
                            // remainVerFn(console.log('saving flow 11'))
                            GlobalModel_1.default.remainDataIn20release(setTabVo);
                        });
                    });
                });
            }
        };
        var t = $$('topView');
        //2.
        t.disable();
        //3.
        console.log('saving flow 3.');
        GlobalController_1.default.checkVersion(function () {
            //4.
            console.log('saving flow 4.');
            webix.confirm({
                title: "Save",
                ok: "No",
                cancel: "Yes",
                text: GlobalStore_1.default.user + ", are you sure to alter setting?",
                callback: function (result) {
                    if (!result) { //"Yes"
                        OperationController.loadingWin.show();
                        //5.
                        console.log('saving flow 5.');
                        checkAnotherVerFn(function (isSameId) {
                            //no change ,go on procedure
                            if (isSameId) {
                                proceedToSave();
                            }
                            else {
                                var newSetVerBox = webix.confirm({
                                    title: "Another new version",
                                    ok: "No",
                                    cancel: "Yes",
                                    text: "Another new version has been created, are you sure to overwrite it?",
                                    callback: function (result) {
                                        //"Yes"
                                        if (!result) {
                                            proceedToSave();
                                        }
                                        else {
                                            t.enable();
                                            OperationController.loadingWin.close();
                                        }
                                    }
                                });
                            }
                        });
                    }
                    else {
                        t.enable();
                        OperationController.loadingWin.close();
                    }
                }
            });
        });
    };
    OperationController.confirmSaving = function (callback) {
        GlobalController_1.default.checkVersion(function () {
            var cnfmBox = webix.confirm({
                title: "Save",
                ok: "No",
                cancel: "Yes",
                text: GlobalStore_1.default.user + ", are you sure to alter setting?",
                callback: function (result) {
                    if (!result) //"Yes"
                        callback();
                }
            });
        });
    };
    OperationController.checkNewSetVer = function (newv, oldv, proceedFn) {
        //no change ,go on procedure
        if (newv === oldv) {
            proceedFn();
        }
        else {
            var newSetVerBox = webix.confirm({
                title: "Another new version",
                ok: "No",
                cancel: "Yes",
                text: "Another new version has been created, are you sure to overwrite it?",
                callback: function (result) {
                    //"Yes"
                    if (!result) {
                        proceedFn();
                    }
                }
            });
        }
    };
    OperationController.removeSavingMask = function () {
        OperationController.loadingWin.close();
        var t = $$(Top_1.default.viewIds.topView);
        t.enable();
    };
    return OperationController;
}());
exports.default = OperationController;
//# sourceMappingURL=OperationController.js.map