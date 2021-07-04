import gMod from "../models/GlobalModel"
import gCtrl from "./GlobalController"
import oCtrl from "./OperationController"
import gStore from "../store/GlobalStore"
import txtStore from "../store/TextStore"
import Top from "../views/Top"
import maskMod from "../models/MaskTransferModel"
import maskCtrl from "../views/settings/MaskTransferViewController"
import TopViewController from "views/TopViewController"

/*
    global opt_output version control
*/
export default class VersionController{

    private static checkVerItv_optoutpu
    private static curParentIds_optoutput:Array<string>

    //if the lastest version has been updated , this function will be triggered
    private static loadDataFn

    static is1stTimeVerChk = true


    //invoke this while the view is initializing
    static setLoadDataFn = (loadDataFn)=>{
        VersionController.loadDataFn = loadDataFn
    }

    static getCurrentOptOutputIds = ()=>{
        return VersionController.curParentIds_optoutput
    }

    static triggerOptOutputInterval(){
        //check per 20s
        VersionController.checkVerItv_optoutpu = setInterval(this.checkVersionChange,20000)
    }
    

    static checkVersionChange = ()=>{
        gMod.selectLatestOptTableVersion(null,latestIds=>{

            let isIdentical = true

            latestIds.every(idObj=>{
        
                if(VersionController.curParentIds_optoutput!=null){
                    isIdentical = VersionController.curParentIds_optoutput.includes(idObj.id)
                }else{
                    isIdentical = false
                }

                return isIdentical

            })

            // console.log('opt_output ver: ',isIdentical,latestIds,VersionController.curParentIds_optoutput)

            //replace current ids
            VersionController.curParentIds_optoutput = []

            latestIds.forEach(idObj => {
                VersionController.curParentIds_optoutput.push(idObj.id)
            });
            

            if(VersionController.is1stTimeVerChk){
                VersionController.is1stTimeVerChk = false

                return
            }

            //if version changed,trigger loadDataFn
            if(!isIdentical){
                if(VersionController.loadDataFn)
                    VersionController.loadDataFn()

                //if page MaskTransfer , do not thing
                if(TopViewController.getCurrentPage()!==Top.ViewNames.MaskTransfer){

                    //check mask transfer
                    let maskSwi:any = $$(Top.viewIds.maskSwi)

                    if(maskSwi.getValue()==1){

                        gMod.selectLatestSetTableVersion(txtStore.MODULE.PHOTO,txtStore.SET_TABLES.SET_MASK_TRANSFER,verObjs=>{

                            let maskTransferId = (verObjs.length===0)?null:verObjs[0].ID

                            maskMod.selectMaskTransfer(maskTransferId,rawData=>{
                
                                if(rawData==null||rawData.length==0){
                                    return 
                                }

                                if(rawData.length > 0){//if record count > 0

                                    webix.alert({
                                        id:"MaskAlert",
                                        type:"alert-warning",
                                        title:"New Mask Transfer",
                                        text:`Mask Transfer Task has changed, please check "Mask Transfer" page.`
                                    })  
                                }
                            })
                        })
                    }
                }

            }
        })
    }

}