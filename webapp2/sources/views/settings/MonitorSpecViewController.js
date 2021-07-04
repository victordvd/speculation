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
var MonitorSpecModel_1 = require("../../models/MonitorSpecModel");
var MonitorSpec_1 = require("./MonitorSpec");
var GlobalController_1 = require("../../controllers/GlobalController");
var OperationController_1 = require("../../controllers/OperationController");
var GlobalStore_1 = require("../../store/GlobalStore");
var TextStore_1 = require("../../store/TextStore");
var GlobalModel_1 = require("../../models/GlobalModel");
var TopViewController_1 = require("../TopViewController");
var VO_1 = require("../../models/VO");
var MonitorSpecViewController = /** @class */ (function () {
    function MonitorSpecViewController() {
        var _this = this;
        /*view 初始化後執行*/
        this.init = function () {
            /*權限驗證*/
            GlobalController_1.default.checkCookie(function () {
                _this.loadData();
            });
        };
        /*按下 "Reload" 按鈕後所執行的程序*/
        this.onReloadBtnClick = function () {
            _this.loadData();
        };
        /*載入資料*/
        this.loadData = function () { return __awaiter(_this, void 0, void 0, function () {
            var grid, rawData, optionData, defuData, stepData, globalDefuRec, idData, gridData, stepOptMap, seriData, storeData, checkedRowids, rowid, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        grid = $$(MonitorSpec_1.default.viewIds.specGrid);
                        return [4 /*yield*/, MonitorSpecModel_1.default.selectData()];
                    case 1:
                        rawData = _a.sent();
                        optionData = alasql("select STEP_ID,SUB_STEP_SELECTION from ? where STEP_ID != '%' and SUB_STEP_SELECTION !=null group by STEP_ID,SUB_STEP_SELECTION", [rawData]);
                        defuData = alasql('select distinct STEP_ID,SUB_STEP_ID,L2,L3,L2_CNT,L3_CNT,LAYER_NAME,UPDATE_TIME,UPDATE_USER from ?', [rawData]);
                        stepData = alasql('select distinct STEP_ID from ?', [rawData]);
                        globalDefuRec = alasql("select * from ? where STEP_ID = '%'", [rawData])[0];
                        idData = alasql('select distinct PARENTID from ? where PARENTID !=null', [rawData]);
                        /*紀錄當前 set table 版本*/
                        if (idData.length != 0) {
                            this.currentParentId = idData[0].PARENTID;
                            /*改變下方資料更新資訊*/
                            TopViewController_1.default.setUpdateInfo(this.currentParentId);
                        }
                        gridData = [];
                        stepOptMap = {};
                        optionData.forEach(function (rec) {
                            if (stepOptMap[rec.STEP_ID]) {
                                stepOptMap[rec.STEP_ID].push(rec.SUB_STEP_SELECTION);
                            }
                            else {
                                stepOptMap[rec.STEP_ID] = [rec.SUB_STEP_SELECTION];
                            }
                        });
                        //set default rec for each step
                        stepData.forEach(function (s) {
                            //if no other sub steps , user is not availible to choice
                            var isSingleSetting = (stepOptMap[s.STEP_ID]) ? 0 : null;
                            var hasNoSubSteps = (stepOptMap[s.STEP_ID]) ? false : true;
                            // console.log('steps:',s.STEP_ID,hasNoSubSteps)
                            gridData.push({ STEP_ID: s.STEP_ID, SUB_STEP_ID: null, isSingleSetting: isSingleSetting, hasNoSubSteps: hasNoSubSteps });
                        });
                        //add next steps into grid data
                        gridData.forEach(function (rec) {
                            //set values into null sub step
                            var hasNoMatch = defuData.every(function (dRec) {
                                if (dRec.STEP_ID === rec.STEP_ID && dRec.SUB_STEP_ID == null) {
                                    Object.assign(rec, dRec);
                                    rec.isSingleSetting = 1;
                                    rec.oriCheck = 1;
                                    if (rec.L2 == null) {
                                        rec.L2 = globalDefuRec.L2;
                                        rec.L3 = globalDefuRec.L3;
                                        rec.L2_CNT = globalDefuRec.L2_CNT;
                                        rec.L3_CNT = globalDefuRec.L3_CNT;
                                    }
                                    return false;
                                }
                                return true;
                            });
                            //if the default of step has no matching record then set global default value
                            if (hasNoMatch) {
                                rec.L2 = globalDefuRec.L2;
                                rec.L3 = globalDefuRec.L3;
                                rec.L2_CNT = globalDefuRec.L2_CNT;
                                rec.L3_CNT = globalDefuRec.L3_CNT;
                            }
                            //replace next operation to default
                            if (rec.STEP_ID === '%') {
                                rec.SUB_STEP_ID = 'global default';
                            }
                            else {
                                rec.SUB_STEP_ID = 'default';
                            }
                            var subData = [];
                            if (stepOptMap[rec.STEP_ID]) {
                                stepOptMap[rec.STEP_ID].forEach(function (optStep) {
                                    var sub = {};
                                    Object.assign(sub, rec);
                                    sub.SUB_STEP_ID = optStep;
                                    sub.isSingleSetting = null;
                                    defuData.every(function (dRec) {
                                        if (dRec.STEP_ID === rec.STEP_ID && dRec.SUB_STEP_ID == optStep) {
                                            Object.assign(sub, dRec);
                                            if (rec.L2 == null) {
                                                rec.L2 = globalDefuRec.L2;
                                                rec.L3 = globalDefuRec.L3;
                                                rec.L2_CNT = globalDefuRec.L2_CNT;
                                                rec.L3_CNT = globalDefuRec.L3_CNT;
                                            }
                                            return false;
                                        }
                                        return true;
                                    });
                                    subData.push(sub);
                                });
                            }
                            rec.data = subData;
                        });
                        /*資料處理結束*/
                        console.log('grid data', gridData);
                        grid.clearAll(); /*清除原先資料*/
                        grid.parse(gridData); /*元件載入資料*/
                        grid.openAll(); /*展開樹狀圖*/
                        grid.refresh(); /*元件刷新*/
                        seriData = grid.serialize();
                        storeData = grid.data.pull;
                        checkedRowids = [];
                        seriData.forEach(function (row) {
                            if (row.STEP_ID === '%') {
                                grid.addRowCss(row.id, 'monitor-enable');
                            }
                            else if (row.isSingleSetting == 1) {
                                checkedRowids.push(row.id);
                                grid.addRowCss(row.id, 'monitor-enable');
                            }
                            else {
                                grid.addRowCss(row.id, 'monitor-disable');
                            }
                        });
                        for (rowid in storeData) {
                            row = storeData[rowid];
                            if (row.isSingleSetting == null) {
                                if (checkedRowids.includes(row.$parent)) {
                                    grid.addRowCss(row.id, 'monitor-disable');
                                }
                                else {
                                    grid.addRowCss(row.id, 'monitor-enable');
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        /*按下 "Save" 後所執行的程序*/
        this.onSaveBtnClick = function () {
            var grid = $$(MonitorSpec_1.default.viewIds.specGrid);
            var gridData = grid.serialize();
            var factory = TextStore_1.default.FACTORY.ARRAY;
            var module = TextStore_1.default.MODULE.PHOTO;
            var setTable = TextStore_1.default.SET_TABLES.SET_MONITOR_SPEC;
            var setTabVo = new VO_1.SetTableVO(setTable, factory, module);
            /*終止編輯*/
            if (grid.editCancel)
                grid.editCancel();
            /*資料驗證*/
            if (!MonitorSpec_1.default.isDataValid) {
                _this.showValidationMsg();
                /*驗證失敗後終止儲存*/
                return;
            }
            /*實作儲存流程*/
            var checkAnotherVerFn = function (callback) {
                GlobalModel_1.default.selectLatestSetTableVersion(TextStore_1.default.MODULE.PHOTO, TextStore_1.default.SET_TABLES.SET_MONITOR_SPEC, function (verObjs) {
                    var latestParentId = verObjs[0].ID;
                    console.log(_this.currentParentId + '|' + latestParentId);
                    callback(_this.currentParentId === latestParentId);
                });
            };
            var insertToSetTabFn = function (guid, callback) {
                var savingData = [];
                gridData.forEach(function (rec) {
                    if (rec.STEP_ID == '%') {
                        rec.SUB_STEP_ID = null;
                    }
                    if (rec.SUB_STEP_ID == 'default') {
                        rec.SUB_STEP_ID = null;
                    }
                    //use default or not
                    if (rec.isSingleSetting == 1) {
                        rec.PARENTID = guid;
                        savingData.push(rec);
                    }
                    else {
                        if (rec.data) {
                            rec.data.forEach(function (subRec) {
                                subRec.PARENTID = guid;
                                savingData.push(subRec);
                            });
                        }
                    }
                });
                //convert value to db value
                savingData.forEach(function (rec) {
                    if (rec.UPDATE_TIME) {
                        rec.UPDATE_TIME = rec.UPDATE_TIME.replace(/T/, ' ');
                    }
                    //if user switch to new sub steps or change value
                    if (rec.UPDATE_USER == null || rec.isChanged) {
                        var now = new Date();
                        var m = now.getMonth() + 1;
                        var mStr = (m < 10) ? ('0' + m) : String(m);
                        rec.UPDATE_TIME = now.getFullYear() + '-' + mStr + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
                        rec.UPDATE_USER = GlobalStore_1.default.user;
                    }
                });
                console.log('saving data', savingData);
                MonitorSpecModel_1.default.insertMonitorSpecData(guid, savingData, callback);
            };
            var insertToVerTabFn = function (guid, callback) {
                GlobalModel_1.default.insertSetVerCtrl(guid, TextStore_1.default.FACTORY.ARRAY, TextStore_1.default.MODULE.PHOTO, null, TextStore_1.default.SET_TABLES.SET_MONITOR_SPEC, GlobalStore_1.default.user, function () {
                    callback();
                });
            };
            var reloadFn = function (callback) {
                _this.loadData();
                callback();
            };
            OperationController_1.default.runSavingFlow(setTabVo, checkAnotherVerFn, insertToSetTabFn, insertToVerTabFn, reloadFn);
        };
        /*
            print invalidation msgs
        */
        this.showValidationMsg = function () {
            if (!MonitorSpec_1.default.isDataValid) {
                var invalidMsg = '';
                for (var type in MonitorSpec_1.default.invalidItem) {
                    invalidMsg += MonitorSpec_1.default.invalidationMsg[type] + '\n';
                }
                webix.message({
                    type: "error",
                    text: invalidMsg
                });
            }
        };
    }
    return MonitorSpecViewController;
}());
exports.default = MonitorSpecViewController;
//# sourceMappingURL=MonitorSpecViewController.js.map