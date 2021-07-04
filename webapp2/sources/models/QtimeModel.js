"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var QtimeModel = /** @class */ (function () {
    function QtimeModel() {
    }
    QtimeModel.selectQtimeData = function (id) {
        var sql = "select * from set_queuetime\n        where parentid = '" + id + "'";
        return Proxy_1.querySql(sql);
    };
    QtimeModel.insertQtimeData = function (guid, factory, gridData, callbackFn) {
        var sql = 'INSERT ALL\n';
        gridData.forEach(function (rec) {
            sql += "INTO set_queuetime(parentid,factoryname,productid,fromstep,tostep,maxqueuetime)\n            VALUES('" + guid + "','" + factory + "','" + rec.PRODUCTID + "','" + rec.FROMSTEP + "','" + rec.TOSTEP + "'," + rec.MAXQUEUETIME + ")\n";
        });
        sql += 'SELECT * FROM dual';
        Proxy_1.querySqlCallBack(sql, callbackFn);
    };
    return QtimeModel;
}());
exports.default = QtimeModel;
//# sourceMappingURL=QtimeModel.js.map