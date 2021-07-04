"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var default_1 = /** @class */ (function () {
    function default_1() {
    }
    default_1.selectMaskTransferCount = function () {
        var sql = "select * from OPT_RETICLE_OUTPUT a \n        WHERE a.VER_TIMEKEY > (sysdate-1)\n        AND  EXISTS (SELECT 1 FROM V_JOB_LASTEST_VERSION J WHERE J.ID = a.PARENTID)\n        and a.TIME_IN <= (SYSDATE+1/6)\n        and status != 'UNMOUNT'";
        return Proxy_1.querySql(sql);
    };
    default_1.selectMaskTransfer = function (setMaskParentId, callback) {
        var condition = (setMaskParentId) ? " parentid = '" + setMaskParentId + "'" : "1=0";
        var sql = "with r as(\n            select * from OPT_RETICLE_OUTPUT a \n             WHERE a.VER_TIMEKEY > (sysdate-1)\n             AND  EXISTS (SELECT 1 FROM V_JOB_LASTEST_VERSION J WHERE J.ID = a.PARENTID)\n             and a.TIME_IN <= (SYSDATE+1/6)\n            ), o as(\n            select * from OPT_OUTPUT O\n             WHERE O.VER_TIMEKEY > (sysdate-1)\n             AND  EXISTS (SELECT 1 FROM V_JOB_LASTEST_VERSION J WHERE J.ID = O.PARENTID)\n            ), s as(\n               select * from set_mask_transfer where " + condition + "\n            )\n            SELECT m.materialstate, r.parentid o_parentid,r.output_time reticle_output_time, r.toolg_id, r.TIME_IN,r.RETICLES_ID, r.LOCATION_FROM ,r.LOCATION ,o.prod_id, s.checked,s.parentid s_parentid,s.update_user, s.update_time\n            FROM r ,o ,s , (select materialname, machinename,materialstate from v_mat_bsmaterial where materialstate != 'UNMOUNT') m\n            WHERE  r.reason = o.lot_id(+)\n            and r.RETICLES_ID = s.mask_id(+)\n            and r.time_in = s.arrival_time(+)\n            and r.location_from = s.location_from(+)\n            and r.location = s.tool_id(+)\n            and r.Reticles_Id = m.MATERIALNAME(+)\n            and r.LOCATION = m.MACHINENAME(+)\n            order by r.output_time desc ,r.TIME_IN desc";
        /*let sql = `with r as(//for test
            select * from OPT_RETICLE_OUTPUT a
             WHERE  a.PARENTID in  ('75B47129797A4BE4A08F610DCE8DCE97','DDAF7A41880F47659F5049C10FC7C382')
            ), o as(
            select * from OPT_OUTPUT O
             WHERE O.VER_TIMEKEY > (sysdate-1)
             AND  EXISTS (SELECT 1 FROM V_JOB_LASTEST_VERSION J WHERE J.ID = O.PARENTID)
            ), s as(
               select * from set_mask_transfer where parentid = '${setMaskParentId}'
            )
            SELECT m.materialstate, r.parentid o_parentid, r.toolg_id, r.TIME_IN,r.RETICLES_ID, r.LOCATION_FROM ,r.LOCATION ,o.prod_id, s.parentid s_parentid,s.update_user, s.update_time
            FROM r ,o ,s , (select materialname, machinename,materialstate from v_mat_bsmaterial where materialstate != 'UNMOUNT') m
            WHERE  r.reason = o.lot_id(+)
            and r.RETICLES_ID = s.mask_id(+)
            and r.time_in = s.arrival_time(+)
            and r.location_from = s.location_from(+)
            and r.location = s.tool_id(+)
            and r.Reticles_Id = m.MATERIALNAME(+)
            and r.LOCATION = m.MACHINENAME(+)
            order by r.TIME_IN desc`*/
        Proxy_1.querySqlCallBack(sql, callback);
    };
    default_1.insertMaskTranfer = function (sql, callback) {
        Proxy_1.querySqlCallBack(sql, callback);
    };
    default_1.selectMaskTransferHistory = function () {
        //m.reticle_parentid = r.parentid 
        var sql = "with m as(\n            select to_char(RETICLE_OUTPUT_TIME,'yyyy/mm/dd hh24:mi:ss') RETICLE_OUTPUT_TIME,RETICLE_PARENTID, MASK_ID, TOOL_ID, ARRIVAL_TIME, PRODUCT_ID, LOCATION_FROM, UPDATE_USER, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME, CHECKED\n            from set_mask_transfer m\n            where m.ver_timekey > sysdate-1/6\n            )\n            , r as(\n            select to_char(OUTPUT_TIME,'yyyy/mm/dd hh24:mi:ss') RETICLE_OUTPUT_TIME,parentid RETICLE_PARENTID, reticles_id MASK_ID,location TOOL_ID, time_in ARRIVAL_TIME,'' PRODUCT_ID, LOCATION_FROM,'' UPDATE_USER, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME,'' CHECKED\n            from opt_reticle_output r\n            where r.ver_timekey > sysdate-1/6\n            and not exists (select * from m \n            where m.mask_id = r.reticles_id \n            and m.tool_id = r.location \n            and m.location_from = r.location_from\n            and m.arrival_time = r.time_in)\n            )\n            ,u as(\n            select * from m\n            union\n            select distinct * from r\n            )select  RETICLE_OUTPUT_TIME,RETICLE_PARENTID, MASK_ID, TOOL_ID, ARRIVAL_TIME, PRODUCT_ID, LOCATION_FROM, UPDATE_USER, UPDATE_TIME, CHECKED\n            from u\n            order by u.arrival_time desc ,update_time desc"; //where m.ver_timekey > sysdate-1/6
        return Proxy_1.querySql(sql);
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=MaskTransferModel.js.map