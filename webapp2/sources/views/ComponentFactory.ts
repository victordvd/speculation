export default class ComponentFactory{

    

    static combo = {
        grpCombo:{
            view:"richselect",
            id:undefined,
            label:"GROUP ID",
            width:180,
            value:1,
            options:[],
            on:{
                // "onChange":this.ctrl.onGrpComboChange
            }
        },
        grid:{
            
                view: "datatable",
                id: undefined,
                css: "rows",

        }


    }

    static initGrpCombo(id:string,onChange):object{
        
        let grpCombo  = Object.assign({},ComponentFactory.combo.grpCombo)

        grpCombo.id = id
        grpCombo.on = {
            onchange:onChange
        }

        return grpCombo
    }

    static generateCommonQueryBar = ()=>{
        let bar = {
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
                    // click:this.ctrl.onReloadBtnClick
                },
                {},
                {
                    view:"button",
                    label:"Save",
                    type:"icon",
                    icon:"wxi-check",
                    width:80,
                    // click:this.ctrl.onSaveBtnClick
                }
            ]
        }

        
    }
}