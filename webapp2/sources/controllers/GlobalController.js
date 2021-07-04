"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GlobalModel_1 = require("../models/GlobalModel");
var GlobalStore_1 = require("../store/GlobalStore");
var TopViewController_1 = require("../views/TopViewController");
var Proxy_1 = require("../models/Proxy");
var Top_1 = require("../views/Top");
var GlobalController = /** @class */ (function () {
    function GlobalController() {
    }
    // static _cookie_remaining_time = 5*60*1000 //5 min
    GlobalController.convertBase64ToHex = function (b64) {
        var raw = atob(b64);
        var HEX = '';
        for (var i = 0; i < raw.length; i++) {
            var _hex = raw.charCodeAt(i).toString(16);
            HEX += (_hex.length == 2 ? _hex : '0' + _hex);
        }
        return HEX.toUpperCase();
    };
    GlobalController.authenticate = function (id, pw, callback) {
        GlobalModel_1.default.selectUserInfo(id, pw, function (data) {
            if (data == null || data.length === 0)
                callback(0);
            else {
                GlobalStore_1.default.user = data[0].USERNO;
                GlobalStore_1.default.userRole = data[0].ROLE;
                TopViewController_1.default.setCurrentUser(GlobalStore_1.default.user);
                if (GlobalStore_1.default.userRole >= 1) {
                    //set system privellge
                    var menu = $$(Top_1.default.viewIds.appMenu);
                    menu.clearAll();
                    menu.define('data', Top_1.default.menuItems_h);
                    menu.refresh();
                }
                callback(1);
            }
        });
    };
    GlobalController.setCookie = function (cvalue) {
        var d = new Date();
        d.setTime(d.getTime() + GlobalController._cookie_remaining_time);
        var expires = "expires=" + d.toUTCString();
        document.cookie = GlobalController._cookie_name + "=" + cvalue + ";" + expires + ";path=/";
    };
    GlobalController.getCookie = function () {
        var name = GlobalController._cookie_name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };
    GlobalController.clearCookie = function () {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            if (name === GlobalController._cookie_name) {
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                window.location.hash = '#!/' + Top_1.default.ViewNames.Login;
            }
        }
    };
    GlobalController.checkCookie = function (callback) {
        // free login CL
        // callback(1)
        // return
        var c = GlobalController.getCookie();
        if (c == null || c == "") { //no cookie
            // callback(0)
            //redirect to Login page
            window.location.hash = '#!/' + Top_1.default.ViewNames.Login;
            // window.location.href = window.location.origin+window.location.pathname+'#!/Login'
            return;
        }
        var cs = c.split('|');
        var id = cs[0];
        var pw = cs[1];
        GlobalController.authenticate(id, pw, callback);
    };
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
    GlobalController.checkVersion = function (callback) {
        Proxy_1.getIndexHtml(function (text) {
            var htmStr = text.substr(text.indexOf('<html>'));
            var el = document.createElement('html');
            el.innerHTML = htmStr;
            var verDiv = el.querySelector("#version");
            var ver = verDiv.innerText;
            console.log(version + '|' + ver);
            if (version !== ver) {
                webix.alert({
                    text: 'A new version of web is released, please press "F5" to refresh this page.'
                });
                // clearInterval(GlobalController.verCheckItv)
            }
            else {
                callback();
            }
        });
    };
    /*
      if some records of a datatable have been filtered , you cant get data by "serialize()"
  
      so , use this
    */
    GlobalController.getAllDataFromGrid = function (grid) {
        var data = [];
        var rawData = grid.data.pull;
        for (var i in rawData) {
            data.push(rawData[i]);
        }
        return data;
    };
    GlobalController._cookie_name = "SID";
    GlobalController._cookie_remaining_time = 24 * 60 * 60 * 1000;
    return GlobalController;
}());
exports.default = GlobalController;
//# sourceMappingURL=GlobalController.js.map