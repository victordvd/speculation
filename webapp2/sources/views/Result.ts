import { JetView } from "webix-jet"
import ResultViewController from "./ResultViewController"

declare var gantt
declare var $$

export default class Result extends JetView {

    ctrl:ResultViewController = new ResultViewController(this)
    
    static viewIds = {

        photoTab:"photoTab",

        grpCombo:"grpCombo",
        timeCombo:"timeCombo",
        syncBtn:"syncBtn",
        lotBody:"lotBody",
        lotGantt:"lotGantt",
        maskBody:"maskBody",
        lotGrid:"lotGrid",
        maskGrid:"maskGrid",
        ganttSlider:"ganttSlider",
        lotChk:"lotChk",
        hintBtn:"hintBtn",
        hintWin:"hintWin",
        syncTog:'syncTg'
    }

    config() {

        let textFilter = { content: "textFilter" }

        let lotBody = {
            id: Result.viewIds.lotBody,
            paddingX:10,
            margin:5,
            borderless:true,
            rows: [
                {
                    view: "dhx-gantt",
                    id:Result.viewIds.lotGantt
                    // init:()=>{console.log('ginit')},
                    // ready:()=>{
                    //     console.log('gready')
                    // }          
                },
                {
                    view: "resizer"
                },
                {
                    view: "datatable",
                    id: Result.viewIds.lotGrid,
                    dragColumn:true,
                    resizeColumn: { headerOnly: true },
                    rowHeight:30,
                    css: "webix_shadow_medium",
                    // on:{
                    //     // onBeforeLoad:()=>{this.showOverlay("Loading...")},
                    //     // onAfterLoad:()=>{this.hideOverlay()}
                    //     onResize:(w,h)=>{
                    //         setTimeout(()=>{
                    //             ResultViewController.setGanttProdInfoText()
                    //         },1000)
                    //     }
                    // },
                    columns: [
                        // { id: "TOOLG_ID", header: ["GROUP_ID",textFilter], width: 100 },
                        { id:"index", header:"", sort:"int", width:50},
                        { id: "TOOL_ID", header: ["EQP_ID", textFilter], width: 120 ,sort:"string"},
                        { id: "LOT_ID", header: ["LOT_ID",textFilter], width: 150 ,sort:"string"},
                        { id: "SEQ", header: ["SEQ",textFilter], width: 70, sort: "int" },
                        { id: "OP_FLG", header: ["STATUS",textFilter], width: 100 ,sort:"string"},
                        { id: "M_LEVEL", header: ["M_LEVEL",textFilter], width: 100 ,sort:"string"},
                        { id: "PROD_ID", header: ["PROD_ID",textFilter], width: 150 ,sort:"string"},
                        { id: "STEP_ID_TARGET", header: ["STEP_ID_TARGET",textFilter], width: 150 ,sort:"string"},
                        { id: "CH_ID", header: ["MASK_ID",textFilter], width: 150 ,sort:"string"},
                        { id: "REACH_TIME", header: ["REACH_TIME",textFilter], width: 200 ,sort:"string"},
                        { id: "DUMMY", header: ["DUMMY",textFilter], width: 200 ,sort:"string"},
                        { id: "CH_TIME_IN", header: ["CH_TIME_IN",textFilter], width: 200 ,sort:"string"},
                        { id: "LEAD_TIME", header: ["LEAD_TIME",textFilter], width: 200 ,sort:"string"},
                        { id: "POST_TIME", header: ["POST_TIME",textFilter], width: 200 ,sort:"string"},
                        { id: "CH_TIME_OUT", header: ["CH_TIME_OUT",textFilter], width: 200 ,sort:"string"},
                        { id: "PLAN_ID", header: ["PLAN_ID",textFilter], width: 100 ,sort:"string"},
                        { id: "STEP_ID", header: ["STEP_ID",textFilter], width: 100 ,sort:"string"},
                        { id: "PTY", header: ["Priority",textFilter], width: 85 ,sort:"string"},
                        { id: "QTY", header: ["Quantity",textFilter], width: 85 ,sort:"int"},
                        { id: "RECIPE", header: ["RECIPE",textFilter], width: 310 ,sort:"string"},
                        { id: "Q_TIME", header: ["Q_TIME",textFilter], width: 200 ,sort:"string"},
                        { id: "REMARK", header: ["REMARK",textFilter], width: 400 ,sort:"string"},
                        { id: "CONSTRAINTS", header: ["CONSTRAINTS",textFilter], width: 350 ,sort:"string"},
                        { id: "OUTPUT_TIME", header: ["OUTPUT_TIME",textFilter], width: 200 ,sort:"string"},
                        { id: "PARENTID", header: ["PARENT_ID",textFilter], width: 300 ,sort:"string"}
                        // { id: "DISPATCH_TIME", header: ["DISPATCH_TIME",textFilter], width: 200 ,sort:"string"},
                        // { id: "CH_CNT", header: ["CH_CNT",textFilter], width: 80 ,sort:"int"},
                    ],
                    on:{
                        "data->onStoreUpdated":function(){//set indexes dynamically
                            this.data.each(function(obj, i){
                                obj.index = i+1;
                            })
                        }
                    }
                }
            ]
        }

        let maskBody = {
            id: Result.viewIds.maskBody,
            rows: [
                // {view: "dhx-gantt"},
                // {view:"resizer" },
                {
                    view: "datatable",
                    id: Result.viewIds.maskGrid,
                    dragColumn:true,
                    resizeColumn: { headerOnly: true },
                    css: "webix_shadow_medium",
                    // on:{onBeforeLoad:()=>{this.showOverlay("Loading...")}},
                    columns: [
                        // { id: "PARENTID", header: ["PARENTID",textFilter], width: 280 },
                        // { id: "VER_TIMEKEY", header: ["VER_TIMEKEY",textFilter], width: 150 ,sort:"string"},
                        { id: "RETICLES_ID", header: ["MASK_ID",textFilter], width: 160 ,sort:"string"},
                        { id: "TRIGGER_TIME", header: ["START_TIME",textFilter], width: 160 ,sort:"string"},
                        { id: "TIME_IN", header: ["END_TIME",textFilter], width: 160 ,sort:"string"},
                        { id: "LOCATION_FROM", header: ["EQP_ID_FROM",textFilter], width: 120 ,sort:"string"},
                        { id: "LOCATION", header: ["EQP_ID_TO",textFilter], width: 120 ,sort:"string"},
                        { id: "PROD_ID", header: ["PROD_ID",textFilter], width: 160 ,sort:"string"}
                        // { id: "TOOLG_ID", header: ["TOOLG_ID",textFilter], width: 100 },
                        // { id: "POD_ID", header: ["POD_ID",textFilter], width: 100 },
                        // { id: "TIME_OUT", header: ["TIME_OUT",textFilter], width: 150 },
                        // { id: "FLOWN_IN", header: ["FLOWN_IN",textFilter], width: 100 },
                        // { id: "PRIORITY", header: ["PRIORITY",textFilter], width: 100 },
                        // { id: "UPDATE_TIME", header: ["UPDATE_TIME",textFilter], width: 150 },
                        // { id: "LOT_ID", header: ["LOT_ID",textFilter], width: 100 },
                        // { id: "STATUS", header: ["STATUS",textFilter], width: 100 },
                        // { id: "REASON", header: ["REASON",textFilter], width: 150 },
                        // { id: "OUTPUT_TIME", header: ["OUTPUT_TIME",textFilter], width: 150 }
                    ]
                }
            ]
        }

        let photoRows = [
            {
                cols: [
                    {
                        view: "richselect",
                        id: Result.viewIds.grpCombo,
                        label: "GROUP ID",
                        autoConfig: true,
                        width: 250,
                        on: {
                            "onChange":this.ctrl.onGrpComboChange
                        }
                    },
                    {
                        view: "richselect",
                        id: Result.viewIds.timeCombo,
                        label: "TIME",
                        width: 250,
                        autoConfig: true,
                        on: {
                            "onChange": this.ctrl.onTimeComboChange
                        }
                    },
                    {
                        view: "button",
                        label: "Export",
                        type: "icon",
                        icon: "wxi-download",
                        css: "webix_primary",
                        width: 100,
                        click: (id, event) => {
                            let tabId = $$("photoTab").getValue()
                            let grpId = $$("grpCombo").getValue()
                            let time = $$("timeCombo").getText()
                            time = time.replace(/\s+|:|\//g, '')

                            let gridId;
                            let fName;
                            if (tabId === Result.viewIds.lotBody) {
                                gridId = Result.viewIds.lotGrid
                                fName = "LOT-OPT-OUTPUT-"
                            } else if (tabId === Result.viewIds.maskBody) {
                                gridId = Result.viewIds.maskGrid
                                fName = "MASK-OPT-RETICLE-OUTPUT-"
                            }

                            fName += time + "-" + grpId

                            let grid = $$(gridId)
                            let exclCols = []

                            grid.config.columns.forEach((col)=>{

                                // console.log(col.header[0].text)
                                exclCols.push({id:col.id,header:col.header[0].text})

                            })

                            webix.toExcel(grid, {
                                filename: fName,
                                columns:exclCols
                            });
                        }
                    },
                    {}
                ]
            },
            {
                cols: [
                    {
                        view:"slider", 
                        id:Result.viewIds.ganttSlider,
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
                            onChange:val=>{
                                console.log('slider: '+val)
                                this.ctrl.renderLotGantt(ResultViewController.ganttData)
                            }
                        } 
                    },
                    {
                        view:"checkbox", 
                        id:Result.viewIds.lotChk,
                        labelWidth:130,
                        width:200,
                        label:"Show Prod. Info.",
                        value:1,//0,1
                        on:{
                            'onChange':this.ctrl.onCheckboxChange
                        }
                        
                    },
                    {},
                    {
                        view:"button",
                        value:"Clear filters",
                        width:120,
                        // inputWidth:160,
                        // align:"center",
                        click:this.ctrl.clearFilters
                    },
                    {},
                    { 
                        view:"toggle",
                        id: Result.viewIds.syncTog,
                        type:"icon",
                        width:38,
                        offIcon:"wxi-radiobox-blank", 
                        onIcon:"wxi-sync",
                        value:1,
                        // offLabel:"Click me", 
                        // onLabel:"I'm pressed" 
                        on:{
                            onChange:this.ctrl.onToggleChange
                        }

                    },
                    {
                        view: "button",
                        id:Result.viewIds.syncBtn,
                        width:260,
                        click:this.ctrl.onSyncBtnClick
                    },
                    {
                        view:"button",
                        id:Result.viewIds.hintBtn,
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
            {
                view: "tabview",
                id: Result.viewIds.photoTab,
                tabbar: {
                    height: 20,
                    optionWidth: 100
                },
                cells: [
                    {
                        header: "Lot",
                        id: 0,
                        body: lotBody
                    },
                    {
                        header: "Mask",
                        id: 1,
                        body: maskBody
                    }
                ]
            }
        ]

        /*
        let layout = {
            id: "dataView",
            rows: [
                {
                    view: "tabview",
                    cells: [
                        {
                            header: "PHOTO",
                            body: {
                                rows: photoRows
                            }
                        }
                        ,
                        {
                            header: "ETCH",
                            body: {
                                template: "Some content"
                            }
                        },
                        {
                            header: "CELL",
                            body: {
                                template: "Some content"
                            }
                        }
                    ]
                }
            ]
        }*/

        //tmp
        let tmpView = {
            id: "dataView",
            rows: photoRows
        }

        return tmpView
    }

    init = this.ctrl.init
}