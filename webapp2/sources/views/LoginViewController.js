"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Login_1 = require("./Login");
var GlobalModel_1 = require("../models/GlobalModel");
var LoginModel_1 = require("../models/LoginModel");
var GlobalController_1 = require("../controllers/GlobalController");
var GlobalStore_1 = require("../store/GlobalStore");
var Top_1 = require("../views/Top");
var LoginViewController = /** @class */ (function () {
    function LoginViewController() {
        var _this = this;
        this.init = function (view) {
            GlobalController_1.default.checkCookie(function (code) {
                switch (code) {
                    case 0: { //failed
                        console.log('cookie failed');
                        break;
                    }
                    case 1: { //successful
                        webix.message("Welcome, " + GlobalStore_1.default.user);
                        //redirect to Result page
                        window.location.hash = '#!/Top/' + Top_1.default.ViewNames.OverviewSchedule;
                        break;
                    }
                }
            });
        };
        this.redirectPage = function (id, pw) {
            GlobalController_1.default.setCookie(id + '|' + pw);
            webix.message("Welcome " + GlobalStore_1.default.user);
            window.location.hash = '#!/Top/' + Top_1.default.ViewNames.OverviewSchedule;
        };
        this.onLoginBtnClick = function (id) {
            var userTx = $$(Login_1.default.viewIds.userTx);
            var pwTx = $$(Login_1.default.viewIds.pwTx);
            var userId = userTx.getValue();
            var pw = pwTx.getValue();
            GlobalModel_1.default.selectUserInfo(userId, pw, function (data) {
                if (data == null || data.length === 0) {
                    webix.alert({
                        // title:"",
                        text: "Invalid ID or Password."
                    });
                }
                else {
                    GlobalStore_1.default.userId = userId;
                    GlobalStore_1.default.user = data[0].USERNO;
                    GlobalStore_1.default.userRole = data[0].ROLE;
                    //login while first time
                    if (pw == '0000') {
                        var loginForm = $$(Login_1.default.viewIds.loginForm);
                        var rePwForm = $$(Login_1.default.viewIds.rePwForm);
                        loginForm.hide();
                        rePwForm.show();
                    }
                    else {
                        _this.redirectPage(userId, pw);
                    }
                }
            });
        };
        this.onCnfmBtnClick = function () {
            var userTx = $$(Login_1.default.viewIds.userTx);
            var newPwTx = $$(Login_1.default.viewIds.newPwTx);
            var rePwTx = $$(Login_1.default.viewIds.rePwTx);
            var userId = userTx.getValue();
            var newPw = newPwTx.getValue();
            var rePw = rePwTx.getValue();
            if (newPw !== rePw) {
                webix.alert({
                    title: "Different Passwords",
                    text: "You need to input identical passwords.",
                });
            }
            else {
                LoginModel_1.default.changePassWord(newPw, function () {
                    _this.redirectPage(userId, newPw);
                });
            }
        };
    }
    return LoginViewController;
}());
exports.default = LoginViewController;
//# sourceMappingURL=LoginViewController.js.map