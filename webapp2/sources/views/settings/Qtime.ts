import  { JetView } from "webix-jet" /*匯入 webix JetView*/
import QtimeViewController from "./QtimeViewController"/*匯入 view controller*/

/*
宣告 view class name
"extends JetView": 在運行時 webix jet 將會把這個 class 視為 view class
*/
export default class Qtime extends JetView{

    static viewIds = {
        qTimeGrid:'qTimeGrid'
    }

    ctrl = new QtimeViewController()

    static isDataValid = true
    static invalidType = {
        nullProd:'nullProd',
        nullFrom:'nullFrom',
        nullTo:'nullTo',
        nullQtime:'nullQtime'
    }
    static invalidationMsg = {
        nullProd:'"Product ID" 为必要项目',
        nullFrom:'"Step-From" 为必要项目',
        nullTo:'"Step-To" 为必要项目',
        nullQtime:'"Max Queue" 为必要项目'
      
    }
    static invalidItem = {}

    static checkIsValidate = ()=>{
        if(Object.keys(Qtime.invalidItem).length === 0){
            Qtime.isDataValid = true
        }else{
            Qtime.isDataValid = false
        }
    }

    config(){

        let textFilter = { content: "textFilter" }

        //remove space
        let strEditParse = (value)=>{    
            if(value)
                return value.trim()

            return value
        }

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
                    id:Qtime.viewIds.qTimeGrid,
                    editable:true,
                    dragColumn:true,
                    resizeColumn: { headerOnly: true },
                    select: "row", 
                    css: "rows",
                    columns:[
                        { id:"index", header:"", sort:"int", width:50},
                        { id: "PRODUCTID", header: ['Product ID<span style="color:red">*</span>',textFilter], width: 140 ,sort:"string",editor:"text", editParse:strEditParse},
                        { id: "FROMSTEP", header: ['Step-From<span style="color:red">*</span>',textFilter], width: 120 ,sort:"string",editor:"text", editParse:strEditParse},
                        { id: "TOSTEP", header: ['Step-To<span style="color:red">*</span>',textFilter], width: 120 ,sort:"string",editor:"text", editParse:strEditParse},
                        { id: "MAXQUEUETIME", header: ['Max Queue Time(H)<span style="color:red">*</span>',textFilter], width: 180 ,sort:"int",editor:"text", css:{'text-align':'right'},
                         editParse: function(value){
                                let v = Number(value)

                                if(Number.isNaN(v)){
                                    return 0
                                }else{                           
                                    if(v<0)
                                        return 0
                                    else if(v>=100)
                                        return 99.99
                                    else
                                        return v
                                }
                            }
                        }
                    ], 
                    // scheme:{
                    //     $init:function(obj){ obj.index = this.count(); }
                    // },
                    rules:{
                        "PRODUCTID":value=>{
                            let isDataValid = (value != null && value != '')

                            //added invalidation msg
                            if(!isDataValid){
                               Qtime.invalidItem[Qtime.invalidType.nullProd] = Qtime.invalidType.nullProd

                           }else{
                               delete Qtime.invalidItem[Qtime.invalidType.nullProd] 
                           }

                           Qtime.checkIsValidate()

                           return isDataValid
                        },
                        "FROMSTEP":value=>{
                            let isDataValid = (value != null && value != '')

                            //added invalidation msg
                            if(!isDataValid){
                               Qtime.invalidItem[Qtime.invalidType.nullFrom] = Qtime.invalidType.nullFrom

                           }else{
                               delete Qtime.invalidItem[Qtime.invalidType.nullFrom] 
                           }

                           Qtime.checkIsValidate()

                           return isDataValid
                        },
                        "TOSTEP":value=>{
                            let isDataValid = (value != null && value != '')

                            //added invalidation msg
                            if(!isDataValid){
                               Qtime.invalidItem[Qtime.invalidType.nullTo] = Qtime.invalidType.nullTo

                           }else{
                               delete Qtime.invalidItem[Qtime.invalidType.nullTo] 
                           }

                           Qtime.checkIsValidate()

                           return isDataValid
                        }
                    },
                    on:{
                        onValidationError:(id, obj, details)=>{
                            this.ctrl.showValidationMsg()
                        },
                        "data->onStoreUpdated":function(){//set indexes dynamically
                            this.data.each(function(obj, i){
                                obj.index = i+1;
                            })
                        }

                    }
                }
                    
            ]
        }

        return layout
    }

    init = this.ctrl.init
}