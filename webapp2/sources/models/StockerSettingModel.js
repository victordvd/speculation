"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var StockerSettingModel = /** @class */ (function () {
    function StockerSettingModel() {
    }
    StockerSettingModel.selectStockerData = function (callback) {
        var sql = "\n        select * from(\n            select *\n            from gui_transport\n            where parentid = (select distinct ID from V_SET_LASTEST_VERSION t where table_name = 'SET_TRANSPORT' and toolg_id is not null)\n            )pivot ( \n                 max(trans_time) for stocker_id_to in('AFST01' AFST01,'AFST02' AFST02,'AFST06' AFST06,'AFST11' AFST11,'AFST12' AFST12,'AFST16' AFST16)\n            )\n            order by stocker_id_from";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    StockerSettingModel.insertGuiData = function (sql, callback) {
        Proxy_1.querySqlCallBack(sql, callback);
    };
    StockerSettingModel.insertIntoTransport = function (guid, callback) {
        var sql = "INSERT INTO set_transport (PARENTID, TOOLG_ID, TOOL_ID_FROM, TOOL_ID,EXTRA_COST,UPDATE_TIME)\n        WITH T1 AS (SELECT E.TOOL_ID, E.STOCKER_ID FROM V_MAT_EQP_STATUS E )\n        ,T2 AS (SELECT E.TOOL_ID, E.STOCKER_ID FROM V_MAT_EQP_STATUS E )\n        ,T3 AS (\n        SELECT S.parentid PARENTID, '' TOOLG_ID, T1.TOOL_ID TOOL_ID_FROM, T2.TOOL_ID, S.TRANS_TIME/60 EXTRA_COST, SYSDATE UPDATE_TIME\n        FROM GUI_TRANSPORT S,T1,T2\n        WHERE S.parentid = '" + guid + "'\n        AND S.STOCKER_ID_FROM = T1.STOCKER_ID(+)\n        AND S.STOCKER_ID_TO = T2.STOCKER_ID(+))\n        SELECT PARENTID,TOOLG_ID,TOOL_ID_FROM,TOOL_ID,EXTRA_COST ,UPDATE_TIME\n        FROM T3\n        WHERE T3.TOOL_ID_FROM NOT LIKE 'AAPPH%' AND T3.TOOL_ID LIKE 'AAPPH%'";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    return StockerSettingModel;
}());
exports.default = StockerSettingModel;
//# sourceMappingURL=StockerSettingModel.js.map