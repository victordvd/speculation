import mod from "../../models/MonitorSpecModel"
import MonitorSpec from "./MonitorSpec"
import gCtrl from "../../controllers/GlobalController"
import oCtrl from "../../controllers/OperationController"
import gStore from "../../store/GlobalStore"
import txtStore from "../../store/TextStore"
import gMod from "../../models/GlobalModel"
import TopViewController from "../TopViewController"
import {SetTableVO} from "../../models/VO"

declare var $$/*webix function , 輸入view id 回傳該物件*/
declare var alasql/*啟用alasql function*/

export default class MonitorSpecViewController{
    /*當前 set table 版本*/
    currentParentId:string

    /*view 初始化後執行*/
    init = ()=>{
        /*權限驗證*/
        gCtrl.checkCookie(()=>{
            this.loadData()
        })
    }

    /*按下 "Reload" 按鈕後所執行的程序*/
    onReloadBtnClick = ()=>{
        this.loadData()
    }

    /*載入資料*/
    loadData = async ()=>{

        let grid = $$(MonitorSpec.viewIds.specGrid)
        /*從DB取得資料*/
        let rawData = await mod.selectData()

        let optionData = alasql("select STEP_ID,SUB_STEP_SELECTION from ? where STEP_ID != '%' and SUB_STEP_SELECTION !=null group by STEP_ID,SUB_STEP_SELECTION", [rawData])
        //some records will be duplicated
        let defuData = alasql('select distinct STEP_ID,SUB_STEP_ID,L2,L3,L2_CNT,L3_CNT,LAYER_NAME,UPDATE_TIME,UPDATE_USER from ?', [rawData])
        let stepData = alasql('select distinct STEP_ID from ?', [rawData])
        let globalDefuRec = alasql("select * from ? where STEP_ID = '%'", [rawData])[0]
        let idData = alasql('select distinct PARENTID from ? where PARENTID !=null', [rawData])

        /*紀錄當前 set table 版本*/
        if(idData.length!=0){
            this.currentParentId = idData[0].PARENTID
            /*改變下方資料更新資訊*/
            TopViewController.setUpdateInfo(this.currentParentId)
        }

        /*資料處理開始*/
        let gridData = []

        //set step options to object
        let stepOptMap = {}
        
        optionData.forEach(rec=>{
            if(stepOptMap[rec.STEP_ID]){
                stepOptMap[rec.STEP_ID].push(rec.SUB_STEP_SELECTION)
            }else{
                stepOptMap[rec.STEP_ID] = [rec.SUB_STEP_SELECTION]
            }
        })

        //set default rec for each step
        stepData.forEach(s=>{

            //if no other sub steps , user is not availible to choice
            let isSingleSetting = (stepOptMap[s.STEP_ID])?0:null
            let hasNoSubSteps = (stepOptMap[s.STEP_ID])?false:true

            // console.log('steps:',s.STEP_ID,hasNoSubSteps)
            gridData.push({STEP_ID:s.STEP_ID,SUB_STEP_ID:null,isSingleSetting:isSingleSetting,hasNoSubSteps:hasNoSubSteps})
        })

        //add next steps into grid data
        gridData.forEach(rec=>{

            //set values into null sub step
            let hasNoMatch = defuData.every(dRec=>{
                if(dRec.STEP_ID===rec.STEP_ID && dRec.SUB_STEP_ID == null){
                    Object.assign(rec,dRec)

                
                    rec.isSingleSetting = 1
                    rec.oriCheck = 1

                    if(rec.L2 == null){
                        rec.L2 = globalDefuRec.L2
                        rec.L3 = globalDefuRec.L3
                        rec.L2_CNT = globalDefuRec.L2_CNT
                        rec.L3_CNT = globalDefuRec.L3_CNT
                    }

                   return false
                }

                return true
            })

            //if the default of step has no matching record then set global default value
            if(hasNoMatch){
                rec.L2 = globalDefuRec.L2
                rec.L3 = globalDefuRec.L3
                rec.L2_CNT = globalDefuRec.L2_CNT
                rec.L3_CNT = globalDefuRec.L3_CNT
            }

            //replace next operation to default
            if(rec.STEP_ID === '%'){
                rec.SUB_STEP_ID = 'global default'
            }else{
                rec.SUB_STEP_ID = 'default'
            }

            let subData = []
            
            if(stepOptMap[rec.STEP_ID]){
                stepOptMap[rec.STEP_ID].forEach(optStep=>{
                    let sub:any = {}
                    Object.assign(sub,rec)
                    sub.SUB_STEP_ID = optStep
                    sub.isSingleSetting = null

                    defuData.every(dRec=>{
                        if(dRec.STEP_ID===rec.STEP_ID && dRec.SUB_STEP_ID == optStep){
                            Object.assign(sub,dRec)

                            if(rec.L2 == null){
                                rec.L2 = globalDefuRec.L2
                                rec.L3 = globalDefuRec.L3
                                rec.L2_CNT = globalDefuRec.L2_CNT
                                rec.L3_CNT = globalDefuRec.L3_CNT
                            }
        
                           return false
                        }
        
                        return true
                    })

                    subData.push(sub)
                })
            }
            rec.data = subData
            
        })
        /*資料處理結束*/
        console.log('grid data',gridData)

        grid.clearAll()/*清除原先資料*/
        grid.parse(gridData)/*元件載入資料*/
        grid.openAll()/*展開樹狀圖*/
        grid.refresh()/*元件刷新*/

        /*設定樣式變化*/
        let seriData = grid.serialize()
        let storeData = grid.data.pull
        let checkedRowids = []

        seriData.forEach(row=>{

            if(row.STEP_ID === '%'){
                grid.addRowCss(row.id,'monitor-enable')
            }else if(row.isSingleSetting == 1){
                checkedRowids.push(row.id)
                grid.addRowCss(row.id,'monitor-enable')
            }else{
                grid.addRowCss(row.id,'monitor-disable');
            }
        })

        for(let rowid in storeData){
            let row = storeData[rowid]

            if(row.isSingleSetting==null){
                if(checkedRowids.includes(row.$parent)){
                    grid.addRowCss(row.id,'monitor-disable');
                }else{
                    grid.addRowCss(row.id,'monitor-enable');
                }
            }

        }

    }

    /*按下 "Save" 後所執行的程序*/
    onSaveBtnClick = ()=>{

        let grid:webix.ui.treetable = $$(MonitorSpec.viewIds.specGrid)
        let gridData = grid.serialize()

        let factory = txtStore.FACTORY.ARRAY
        let module = txtStore.MODULE.PHOTO
        let setTable = txtStore.SET_TABLES.SET_MONITOR_SPEC

        let setTabVo = new SetTableVO(setTable,factory,module)

        /*終止編輯*/
        if(grid.editCancel)
            grid.editCancel()

        /*資料驗證*/
        if(!MonitorSpec.isDataValid){
            this.showValidationMsg()
            /*驗證失敗後終止儲存*/
            return
        }

        /*實作儲存流程*/
        let checkAnotherVerFn = (callback)=>{
            gMod.selectLatestSetTableVersion(txtStore.MODULE.PHOTO,txtStore.SET_TABLES.SET_MONITOR_SPEC,verObjs=>{
                let latestParentId = verObjs[0].ID

                console.log(this.currentParentId+'|'+latestParentId)

                callback(this.currentParentId===latestParentId)
            })
        }

        let insertToSetTabFn = (guid,callback)=>{

            let savingData = []

            gridData.forEach(rec=>{

                if(rec.STEP_ID == '%'){
                    rec.SUB_STEP_ID = null
                }

                if(rec.SUB_STEP_ID == 'default'){
                    rec.SUB_STEP_ID = null
                }

                //use default or not
                if(rec.isSingleSetting == 1){

                    rec.PARENTID = guid
                    savingData.push(rec)
                }else{
                    if(rec.data){
                        rec.data.forEach(subRec=>{

                            subRec.PARENTID = guid
                            savingData.push(subRec)
                        })
                    }
                }


            })            

            //convert value to db value
            savingData.forEach(rec=>{
                
                if(rec.UPDATE_TIME){
                    rec.UPDATE_TIME = rec.UPDATE_TIME.replace(/T/,' ')
                }

                //if user switch to new sub steps or change value
                if(rec.UPDATE_USER == null||rec.isChanged){

                    let now = new Date()
                    let m = now.getMonth()+1
                    let mStr = (m<10)?('0'+m):String(m)

                    rec.UPDATE_TIME = now.getFullYear()+'-'+mStr+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()
                    rec.UPDATE_USER = gStore.user
                }

            })

            console.log('saving data',savingData)

            mod.insertMonitorSpecData(guid,savingData,callback)
        }

        let insertToVerTabFn = (guid,callback)=>{

            gMod.insertSetVerCtrl(guid,txtStore.FACTORY.ARRAY,txtStore.MODULE.PHOTO,null,txtStore.SET_TABLES.SET_MONITOR_SPEC,gStore.user,()=>{
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
        if(!MonitorSpec.isDataValid){

            let invalidMsg = ''

            for(let type in MonitorSpec.invalidItem){
                invalidMsg += MonitorSpec.invalidationMsg[type]+'\n'
            }

            webix.message({
                type:"error",
                text:invalidMsg
            })
            
        }
    }
}
