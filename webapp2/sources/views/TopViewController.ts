import Top from "../views/Top"
import {plugins} from "webix-jet"
import ResultViewController from "./ResultViewController"
import OverviewScheduleViewController from "./OverviewScheduleViewController"
import GlobalModel from "models/GlobalModel";
import gCtrl from "../controllers/GlobalController";
import vCtrl from "../controllers/VersionController";
import MaskTransferViewController from "./settings/MaskTransferViewController"
import JobChangeViewController from "../views/JobChangeViewController"

declare var $$

export default class TopViewController{

    view
    constructor(view){
        this.view = view
    }

    init = (view)=>{
        	//enable menu item href
		// this.use(plugins.Menu, Top.viewIds.appMenu)
		//check version
        vCtrl.triggerOptOutputInterval()
        
        // this.scope = view
    }

    onMenuItemClick = (id)=>{
        if(id=="setting")
                return

        this.view.show(id)

        //remove remaining gantt tip
        let tipCl:HTMLCollection = document.getElementsByClassName('gantt_tooltip')
        if(tipCl.length>0)
            tipCl[0].remove()

        // console.log('app: '+id)
        this.clearUpdateInfo()

        //clear opt_output version
        vCtrl.setLoadDataFn(null)
        
        let updBar = $$(Top.viewIds.updBar)

        //hide update info
        if( id === Top.ViewNames.OverviewSchedule|| id === "Result" || id === "JobChange" || id === "SetTpfompolicy"){
            updBar.hide()
        }else{
            // clearInterval(AllGroupGanttViewController.syncItvId)
            // clearInterval(ResultViewController.syncItvId)
            updBar.show()
        }

        //disable mask transfer idle interval
        if(OverviewScheduleViewController.syncItvId)
            clearInterval(OverviewScheduleViewController.syncItvId)
        if(ResultViewController.syncItvId)
            clearInterval(ResultViewController.syncItvId)
        if(MaskTransferViewController.idleItv)
            clearInterval(MaskTransferViewController.idleItv)
        if(MaskTransferViewController.renderItv)
            clearInterval(MaskTransferViewController.renderItv)
        // if(JobChangeViewController.checkVerItv)
        //     clearInterval(JobChangeViewController.checkVerItv)

    }

    clearUpdateInfo=()=>{
        let userLab:webix.ui.label = $$(Top.viewIds.updUserLab)
        let timeLab:webix.ui.label = $$(Top.viewIds.updTimeLab)
        let nameLab:webix.ui.label = $$(Top.viewIds.nameLab)

        nameLab.setValue("")
        userLab.setValue("Update User: ")
        timeLab.setValue("Update Time: ")
    }

    static setCurrentUser(user){
        let userLab:webix.ui.label = $$(Top.viewIds.curUserLab)
        userLab.setValue("Current User: "+user)
    }

    static setUpdateInfo = async (id:string)=>{

        let userLab:webix.ui.label = $$(Top.viewIds.updUserLab)
        let timeLab:webix.ui.label = $$(Top.viewIds.updTimeLab)

        //avoid there're no data
        userLab.setValue("Update User: ")
        timeLab.setValue("Update Time: ")

        let data:any = await GlobalModel.selectVerInfo(id)

        if(data == null ||data.length===0){
            console.error('no data for update info!')
            
            return null
        }

        let user = data[0].UPDATE_USER
        let time = data[0].UPDATE_TIME

        userLab.setValue("Update User: "+user)
        timeLab.setValue("Update Time: "+time)

        return data
    }

    static setUpdateInfo_MAT = async (id:string)=>{

        let userLab:webix.ui.label = $$(Top.viewIds.updUserLab)
        let timeLab:webix.ui.label = $$(Top.viewIds.updTimeLab)

        //avoid there're no data
        userLab.setValue("Update User: ")
        timeLab.setValue("Update Time: ")

        let data:any = await GlobalModel.selectMatVerInfo(id)

        if(data == null ||data.length===0){
            console.error('no data for update info!')
            
            return null
        }

        let user = data[0].UPDATE_USER
        let time = data[0].UPDATE_TIME

        userLab.setValue("Update User: "+user)
        timeLab.setValue("Update Time: "+time)

        return data
    }

    static setUpdateInfoWithName = async(id:string)=>{

        let nameLab:webix.ui.label = $$(Top.viewIds.nameLab)
        let userLab:webix.ui.label = $$(Top.viewIds.updUserLab)
        let timeLab:webix.ui.label = $$(Top.viewIds.updTimeLab)

        //avoid there're no data
        nameLab.setValue("Name: ")
        userLab.setValue("Update User: ")
        timeLab.setValue("Update Time: ")

        let data:any = await GlobalModel.selectVerInfo(id)

        if(data == null ||data.length===0){
            console.error('no data for update info!')
            
            return null
        }

        let name = data[0].NAME
        let user = data[0].UPDATE_USER
        let time = data[0].VER_UPDATE_TIME

        nameLab.setValue("Name: "+name)
        userLab.setValue("Update User: "+user)
        timeLab.setValue("Update Time: "+time)

        return data
    }

    onLogoutBtnClick = ()=>{

        webix.confirm({
            title:"Logout",
            ok:"No", 
            cancel:"Yes",
            text: "Are you sure to log out?",
            callback: function(result){
              if(!result)//"Yes"
                gCtrl.clearCookie()
            }
          })


    }

    static getCurrentPage = ()=>{
        
        let w = $$(Top.viewIds.topWide)

        return w.getChildViews()[0].$scope.getUrl()[0].page

    }

    // static setUpdateInfo(user:string,time:string){

    //     let userLab:webix.ui.label = $$(Top.viewIds.userLab)
    //     let timeLab:webix.ui.label = $$(Top.viewIds.timeLab)
    
    //     userLab.setValue("Update User: "+user)
    //     timeLab.setValue("Update Time: "+time)
    
    // }

}