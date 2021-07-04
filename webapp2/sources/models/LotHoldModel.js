"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var LotHoldModel = /** @class */ (function () {
    function LotHoldModel() {
    }
    LotHoldModel.selectLotHoldData = function (id) {
        // let sql = `select parentid,lot_id,tool_id ,substr(target_step_id,0,4) target_step_id,prod_id,start_time,end_time,create_date
        var sql = "select *\n        from SET_LOT_HOLD\n        where parentid = '" + id + "'\n        order by create_date desc";
        return Proxy_1.querySql(sql);
    };
    LotHoldModel.insertIntoSetLotHold = function (guid, gridData, callback) {
        var sql = "INSERT ALL\n";
        var dateFormat = 'yyyy-mm-dd hh24:mi:ss';
        var format = function (str) {
            return str.replace(/T/, ' ');
        };
        //toolg id is no need
        gridData.forEach(function (rec) {
            var lotId = (rec.LOT_ID == null) ? "''" : "'" + rec.LOT_ID + "'";
            // let prodId = (rec.PROD_ID == null)?'':rec.PROD_ID
            var stepId = rec.TARGET_STEP_ID; //+'-%'
            sql += "INTO set_lot_hold(parentid,lot_id,target_step_id,tool_id,prod_id,start_time,end_time,create_date)\n            VALUES('" + guid + "'," + lotId + ",'" + stepId + "','" + rec.TOOL_ID + "','" + rec.PROD_ID + "',to_date('" + format(rec.START_TIME) + "','" + dateFormat + "'),to_date('" + format(rec.END_TIME) + "','" + dateFormat + "'),sysdate)\n";
        });
        sql += 'SELECT * FROM dual';
        Proxy_1.querySqlCallBack(sql, callback);
    };
    return LotHoldModel;
}());
exports.default = LotHoldModel;
//# sourceMappingURL=LotHoldModel.js.map