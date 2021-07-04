import MachineGroup from "./MachineGroup";
import {MachineGroup as mod} from "../../models/MachineGroupModel";
import gMod from "../../models/GlobalModel";
import {SetTableVO} from "../../models/VO"
import TopViewController from "../TopViewController"
import gCtrl from "../../controllers/GlobalController";
import oCtrl from "../../controllers/OperationController"
import gStore from "../../store/GlobalStore"
import txtStore from "../../store/TextStore"

declare var $$
declare var alasql

export class MachineGroupViewController{

    constructor(view:any){
        this.view = view;
    }

    view:MachineGroup
    
    static constData:Array<any>
    currentParentIds:Array<string>


    init = (view)=>{
        gCtrl.checkCookie(()=>{
            this.initGrpComboChange()
        })
    }

    onLoadBtnClick=()=>{
        this.loadData()
    }


    //根據Module取得MachineGroup資料
    loadData=()=>{
         //取得目前Module的值，getValue->取得ID，getText->取得Value
         let moduleId = $$(MachineGroup.viewIds.grpCombo).getText();

         if(moduleId==null)
            return

         //資料讀取時會顯示Loading中
         $$(MachineGroup.viewIds.machineTable).showOverlay("Loading...");
         mod.getMachineList(moduleId,output=>{
            
            var machineTable = $$(MachineGroup.viewIds.machineLayout).queryView({ view: "datatable" });

            //set current parent ID
            let idRecs = alasql("select distinct parentid from ?",[output])
            this.currentParentIds = []
            idRecs.forEach(idRec=>{
                this.currentParentIds.push(idRec.parentid)
            })

            //Data Update Info
            TopViewController.setUpdateInfo(this.currentParentIds[0])

            //Machine Groups
            let grps = alasql("SELECT DISTINCT [group] FROM ? ORDER By [group]",[output]);
            var groupname=[];
            grps.forEach((i) => {
                groupname.push(i.group);
            });

            machineTable.clearAll();
            //Set the select options of machinegroup
            let gCombo = machineTable.config.columns[2];
            gCombo.options = groupname;
            machineTable.refreshColumns();

            machineTable.parse(output);
            machineTable.refresh();
            machineTable.hideOverlay();
            
         })
    };

    //initial the view of machine group 
    initGrpComboChange=()=>{
        mod.getGrpId(grpIds=>{
			let grpCombo:webix.ui.richselect = $$(MachineGroup.viewIds.machineLayout).queryView({view:"richselect"})

			grpCombo.define("options",grpIds);
			grpCombo.refresh();
			grpCombo.setValue((<any>grpCombo.getList()).getFirstId());
            //webix.message(JSON.stringify($$(MachineGroupView.viewIds.dataTable)))
            this.loadData();
        })
    }

    onSortMachine(){
        let machineTable:webix.ui.datatable = $$(MachineGroup.viewIds.machineTable);
        //根據排序結果，重新賦值num
        machineTable.data.each(function(obj, i){
            obj.num = i+1;
        })
    }

    onEditBtnClick = (id,event)=>{
        let moduleCombo:webix.ui.richselect = $$(MachineGroup.viewIds.grpCombo);
        let editButton:webix.ui.button = $$(MachineGroup.viewIds.editButton);
        let saveButton:webix.ui.button = $$(MachineGroup.viewIds.saveButton);
        let addButton:webix.ui.button = $$(MachineGroup.viewIds.addButton);
        let delButton:webix.ui.button = $$(MachineGroup.viewIds.delButton);
        let reloadButton:webix.ui.button = $$(MachineGroup.viewIds.reloadButton);

        if($$(MachineGroup.viewIds.editButton).getValue() == "edit"){
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
            $$(MachineGroup.viewIds.machineTable).define({
                editable:true
            })    
        }
    }

    onSaveBtnClick = (id,event)=>{

        let grid:webix.ui.datatable = $$(MachineGroup.viewIds.machineTable)
        let gridData = gCtrl.getAllDataFromGrid(grid)
        let grpIds = alasql("SELECT DISTINCT [group] FROM ? ORDER BY [group]", [gridData]);
        // if no data -> return
        if(gridData == null||gridData.length == 0)
            return;

        let factory = txtStore.FACTORY.ARRAY
        let module = txtStore.MODULE.PHOTO
        let setTable = txtStore.SET_TABLES.SET_MACHINEGROUP

        let setTabVo = new SetTableVO(setTable,factory,module)


        let checkAnotherVerFn = (callback)=>{

            let grpCombo:webix.ui.richselect = $$(MachineGroup.viewIds.grpCombo);
            let moduleId = grpCombo.getText();

            gMod.selectLatestSetTableVersion(moduleId,txtStore.SET_TABLES.SET_MACHINEGROUP,verObjs=>{

                console.log(verObjs)
                console.log(this.currentParentIds)

                let isMatched = true

                verObjs.every(verObj=>{
                    let latestParentId = verObj.ID

                    let isIncluded = this.currentParentIds.includes(latestParentId)

                    isMatched = isIncluded

                    //if false break this foreach
                    return isMatched

                })

                callback(isMatched)
            })
        }

        let insertToSetTabFn = (guids,callback)=>{
            let grpCombo:webix.ui.richselect = $$(MachineGroup.viewIds.grpCombo);

            let isAllInsertCompleted = 0

            let checkInsertCompleted = setInterval(()=>{

                if(isAllInsertCompleted===grpIds.length){
                    clearInterval(checkInsertCompleted)
                    callback()
                }

            },1000)

            //get each group and save by group     
            grpIds.forEach((gprObj,idx) => {
                let insertSql = "INSERT ALL\n"
                let toolg = gprObj.group;
                // Get the data of toolg
                let data = alasql("SELECT * FROM ? WHERE [group] = ?", [gridData,toolg]);

                data.forEach((row)=>{

                    insertSql+=`INTO SET_MACHINEGROUP(PARENTID, UPDATE_TIME, FACTORYNAME, GROUPNAME, MACHINENAME) 
                    VALUES('${guids[idx]}',SYSDATE,'${row.fac}','${row.group}','${row.machine}')\n`         
                })

                insertSql += "\n select * from dual"

                mod.insertAllSetMachineGroup(insertSql,()=>{

                    let factory = gridData[0].fac           
                    let moduleid = grpCombo.getText()

                    gMod.insertSetVerCtrl(guids[idx],factory,moduleid,toolg,txtStore.SET_TABLES.SET_MACHINEGROUP,gStore.user,()=>{
                        isAllInsertCompleted++
                    })
                })
            })

        }

        let insertToVerTabFn = null

        let reloadFn = (callback)=>{
            this.loadData()
            callback()
        }

        oCtrl.runSavingFlow(setTabVo,checkAnotherVerFn,insertToSetTabFn,insertToVerTabFn,reloadFn)


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
    }

    onAddBtnClick = (id,event)=>{        
        let machineTable:webix.ui.datatable = $$(MachineGroup.viewIds.machineTable);
        // read the data of machineTable
        let gridData = machineTable.serialize();
        // get the selected item in machineTable
        let selectitem = machineTable.getSelectedItem();
        //if have selected item then add new item in selected position else add new item in top position
        let pos = 0
        if (!webix.isUndefined(selectitem)){
            pos = selectitem.num;
        }

        machineTable.select(machineTable.add({fac: gridData[0].fac, group: gridData[0].group, machine: "", orggroup:gridData[0].orggroup, parentid:gridData[0].parentid}, pos),false);
    }

    onDelBtnClick = (id,event)=>{        
        let machineTable:webix.ui.datatable = $$(MachineGroup.viewIds.machineTable);
        let selectitem = machineTable.getSelectedItem();
        //var id = machineTable.getSelectedId(true,true);

        if(webix.isUndefined(selectitem)){
            webix.message("No rows selected");
        }
        else{
            webix.confirm({
                title: "Remove",
                text: "Are you sure, you want to delete?",
                callback: function (result){
                    if (result) {
                        var selectid = selectitem.id;
                        machineTable.remove(selectid);
                    }
                }
            })
        }
    };

    checkNotEmpty(value){
        return value != "";
    };

    checkNotUnique(value){
        let machineTable:webix.ui.datatable = $$(MachineGroup.viewIds.machineTable);
        let gridData = machineTable.serialize()
        let grpIds = alasql("SELECT * FROM ? WHERE [machine] = ?", [gridData,value]);
        let cs = grpIds.length;
        if (cs == 1){
            return true;
        }
        else{
            return false;
        }
    };

    checkMachine(value){
        if (MachineGroupViewController.prototype.checkNotEmpty(value) && MachineGroupViewController.prototype.checkNotUnique(value)){
            return true;
        }else{
            return false;
        }
    };
}