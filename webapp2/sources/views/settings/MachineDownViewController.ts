import mod from "../../models/MachineDownModel"
import MachineDown from "./MachineDown"
import TopViewController from "../TopViewController"
import gMod from "../../models/GlobalModel"
import gCtrl from "../../controllers/GlobalController"
import oCtrl from "../../controllers/OperationController"
import gStore from "../../store/GlobalStore"
import txtStore from "../../store/TextStore"
import {SetTableVO} from "../../models/VO"

declare var $$

export class  MachineDownViewController{

    static eqps = []
    currentParentId:string

    init=(view)=>{

        //removed grpCombo 2019/7/30
        // gMod.selectPhotoToolgId(grpIds=>{
		// 	let grpCombo:webix.ui.richselect = $$(MachineDown.viewIds.grpCombo)

        //     let items = []

        //     grpIds.forEach(rec=>{
        //         items.push(rec.TOOLG_ID)
        //     })

		// 	grpCombo.define("options",items)
        //     grpCombo.refresh()
            
        //     let toolg = (<any>grpCombo.getList()).getFirstId()
        //     grpCombo.setValue(toolg)  
		// })

        gCtrl.checkCookie(()=>{
            mod.selectMachines(machObjs=>{

                let grid:webix.ui.datatable = $$(MachineDown.viewIds.downGrid)
                MachineDownViewController.eqps = []

                machObjs.forEach(machObj=>{
                    MachineDownViewController.eqps.push(machObj.MACHINENAME)
                })

                grid.config.columns[0].options = MachineDownViewController.eqps

            })

            this.loadData()  
        })
    }

    loadData = ()=>{

        let grid :webix.ui.datatable  = $$(MachineDown.viewIds.downGrid)
        // let grpCombo = $$(MachineDown.viewIds.grpCombo)
        // let grpId = grpCombo.getValue()

        grid.clearAll()

        MachineDown.isDataValid = true

        grid.showOverlay(txtStore.LOADING)

        mod.selectMachineDown((data)=>{

            if(data==null || data.length===0){
                grid.hideOverlay()
                return    
            }

            //set current parent ID
            this.currentParentId = data[0].PARENTID

            //set update info
            TopViewController.setUpdateInfo(this.currentParentId)

            data.forEach(rec=>{
             
                if(rec.CODE_ID === 'P0001'){
                    rec.CODE_ID = 1
                }else{
                    rec.CODE_ID = 0
                }

            })

            grid.define("data",data)
            grid.hideOverlay()
        })

    }

    onReloadBtnClick=()=>{

        this.loadData()
    }

    onSaveBtnClick=()=>{

        if(!MachineDown.isDataValid){
            webix.alert({
                title:"Invalid",
                cancel:"Cancel",
                text: "Data invalid!"
              })
            return
        }

        let factory = txtStore.FACTORY.ARRAY
        let module = txtStore.MODULE.PHOTO
        let setTable = txtStore.SET_TABLES.SET_SCHEDULE_MACHINE_DOWN

        let setTabVo = new SetTableVO(setTable,factory,module)

        let checkAnotherVerFn = (callback)=>{
            gMod.selectLatestSetTableVersion(txtStore.MODULE.PHOTO,txtStore.SET_TABLES.SET_SCHEDULE_MACHINE_DOWN,verObjs=>{
                let latestParentId = verObjs[0].ID

                console.log(this.currentParentId+'|'+latestParentId)

                callback(this.currentParentId===latestParentId)
            })

        }
        
        let insertToSetTabFn = (guid,callback)=>{
            let grid :webix.ui.datatable  = $$(MachineDown.viewIds.downGrid)
            let gridData = gCtrl.getAllDataFromGrid(grid)

            if(gridData==null || gridData.length===0){
                callback()
                return
            }else{
                mod.insertMachineDown(guid,gridData,callback)
            }
        }
        
        let insertToVerTabFn = (guid,callback)=>{
            let insertCnt  = 0

            gMod.selectPhotoToolgId(toolgs=>{
                toolgs.forEach(tObj=>{
                    let toolgId = tObj.TOOLG_ID
                    gMod.insertSetVerCtrl(guid,txtStore.FACTORY.ARRAY,txtStore.MODULE.PHOTO,toolgId,txtStore.SET_TABLES.SET_SCHEDULE_MACHINE_DOWN,gStore.user,()=>{
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

        /*old*/
        /*
        oCtrl.confirmSaving(()=>{

            let grid :webix.ui.datatable  = $$(MachineDown.viewIds.downGrid)
            let gridData = gCtrl.getAllDataFromGrid(grid)
            // let grpCombo:webix.ui.richselect = $$(MachineDown.viewIds.grpCombo)
            // let toolgId = grpCombo.getValue()

            let insertCnt  = 0

            gMod.getGUID(guid=>{
                mod.insertMachineDown(guid,gridData,()=>{
                    gMod.selectPhotoToolgId(toolgs=>{
                        toolgs.forEach(tObj=>{
                            let toolgId = tObj.TOOLG_ID
                            gMod.insertVerCtrl(guid,'ARRAY','PHOTO',toolgId,'SET_SCHEDULE_MACHINE_DOWN',gStore.user,()=>{
                                insertCnt++
                                if(insertCnt===toolgs.length){
                                    webix.message(gCtrl.SAVESUCCESS)
                                    this.loadData()
                                }
                            })
                        })
                    })
                })
            
            })
        })*/
    }

    //removed 2019/7/30
    // onGrpComboChange = ()=>{

    //     let grpCombo:webix.ui.richselect = $$(MachineDown.viewIds.grpCombo)
    //     let toolg = grpCombo.getValue()

    //     mod.selectMachines(toolg,machObjs=>{

    //         let grid:webix.ui.datatable = $$(MachineDown.viewIds.downGrid)
    //         MachineDownViewController.machs = []

    //         machObjs.forEach(machObj=>{
    //             MachineDownViewController.machs.push(machObj.MACHINENAME)
    //         })

    //         grid.config.columns[0].options = MachineDownViewController.machs

    //     })

    //     this.loadData()

    // }

    onAddBtnClick = ()=>{
        let grid :webix.ui.datatable  = $$(MachineDown.viewIds.downGrid)

        // let grpCombo:webix.ui.richselect = $$(MachineDown.viewIds.grpCombo)
        // let toolgId = grpCombo.getValue()

        let toDecStr = (no)=>{
            return (no<10)?'0'+no:no
        }

        let sD = new Date()
        let eD = new Date(sD.getTime()+360000)

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
            // CH_ID: null,
            DOWN_START: sStr,
            DOWN_END: eStr,
            
            // PARENTID: "39ACC7507DED4B9AA63B70E009567C2B",
            // TOOLG_ID:,
            REMARK: "",
            TOOL_ID: MachineDownViewController.eqps[0]
        }

        grid.add(rec)
        
    }

    onDelBtnClick = ()=>{
        let grid   = $$(MachineDown.viewIds.downGrid)
        
        grid.editCancel()//avoid exception of updateItem

        let sel = grid.getSelectedId()

        if(!sel)
            return

        grid.remove(sel.id)
    }
}