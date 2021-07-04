import {querySqlCallBack} from "./Proxy"
import gStore from "../store/GlobalStore"

export default class LoginModel{

    static changePassWord(newPw,callback){
        let sql = `UPDATE SET_USERBASIS SET password='${newPw}' WHERE id='${gStore.userId}'`

        querySqlCallBack(sql,callback)
    }

}