import TopViewController from "./TopViewController"
import Top from "./Top"
import gMod from "../models/GlobalModel"
import gCtrl from "../controllers/GlobalController"
import vCtrl from "../controllers/VersionController"
import gStore from "../store/GlobalStore"
import txtStore from "../store/TextStore"
import JobChange from "./JobChange"
import JobChangeModel from "../models/JobChangeModel"
import {JobChangeVO} from "../models/VO"
import VersionController from "../controllers/VersionController"

declare var $$
declare var alasql

export default class JobChangeViewController{

    mod = new JobChangeModel()
    curParentIds:Array<string>
    static checkVerItv

    init = ()=>{

        let updBar = $$(Top.viewIds.updBar)
        updBar.hide()

        gCtrl.checkCookie(()=>{

            this.loadData()

            //reset version check interval
            // JobChangeViewController.checkVerItv = setInterval(this.checkVersionChange,30000)
            VersionController.setLoadDataFn(this.loadData)
        })
    }

    convertToGridData = (rawData)=>{

        let gridData = []

        // let idRecs = alasql("select distinct PARENTID from ?",[rawData])
        // idRecs.forEach(idRec=>{
        //     this.curParentIds.push(idRec.PARENTID)
        // })

        //merge continuous lv task
        let lvMgData = {}//{firstLv:[continuous seqs]}
        let preEqp = null
        let preSeq = -1
        let preIdx = -1
        let preProdStep = null
        rawData.forEach((rec,idx)=>{
            let eqp = rec.TOOL_ID
            let seq = rec.SEQ
            let prodStep = rec.PROD_STEP
            // let opFlg = rec.OP_FLG

            let ti =  new Date(rec.CH_TIME_IN).getTime()
            let dTime = new Date(rec.D_TIME).getTime()
            let dif = ti-dTime
            //show data of the latest version in earlier 2hr
            if(dif<=7200000&&rec.M_LEVEL != null){
                let key = idx
                let preKey = preIdx
                
                if(preEqp === eqp && (preSeq+1) === seq && preProdStep == prodStep){
                    lvMgData[preKey].push(idx)
                    preSeq = seq
                }else{ // if(preIdx===-1||lvIdxes == undefined)
                    lvMgData[key] = []
                    preEqp = eqp
                    preSeq = seq
                    preIdx = idx
                    preProdStep = prodStep
                }
            }
        })

        console.log('lvMg',lvMgData)

        //merge leveled records into 1
        for(let firstIdx in lvMgData){

            // let seq = firstSeq.split('|')[1]
            let firstLvRec = rawData[firstIdx]

            lvMgData[firstIdx].forEach(ctuIdx=>{
                
                let ctuLvRec = rawData[ctuIdx]

                firstLvRec.LOT_ID += '<br>'+ ctuLvRec.LOT_ID
                firstLvRec.CH_TIME_IN += '<br>'+ ctuLvRec.CH_TIME_IN
            })
        }

        let preRec
        rawData.forEach((rec,idx)=>{

            let tiStr = rec.CH_TIME_IN
            if(rec.CH_TIME_IN.includes('<br>'))
                tiStr = tiStr.split('<br>')[0]

            let ti =  new Date(tiStr).getTime()
            let dTime = new Date(rec.D_TIME).getTime()
            let dif = ti-dTime
            //show data of the latest version in earlier 2hr
            if(dif<=7200000 && rec.OP_FLG !== 'Running'){
                if(idx===0){
                    //high level
                    if(rec.M_LEVEL != null){
                        gridData.push(new JobChangeVO(rec.TOOL_ID,'',rec.PROD_STEP,rec.LOT_ID,rec.CH_TIME_IN,rec.M_LEVEL))
                    }
                }else{
                    //JC
                    if((preRec.TOOL_ID === rec.TOOL_ID && preRec.PROD_STEP !== rec.PROD_STEP)){
                        gridData.push(new JobChangeVO(rec.TOOL_ID,preRec.PROD_STEP,rec.PROD_STEP,rec.LOT_ID,rec.CH_TIME_IN,rec.M_LEVEL))
                    }
                }
            }
            preRec = rec
        })
        
        gridData = alasql('select * from ? order by eqp,timeIn',[gridData])

        return gridData

    }

    loadData = async ()=>{

        let rawData = <Array<any>>await this.mod.selectJobChange()

        let grid:webix.ui.datatable = $$(JobChange.viewIds.jcGrid)

        grid.clearAll()

        if(rawData==null||rawData.length===0)
            return

        let gridData = []
        this.curParentIds = []
        
        let idRecs = alasql("select distinct PARENTID from ?",[rawData])
        // let mdRec = alasql("select min(DATE(CH_TIME_IN)) md from ?", [rawData])
        // let minDateTime = mdRec[0].md

        idRecs.forEach(idRec=>{
            this.curParentIds.push(idRec.PARENTID)
        })

        /*
        //merge continuous lv task
        let lvMgData = {}//{firstLv:[continuous seqs]}
        let preEqp = null
        let preSeq = -1
        let preIdx = -1
        let preProdStep = null
        rawData.forEach((rec,idx)=>{
            let eqp = rec.TOOL_ID
            let seq = rec.SEQ
            let prodStep = rec.PROD_STEP

            let ti =  new Date(rec.CH_TIME_IN).getTime()
            let dTime = new Date(rec.D_TIME).getTime()
            let dif = ti-dTime
            //show data of the latest version in earlier 2hr
            if(dif<=7200000&&rec.M_LEVEL != null){
                let key = idx
                let preKey = preIdx
                
                if(preEqp === eqp && (preSeq+1) === seq && preProdStep == prodStep){
                    lvMgData[preKey].push(idx)
                    preSeq = seq
                }else{ // if(preIdx===-1||lvIdxes == undefined)
                    lvMgData[key] = []
                    preEqp = eqp
                    preSeq = seq
                    preIdx = idx
                    preProdStep = prodStep
                }
            }
        })

        //merge leveled records into 1
        for(let firstIdx in lvMgData){

            // let seq = firstSeq.split('|')[1]
            let firstLvRec = rawData[firstIdx]

            lvMgData[firstIdx].forEach(ctuIdx=>{
                
                let ctuLvRec = rawData[ctuIdx]

                firstLvRec.LOT_ID += '<br>'+ ctuLvRec.LOT_ID
                firstLvRec.CH_TIME_IN += '<br>'+ ctuLvRec.CH_TIME_IN
            })
        }

        let preRec
        rawData.forEach((rec,idx)=>{

            let tiStr = rec.CH_TIME_IN
            if(rec.CH_TIME_IN.includes('<br>'))
                tiStr = tiStr.split('<br>')[0]

            let ti =  new Date(tiStr).getTime()
            let dTime = new Date(rec.D_TIME).getTime()
            let dif = ti-dTime
            //show data of the latest version in earlier 2hr
            if(dif<=7200000 && rec.OP_FLG !== 'Running'){
                if(idx===0){
                    if(rec.M_LEVEL != null){
                        gridData.push(new JobChangeVO(rec.TOOL_ID,'',rec.PROD_STEP,rec.LOT_ID,rec.CH_TIME_IN,rec.M_LEVEL))
                    }
                }else{
                    if((preRec.TOOL_ID === rec.TOOL_ID && preRec.PROD_STEP !== rec.PROD_STEP)){
                        gridData.push(new JobChangeVO(rec.TOOL_ID,preRec.PROD_STEP,rec.PROD_STEP,rec.LOT_ID,rec.CH_TIME_IN,rec.M_LEVEL))
                    }
                }
            }
            preRec = rec
        })
        */
        

        // let preGridData = this.convertToGridData(preRawData)
        // console.log(preGridData)

        gridData = this.convertToGridData(rawData)

        console.log(gridData)

        //compare 2 versions
        /*
        let preEqpMap = {}
        let eqpMap = {}
        let mergedData = []

        preGridData.forEach(rec=>{
            let eqp = rec.eqp            

            if(preEqpMap[eqp]==undefined){
                preEqpMap[eqp] = []
            }

            preEqpMap[eqp].push(rec)
        })

        gridData.forEach(rec=>{
            let eqp = rec.eqp            

            if(eqpMap[eqp]==undefined){
                eqpMap[eqp] = []
            }

            eqpMap[eqp].push(rec)
        })

        for(let eqp in eqpMap){
            let preEqpRows = preEqpMap[eqp]
            let eqpRows = eqpMap[eqp]
            
            if(preEqpRows==undefined){//no need to compare
                mergedData.concat(eqpRows)
                continue
            }

            let preIdx = 0
            let idx = 0

            while(idx<eqpRows.length && preIdx <preEqpRows.length){
                let preRow:JobChangeVO = preEqpRows[preIdx]
                let row:JobChangeVO = eqpRows[idx]

                let preJc = preRow.curOper+preRow.jcOper
                let jc = row.curOper+row.jcOper

                // if()




            }
            


        }*/

        //set grid data
        gridData = alasql('select * from ? order by timeIn',[gridData])

        grid.define('data',gridData)
        // grid.adjustRowHeight()
        grid.refresh()

    }

    onReloadBtnClick = ()=>{

        this.loadData()
    }

    /*
    checkVersionChange = ()=>{
        gMod.selectLatestOptTableVersion(null,latestIds=>{

            let isIdentical = true

            latestIds.every(idObj=>{
            
                isIdentical = this.curParentIds.includes(idObj.id)

                return isIdentical

            })

            if(!isIdentical){

                this.loadData()
            }
        })
    }*/

}