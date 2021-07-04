import { JetView } from "webix-jet"


declare var $$

export default class Test extends JetView{


    chatTxt = "chatTxt"
    msgTxt = "msgTxt"

    config(){

        let layout = {
            rows:[
                { 
                    id:"chatTxt",
                    view:"textarea",
                    height:800,
                    label:"Chat",
                    labelPosition:"top" 
                },
                { 
                    id:"msgTxt",
                    view:"textarea",
                     height:100
                    },
                { 
                    view:"button", 
                value:"Send",
                 width:200, 
                 align:"center",
                 click:()=>{

                    let msgTxt:webix.ui.textarea = $$(this.msgTxt)

                    let msg = msgTxt.getValue()

                    console.log(msg)

                    msgTxt.setValue('')

                    webix.ajax().get("servlet/sendMsg", { msg : msg }).then((data)=>{
                        // response
                        console.log(data.text());

                        let resp = JSON.parse(data.text())

                        let chatTxt = $$(this.chatTxt)
        
                        chatTxt.setValue(resp.data)
                    });

                 }
             }
            ]

        }

        return layout

    }

    init(){
        setInterval(()=>{
            webix.ajax().get("servlet/getMsg").then((data)=>{


                // response
                console.log(data.text());

                let resp = JSON.parse(data.text())

                let chatTxt = $$(this.chatTxt)

                chatTxt.setValue(resp.data)

            });
        },2000)
    }

}