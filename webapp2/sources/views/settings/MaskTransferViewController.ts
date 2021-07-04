import mod from "../../models/MaskTransferModel"
import MaskTransfer from "./MaskTransfer"
import {MaskTransportVO} from "../../models/VO"
import gCtrl from "../../controllers/GlobalController"
import oCtrl from "../../controllers/OperationController"
import gStore from "../../store/GlobalStore"
import txtStore from "../../store/TextStore"
import gMod from "../../models/GlobalModel"
import TopViewController from "../TopViewController"
import OperationController from "../../controllers/OperationController"
import sqlCtrl from "../../controllers/SqlController"
import {SetTableVO} from "../../models/VO"

declare var $$
declare var alasql

export default class MaskTransferViewController{

    static renderItv
    static curOptParentIds:object
    curSetParentId:string
    idleStTime:Date
    static idleItv
    isIdleShow = false

    static recCnt:number = 0


    init=()=>{

        this.idleStTime = new Date()

        gCtrl.checkCookie(()=>{
            this.loadData()
            MaskTransferViewController.idleItv = setInterval(()=>{

                let itv = new Date().getTime()-this.idleStTime.getTime()

                if(this.isIdleShow)
                    return

                if(itv>1800000){//30min
                    // if(itv>10000){
                    this.isIdleShow = true
                    webix.alert({
                        title: "Idle",
                        text: "You have been idle for 30min,confirm to refresh data.",
                        type:"alert-warning",
                        callback:()=>{
                            this.isIdleShow = false
                            this.loadData()
                        }
                    })  
                }

            },1000)

        })
    }

    loadData = ()=>{

        this.idleStTime = new Date()

        gMod.selectLatestSetTableVersion(txtStore.MODULE.PHOTO,txtStore.SET_TABLES.SET_MASK_TRANSFER,verObjs=>{

            if(verObjs.length===0)//no any version
                return

            let latestParentId = verObjs[0].ID
            //set current parent ID
            this.curSetParentId = latestParentId
            //set update info
            TopViewController.setUpdateInfo(this.curSetParentId)

            mod.selectMaskTransfer(this.curSetParentId,rawData=>{

                let grid:webix.ui.datatable = $$(MaskTransfer.viewId.maskTansGrid)
                grid.clearAll()

                if(rawData==null||rawData.length==0)
                    return

                let data = []
                let locationMap = {}
                let preTime = null

                //set current parentids
                MaskTransferViewController.curOptParentIds = {}
                let idObjs = alasql('select distinct O_PARENTID ,TOOLG_ID from ?',[rawData])

                idObjs.forEach(idObj=>{
                    MaskTransferViewController.curOptParentIds[idObj.TOOLG_ID] = idObj.O_PARENTID
                })

                rawData.forEach((rec,idx)=>{

                    let reticleOutoutId = rec.O_PARENTID
                    let arvTime = rec.TIME_IN.replace(/T/,' ')
                    let updTime = (rec.UPDATE_TIME)?rec.UPDATE_TIME.replace(/T/,' '):null
                    let reticleOutputTime = (rec.RETICLE_OUTPUT_TIME)?rec.RETICLE_OUTPUT_TIME.replace(/T/,' '):null

                    let maskId = rec.RETICLES_ID

                    let isChecked = 0
                    let isCancelled = false
                    // if(rec.S_PARENTID){
                    if(rec.CHECKED == 'Y'){//checked
                        isChecked = 1
                        isCancelled = false
                    }else if(rec.CHECKED == 'N'){//cancelled
                        isChecked = 0
                        isCancelled = true
                    }else{//unchecked
                        isChecked = 0
                        isCancelled = false
                    }

                    if(arvTime===preTime){//if 2 records at same arrival time, merge into 1
                        let vo:MaskTransportVO = locationMap[arvTime]

                        //avoid  eqp -> stock -> eqp
                        if(rec.LOCATION_FROM == vo.inEqpTo && !(vo.inEqpTo == 'STOCKER' && rec.LOCATION == vo.inEqpFrom)){//correct transfer flow

                            vo.outMaskId = maskId
                            vo.outEqpTo = rec.LOCATION
                            vo.outProdId = rec.PROD_ID 
                        }else{//swap order

                            vo.outEqpTo = vo.inEqpTo
                            vo.outMaskId = vo.inMaskId
                            vo.outProdId = vo.inProdId

                            vo.inEqpFrom = rec.LOCATION_FROM
                            vo.inMaskId = maskId
                            vo.inEqpTo = rec.LOCATION

                            vo.isDone = (rec.MATERIALSTATE)?true:false
                            vo.isChecked = isChecked
                            vo.inProdId = rec.PROD_ID
                            vo.updateUser = rec.UPDATE_USER
                            vo.updateTime = updTime
                        }
                        
                    }else{

                        let isDone = (rec.MATERIALSTATE)?true:false

                        locationMap[arvTime] = new MaskTransportVO(idx+1,reticleOutoutId,isDone,isChecked,isCancelled,arvTime,rec.PROD_ID,maskId,rec.LOCATION_FROM,rec.LOCATION,rec.UPDATE_USER,updTime,reticleOutputTime)
                    }

                    preTime = arvTime
                })

                for(let f in locationMap){
                    data.push(locationMap[f])
                }

                let renderRows = ()=>{

                    let now = new Date()
                    let grid:webix.ui.datatable = $$(MaskTransfer.viewId.maskTansGrid)

                    if(!grid)
                        return

                    let gData = grid.serialize()

                    gData.forEach((row,idx)=>{

                        let arvTime = new Date(row.arrivalTime)
                        let itv =  now.getTime()-arvTime.getTime()

                        if(itv>0){
                            grid.addRowCss(String(row.id), "mask_delay")
                        }else if(itv>-1800000){
                            grid.addRowCss(String(row.id), "mask_warning")
                        }else if(row.savedChecked){
                            grid.addRowCss(String(row.id), "mask_checked")
                        }else{
                            grid.removeRowCss(String(row.id), "mask_delay")
                            grid.removeRowCss(String(row.id), "mask_warning")
                            grid.removeRowCss(String(row.id), "mask_checked")
                        }
                    })
                }

                grid.define('data',data)
                grid.refresh()

                renderRows()//dun invoke fn after setInterval ,or cant clear it
                MaskTransferViewController.renderItv = setInterval(renderRows,5000)
            })
        })
    }

    onReloadBtnClick=()=>{

        // let maskTv:webix.ui.tabview = $$(MaskTransfer.viewId.maskTv)

        // let tab = maskTv.getValue()

        this.loadMaskHistData()
        this.loadData()
    }

    onSaveBtnClick=()=>{
        let grid:webix.ui.datatable = $$(MaskTransfer.viewId.maskTansGrid)

        let data = grid.serialize()

        if(data==null||data.length==0){
            webix.message('No data can be saved!')
            return
        }

        let factory = txtStore.FACTORY.ARRAY
        let module = txtStore.MODULE.PHOTO
        let setTable = txtStore.SET_TABLES.SET_MASK_TRANSFER

        let setTabVo = new SetTableVO(setTable,factory,module)

        let checkAnotherVerFn = (callback)=>{
            gMod.selectLatestOptTableVersion(null,latestIds=>{

                let isIdentical = true

                latestIds.every(idObj=>{
                
                    let curId = MaskTransferViewController.curOptParentIds[idObj.toolg]

                    if(curId==undefined){//if there's no related toolg
                        isIdentical = true
                    }else{
                        isIdentical =  curId == idObj.id
                    }

                    return isIdentical

                })

                if(!isIdentical){
                    webix.alert({
                        title: "New Version",
                        text: "There is a new schdule version created, this saving will be cancelled.\nConfirm to reload.",
                        type:"alert-warning",
                        callback:()=>{
                            this.loadData()
                        }
                    }) 

                    OperationController.removeSavingMask()
                    return
                }

                gMod.selectLatestSetTableVersion(txtStore.MODULE.PHOTO,txtStore.SET_TABLES.SET_MASK_TRANSFER,verObjs=>{

                    //no any version
                    if(verObjs.length===0){
                        callback(true)
                    }

                    let latestParentId = verObjs[0].ID
    
                    console.log(this.curSetParentId+'|'+latestParentId)
    
                    callback(this.curSetParentId==null||this.curSetParentId===latestParentId)
                })
            })
            
        }
        
        let insertToSetTabFn = (guid,callback)=>{

            let data = gCtrl.getAllDataFromGrid(grid)

            let insertSql = "INSERT ALL\n"
            let insertCnt = 0

            let intoClause = 'INTO set_mask_transfer(parentid,reticle_parentid,checked,mask_id,tool_id,arrival_time,product_id,location_from,update_user,update_time,reticle_output_time) VALUES'

            data.forEach((row:MaskTransportVO)=>{
                
                let inProd = sqlCtrl.nullOrString(row.inProdId)
                let outProd = sqlCtrl.nullOrString(row.outProdId)
                let reticleId = sqlCtrl.nullOrString(row.reticleId)

                let updTime = (row.updateTime)?`to_date('${row.updateTime}','yyyy-mm-dd hh24:mi:ss')`:'null'
                let reticleTime = (row.reticleOutputTime)?`to_date('${row.reticleOutputTime}','yyyy-mm-dd hh24:mi:ss')`:'null'
                let arrivalTime = `to_date('${row.arrivalTime}','yyyy-mm-dd hh24:mi:ss')`

                if(row.isChecked==1){//checked

                    let checked = 'Y'

                    if(row.savedChecked){//saved checked
                        insertSql += `${intoClause}('${guid}',${reticleId},'${checked}','${row.inMaskId}','${row.inEqpTo}',${arrivalTime},${inProd},'${row.inEqpFrom}','${row.updateUser}',${updTime},${reticleTime})\n`

                        insertCnt++

                        if(row.outEqpTo){
                            insertSql += `${intoClause}('${guid}',${reticleId},'${checked}','${row.outMaskId}','${row.outEqpTo}',${arrivalTime},${outProd},'${row.inEqpTo}','${row.updateUser}',${updTime},${reticleTime})\n`

                            insertCnt++
                        }

                    }else{//new checked
                        insertSql += `${intoClause}('${guid}',${reticleId},'${checked}','${row.inMaskId}','${row.inEqpTo}',${arrivalTime},${inProd},'${row.inEqpFrom}','${row.updateUser}',sysdate,${reticleTime})\n`

                        insertCnt++

                        if(row.outEqpTo){
                            insertSql += `${intoClause}('${guid}',${reticleId},'${checked}','${row.outMaskId}','${row.outEqpTo}',${arrivalTime},${outProd},'${row.inEqpTo}','${row.updateUser}',sysdate,${reticleTime})\n`
                            insertCnt++
                        }
                    }

                }else{//unchecked


                    if(row.savedChecked){//cancelled

                        let checked = 'N'//cancelled

                        insertSql += `${intoClause}('${guid}',${reticleId},'${checked}','${row.inMaskId}','${row.inEqpTo}',${arrivalTime},${inProd},'${row.inEqpFrom}','${row.updateUser}',sysdate,${reticleTime})\n`

                        insertCnt++

                        if(row.outEqpTo){
                            insertSql += `${intoClause}('${guid}',${reticleId},'${checked}','${row.outMaskId}','${row.outEqpTo}',${arrivalTime},${outProd},'${row.inEqpTo}','${row.updateUser}',sysdate,${reticleTime})\n`
                            insertCnt++
                        }

                    }else if(row.savedCancelled){//saved cancelled

                        let checked = 'N'//cancelled

                        insertSql += `${intoClause}('${guid}',${reticleId},'${checked}','${row.inMaskId}','${row.inEqpTo}',${arrivalTime},${inProd},'${row.inEqpFrom}','${row.updateUser}',${updTime},${reticleTime})\n`

                        insertCnt++

                        if(row.outEqpTo){
                            insertSql += `${intoClause}('${guid}',${reticleId},'${checked}','${row.outMaskId}','${row.outEqpTo}',${arrivalTime},${outProd},'${row.inEqpTo}','${row.updateUser}',${updTime},${reticleTime})\n`

                            insertCnt++
                        }

                    }else{//unchecked

                        // let checked = 'N'


                    }
                }
            })

            if(insertCnt===0){//no item be checked
                callback()
                return
            }

            insertSql += "SELECT * FROM dual"

            mod.insertMaskTranfer(insertSql,callback)
        }
        
        let insertToVerTabFn = (guid,callback)=>{
            gMod.insertSetVerCtrl(guid,txtStore.FACTORY.ARRAY,txtStore.MODULE.PHOTO,'',txtStore.SET_TABLES.SET_MASK_TRANSFER,gStore.user,()=>{
                    callback()
            })
        }
        
        let reloadFn = (callback)=>{
            this.loadData()
            this.loadMaskHistData()
            callback()
        }
        
        oCtrl.runSavingFlow(setTabVo,checkAnotherVerFn,insertToSetTabFn,insertToVerTabFn,reloadFn)
    }
    
    onTabChange = ()=>{

        let maskTv:webix.ui.tabview = $$(MaskTransfer.viewId.maskTv)
        let saveBtn = $$(MaskTransfer.viewId.saveBtn)

        let tab = maskTv.getValue()

        if(tab===MaskTransfer.viewId.maskHistGrid){
            this.loadMaskHistData()
            saveBtn.hide()
        }else{
            this.loadData()
            saveBtn.show()
        }
    }

    loadMaskHistData = async ()=>{

        let grid = $$(MaskTransfer.viewId.maskHistGrid)

        grid.clearAll()

        let rawData = await mod.selectMaskTransferHistory()

        grid.parse(rawData)
    }
}