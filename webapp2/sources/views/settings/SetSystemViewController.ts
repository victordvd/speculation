import SetSystem from "./SetSystem"
import {SetSystemModel as model} from "../../models/SetSystemModel"
import  {SetSysVO,SetTableVO} from "../../models/VO"
import gMod from "../../models/GlobalModel"
import gCtrl from "../../controllers/GlobalController"
import oCtrl from "../../controllers/OperationController"
import gStore from "../../store/GlobalStore"
import txtStore from "../../store/TextStore"
import TopViewController from "../TopViewController"
import Top from "../Top"

declare var $$
declare var alasql

export class SetSysViewController{

    constructor(view:any){
        this.view = view;
    }

    view:SetSystem
    curParentId:string
    static savingName:string
    static savingNameObj:object//{ID:NAME}
    constVers:Array<any>//[NAME]

    isEnabledVersion:boolean = false

    isAdm = false
    

    init = (view) =>{
        gCtrl.checkCookie(()=>{

            if(gStore.userRole==null||gStore.userRole<1)
                return

            // this.isAdm = gStore.userRole>=5?true:false

            gMod.selectPhotoToolgId(grpIds=>{
                let grpCombo:webix.ui.richselect = $$(SetSystem.viewIds.grpCombo)

                let items = []

                grpIds.forEach(rec=>{

                    items.push(rec.TOOLG_ID)
                })

                grpCombo.define("options",items)
                grpCombo.refresh()
                grpCombo.setValue((<any>grpCombo.getList()).getFirstId())
            })
        })
	}

    afterLoad(data) {

        let grpIds = alasql("SELECT DISTINCT TOOLG_ID FROM ? ORDER BY TOOLG_ID", [data])

        let options = [];
        grpIds.forEach((i) => {
            options.push(i.TOOLG_ID);
        });

        let grpCombo = $$(SetSystem.viewIds.grpCombo)
        grpCombo.define("options", options)

        let grpId = grpCombo.getList().getFirstId()
        grpCombo.refresh()
        grpCombo.setValue(grpId)
    }

    loadData = async (id)=>{

        let rawData:any
        
        let grpCombo:webix.ui.richselect = $$(SetSystem.viewIds.grpCombo)
        let toolgId = grpCombo.getValue()
        let enableBtn = $$(SetSystem.viewIds.enableBtn)

        let verObjs = await gMod.selectLatestSetTableVersionByToolg(txtStore.SET_TABLES.SET_SYSTEM,txtStore.MODULE.PHOTO,toolgId)
        let latestId = verObjs[0].ID

        if(id == null){
            id = latestId
            SetSysViewController.savingName = verObjs[0].NAME
        }

        //enable or disable enableBtn
        if(latestId == id){
            enableBtn.disable()
            enableBtn.$view.title = 'This version has already enabled'

            this.isEnabledVersion = true
            console.log('the version is enabled')
        }else{
            enableBtn.enable()
            enableBtn.$view.title = ''

            this.isEnabledVersion = false
            console.log('the version is disabled')
        }

        //load data by ID
        rawData = await model.selectSetSysById(id)
        
        
        let treeTab:webix.ui.treetable = $$(SetSystem.viewIds.treeTab)

        treeTab.clearAll()
        
        if(rawData==null||rawData.length==0)
            return
    
        let data

        if(this.isAdm){
            data = rawData
        }else{
            //data in set_system
            rawData = alasql("SELECT * FROM ?　WHERE PARENTID !=null",[rawData])
            data = rawData
        }

        let pIds = alasql("select PARENTID from ? where PARENTID !=null", [rawData])
        if(pIds.length==0)
            this.curParentId = null
        else
            this.curParentId = pIds[0].PARENTID

        let rootIdObjs = alasql("select ID from ? where PARENT_ID = -1",[rawData])
        let rootIds = []
        rootIdObjs.forEach(idObj=>{
            rootIds .push(idObj.ID)
        })

        let treeData = []   

        let scanPush = (gdata:Array<any>,rec)=>{
            gdata.forEach(trec=>{
                if(trec.ID===rec.PARENT_ID){
                    if(trec.data == undefined)
                        trec.data = []

                    trec.data.push(rec)
                    return;
                }else if(trec.data instanceof Array){
                    //recursive
                    scanPush(trec.data,rec)
                }
            })
        }

        data.forEach((rawRec,idx,arr) => {

            let newRec = rawRec

            // let newRec = {
            //     ID:rawRec.ID,
            //     PARENT_ID:rawRec.PARENT_ID,
            //     PROPERTYNO:rawRec.PROPERTYNO,
            //     TEXT:rawRec.TEXT,
            //     PROPERTYVALUE:rawRec.PROPERTYVALUE
            // }

            if(this.isAdm){
                if(rawRec.PARENT_ID==-1)
                    rawRec.PARENT_ID=0     

            }else if(rootIds.includes(newRec.PARENT_ID)){
                // rawRec.PARENT_ID=0 
            }

            if(rawRec.PARENT_ID<=0){
                treeData.push(newRec)
            }else{
                scanPush(treeData,newRec)
            }
        })

        treeTab.define("data",treeData)

        treeTab.filter(row=>{
            return row.PARENT_ID>=0
        })

        treeTab.refresh()
        
        //set update info
        let verInfo:any = await TopViewController.setUpdateInfoWithName(this.curParentId)

        if(verInfo != null){
            SetSysViewController.savingName = verInfo[0].NAME
            let nameLab = $$(SetSystem.viewIds.savingNameLab)
            nameLab.setValue("Version: "+SetSysViewController.savingName)
        }
        
    }

    onGrpComboChange = (newv, oldv) =>{
        this.loadData(null)
    }

    onReloadBtnClick = (id,event)=>{
        this.loadData(this.curParentId)
    }

    onSaveAsBtnClick = ()=>{

        let win = $$(SetSystem.viewIds.saveWin)

        if(win)
            return
        
        let top:webix.ui.layout = $$(Top.viewIds.topView)
        top.disable()

        let toolBar = [
            {
                view:"button",
                label:"Save&Enable",
                width:120,
                click:this.onWinSaveEnableBtnClick
            },
            {
                view:"button",
                label:"Save",
                width:120,
                click:this.onWinSaveBtnClick
            },
            {},
            {
                view:"button",
                label:"Delete",
                width:120,
                click:this.onWinDeleteBtnClick
            },
            {},
            {},
            {
                view:"button",
                label:"Cancel",
                width:120,
                click:()=>{
                    $$(SetSystem.viewIds.saveWin).close();
                }
            }
        ]
        
     
        
        win = webix.ui({
                view:"window",
                id:SetSystem.viewIds.saveWin,
                move:true,
                position:"center",
                resize: true,
                width:800,
                height:500,
                head:{
                    view:"toolbar", 
                    paddingX:10,
                    cols:[
                        {
                            view:"label",
                            label: "Save",
                            width:120
                        },
                        {},
                        {
                            view:"button",
                            type:"icon",
                            width:20,
                            icon:"wxi-close" ,
                            click:function(){
                                $$(SetSystem.viewIds.saveWin).close();
                            }
                        }
                    ]
                },
                body:{
                    cols:[
                        {
                            rows:[
                                {
                                    view:"text", 
                                    id:SetSystem.viewIds.saveNameTxt,
                                    value:SetSysViewController.savingName, 
                                    label:"Version Name",
                                    labelWidth:120
                                    // width:500
                                },
                                {
                                    view: "datatable",
                                    id:SetSystem.viewIds.saveGrid,
                                    resizeColumn: { headerOnly: true },
                                    scroll:"y",
                                    select: "row",
                                    css:"rows center",
                                    columns: [
                                        { id: "ENABLED", header:{text:"Enabled",css:{"text-align":"center"}}, width: 80 ,sort:"string"},
                                        // { id: "ID", header: ["ID"], width: 160 ,sort:"string"},
                                        { id: "NAME", header: ["Version Name"], width: 300 ,sort:"string"},
                                        { id: "UPDATE_USER", header: ["Update User"], width: 120 ,sort:"string"},
                                        { id: "VER_UPDATE_TIME", header: ["Update Time"], width: 160 ,sort:"string",
                                            format:function(value){
                                                if(value)
                                                    return value.replace('T',' ')
                                                else
                                                    return value
                                            }
                                        }
                                        // { id: "UPDATE_TIME", header: ["Update Time"], width: 160 ,sort:"string"}
                                    ],
                                    on:{
                                        onItemClick:(rowId)=>{

                                            let saveGrid = $$(SetSystem.viewIds.saveGrid)
                                            let nameTxt:webix.ui.text = $$(SetSystem.viewIds.saveNameTxt)

                                            let rec = saveGrid.getItem(rowId)

                                            nameTxt.setValue(rec.NAME)

                                        }
                                    },
                                    tooltip:function(obj, common){
                                        return "<i>ID: " + obj.ID + "</i>";
                                    }
                                }
                            ]
                        }, 
                        {
                            rows:toolBar
                        }
                    ]
                },
                on:{
                    onDestruct:()=>{
                        let top:webix.ui.layout = $$(Top.viewIds.topView)
                        top.enable()
                    },onShow:async()=>{

                        //load all version records
                        let grpCombo:webix.ui.richselect = $$(SetSystem.viewIds.grpCombo)

                        let allVerData:any = await model.getAllVersion(grpCombo.getValue())

                        if(allVerData.length==0)
                            return

                        //record constant verisons
                        this.constVers =  alasql(`column of select NAME from ? where CONST = 'Y'`,[allVerData])

                        //record names
                        // SetSysViewController.savingNameObj =  alasql(`column of select NAME from ?`,[allVerData])
                        let nameData =  alasql(`select distinct ID,NAME from ?`,[allVerData])

                        SetSysViewController.savingNameObj = {}

                        nameData.forEach(rec=>{
                            SetSysViewController.savingNameObj[rec.NAME] = rec.ID
                        })
                        

                        console.log('saving list:',SetSysViewController.savingNameObj)
                        
                        //set grid data
                        let grid = $$(SetSystem.viewIds.saveGrid)
                        
                        grid.clearAll()

                        grid.parse(allVerData)

                        grid.refresh()

                    }
                }
        }).show()


    }

    onSaveBtnClick = (id,event)=>{

        let grid:webix.ui.treetable = $$(SetSystem.viewIds.treeTab)
        let grpCombo:webix.ui.richselect = $$(SetSystem.viewIds.grpCombo)
        let toolgId = grpCombo.getValue()

        if(!grid.validate()){
            webix.alert({
                title:"Invalid",
                cancel:"Cancel",
                text: "Data invalid!"
              })
            return
        }

        let factory = txtStore.FACTORY.ARRAY
        let module = txtStore.MODULE.PHOTO
        let setTable = txtStore.SET_TABLES.SET_SYSTEM

        let setTabVo = new SetTableVO(setTable,factory,module)


        let checkAnotherVerFn = async (callback)=>{
            
            if(!this.curParentId)
                callback(true)

            let verObjs = await gMod.selectLatestSetTableVersionByToolg(txtStore.SET_TABLES.SET_SYSTEM,txtStore.MODULE.PHOTO,toolgId)
            let latestParentId = verObjs[0].ID

            console.log(this.curParentId+'|'+latestParentId)

            callback(this.curParentId===latestParentId)
        
        }

        let insertToSetTabFn = (guid,callback)=>{

            let gridData = gCtrl.getAllDataFromGrid(grid)
            let data:Array<SetSysVO> = []

            //push consist configs

            // if(!this.isAdm)
            //     SetSysViewController.constData.forEach(rec=>{
            //         data.push(new SetSysVO(rec.PROPERTYNO,rec.PROPERTYVALUE))
            //     })

            // data.push(new SetSysVO("Customer","BOE"))
            // data.push(new SetSysVO("Module","PHOTO"))
            // data.push(new SetSysVO("TOOLG",toolgId))
            
            //collect data
            let recurPush=(rec)=>{
                rec.forEach(row=>{

                    let val:string = row.PROPERTYVALUE

                    if(val==null||val.trim()==''){
                        let defa = row.DEFAULT_VAL

                        if(defa!=null){
                            val = defa
                        }else{
                            val = null
                        }

                    }

                    data.push(new SetSysVO(row.PROPERTYNO,val))

                    if(row.data!=null&&row.data.length>0){
                        recurPush(row.data)
                    }
                })
            }

            recurPush(gridData)

            model.insertSetSystem(guid,data,()=>{

                callback()
            })
        }

        let insertToVerTabFn = (guid,callback)=>{
            gMod.insertSetVerCtrl(guid,txtStore.FACTORY.ARRAY,txtStore.MODULE.PHOTO,toolgId,txtStore.SET_TABLES.SET_SYSTEM,gStore.user,()=>{
                callback()
            })
        }

        let reloadFn = callback=>{
            this.loadData(null)
            callback()
        }

        oCtrl.runSavingFlow(setTabVo,checkAnotherVerFn,insertToSetTabFn,insertToVerTabFn,reloadFn)

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
    }

    onLoadBtnClick = ()=>{

        let win = $$(SetSystem.viewIds.loadWin)

        if(win)
            return
        
        let top:webix.ui.layout = $$(Top.viewIds.topView)
        top.disable()
        
        win = webix.ui({
                view:"window",
                id:SetSystem.viewIds.loadWin,
                move:true,
                position:"center",
                resize: true,
                width:680,
                height:500,
                head:{
                    view:"toolbar", 
                    paddingX:10,
                    cols:[
                        {
                            view:"label",
                            label: "Load",
                            width:120
                        },
                        {},
                        {
                            view:"button",
                            type:"icon",
                            width:20,
                            icon:"wxi-close" ,
                            click:function(){
                                $$(SetSystem.viewIds.loadWin).close()
                            }
                        }
                    ]
                },
                body:{
                    rows:[
                        {
                            view: "datatable",
                            id:SetSystem.viewIds.loadGrid,
                            scroll:"y",
                            resizeColumn: { headerOnly: true },
                            select: "row",
                            css:"rows center",
                            columns: [
                                { id: "ENABLED", header: {text:"Enabled",css:{"text-align":"center"}}, width: 80 ,sort:"string"},
                                // { id: "ID", header: ["ID"], width: 160 ,sort:"string"},
                                { id: "NAME", header: ["Version Name"], width: 300 ,sort:"string"},
                                { id: "UPDATE_USER", header: ["Update User"], width: 120 ,sort:"string"},
                                { id: "VER_UPDATE_TIME", header: ["Update Time"], width: 160 ,sort:"string",
                                    format:function(value){
                                        if(value)
                                            return value.replace('T',' ')
                                        else
                                            return value
                                    }
                                }
                                // { id: "UPDATE_TIME", header: ["Update Time"], width: 160 ,sort:"string"}
                            ],
                            tooltip:function(obj, common){
                                return "<i>ID: " + obj.ID + "</i>";
                            }
                        },
                        {
                            cols:[
                                {},
                                {
                                    view:"button",
                                    type:"icon",
                                    icon:"wxi-check",
                                    label:"OK",
                                    width:100,
                                    click:()=>{
                                        let loadGrid = $$(SetSystem.viewIds.loadGrid)

                                        let sel = loadGrid.getSelectedId()

                                        if(!sel){
                                            webix.message("Please select a row.")
                                            return
                                        }

                                        let rec = loadGrid.getItem(sel)

                                        // let enabled = rec.ENABLED
                                        let id = rec.ID
                                        this.loadData(id)

                                        // let enableBtn:webix.ui.button = $$(SetSystem.viewIds.enableBtn)

                                        // //if enabled ,there's no need to enable again
                                        // if(enabled){
                                        //     enableBtn.disable()
                                        //     enableBtn.$view.title = 'This version has already enabled'
                                        // }else{
                                        //     enableBtn.enable()
                                        //     enableBtn.$view.title = ''
                                        // }

                                        $$(SetSystem.viewIds.loadWin).close()

                                    }
                                },
                                {
                                    view:"button",
                                    type:"icon",
                                    icon:"wxi-close",
                                    label:"Cancel",
                                    width:100,
                                    click:()=>{
                                        $$(SetSystem.viewIds.loadWin).close()
                                    }
                                }
                            ]
                        }
                    ]
                },
                on:{
                    onDestruct:()=>{
                        let top:webix.ui.layout = $$(Top.viewIds.topView)
                        top.enable()
                    },
                    onShow:async()=>{

                        //load all version records
                        let grpCombo:webix.ui.richselect = $$(SetSystem.viewIds.grpCombo)

                        let allVerData:any  = await model.getAllVersion(grpCombo.getValue())

                        if(allVerData.length==0)
                            return

                        let grid = $$(SetSystem.viewIds.loadGrid)
                        
                        grid.clearAll()

                        grid.parse(allVerData)

                        grid.refresh()

                    }
                }
        }).show()

    }

    onToggleChange = ()=>{

        let editModeTog = $$(SetSystem.viewIds.editModeTog)

        let grpCombo = $$(SetSystem.viewIds.grpCombo)
		let enableBtn = $$(SetSystem.viewIds.enableBtn)
		let resetBtn = $$(SetSystem.viewIds.resetBtn)
		let loadBtn = $$(SetSystem.viewIds.loadBtn)
		let saveAsBtn = $$(SetSystem.viewIds.saveAsBtn)
        // let saveBtn = $$(SetSystem.viewIds.saveBtn)

        let tree =  $$(SetSystem.viewIds.treeTab)

        let  editorCells = [].slice.call(document.getElementsByClassName('webix_column webix_last')[0].children)
        
        //edit mode
        if(editModeTog.getValue()==1){

            grpCombo.disable()
            enableBtn.hide()
            loadBtn.hide()

            resetBtn.show()
		    saveAsBtn.show()
            // saveBtn.show()

            editorCells.forEach(el=>{
                el.firstChild.disabled = false
            })

        }else{

            //reload data
            this.loadData(this.curParentId)

            grpCombo.enable()
            loadBtn.show()
            enableBtn.show()

            resetBtn.hide()
		    saveAsBtn.hide()
            // saveBtn.hide()

            editorCells.forEach(el=>{
                el.firstChild.disabled = true
            })
        }
    }

    onWinSaveEnableBtnClick = ()=>{

        let nameTxt:webix.ui.text = $$(SetSystem.viewIds.saveNameTxt)
        let name = nameTxt.getValue()

        if(this.constVers.includes(name)){
            webix.message("Can not overwrite constant version!")
            return
        }

        let isVerEnabled = true
        let isAlter = SetSysViewController.savingName == name
        //if the version is already enabled
         this.savingFlow(isVerEnabled,isAlter)
    }

    onWinSaveBtnClick = ()=>{

        let nameTxt:webix.ui.text = $$(SetSystem.viewIds.saveNameTxt)
        let name = nameTxt.getValue()

        if(this.constVers.includes(name)){
            webix.message("Can not overwrite constant version!")
            return
        }

        // save identical version
        let isAlterSameVer = SetSysViewController.savingName == name

        //if the version is already enabled , make it enabled
        let isVerEnabled = (isAlterSameVer && this.isEnabledVersion)
        
         this.savingFlow(isVerEnabled,isAlterSameVer)
            
    }

    savingFlow = (enabled:boolean,alterOnly:boolean)=>{

        let nameTxt:webix.ui.text = $$(SetSystem.viewIds.saveNameTxt)

        let name = nameTxt.getValue()

        if(!name){
            webix.alert({
                text:'Please input "Version Name".'
              })

            return
        }

        let savingNames = Object.getOwnPropertyNames(SetSysViewController.savingNameObj)

        if(alterOnly){//if alter an enabled version setting
            this.saveData_overwrite(name,enabled)
        }else if(savingNames.includes(name)){//if duplicate saving name
            webix.confirm({
                title:'Name duplicated',
                ok:"No", 
                cancel:"Yes",
                text: `There's another version named "${name}", do you want to overwrite it?`,
                callback: result=>{
                  //"Yes"
                  if(!result){
                      this.saveData_overwrite(name,enabled)
                  }else{

                  }
                }
              })


        }else{
            this.saveData_new(name,enabled)
        }

    }

    onWinDeleteBtnClick = ()=>{

        let grid  = $$(SetSystem.viewIds.saveGrid)
        
        grid.editCancel()//avoid exception of updateItem

        let sel = grid.getSelectedId()

        if(!sel)
            return

        let rec = grid.getItem(sel)
        let selId = rec.ID
        let selName = rec.NAME

        if(this.curParentId == selId){
            webix.message("Can not delete current version!")
            return
        }else if(this.constVers.includes(selName)){
            webix.message("Can not delete constant version!")
            return
        }

        webix.confirm({
            title:'Delete',
            ok:"No", 
            cancel:"Yes",
            text: `Are you sure to delete "${selName}" ? The version will not be restored any more.`,
            callback: result=>{
                //"Yes"
                if(!result){
                    model.deleteData(selId,()=>{
                        model.deleteVersion(selId,()=>{
                            //remove row in grid
                            grid.remove(sel.id)
                        })
                    })
                }else{}
            }
        })
        
    }
    
    saveData_new = (verName:string,enabled:boolean)=>{

        console.log('new saving: ',verName , ' ,enabled: ',enabled)

        let grid:webix.ui.treetable = $$(SetSystem.viewIds.treeTab)
        let grpCombo:webix.ui.richselect = $$(SetSystem.viewIds.grpCombo)
        let toolgId = grpCombo.getValue()

        let verId = null

        // if(!grid.validate()){
        //     webix.alert({
        //         title:"Invalid",
        //         cancel:"Cancel",
        //         text: "Data invalid!"
        //       })
        //     return
        // }

        let factory = txtStore.FACTORY.ARRAY
        let module = txtStore.MODULE.PHOTO
        let setTable = txtStore.SET_TABLES.SET_SYSTEM

        let setTabVo = new SetTableVO(setTable,factory,module)

        let checkAnotherVerFn = async (callback)=>{
            //close saving window
            $$(SetSystem.viewIds.saveWin).close()
            callback(true)
        }

        let insertToSetTabFn = (guid,callback)=>{

            verId = guid

            let gridData = gCtrl.getAllDataFromGrid(grid)
            let data:Array<SetSysVO> = []

            //collect data
            let recurPush=(rec)=>{
                rec.forEach(row=>{

                    let val:string = row.PROPERTYVALUE

                    if(val==null||val.trim()==''){
                        let defa = row.DEFAULT_VAL

                        if(defa!=null){
                            val = defa
                        }else{
                            val = null
                        }

                    }

                    data.push(new SetSysVO(row.PROPERTYNO,val))

                    if(row.data!=null&&row.data.length>0){
                        recurPush(row.data)
                    }
                })
            }

            recurPush(gridData)

            model.insertSetSystem(guid,data,()=>{
                callback()
            })
        }

        let insertToVerTabFn = (guid,callback)=>{
            gMod.insertVerCtrlWithName(guid,factory,module,toolgId,setTable,gStore.user,verName,enabled,()=>{
                callback()
            })
        }

        let reloadFn = callback=>{
            this.loadData(verId)

            // if(enabled)
            //     $$(SetSystem.viewIds.enableBtn).disable()

            callback()
        }

        oCtrl.runSavingFlow(setTabVo,checkAnotherVerFn,insertToSetTabFn,insertToVerTabFn,reloadFn)        
    }

    saveData_overwrite = (verName:string,enabled:boolean)=>{

        console.log('overwrite saving: ',verName , ' ,enabled: ',enabled)

        //undo
        let grid:webix.ui.treetable = $$(SetSystem.viewIds.treeTab)
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

        let factory = txtStore.FACTORY.ARRAY
        let module = txtStore.MODULE.PHOTO
        let setTable = txtStore.SET_TABLES.SET_SYSTEM

        let setTabVo = new SetTableVO(setTable,factory,module)

        let verId = null

        //there's no process ,skip
        let checkAnotherVerFn = async (callback)=>{
            //close saving window
            $$(SetSystem.viewIds.saveWin).close()
            callback(true)
        }

        let insertToSetTabFn = (guid,callback)=>{

            verId = guid

            let gridData = gCtrl.getAllDataFromGrid(grid)
            let data:Array<SetSysVO> = []

            //collect data
            let recurPush=(rec)=>{
                rec.forEach(row=>{

                    let val:string = row.PROPERTYVALUE

                    if(val==null||val.trim()==''){
                        let defa = row.DEFAULT_VAL

                        if(defa!=null){
                            val = defa
                        }else{
                            val = null
                        }

                    }

                    data.push(new SetSysVO(row.PROPERTYNO,val))

                    if(row.data!=null&&row.data.length>0){
                        recurPush(row.data)
                    }
                })
            }

            recurPush(gridData)

            model.insertSetSystem(guid,data,()=>{

                callback()
            })
        }

        let insertToVerTabFn = (guid,callback)=>{

            let  oldId = null

            //find original id
            for(let p in SetSysViewController.savingNameObj){
                if(verName == p){
                    oldId = SetSysViewController.savingNameObj[p]
                    break
                }
            }

            //overwrite original record
            gMod.overwriteVerCtrl(oldId,guid,gStore.user,enabled,()=>{
                //delete data of original ID
                model.deleteData(oldId,callback)
            })

        }

        let reloadFn = callback=>{
            this.loadData(verId)

            if(enabled)
                $$(SetSystem.viewIds.enableBtn).disable()

            callback()
        }

        oCtrl.runSavingFlow(setTabVo,checkAnotherVerFn,insertToSetTabFn,insertToVerTabFn,reloadFn)        

    }

    onEnableBtnClick = ()=>{

        webix.confirm({
            title:'Enable',
            ok:"No", 
            cancel:"Yes",
            text: `Are you sure to enable "${SetSysViewController.savingName}" ?`,
            callback: result=>{
                //"Yes"
                if(!result){

                    let enableBtn = $$(SetSystem.viewIds.enableBtn)
                    enableBtn.disable()
                    enableBtn.$view.title = 'This version has already enabled'

                    model.enableVersion(this.curParentId,()=>{})
                }else{}
            }
        })
    }

}