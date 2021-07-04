"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var default_1 = /** @class */ (function () {
    function default_1() {
    }
    default_1.selectMaskTransfer = function (setMaskParentId, callback) {
        var sql = "with r as(\n            select * from OPT_RETICLE_OUTPUT a \n             WHERE a.VER_TIMEKEY > (sysdate-1)\n             AND  EXISTS (SELECT 1 FROM V_JOB_LASTEST_VERSION J WHERE J.ID = a.PARENTID)\n             and a.TIME_IN <= (SYSDATE+1/12)\n             AND NOT EXISTS (select * from v_mat_bsmaterial m\n                WHERE m.MATERIALNAME = a.Reticles_Id AND m.MACHINENAME = a.LOCATION)\n            ), o as(\n            select * from OPT_OUTPUT O\n             WHERE O.VER_TIMEKEY > (sysdate-1)\n             AND  EXISTS (SELECT 1 FROM V_JOB_LASTEST_VERSION J WHERE J.ID = O.PARENTID)\n            ), s as(\n               select * from set_mask_transfer where parentid = '" + setMaskParentId + "'\n            )\n            SELECT r.TIME_IN,r.RETICLES_ID, r.LOCATION_FROM ,r.LOCATION ,o.prod_id, s.parentid\n            FROM r ,o ,s\n            WHERE  r.reason = o.lot_id(+)\n            and r.RETICLES_ID = s.mask_id(+)\n            and r.time_in = s.arrival_time(+)\n            and r.location_from = s.location_from(+)\n            and r.location = s.tool_id(+)\n            order by r.TIME_IN desc";
        //no material ,timekey
        sql = "with r as(\n            select * from OPT_RETICLE_OUTPUT a\n             WHERE EXISTS (SELECT 1 FROM V_JOB_LASTEST_VERSION J WHERE J.ID = a.PARENTID)\n             and a.TIME_IN <= (SYSDATE+1/12)\n             AND NOT EXISTS (select * from v_mat_bsmaterial m\n                WHERE m.MATERIALNAME = a.Reticles_Id AND m.MACHINENAME = a.LOCATION)\n            ), o as(\n            select * from OPT_OUTPUT O\n             WHERE EXISTS (SELECT 1 FROM V_JOB_LASTEST_VERSION J WHERE J.ID = O.PARENTID)\n            ), s as(\n               select * from set_mask_transfer where parentid = '" + setMaskParentId + "'\n            )\n            SELECT r.TIME_IN,r.RETICLES_ID, r.LOCATION_FROM ,r.LOCATION ,o.prod_id, s.parentid\n            FROM r ,o ,s\n            WHERE  r.reason = o.lot_id(+)\n            and r.RETICLES_ID = s.mask_id(+)\n            and r.time_in = s.arrival_time(+)\n            and r.location_from = s.location_from(+)\n            and r.location = s.tool_id(+)\n            order by r.TIME_IN desc";
        //fro test
        /*
        let sql = ` SELECT O.TIME_IN,O.RETICLES_ID, O.LOCATION_FROM ,O.LOCATION ,b.prod_id, s.parentid
        FROM OPT_RETICLE_OUTPUT O ,v_mat_bsmaterial m,(select distinct lot_id,prod_id,parentid
              from opt_output) b,(select * from set_mask_transfer where parentid = '${setMaskParentId}') s
                WHERE EXISTS (SELECT 1 FROM V_JOB_LASTEST_VERSION J WHERE J.ID = O.PARENTID)
                and O.TIME_IN <= (SYSDATE+1/12)
                AND m.MATERIALNAME != o.Reticles_Id AND m.MACHINENAME != O.LOCATION
                and o.parentid = b.parentid(+)
                and o.reason = b.lot_id(+)
                and O.RETICLES_ID = s.mask_id(+)
                and o.time_in = s.arrival_time(+)
                and O.location_from = s.location_from(+)
                and O.location = s.tool_id(+)
                order by O.TIME_IN desc`
*/
        Proxy_1.querySqlCallBack(sql, callback);
    };
    default_1.insertMaskTranfer = function (sql, callback) {
        Proxy_1.querySqlCallBack(sql, callback);
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=MaskTransportModel.js.map