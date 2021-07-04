import { JetView } from "webix-jet"
import LoginViewController from "./LoginViewController"

export default class Login extends JetView{

    ctrl= new LoginViewController()

    static viewIds = {

        loginForm:"loginForm",
        rePwForm:"rePwForm",

        userTx:"userTx",
        pwTx:"pwTx",

        newPwTx:"newPwTx",
        rePwTx:"rePwTx"
    }

    config(){
        let layout = {
            type:"line",
            rows:[
                {},
                {
                    cols:[
                        {},
                        {
                            id:Login.viewIds.loginForm,
                            view:"form",
                            css:"login",
                            // css:{"background-color": "antiquewhite"},
                            scroll:false,
                            width:350,
                            elements:[
                                { view:"label", label:'u-Scheduling', height:30, align:"center" },
                                { view:"text",id:Login.viewIds.userTx, label:"User ID"},
                                { view:"text",id:Login.viewIds.pwTx, type:"password", label:"Password"},
                                { margin:5, cols:[
                                    { view:"button", label:"Login" , css:"webix_primary", hotkey: "enter",click:this.ctrl.onLoginBtnClick }
                                ]}
                            ]
                        },
                        {
                            id:Login.viewIds.rePwForm,
                            view:"form", scroll:false,
                            css:"login",
                            width:350,
                            hidden:true,
                            elements:[
                                { view:"label", label:'Change Password', height:30, align:"center" },
                                { view:"text",id:Login.viewIds.newPwTx, labelWidth:120,type:"password", label:"New password"},
                                { view:"text",id:Login.viewIds.rePwTx, type:"password",labelWidth:120, label:"Retype new"},
                                { margin:5, cols:[
                                    { view:"button", label:"Confirm" , css:"webix_primary",click:this.ctrl.onCnfmBtnClick, hotkey: "enter" }
                                ]}
                            ]
                        },
                        {}
                    ]
                },
                {}
            ]
        }

        return layout
    }

    init = this.ctrl.init
}