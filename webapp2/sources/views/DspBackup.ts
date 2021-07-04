import { JetView } from "webix-jet"
import DspBackupViewController from "./DspBackupViewController"

export default class DspBackup extends JetView{

    static viewIds = {
        dspGrid:'dpsGrid'
    }

    ctrl = new DspBackupViewController()

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
                    id:DspBackup.viewIds.dspGrid,
                    dragColumn:true,
                    resizeColumn: { headerOnly: true },
                    rowHeight:60,
                    rowLineHeight:20,
                    css: "rows",
                    columns:[
                        { id: "FACTORYNAME", header: ["Factory", textFilter], width: 100 ,sort:"string"},
                        { id: "MACHINENAME", header: ["Equipment", textFilter], width: 100 ,sort:"string"},
                        { id: "PRODUCTSPECNAME", header: ["Product", textFilter], width: 160 ,sort:"string"},
                        { id: "PROCESSOPERATIONNAME", header: ["Step", textFilter], width: 80 ,sort:"string"},
                        { id: "SEQ", header: ["Sequence", textFilter], width: 90 ,sort:"string"},
                        { id: "UPDATE_TIME", header: ["Update Time", textFilter], width: 160 ,sort:"string"}
                    ]
                }
            ]
        }

        return layout
    }

    init = this.ctrl.init
}