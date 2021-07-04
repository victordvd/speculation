import { JetView } from "webix-jet"
import {MachineDownViewController} from "./MachineDownViewController"
import eCtrl from "../../controllers/EditorController"
import cmp from "../ComponentFactory"

declare var $$

export default class  MachineDown extends JetView{

    static viewIds = {
        downGrid :"downGrid",
        grpCombo :"grpCombo"

    }

    static isDataValid = true

    ctrl = new MachineDownViewController()

    config(){

        // webix.editors.$popup = {
        //     date:{
        //         view:"popup",
        //       body:{ view:"calendar",height:400, timepicker:true, icons:true,minuteStep:5}
        //     }
        // }

        eCtrl.initDateTimeEditor()

        let format = val=>{
            return val.replace(/T/,' ')
        }

        //grp combo has been removed on 2019/7/30
        // let grpCombo = cmp.initGrpCombo(MachineDown.viewIds.grpCombo,this.ctrl.onGrpComboChange)

        let layout = {
            rows:[
                {
                    paddingX:10,
                    margin:5,
                    borderless:true,
                    cols:[
                        // grpCombo,
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
                            label:"Add",
                            icon:"wxi-plus",
                            type:"icon",
                            width:100,
                            click:this.ctrl.onAddBtnClick
                        },
                        {
                            view:"button",
                            label:"Remove",
                            icon:"wxi-minus",
                            type:"icon",
                            width:100,
                            click:this.ctrl.onDelBtnClick
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
                    id: MachineDown.viewIds.downGrid,
                    editable:true,
                    dragColumn:true,
                    resizeColumn: { headerOnly: true },
                    select: "row", 
                    css: "rows",
                    // onClick:{
                    //     webixtype_base:this.ctrl.onGridBtnClick
                    //   },
                    columns:[
                    // { 
                    //     id: "BUTTON" ,header:"",width:30,template:(obj)=>{
                    //     return `<div class='webix_el_button'><button class='webixtype_base'><i class="wxi-minus"></i></button></div>`
                    //   }
                    // },
                    { id: "TOOL_ID", header: `EQP ID<span style="color:red">*</span>` ,width:100,editor:"richselect",sort:"string"},
                        { id: "DOWN_START", header: `DOWN START<span style="color:red">*</span>`,width:250,sort:"string",
                            format:format,
                            // editor: "date",format:webix.Date.dateToStr("%Y-%m-%d %H:%i",false) 
                            // editor:"inline-text", template:tpl
                            editor:"datetime"
                        },
                        { id: "DOWN_END", header: `DOWN END<span style="color:red">*</span>`,width:250,sort:"string",
                            format:format,
                            editor:"datetime"
                            // editor:"inline-text", template:tpl
                         },
                         { id: "REMARK", header: "REMARK",width:300,editor:"text",css:{"text-align":"left"},sort:"string"},
                        //  { id: "CODE_ID", header: "PM验证L3",width:80, template:"{common.customCheckbox()}", editor:false,css:{"text-align":"left"},sort:"string"}
                         { id: "CODE_ID", header: "PM验证L3",width:80, template:"{common.checkbox()}", editor:false,editable:false,css:{"text-align":"left"},sort:"string"}
                    ],
                    type:{
                        // real checkbox
                        // class='webix_table_checkbox' provides the logic 
                        customCheckbox:function(obj, common, value, config){
                          var checked = (value == config.checkValue) ? 'checked="true"' : '';      
                          return "<input class='webix_table_checkbox' type='checkbox' "+checked+">";
                        },
                      },
                    rules:{
                        "TOOL_ID":(value)=>{
                            return value != ""
                        },
                        "DOWN_START":val=>{

                            if(val==null || val == ''){
                                MachineDown.isDataValid = false
                                return MachineDown.isDataValid
                            }

                            let grid:webix.ui.datatable = $$(MachineDown.viewIds.downGrid)
                            
                            let editor = grid.getEditor()
                            if(!editor)
                                return true

                            let row = grid.getEditor().row
                            

                            if(!row)
                                return true

                            let end = grid.data.pull[row].DOWN_END

                            MachineDown.isDataValid = val < end

                            return MachineDown.isDataValid
                        },
                        "DOWN_END":val=>{

                            if(val==null || val == ''){
                                MachineDown.isDataValid = false
                                return MachineDown.isDataValid
                            }

                            let grid:webix.ui.datatable = $$(MachineDown.viewIds.downGrid)
                            let editor = grid.getEditor()
                            if(!editor)
                                return true

                            let row = editor.row

                            if(!row)
                              return true
                            
                            let start = grid.data.pull[row].DOWN_START

                            MachineDown.isDataValid =  val > start

                            return MachineDown.isDataValid
                        }
                    },
                    on:{
                        onValidationError:function(id, obj, details){
                            var index = this.getIndexById(id)+1;
                            // webix.message({ type:"error", text:"" });
                        }

                     }

                }
            ]
        }

        return layout
    }

    init=this.ctrl.init


}