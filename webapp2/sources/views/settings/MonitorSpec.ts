import  { JetView } from "webix-jet" /*匯入 webix JetView*/
import MonitorSpecViewController from "./MonitorSpecViewController"/*匯入 view controller*/

/*
宣告 view class name
"extends JetView": 在運行時 webix jet 將會把這個 class 視為 view class
*/
export default class MonitorSpec extends JetView{

    /*定義元件 id*/
    static viewIds = {
        specGrid:"specGrid"
    }

    /*實例化 view controller*/
    ctrl = new MonitorSpecViewController()

    /*驗證相關*/
    static isDataValid = true
    static invalidType = {
        l2GreaterThanL3:'l2GreaterThanL3'
    }
    static invalidationMsg = {
        l2GreaterThanL3:'L3必须大于L2'
    }
    static invalidItem = {}

    config(){
        /*定義畫面元件*/
        let layout = {
            rows:[
                {
                    paddingX:10,
                    margin:5,
                    borderless:true,
                    cols:[
                        {
                            view:"button",/*元件類型-按鈕*/
                            label:"Reload",
                            type:"icon",
							icon:"wxi-sync",
                            width:80,
                            click:this.ctrl.onReloadBtnClick/*事件綁定至 view controller*/
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
                    view:"treetable",/*樹狀表格*/
                    id:MonitorSpec.viewIds.specGrid,
                    editable:true,
                    resizeColumn: { headerOnly: true },
                    /*表格欄位定義*/
                    columns:[
                        { id: "isSingleSetting", header: "Operation(☑:use default)", width: 200 ,sort:"string",
                            template:function(obj,common){
                                /*
                                    set value into grid store and change row class
                                */
                                let onchange = `
                                    var grid = $$('${MonitorSpec.viewIds.specGrid}');
                                    var data =  grid.data.pull;

                                    var id = this.getAttribute('id');
                                    var prowid = Number(this.getAttribute('rowid'));
                                    var checked = this.checked;

                                    console.log('chk change:',checked,id,prowid);
                                    
                                    if(checked){
                                        grid.removeRowCss(prowid,'monitor-disable');
                                        grid.addRowCss(prowid,'monitor-enable');
                                    }else{
                                        grid.removeRowCss(prowid,'monitor-enable');
                                        grid.addRowCss(prowid,'monitor-disable');
                                    }

                                    for(var rowid in data){
                                        var row = data[rowid];

                                        if(row.STEP_ID == id && row.SUB_STEP_ID == 'default'){

                                            row.isSingleSetting  = (checked)?1:0;
                                        }
      
                                        if(row.$parent == prowid){
                                            if(checked){
                                                grid.removeRowCss(rowid,'monitor-enable');
                                                grid.addRowCss(rowid,'monitor-disable');
                                            }else{
                                                grid.removeRowCss(rowid,'monitor-disable');
                                                grid.addRowCss(rowid,'monitor-enable');
                                            }
                                        }
                                    }`

                                if(obj.isSingleSetting == null){
                                    return common.treetable(obj,common)+'<span>'+obj.STEP_ID+'</span>'
                                }else if( obj.STEP_ID === '%'||obj.hasNoSubSteps){
                                    return common.treetable(obj,common)+"<span> "+obj.STEP_ID+"</span>"
                                }else{
                                    if(obj.isSingleSetting==1)
                                        return common.treetable(obj,common)+"<span> "+obj.STEP_ID+`</span><input id="${obj.STEP_ID}" rowid="${obj.id}" onchange="${onchange}" type="checkbox" class="webix_tree_checkbox" checked>`
                                    else
                                        return common.treetable(obj,common)+"<span> "+obj.STEP_ID+`</span><input id="${obj.STEP_ID}" rowid="${obj.id}" onchange="${onchange}" type="checkbox" class="webix_tree_checkbox">`
                                }
                            }
                        },
                        { id: "SUB_STEP_ID", header: "Next Operation", width: 150 ,sort:"string"},
                        { id: "L2", header:'L2 Time(H)<span style="color:red">*</span>', width: 120 ,sort:"int",editor:"text",
                            /*輸入轉換*/
                            editParse: function(value){

                                let v = Number(value)

                                if(Number.isNaN(v)){
                                    return 1
                                }else{                           
                                    if(v>200)
                                        return 200
                                    else if(v<1)
                                        return 1
                                    else
                                        return Math.floor(v)
                                }
                          }
                        },
                        { id: "L3", header: 'L3 Time(H)<span style="color:red">*</span>', width: 120 ,sort:"int",editor:"text",
                            editParse: function(value){
                                let v = Number(value)

                                if(Number.isNaN(v)){
                                    return 1
                                }else{                           
                                    if(v>200)
                                        return 200
                                    else if(v<1)
                                        return 1
                                    else
                                        return Math.floor(v)
                                }
                            }
                        },
                        { id: "L2_CNT", header: 'L2 Monitor Count<span style="color:red">*</span>', width: 160 ,sort:"int",editor:"text",
                            editParse: function(value){   
                                let v = Number(value)

                                if(Number.isNaN(v)){
                                    return 1
                                }else{                           
                                    if(v>5)
                                        return 5
                                    else if(v<1)
                                        return 1
                                    else
                                        return Math.floor(v)
                                }
                            }
                        },
                        { id: "L3_CNT", header: 'L3 Monitor Count<span style="color:red">*</span>', width: 160 ,sort:"int",editor:"text",
                            editParse: function(value){ 
                                let v = Number(value)

                                if(Number.isNaN(v)){
                                    return 1
                                }else{                           
                                    if(v>5)
                                        return 5
                                    else if(v<1)
                                        return 1
                                    else
                                        return Math.floor(v)
                                }
                            }
                        },
                        { id: "LAYER_NAME", header: "Description", width: 200 ,sort:"string",editor:"text"}
                    ],
                    /*驗證規則*/
                    rules:{
                        "L2":val=>{

                            let grid:any = $$(MonitorSpec.viewIds.specGrid)
                            
                            let editor = grid.getEditor()
                            if(!editor)
                                return true

                            let row = grid.getEditor().row
                            
                            if(!row)
                                return true

                            let end = grid.data.pull[row].L3

                            MonitorSpec.isDataValid = val < end

                            //added invalidation msg
                            if(!MonitorSpec.isDataValid){
                                MonitorSpec.invalidItem[MonitorSpec.invalidType.l2GreaterThanL3] = MonitorSpec.invalidationMsg.l2GreaterThanL3
                            }else{
                                delete MonitorSpec.invalidItem[MonitorSpec.invalidType.l2GreaterThanL3] 
                            }

                            //show validation msg
                            this.ctrl.showValidationMsg()

                            return MonitorSpec.isDataValid
                        },
                        "L3":val=>{

                            // if(val==null || val == ''){
                            //     MonitorSpec.isDataValid = false
                            //     return MonitorSpec.isDataValid
                            // }

                            let grid:any = $$(MonitorSpec.viewIds.specGrid)
                            let editor = grid.getEditor()
                            if(!editor)
                                return true

                            let row = editor.row

                            if(!row)
                              return true
                            
                            let start = grid.data.pull[row].L2

                            MonitorSpec.isDataValid =  val > start

                            return MonitorSpec.isDataValid
                        }
                    }
                    ,on:{
                        /*編輯後,標記該 record 已變更*/
                        onAfterEditStop:(state, editor, ignoreUpdate)=>{


					        let treeTb = <webix.ui.treetable>$$(MonitorSpec.viewIds.specGrid)
                            let rec = treeTb.data.pull[editor.row]
                            
                            //set change flag
                            rec.isChanged = true
                        }
                    }
                }

                /*           
                {
                    view:"datatable",
                    id:MonitorSpec.viewIds.specGrid,
                    editable:true,
                    dragColumn:true,
                    subrow:`test:<input type="number">`,
                    resizeColumn: { headerOnly: true },
                    columns:[
                        { id: "STEP_ID", header: "Operation",template:"{common.subrow()} #STEP_ID#", width: 100 ,sort:"string",editor:"select"},
                        { id: "SUB_STEP_ID", header: "Next Operation", width: 100 ,sort:"string",editor:"select"},
                        { id: "L2", header: "L2 Time", width: 90 ,sort:"int",editor:"text"},
                        { id: "L3", header: "L3 Time", width: 90 ,sort:"int",editor:"text"},
                        { id: "L2_CNT", header: "L2 Monitor Count", width: 160 ,sort:"int",editor:"text"},
                        { id: "L3_CNT", header: "L3 Monitor Count", width: 160 ,sort:"int",editor:"text"},
                        { id: "LAYER_NAME", header: "Description", width: 200 ,sort:"string",editor:"text"}
                    ]
                }*/
            ]
        }

        return layout
    }

    /*在畫面初始化,所運行的程序*/
    init = this.ctrl.init
}