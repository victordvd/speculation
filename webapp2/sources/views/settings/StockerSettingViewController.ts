import mod from "../../models/StockerSettingModel"
import gMod from "../../models/GlobalModel"
import gCtrl from "../../controllers/GlobalController"
import oCtrl from "../../controllers/OperationController"
import StockerSetting from "./StockerSetting";
import TopViewController from "../TopViewController"
import gStore from "../../store/GlobalStore"
import txtStore from "../../store/TextStore"
import {SetTableVO} from "../../models/VO"

declare var $$
declare var alasql

export class StockerSettingViewContriller{

    constructor(view){
        this.view =view
    }

    view
    photoStockers = []
    currentParentId:string

    init = (view)=>{
        gCtrl.checkCookie(()=>{
            this.loadData()
        })
    }

    onReloadBtnClick=()=>{
        this.loadData()
    }

    loadData = ()=>{

        let grid:webix.ui.datatable = $$(StockerSetting.viewIds.stockerGrid)
        grid.showOverlay(txtStore.LOADING)

        mod.selectStockerData(rawData=>{

            grid.config.columns = StockerSetting.staticCols.slice(0)

            grid.clearAll()

            //for cell render
            // let cssFm =(val,conf)=>{
            //     if(val>50) val =50

            //     let r = (val>25)?250:val*10
            //     let g = (val>25)?150-val*3:250-val*4
            //     g = (g<0) ? 0 :g
            //     let b = 25

            //     return {"background-color":"rgb("+r+","+g+","+b+")"}
            // }

            if(rawData==null || rawData.length===0){
                grid.hideOverlay()
                return    
            }else{

                //set current parent ID
                this.currentParentId = rawData[0].PARENTID

                //set update info
                TopViewController.setUpdateInfo(this.currentParentId)

                for(let colName in rawData[0]){
                    if(colName !== 'PARENTID' && colName !== 'STOCKER_ID_FROM' && colName !== 'UPDATE_TIME'){
                        this.photoStockers.push(colName)

                        grid.config.columns.push({
                            id:colName,
                            header: {text:colName,css:"center"},
                            width:80,
                            editor:"text",
                            css:{"text-align":"right"},
                            sort:"int",
                            editParse: function(value){   
                                let v = Number(value)

                                if(Number.isNaN(v)){
                                    return 0
                                }else{                           
                                    if(v>999)
                                        return 999
                                    else if(v<0)
                                        return 0
                                    else
                                        return Math.floor(v)
                                }

                                // return webix.Number.parse(value, { 
                                //   groupSize:webix.i18n.groupSize, 
                                //   groupDelimiter:webix.i18n.groupDelimiter, 
                                //   decimalSize : webix.i18n.decimalSize,
                                //   decimalDelimiter : webix.i18n.decimalDelimiter
                                // }); 
                              }
                            // cssFormat:cssFm
                        }) 
                    }
                }

            }

            // rawData.forEach(rec => {
                
            // });
            grid.refreshColumns()
            grid.define("data",rawData)
            grid.hideOverlay()
            
        })
    }

    onSaveBtnClick=()=>{

        let factory = txtStore.FACTORY.ARRAY
        let module = txtStore.MODULE.PHOTO
        let setTable = txtStore.SET_TABLES.SET_TRANSPORT

        let setTabVo = new SetTableVO(setTable,factory,module)

        let checkAnotherVerFn = (callback)=>{
            gMod.selectLatestSetTableVersion(txtStore.MODULE.PHOTO,txtStore.SET_TABLES.SET_TRANSPORT,verObjs=>{
                let latestParentId = verObjs[0].ID

                callback(this.currentParentId===latestParentId)
            })

        }

        let insertToSetTabFn = (guid,callback)=>{

            let grid:webix.ui.datatable = $$(StockerSetting.viewIds.stockerGrid)

            let gridData = gCtrl.getAllDataFromGrid(grid)
            let guiSql = "INSERT ALL \n"

            gridData.forEach(rec=>{

                this.photoStockers.forEach(ps=>{
                    
                    let transTime = rec[ps]
                    guiSql += ` INTO gui_transport(parentid,stocker_id_from,stocker_id_to,trans_time,update_time)
                    VALUES('${guid}','${rec.STOCKER_ID_FROM}','${ps}',${transTime},sysdate) \n`
                })
            })

            guiSql+="SELECT * FROM dual"

            
            mod.insertGuiData(guiSql,()=>{
                mod.insertIntoTransport(guid,callback)
            })

        }

        let insertToVerTabFn = (guid,callback)=>{

            let insertCnt  = 0

            gMod.selectPhotoToolgId(toolgs=>{

                toolgs.forEach(tObj=>{
                    let toolg_id = tObj.TOOLG_ID
                    gMod.insertSetVerCtrl(guid,txtStore.FACTORY.ARRAY,txtStore.MODULE.PHOTO,toolg_id,txtStore.SET_TABLES.SET_TRANSPORT,gStore.user,()=>{

                        insertCnt++
                        if(insertCnt===toolgs.length){
                            callback()
                        }
                            
                    })
                })

            })

        }

        let reloadFn = ()=>{
            this.loadData()

        }


        oCtrl.runSavingFlow(setTabVo,checkAnotherVerFn,insertToSetTabFn,insertToVerTabFn,reloadFn)

        /*old*/
        /*
        oCtrl.confirmSaving(()=>{

            let grid:webix.ui.datatable = $$(StockerSetting.viewIds.stockerGrid)

            let gridData = gCtrl.getAllDataFromGrid(grid)
            let guiSql = "INSERT ALL \n"

            gMod.getGUID(guid=>{
                gridData.forEach(rec=>{

                    this.photoStockers.forEach(ps=>{
                        
                        let transTime = rec[ps]
                        guiSql += ` INTO gui_transport(parentid,stocker_id_from,stocker_id_to,trans_time,update_time)
                        VALUES('${guid}','${rec.STOCKER_ID_FROM}','${ps}',${transTime},sysdate) \n`
                    })
                })

                guiSql+="SELECT * FROM dual"

                let insertCnt  = 0

                mod.insertGuiData(guiSql,()=>{
                    mod.insertIntoTransport(guid,()=>{
                        gMod.selectPhotoToolgId(toolgs=>{

                            toolgs.forEach(tObj=>{
                                let toolg_id = tObj.TOOLG_ID
                                gMod.insertVerCtrl(guid,'ARRAY','PHOTO',toolg_id,'SET_TRANSPORT',gStore.user,()=>{
                                    if(insertCnt===toolgs.length())
                                        webix.message(gCtrl.SAVESUCCESS)
                                })
                            })

                            webix.message(gCtrl.SAVESUCCESS)
                            this.loadData()
                        })

                        

                    })
                })

            })
        
        })*/
    }

}