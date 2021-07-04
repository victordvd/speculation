"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var MachineGroup = /** @class */ (function () {
    function MachineGroup() {
    }
    MachineGroup.getGrpId = function (callback) {
        var str = "\n    SELECT ROW_NUMBER() OVER (ORDER BY VALUE DESC) AS \"id\", a.VALUE AS \"value\" FROM (\n      SELECT DISTINCT MODULE_ID AS VALUE FROM SET_MODULE_BASIS WHERE TYPE1 = 'RUN_TOOLG' AND ENABLEFLAG = '1') a\n    ";
        Proxy_1.querySqlCallBack(str, callback);
    };
    MachineGroup.getMachineList = function (moduleid, callback) {
        var sql = "SELECT ROW_NUMBER() OVER (ORDER BY MACHINENAME) AS \"num\",FACTORYNAME AS \"fac\",PARENTID AS \"parentid\",GROUPNAME AS \"group\", MACHINENAME AS \"machine\", UPDATE_TIME AS \"ut\", GROUPNAME AS \"orggroup\" FROM SET_MACHINEGROUP WHERE PARENTID IN (\n          SELECT ID FROM (\n              SELECT \n                  ID,\n                  ROW_NUMBER() OVER (PARTITION BY MODULE_ID,TOOLG_ID ORDER BY UPDATE_TIME DESC) AS RTN \n              FROM SET_VER_CONTROL \n              WHERE MODULE_ID = '" + moduleid + "' AND TABLE_NAME = 'SET_MACHINEGROUP'\n          ) WHERE RTN = 1 \n      ) ORDER BY MACHINENAME";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    MachineGroup.insertAllSetMachineGroup = function (sql, callback) {
        Proxy_1.querySqlCallBack(sql, callback);
    };
    MachineGroup.insertSetMachineGroup = function (guid, data, callback) {
        data.forEach(function (data) {
            var stm = "INSERT INTO SET_MACHINEGROUP(PARENTID, UPDATE_TIME, FACTORYNAME, GROUPNAME, MACHINENAME) \n      VALUES('" + guid + "',SYSDATE,'" + data.factory + "','" + data.groupname + "','" + data.machinename + "')";
            Proxy_1.querySqlCallBack(stm, callback);
        });
    };
    MachineGroup.getNewestVersion = function (table, moduleid, toolg, callback) {
        var sql = "SELECT ID FROM V_SET_LASTEST_VERSION \n    WHERE MODULE_ID = '" + moduleid + "' AND TOOLG_ID = '" + toolg + "' AND TABLE_NAME = '" + table + "' AND ROWNUM = 1\n    ORDER BY UPDATE_TIME DESC";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    return MachineGroup;
}());
exports.MachineGroup = MachineGroup;
//# sourceMappingURL=MachineGroupModel.js.map