"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MachineDownModel_1 = require("../../models/MachineDownModel");
var MachineDown_1 = require("./MachineDown");
var TopViewController_1 = require("../TopViewController");
var GlobalModel_1 = require("../../models/GlobalModel");
var GlobalController_1 = require("../../controllers/GlobalController");
var OperationController_1 = require("../../controllers/OperationController");
var GlobalStore_1 = require("../../store/GlobalStore");
var TextStore_1 = require("../../store/TextStore");
var VO_1 = require("../../models/VO");
var MachineDownViewController = /** @class */ (function () {
    function MachineDownViewController() {
        var _this = this;
        this.init = function (view) {
            //removed grpCombo 2019/7/30
            // gMod.selectPhotoToolgId(grpIds=>{
            // 	let grpCombo:webix.ui.richselect = $$(MachineDown.viewIds.grpCombo)
            //     let items = []
            //     grpIds.forEach(rec=>{
            //         items.push(rec.TOOLG_ID)
            //     })
            // 	grpCombo.define("options",items)
            //     grpCombo.refresh()
            //     let toolg = (<any>grpCombo.getList()).getFirstId()
            //     grpCombo.setValue(toolg)  
            // })
            GlobalController_1.default.checkCookie(function () {
                MachineDownModel_1.default.selectMachines(function (machObjs) {
                    var grid = $$(MachineDown_1.default.viewIds.downGrid);
                    MachineDownViewController.eqps = [];
                    machObjs.forEach(function (machObj) {
                        MachineDownViewController.eqps.push(machObj.MACHINENAME);
                    });
                    grid.config.columns[0].options = MachineDownViewController.eqps;
                });
                _this.loadData();
            });
        };
        this.loadData = function () {
            var grid = $$(MachineDown_1.default.viewIds.downGrid);
            // let grpCombo = $$(MachineDown.viewIds.grpCombo)
            // let grpId = grpCombo.getValue()
            grid.clearAll();
            MachineDown_1.default.isDataValid = true;
            grid.showOverlay(TextStore_1.default.LOADING);
            MachineDownModel_1.default.selectMachineDown(function (data) {
                if (data == null || data.length === 0) {
                    grid.hideOverlay();
                    return;
                }
                //set current parent ID
                _this.currentParentId = data[0].PARENTID;
                //set update info
                TopViewController_1.default.setUpdateInfo(_this.currentParentId);
                data.forEach(function (rec) {
                    if (rec.CODE_ID === 'P0001') {
                        rec.CODE_ID = 1;
                    }
                    else {
                        rec.CODE_ID = 0;
                    }
                });
                grid.define("data", data);
                grid.hideOverlay();
            });
        };
        this.onReloadBtnClick = function () {
            _this.loadData();
        };
        this.onSaveBtnClick = function () {
            if (!MachineDown_1.default.isDataValid) {
                webix.alert({
                    title: "Invalid",
                    cancel: "Cancel",
                    text: "Data invalid!"
                });
                return;
            }
            var factory = TextStore_1.default.FACTORY.ARRAY;
            var module = TextStore_1.default.MODULE.PHOTO;
            var setTable = TextStore_1.default.SET_TABLES.SET_SCHEDULE_MACHINE_DOWN;
            var setTabVo = new VO_1.SetTableVO(setTable, factory, module);
            var checkAnotherVerFn = function (callback) {
                GlobalModel_1.default.selectLatestSetTableVersion(TextStore_1.default.MODULE.PHOTO, TextStore_1.default.SET_TABLES.SET_SCHEDULE_MACHINE_DOWN, function (verObjs) {
                    var latestParentId = verObjs[0].ID;
                    console.log(_this.currentParentId + '|' + latestParentId);
                    callback(_this.currentParentId === latestParentId);
                });
            };
            var insertToSetTabFn = function (guid, callback) {
                var grid = $$(MachineDown_1.default.viewIds.downGrid);
                var gridData = GlobalController_1.default.getAllDataFromGrid(grid);
                if (gridData == null || gridData.length === 0) {
                    callback();
                    return;
                }
                else {
                    MachineDownModel_1.default.insertMachineDown(guid, gridData, callback);
                }
            };
            var insertToVerTabFn = function (guid, callback) {
                var insertCnt = 0;
                GlobalModel_1.default.selectPhotoToolgId(function (toolgs) {
                    toolgs.forEach(function (tObj) {
                        var toolgId = tObj.TOOLG_ID;
                        GlobalModel_1.default.insertSetVerCtrl(guid, TextStore_1.default.FACTORY.ARRAY, TextStore_1.default.MODULE.PHOTO, toolgId, TextStore_1.default.SET_TABLES.SET_SCHEDULE_MACHINE_DOWN, GlobalStore_1.default.user, function () {
                            insertCnt++;
                            if (insertCnt === toolgs.length) {
                                callback();
                            }
                        });
                    });
                });
            };
            var reloadFn = function (callback) {
                _this.loadData();
                callback();
            };
            OperationController_1.default.runSavingFlow(setTabVo, checkAnotherVerFn, insertToSetTabFn, insertToVerTabFn, reloadFn);
            /*old*/
            /*
            oCtrl.confirmSaving(()=>{
    
                let grid :webix.ui.datatable  = $$(MachineDown.viewIds.downGrid)
                let gridData = gCtrl.getAllDataFromGrid(grid)
                // let grpCombo:webix.ui.richselect = $$(MachineDown.viewIds.grpCombo)
                // let toolgId = grpCombo.getValue()
    
                let insertCnt  = 0
    
                gMod.getGUID(guid=>{
                    mod.insertMachineDown(guid,gridData,()=>{
                        gMod.selectPhotoToolgId(toolgs=>{
                            toolgs.forEach(tObj=>{
                                let toolgId = tObj.TOOLG_ID
                                gMod.insertVerCtrl(guid,'ARRAY','PHOTO',toolgId,'SET_SCHEDULE_MACHINE_DOWN',gStore.user,()=>{
                                    insertCnt++
                                    if(insertCnt===toolgs.length){
                                        webix.message(gCtrl.SAVESUCCESS)
                                        this.loadData()
                                    }
                                })
                            })
                        })
                    })
                
                })
            })*/
        };
        //removed 2019/7/30
        // onGrpComboChange = ()=>{
        //     let grpCombo:webix.ui.richselect = $$(MachineDown.viewIds.grpCombo)
        //     let toolg = grpCombo.getValue()
        //     mod.selectMachines(toolg,machObjs=>{
        //         let grid:webix.ui.datatable = $$(MachineDown.viewIds.downGrid)
        //         MachineDownViewController.machs = []
        //         machObjs.forEach(machObj=>{
        //             MachineDownViewController.machs.push(machObj.MACHINENAME)
        //         })
        //         grid.config.columns[0].options = MachineDownViewController.machs
        //     })
        //     this.loadData()
        // }
        this.onAddBtnClick = function () {
            var grid = $$(MachineDown_1.default.viewIds.downGrid);
            // let grpCombo:webix.ui.richselect = $$(MachineDown.viewIds.grpCombo)
            // let toolgId = grpCombo.getValue()
            var toDecStr = function (no) {
                return (no < 10) ? '0' + no : no;
            };
            var sD = new Date();
            var eD = new Date(sD.getTime() + 360000);
            var y = sD.getFullYear();
            var mon = toDecStr(sD.getMonth() + 1);
            var day = toDecStr(sD.getDate());
            var hr = toDecStr(sD.getHours());
            var min = toDecStr(sD.getMinutes());
            var sStr = y + '-' + mon + '-' + day + 'T' + hr + ':' + min; //+':00'
            y = eD.getFullYear();
            mon = toDecStr(eD.getMonth() + 1);
            day = toDecStr(eD.getDate());
            hr = toDecStr(eD.getHours());
            min = toDecStr(eD.getMinutes());
            var eStr = y + '-' + mon + '-' + day + 'T' + hr + ':' + min;
            var rec = {
                // CH_ID: null,
                DOWN_START: sStr,
                DOWN_END: eStr,
                // PARENTID: "39ACC7507DED4B9AA63B70E009567C2B",
                // TOOLG_ID:,
                REMARK: "",
                TOOL_ID: MachineDownViewController.eqps[0]
            };
            grid.add(rec);
        };
        this.onDelBtnClick = function () {
            var grid = $$(MachineDown_1.default.viewIds.downGrid);
            grid.editCancel(); //avoid exception of updateItem
            var sel = grid.getSelectedId();
            if (!sel)
                return;
            grid.remove(sel.id);
        };
    }
    MachineDownViewController.eqps = [];
    return MachineDownViewController;
}());
exports.MachineDownViewController = MachineDownViewController;
//# sourceMappingURL=MachineDownViewController.js.map