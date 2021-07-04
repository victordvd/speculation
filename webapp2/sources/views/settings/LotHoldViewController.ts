import mod from "../../models/LotHoldModel"
import LotHold from "./LotHold"
import TopViewController from "../TopViewController"
import gMod from "../../models/GlobalModel"
import mMod from "../../models/MachineDownModel"
import gCtrl from "../../controllers/GlobalController"
import oCtrl from "../../controllers/OperationController"
import gStore from "../../store/GlobalStore"
import txtStore from "../../store/TextStore"
import TextStore from "../../store/TextStore"
import {SetTableVO} from "../../models/VO"

declare var $$

export default class LotHoldViewController{

    static eqps = []
    currentParentId:string

    init = ()=>{
        gCtrl.checkCookie(()=>{

            mMod.selectMachines(machObjs=>{

                let grid:webix.ui.datatable = $$(LotHold.viewIds.lotHoldGrid)
                LotHoldViewController.eqps = []

                machObjs.forEach(machObj=>{
                    LotHoldViewController.eqps.push(machObj.MACHINENAME)
                })

                //index of col:tool_id is '0'
                grid.config.columns[0].options = LotHoldViewController.eqps

            })

            this.loadData()

        })
    }

    loadData = async ()=>{

        let grid:webix.ui.datatable = $$(LotHold.viewIds.lotHoldGrid)

        grid.clearAll()

        LotHold.isDataValid = true

        gMod.selectLatestSetTableVersion(TextStore.MODULE.PHOTO,TextStore.SET_TABLES.SET_LOT_HOLD,async verObjs=>{

            if(verObjs == null || verObjs.length==0){
                return
            }

            this.currentParentId = verObjs[0].ID

            //set update info
            TopViewController.setUpdateInfo(this.currentParentId)

            let rawData:any = await mod.selectLotHoldData(this.currentParentId);

            // let gridData = []

            // rawData.forEach(rec=>{
            // })

            (<any>grid).parse(rawData)

        })

    }

    onReloadBtnClick = ()=>{
        this.loadData()
    }

    onAddBtnClick = ()=>{
        let  grid = $$(LotHold.viewIds.lotHoldGrid)

        let toDecStr = (no)=>{
            return (no<10)?'0'+no:no
        }

        let sD = new Date()
        let eD = new Date(sD.getTime()+6*60*60*1000)

        let y = sD.getFullYear()
        let mon = toDecStr(sD.getMonth()+1)
        let day = toDecStr(sD.getDate())
        let hr = toDecStr(sD.getHours())
        let min = toDecStr(sD.getMinutes())

        let sStr = y+'-'+mon+'-'+day+'T'+hr+':'+min//+':00'

        y = eD.getFullYear()
        mon = toDecStr(eD.getMonth()+1)
        day = toDecStr(eD.getDate())
        hr = toDecStr(eD.getHours())
        min = toDecStr(eD.getMinutes())

        let eStr = y+'-'+mon+'-'+day+'T'+hr+':'+min

        let rec = {
            LOT_ID: null,
            TARGET_STEP_ID:'1500-%',
            TOOL_ID: LotHoldViewController.eqps[0],
            PROD_ID:null,
            START_TIME: sStr,
            END_TIME: eStr
            // CREATE_DATE: 
            
        }

        grid.add(rec)
    }

    onDelBtnClick = ()=>{

        let  grid = $$(LotHold.viewIds.lotHoldGrid)

        grid.editCancel()//avoid exception of updateItem

        let sel = grid.getSelectedId()

        if(!sel)
            return

        grid.remove(sel.id)
    }

    onSaveBtnClick = ()=>{
        let  grid:webix.ui.datatable = $$(LotHold.viewIds.lotHoldGrid)

        /*終止編輯*/
        if(grid.editCancel)
        grid.editCancel()

        /*資料驗證*/
        if(!LotHold.isDataValid){
            this.showValidationMsg()
            /*驗證失敗後終止儲存*/
            return
        }

        let factory = txtStore.FACTORY.ARRAY
        let modu = txtStore.MODULE.PHOTO
        let setTable = txtStore.SET_TABLES.SET_LOT_HOLD

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
            let grid :webix.ui.datatable  = $$(LotHold.viewIds.lotHoldGrid)
            let gridData = gCtrl.getAllDataFromGrid(grid)

            if(gridData==null || gridData.length===0){
                callback()
                return
            }else{
 
                mod.insertIntoSetLotHold(guid,gridData,callback)
            }
        }

        let insertToVerTabFn = (guid,callback)=>{
            let insertCnt  = 0

            gMod.selectPhotoToolgId(toolgs=>{
                toolgs.forEach(tObj=>{
                    let toolgId = tObj.TOOLG_ID
                    gMod.insertSetVerCtrl(guid,factory,modu,toolgId,setTable,gStore.user,()=>{
                        insertCnt++
                        if(insertCnt===toolgs.length){
                            callback()
                        }
                    })
                })
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
    if(!LotHold.isDataValid){

        for(let type in LotHold.invalidItem){
            let invalidMsg = LotHold.invalidationMsg[type]

            webix.message({
                type:"error",
                text:invalidMsg
            })
        }     
    }
}
}