"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var GlobalStore_1 = require("../store/GlobalStore");
var LoginModel = /** @class */ (function () {
    function LoginModel() {
    }
    LoginModel.changePassWord = function (newPw, callback) {
        var sql = "UPDATE SET_USERBASIS SET password='" + newPw + "' WHERE id='" + GlobalStore_1.default.userId + "'";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    return LoginModel;
}());
exports.default = LoginModel;
//# sourceMappingURL=LoginModel.js.map