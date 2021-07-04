import { JetView } from "webix-jet"
import OptReserveViewController from "./OptReserveViewController"

export default class OptReserve extends JetView{

    static viewIds = {
        rsvGrid:"rsvGrid"
    }

    ctrl = new OptReserveViewController()

    config(){
        let textFilter = { content: "textFilter" }

        let layout = {
            rows:[
                {
                    paddingX:10,
                    margin:5,
                    borderless:true,
                    cols:[
                        {
                            view:"button",
                            label:"Reload",
                            type:"icon",
							icon:"wxi-sync",
                            width:80,
                            click:this.ctrl.onReloadBtnClick
                        },
                        {}
                    ]
                },           
                {
                    view:"datatable",
                    id:OptReserve.viewIds.rsvGrid,
                    dragColumn:true,
                    resizeColumn: { headerOnly: true },
                    rowHeight:60,
                    rowLineHeight:20,
                    css: "rows",
                    columns:[
                        { id: "TOOL_ID", header: ["EQP ID", textFilter], width: 100 ,sort:"string"},
                        { id: "DSP_PROD_ID", header: ["DSP Product ID", textFilter], width: 150 ,sort:"string"},
                        { id: "DSP_STEP_ID", header: ["DSP Step ID", textFilter], width: 100 ,sort:"string"},
                        { id: "PROD_ID", header: ["Product ID", textFilter], width: 150 ,sort:"string"},
                        { id: "STEP_ID", header: ["Step ID", textFilter], width: 100 ,sort:"string"}
                        // { id: "SEQ", header: ["Sequence", textFilter], width: 90 ,sort:"string"}
                    ]
                }
            ]
        }

        return layout

        
    }

    init = this.ctrl.init

}