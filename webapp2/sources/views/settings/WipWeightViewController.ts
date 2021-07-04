import mod from "../../models/WipWeightModel"
import WipWeight from "./WipWeight";
import TopViewController from "../TopViewController"
import gMod from "../../models/GlobalModel"
import gCtrl from "../../controllers/GlobalController"
import oCtrl from "../../controllers/OperationController"
import gStore from "../../store/GlobalStore"
import txtStore from "../../store/TextStore"
import TextStore from "../../store/TextStore"
import {SetTableVO} from "../../models/VO"


declare var $$
declare var alasql

export default class WipWeightViewController{

    currentParentId:string

    init = ()=>{

        gCtrl.checkCookie(()=>{

            gMod.selectPhotoToolgId(grpIds=>{
                let grpCombo:webix.ui.richselect = $$(WipWeight.viewIds.grpCombo)

                let items = []

                grpIds.forEach(rec=>{

                    items.push(rec.TOOLG_ID)
                })

                grpCombo.define("options",items)
                grpCombo.refresh()
                grpCombo.setValue((<any>grpCombo.getList()).getFirstId())

                this.loadData()
            })
            
        })

    }

    loadData = async ()=>{

        let grpCombo:webix.ui.richselect = $$(WipWeight.viewIds.grpCombo)
        let toolgId = grpCombo.getValue()

        let verObjs:any = await gMod.selectLatestSetTableVersionByToolg(TextStore.SET_TABLES.SET_WIP_WEIGHTING,TextStore.MODULE.PHOTO,toolgId)

        if(verObjs == null || verObjs.length==0){
            return
        }

        this.currentParentId = verObjs[0].ID

        //set update info
        TopViewController.setUpdateInfo(this.currentParentId)

        let rawData = await mod.selectWipData(this.currentParentId)//this.currentParentId

        let stData = alasql(`select * from ? where PTY>=1`,[rawData])
        let csData = alasql(`select * from ? where PTY=-1`,[rawData])

        let stGrid =  $$(WipWeight.viewIds.stGrid)
        let csGrid =  $$(WipWeight.viewIds.csGrid)

        stGrid.clearAll()
        csGrid.clearAll()

        stGrid.parse(stData)
        csGrid.parse(csData)
    }

    onGrpComboChange = ()=>{
        this.loadData()

    }

    onSaveBtnClick =async()=>{
        let stGrid:webix.ui.datatable = $$(WipWeight.viewIds.stGrid)
        let csGrid:webix.ui.datatable = $$(WipWeight.viewIds.csGrid)
        let grpCombo:webix.ui.richselect = $$(WipWeight.viewIds.grpCombo)

        /*終止編輯*/
        if(stGrid.editCancel)
            stGrid.editCancel()
        if(csGrid.editCancel)
            csGrid.editCancel()

        /*資料驗證*/
        if(!WipWeight.isDataValid){
            this.showValidationMsg()
            /*驗證失敗後終止儲存*/
            return
        }

        let factory = txtStore.FACTORY.ARRAY
        let modu = txtStore.MODULE.PHOTO
        let setTable = txtStore.SET_TABLES.SET_WIP_WEIGHTING
        let toolgId = grpCombo.getValue()        

        let setTabVo = new SetTableVO(setTable,factory,modu)

        let checkAnotherVerFn = async(callback)=>{
            let verObjs:any = await gMod.selectLatestSetTableVersionByToolg(setTable,modu,toolgId)

            //if there's no any version
            if(verObjs == null || verObjs.length ===0){
                console.log('first edition')
                callback(true)    
            }

            let latestParentId = verObjs[0].ID

            console.log(this.currentParentId+'|'+latestParentId)

            callback(this.currentParentId===latestParentId)
        }

        
        
        let insertToSetTabFn = (guid,callback)=>{

            let stGridData = gCtrl.getAllDataFromGrid(stGrid)
            let csGridData = gCtrl.getAllDataFromGrid(csGrid)

            let data = stGridData.concat(csGridData)

            if(data.length===0){
                callback()
                return
            }else{
                mod.insertWipData(guid,toolgId,data,callback)
            }
        }

        let insertToVerTabFn = (guid,callback)=>{
            gMod.insertSetVerCtrl(guid,factory,modu,toolgId,setTable,gStore.user,callback)
        }
        
        let reloadFn = (callback)=>{
            this.loadData()
            callback()
        }
        
        // let remainVerFn = (callback)=>{
        //     gMod.remainDataIn20release(factory,modu,setTable)
        // }

        oCtrl.runSavingFlow(setTabVo,checkAnotherVerFn,insertToSetTabFn,insertToVerTabFn,reloadFn)
    }

    onStAddBtnClick = ()=>{
        let  grid = $$(WipWeight.viewIds.stGrid)

        let gridData = grid.serialize()
        let pty = 1

        if(gridData.length>0){
            let maxPty = alasql(`select max(PTY) PTY from ?`,[gridData])

            pty = maxPty[0].PTY+1
        }

        if(pty>10){
            webix.message('The maximum priority is 10!')
            return
        }

        let rec = {
            PTY: pty,
            WEIGHTING:0
        }

        grid.add(rec)
    }

    onStDelBtnClick = ()=>{

        let  grid = $$(WipWeight.viewIds.stGrid)

        grid.editCancel()//avoid exception of updateItem

        // let sel = grid.getSelectedId()

        // if(!sel)
        //     return

        let gridData = gCtrl.getAllDataFromGrid(grid)

        if(gridData.length>0){
            grid.remove(gridData[gridData.length-1].id)
        }


        
    }

    onCsAddBtnClick = ()=>{
        let  grid = $$(WipWeight.viewIds.csGrid)

        let rec = {
            PTY: -1,
            WEIGHTING:0,
            PROD_ID:null,
            RECIPE:null,
            LOT_ID:null
        }

        grid.add(rec)
    }

    onCsDelBtnClick = ()=>{

        let  grid = $$(WipWeight.viewIds.csGrid)

        grid.editCancel()//avoid exception of updateItem

        let sel = grid.getSelectedId()

        if(!sel){
            webix.message('请选取一行项目')
            return
        }

        grid.remove(sel.id)
    }

    onReloadBtnClick = ()=>{
        this.loadData()
    }

    onDefaultBtnClick = ()=>{
        let stGrid = $$(WipWeight.viewIds.stGrid)
        let csGrid:webix.ui.datatable = $$(WipWeight.viewIds.csGrid)

        stGrid.clearAll()
        csGrid.clearAll()

        let stDefaData = [
            { PTY: 1, WEIGHTING:14.838},
            { PTY: 2, WEIGHTING:4.94616},
            { PTY: 3, WEIGHTING:2.47308},
            { PTY: 4, WEIGHTING:1.64872},
            { PTY: 5, WEIGHTING:1.49812},
            { PTY: 6, WEIGHTING:1.39561},
            { PTY: 7, WEIGHTING:1.33071}
        ]

        stGrid.parse(stDefaData)
    }

    /*
        print invalidation msgs
    */
   showValidationMsg = ()=>{
        if(!WipWeight.isDataValid){

            for(let type in WipWeight.invalidItem){
                let invalidMsg = WipWeight.invalidationMsg[type]

                webix.message({
                    type:"error",
                    text:invalidMsg
                })
            }     
        }
    }

}