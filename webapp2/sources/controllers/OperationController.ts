import gCtrl from "./GlobalController"
import gStore from "../store/GlobalStore"
import gModel from "../models/GlobalModel"
import txtStore from "../store/TextStore";
import Top from "../views/Top"
import {SetTableVO} from "../models/VO"

declare var $$

export default class OperationController{

  static loadingWin:webix.ui.window

  static checkNewSetVer = (newv,oldv,proceedFn)=>{

    //no change ,go on procedure
    if(newv===oldv){
      proceedFn()
    }else{
      let newSetVerBox:any = webix.confirm(
        {
          title:"Another new version",
          ok:"No", 
          cancel:"Yes",
          text: "Another new version has been created, are you sure to overwrite it?",
          callback: function(result){
            //"Yes"
            if(!result){
              proceedFn()
            }
          }
        })
    }

  }

  static removeSavingMask = ()=>{
    OperationController.loadingWin.close()

    let t:webix.ui.layout = $$(Top.viewIds.topView)
    t.enable()

  }


  /*
    標準儲存流程:
    屏蔽畫面,禁止操作
    確認UI版本
    跳出儲存確認視窗
    確認編輯版本衝突
    取得GUID
    儲存至 SET-table
    儲存至 set_ver_control
    顯示成功訊息
    重新載入資料
    刪除20以外版本

    parameters:
    setTable: set table 字串
    grid: 資料表格元件
    checkAnotherVerFn: 驗證版本流程
    insertToSetTabFn: 儲存set table data流程
    insertToVerTabFn: 儲存版本流程
    reloadFn: 重新讀取流程

  */
  static runSavingFlow(setTabVo:SetTableVO,checkAnotherVerFn:Function,insertToSetTabFn:Function,insertToVerTabFn:Function,reloadFn:Function){


    console.log('saving flow 1.')
    OperationController.loadingWin = <webix.ui.window>webix.ui({
      view:"window",
      position:"center",
      width: 150,
      height: 120,
      headHeight:0,
      css:"loading",
      body:{
          template:`<div class="loader"></div><br><p style="text-align: center;">Saving...</p>`
      }
    })

    let proceedToSave = ()=>{

      if(txtStore.SET_TABLES.SET_MACHINEGROUP===setTabVo.setTable){
         //6.
         console.log('saving flow 6.')
        let guids = []

         gModel.getGUID(guid0=>{
          guids[0] = guid0
          gModel.getGUID(guid1=>{
            guids[1] = guid1

            //7.
            console.log('saving flow 7.')
            insertToSetTabFn(guids,()=>{
              //remove view blockers
              t.enable()
              OperationController.loadingWin.close()
              //8.
              
                //show success msg
                reloadFn(()=>{console.log('saving flow 10.')})
                webix.message({type:"success",text:txtStore.SAVESUCCESS})

                // remainVerFn(console.log('saving flow 11'))
                gModel.remainDataIn20release(setTabVo)
                
              
            })
          })
        })

      }else{
        //6.
        console.log('saving flow 6.')
        gModel.getGUID(guid=>{
          //7.
          console.log('saving flow 7.')
          insertToSetTabFn(guid,()=>{
            //8.
            insertToVerTabFn(guid,(isSuccessfull,msg)=>{
              console.log('saving flow 8.')
              //remove view blockers
              t.enable()
              OperationController.loadingWin.close()
              //9.
                //show success msg
                reloadFn(()=>{console.log('saving flow 10.')})
                webix.message({type:"success",text:txtStore.SAVESUCCESS})

                // remainVerFn(console.log('saving flow 11'))
                gModel.remainDataIn20release(setTabVo)
              
            })
          })
        })
      }
    }

    let t:webix.ui.layout = $$('topView')

    //2.
    t.disable()

    //3.
    console.log('saving flow 3.')
    gCtrl.checkVersion(()=>{
      //4.
      console.log('saving flow 4.')
      webix.confirm({
        title:"Save",
        ok:"No", 
        cancel:"Yes",
        text: gStore.user+", are you sure to alter setting?",
        callback: function(result){
          if(!result){//"Yes"
          OperationController.loadingWin.show()
            //5.
            console.log('saving flow 5.')
            checkAnotherVerFn((isSameId)=>{
              //no change ,go on procedure
              if(isSameId){
                proceedToSave()
              }else{
                let newSetVerBox:any = webix.confirm({
                    title:"Another new version",
                    ok:"No", 
                    cancel:"Yes",
                    text: "Another new version has been created, are you sure to overwrite it?",//已有更新版本存在，请问是否继续储存?
                    callback: function(result){
                      //"Yes"
                      if(!result){
                        proceedToSave()
                      }else{

                        t.enable()
                        OperationController.loadingWin.close()
                      }
                    }
                  })
              }  
            }
            )
        }else{
          t.enable()
          OperationController.loadingWin.close()
        }
      }
      })
    })
  }

  static confirmSaving(callback){

      gCtrl.checkVersion(()=>{
        let cnfmBox:any = webix.confirm({
          title:"Save",
          ok:"No", 
          cancel:"Yes",
          text: gStore.user+", are you sure to alter setting?",
          callback: function(result){
            if(!result)//"Yes"
              callback()
          }
        })
      })
    }


}