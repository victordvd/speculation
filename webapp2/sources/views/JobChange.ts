import { JetView } from "webix-jet"
import JobChangeViewController from "./JobChangeViewController"

export default class JobChange extends JetView{

    static viewIds = {
        jcGrid:"jcGrid"
    }

    ctrl = new JobChangeViewController()

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
                    id:JobChange.viewIds.jcGrid,
                    dragColumn:true,
                    resizeColumn: { headerOnly: true },
                    rowHeight:60,
                    rowLineHeight:20,
                    css: "rows",
                    columns:[
                        // { id: "status", header: ["Status", textFilter], width: 80 ,sort:"string"},
                        { id: "eqp", header: ["Equipment", textFilter], width: 100 ,sort:"string"},
                        { id: "curOper", header: ["Current Product Operation", textFilter], width: 200 ,sort:"string"},
                        { id: "jcOper", header: ["JC Product Operation", textFilter], width: 200 ,sort:"string"},
                        { id: "lotId", header: ["Conform Lot ID", textFilter], width: 140 ,sort:"string"},
                        { id: "timeIn", header: ["Conform Lot In time", textFilter], width: 160 ,sort:"string"},
                        { id: "lv", header: ["Level", textFilter], width: 70 ,sort:"string"}
                    ]
                }
            ]
        }

        return layout
    }

    init = this.ctrl.init

}