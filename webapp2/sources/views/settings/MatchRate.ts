import { JetView } from "webix-jet"
import MatchRateViewController from "./MatchRateViewController"

declare var $$
declare var alasql

export default class MatchRate extends JetView{

    ctrl = new MatchRateViewController()

    static viewIds = {
        reviewGrid:"reviewGrid",
        uploader:"uploader",
        excelviewer:"excelviewer",
        excelBar:"excelBar",
        viewGird:"viewGird"
    }

    config(){

        let textFilter = { content: "textFilter" }

        let layout = {
                view: "tabview",
                // id:MaskTransfer.viewId.maskTv,
                tabbar: {
                    height: 20,
                    optionWidth: 120,
                    on:{
                        // onChange:this.ctrl.onTabChange
                    }
                },
                cells: [
                        {
                            header:"Data",
                            body:{
                                view:"datatable",
                                id:MatchRate.viewIds.viewGird,
                                dragColumn:true,
                                resizeColumn: { headerOnly: true },
                                rowHeight:60,
                                rowLineHeight:20,
                                css: "rows",
                                columns:[
                                    { id:"index", header:"", sort:"int", width:50},
                                    { id: "MODEL_TYPE", header: ["Model Type", textFilter], width: 110 ,sort:"string"},
                                    { id: "DATETIMEKEY", header: ["Date", textFilter], width: 110 ,sort:"string"},
                                    { id: "PRODUCT_DESC", header: ["Description", textFilter], width: 240 ,sort:"string"},
                                    { id: "PRODUCT_ID", header: ["Product ID", textFilter], width: 160 ,sort:"string"},  
                                    { id: "IN_QTY", header: ["Array In", textFilter], width: 100 ,sort:"string"},
                                    { id: "OUT_QTY", header: ["Array Out", textFilter], width: 100 ,sort:"string"},
                                    { id: "VER_TIMEKEY", header: ["VER_TIMEKEY", textFilter], width: 160 ,sort:"string",
                                        format:val=>{
                                            if(val)
                                                return val.replace(/T/,' ')
                                            else
                                                return val
                                        }
                                    },
                                    { id: "PARENTID", header: ["PARENTID", textFilter], width: 300 ,sort:"string"}
                                ],
                                on:{
                                    "data->onStoreUpdated":function(){//set indexes dynamically
                                        this.data.each(function(obj, i){
                                            obj.index = i+1;
                                        })
                                    }
                                }
                            }          
                        },
                        {
                            header:"Upload",
                            body:{
                                rows:[     
                                    {
                                        // view:"layout",
                                        // type:"space",
                                        paddingX:10,
                                        margin:5,
                                        borderless:true,
                                        cols:[
                                        {
                                            view:"uploader",
                                            id:MatchRate.viewIds.uploader,
                                            width:200,
                                            value:"Upload file",
                                            // hide: true,
                                            // multiple:false,
                                            autosend:false,
                                            // upload:apiurl,
                                            on:{
                                                onBeforeFileAdd:this.ctrl.onBeforeFileAdd
                                            }
                                        },
                                        // {
                                        //     view:"button",
                                        //     label:"Reload",
                                        //     type:"icon",
                                        // 	icon:"wxi-sync",
                                        //     width:80,
                                        //     click:this.ctrl.onReloadBtnClick
                                        // },
                                        {},
                                        {
                                            view:"button",
                                            label:"Sample",
                                            width:80,
                                            click:this.ctrl.onSampleBtnClick
                                        },
                                        {
                                            view:"button",
                                            label:"Save",
                                            type:"icon",
                                            icon:"wxi-check",
                                            // css:{'background-color': 'rgb(244, 245, 249)'}, 
                                            width:80,
                                            click:this.ctrl.onSaveBtnClick
                                        }
                                    ]
                                },
                            { view:"excelbar", id:MatchRate.viewIds.excelBar },
                            {
                                id:MatchRate.viewIds.excelviewer,
                                view:"excelviewer", 
                                // spans:true,
                                // excelHeader: false,
                                header:false,
                                toolbar: MatchRate.viewIds.excelBar
                            }
                        ]
                    }
                }
            ]
        }

        return layout

    }

    init = this.ctrl.init

}