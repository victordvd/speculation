

export default class EditorController{

    /*
        customize a datetime editor
    */
    static initDateTimeEditor(){

        webix.editors['datetime'] = {
            focus:function(){
                this.getInputNode(this.node).focus();
                this.getInputNode(this.node).select();
            },
            getValue:function(){
                return this.getInputNode(this.node).value;
            },
            setValue:function(value){
                this.getInputNode(this.node).value = value
            },
            getInputNode:function(){
                return this.node.firstChild;
            },
            render:function(){
                return webix.html.create("div", {
                    "class":"webix_dt_editor"
                }, "<input type='datetime-local'>");
            }
        }

    }


}