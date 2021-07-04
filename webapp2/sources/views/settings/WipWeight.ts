import { JetView } from "webix-jet"
import WipWeightViewController from "./WipWeightViewController"
import eCtrl from "../../controllers/EditorController"
import cmp from "../ComponentFactory"

declare var $$

export default class WipWeight extends JetView {

    static viewIds = {
        stGrid:"stGrid",
        csGrid:"csGrid",
        grpCombo:"grpCombo"
    }

    ctrl = new WipWeightViewController()

    static isDataValid = true
    static invalidType = {
        // nullWeight:'nullWeight',
        atLeastOne:'atLeastOne'
    }
    static invalidationMsg = {
        // nullWeight:'"Weighting" 为必要项目',
        atLeastOne:'至少需要一个项目<br>("Step ID","Product ID","Lot ID")'
      
    }
    static invalidItem = {}

    static checkIsValidate = ()=>{
        if(Object.keys(WipWeight.invalidItem).length === 0){
            WipWeight.isDataValid = true
        }else{
            WipWeight.isDataValid = false
        }
    }

    config(){

        eCtrl.initDateTimeEditor()

        let grpCombo = cmp.initGrpCombo(WipWeight.viewIds.grpCombo,this.ctrl.onGrpComboChange)

        let format = val=>{
            return val.replace(/T/,' ')
        }

        let weightEditParse = function(value){

            let v = Number(value)

            if(Number.isNaN(v)){
                return 0
            }else{                           
                if(v>100)
                    return 100
                else if(v<0)
                    return 0
                else
                    return v
        }
  }

        let layout = {
            rows:[
                {
                    paddingX:10,
                    margin:5,
                    borderless:true,
                    cols:[
                        grpCombo,
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
                            label:"Use default",
                            icon:"wxi-pencil",
                            type:"icon",
                            width:120,
                            click:this.ctrl.onDefaultBtnClick
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
                    rows: [
                        {
                            view: "tabview",
                            // id: OverviewSchedule.viewIds.ganttTabview,
                            tabbar: {
                                height: 20,
                                optionWidth: 120,
                                on:{
                                    // onChange:this.ctrl.onTabbarChange
                                }
                            },
                                cells:[
                                    {
                                    header: "Standardized",
                                    cols:[
                                        {
                                            width:30,
                                            rows:[
                                                {
                                                    view:"button",
                                                    icon:"wxi-plus",
                                                    type:"icon",
                                                    width:30,
                                                    click:this.ctrl.onStAddBtnClick
                                                },
                                                {
                                                    view:"button",
                                                    icon:"wxi-minus",
                                                    type:"icon",
                                                    width:30,
                                                    click:this.ctrl.onStDelBtnClick
                                                },
                                                {}
                                            ]
                                        },
                                        {       
                                            view:"datatable",
                                            id:WipWeight.viewIds.stGrid,
                                            editable:true,
                                            dragColumn:true,
                                            resizeColumn: { headerOnly: true },
                                            select: "row", 
                                            css: "rows",
                                            scroll:"y",
                                            columns:[
                                                // { id: "TOOLG_ID", header: ["Group"], width: 100 ,sort:"string"},
                                                { id: "PTY", header: ['Priority'], width: 80 ,sort:"string"/*,css:{"text-align":"left"}*/},
                                                { id: "WEIGHTING", header: ['Weighting<span style="color:red">*</span>'], width: 100 ,sort:"string",editor:"text",editParse: weightEditParse},
                                                { id: "CREATE_DATE", header: ['Create Date'], width: 180 ,sort:"string", format:format}
                                                // { id: "LOT_ID", header: ['Lot ID'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "LOT_TYPE", header: ['Lot Type'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                
                                                // { id: "RECIPE", header: ['Recipe<span style="color:red">*</span>'], width: 100 ,sort:"string"},
                                                // { id: "EFFECTIVE_TIME", header: ['Effective Time'], width: 250 ,sort:"string", format:format},
                                                // { id: "COMMAND", header: ['Command'], width: 200 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "PROD_ID", header: ['Product ID<span style="color:red">*</span>'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "LAYER", header: ['Layer'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "STAGE", header: ['Stage<span style="color:red">*</span>'], width: 100 ,sort:"string",editor:"text"},
                                                // { id: "ENTITY", header: ['Entity'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                            ],
                                            on:{
                                                onValidationError:(id, obj, details)=>{
                                                    this.ctrl.showValidationMsg()
                                                }
                        
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        { view:"resizer" },
                        {
                            view: "tabview",
                            // id: OverviewSchedule.viewIds.ganttTabview,
                            tabbar: {
                                height: 20,
                                optionWidth: 120,
                                on:{
                                    // onChange:this.ctrl.onTabbarChange
                                }
                            },
                                cells:[
                                    {
                                    header: "Customized",
                                    cols:[
                                        {
                                            width:30,
                                            rows:[
                                                {
                                                    view:"button",
                                                    icon:"wxi-plus",
                                                    type:"icon",
                                                    width:30,
                                                    click:this.ctrl.onCsAddBtnClick
                                                },
                                                {
                                                    view:"button",
                                                    icon:"wxi-minus",
                                                    type:"icon",
                                                    width:30,
                                                    click:this.ctrl.onCsDelBtnClick
                                                },
                                                {}
                                            ]
                                        },
                                        {       
                                            view:"datatable",
                                            id:WipWeight.viewIds.csGrid,
                                            editable:true,
                                            dragColumn:true,
                                            resizeColumn: { headerOnly: true },
                                            select: "row", 
                                            css: "rows",
                                            scroll:"y",
                                            columns:[
                                                // { id: "TOOLG_ID", header: ["Group"], width: 100 ,sort:"string"},
                                                { id: "PROD_ID", header: ['Product ID<span style="color:blue">+</span>'], width: 160 ,sort:"string",editor:"text"},
                                                { id: "TARGET_STEP_ID", header: ['Step ID<span style="color:blue">+</span>'], width: 160 ,sort:"string",editor:"text"},
                                                { id: "LOT_ID", header: ['Lot ID<span style="color:blue">+</span>'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "PTY", header: ['Priority'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "LOT_TYPE", header: ['Lot Type'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "RECIPE", header: ['Recipe<span style="color:blue">+</span>'], width: 100 ,sort:"string",editor:"text"},
                                                
                                                { id: "WEIGHTING", header: ['Weighting<span style="color:red">*</span>'], width: 100 ,sort:"string",editor:"text",editParse: weightEditParse},
                                                // { id: "EFFECTIVE_TIME", header: ['Effective Time'], width: 200 ,sort:"string", format:format},
                                                // { id: "COMMAND", header: ['Command'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "LAYER", header: ['Layer'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "STAGE", header: ['Stage<span style="color:red">*</span>'], width: 100 ,sort:"string",editor:"text"},
                                                // { id: "ENTITY", header: ['Entity'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                { id: "CREATE_DATE", header: ['Create Date'], width: 200 ,sort:"string", format:format}
                                            ],
                                            rules:{
                                                "LOT_ID":(value)=>{

                                                    let grid = $$(WipWeight.viewIds.csGrid)
                            
                                                    let editor = grid.getEditor()
                                                    let step
                                                    let prod

                                                    if(editor){
                                                        let row = grid.getEditor().row

                                                        if(!row)
                                                            return true

                                                        step = grid.data.pull[row].TARGET_STEP_ID
                                                        prod = grid.data.pull[row].PROD_ID
                                                    }else{

                                                        let gridData = grid.serialize()

                                                        let rec = gridData[gridData.length-1]

                                                        step = rec.TARGET_STEP_ID
                                                        prod = rec.PROD_ID

                                                    }
                                                    
                                                    let isDataValid = (value||step||prod)
                        
                                                    //added invalidation msg
                                                    if(!isDataValid){
                                                       WipWeight.invalidItem[WipWeight.invalidType.atLeastOne] = WipWeight.invalidationMsg.atLeastOne
                        
                                                   }else{
                                                       delete WipWeight.invalidItem[WipWeight.invalidType.atLeastOne] 
                                                   }
                        
                                                   WipWeight.checkIsValidate()
                        
                                                   return isDataValid
                                                },
                                                "TARGET_STEP_ID":(value)=>{

                                                    let grid = $$(WipWeight.viewIds.csGrid)
                            
                                                    let editor = grid.getEditor()
                                                    let lot
                                                    let prod

                                                    if(editor){
                                                        let row = grid.getEditor().row

                                                        if(!row)
                                                            return true

                                                        lot = grid.data.pull[row].LOT_ID
                                                        prod = grid.data.pull[row].PROD_ID
                                                    }else{

                                                        let gridData = grid.serialize()

                                                        let rec = gridData[gridData.length-1]

                                                        lot = rec.LOT_ID
                                                        prod = rec.PROD_ID

                                                    }

                                                    let isDataValid = (value||lot||prod)
                        
                                                    //added invalidation msg
                                                    if(!isDataValid){
                                                       WipWeight.invalidItem[WipWeight.invalidType.atLeastOne] = WipWeight.invalidationMsg.atLeastOne
                        
                                                   }else{
                                                       delete WipWeight.invalidItem[WipWeight.invalidType.atLeastOne] 
                                                   }
                        
                                                   WipWeight.checkIsValidate()
                        
                                                   return isDataValid
                                                },
                                                "PROD_ID":(value)=>{

                                                    let grid = $$(WipWeight.viewIds.csGrid)
                            
                                                    let editor = grid.getEditor()
                                                    let lot
                                                    let step
                                                    
                                                    if(editor){
                                                        let row = grid.getEditor().row

                                                        if(!row)
                                                            return true

                                                            step = grid.data.pull[row].TARGET_STEP_ID
                                                            lot = grid.data.pull[row].LOT_ID
                                                    }else{

                                                        let gridData = grid.serialize()

                                                        let rec = gridData[gridData.length-1]

                                                        lot = rec.LOT_ID
                                                        step = rec.TARGET_STEP_ID

                                                    }

                                                    let isDataValid = (value||step||lot)
                        
                                                    //added invalidation msg
                                                    if(!isDataValid){
                                                       WipWeight.invalidItem[WipWeight.invalidType.atLeastOne] = WipWeight.invalidationMsg.atLeastOne
                        
                                                   }else{
                                                       delete WipWeight.invalidItem[WipWeight.invalidType.atLeastOne] 
                                                   }
                        
                                                   WipWeight.checkIsValidate()
                        
                                                   return isDataValid
                                                }
                                            },
                                            on:{
                                                onValidationError:(id, obj, details)=>{
                                                    this.ctrl.showValidationMsg()
                                                }
                        
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                    ]
                }
            ]
        }

        return layout
    }

    init = this.ctrl.init
}
