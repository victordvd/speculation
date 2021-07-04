"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var SqlController_1 = require("../controllers/SqlController");
var WipWeightModel = /** @class */ (function () {
    function WipWeightModel() {
    }
    WipWeightModel.selectWipData = function (id) {
        //where TOOLG_ID = '${toolgId}'
        var sql = "select PARENTID, ID, TOOLG_ID, LOT_ID, PTY, LOT_TYPE, RECIPE, WEIGHTING, to_char(EFFECTIVE_TIME,'yyyy/mm/dd hh24:mi:ss') EFFECTIVE_TIME, PROD_ID, LAYER, STAGE, to_char(CREATE_DATE,'yyyy/mm/dd hh24:mi:ss') CREATE_DATE, COMMAND, ENTITY, WAIT, TARGET_STEP_ID, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME\n        from SET_WIP_WEIGHTING\n        where parentid = '" + id + "'\n        order by PTY,CREATE_DATE desc";
        return Proxy_1.querySql(sql);
    };
    WipWeightModel.insertWipData = function (guid, toolgId, gridData, callback) {
        var sql = "INSERT ALL\n";
        // let dateFormat = 'yyyy-mm-dd hh24:mi:ss'
        // let format = (str)=>{
        //     return str.replace(/T/,' ')
        // }
        gridData.forEach(function (rec) {
            var prodId = SqlController_1.default.nullOrString(rec.PROD_ID);
            var lotId = SqlController_1.default.nullOrString(rec.LOT_ID);
            var stepId = SqlController_1.default.nullOrString(rec.TARGET_STEP_ID);
            var createData = (rec.CREATE_DATE == null) ? 'sysdate' : "to_date('" + rec.CREATE_DATE + "','yyyy/mm/dd hh24:mi:ss')";
            sql += "INTO set_wip_weighting(parentid,toolg_id,pty,prod_id,target_step_id,lot_id,weighting,create_date)\n            VALUES('" + guid + "','" + toolgId + "'," + rec.PTY + "," + prodId + "," + stepId + "," + lotId + "," + rec.WEIGHTING + "," + createData + ")\n";
        });
        sql += 'SELECT * FROM dual';
        Proxy_1.querySqlCallBack(sql, callback);
    };
    return WipWeightModel;
}());
exports.default = WipWeightModel;
//# sourceMappingURL=WipWeightModel.js.map