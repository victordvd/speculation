import Login from "./Login"
import gMod from "../models/GlobalModel"
import mod from "../models/LoginModel"
import gCtrl from "../controllers/GlobalController"
import gStore from "../store/GlobalStore"
import Top from "../views/Top"

declare var $$

export default class LoginViewController{

    init = (view)=>{

        gCtrl.checkCookie(code=>{

            switch (code){
                case 0:{//failed

                    console.log('cookie failed')
                    break
                }
                case 1:{//successful

                    webix.message("Welcome, "+gStore.user)
                    //redirect to Result page
                    window.location.hash = '#!/Top/'+Top.ViewNames.OverviewSchedule
                    
                    break
                }
            }
        })

    }

    redirectPage = (id,pw)=>{
        
        gCtrl.setCookie(id+'|'+pw)

        webix.message("Welcome "+gStore.user)
        window.location.hash = '#!/Top/'+Top.ViewNames.OverviewSchedule
    }

    onLoginBtnClick = (id)=>{

        let userTx:webix.ui.text = $$(Login.viewIds.userTx)
        let pwTx:webix.ui.text = $$(Login.viewIds.pwTx)

        let userId = userTx.getValue()
        let pw = pwTx.getValue()

        gMod.selectUserInfo(userId,pw,data=>{

            if(data==null||data.length===0){
                webix.alert({
                    // title:"",
                    text: "Invalid ID or Password."
                  })
            }else{
    
                gStore.userId = userId
                gStore.user = data[0].USERNO
                gStore.userRole = data[0].ROLE

                //login while first time
                if(pw=='0000'){

                    let loginForm:webix.ui.form = $$(Login.viewIds.loginForm)
                    let rePwForm:webix.ui.form = $$(Login.viewIds.rePwForm)

                    loginForm.hide()
                    rePwForm.show()

                }else{
                    this.redirectPage(userId,pw)
                }
        
            }

        })
    }

    onCnfmBtnClick = ()=>{

        let userTx:webix.ui.text = $$(Login.viewIds.userTx)
        let newPwTx:webix.ui.text = $$(Login.viewIds.newPwTx)
        let rePwTx:webix.ui.text = $$(Login.viewIds.rePwTx)

        let userId = userTx.getValue()
        let newPw = newPwTx.getValue()
        let rePw = rePwTx.getValue()

        if(newPw!==rePw){
            webix.alert({
                title:"Different Passwords",
                text: "You need to input identical passwords.",
              })
        }else{
            mod.changePassWord(newPw,()=>{

                this.redirectPage(userId,newPw)

            })
        }

    }

}