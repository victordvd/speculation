import gMod from "../models/GlobalModel"
import gStore from "../store/GlobalStore"
import top from "../views/TopViewController";
import {getIndexHtml} from "../models/Proxy"
import Top from "../views/Top"

declare var $$
declare var version


export default class GlobalController{

    static verCheckItv

    static _cookie_name = "SID"
    static _cookie_remaining_time = 24*60*60*1000
    // static _cookie_remaining_time = 5*60*1000 //5 min

    static convertBase64ToHex(b64:string):string{
        let raw = atob(b64);
        let HEX = '';
    
        for ( let i = 0; i < raw.length; i++ ) {
    
            let _hex = raw.charCodeAt(i).toString(16)
            HEX += (_hex.length==2?_hex:'0'+_hex);
        }
        return HEX.toUpperCase();
  }


  static authenticate(id,pw,callback){

    gMod.selectUserInfo(id,pw,data=>{

      if(data==null||data.length===0)
        callback(0)
      else{

        gStore.user = data[0].USERNO
        gStore.userRole = data[0].ROLE
        top.setCurrentUser(gStore.user)

        if(gStore.userRole>=1){
          //set system privellge
          let  menu:webix.ui.menu = $$(Top.viewIds.appMenu)

          menu.clearAll()
          menu.define('data',Top.menuItems_h)
          menu.refresh()
        }

        callback(1)
      }
    })

  }

  static setCookie(cvalue) {

    var d = new Date();
    d.setTime(d.getTime() + GlobalController._cookie_remaining_time);
    var expires = "expires="+d.toUTCString();
    document.cookie = GlobalController._cookie_name + "=" + cvalue + ";" + expires + ";path=/";
  }

  static getCookie() {
    var name = GlobalController._cookie_name + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  static clearCookie(){

    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

        if(name===GlobalController._cookie_name){
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
          window.location.hash = '#!/'+Top.ViewNames.Login
        }
    }
  }

  static checkCookie(callback){

    // free login CL
    // callback(1)
    // return

    let c = GlobalController.getCookie()

    if(c==null||c==""){//no cookie

      // callback(0)

      //redirect to Login page
      window.location.hash = '#!/'+Top.ViewNames.Login
      // window.location.href = window.location.origin+window.location.pathname+'#!/Login'
  
      
      return
    }

    let cs = c.split('|')

    let id = cs[0]
    let pw = cs[1]

    GlobalController.authenticate(id,pw,callback)
  }

  // static confirmSaving(callback){
  
  //   GlobalController.checkVersion(()=>{
  //     let cnfmBox:any = webix.confirm({
  //       title:"Save",
  //       ok:"No", 
  //       cancel:"Yes",
  //       text: gStore.user+", are you sure to alter setting?",
  //       callback: function(result){
  //         if(!result)//"Yes"
  //           callback()
  //       }
  //     })
  //   })

  //   // cnfmBox.then(callback)
  // }

  static checkVersion(callback){

    getIndexHtml((text)=>{

      let htmStr = text.substr(text.indexOf('<html>'))
      let el = document.createElement('html')
  
      el.innerHTML = htmStr

      let verDiv:HTMLDivElement = el.querySelector("#version")
      let ver = verDiv.innerText

      console.log(version+'|'+ver)

      if(version!==ver){
        
        webix.alert({

          text:'A new version of web is released, please press "F5" to refresh this page.'

        })

        // clearInterval(GlobalController.verCheckItv)
      }else{

        callback()
      }

    })

  }

  /*
    if some records of a datatable have been filtered , you cant get data by "serialize()"

    so , use this
  */
  static getAllDataFromGrid(grid){

    let data = []
    let rawData = grid.data.pull

    for(let i in rawData){
        data.push(rawData[i])
    }

    return data
  }

}