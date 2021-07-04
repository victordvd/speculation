"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var MatchRateModel = /** @class */ (function () {
    function MatchRateModel() {
    }
    MatchRateModel.selectMfgTarget = function (id) {
        var sql = "select * from MAT_MFG_TARGET where parentid = '" + id + "'";
        //(select id from v_mat_lastest_version where table_name = 'MAT_MFG_TARGET')
        return Proxy_1.querySql(sql);
    };
    MatchRateModel.insertMatchRateData = function (guid, factory, data, user, callback) {
        //compose SQL
        var sql = "INSERT ALL\n";
        var prodType = 'Production';
        data.forEach(function (rec) {
            var inQty = (rec.inQty) ? rec.inQty : 'null';
            var outQty = (rec.outQty) ? rec.outQty : 'null';
            // let eventTime = common.getTimeStr(new Date(),'')
            // sql+=`INTO mat_mfg_target(parentid,factory,datetimekey,product_id,product_type,product_desc,model_type,in_qty,out_qty)
            // VALUES('${guid}','${factory}','${rec.datetimekey}','${rec.productId}','${prodType}','${rec.productDesc}','${rec.modelType}',${inQty},${outQty})\n`
            sql += "INTO mat_mfg_target(parentid,factory,datetimekey,product_id,product_type,product_desc,model_type,in_qty,out_qty)\n            VALUES('" + guid + "','" + factory + "',to_date('" + rec.datetimekey + "','yyyy/mm/dd'),'" + rec.productId + "','" + prodType + "','" + rec.productDesc + "','" + rec.modelType + "'," + inQty + "," + outQty + ")\n";
        });
        sql += 'SELECT * FROM dual';
        Proxy_1.querySqlCallBack(sql, callback);
    };
    return MatchRateModel;
}());
exports.default = MatchRateModel;
//# sourceMappingURL=MatchRateModel.js.map