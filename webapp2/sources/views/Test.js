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
var Test = /** @class */ (function (_super) {
    __extends(Test, _super);
    function Test() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.chatTxt = "chatTxt";
        _this.msgTxt = "msgTxt";
        return _this;
    }
    Test.prototype.config = function () {
        var _this = this;
        var layout = {
            rows: [
                {
                    id: "chatTxt",
                    view: "textarea",
                    height: 800,
                    label: "Chat",
                    labelPosition: "top"
                },
                {
                    id: "msgTxt",
                    view: "textarea",
                    height: 100
                },
                {
                    view: "button",
                    value: "Send",
                    width: 200,
                    align: "center",
                    click: function () {
                        var msgTxt = $$(_this.msgTxt);
                        var msg = msgTxt.getValue();
                        console.log(msg);
                        msgTxt.setValue('');
                        webix.ajax().get("servlet/sendMsg", { msg: msg }).then(function (data) {
                            // response
                            console.log(data.text());
                            var resp = JSON.parse(data.text());
                            var chatTxt = $$(_this.chatTxt);
                            chatTxt.setValue(resp.data);
                        });
                    }
                }
            ]
        };
        return layout;
    };
    Test.prototype.init = function () {
        var _this = this;
        setInterval(function () {
            webix.ajax().get("servlet/getMsg").then(function (data) {
                // response
                console.log(data.text());
                var resp = JSON.parse(data.text());
                var chatTxt = $$(_this.chatTxt);
                chatTxt.setValue(resp.data);
            });
        }, 2000);
    };
    return Test;
}(webix_jet_1.JetView));
exports.default = Test;
//# sourceMappingURL=Test.js.map