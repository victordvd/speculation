import MatchRate from "./MatchRate"
import TopViewController from "../TopViewController"
import Top from "../Top"
import mod from "../../models/MatchRateModel"
import gMod from "../../models/GlobalModel"
import gCtrl from "../../controllers/GlobalController"
import oCtrl from "../../controllers/OperationController"
import vCtrl from "../../controllers/VersionController"
import common from "../../controllers/CommonController"
import gStore from "../../store/GlobalStore"
import txtStore from "../../store/TextStore"
import {MatMfgTargetVO,SetTableVO} from "../../models/VO"

declare var $$
declare var alasql

export default class MatchRateViewController{

    init =()=>{
        // let updBar = $$(Top.viewIds.updBar)
        // updBar.hide()

        gCtrl.checkCookie(()=>{
            this.loadData()
        })

    }

    loadData = async ()=>{

 
        let idObjs:any = await gMod.selectLatestMatTableVersion(txtStore.MAT_TABLES.MAT_MFG_TARGET)

        if(idObjs.length==0)
            return

        let id = idObjs[0].ID

        let data:any = await mod.selectMfgTarget(id)

        if(data.length == 0)
            return

        TopViewController.setUpdateInfo_MAT(id)

        let grid = $$(MatchRate.viewIds.viewGird)

        grid.clearAll()
        grid.parse(data)
        
    }

    onBeforeFileAdd = (upload)=>{
         // (<any>webix).AtomDataLoader._onLoad = function (data) {
        //     var _this2 = this;
            
        //     data = this.data.driver.toObject(data);
        //     if (data && data.then) data.then(function (data) {
        //         return _this2._onLoadContinue(data);
        //     });else this._onLoadContinue(data);	
        //   }

        console.log(upload)

        if(upload.type != 'xlsx'){

            webix.message({type:"error", text:`"${upload.name}" is not the type of "xlsx"`})

            return
        }

        let viewer:webix.ui.excelviewer = $$(MatchRate.viewIds.excelviewer)

        viewer.clearAll()
        viewer.parse(upload.file,"excel")
        // viewer.refresh()
        
        return false

    }

    generateInsertRecObj = (sheet:string,data:Array<any>,isArrayIn:boolean)=>{

        let reData = []

        let modelTypeIdx = 0
        let prodDescIdx = 1
        let prodIdxIdx = 2
        let dateStIdx = 3

        let dataStRidx = 2

        let dates = []

        //rule
        // let hasInvalidDate = false
        // let tooLessDate = false
        // let invalidNum = false
        let isValid = true

        data.every((rec,rIdx)=>{

            if(rIdx >= dataStRidx){//scan data

                let modelType
                let prodDesc
                let prodId
                let vals = []
                
                let colIdx = 0
                for(let col in rec){
    
                    let cell = rec[col]
    
                    if(colIdx == modelTypeIdx)
                        modelType = cell
                    else if(colIdx == prodDescIdx)
                        prodDesc = cell
                    else if(colIdx == prodIdxIdx){
                        prodId = cell

                        //not availible product ID, break
                        if(typeof prodId != "string" || prodId.trim().length == 0)
                            return true

                    }else if(colIdx>=dateStIdx){//scan values
                        vals.push(cell)
                    }
    
                    colIdx++
                }
       
                //create records foreach prod & date
                dates.forEach((d,i)=>{

                    let val = Number(vals[i])

                    if(val){
                        let vo = new MatMfgTargetVO()

                        vo.datetimekey = d
                        vo.modelType = modelType
                        vo.productDesc = prodDesc
                        vo.productId = prodId

                        if(isArrayIn)
                            vo.inQty = val
                        else
                            vo.outQty = val

                        reData.push(vo)
                    }
                })

            }else if(rIdx==0){
                let colIdx = 0
                for(let col in rec){
    
                    if(col.includes('data')){
                        let cell = rec[col]
    
                        if(colIdx>=dateStIdx){//scan dates

                            let dt = new Date(cell)

                            if(isNaN(dt.getTime())){

                                if(colIdx<=dateStIdx+1){//check 1st & 2nd dates
                                    console.log('invalid date!')
                                    webix.message({type:"error", text:`Invalid date, Sheet:"${sheet}",Column: ${colIdx+1}, Row: ${rIdx+1}`})
                                    isValid = false
                                    return false
                                }
                                
                            }else{
                                let dStr =  common.getDateStr(dt,'/')

                                let today = new Date()
                                today.setHours(0)
                                today.setMinutes(0)
                                today.setSeconds(0)
                                today.setMilliseconds(0)

                                if(today.getTime()-dt.getTime()>0){
                                    // let todayStr  = common.getDateStr(today,'/')

                                    console.log('date must be greater than today.')
                                    webix.message({type:"error", text:`Date must be later than today, Sheet:"${sheet}",Column: ${colIdx+1}, Row: ${rIdx+1}`})
                                    isValid = false
                                    return false
                                }

                                dates.push(dStr)
                            }     
                        }
                    }
                    
                    colIdx++
                }

            }

            return true
        })

        if(!isValid)//if invalid,terminate saving flow
            return false

        return reData
    }

    onSaveBtnClick = ()=>{

        let viewer = $$(MatchRate.viewIds.excelviewer)
        let bar = $$(MatchRate.viewIds.excelBar)

        let curSheet = bar.getValue()

        let sheets = viewer.getSheets()

        let arrayInData:Array<MatMfgTargetVO>
        let arrayOutData:Array<MatMfgTargetVO>
        let arrayAllData:Array<MatMfgTargetVO> = []

        let hasArrInSheet = false
        let hasArrOutSheet = false

        let isValid = true

        //get data from I/O
        sheets.forEach((sheet,i)=>{

            viewer.showSheet(sheet)

            let data = viewer.serialize()

            console.log(sheet,data)

            if(sheet==='Array In'){//&&i==0
                hasArrInSheet = true

                let re = this.generateInsertRecObj(sheet,data,true)

                if(!re){
                    isValid = false
                    return
                }
                arrayInData = re
            }else if(sheet==='Array Out'){//&&i==1
                hasArrOutSheet = true
                 let re =  this.generateInsertRecObj(sheet,data,false)

                 if(!re){
                    isValid = false
                    return
                }

                arrayOutData = re
            }else{
                console.log('others sheet: ',sheet)
            }
        })

        //restore current sheet
        viewer.showSheet(curSheet)

        
        //invalid data, terminate saving flow
        if(!hasArrInSheet||!hasArrOutSheet){//incorrect sheet
            console.log('incorrect sheets')
            webix.message({type:"error", text:'Sheet is incorrect.(ex: "Array In","Array Out")'})
            return
        }else if(!isValid){//invalid

            return
        }

        //merge I/O data
        arrayOutData.forEach((oRec,oi)=>{
                
            let isMerged = false
            arrayInData.every((iRec,ii)=>{

                if(oRec.productId==iRec.productId && oRec.datetimekey==iRec.datetimekey){//merge

                    iRec.outQty = oRec.outQty  
                    isMerged = true

                    return false
                }else{
                    isMerged = false
                }

                return true
            })

            //push independent rec to all data
            if(!isMerged){
                arrayAllData.push(oRec)
            }
        })

        //push all arrayIn data into all
        arrayAllData = arrayAllData.concat(arrayInData)

        console.log('all data: ',arrayAllData)

        if(arrayAllData.length==0)
            return

        //start saving flow
        let factory = txtStore.FACTORY.ARRAY
        let modu = txtStore.MODULE.PHOTO
        let setTable = txtStore.MAT_TABLES.MAT_MFG_TARGET
        let user = gStore.user

        let matTabVo = new SetTableVO(setTable,factory,modu)

        let checkAnotherVerFn = (callback)=>{callback(true)}
        
        let insertToMatTabFn = (guid,callback)=>{
            gMod.insertMatVerCtrl(guid,null,setTable,user,callback)
        }

        let insertToVerTabFn = (guid,callback)=>{
            mod.insertMatchRateData(guid,factory,arrayAllData,user,callback)
        }
        
        let reloadFn = (callback)=>{
            this.loadData()
            callback()
        }

        oCtrl.runSavingFlow(matTabVo,checkAnotherVerFn,insertToMatTabFn,insertToVerTabFn,reloadFn)

    }

    onSampleBtnClick = ()=>{

        console.log('sample click')

        var link = document.createElement("a");
        link.download = name;
        link.href = "生产计划(样本).xlsx";
        link.click();
    }

}