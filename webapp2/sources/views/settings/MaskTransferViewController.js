"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var MaskTransferModel_1 = require("../../models/MaskTransferModel");
var MaskTransfer_1 = require("./MaskTransfer");
var VO_1 = require("../../models/VO");
var GlobalController_1 = require("../../controllers/GlobalController");
var OperationController_1 = require("../../controllers/OperationController");
var GlobalStore_1 = require("../../store/GlobalStore");
var TextStore_1 = require("../../store/TextStore");
var GlobalModel_1 = require("../../models/GlobalModel");
var TopViewController_1 = require("../TopViewController");
var OperationController_2 = require("../../controllers/OperationController");
var SqlController_1 = require("../../controllers/SqlController");
var VO_2 = require("../../models/VO");
var MaskTransferViewController = /** @class */ (function () {
    function MaskTransferViewController() {
        var _this = this;
        this.isIdleShow = false;
        this.init = function () {
            _this.idleStTime = new Date();
            GlobalController_1.default.checkCookie(function () {
                _this.loadData();
                MaskTransferViewController.idleItv = setInterval(function () {
                    var itv = new Date().getTime() - _this.idleStTime.getTime();
                    if (_this.isIdleShow)
                        return;
                    if (itv > 1800000) { //30min
                        // if(itv>10000){
                        _this.isIdleShow = true;
                        webix.alert({
                            title: "Idle",
                            text: "You have been idle for 30min,confirm to refresh data.",
                            type: "alert-warning",
                            callback: function () {
                                _this.isIdleShow = false;
                                _this.loadData();
                            }
                        });
                    }
                }, 1000);
            });
        };
        this.loadData = function () {
            _this.idleStTime = new Date();
            GlobalModel_1.default.selectLatestSetTableVersion(TextStore_1.default.MODULE.PHOTO, TextStore_1.default.SET_TABLES.SET_MASK_TRANSFER, function (verObjs) {
                if (verObjs.length === 0) //no any version
                    return;
                var latestParentId = verObjs[0].ID;
                //set current parent ID
                _this.curSetParentId = latestParentId;
                //set update info
                TopViewController_1.default.setUpdateInfo(_this.curSetParentId);
                MaskTransferModel_1.default.selectMaskTransfer(_this.curSetParentId, function (rawData) {
                    var grid = $$(MaskTransfer_1.default.viewId.maskTansGrid);
                    grid.clearAll();
                    if (rawData == null || rawData.length == 0)
                        return;
                    var data = [];
                    var locationMap = {};
                    var preTime = null;
                    //set current parentids
                    MaskTransferViewController.curOptParentIds = {};
                    var idObjs = alasql('select distinct O_PARENTID ,TOOLG_ID from ?', [rawData]);
                    idObjs.forEach(function (idObj) {
                        MaskTransferViewController.curOptParentIds[idObj.TOOLG_ID] = idObj.O_PARENTID;
                    });
                    rawData.forEach(function (rec, idx) {
                        var reticleOutoutId = rec.O_PARENTID;
                        var arvTime = rec.TIME_IN.replace(/T/, ' ');
                        var updTime = (rec.UPDATE_TIME) ? rec.UPDATE_TIME.replace(/T/, ' ') : null;
                        var reticleOutputTime = (rec.RETICLE_OUTPUT_TIME) ? rec.RETICLE_OUTPUT_TIME.replace(/T/, ' ') : null;
                        var maskId = rec.RETICLES_ID;
                        var isChecked = 0;
                        var isCancelled = false;
                        // if(rec.S_PARENTID){
                        if (rec.CHECKED == 'Y') { //checked
                            isChecked = 1;
                            isCancelled = false;
                        }
                        else if (rec.CHECKED == 'N') { //cancelled
                            isChecked = 0;
                            isCancelled = true;
                        }
                        else { //unchecked
                            isChecked = 0;
                            isCancelled = false;
                        }
                        if (arvTime === preTime) { //if 2 records at same arrival time, merge into 1
                            var vo = locationMap[arvTime];
                            //avoid  eqp -> stock -> eqp
                            if (rec.LOCATION_FROM == vo.inEqpTo && !(vo.inEqpTo == 'STOCKER' && rec.LOCATION == vo.inEqpFrom)) { //correct transfer flow
                                vo.outMaskId = maskId;
                                vo.outEqpTo = rec.LOCATION;
                                vo.outProdId = rec.PROD_ID;
                            }
                            else { //swap order
                                vo.outEqpTo = vo.inEqpTo;
                                vo.outMaskId = vo.inMaskId;
                                vo.outProdId = vo.inProdId;
                                vo.inEqpFrom = rec.LOCATION_FROM;
                                vo.inMaskId = maskId;
                                vo.inEqpTo = rec.LOCATION;
                                vo.isDone = (rec.MATERIALSTATE) ? true : false;
                                vo.isChecked = isChecked;
                                vo.inProdId = rec.PROD_ID;
                                vo.updateUser = rec.UPDATE_USER;
                                vo.updateTime = updTime;
                            }
                        }
                        else {
                            var isDone = (rec.MATERIALSTATE) ? true : false;
                            locationMap[arvTime] = new VO_1.MaskTransportVO(idx + 1, reticleOutoutId, isDone, isChecked, isCancelled, arvTime, rec.PROD_ID, maskId, rec.LOCATION_FROM, rec.LOCATION, rec.UPDATE_USER, updTime, reticleOutputTime);
                        }
                        preTime = arvTime;
                    });
                    for (var f in locationMap) {
                        data.push(locationMap[f]);
                    }
                    var renderRows = function () {
                        var now = new Date();
                        var grid = $$(MaskTransfer_1.default.viewId.maskTansGrid);
                        if (!grid)
                            return;
                        var gData = grid.serialize();
                        gData.forEach(function (row, idx) {
                            var arvTime = new Date(row.arrivalTime);
                            var itv = now.getTime() - arvTime.getTime();
                            if (itv > 0) {
                                grid.addRowCss(String(row.id), "mask_delay");
                            }
                            else if (itv > -1800000) {
                                grid.addRowCss(String(row.id), "mask_warning");
                            }
                            else if (row.savedChecked) {
                                grid.addRowCss(String(row.id), "mask_checked");
                            }
                            else {
                                grid.removeRowCss(String(row.id), "mask_delay");
                                grid.removeRowCss(String(row.id), "mask_warning");
                                grid.removeRowCss(String(row.id), "mask_checked");
                            }
                        });
                    };
                    grid.define('data', data);
                    grid.refresh();
                    renderRows(); //dun invoke fn after setInterval ,or cant clear it
                    MaskTransferViewController.renderItv = setInterval(renderRows, 5000);
                });
            });
        };
        this.onReloadBtnClick = function () {
            // let maskTv:webix.ui.tabview = $$(MaskTransfer.viewId.maskTv)
            // let tab = maskTv.getValue()
            _this.loadMaskHistData();
            _this.loadData();
        };
        this.onSaveBtnClick = function () {
            var grid = $$(MaskTransfer_1.default.viewId.maskTansGrid);
            var data = grid.serialize();
            if (data == null || data.length == 0) {
                webix.message('No data can be saved!');
                return;
            }
            var factory = TextStore_1.default.FACTORY.ARRAY;
            var module = TextStore_1.default.MODULE.PHOTO;
            var setTable = TextStore_1.default.SET_TABLES.SET_MASK_TRANSFER;
            var setTabVo = new VO_2.SetTableVO(setTable, factory, module);
            var checkAnotherVerFn = function (callback) {
                GlobalModel_1.default.selectLatestOptTableVersion(null, function (latestIds) {
                    var isIdentical = true;
                    latestIds.every(function (idObj) {
                        var curId = MaskTransferViewController.curOptParentIds[idObj.toolg];
                        if (curId == undefined) { //if there's no related toolg
                            isIdentical = true;
                        }
                        else {
                            isIdentical = curId == idObj.id;
                        }
                        return isIdentical;
                    });
                    if (!isIdentical) {
                        webix.alert({
                            title: "New Version",
                            text: "There is a new schdule version created, this saving will be cancelled.\nConfirm to reload.",
                            type: "alert-warning",
                            callback: function () {
                                _this.loadData();
                            }
                        });
                        OperationController_2.default.removeSavingMask();
                        return;
                    }
                    GlobalModel_1.default.selectLatestSetTableVersion(TextStore_1.default.MODULE.PHOTO, TextStore_1.default.SET_TABLES.SET_MASK_TRANSFER, function (verObjs) {
                        //no any version
                        if (verObjs.length === 0) {
                            callback(true);
                        }
                        var latestParentId = verObjs[0].ID;
                        console.log(_this.curSetParentId + '|' + latestParentId);
                        callback(_this.curSetParentId == null || _this.curSetParentId === latestParentId);
                    });
                });
            };
            var insertToSetTabFn = function (guid, callback) {
                var data = GlobalController_1.default.getAllDataFromGrid(grid);
                var insertSql = "INSERT ALL\n";
                var insertCnt = 0;
                var intoClause = 'INTO set_mask_transfer(parentid,reticle_parentid,checked,mask_id,tool_id,arrival_time,product_id,location_from,update_user,update_time,reticle_output_time) VALUES';
                data.forEach(function (row) {
                    var inProd = SqlController_1.default.nullOrString(row.inProdId);
                    var outProd = SqlController_1.default.nullOrString(row.outProdId);
                    var reticleId = SqlController_1.default.nullOrString(row.reticleId);
                    var updTime = (row.updateTime) ? "to_date('" + row.updateTime + "','yyyy-mm-dd hh24:mi:ss')" : 'null';
                    var reticleTime = (row.reticleOutputTime) ? "to_date('" + row.reticleOutputTime + "','yyyy-mm-dd hh24:mi:ss')" : 'null';
                    var arrivalTime = "to_date('" + row.arrivalTime + "','yyyy-mm-dd hh24:mi:ss')";
                    if (row.isChecked == 1) { //checked
                        var checked = 'Y';
                        if (row.savedChecked) { //saved checked
                            insertSql += intoClause + "('" + guid + "'," + reticleId + ",'" + checked + "','" + row.inMaskId + "','" + row.inEqpTo + "'," + arrivalTime + "," + inProd + ",'" + row.inEqpFrom + "','" + row.updateUser + "'," + updTime + "," + reticleTime + ")\n";
                            insertCnt++;
                            if (row.outEqpTo) {
                                insertSql += intoClause + "('" + guid + "'," + reticleId + ",'" + checked + "','" + row.outMaskId + "','" + row.outEqpTo + "'," + arrivalTime + "," + outProd + ",'" + row.inEqpTo + "','" + row.updateUser + "'," + updTime + "," + reticleTime + ")\n";
                                insertCnt++;
                            }
                        }
                        else { //new checked
                            insertSql += intoClause + "('" + guid + "'," + reticleId + ",'" + checked + "','" + row.inMaskId + "','" + row.inEqpTo + "'," + arrivalTime + "," + inProd + ",'" + row.inEqpFrom + "','" + row.updateUser + "',sysdate," + reticleTime + ")\n";
                            insertCnt++;
                            if (row.outEqpTo) {
                                insertSql += intoClause + "('" + guid + "'," + reticleId + ",'" + checked + "','" + row.outMaskId + "','" + row.outEqpTo + "'," + arrivalTime + "," + outProd + ",'" + row.inEqpTo + "','" + row.updateUser + "',sysdate," + reticleTime + ")\n";
                                insertCnt++;
                            }
                        }
                    }
                    else { //unchecked
                        if (row.savedChecked) { //cancelled
                            var checked = 'N'; //cancelled
                            insertSql += intoClause + "('" + guid + "'," + reticleId + ",'" + checked + "','" + row.inMaskId + "','" + row.inEqpTo + "'," + arrivalTime + "," + inProd + ",'" + row.inEqpFrom + "','" + row.updateUser + "',sysdate," + reticleTime + ")\n";
                            insertCnt++;
                            if (row.outEqpTo) {
                                insertSql += intoClause + "('" + guid + "'," + reticleId + ",'" + checked + "','" + row.outMaskId + "','" + row.outEqpTo + "'," + arrivalTime + "," + outProd + ",'" + row.inEqpTo + "','" + row.updateUser + "',sysdate," + reticleTime + ")\n";
                                insertCnt++;
                            }
                        }
                        else if (row.savedCancelled) { //saved cancelled
                            var checked = 'N'; //cancelled
                            insertSql += intoClause + "('" + guid + "'," + reticleId + ",'" + checked + "','" + row.inMaskId + "','" + row.inEqpTo + "'," + arrivalTime + "," + inProd + ",'" + row.inEqpFrom + "','" + row.updateUser + "'," + updTime + "," + reticleTime + ")\n";
                            insertCnt++;
                            if (row.outEqpTo) {
                                insertSql += intoClause + "('" + guid + "'," + reticleId + ",'" + checked + "','" + row.outMaskId + "','" + row.outEqpTo + "'," + arrivalTime + "," + outProd + ",'" + row.inEqpTo + "','" + row.updateUser + "'," + updTime + "," + reticleTime + ")\n";
                                insertCnt++;
                            }
                        }
                        else { //unchecked
                            // let checked = 'N'
                        }
                    }
                });
                if (insertCnt === 0) { //no item be checked
                    callback();
                    return;
                }
                insertSql += "SELECT * FROM dual";
                MaskTransferModel_1.default.insertMaskTranfer(insertSql, callback);
            };
            var insertToVerTabFn = function (guid, callback) {
                GlobalModel_1.default.insertSetVerCtrl(guid, TextStore_1.default.FACTORY.ARRAY, TextStore_1.default.MODULE.PHOTO, '', TextStore_1.default.SET_TABLES.SET_MASK_TRANSFER, GlobalStore_1.default.user, function () {
                    callback();
                });
            };
            var reloadFn = function (callback) {
                _this.loadData();
                _this.loadMaskHistData();
                callback();
            };
            OperationController_1.default.runSavingFlow(setTabVo, checkAnotherVerFn, insertToSetTabFn, insertToVerTabFn, reloadFn);
        };
        this.onTabChange = function () {
            var maskTv = $$(MaskTransfer_1.default.viewId.maskTv);
            var saveBtn = $$(MaskTransfer_1.default.viewId.saveBtn);
            var tab = maskTv.getValue();
            if (tab === MaskTransfer_1.default.viewId.maskHistGrid) {
                _this.loadMaskHistData();
                saveBtn.hide();
            }
            else {
                _this.loadData();
                saveBtn.show();
            }
        };
        this.loadMaskHistData = function () { return __awaiter(_this, void 0, void 0, function () {
            var grid, rawData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        grid = $$(MaskTransfer_1.default.viewId.maskHistGrid);
                        grid.clearAll();
                        return [4 /*yield*/, MaskTransferModel_1.default.selectMaskTransferHistory()];
                    case 1:
                        rawData = _a.sent();
                        grid.parse(rawData);
                        return [2 /*return*/];
                }
            });
        }); };
    }
    MaskTransferViewController.recCnt = 0;
    return MaskTransferViewController;
}());
exports.default = MaskTransferViewController;
//# sourceMappingURL=MaskTransferViewController.js.map