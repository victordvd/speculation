import { JetView } from "webix-jet"
import {SetTpfompolicyViewController} from "./SetTpfompolicyViewController"
export default class SetTpfompolicy extends JetView{

    static viewIds = {
        tpfomGrid:"tpfGrid",
        prodCombo:"prodCombo",
        stepCombo:"stepCombo"
    }

    ctrl = new SetTpfompolicyViewController(this)

    static staticCols = [
        // { id:"OPERATION",    header:"OPERATION", width:110 ,sort:"string"},
        { id:"PROCESSOPERATIONNAME",    header:"STEP ID", width:90 ,sort:"string"},
        { id:"MACHINENAME",    header:"EQP ID", width:90,sort:"string" }//,css:"machine"
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
                        {
                            view:"button",
                            label:"Add Product",
                            type:"icon",
							icon:"wxi-plus",
                            width:120,
                            click:this.ctrl.onAddProdBtnClick,
                            hidden:true
                        },
                        {},
                        {
                            view:"multicombo",
                            id:SetTpfompolicy.viewIds.stepCombo,
                            label:"Step",
                            labelWidth:50,
                            width:260,
                            tagMode: false,
                            tagTemplate: function(values){
                                return (values.length? values.length+" step(s) selected":"");
                              },
                            options: {
                                selectAll:true,
                                data:[]
                            },
                            on: {
                                onChange: this.ctrl.onStepComboItemClick
                            }
                        },
                        {
                            view:"multicombo",
                            id:SetTpfompolicy.viewIds.prodCombo,
                            label:"Product",
                            labelWidth:100,
                            width:360,
                            tagMode: false,
                            tagTemplate: function(values){
                                return (values.length? values.length+" product(s) selected":"");
                              },
                            options: {
                                selectAll:true,
                                data:[]
                            },
                            on: {
                                onChange: this.ctrl.onProdComboItemClick
                            }
                        },
                        {}
                        // {//closed on 2019/9/5
                        //     view:"button",
                        //     label:"Save",
                        //     type:"icon",
						// 	icon:"wxi-check",
                        //     width:80,
                        //     click:this.ctrl.onSaveBtnClick
                        // }
                    ]
                },
                {
                    view:"datatable",
                    id:SetTpfompolicy.viewIds.tpfomGrid,
                    leftSplit:2,
                    // css: "rows",
                    css:"rows center",
                    resizeColumn: { headerOnly: true },
                    columns:SetTpfompolicy.staticCols
                }
            ]
        }


        return layout
    }

    init=this.ctrl.init

}