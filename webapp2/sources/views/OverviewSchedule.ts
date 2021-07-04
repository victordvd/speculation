import { JetView } from "webix-jet"
import OverviewScheduleViewController from "./OverviewScheduleViewController"

declare var gantt
declare var $$

export default class OverviewSchedule extends JetView {

    ctrl:OverviewScheduleViewController = new OverviewScheduleViewController(this)
    
    static viewIds = {
        timeCombo:"timeCombo",
        syncBtn:"syncBtn",
        lotGantt:"lotGantt",
        jcGantt:"jcGantt",
        ganttTabview:"ganttTabview",
        overallTab:"overallTab",
        jcTab:"jcTab",
    
        ganttSlider:"ganttSlider",
        lotChk:"lotChk",
        hintBtn:"hintBtn",
        hintWin:"hintWin"
    }

    config() {

        // let textFilter = { content: "textFilter" }

        let photoRows = [
            {
                cols: [
                    {
                        view: "richselect",
                        id: OverviewSchedule.viewIds.timeCombo,
                        label: "TIME",
                        labelWidth:55,
                        width: 350,//280
                        options:[],
                        // height:60,
                        // css:"multi-line-combo",
                        // inputHeight:60,
                        // options:{
                        //     body:{
                        //         view:"list",
                        //         type:{ height:60}
                        //     }
                        // },
                        on: {
                            "onChange": this.ctrl.onTimeComboChange
                        }
                    },
                    {
                        view:"slider", 
                        id:OverviewSchedule.viewIds.ganttSlider,
                        label:"Hour Count", 
                        labelWidth:100,
                        width:250,
                        value:1,
                        // step:0.5,
                        // min:0.5, 
                        min:1, 
                        max: 24,
                        title:obj=>{ return  obj.value},
                        on:{
                            onChange:this.ctrl.onSliderChange
                        } 
                    },
                    {
                        view:"checkbox", 
                        id:OverviewSchedule.viewIds.lotChk,
                        labelWidth:120,
                        width:150,
                        label:"Show Prod. Info.",
                        value:1,//0,1
                        on:{
                            'onChange':this.ctrl.onCheckboxChange
                        }
                    },
                    {},
                    {
                        view: "button",
                        id:OverviewSchedule.viewIds.syncBtn,
                        width:300,
                        type: "icon",
                        icon: "wxi-sync",
                        click:this.ctrl.onSyncBtnClick
                    },
                    // { view: "switch", value: 1 },//, label:"Light"
                    {
                        view:"button",
                        id:OverviewSchedule.viewIds.hintBtn,
                        label:"?",
                        width:30,
                        css:"questionmark",
                        tooltip:"色彩说明",
                        click:this.ctrl.onhintBtnClick
                        // type:"icon",
                        // icon:"question"
                    }
                ]
            },

            /*
            {
                height:23,
                cols:[
                    {
                        view: "button",
                        width:120,
                        label:"Overview",
                        click:this.ctrl.onOverviewBtnClick
                    },
                    {
                        view: "button",
                        width:120,
                        label:"JC comparison",
                        click:this.ctrl.onJCcompBtnClick
                    }
                ]
            },
            {
                view: "dhx-gantt",
                id:AllGantt.viewIds.lotGantt
            } */
            
            {
                view: "tabview",
                id: OverviewSchedule.viewIds.ganttTabview,
                tabbar: {
                    height: 20,
                    optionWidth: 120,
                    on:{
                        onChange:this.ctrl.onTabbarChange
                    }
                },
                cells: [
                    {
                        header: "Overview",
                        id: OverviewSchedule.viewIds.overallTab,
                        rows:[]//essencial!!
                    }
                    ,{
                        header: "JC comparasion",
                        id: OverviewSchedule.viewIds.jcTab,
                        rows:[]//essencial!!
                    }
                ]
            }
        ]

        //tmp
        let tmpView = {
            id: "dataView",
            rows: photoRows
        }

        return tmpView
    }

    init = this.ctrl.init
}