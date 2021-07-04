"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var webix_jet_1 = require("webix-jet");
var LoginViewController_1 = require("./LoginViewController");
var Login = /** @class */ (function (_super) {
    __extends(Login, _super);
    function Login() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctrl = new LoginViewController_1.default();
        _this.init = _this.ctrl.init;
        return _this;
    }
    Login.prototype.config = function () {
        var layout = {
            type: "line",
            rows: [
                {},
                {
                    cols: [
                        {},
                        {
                            id: Login.viewIds.loginForm,
                            view: "form",
                            css: "login",
                            // css:{"background-color": "antiquewhite"},
                            scroll: false,
                            width: 350,
                            elements: [
                                { view: "label", label: 'u-Scheduling', height: 30, align: "center" },
                                { view: "text", id: Login.viewIds.userTx, label: "User ID" },
                                { view: "text", id: Login.viewIds.pwTx, type: "password", label: "Password" },
                                { margin: 5, cols: [
                                        { view: "button", label: "Login", css: "webix_primary", hotkey: "enter", click: this.ctrl.onLoginBtnClick }
                                    ] }
                            ]
                        },
                        {
                            id: Login.viewIds.rePwForm,
                            view: "form", scroll: false,
                            css: "login",
                            width: 350,
                            hidden: true,
                            elements: [
                                { view: "label", label: 'Change Password', height: 30, align: "center" },
                                { view: "text", id: Login.viewIds.newPwTx, labelWidth: 120, type: "password", label: "New password" },
                                { view: "text", id: Login.viewIds.rePwTx, type: "password", labelWidth: 120, label: "Retype new" },
                                { margin: 5, cols: [
                                        { view: "button", label: "Confirm", css: "webix_primary", click: this.ctrl.onCnfmBtnClick, hotkey: "enter" }
                                    ] }
                            ]
                        },
                        {}
                    ]
                },
                {}
            ]
        };
        return layout;
    };
    Login.viewIds = {
        loginForm: "loginForm",
        rePwForm: "rePwForm",
        userTx: "userTx",
        pwTx: "pwTx",
        newPwTx: "newPwTx",
        rePwTx: "rePwTx"
    };
    return Login;
}(webix_jet_1.JetView));
exports.default = Login;
//# sourceMappingURL=Login.js.map