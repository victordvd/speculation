"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommonController = /** @class */ (function () {
    function CommonController() {
    }
    CommonController.getDateStr = function (dt, spliter) {
        var y = dt.getFullYear();
        var m = (dt.getMonth() >= 9) ? dt.getMonth() + 1 : '0' + dt.getMonth();
        var d = (dt.getDate() >= 9) ? dt.getDate() + 1 : '0' + dt.getDate();
        return y + spliter + m + spliter + d;
    };
    CommonController.getTimeStr = function (dt, spliter) {
        var y = String(dt.getFullYear());
        var m = (dt.getMonth() >= 9) ? dt.getMonth() + 1 : '0' + dt.getMonth();
        var d = (dt.getDate() >= 9) ? dt.getDate() + 1 : '0' + dt.getDate();
        var h = (dt.getHours() >= 10) ? dt.getHours() : '0' + dt.getHours();
        var min = (dt.getMinutes() >= 10) ? dt.getMinutes() : '0' + dt.getMinutes();
        var s = (dt.getSeconds() >= 10) ? dt.getSeconds() : '0' + dt.getSeconds();
        if (spliter)
            return y + spliter + m + spliter + d + ' ' + h + ':' + min + ':' + s;
        else
            return y + m + d + h + min + s;
    };
    return CommonController;
}());
exports.default = CommonController;
//# sourceMappingURL=CommonController.js.map