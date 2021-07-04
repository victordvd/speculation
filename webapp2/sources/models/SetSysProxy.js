"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var records_1 = require("./records");
var SetSysProxy = /** @class */ (function () {
    function SetSysProxy() {
    }
    SetSysProxy.getGrpId = function (callback) {
        var str = "\n      select toolg_id \"id\",toolg_id \"value\" from (\n      select distinct TOOLG_ID\n      from ( SELECT ROW_NUMBER() OVER (ORDER BY  end_time desc) as id,id as value,  TO_CHAR(end_time,'YYYY/MM/DD HH24:MI') as end_time, TOOLG_ID FROM JOB_RUN_CONTROL  \n      where result = 'Success') t)\n      "; //and end_time>sysdate-3
        records_1.querySqlCallBack(str, callback);
    };
    SetSysProxy.getConfig = function (id, callback) {
        // a.id ,a.parent_id , a.propertyno ,a.text
        var sql = "select a.*,b.propertyvalue,b.parentid\n      from gui_system a,(SELECT * FROM set_system , (SELECT id FROM set_ver_control \n        where  table_name = 'SET_SYSTEM' and toolg_id = '" + id + "'  and rownum = 1\n        order by update_time desc) v\n      where parentid = v.id) b\n      where  a.parent_id >= 0\n      and a.propertyno(+) = b.propertyno\n      order by a.parent_id ,a.id";
        records_1.querySqlCallBack(sql, callback);
    };
    SetSysProxy.getNewestVersion = function (id, callback) {
        var sql = "SELECT id FROM set_ver_control \n      where  table_name = 'SET_SYSTEM' and toolg_id = '" + id + "'  and rownum = 1\n      order by update_time desc";
        records_1.querySqlCallBack(sql, callback);
    };
    SetSysProxy.getGUID = function (callback) {
        var sql = "SELECT sys_guid() guid FROM dual";
        records_1.querySqlCallBack(sql, callback);
    };
    SetSysProxy.insertVerCtrl = function (guid, toolg_id, updateUser, callback) {
        var sql = "INSERT INTO \n      set_ver_control(id,factory_id,module_id,toolg_id,table_name,update_time,update_user) \n      VALUES('" + guid + "','ARRAY','PHOTO','" + toolg_id + "','SET_SYSTEM',sysdate,'" + updateUser + "')";
        records_1.querySqlCallBack(sql, callback);
    };
    SetSysProxy.insertSetSystem = function (guid, data, callback) {
        data.forEach(function (data) {
            var stm = "INSERT INTO set_system(parentid,propertyno,propertyvalue,update_time) \n        VALUES('" + guid + "','" + data.propertno + "','" + data.propertyvalue + "',sysdate)";
            records_1.querySqlCallBack(stm, callback);
        });
    };
    return SetSysProxy;
}());
exports.SetSysProxy = SetSysProxy;
//# sourceMappingURL=SetSysProxy.js.map