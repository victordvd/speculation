"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StockerSettingModel_1 = require("../../models/StockerSettingModel");
var GlobalModel_1 = require("../../models/GlobalModel");
var GlobalController_1 = require("../../controllers/GlobalController");
var OperationController_1 = require("../../controllers/OperationController");
var StockerSetting_1 = require("./StockerSetting");
var TopViewController_1 = require("../TopViewController");
var GlobalStore_1 = require("../../store/GlobalStore");
var TextStore_1 = require("../../store/TextStore");
var VO_1 = require("../../models/VO");
var StockerSettingViewContriller = /** @class */ (function () {
    function StockerSettingViewContriller(view) {
        var _this = this;
        this.photoStockers = [];
        this.init = function (view) {
            GlobalController_1.default.checkCookie(function () {
                _this.loadData();
            });
        };
        this.onReloadBtnClick = function () {
            _this.loadData();
        };
        this.loadData = function () {
            var grid = $$(StockerSetting_1.default.viewIds.stockerGrid);
            grid.showOverlay(TextStore_1.default.LOADING);
            StockerSettingModel_1.default.selectStockerData(function (rawData) {
                grid.config.columns = StockerSetting_1.default.staticCols.slice(0);
                grid.clearAll();
                //for cell render
                // let cssFm =(val,conf)=>{
                //     if(val>50) val =50
                //     let r = (val>25)?250:val*10
                //     let g = (val>25)?150-val*3:250-val*4
                //     g = (g<0) ? 0 :g
                //     let b = 25
                //     return {"background-color":"rgb("+r+","+g+","+b+")"}
                // }
                if (rawData == null || rawData.length === 0) {
                    grid.hideOverlay();
                    return;
                }
                else {
                    //set current parent ID
                    _this.currentParentId = rawData[0].PARENTID;
                    //set update info
                    TopViewController_1.default.setUpdateInfo(_this.currentParentId);
                    for (var colName in rawData[0]) {
                        if (colName !== 'PARENTID' && colName !== 'STOCKER_ID_FROM' && colName !== 'UPDATE_TIME') {
                            _this.photoStockers.push(colName);
                            grid.config.columns.push({
                                id: colName,
                                header: { text: colName, css: "center" },
                                width: 80,
                                editor: "text",
                                css: { "text-align": "right" },
                                sort: "int",
                                editParse: function (value) {
                                    var v = Number(value);
                                    if (Number.isNaN(v)) {
                                        return 0;
                                    }
                                    else {
                                        if (v > 999)
                                            return 999;
                                        else if (v < 0)
                                            return 0;
                                        else
                                            return Math.floor(v);
                                    }
                                    // return webix.Number.parse(value, { 
                                    //   groupSize:webix.i18n.groupSize, 
                                    //   groupDelimiter:webix.i18n.groupDelimiter, 
                                    //   decimalSize : webix.i18n.decimalSize,
                                    //   decimalDelimiter : webix.i18n.decimalDelimiter
                                    // }); 
                                }
                                // cssFormat:cssFm
                            });
                        }
                    }
                }
                // rawData.forEach(rec => {
                // });
                grid.refreshColumns();
                grid.define("data", rawData);
                grid.hideOverlay();
            });
        };
        this.onSaveBtnClick = function () {
            var factory = TextStore_1.default.FACTORY.ARRAY;
            var module = TextStore_1.default.MODULE.PHOTO;
            var setTable = TextStore_1.default.SET_TABLES.SET_TRANSPORT;
            var setTabVo = new VO_1.SetTableVO(setTable, factory, module);
            var checkAnotherVerFn = function (callback) {
                GlobalModel_1.default.selectLatestSetTableVersion(TextStore_1.default.MODULE.PHOTO, TextStore_1.default.SET_TABLES.SET_TRANSPORT, function (verObjs) {
                    var latestParentId = verObjs[0].ID;
                    callback(_this.currentParentId === latestParentId);
                });
            };
            var insertToSetTabFn = function (guid, callback) {
                var grid = $$(StockerSetting_1.default.viewIds.stockerGrid);
                var gridData = GlobalController_1.default.getAllDataFromGrid(grid);
                var guiSql = "INSERT ALL \n";
                gridData.forEach(function (rec) {
                    _this.photoStockers.forEach(function (ps) {
                        var transTime = rec[ps];
                        guiSql += " INTO gui_transport(parentid,stocker_id_from,stocker_id_to,trans_time,update_time)\n                    VALUES('" + guid + "','" + rec.STOCKER_ID_FROM + "','" + ps + "'," + transTime + ",sysdate) \n";
                    });
                });
                guiSql += "SELECT * FROM dual";
                StockerSettingModel_1.default.insertGuiData(guiSql, function () {
                    StockerSettingModel_1.default.insertIntoTransport(guid, callback);
                });
            };
            var insertToVerTabFn = function (guid, callback) {
                var insertCnt = 0;
                GlobalModel_1.default.selectPhotoToolgId(function (toolgs) {
                    toolgs.forEach(function (tObj) {
                        var toolg_id = tObj.TOOLG_ID;
                        GlobalModel_1.default.insertSetVerCtrl(guid, TextStore_1.default.FACTORY.ARRAY, TextStore_1.default.MODULE.PHOTO, toolg_id, TextStore_1.default.SET_TABLES.SET_TRANSPORT, GlobalStore_1.default.user, function () {
                            insertCnt++;
                            if (insertCnt === toolgs.length) {
                                callback();
                            }
                        });
                    });
                });
            };
            var reloadFn = function () {
                _this.loadData();
            };
            OperationController_1.default.runSavingFlow(setTabVo, checkAnotherVerFn, insertToSetTabFn, insertToVerTabFn, reloadFn);
            /*old*/
            /*
            oCtrl.confirmSaving(()=>{
    
                let grid:webix.ui.datatable = $$(StockerSetting.viewIds.stockerGrid)
    
                let gridData = gCtrl.getAllDataFromGrid(grid)
                let guiSql = "INSERT ALL \n"
    
                gMod.getGUID(guid=>{
                    gridData.forEach(rec=>{
    
                        this.photoStockers.forEach(ps=>{
                            
                            let transTime = rec[ps]
                            guiSql += ` INTO gui_transport(parentid,stocker_id_from,stocker_id_to,trans_time,update_time)
                            VALUES('${guid}','${rec.STOCKER_ID_FROM}','${ps}',${transTime},sysdate) \n`
                        })
                    })
    
                    guiSql+="SELECT * FROM dual"
    
                    let insertCnt  = 0
    
                    mod.insertGuiData(guiSql,()=>{
                        mod.insertIntoTransport(guid,()=>{
                            gMod.selectPhotoToolgId(toolgs=>{
    
                                toolgs.forEach(tObj=>{
                                    let toolg_id = tObj.TOOLG_ID
                                    gMod.insertVerCtrl(guid,'ARRAY','PHOTO',toolg_id,'SET_TRANSPORT',gStore.user,()=>{
                                        if(insertCnt===toolgs.length())
                                            webix.message(gCtrl.SAVESUCCESS)
                                    })
                                })
    
                                webix.message(gCtrl.SAVESUCCESS)
                                this.loadData()
                            })
    
                            
    
                        })
                    })
    
                })
            
            })*/
        };
        this.view = view;
    }
    return StockerSettingViewContriller;
}());
exports.StockerSettingViewContriller = StockerSettingViewContriller;
//# sourceMappingURL=StockerSettingViewController.js.map