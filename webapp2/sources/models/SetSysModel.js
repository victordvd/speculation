"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var SetSysModel = /** @class */ (function () {
    function SetSysModel() {
    }
    SetSysModel.getGrpId = function (callback) {
        var str = "\n      select toolg_id \"id\",toolg_id \"value\" from (\n      select distinct TOOLG_ID\n      from ( SELECT ROW_NUMBER() OVER (ORDER BY  end_time desc) as id,id as value,  TO_CHAR(end_time,'YYYY/MM/DD HH24:MI') as end_time, TOOLG_ID FROM JOB_RUN_CONTROL  \n      where result = 'Success' and end_time>sysdate-3) t)\n      "; //and end_time>sysdate-3
        Proxy_1.querySqlCallBack(str, callback);
    };
    SetSysModel.getConfig = function (id, callback) {
        // a.id ,a.parent_id , a.propertyno ,a.text
        var sql = "select a.*,b.propertyvalue,b.parentid\n      from gui_system a,(SELECT * FROM set_system , (select id from V_SET_LASTEST_VERSION t \n        where table_name = 'SET_SYSTEM'\n       and toolg_id = '" + id + "') v\n      where parentid = v.id) b\n      where  a.propertyno(+) = b.propertyno\n      order by a.parent_id ,a.id";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    SetSysModel.getNewestVersion = function (id, callback) {
        var sql = "SELECT id FROM set_ver_control \n      where  table_name = 'SET_SYSTEM' and toolg_id = '" + id + "'  and rownum = 1\n      order by update_time desc";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    SetSysModel.insertSetSystem = function (guid, data, callback) {
        var sql = "INSERT ALL\n";
        data.forEach(function (data) {
            sql += "INTO set_system(parentid,propertyno,propertyvalue,update_time) \n        VALUES('" + guid + "','" + data.propertno + "','" + data.propertyvalue + "',sysdate)\n";
        });
        sql += "SELECT * FROM dual";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    return SetSysModel;
}());
exports.SetSysModel = SetSysModel;
//# sourceMappingURL=SetSysModel.js.map