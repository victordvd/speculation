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
var SetSystem_1 = require("./SetSystem");
var SetSystemModel_1 = require("../../models/SetSystemModel");
var VO_1 = require("../../models/VO");
var GlobalModel_1 = require("../../models/GlobalModel");
var GlobalController_1 = require("../../controllers/GlobalController");
var OperationController_1 = require("../../controllers/OperationController");
var GlobalStore_1 = require("../../store/GlobalStore");
var TextStore_1 = require("../../store/TextStore");
var TopViewController_1 = require("../TopViewController");
var Top_1 = require("../Top");
var SetSysViewController = /** @class */ (function () {
    function SetSysViewController(view) {
        var _this = this;
        this.isEnabledVersion = false;
        this.isAdm = false;
        this.init = function (view) {
            GlobalController_1.default.checkCookie(function () {
                if (GlobalStore_1.default.userRole == null || GlobalStore_1.default.userRole < 1)
                    return;
                // this.isAdm = gStore.userRole>=5?true:false
                GlobalModel_1.default.selectPhotoToolgId(function (grpIds) {
                    var grpCombo = $$(SetSystem_1.default.viewIds.grpCombo);
                    var items = [];
                    grpIds.forEach(function (rec) {
                        items.push(rec.TOOLG_ID);
                    });
                    grpCombo.define("options", items);
                    grpCombo.refresh();
                    grpCombo.setValue(grpCombo.getList().getFirstId());
                });
            });
        };
        this.loadData = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var rawData, grpCombo, toolgId, enableBtn, verObjs, latestId, treeTab, data, pIds, rootIdObjs, rootIds, treeData, scanPush, verInfo, nameLab;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        grpCombo = $$(SetSystem_1.default.viewIds.grpCombo);
                        toolgId = grpCombo.getValue();
                        enableBtn = $$(SetSystem_1.default.viewIds.enableBtn);
                        return [4 /*yield*/, GlobalModel_1.default.selectLatestSetTableVersionByToolg(TextStore_1.default.SET_TABLES.SET_SYSTEM, TextStore_1.default.MODULE.PHOTO, toolgId)];
                    case 1:
                        verObjs = _a.sent();
                        latestId = verObjs[0].ID;
                        if (id == null) {
                            id = latestId;
                            SetSysViewController.savingName = verObjs[0].NAME;
                        }
                        //enable or disable enableBtn
                        if (latestId == id) {
                            enableBtn.disable();
                            enableBtn.$view.title = 'This version has already enabled';
                            this.isEnabledVersion = true;
                            console.log('the version is enabled');
                        }
                        else {
                            enableBtn.enable();
                            enableBtn.$view.title = '';
                            this.isEnabledVersion = false;
                            console.log('the version is disabled');
                        }
                        return [4 /*yield*/, SetSystemModel_1.SetSystemModel.selectSetSysById(id)];
                    case 2:
                        //load data by ID
                        rawData = _a.sent();
                        treeTab = $$(SetSystem_1.default.viewIds.treeTab);
                        treeTab.clearAll();
                        if (rawData == null || rawData.length == 0)
                            return [2 /*return*/];
                        if (this.isAdm) {
                            data = rawData;
                        }
                        else {
                            //data in set_system
                            rawData = alasql("SELECT * FROM ?　WHERE PARENTID !=null", [rawData]);
                            data = rawData;
                        }
                        pIds = alasql("select PARENTID from ? where PARENTID !=null", [rawData]);
                        if (pIds.length == 0)
                            this.curParentId = null;
                        else
                            this.curParentId = pIds[0].PARENTID;
                        rootIdObjs = alasql("select ID from ? where PARENT_ID = -1", [rawData]);
                        rootIds = [];
                        rootIdObjs.forEach(function (idObj) {
                            rootIds.push(idObj.ID);
                        });
                        treeData = [];
                        scanPush = function (gdata, rec) {
                            gdata.forEach(function (trec) {
                                if (trec.ID === rec.PARENT_ID) {
                                    if (trec.data == undefined)
                                        trec.data = [];
                                    trec.data.push(rec);
                                    return;
                                }
                                else if (trec.data instanceof Array) {
                                    //recursive
                                    scanPush(trec.data, rec);
                                }
                            });
                        };
                        data.forEach(function (rawRec, idx, arr) {
                            var newRec = rawRec;
                            // let newRec = {
                            //     ID:rawRec.ID,
                            //     PARENT_ID:rawRec.PARENT_ID,
                            //     PROPERTYNO:rawRec.PROPERTYNO,
                            //     TEXT:rawRec.TEXT,
                            //     PROPERTYVALUE:rawRec.PROPERTYVALUE
                            // }
                            if (_this.isAdm) {
                                if (rawRec.PARENT_ID == -1)
                                    rawRec.PARENT_ID = 0;
                            }
                            else if (rootIds.includes(newRec.PARENT_ID)) {
                                // rawRec.PARENT_ID=0 
                            }
                            if (rawRec.PARENT_ID <= 0) {
                                treeData.push(newRec);
                            }
                            else {
                                scanPush(treeData, newRec);
                            }
                        });
                        treeTab.define("data", treeData);
                        treeTab.filter(function (row) {
                            return row.PARENT_ID >= 0;
                        });
                        treeTab.refresh();
                        return [4 /*yield*/, TopViewController_1.default.setUpdateInfoWithName(this.curParentId)];
                    case 3:
                        verInfo = _a.sent();
                        if (verInfo != null) {
                            SetSysViewController.savingName = verInfo[0].NAME;
                            nameLab = $$(SetSystem_1.default.viewIds.savingNameLab);
                            nameLab.setValue("Version: " + SetSysViewController.savingName);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        this.onGrpComboChange = function (newv, oldv) {
            _this.loadData(null);
        };
        this.onReloadBtnClick = function (id, event) {
            _this.loadData(_this.curParentId);
        };
        this.onSaveAsBtnClick = function () {
            var win = $$(SetSystem_1.default.viewIds.saveWin);
            if (win)
                return;
            var top = $$(Top_1.default.viewIds.topView);
            top.disable();
            var toolBar = [
                {
                    view: "button",
                    label: "Save&Enable",
                    width: 120,
                    click: _this.onWinSaveEnableBtnClick
                },
                {
                    view: "button",
                    label: "Save",
                    width: 120,
                    click: _this.onWinSaveBtnClick
                },
                {},
                {
                    view: "button",
                    label: "Delete",
                    width: 120,
                    click: _this.onWinDeleteBtnClick
                },
                {},
                {},
                {
                    view: "button",
                    label: "Cancel",
                    width: 120,
                    click: function () {
                        $$(SetSystem_1.default.viewIds.saveWin).close();
                    }
                }
            ];
            win = webix.ui({
                view: "window",
                id: SetSystem_1.default.viewIds.saveWin,
                move: true,
                position: "center",
                resize: true,
                width: 800,
                height: 500,
                head: {
                    view: "toolbar",
                    paddingX: 10,
                    cols: [
                        {
                            view: "label",
                            label: "Save",
                            width: 120
                        },
                        {},
                        {
                            view: "button",
                            type: "icon",
                            width: 20,
                            icon: "wxi-close",
                            click: function () {
                                $$(SetSystem_1.default.viewIds.saveWin).close();
                            }
                        }
                    ]
                },
                body: {
                    cols: [
                        {
                            rows: [
                                {
                                    view: "text",
                                    id: SetSystem_1.default.viewIds.saveNameTxt,
                                    value: SetSysViewController.savingName,
                                    label: "Version Name",
                                    labelWidth: 120
                                    // width:500
                                },
                                {
                                    view: "datatable",
                                    id: SetSystem_1.default.viewIds.saveGrid,
                                    resizeColumn: { headerOnly: true },
                                    scroll: "y",
                                    select: "row",
                                    css: "rows center",
                                    columns: [
                                        { id: "ENABLED", header: { text: "Enabled", css: { "text-align": "center" } }, width: 80, sort: "string" },
                                        // { id: "ID", header: ["ID"], width: 160 ,sort:"string"},
                                        { id: "NAME", header: ["Version Name"], width: 300, sort: "string" },
                                        { id: "UPDATE_USER", header: ["Update User"], width: 120, sort: "string" },
                                        { id: "VER_UPDATE_TIME", header: ["Update Time"], width: 160, sort: "string",
                                            format: function (value) {
                                                if (value)
                                                    return value.replace('T', ' ');
                                                else
                                                    return value;
                                            }
                                        }
                                        // { id: "UPDATE_TIME", header: ["Update Time"], width: 160 ,sort:"string"}
                                    ],
                                    on: {
                                        onItemClick: function (rowId) {
                                            var saveGrid = $$(SetSystem_1.default.viewIds.saveGrid);
                                            var nameTxt = $$(SetSystem_1.default.viewIds.saveNameTxt);
                                            var rec = saveGrid.getItem(rowId);
                                            nameTxt.setValue(rec.NAME);
                                        }
                                    },
                                    tooltip: function (obj, common) {
                                        return "<i>ID: " + obj.ID + "</i>";
                                    }
                                }
                            ]
                        },
                        {
                            rows: toolBar
                        }
                    ]
                },
                on: {
                    onDestruct: function () {
                        var top = $$(Top_1.default.viewIds.topView);
                        top.enable();
                    }, onShow: function () { return __awaiter(_this, void 0, void 0, function () {
                        var grpCombo, allVerData, nameData, grid;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    grpCombo = $$(SetSystem_1.default.viewIds.grpCombo);
                                    return [4 /*yield*/, SetSystemModel_1.SetSystemModel.getAllVersion(grpCombo.getValue())];
                                case 1:
                                    allVerData = _a.sent();
                                    if (allVerData.length == 0)
                                        return [2 /*return*/];
                                    //record constant verisons
                                    this.constVers = alasql("column of select NAME from ? where CONST = 'Y'", [allVerData]);
                                    nameData = alasql("select distinct ID,NAME from ?", [allVerData]);
                                    SetSysViewController.savingNameObj = {};
                                    nameData.forEach(function (rec) {
                                        SetSysViewController.savingNameObj[rec.NAME] = rec.ID;
                                    });
                                    console.log('saving list:', SetSysViewController.savingNameObj);
                                    grid = $$(SetSystem_1.default.viewIds.saveGrid);
                                    grid.clearAll();
                                    grid.parse(allVerData);
                                    grid.refresh();
                                    return [2 /*return*/];
                            }
                        });
                    }); }
                }
            }).show();
        };
        this.onSaveBtnClick = function (id, event) {
            var grid = $$(SetSystem_1.default.viewIds.treeTab);
            var grpCombo = $$(SetSystem_1.default.viewIds.grpCombo);
            var toolgId = grpCombo.getValue();
            if (!grid.validate()) {
                webix.alert({
                    title: "Invalid",
                    cancel: "Cancel",
                    text: "Data invalid!"
                });
                return;
            }
            var factory = TextStore_1.default.FACTORY.ARRAY;
            var module = TextStore_1.default.MODULE.PHOTO;
            var setTable = TextStore_1.default.SET_TABLES.SET_SYSTEM;
            var setTabVo = new VO_1.SetTableVO(setTable, factory, module);
            var checkAnotherVerFn = function (callback) { return __awaiter(_this, void 0, void 0, function () {
                var verObjs, latestParentId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.curParentId)
                                callback(true);
                            return [4 /*yield*/, GlobalModel_1.default.selectLatestSetTableVersionByToolg(TextStore_1.default.SET_TABLES.SET_SYSTEM, TextStore_1.default.MODULE.PHOTO, toolgId)];
                        case 1:
                            verObjs = _a.sent();
                            latestParentId = verObjs[0].ID;
                            console.log(this.curParentId + '|' + latestParentId);
                            callback(this.curParentId === latestParentId);
                            return [2 /*return*/];
                    }
                });
            }); };
            var insertToSetTabFn = function (guid, callback) {
                var gridData = GlobalController_1.default.getAllDataFromGrid(grid);
                var data = [];
                //push consist configs
                // if(!this.isAdm)
                //     SetSysViewController.constData.forEach(rec=>{
                //         data.push(new SetSysVO(rec.PROPERTYNO,rec.PROPERTYVALUE))
                //     })
                // data.push(new SetSysVO("Customer","BOE"))
                // data.push(new SetSysVO("Module","PHOTO"))
                // data.push(new SetSysVO("TOOLG",toolgId))
                //collect data
                var recurPush = function (rec) {
                    rec.forEach(function (row) {
                        var val = row.PROPERTYVALUE;
                        if (val == null || val.trim() == '') {
                            var defa = row.DEFAULT_VAL;
                            if (defa != null) {
                                val = defa;
                            }
                            else {
                                val = null;
                            }
                        }
                        data.push(new VO_1.SetSysVO(row.PROPERTYNO, val));
                        if (row.data != null && row.data.length > 0) {
                            recurPush(row.data);
                        }
                    });
                };
                recurPush(gridData);
                SetSystemModel_1.SetSystemModel.insertSetSystem(guid, data, function () {
                    callback();
                });
            };
            var insertToVerTabFn = function (guid, callback) {
                GlobalModel_1.default.insertSetVerCtrl(guid, TextStore_1.default.FACTORY.ARRAY, TextStore_1.default.MODULE.PHOTO, toolgId, TextStore_1.default.SET_TABLES.SET_SYSTEM, GlobalStore_1.default.user, function () {
                    callback();
                });
            };
            var reloadFn = function (callback) {
                _this.loadData(null);
                callback();
            };
            OperationController_1.default.runSavingFlow(setTabVo, checkAnotherVerFn, insertToSetTabFn, insertToVerTabFn, reloadFn);
            //old
            /*
            let cnfmBox:any = webix.confirm({
                title:"Save",
                ok:"Yes",
                cancel:"No",
                text:"Are you sure to alter setting?"
            })
            
            cnfmBox.then(function(result){
                
                let grpCombo:webix.ui.richselect = $$(SetSystem.viewIds.grpCombo)
                let tt:webix.ui.treetable = $$(SetSystem.viewIds.treeTab)
                let toolgId = grpCombo.getValue()
    
                // let els = document.getElementsByTagName('input')
                let gridData = tt.serialize()
    
                if(gridData==null||gridData.length===0)
                    return;
    
                let data:Array<SetSysVO> = []
                let parentId:string = gridData[0].PARENTID
        
                let exeSave = ()=>{
                    gMod.getGUID(guid=>{
    
                        let insertCnt = 0
    
                        gMod.insertVerCtrl(guid,'ARRAY','PHOTO',toolgId,'SET_SYSTEM','GUI',
                            model.insertSetSystem(guid,data,()=>{
                                insertCnt++
                                if(insertCnt===data.length)
                                    webix.message("Save successfully")
                        }))
                    })
                }
    
                //push consist configs
                SetSysViewController.constData.forEach(rec=>{
                    data.push(new SetSysVO(rec.PROPERTYNO,rec.PROPERTYVALUE))
                })
    
                // data.push(new SetSysVO("Customer","BOE"))
                // data.push(new SetSysVO("Module","PHOTO"))
                // data.push(new SetSysVO("TOOLG",toolgId))
                
                //collect data
                let recurPush=(rec)=>{
                    rec.forEach(row=>{
                        data.push(new SetSysVO(row.PROPERTYNO,row.PROPERTYVALUE))
    
                        if(row.data!=null&&row.data.length>0){
                            recurPush(row.data)
                        }
                    })
                }
    
                recurPush(gridData)
        
                console.log(data)
        
                //If any step incur exception ,Actions Can't Be Rollback!!!!!!!!!!!!!!!!!
                model.getNewestVersion(toolgId,latestIdObj=>{
    
                    let latestId:string = latestIdObj[0].ID
                    //check if latest version
                    if(parentId!==latestId){
                        
                        let msgBox:any = webix.confirm({
                            title:"New Version",
                            ok:"Yes",
                            cancel:"No",
                            text:"Another new version created ,are you sure to overwrite it?"
                        })
                        msgBox.then(function(result){
                            exeSave()
                        })
                    }else{
                        exeSave()
                    }
    
                })
            })
            */
        };
        this.onLoadBtnClick = function () {
            var win = $$(SetSystem_1.default.viewIds.loadWin);
            if (win)
                return;
            var top = $$(Top_1.default.viewIds.topView);
            top.disable();
            win = webix.ui({
                view: "window",
                id: SetSystem_1.default.viewIds.loadWin,
                move: true,
                position: "center",
                resize: true,
                width: 680,
                height: 500,
                head: {
                    view: "toolbar",
                    paddingX: 10,
                    cols: [
                        {
                            view: "label",
                            label: "Load",
                            width: 120
                        },
                        {},
                        {
                            view: "button",
                            type: "icon",
                            width: 20,
                            icon: "wxi-close",
                            click: function () {
                                $$(SetSystem_1.default.viewIds.loadWin).close();
                            }
                        }
                    ]
                },
                body: {
                    rows: [
                        {
                            view: "datatable",
                            id: SetSystem_1.default.viewIds.loadGrid,
                            scroll: "y",
                            resizeColumn: { headerOnly: true },
                            select: "row",
                            css: "rows center",
                            columns: [
                                { id: "ENABLED", header: { text: "Enabled", css: { "text-align": "center" } }, width: 80, sort: "string" },
                                // { id: "ID", header: ["ID"], width: 160 ,sort:"string"},
                                { id: "NAME", header: ["Version Name"], width: 300, sort: "string" },
                                { id: "UPDATE_USER", header: ["Update User"], width: 120, sort: "string" },
                                { id: "VER_UPDATE_TIME", header: ["Update Time"], width: 160, sort: "string",
                                    format: function (value) {
                                        if (value)
                                            return value.replace('T', ' ');
                                        else
                                            return value;
                                    }
                                }
                                // { id: "UPDATE_TIME", header: ["Update Time"], width: 160 ,sort:"string"}
                            ],
                            tooltip: function (obj, common) {
                                return "<i>ID: " + obj.ID + "</i>";
                            }
                        },
                        {
                            cols: [
                                {},
                                {
                                    view: "button",
                                    type: "icon",
                                    icon: "wxi-check",
                                    label: "OK",
                                    width: 100,
                                    click: function () {
                                        var loadGrid = $$(SetSystem_1.default.viewIds.loadGrid);
                                        var sel = loadGrid.getSelectedId();
                                        if (!sel) {
                                            webix.message("Please select a row.");
                                            return;
                                        }
                                        var rec = loadGrid.getItem(sel);
                                        // let enabled = rec.ENABLED
                                        var id = rec.ID;
                                        _this.loadData(id);
                                        // let enableBtn:webix.ui.button = $$(SetSystem.viewIds.enableBtn)
                                        // //if enabled ,there's no need to enable again
                                        // if(enabled){
                                        //     enableBtn.disable()
                                        //     enableBtn.$view.title = 'This version has already enabled'
                                        // }else{
                                        //     enableBtn.enable()
                                        //     enableBtn.$view.title = ''
                                        // }
                                        $$(SetSystem_1.default.viewIds.loadWin).close();
                                    }
                                },
                                {
                                    view: "button",
                                    type: "icon",
                                    icon: "wxi-close",
                                    label: "Cancel",
                                    width: 100,
                                    click: function () {
                                        $$(SetSystem_1.default.viewIds.loadWin).close();
                                    }
                                }
                            ]
                        }
                    ]
                },
                on: {
                    onDestruct: function () {
                        var top = $$(Top_1.default.viewIds.topView);
                        top.enable();
                    },
                    onShow: function () { return __awaiter(_this, void 0, void 0, function () {
                        var grpCombo, allVerData, grid;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    grpCombo = $$(SetSystem_1.default.viewIds.grpCombo);
                                    return [4 /*yield*/, SetSystemModel_1.SetSystemModel.getAllVersion(grpCombo.getValue())];
                                case 1:
                                    allVerData = _a.sent();
                                    if (allVerData.length == 0)
                                        return [2 /*return*/];
                                    grid = $$(SetSystem_1.default.viewIds.loadGrid);
                                    grid.clearAll();
                                    grid.parse(allVerData);
                                    grid.refresh();
                                    return [2 /*return*/];
                            }
                        });
                    }); }
                }
            }).show();
        };
        this.onToggleChange = function () {
            var editModeTog = $$(SetSystem_1.default.viewIds.editModeTog);
            var grpCombo = $$(SetSystem_1.default.viewIds.grpCombo);
            var enableBtn = $$(SetSystem_1.default.viewIds.enableBtn);
            var resetBtn = $$(SetSystem_1.default.viewIds.resetBtn);
            var loadBtn = $$(SetSystem_1.default.viewIds.loadBtn);
            var saveAsBtn = $$(SetSystem_1.default.viewIds.saveAsBtn);
            // let saveBtn = $$(SetSystem.viewIds.saveBtn)
            var tree = $$(SetSystem_1.default.viewIds.treeTab);
            var editorCells = [].slice.call(document.getElementsByClassName('webix_column webix_last')[0].children);
            //edit mode
            if (editModeTog.getValue() == 1) {
                grpCombo.disable();
                enableBtn.hide();
                loadBtn.hide();
                resetBtn.show();
                saveAsBtn.show();
                // saveBtn.show()
                editorCells.forEach(function (el) {
                    el.firstChild.disabled = false;
                });
            }
            else {
                //reload data
                _this.loadData(_this.curParentId);
                grpCombo.enable();
                loadBtn.show();
                enableBtn.show();
                resetBtn.hide();
                saveAsBtn.hide();
                // saveBtn.hide()
                editorCells.forEach(function (el) {
                    el.firstChild.disabled = true;
                });
            }
        };
        this.onWinSaveEnableBtnClick = function () {
            var nameTxt = $$(SetSystem_1.default.viewIds.saveNameTxt);
            var name = nameTxt.getValue();
            if (_this.constVers.includes(name)) {
                webix.message("Can not overwrite constant version!");
                return;
            }
            var isVerEnabled = true;
            var isAlter = SetSysViewController.savingName == name;
            //if the version is already enabled
            _this.savingFlow(isVerEnabled, isAlter);
        };
        this.onWinSaveBtnClick = function () {
            var nameTxt = $$(SetSystem_1.default.viewIds.saveNameTxt);
            var name = nameTxt.getValue();
            if (_this.constVers.includes(name)) {
                webix.message("Can not overwrite constant version!");
                return;
            }
            // save identical version
            var isAlterSameVer = SetSysViewController.savingName == name;
            //if the version is already enabled , make it enabled
            var isVerEnabled = (isAlterSameVer && _this.isEnabledVersion);
            _this.savingFlow(isVerEnabled, isAlterSameVer);
        };
        this.savingFlow = function (enabled, alterOnly) {
            var nameTxt = $$(SetSystem_1.default.viewIds.saveNameTxt);
            var name = nameTxt.getValue();
            if (!name) {
                webix.alert({
                    text: 'Please input "Version Name".'
                });
                return;
            }
            var savingNames = Object.getOwnPropertyNames(SetSysViewController.savingNameObj);
            if (alterOnly) { //if alter an enabled version setting
                _this.saveData_overwrite(name, enabled);
            }
            else if (savingNames.includes(name)) { //if duplicate saving name
                webix.confirm({
                    title: 'Name duplicated',
                    ok: "No",
                    cancel: "Yes",
                    text: "There's another version named \"" + name + "\", do you want to overwrite it?",
                    callback: function (result) {
                        //"Yes"
                        if (!result) {
                            _this.saveData_overwrite(name, enabled);
                        }
                        else {
                        }
                    }
                });
            }
            else {
                _this.saveData_new(name, enabled);
            }
        };
        this.onWinDeleteBtnClick = function () {
            var grid = $$(SetSystem_1.default.viewIds.saveGrid);
            grid.editCancel(); //avoid exception of updateItem
            var sel = grid.getSelectedId();
            if (!sel)
                return;
            var rec = grid.getItem(sel);
            var selId = rec.ID;
            var selName = rec.NAME;
            if (_this.curParentId == selId) {
                webix.message("Can not delete current version!");
                return;
            }
            else if (_this.constVers.includes(selName)) {
                webix.message("Can not delete constant version!");
                return;
            }
            webix.confirm({
                title: 'Delete',
                ok: "No",
                cancel: "Yes",
                text: "Are you sure to delete \"" + selName + "\" ? The version will not be restored any more.",
                callback: function (result) {
                    //"Yes"
                    if (!result) {
                        SetSystemModel_1.SetSystemModel.deleteData(selId, function () {
                            SetSystemModel_1.SetSystemModel.deleteVersion(selId, function () {
                                //remove row in grid
                                grid.remove(sel.id);
                            });
                        });
                    }
                    else { }
                }
            });
        };
        this.saveData_new = function (verName, enabled) {
            console.log('new saving: ', verName, ' ,enabled: ', enabled);
            var grid = $$(SetSystem_1.default.viewIds.treeTab);
            var grpCombo = $$(SetSystem_1.default.viewIds.grpCombo);
            var toolgId = grpCombo.getValue();
            var verId = null;
            // if(!grid.validate()){
            //     webix.alert({
            //         title:"Invalid",
            //         cancel:"Cancel",
            //         text: "Data invalid!"
            //       })
            //     return
            // }
            var factory = TextStore_1.default.FACTORY.ARRAY;
            var module = TextStore_1.default.MODULE.PHOTO;
            var setTable = TextStore_1.default.SET_TABLES.SET_SYSTEM;
            var setTabVo = new VO_1.SetTableVO(setTable, factory, module);
            var checkAnotherVerFn = function (callback) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    //close saving window
                    $$(SetSystem_1.default.viewIds.saveWin).close();
                    callback(true);
                    return [2 /*return*/];
                });
            }); };
            var insertToSetTabFn = function (guid, callback) {
                verId = guid;
                var gridData = GlobalController_1.default.getAllDataFromGrid(grid);
                var data = [];
                //collect data
                var recurPush = function (rec) {
                    rec.forEach(function (row) {
                        var val = row.PROPERTYVALUE;
                        if (val == null || val.trim() == '') {
                            var defa = row.DEFAULT_VAL;
                            if (defa != null) {
                                val = defa;
                            }
                            else {
                                val = null;
                            }
                        }
                        data.push(new VO_1.SetSysVO(row.PROPERTYNO, val));
                        if (row.data != null && row.data.length > 0) {
                            recurPush(row.data);
                        }
                    });
                };
                recurPush(gridData);
                SetSystemModel_1.SetSystemModel.insertSetSystem(guid, data, function () {
                    callback();
                });
            };
            var insertToVerTabFn = function (guid, callback) {
                GlobalModel_1.default.insertVerCtrlWithName(guid, factory, module, toolgId, setTable, GlobalStore_1.default.user, verName, enabled, function () {
                    callback();
                });
            };
            var reloadFn = function (callback) {
                _this.loadData(verId);
                // if(enabled)
                //     $$(SetSystem.viewIds.enableBtn).disable()
                callback();
            };
            OperationController_1.default.runSavingFlow(setTabVo, checkAnotherVerFn, insertToSetTabFn, insertToVerTabFn, reloadFn);
        };
        this.saveData_overwrite = function (verName, enabled) {
            console.log('overwrite saving: ', verName, ' ,enabled: ', enabled);
            //undo
            var grid = $$(SetSystem_1.default.viewIds.treeTab);
            // let grpCombo:webix.ui.richselect = $$(SetSystem.viewIds.grpCombo)
            // let toolgId = grpCombo.getValue()
            // if(!grid.validate()){
            //     webix.alert({
            //         title:"Invalid",
            //         cancel:"Cancel",
            //         text: "Data invalid!"
            //       })
            //     return
            // }
            var factory = TextStore_1.default.FACTORY.ARRAY;
            var module = TextStore_1.default.MODULE.PHOTO;
            var setTable = TextStore_1.default.SET_TABLES.SET_SYSTEM;
            var setTabVo = new VO_1.SetTableVO(setTable, factory, module);
            var verId = null;
            //there's no process ,skip
            var checkAnotherVerFn = function (callback) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    //close saving window
                    $$(SetSystem_1.default.viewIds.saveWin).close();
                    callback(true);
                    return [2 /*return*/];
                });
            }); };
            var insertToSetTabFn = function (guid, callback) {
                verId = guid;
                var gridData = GlobalController_1.default.getAllDataFromGrid(grid);
                var data = [];
                //collect data
                var recurPush = function (rec) {
                    rec.forEach(function (row) {
                        var val = row.PROPERTYVALUE;
                        if (val == null || val.trim() == '') {
                            var defa = row.DEFAULT_VAL;
                            if (defa != null) {
                                val = defa;
                            }
                            else {
                                val = null;
                            }
                        }
                        data.push(new VO_1.SetSysVO(row.PROPERTYNO, val));
                        if (row.data != null && row.data.length > 0) {
                            recurPush(row.data);
                        }
                    });
                };
                recurPush(gridData);
                SetSystemModel_1.SetSystemModel.insertSetSystem(guid, data, function () {
                    callback();
                });
            };
            var insertToVerTabFn = function (guid, callback) {
                var oldId = null;
                //find original id
                for (var p in SetSysViewController.savingNameObj) {
                    if (verName == p) {
                        oldId = SetSysViewController.savingNameObj[p];
                        break;
                    }
                }
                //overwrite original record
                GlobalModel_1.default.overwriteVerCtrl(oldId, guid, GlobalStore_1.default.user, enabled, function () {
                    //delete data of original ID
                    SetSystemModel_1.SetSystemModel.deleteData(oldId, callback);
                });
            };
            var reloadFn = function (callback) {
                _this.loadData(verId);
                if (enabled)
                    $$(SetSystem_1.default.viewIds.enableBtn).disable();
                callback();
            };
            OperationController_1.default.runSavingFlow(setTabVo, checkAnotherVerFn, insertToSetTabFn, insertToVerTabFn, reloadFn);
        };
        this.onEnableBtnClick = function () {
            webix.confirm({
                title: 'Enable',
                ok: "No",
                cancel: "Yes",
                text: "Are you sure to enable \"" + SetSysViewController.savingName + "\" ?",
                callback: function (result) {
                    //"Yes"
                    if (!result) {
                        var enableBtn = $$(SetSystem_1.default.viewIds.enableBtn);
                        enableBtn.disable();
                        enableBtn.$view.title = 'This version has already enabled';
                        SetSystemModel_1.SetSystemModel.enableVersion(_this.curParentId, function () { });
                    }
                    else { }
                }
            });
        };
        this.view = view;
    }
    SetSysViewController.prototype.afterLoad = function (data) {
        var grpIds = alasql("SELECT DISTINCT TOOLG_ID FROM ? ORDER BY TOOLG_ID", [data]);
        var options = [];
        grpIds.forEach(function (i) {
            options.push(i.TOOLG_ID);
        });
        var grpCombo = $$(SetSystem_1.default.viewIds.grpCombo);
        grpCombo.define("options", options);
        var grpId = grpCombo.getList().getFirstId();
        grpCombo.refresh();
        grpCombo.setValue(grpId);
    };
    return SetSysViewController;
}());
exports.SetSysViewController = SetSysViewController;
//# sourceMappingURL=SetSystemViewController.js.map