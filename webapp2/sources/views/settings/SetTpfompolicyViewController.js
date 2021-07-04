"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var SetTpfompolicy_1 = require("../SetTpfompolicy");
var SetTpfompolicyModel_1 = require("../../models/SetTpfompolicyModel");
var GlobalModel_1 = require("../../models/GlobalModel");
var GlobalController_1 = require("../../controllers/GlobalController");
var OperationController_1 = require("../../controllers/OperationController");
var TopViewController_1 = require("../TopViewController");
var GlobalStore_1 = require("../../store/GlobalStore");
var TextStore_1 = require("../../store/TextStore");
var SetTpfompolicyViewController = /** @class */ (function () {
    function SetTpfompolicyViewController(view) {
        var _this = this;
        this.loadText = [];
        this.saveText = [];
        this.spans = [];
        this.isFirstLoad = true;
        this.init = function (view) {
            GlobalController_1.default.checkCookie(function () {
                _this.loadData();
            });
        };
        //for data test
        this.printData = function (data, type) {
            if (type == 1)
                _this.loadText = [];
            else
                _this.saveText = [];
            data.forEach(function (rec) {
                // console.log(rec)
                var text = rec.PROCESSOPERATIONNAME + ' ' + rec.MACHINENAME + ' ';
                for (var col in rec) {
                    if (col !== 'OPERATION' && col !== 'MACHINENAME' && col !== 'PROCESSOPERATIONNAME' && col !== 'id') {
                        text += rec[col];
                    }
                }
                // console.log(text)
                if (type == 1)
                    _this.loadText.push(text);
                else {
                    _this.saveText.push(text);
                }
            });
            if (type == 0 && !_this.isFirstLoad) { //save compare
                for (var i = 0; i < _this.saveText.length; i++) {
                    if (_this.saveText[i] !== _this.loadText[i]) {
                        console.log('not equal: ' + i);
                        console.log(_this.saveText[i]);
                        console.log(_this.loadText[i]);
                    }
                }
            }
        };
        this.loadData = function () {
            var grid = $$(SetTpfompolicy_1.default.viewIds.tpfomGrid);
            var prodCombo = $$(SetTpfompolicy_1.default.viewIds.prodCombo);
            var stepCombo = $$(SetTpfompolicy_1.default.viewIds.stepCombo);
            grid.showOverlay(GlobalController_1.default.LOADING);
            grid.config.columns = SetTpfompolicy_1.default.staticCols.slice(0);
            grid.clearAll();
            SetTpfompolicyModel_1.default.selectTpfompolicy(function (rawData) {
                // console.log("loading id: "+rawData[0].PARENTID)
                //if no data
                if (rawData == null || rawData.length === 0) {
                    grid.hideOverlay();
                    return;
                }
                //set parentId of current data
                _this.currentParentId = rawData[0].PARENTID;
                //set update info
                TopViewController_1.default.setUpdateInfo(_this.currentParentId);
                var prods = alasql("select distinct PRODUCTSPECNAME from ? order by PRODUCTSPECNAME", [rawData]);
                var machs = alasql("select distinct  MACHINENAME from ?", [rawData]);
                var operas = alasql("select distinct  PROCESSOPERATIONNAME from ? order by PROCESSOPERATIONNAME", [rawData]);
                var gridData = alasql("select distinct OPERATION ,PROCESSOPERATIONNAME,MACHINENAME from ? order by PROCESSOPERATIONNAME,MACHINENAME", [rawData]);
                var id = 1;
                for (var i = 0; i < gridData.length; i++) {
                    gridData[i].id = id;
                    id += 1;
                }
                var stepComboItems = [];
                var stepComboValStr = "";
                var prodComboItems = [];
                var prodComboValStr = "";
                //operationname
                operas.forEach(function (operaObj, idx) {
                    var oper = operaObj.PROCESSOPERATIONNAME;
                    if (idx > 0)
                        stepComboValStr += "," + oper;
                    else
                        stepComboValStr += oper;
                    stepComboItems.push(oper);
                });
                //product
                prods.forEach(function (prodObj, idx) {
                    var prod = prodObj.PRODUCTSPECNAME;
                    if (idx > 0)
                        prodComboValStr += "," + prod;
                    else
                        prodComboValStr += prod;
                    prodComboItems.push(prod);
                    //add cols
                    // { id:"OPERATION",    header:["OPERATION",{ content: "textFilter" }], width:110 ,sort:"string"},
                    grid.config.columns.push({
                        id: prod,
                        header: { text: prod, css: { "text-align": "center" } },
                        width: 140,
                        css: "center",
                        editor: "checkbox",
                        // template:"{common.checkbox()}",
                        template: function (obj) {
                            return '<input class="webix_table_checkbox" type="checkbox" disabled="true" ' +
                                (obj[prod] == 1 ? 'checked' : '') + '>';
                        },
                        sort: "int"
                    });
                    //split prod records
                    var prodData = alasql("select ACTIVE  from ? where PRODUCTSPECNAME='" + prod + "' order by PROCESSOPERATIONNAME,MACHINENAME", [rawData]);
                    console.log(idx, ', ', prod + ': len= ', prodData.length);
                    for (var i = 0; i < gridData.length; i++) {
                        // gridData[i][prod] = (prodData[i].ACTIVE === 'Y')?1:0
                        if (!gridData[i] || !prodData[i]) {
                            console.log('undefined ', i);
                        }
                        gridData[i][prod] = prodData[i].ACTIVE;
                    }
                });
                stepCombo.define("options", {
                    selectAll: true,
                    data: stepComboItems
                });
                stepCombo.define("value", stepComboValStr);
                stepCombo.refresh();
                prodCombo.define("options", {
                    selectAll: true,
                    data: prodComboItems
                });
                prodCombo.define("value", prodComboValStr);
                prodCombo.refresh();
                grid.refreshColumns();
                //set rowspan
                for (var i = 0; i < operas.length; i++) {
                    _this.spans.push([i * machs.length + 1, "OPERATION", 1, machs.length, null, "rowspancenter"]);
                    _this.spans.push([i * machs.length + 1, "PROCESSOPERATIONNAME", 1, machs.length, null, "rowspancenter"]);
                }
                //test data
                // this.printData(gridData,0)
                //set data
                grid.define("data", {
                    data: gridData,
                    spans: _this.spans
                });
                // grid.define("leftSplit",3)
                // grid.addSpan(1,"PROCESSOPERATIONNAME",1,machs.length);
                grid.refresh();
                grid.hideOverlay();
            });
            _this.isFirstLoad = false;
        };
        this.onReloadBtnClick = function (id) {
            _this.loadData();
        };
        this.onSaveBtnClick = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var grid, checkAnotherVerFn, insertToSetTabFn, insertToVerTabFn, reloadFn, remainVerFn;
            var _this = this;
            return __generator(this, function (_a) {
                grid = $$(SetTpfompolicy_1.default.viewIds.tpfomGrid);
                checkAnotherVerFn = function (callback) {
                    GlobalModel_1.default.selectLatestSetTableVersion(TextStore_1.default.MODULE.PHOTO, TextStore_1.default.SET_TABLES.SET_TPFOMPOLICY, function (verObjs) {
                        var latestParentId = verObjs[0].ID;
                        callback(_this.currentParentId === latestParentId);
                    });
                };
                insertToSetTabFn = function (guid, callback) {
                    var grid = $$(SetTpfompolicy_1.default.viewIds.tpfomGrid);
                    //get data from datatable
                    var data = GlobalController_1.default.getAllDataFromGrid(grid);
                    var insertData = [];
                    var insertSqls = [];
                    data.forEach(function (row, rIdx) {
                        for (var col in row) {
                            if (col !== 'OPERATION' && col !== 'MACHINENAME' && col !== 'PROCESSOPERATIONNAME' && col !== 'id') {
                                insertData.push({
                                    PARENTID: guid,
                                    FACTORYNAME: "ARRAY",
                                    // OPERATION:row.OPERATION,
                                    PROCESSOPERATIONNAME: row.PROCESSOPERATIONNAME,
                                    MACHINENAME: row.MACHINENAME,
                                    PRODUCTSPECNAME: col,
                                    ACTIVE: (row[col] === 1) ? "Y" : "N"
                                });
                            }
                        }
                    });
                    var insertSql = "insert all ";
                    insertData.forEach(function (rec, idx) {
                        if (rec.PRODUCTSPECNAME === 'P') {
                            console.log(rec);
                        }
                        insertSql += "\n into set_tpfompolicy(PARENTID,FACTORYNAME,PROCESSOPERATIONNAME,MACHINENAME,PRODUCTSPECNAME,ACTIVE,UPDATE_TIME)\n                values('" + rec.PARENTID + "','" + rec.FACTORYNAME + "','" + rec.PROCESSOPERATIONNAME + "','" + rec.MACHINENAME + "','" + rec.PRODUCTSPECNAME + "','" + rec.ACTIVE + "',sysdate) ";
                        //insert every 300-records
                        if (idx % 300 === 299 || idx === insertData.length - 1) {
                            insertSql += "\n select * from dual";
                            insertSqls.push(insertSql);
                            insertSql = "insert all ";
                        }
                    });
                    /*
                    let promises = []
        
                    insertSqls.forEach(sql=>{
                        setTimeout(()=>{
                            promises.push(new Promise((resolve,reject)=>{
                                model.insertTpfompolicy(sql,resp=>{})
                            }))
                        },100)
                        
                    })
        
                    Promise.all(promises).then(values => {
                        console.log(values); // [3, 1337, "foo"]
                      });
        */
                    //declare recursive fn for batch insert
                    var batchInsert = function (idx) {
                        SetTpfompolicyModel_1.default.insertTpfompolicy(insertSqls[idx], function (resp) {
                            if (idx < insertSqls.length - 2) { //before last
                                batchInsert(idx + 1);
                            }
                            else { //last batch
                                //insert a new version
                                console.log('batch: ' + idx);
                                callback();
                            }
                        });
                    };
                    //start batch insert
                    batchInsert(0);
                };
                insertToVerTabFn = function (guid, callback) {
                    GlobalModel_1.default.insertVerCtrl(guid, TextStore_1.default.FACTORY.ARRAY, TextStore_1.default.MODULE.PHOTO, '', TextStore_1.default.SET_TABLES.SET_TPFOMPOLICY, GlobalStore_1.default.user, function () {
                        // let savingEdTime = new Date()
                        // let savingTime = savingEdTime.getTime()-savingStTime.getTime()
                        // console.log('saving time: '+savingTime/1000+'s')
                        callback();
                    });
                };
                reloadFn = function (callback) {
                    _this.loadData();
                    callback();
                };
                remainVerFn = function (callback) {
                    callback();
                };
                OperationController_1.default.runSavingFlow(TextStore_1.default.SET_TABLES.SET_TPFOMPOLICY, grid, checkAnotherVerFn, insertToSetTabFn, insertToVerTabFn, reloadFn, remainVerFn);
                return [2 /*return*/];
            });
        }); };
        this.onStepComboItemClick = function () {
            var combo = $$(SetTpfompolicy_1.default.viewIds.stepCombo);
            var grid = $$(SetTpfompolicy_1.default.viewIds.tpfomGrid);
            var val = combo.getValue();
            var list = (combo.getList());
            grid.filter("PROCESSOPERATIONNAME");
            console.log(val);
            var vs = val.split(/,/);
            // list.serialize().forEach(item=>{ }
            grid.filter(function (rec) {
                var step = rec.PROCESSOPERATIONNAME;
                var isMatched = false;
                vs.every(function (v) {
                    if (step === v) {
                        isMatched = true;
                        return false;
                    }
                    else {
                        return true;
                    }
                });
                if (isMatched)
                    return rec;
            });
        };
        this.onAddProdBtnClick = function () {
            var winId = "prodWin";
            if ($$(winId))
                return;
            webix.ui({
                view: "window",
                id: winId,
                height: 150,
                width: 300,
                left: 50, top: 50,
                move: true,
                // close:true,//webix 6.3 feasible
                position: "center",
                // resize: true,
                head: {
                    view: "toolbar",
                    paddingX: 10,
                    cols: [
                        {
                            view: "label",
                            label: "Add",
                            width: 120
                        },
                        {},
                        {
                            view: "button",
                            type: "icon",
                            width: 20,
                            icon: "wxi-close",
                            click: function () {
                                $$(winId).close();
                            }
                        }
                    ]
                },
                body: {
                    view: "form",
                    id: "prodForm",
                    elements: [
                        {
                            view: "text",
                            id: "prodText",
                            name: "prod",
                            label: "Product Name",
                            labelWidth: 120
                        },
                        { view: "button", value: "Add", click: function () {
                                var win = $$(winId);
                                var prodCombo = $$(SetTpfompolicy_1.default.viewIds.prodCombo);
                                if ($$("prodForm").validate()) {
                                    var grid = $$(SetTpfompolicy_1.default.viewIds.tpfomGrid);
                                    var text = $$("prodText");
                                    var newProd_1 = text.getValue();
                                    var data = grid.serialize();
                                    //add prod to data
                                    data.forEach(function (rec) {
                                        rec[newProd_1] = 0;
                                    });
                                    grid.define("data", {
                                        data: data,
                                        spans: _this.spans
                                    });
                                    //add prod to column
                                    grid.config.columns.splice(3, 0, {
                                        id: newProd_1,
                                        header: { text: newProd_1, css: { "text-align": "center" } },
                                        width: 140,
                                        editor: "checkbox",
                                        css: { "align-items": "center" },
                                        template: "{common.checkbox()}",
                                        sort: "int"
                                    });
                                    grid.refreshColumns();
                                    //add prod to combo
                                    var comboItems = prodCombo.getList().data.order;
                                    comboItems.unshift(newProd_1);
                                    var newOpt = {
                                        selectAll: true,
                                        data: comboItems
                                    };
                                    prodCombo.define("options", newOpt);
                                    var comboVal = prodCombo.config.value;
                                    comboVal += "," + newProd_1;
                                    prodCombo.define('value', comboVal);
                                    prodCombo.refresh();
                                    win.close();
                                }
                                else {
                                    webix.message({ type: "error", text: "Form data is invalid" });
                                }
                            }
                        }
                    ],
                    rules: {
                        "prod": webix.rules.isNotEmpty
                    },
                }
            }).show();
        };
        this.view = view;
    }
    SetTpfompolicyViewController.prototype.onProdComboItemClick = function (id, e) {
        var combo = $$(SetTpfompolicy_1.default.viewIds.prodCombo);
        var grid = $$(SetTpfompolicy_1.default.viewIds.tpfomGrid);
        var val = combo.getValue();
        var list = (combo.getList());
        list.serialize().forEach(function (item) {
            var hn = grid.getHeaderNode(item.id);
            if (item.$checked === 0 && hn != null)
                grid.hideColumn(item.id);
            else if (item.$checked === 1 && hn == null)
                grid.showColumn(item.id);
            // grid.refreshColumns()
        });
    };
    return SetTpfompolicyViewController;
}());
exports.SetTpfompolicyViewController = SetTpfompolicyViewController;
//# sourceMappingURL=SetTpfompolicyViewController.js.map