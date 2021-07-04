import { JetView } from "webix-jet"
import {StockerSettingViewContriller} from "./StockerSettingViewController"

export default class StockerSetting extends JetView{

    ctrl = new StockerSettingViewContriller(this)

    static viewIds = {
        stockerGrid : "stockerGrid"
    }

    static staticCols = [
        {id:"STOCKER_ID_FROM",header:"",width:100,css:"machine",sort:"string"}
    ]

    config(){

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
                        {},
                        {
                            view:"button",
                            label:"Save",
                            type:"icon",
							icon:"wxi-check",
                            width:80,
                            click:this.ctrl.onSaveBtnClick
                        }

                    ]
                },
                {
                    view:"datatable",
                    id: StockerSetting.viewIds.stockerGrid,
                    editable:true,
                    dragColumn:true,
                    resizeColumn: { headerOnly: true },
                    css: "rows",
                    columns:StockerSetting.staticCols

                }
            ]

        }

        return layout
    }

    init = this.ctrl.init

}