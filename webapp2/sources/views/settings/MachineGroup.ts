import { JetView } from "webix-jet"
import {MachineGroupViewController} from "./MachineGroupViewController"
//import {MachineGroupp as proxy} from "../models/MachineGroupModel"

export default class MachineGroup extends JetView{

	ctrl:MachineGroupViewController = new MachineGroupViewController(this)

	static viewIds ={
		machineLayout:"machineLayout",
		grpCombo:"grpCombo",
        machineTable:"machineTable",
        editButton:"editButton",
        saveButton:"saveButton",
        reloadButton:"reloadButton",
        addButton:"addButton",
        delButton:"delButton",
        uptLabel:"uptLabel"
	}

	config(){

		let machinedata = {
			view:"datatable",
			id:MachineGroup.viewIds.machineTable,
            // dragColumn:true,//incurred combobox disabled
            resizeColumn: { headerOnly: true },
            autoConfig: true,
            editable:true,
            css: "rows",
            select: "row",            
            //multiselect: true,
			columns:[
                { id: "num", header: [""],css:"rowheader",width:40},
                //{ id: "fac", header: ["Factory"] },
                { id: "machine", header: ["EQP ID"], sort: "string",width:100,css:"machine"},//,editor:"text"
                { id: "group", header: ["GROUP ID"], sort: "string",editor: "select",width:100,template:function(obj){return obj.group}}
                

            ],
            on:{
                //顯示編號，每次排序後都會重新賦值numB
                "data->onStoreUpdated":this.ctrl.onSortMachine
                              
            },
            // rules:{
            //     //machine:this.ctrl.notEmpty,
            //     machine:this.ctrl.checkMachine
            // },
            ready:function(){
                this.validate();
            }
		}

		let layout = {
			id:MachineGroup.viewIds.machineLayout,
			rows:[
				{
					margin:10,
					cols:[						
						{                            
							id:MachineGroup.viewIds.grpCombo,
							view:"richselect",
                            label:"MODULE",
							width:180,
							value:1,
							options:[],
							on:{
								"onChange":this.ctrl.loadData
							}
                        },
						{
                            id:MachineGroup.viewIds.reloadButton,
                            view:"button",                            
							label:"Reload",
                            width:80,
                            type:"icon",
							icon:"wxi-sync",
                            click:this.ctrl.onLoadBtnClick
                        },
                        {

                        },
						/*{
                            id:MachineGroupView.viewIds.editButton,
							view:"button",
                            label:"Edit",
                            value:"edit",
                            width:100,
                            click:this.ctrl.onEditBtnClick
                        },*/
                        {
                            id:MachineGroup.viewIds.addButton,
                            view:"button",
                            label:"Add",
                            value:"add",
                            icon:"wxi-plus",
                            type:"icon",
                            hidden: true,
                            width:80,
                            click:this.ctrl.onAddBtnClick
                        },
                        {
                            id:MachineGroup.viewIds.delButton,
                            view:"button",
                            label:"Delete",
                            value:"delete",
                            icon:"wxi-minus",
                            type:"icon",
                            hidden: true,
                            width:80,
                            click:this.ctrl.onDelBtnClick
                        },
                        {                            
                        },
                        {
                            id:MachineGroup.viewIds.saveButton,
                            view:"button",
                            label:"Save",
                            value:"save",
                            type:"icon",
                            icon:"wxi-check",
                            //hidden: true,
                            width:80,
                            click:this.ctrl.onSaveBtnClick
                             
                        }		
					]
                },machinedata        
			]
		}

		return layout
	}

	init= this.ctrl.init

}