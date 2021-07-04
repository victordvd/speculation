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
var MatchRate_1 = require("./MatchRate");
var TopViewController_1 = require("../TopViewController");
var MatchRateModel_1 = require("../../models/MatchRateModel");
var GlobalModel_1 = require("../../models/GlobalModel");
var GlobalController_1 = require("../../controllers/GlobalController");
var OperationController_1 = require("../../controllers/OperationController");
var CommonController_1 = require("../../controllers/CommonController");
var GlobalStore_1 = require("../../store/GlobalStore");
var TextStore_1 = require("../../store/TextStore");
var VO_1 = require("../../models/VO");
var MatchRateViewController = /** @class */ (function () {
    function MatchRateViewController() {
        var _this = this;
        this.init = function () {
            // let updBar = $$(Top.viewIds.updBar)
            // updBar.hide()
            GlobalController_1.default.checkCookie(function () {
                _this.loadData();
            });
        };
        this.loadData = function () { return __awaiter(_this, void 0, void 0, function () {
            var idObjs, id, data, grid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GlobalModel_1.default.selectLatestMatTableVersion(TextStore_1.default.MAT_TABLES.MAT_MFG_TARGET)];
                    case 1:
                        idObjs = _a.sent();
                        if (idObjs.length == 0)
                            return [2 /*return*/];
                        id = idObjs[0].ID;
                        return [4 /*yield*/, MatchRateModel_1.default.selectMfgTarget(id)];
                    case 2:
                        data = _a.sent();
                        if (data.length == 0)
                            return [2 /*return*/];
                        TopViewController_1.default.setUpdateInfo_MAT(id);
                        grid = $$(MatchRate_1.default.viewIds.viewGird);
                        grid.clearAll();
                        grid.parse(data);
                        return [2 /*return*/];
                }
            });
        }); };
        this.onBeforeFileAdd = function (upload) {
            // (<any>webix).AtomDataLoader._onLoad = function (data) {
            //     var _this2 = this;
            //     data = this.data.driver.toObject(data);
            //     if (data && data.then) data.then(function (data) {
            //         return _this2._onLoadContinue(data);
            //     });else this._onLoadContinue(data);	
            //   }
            console.log(upload);
            if (upload.type != 'xlsx') {
                webix.message({ type: "error", text: "\"" + upload.name + "\" is not the type of \"xlsx\"" });
                return;
            }
            var viewer = $$(MatchRate_1.default.viewIds.excelviewer);
            viewer.clearAll();
            viewer.parse(upload.file, "excel");
            // viewer.refresh()
            return false;
        };
        this.generateInsertRecObj = function (sheet, data, isArrayIn) {
            var reData = [];
            var modelTypeIdx = 0;
            var prodDescIdx = 1;
            var prodIdxIdx = 2;
            var dateStIdx = 3;
            var dataStRidx = 2;
            var dates = [];
            //rule
            // let hasInvalidDate = false
            // let tooLessDate = false
            // let invalidNum = false
            var isValid = true;
            data.every(function (rec, rIdx) {
                if (rIdx >= dataStRidx) { //scan data
                    var modelType_1;
                    var prodDesc_1;
                    var prodId_1;
                    var vals_1 = [];
                    var colIdx = 0;
                    for (var col in rec) {
                        var cell = rec[col];
                        if (colIdx == modelTypeIdx)
                            modelType_1 = cell;
                        else if (colIdx == prodDescIdx)
                            prodDesc_1 = cell;
                        else if (colIdx == prodIdxIdx) {
                            prodId_1 = cell;
                            //not availible product ID, break
                            if (typeof prodId_1 != "string" || prodId_1.trim().length == 0)
                                return true;
                        }
                        else if (colIdx >= dateStIdx) { //scan values
                            vals_1.push(cell);
                        }
                        colIdx++;
                    }
                    //create records foreach prod & date
                    dates.forEach(function (d, i) {
                        var val = Number(vals_1[i]);
                        if (val) {
                            var vo = new VO_1.MatMfgTargetVO();
                            vo.datetimekey = d;
                            vo.modelType = modelType_1;
                            vo.productDesc = prodDesc_1;
                            vo.productId = prodId_1;
                            if (isArrayIn)
                                vo.inQty = val;
                            else
                                vo.outQty = val;
                            reData.push(vo);
                        }
                    });
                }
                else if (rIdx == 0) {
                    var colIdx = 0;
                    for (var col in rec) {
                        if (col.includes('data')) {
                            var cell = rec[col];
                            if (colIdx >= dateStIdx) { //scan dates
                                var dt = new Date(cell);
                                if (isNaN(dt.getTime())) {
                                    if (colIdx <= dateStIdx + 1) { //check 1st & 2nd dates
                                        console.log('invalid date!');
                                        webix.message({ type: "error", text: "Invalid date, Sheet:\"" + sheet + "\",Column: " + (colIdx + 1) + ", Row: " + (rIdx + 1) });
                                        isValid = false;
                                        return false;
                                    }
                                }
                                else {
                                    var dStr = CommonController_1.default.getDateStr(dt, '/');
                                    var today = new Date();
                                    today.setHours(0);
                                    today.setMinutes(0);
                                    today.setSeconds(0);
                                    today.setMilliseconds(0);
                                    if (today.getTime() - dt.getTime() > 0) {
                                        // let todayStr  = common.getDateStr(today,'/')
                                        console.log('date must be greater than today.');
                                        webix.message({ type: "error", text: "Date must be later than today, Sheet:\"" + sheet + "\",Column: " + (colIdx + 1) + ", Row: " + (rIdx + 1) });
                                        isValid = false;
                                        return false;
                                    }
                                    dates.push(dStr);
                                }
                            }
                        }
                        colIdx++;
                    }
                }
                return true;
            });
            if (!isValid) //if invalid,terminate saving flow
                return false;
            return reData;
        };
        this.onSaveBtnClick = function () {
            var viewer = $$(MatchRate_1.default.viewIds.excelviewer);
            var bar = $$(MatchRate_1.default.viewIds.excelBar);
            var curSheet = bar.getValue();
            var sheets = viewer.getSheets();
            var arrayInData;
            var arrayOutData;
            var arrayAllData = [];
            var hasArrInSheet = false;
            var hasArrOutSheet = false;
            var isValid = true;
            //get data from I/O
            sheets.forEach(function (sheet, i) {
                viewer.showSheet(sheet);
                var data = viewer.serialize();
                console.log(sheet, data);
                if (sheet === 'Array In') { //&&i==0
                    hasArrInSheet = true;
                    var re = _this.generateInsertRecObj(sheet, data, true);
                    if (!re) {
                        isValid = false;
                        return;
                    }
                    arrayInData = re;
                }
                else if (sheet === 'Array Out') { //&&i==1
                    hasArrOutSheet = true;
                    var re = _this.generateInsertRecObj(sheet, data, false);
                    if (!re) {
                        isValid = false;
                        return;
                    }
                    arrayOutData = re;
                }
                else {
                    console.log('others sheet: ', sheet);
                }
            });
            //restore current sheet
            viewer.showSheet(curSheet);
            //invalid data, terminate saving flow
            if (!hasArrInSheet || !hasArrOutSheet) { //incorrect sheet
                console.log('incorrect sheets');
                webix.message({ type: "error", text: 'Sheet is incorrect.(ex: "Array In","Array Out")' });
                return;
            }
            else if (!isValid) { //invalid
                return;
            }
            //merge I/O data
            arrayOutData.forEach(function (oRec, oi) {
                var isMerged = false;
                arrayInData.every(function (iRec, ii) {
                    if (oRec.productId == iRec.productId && oRec.datetimekey == iRec.datetimekey) { //merge
                        iRec.outQty = oRec.outQty;
                        isMerged = true;
                        return false;
                    }
                    else {
                        isMerged = false;
                    }
                    return true;
                });
                //push independent rec to all data
                if (!isMerged) {
                    arrayAllData.push(oRec);
                }
            });
            //push all arrayIn data into all
            arrayAllData = arrayAllData.concat(arrayInData);
            console.log('all data: ', arrayAllData);
            if (arrayAllData.length == 0)
                return;
            //start saving flow
            var factory = TextStore_1.default.FACTORY.ARRAY;
            var modu = TextStore_1.default.MODULE.PHOTO;
            var setTable = TextStore_1.default.MAT_TABLES.MAT_MFG_TARGET;
            var user = GlobalStore_1.default.user;
            var matTabVo = new VO_1.SetTableVO(setTable, factory, modu);
            var checkAnotherVerFn = function (callback) { callback(true); };
            var insertToMatTabFn = function (guid, callback) {
                GlobalModel_1.default.insertMatVerCtrl(guid, null, setTable, user, callback);
            };
            var insertToVerTabFn = function (guid, callback) {
                MatchRateModel_1.default.insertMatchRateData(guid, factory, arrayAllData, user, callback);
            };
            var reloadFn = function (callback) {
                _this.loadData();
                callback();
            };
            OperationController_1.default.runSavingFlow(matTabVo, checkAnotherVerFn, insertToMatTabFn, insertToVerTabFn, reloadFn);
        };
        this.onSampleBtnClick = function () {
            console.log('sample click');
            var link = document.createElement("a");
            link.download = name;
            link.href = "生产计划(样本).xlsx";
            link.click();
        };
    }
    return MatchRateViewController;
}());
exports.default = MatchRateViewController;
//# sourceMappingURL=MatchRateViewController.js.map