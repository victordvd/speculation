import Top from "../Top"
import mod from "../../models/QtimeModel"
import gMod from "../../models/GlobalModel"
import gCtrl from "../../controllers/GlobalController"
import Qtime from "./Qtime"
import TopViewController from "../TopViewController"
import txtStore from "../../store/TextStore"
import oCtrl from "../../controllers/OperationController"
import {SetTableVO} from "../../models/VO"
import gStore from "../../store/GlobalStore"

declare var $$

export default class QtimeViewController{

    currentParentId:string

    init = ()=>{
        gCtrl.checkCookie(()=>{
            this.loadData()

        })
    }

    loadData = async ()=>{

        let grid = $$(Qtime.viewIds.qTimeGrid)

        grid.clearAll()

        gMod.selectLatestSetTableVersion(txtStore.MODULE.PHOTO,txtStore.SET_TABLES.SET_QUEUETIME,async(verObjs)=>{

            //if no version
            if(verObjs.length===0){
                return
            }

            this.currentParentId = verObjs[0].ID

            TopViewController.setUpdateInfo(this.currentParentId)

            let rawData:any= await mod.selectQtimeData(this.currentParentId)

            if(rawData.length === 0)
                return

            
            grid.parse(rawData)
        })


    }

    onReloadBtnClick = ()=>{
        this.loadData()
    }

    onAddBtnClick = ()=>{
        let  grid = $$(Qtime.viewIds.qTimeGrid)

        let rec = {
            PRODUCTID:null,
            FROMSTEP:null,
            TOSTEP:null,
            MAXQUEUETIME:0
        }

        grid.add(rec)

        //scroll to the last row
        grid.scrollTo(0,9999999)
    }

    onDelBtnClick = ()=>{
        let  grid = $$(Qtime.viewIds.qTimeGrid)

        grid.editCancel()//avoid exception of updateItem

        let sel = grid.getSelectedId()

        if(!sel){
            webix.message('请选取一行项目')
            return
        }

        grid.remove(sel.id)
    }

    onSaveBtnClick = ()=>{
        let  grid:webix.ui.datatable = $$(Qtime.viewIds.qTimeGrid)

        /*終止編輯*/
        if(grid.editCancel)
        grid.editCancel()

        /*資料驗證*/
        if(!Qtime.isDataValid){
            this.showValidationMsg()
            /*驗證失敗後終止儲存*/
            return
        }

        let factory = txtStore.FACTORY.ARRAY
        let modu = txtStore.MODULE.PHOTO
        let setTable = txtStore.SET_TABLES.SET_QUEUETIME

        let setTabVo = new SetTableVO(setTable,factory,modu)

        let checkAnotherVerFn = (callback)=>{
            gMod.selectLatestSetTableVersion(modu,setTable,verObjs=>{

                //if there's no any version
                if(verObjs == null || verObjs.length ===0){
                    console.log('first edition')
                    callback(true)    
                }

                let latestParentId = verObjs[0].ID

                console.log(this.currentParentId+'|'+latestParentId)

                callback(this.currentParentId===latestParentId)
            })
        }
        
        let insertToSetTabFn = (guid,callback)=>{
            let grid :webix.ui.datatable  = $$(Qtime.viewIds.qTimeGrid)
            let gridData = gCtrl.getAllDataFromGrid(grid)

            if(gridData==null || gridData.length===0){
                callback()
                return
            }else{
                mod.insertQtimeData(guid,factory,gridData,callback)
            }
        }

        let insertToVerTabFn = (guid,callback)=>{
            gMod.insertSetVerCtrl(guid,factory,modu,null,setTable,gStore.user,()=>{
                    callback()
            })
        }
        
        let reloadFn = (callback)=>{
            this.loadData()
            callback()
        }
        
        oCtrl.runSavingFlow(setTabVo,checkAnotherVerFn,insertToSetTabFn,insertToVerTabFn,reloadFn)
    }

        /*
        print invalidation msgs
    */
   showValidationMsg = ()=>{
    if(!Qtime.isDataValid){

        for(let type in Qtime.invalidItem){
            let invalidMsg = Qtime.invalidationMsg[type]

            webix.message({
                type:"error",
                text:invalidMsg
            })
        }     
    }
}
}