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
var LotHoldModel_1 = require("../../models/LotHoldModel");
var LotHold_1 = require("./LotHold");
var TopViewController_1 = require("../TopViewController");
var GlobalModel_1 = require("../../models/GlobalModel");
var MachineDownModel_1 = require("../../models/MachineDownModel");
var GlobalController_1 = require("../../controllers/GlobalController");
var OperationController_1 = require("../../controllers/OperationController");
var GlobalStore_1 = require("../../store/GlobalStore");
var TextStore_1 = require("../../store/TextStore");
var TextStore_2 = require("../../store/TextStore");
var VO_1 = require("../../models/VO");
var LotHoldViewController = /** @class */ (function () {
    function LotHoldViewController() {
        var _this = this;
        this.init = function () {
            GlobalController_1.default.checkCookie(function () {
                MachineDownModel_1.default.selectMachines(function (machObjs) {
                    var grid = $$(LotHold_1.default.viewIds.lotHoldGrid);
                    LotHoldViewController.eqps = [];
                    machObjs.forEach(function (machObj) {
                        LotHoldViewController.eqps.push(machObj.MACHINENAME);
                    });
                    //index of col:tool_id is '0'
                    grid.config.columns[0].options = LotHoldViewController.eqps;
                });
                _this.loadData();
            });
        };
        this.loadData = function () { return __awaiter(_this, void 0, void 0, function () {
            var grid;
            var _this = this;
            return __generator(this, function (_a) {
                grid = $$(LotHold_1.default.viewIds.lotHoldGrid);
                grid.clearAll();
                LotHold_1.default.isDataValid = true;
                GlobalModel_1.default.selectLatestSetTableVersion(TextStore_2.default.MODULE.PHOTO, TextStore_2.default.SET_TABLES.SET_LOT_HOLD, function (verObjs) { return __awaiter(_this, void 0, void 0, function () {
                    var rawData;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (verObjs == null || verObjs.length == 0) {
                                    return [2 /*return*/];
                                }
                                this.currentParentId = verObjs[0].ID;
                                //set update info
                                TopViewController_1.default.setUpdateInfo(this.currentParentId);
                                return [4 /*yield*/, LotHoldModel_1.default.selectLotHoldData(this.currentParentId)];
                            case 1:
                                rawData = _a.sent();
                                // let gridData = []
                                // rawData.forEach(rec=>{
                                // })
                                grid.parse(rawData);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); };
        this.onReloadBtnClick = function () {
            _this.loadData();
        };
        this.onAddBtnClick = function () {
            var grid = $$(LotHold_1.default.viewIds.lotHoldGrid);
            var toDecStr = function (no) {
                return (no < 10) ? '0' + no : no;
            };
            var sD = new Date();
            var eD = new Date(sD.getTime() + 6 * 60 * 60 * 1000);
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
                LOT_ID: null,
                TARGET_STEP_ID: '1500-%',
                TOOL_ID: LotHoldViewController.eqps[0],
                PROD_ID: null,
                START_TIME: sStr,
                END_TIME: eStr
                // CREATE_DATE: 
            };
            grid.add(rec);
        };
        this.onDelBtnClick = function () {
            var grid = $$(LotHold_1.default.viewIds.lotHoldGrid);
            grid.editCancel(); //avoid exception of updateItem
            var sel = grid.getSelectedId();
            if (!sel)
                return;
            grid.remove(sel.id);
        };
        this.onSaveBtnClick = function () {
            var grid = $$(LotHold_1.default.viewIds.lotHoldGrid);
            /*終止編輯*/
            if (grid.editCancel)
                grid.editCancel();
            /*資料驗證*/
            if (!LotHold_1.default.isDataValid) {
                _this.showValidationMsg();
                /*驗證失敗後終止儲存*/
                return;
            }
            var factory = TextStore_1.default.FACTORY.ARRAY;
            var modu = TextStore_1.default.MODULE.PHOTO;
            var setTable = TextStore_1.default.SET_TABLES.SET_LOT_HOLD;
            var setTabVo = new VO_1.SetTableVO(setTable, factory, modu);
            var checkAnotherVerFn = function (callback) {
                GlobalModel_1.default.selectLatestSetTableVersion(modu, setTable, function (verObjs) {
                    //if there's no any version
                    if (verObjs == null || verObjs.length === 0) {
                        console.log('first edition');
                        callback(true);
                    }
                    var latestParentId = verObjs[0].ID;
                    console.log(_this.currentParentId + '|' + latestParentId);
                    callback(_this.currentParentId === latestParentId);
                });
            };
            var insertToSetTabFn = function (guid, callback) {
                var grid = $$(LotHold_1.default.viewIds.lotHoldGrid);
                var gridData = GlobalController_1.default.getAllDataFromGrid(grid);
                if (gridData == null || gridData.length === 0) {
                    callback();
                    return;
                }
                else {
                    LotHoldModel_1.default.insertIntoSetLotHold(guid, gridData, callback);
                }
            };
            var insertToVerTabFn = function (guid, callback) {
                var insertCnt = 0;
                GlobalModel_1.default.selectPhotoToolgId(function (toolgs) {
                    toolgs.forEach(function (tObj) {
                        var toolgId = tObj.TOOLG_ID;
                        GlobalModel_1.default.insertSetVerCtrl(guid, factory, modu, toolgId, setTable, GlobalStore_1.default.user, function () {
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
        };
        /*
            print invalidation msgs
        */
        this.showValidationMsg = function () {
            if (!LotHold_1.default.isDataValid) {
                for (var type in LotHold_1.default.invalidItem) {
                    var invalidMsg = LotHold_1.default.invalidationMsg[type];
                    webix.message({
                        type: "error",
                        text: invalidMsg
                    });
                }
            }
        };
    }
    LotHoldViewController.eqps = [];
    return LotHoldViewController;
}());
exports.default = LotHoldViewController;
//# sourceMappingURL=LotHoldViewController.js.map