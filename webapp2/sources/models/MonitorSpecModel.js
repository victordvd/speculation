"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var MonitorSpecModel = /** @class */ (function () {
    function MonitorSpecModel() {
    }
    MonitorSpecModel.selectData = function () {
        var sql = "\n        WITH FLOW AS(  \n           SELECT \n               PRODUCTSPECNAME, \n               PROCESSOPERATIONNAME,\n               DESCRIPTION AS OPERATION,FACTORYNAME||'_'||PRODUCTSPECNAME||'_'||PROCESSFLOWNAME||'_'||PROCESSOPERATIONNAME AS CONDITIONID ,\n               ROW_NUMBER() OVER (PARTITION BY PRODUCTSPECNAME ORDER BY POSITION) AS RTN\n           FROM MAT_PROCESS_FLOW pf\n           WHERE pf.PARENTID = (SELECT ID FROM V_MAT_LASTEST_VERSION l WHERE l.TABLE_NAME = 'MAT_PROCESS_FLOW')\n               AND pf.Processflowtype = 'Main'\n               AND pf.PROCESSOPERATIONTYPE = 'Production'\n       ),SOURCE_STEPS AS(\n           SELECT DISTINCT\n               a.PROCESSOPERATIONNAME,\n               b.PROCESSOPERATIONNAME AS NEXT_PROCESSOPERATIONNAME,\n               a.OPERATION\n           FROM (SELECT PRODUCTSPECNAME,PROCESSOPERATIONNAME,OPERATION,RTN FROM FLOW f WHERE EXISTS(SELECT 1 FROM (SELECT * FROM MAT_POSMACHINE j WHERE j.PARENTID = (SELECT ID FROM V_MAT_LASTEST_VERSION l WHERE l.TABLE_NAME = 'MAT_POSMACHINE')) j WHERE j.MACHINENAME LIKE 'AAPPH%' AND j.CONDITIONID = f.CONDITIONID )) a\n           LEFT JOIN FLOW b\n               ON a.PRODUCTSPECNAME = b.PRODUCTSPECNAME AND a.RTN = b.RTN-1\n       )SELECT \n           st.PARENTID,\n           NVL(st.STEP_ID,sp.PROCESSOPERATIONNAME) AS STEP_ID,\n           st.SUB_STEP_ID,\n           NVL(st.LAYER_NAME,sp.OPERATION) AS LAYER_NAME,\n           st.L2,\n           st.L3,\n           st.L2_CNT,\n           st.L3_CNT,\n           st.UPDATE_USER,\n           st.UPDATE_TIME,\n           sp.NEXT_PROCESSOPERATIONNAME AS SUB_STEP_SELECTION\n       FROM (SELECT * FROM SET_MONITOR_SPEC WHERE PARENTID = (SELECT ID FROM V_SET_LASTEST_VERSION WHERE TABLE_NAME = 'SET_MONITOR_SPEC' AND MODULE_ID = 'PHOTO' AND ROWNUM = 1)) st \n       FULL OUTER JOIN SOURCE_STEPS sp\n           ON st.STEP_ID = sp.PROCESSOPERATIONNAME\n               AND NVL(st.SUB_STEP_ID,sp.NEXT_PROCESSOPERATIONNAME) = sp.NEXT_PROCESSOPERATIONNAME\n      ORDER BY st.PARENTID, st.STEP_ID, st.SUB_STEP_ID\n        ";
        return Proxy_1.querySql(sql);
    };
    MonitorSpecModel.insertMonitorSpecData = function (guid, data, callback) {
        if (data == null || data.length === 0) {
            callback();
        }
        var sql = "INSERT ALL\n";
        data.forEach(function (rec) {
            sql += "INTO SET_MONITOR_SPEC(parentid,step_id,sub_step_id,layer_name,l2,l3,l2_cnt,l3_cnt,update_time,update_user)\n            VALUES('" + guid + "','" + rec.STEP_ID + "'," + Proxy_1.convertStrToDbVal(rec.SUB_STEP_ID) + "," + Proxy_1.convertStrToDbVal(rec.LAYER_NAME) + "," + rec.L2 + "," + rec.L3 + "," + rec.L2_CNT + "," + rec.L3_CNT + ",to_date('" + rec.UPDATE_TIME + "','yyyy-mm-dd hh24:mi:ss'),'" + rec.UPDATE_USER + "') \n";
        });
        sql += " SELECT * FROM dual";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    return MonitorSpecModel;
}());
exports.default = MonitorSpecModel;
//# sourceMappingURL=MonitorSpecModel.js.map