"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var SetSystemModel = /** @class */ (function () {
    function SetSystemModel() {
    }
    SetSystemModel.selectSystem = function (toolgId, callback) {
        // a.id ,a.parent_id , a.propertyno ,a.text
        //let sql = `select a.*,b.propertyvalue,b.parentid
        var sql = "select a.id, a.parent_id, a.propertyno, a.text, a.html_el, a.attr, a.options ,nullable, a.default_val, a.unit,b.propertyvalue,b.parentid\n      from gui_system a,(SELECT * FROM set_system \n        where parentid = (select id from V_SET_LASTEST_VERSION t \n          where table_name = 'SET_SYSTEM' and toolg_id = '" + toolgId + "') ) b\n      where  a.propertyno = b.propertyno(+)\n      order by a.parent_id ,a.id";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    SetSystemModel.selectSetSysById = function (id) {
        var sql = "select a.id, a.parent_id, a.propertyno, a.text, a.html_el, a.attr, a.options ,nullable, a.default_val, a.unit,b.propertyvalue,b.parentid\n      from gui_system a,(SELECT * FROM set_system where parentid = '" + id + "') b\n      where a.propertyno = b.propertyno(+)\n      order by a.parent_id ,a.id";
        return Proxy_1.querySql(sql);
    };
    SetSystemModel.getAllVersion = function (toolgId) {
        var sql = "with en as(\n        select id from(\n         select row_number() over(order by v.update_time desc) rno,v.* from set_ver_control v\n         where v.table_name = 'SET_SYSTEM'\n         and v.toolg_id = '" + toolgId + "'\n         )where rno = 1\n        )\n        select case when en.id is null then null else 'V' end enabled, v.*\n        from set_ver_control v ,en\n        where v.table_name = 'SET_SYSTEM' and v.toolg_id = '" + toolgId + "'\n        and v.id = en.id(+)";
        return Proxy_1.querySql(sql);
    };
    /*
        static getNewestVersion(id,callback){
          let sql =`SELECT * FROM(
          SELECT id FROM set_ver_control
          WHERE  table_name = 'SET_SYSTEM' and toolg_id = '${id}'
          ORDER BY update_time desc) t
          WHERE rownum = 1`
          querySqlCallBack(sql,callback)
        }*/
    SetSystemModel.insertSetSystem = function (guid, data, callback) {
        var sql = "INSERT ALL\n";
        data.forEach(function (data) {
            if (data.propertyvalue == null) {
                sql += "INTO set_system(parentid,propertyno,propertyvalue,update_time) \n          VALUES('" + guid + "','" + data.propertno + "',null,sysdate)\n";
            }
            else {
                sql += "INTO set_system(parentid,propertyno,propertyvalue,update_time) \n          VALUES('" + guid + "','" + data.propertno + "','" + data.propertyvalue + "',sysdate)\n";
            }
        });
        sql += "SELECT * FROM dual";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    SetSystemModel.deleteData = function (id, callback) {
        var sql = "DELETE FROM set_system WHERE parentid = '" + id + "'";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    SetSystemModel.deleteVersion = function (id, callback) {
        var sql = "DELETE FROM set_ver_control WHERE id = '" + id + "'";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    SetSystemModel.enableVersion = function (id, callback) {
        var sql = "UPDATE set_ver_control SET update_time = sysdate WHERE id = '" + id + "'";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    return SetSystemModel;
}());
exports.SetSystemModel = SetSystemModel;
//# sourceMappingURL=SetSystemModel.js.map