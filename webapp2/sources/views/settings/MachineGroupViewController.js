"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MachineGroup_1 = require("./MachineGroup");
var MachineGroupModel_1 = require("../../models/MachineGroupModel");
var GlobalModel_1 = require("../../models/GlobalModel");
var VO_1 = require("../../models/VO");
var TopViewController_1 = require("../TopViewController");
var GlobalController_1 = require("../../controllers/GlobalController");
var OperationController_1 = require("../../controllers/OperationController");
var GlobalStore_1 = require("../../store/GlobalStore");
var TextStore_1 = require("../../store/TextStore");
var MachineGroupViewController = /** @class */ (function () {
    function MachineGroupViewController(view) {
        var _this = this;
        this.init = function (view) {
            GlobalController_1.default.checkCookie(function () {
                _this.initGrpComboChange();
            });
        };
        this.onLoadBtnClick = function () {
            _this.loadData();
        };
        //根據Module取得MachineGroup資料
        this.loadData = function () {
            //取得目前Module的值，getValue->取得ID，getText->取得Value
            var moduleId = $$(MachineGroup_1.default.viewIds.grpCombo).getText();
            if (moduleId == null)
                return;
            //資料讀取時會顯示Loading中
            $$(MachineGroup_1.default.viewIds.machineTable).showOverlay("Loading...");
            MachineGroupModel_1.MachineGroup.getMachineList(moduleId, function (output) {
                var machineTable = $$(MachineGroup_1.default.viewIds.machineLayout).queryView({ view: "datatable" });
                //set current parent ID
                var idRecs = alasql("select distinct parentid from ?", [output]);
                _this.currentParentIds = [];
                idRecs.forEach(function (idRec) {
                    _this.currentParentIds.push(idRec.parentid);
                });
                //Data Update Info
                TopViewController_1.default.setUpdateInfo(_this.currentParentIds[0]);
                //Machine Groups
                var grps = alasql("SELECT DISTINCT [group] FROM ? ORDER By [group]", [output]);
                var groupname = [];
                grps.forEach(function (i) {
                    groupname.push(i.group);
                });
                machineTable.clearAll();
                //Set the select options of machinegroup
                var gCombo = machineTable.config.columns[2];
                gCombo.options = groupname;
                machineTable.refreshColumns();
                machineTable.parse(output);
                machineTable.refresh();
                machineTable.hideOverlay();
            });
        };
        //initial the view of machine group 
        this.initGrpComboChange = function () {
            MachineGroupModel_1.MachineGroup.getGrpId(function (grpIds) {
                var grpCombo = $$(MachineGroup_1.default.viewIds.machineLayout).queryView({ view: "richselect" });
                grpCombo.define("options", grpIds);
                grpCombo.refresh();
                grpCombo.setValue(grpCombo.getList().getFirstId());
                //webix.message(JSON.stringify($$(MachineGroupView.viewIds.dataTable)))
                _this.loadData();
            });
        };
        this.onEditBtnClick = function (id, event) {
            var moduleCombo = $$(MachineGroup_1.default.viewIds.grpCombo);
            var editButton = $$(MachineGroup_1.default.viewIds.editButton);
            var saveButton = $$(MachineGroup_1.default.viewIds.saveButton);
            var addButton = $$(MachineGroup_1.default.viewIds.addButton);
            var delButton = $$(MachineGroup_1.default.viewIds.delButton);
            var reloadButton = $$(MachineGroup_1.default.viewIds.reloadButton);
            if ($$(MachineGroup_1.default.viewIds.editButton).getValue() == "edit") {
                //不能再選擇Module
                moduleCombo.disable();
                //隱藏編輯按鈕
                editButton.hide();
                reloadButton.hide();
                //顯示儲存按鈕
                saveButton.show();
                addButton.show();
                delButton.show();
                //將下方呈現表格更改為可編輯資料
                $$(MachineGroup_1.default.viewIds.machineTable).define({
                    editable: true
                });
            }
        };
        this.onSaveBtnClick = function (id, event) {
            var grid = $$(MachineGroup_1.default.viewIds.machineTable);
            var gridData = GlobalController_1.default.getAllDataFromGrid(grid);
            var grpIds = alasql("SELECT DISTINCT [group] FROM ? ORDER BY [group]", [gridData]);
            // if no data -> return
            if (gridData == null || gridData.length == 0)
                return;
            var factory = TextStore_1.default.FACTORY.ARRAY;
            var module = TextStore_1.default.MODULE.PHOTO;
            var setTable = TextStore_1.default.SET_TABLES.SET_MACHINEGROUP;
            var setTabVo = new VO_1.SetTableVO(setTable, factory, module);
            var checkAnotherVerFn = function (callback) {
                var grpCombo = $$(MachineGroup_1.default.viewIds.grpCombo);
                var moduleId = grpCombo.getText();
                GlobalModel_1.default.selectLatestSetTableVersion(moduleId, TextStore_1.default.SET_TABLES.SET_MACHINEGROUP, function (verObjs) {
                    console.log(verObjs);
                    console.log(_this.currentParentIds);
                    var isMatched = true;
                    verObjs.every(function (verObj) {
                        var latestParentId = verObj.ID;
                        var isIncluded = _this.currentParentIds.includes(latestParentId);
                        isMatched = isIncluded;
                        //if false break this foreach
                        return isMatched;
                    });
                    callback(isMatched);
                });
            };
            var insertToSetTabFn = function (guids, callback) {
                var grpCombo = $$(MachineGroup_1.default.viewIds.grpCombo);
                var isAllInsertCompleted = 0;
                var checkInsertCompleted = setInterval(function () {
                    if (isAllInsertCompleted === grpIds.length) {
                        clearInterval(checkInsertCompleted);
                        callback();
                    }
                }, 1000);
                //get each group and save by group     
                grpIds.forEach(function (gprObj, idx) {
                    var insertSql = "INSERT ALL\n";
                    var toolg = gprObj.group;
                    // Get the data of toolg
                    var data = alasql("SELECT * FROM ? WHERE [group] = ?", [gridData, toolg]);
                    data.forEach(function (row) {
                        insertSql += "INTO SET_MACHINEGROUP(PARENTID, UPDATE_TIME, FACTORYNAME, GROUPNAME, MACHINENAME) \n                    VALUES('" + guids[idx] + "',SYSDATE,'" + row.fac + "','" + row.group + "','" + row.machine + "')\n";
                    });
                    insertSql += "\n select * from dual";
                    MachineGroupModel_1.MachineGroup.insertAllSetMachineGroup(insertSql, function () {
                        var factory = gridData[0].fac;
                        var moduleid = grpCombo.getText();
                        GlobalModel_1.default.insertSetVerCtrl(guids[idx], factory, moduleid, toolg, TextStore_1.default.SET_TABLES.SET_MACHINEGROUP, GlobalStore_1.default.user, function () {
                            isAllInsertCompleted++;
                        });
                    });
                });
            };
            var insertToVerTabFn = null;
            var reloadFn = function (callback) {
                _this.loadData();
                callback();
            };
            OperationController_1.default.runSavingFlow(setTabVo, checkAnotherVerFn, insertToSetTabFn, insertToVerTabFn, reloadFn);
            /*old*/
            /*
            let machineTable:webix.ui.datatable = $$(MachineGroup.viewIds.machineTable);
    
            oCtrl.confirmSaving(function(result){
                
                let grpCombo:webix.ui.richselect = $$(MachineGroup.viewIds.grpCombo);
                
                // read the data of machineTable
                let gridData = gCtrl.getAllDataFromGrid(machineTable)
                // if no data -> return
                if(gridData == null||gridData.length == 0)
                    return;
                
                let oldParentId:string = this.currentParentId; //machineTable.parentid in reading data
                let factory = gridData[0].fac;
                let comToolg = gridData[0].orggroup;
                let moduleid = grpCombo.getText();
                let table = txtStore.SET_TABLES.SET_MACHINEGROUP
                let user = gStore.user;
    
                //save function
                let exeSave = ()=>{
    
                    let grpIds = alasql("SELECT DISTINCT [group] FROM ? ORDER BY [group]", [gridData]);
                    //get each group and save by group
                    grpIds.forEach((i) => {
                        let toolg = i.group;
                        // Get the data of toolg
                        let saveddata = alasql("SELECT * FROM ? WHERE [group] = ?", [gridData,toolg]);
    
                        // Push data to save array(data)
                        let data:Array<SetMachineVO> = [];
                        saveddata.forEach(row=>{
                            data.push(new SetMachineVO(row.fac,row.group,row.machine))
                        })
    
                        gMod.getGUID(guid=>{
                            //get new parentid
                            let insertCnt = 0
        
                            gMod.insertVerCtrl(guid,factory,moduleid,toolg,table,user,
                                mod.insertSetMachineGroup(guid,data,()=>{
                                    insertCnt++;
                                    if(insertCnt == data.length){
                                        this.onLoadBtnClick();
                                    }
                            }))
                        })
                    })
                }
                
                mod.getNewestVersion(table,moduleid,comToolg,latestIdObj=>{
                    let latestId:string = latestIdObj[0].ID
                    //check if latest version
                    if(oldParentId != latestId){
                        let msgBox:any = webix.confirm({
                            title:"New Version",
                            ok:"Yes",
                            cancel:"No",
                            text:"Another new version created ,are you sure to overwrite it?"
                        })
                        msgBox.then(function(result){
                            exeSave();
                        })
                    }else{
                        exeSave();
                    }
                });
            });
            */
        };
        this.onAddBtnClick = function (id, event) {
            var machineTable = $$(MachineGroup_1.default.viewIds.machineTable);
            // read the data of machineTable
            var gridData = machineTable.serialize();
            // get the selected item in machineTable
            var selectitem = machineTable.getSelectedItem();
            //if have selected item then add new item in selected position else add new item in top position
            var pos = 0;
            if (!webix.isUndefined(selectitem)) {
                pos = selectitem.num;
            }
            machineTable.select(machineTable.add({ fac: gridData[0].fac, group: gridData[0].group, machine: "", orggroup: gridData[0].orggroup, parentid: gridData[0].parentid }, pos), false);
        };
        this.onDelBtnClick = function (id, event) {
            var machineTable = $$(MachineGroup_1.default.viewIds.machineTable);
            var selectitem = machineTable.getSelectedItem();
            //var id = machineTable.getSelectedId(true,true);
            if (webix.isUndefined(selectitem)) {
                webix.message("No rows selected");
            }
            else {
                webix.confirm({
                    title: "Remove",
                    text: "Are you sure, you want to delete?",
                    callback: function (result) {
                        if (result) {
                            var selectid = selectitem.id;
                            machineTable.remove(selectid);
                        }
                    }
                });
            }
        };
        this.view = view;
    }
    MachineGroupViewController.prototype.onSortMachine = function () {
        var machineTable = $$(MachineGroup_1.default.viewIds.machineTable);
        //根據排序結果，重新賦值num
        machineTable.data.each(function (obj, i) {
            obj.num = i + 1;
        });
    };
    MachineGroupViewController.prototype.checkNotEmpty = function (value) {
        return value != "";
    };
    ;
    MachineGroupViewController.prototype.checkNotUnique = function (value) {
        var machineTable = $$(MachineGroup_1.default.viewIds.machineTable);
        var gridData = machineTable.serialize();
        var grpIds = alasql("SELECT * FROM ? WHERE [machine] = ?", [gridData, value]);
        var cs = grpIds.length;
        if (cs == 1) {
            return true;
        }
        else {
            return false;
        }
    };
    ;
    MachineGroupViewController.prototype.checkMachine = function (value) {
        if (MachineGroupViewController.prototype.checkNotEmpty(value) && MachineGroupViewController.prototype.checkNotUnique(value)) {
            return true;
        }
        else {
            return false;
        }
    };
    ;
    return MachineGroupViewController;
}());
exports.MachineGroupViewController = MachineGroupViewController;
//# sourceMappingURL=MachineGroupViewController.js.map