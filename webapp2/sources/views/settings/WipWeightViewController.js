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
var WipWeightModel_1 = require("../../models/WipWeightModel");
var WipWeight_1 = require("./WipWeight");
var TopViewController_1 = require("../TopViewController");
var GlobalModel_1 = require("../../models/GlobalModel");
var GlobalController_1 = require("../../controllers/GlobalController");
var OperationController_1 = require("../../controllers/OperationController");
var GlobalStore_1 = require("../../store/GlobalStore");
var TextStore_1 = require("../../store/TextStore");
var TextStore_2 = require("../../store/TextStore");
var VO_1 = require("../../models/VO");
var WipWeightViewController = /** @class */ (function () {
    function WipWeightViewController() {
        var _this = this;
        this.init = function () {
            GlobalController_1.default.checkCookie(function () {
                GlobalModel_1.default.selectPhotoToolgId(function (grpIds) {
                    var grpCombo = $$(WipWeight_1.default.viewIds.grpCombo);
                    var items = [];
                    grpIds.forEach(function (rec) {
                        items.push(rec.TOOLG_ID);
                    });
                    grpCombo.define("options", items);
                    grpCombo.refresh();
                    grpCombo.setValue(grpCombo.getList().getFirstId());
                    _this.loadData();
                });
            });
        };
        this.loadData = function () { return __awaiter(_this, void 0, void 0, function () {
            var grpCombo, toolgId, verObjs, rawData, stData, csData, stGrid, csGrid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        grpCombo = $$(WipWeight_1.default.viewIds.grpCombo);
                        toolgId = grpCombo.getValue();
                        return [4 /*yield*/, GlobalModel_1.default.selectLatestSetTableVersionByToolg(TextStore_2.default.SET_TABLES.SET_WIP_WEIGHTING, TextStore_2.default.MODULE.PHOTO, toolgId)];
                    case 1:
                        verObjs = _a.sent();
                        if (verObjs == null || verObjs.length == 0) {
                            return [2 /*return*/];
                        }
                        this.currentParentId = verObjs[0].ID;
                        //set update info
                        TopViewController_1.default.setUpdateInfo(this.currentParentId);
                        return [4 /*yield*/, WipWeightModel_1.default.selectWipData(this.currentParentId)]; //this.currentParentId
                    case 2:
                        rawData = _a.sent() //this.currentParentId
                        ;
                        stData = alasql("select * from ? where PTY>=1", [rawData]);
                        csData = alasql("select * from ? where PTY=-1", [rawData]);
                        stGrid = $$(WipWeight_1.default.viewIds.stGrid);
                        csGrid = $$(WipWeight_1.default.viewIds.csGrid);
                        stGrid.clearAll();
                        csGrid.clearAll();
                        stGrid.parse(stData);
                        csGrid.parse(csData);
                        return [2 /*return*/];
                }
            });
        }); };
        this.onGrpComboChange = function () {
            _this.loadData();
        };
        this.onSaveBtnClick = function () { return __awaiter(_this, void 0, void 0, function () {
            var stGrid, csGrid, grpCombo, factory, modu, setTable, toolgId, setTabVo, checkAnotherVerFn, insertToSetTabFn, insertToVerTabFn, reloadFn;
            var _this = this;
            return __generator(this, function (_a) {
                stGrid = $$(WipWeight_1.default.viewIds.stGrid);
                csGrid = $$(WipWeight_1.default.viewIds.csGrid);
                grpCombo = $$(WipWeight_1.default.viewIds.grpCombo);
                /*終止編輯*/
                if (stGrid.editCancel)
                    stGrid.editCancel();
                if (csGrid.editCancel)
                    csGrid.editCancel();
                /*資料驗證*/
                if (!WipWeight_1.default.isDataValid) {
                    this.showValidationMsg();
                    /*驗證失敗後終止儲存*/
                    return [2 /*return*/];
                }
                factory = TextStore_1.default.FACTORY.ARRAY;
                modu = TextStore_1.default.MODULE.PHOTO;
                setTable = TextStore_1.default.SET_TABLES.SET_WIP_WEIGHTING;
                toolgId = grpCombo.getValue();
                setTabVo = new VO_1.SetTableVO(setTable, factory, modu);
                checkAnotherVerFn = function (callback) { return __awaiter(_this, void 0, void 0, function () {
                    var verObjs, latestParentId;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, GlobalModel_1.default.selectLatestSetTableVersionByToolg(setTable, modu, toolgId)
                                //if there's no any version
                            ];
                            case 1:
                                verObjs = _a.sent();
                                //if there's no any version
                                if (verObjs == null || verObjs.length === 0) {
                                    console.log('first edition');
                                    callback(true);
                                }
                                latestParentId = verObjs[0].ID;
                                console.log(this.currentParentId + '|' + latestParentId);
                                callback(this.currentParentId === latestParentId);
                                return [2 /*return*/];
                        }
                    });
                }); };
                insertToSetTabFn = function (guid, callback) {
                    var stGridData = GlobalController_1.default.getAllDataFromGrid(stGrid);
                    var csGridData = GlobalController_1.default.getAllDataFromGrid(csGrid);
                    var data = stGridData.concat(csGridData);
                    if (data.length === 0) {
                        callback();
                        return;
                    }
                    else {
                        WipWeightModel_1.default.insertWipData(guid, toolgId, data, callback);
                    }
                };
                insertToVerTabFn = function (guid, callback) {
                    GlobalModel_1.default.insertSetVerCtrl(guid, factory, modu, toolgId, setTable, GlobalStore_1.default.user, callback);
                };
                reloadFn = function (callback) {
                    _this.loadData();
                    callback();
                };
                // let remainVerFn = (callback)=>{
                //     gMod.remainDataIn20release(factory,modu,setTable)
                // }
                OperationController_1.default.runSavingFlow(setTabVo, checkAnotherVerFn, insertToSetTabFn, insertToVerTabFn, reloadFn);
                return [2 /*return*/];
            });
        }); };
        this.onStAddBtnClick = function () {
            var grid = $$(WipWeight_1.default.viewIds.stGrid);
            var gridData = grid.serialize();
            var pty = 1;
            if (gridData.length > 0) {
                var maxPty = alasql("select max(PTY) PTY from ?", [gridData]);
                pty = maxPty[0].PTY + 1;
            }
            if (pty > 10) {
                webix.message('The maximum priority is 10!');
                return;
            }
            var rec = {
                PTY: pty,
                WEIGHTING: 0
            };
            grid.add(rec);
        };
        this.onStDelBtnClick = function () {
            var grid = $$(WipWeight_1.default.viewIds.stGrid);
            grid.editCancel(); //avoid exception of updateItem
            // let sel = grid.getSelectedId()
            // if(!sel)
            //     return
            var gridData = GlobalController_1.default.getAllDataFromGrid(grid);
            if (gridData.length > 0) {
                grid.remove(gridData[gridData.length - 1].id);
            }
        };
        this.onCsAddBtnClick = function () {
            var grid = $$(WipWeight_1.default.viewIds.csGrid);
            var rec = {
                PTY: -1,
                WEIGHTING: 0,
                PROD_ID: null,
                RECIPE: null,
                LOT_ID: null
            };
            grid.add(rec);
        };
        this.onCsDelBtnClick = function () {
            var grid = $$(WipWeight_1.default.viewIds.csGrid);
            grid.editCancel(); //avoid exception of updateItem
            var sel = grid.getSelectedId();
            if (!sel) {
                webix.message('请选取一行项目');
                return;
            }
            grid.remove(sel.id);
        };
        this.onReloadBtnClick = function () {
            _this.loadData();
        };
        this.onDefaultBtnClick = function () {
            var stGrid = $$(WipWeight_1.default.viewIds.stGrid);
            var csGrid = $$(WipWeight_1.default.viewIds.csGrid);
            stGrid.clearAll();
            csGrid.clearAll();
            var stDefaData = [
                { PTY: 1, WEIGHTING: 14.838 },
                { PTY: 2, WEIGHTING: 4.94616 },
                { PTY: 3, WEIGHTING: 2.47308 },
                { PTY: 4, WEIGHTING: 1.64872 },
                { PTY: 5, WEIGHTING: 1.49812 },
                { PTY: 6, WEIGHTING: 1.39561 },
                { PTY: 7, WEIGHTING: 1.33071 }
            ];
            stGrid.parse(stDefaData);
        };
        /*
            print invalidation msgs
        */
        this.showValidationMsg = function () {
            if (!WipWeight_1.default.isDataValid) {
                for (var type in WipWeight_1.default.invalidItem) {
                    var invalidMsg = WipWeight_1.default.invalidationMsg[type];
                    webix.message({
                        type: "error",
                        text: invalidMsg
                    });
                }
            }
        };
    }
    return WipWeightViewController;
}());
exports.default = WipWeightViewController;
//# sourceMappingURL=WipWeightViewController.js.map