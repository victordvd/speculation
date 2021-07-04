
enum BarType{Query,Edit,Control}
enum EditCmp{RESET,SAVE,ADD,MODIFY,DELETE}


export class ToolBarFactory{

    static queryCmp = {}
    

    static viewIds ={
        grpCombo:"grpCombo"
    }

    grpCombo(on){
        return {
            view:"richselect",
            id:ToolBarFactory.viewIds.grpCombo,
            label:"Group ID",
            width:180,
            value:1,
            options:[],
            on:on
        }
}
    

    initToolBar(){
        


    }


}