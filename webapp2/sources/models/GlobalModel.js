"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var GlobalController_1 = require("../controllers/GlobalController");
var TextStore_1 = require("../store/TextStore");
var GlobalModel = /** @class */ (function () {
    function GlobalModel() {
    }
    GlobalModel.getGUID = function (callback) {
        var sql = "SELECT sys_guid() guid FROM dual";
        Proxy_1.querySqlCallBack(sql, function (guidObj) {
            var guid = GlobalController_1.default.convertBase64ToHex(guidObj[0].GUID);
            callback(guid);
        });
    };
    GlobalModel.insertSetVerCtrl = function (id, factory_id, module_id, toolg_id, table_name, updateUser, callback) {
        var toolgId = (toolg_id == null) ? 'null' : "'" + toolg_id + "'";
        var sql = "INSERT INTO \n    set_ver_control(id,factory_id,module_id,toolg_id,table_name,update_time,update_user) \n    VALUES('" + id + "','" + factory_id + "','" + module_id + "'," + toolgId + ",'" + table_name + "',sysdate,'" + updateUser + "')";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    GlobalModel.insertMatVerCtrl = function (id, toolg_id, table_name, updateUser, callback) {
        var toolgId = (toolg_id == null) ? 'null' : "'" + toolg_id + "'";
        var sql = "INSERT INTO mat_ver_control(id,toolg_id,table_name,update_time,update_user) \n    VALUES('" + id + "'," + toolgId + ",'" + table_name + "',sysdate,'" + updateUser + "')";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    GlobalModel.overwriteVerCtrl = function (oldId, newId, updateUser, enabled, callback) {
        var sql;
        if (enabled) {
            sql = "UPDATE set_ver_control\n      SET id = '" + newId + "',update_user = '" + updateUser + "', ver_update_time = sysdate , update_time = sysdate\n      WHERE id = '" + oldId + "'";
        }
        else {
            sql = "UPDATE set_ver_control\n      SET id = '" + newId + "',update_user = '" + updateUser + "', ver_update_time = sysdate\n      WHERE id = '" + oldId + "'";
        }
        Proxy_1.querySqlCallBack(sql, callback);
    };
    GlobalModel.insertVerCtrlWithName = function (id, factory_id, module_id, toolg_id, table_name, updateUser, name, enabled, callback) {
        var toolgId = (toolg_id == null) ? 'null' : "'" + toolg_id + "'";
        var updateTime = (enabled) ? "sysdate" : "to_date('2010-01-01','yyyy-mm-dd')";
        // let sql = `INSERT INTO 
        // set_ver_control(id,factory_id,module_id,toolg_id,table_name,update_time,update_user,ver_update_time) 
        // VALUES('${id}','${factory_id}','${module_id}',${toolgId},'${table_name}',sysdate,'${updateUser}',sysdate)`
        var sql = "INSERT INTO \n    set_ver_control(id,factory_id,module_id,toolg_id,table_name,update_time,update_user,name,ver_update_time) \n    VALUES('" + id + "','" + factory_id + "','" + module_id + "'," + toolgId + ",'" + table_name + "' ," + updateTime + ",'" + updateUser + "','" + name + "',sysdate)";
        Proxy_1.querySqlCallBack(sql, callback);
        // querySql(sql)
    };
    GlobalModel.selectPhotoToolgId = function (callback) {
        var sql = "SELECT TOOLG_ID FROM SET_MODULE_BASIS\n    WHERE type1 = 'RUN_TOOLG' AND ENABLEFLAG = '1' AND MODULE_ID = 'PHOTO'\n    ORDER BY toolg_id";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    GlobalModel.selectUserInfo = function (id, pw, callback) {
        var sql = "SELECT *\n    FROM SET_USERBASIS\n    WHERE id='" + id + "'";
        if (pw === '') {
            sql += "AND password is null";
        }
        else {
            sql += "AND password='" + pw + "'";
        }
        Proxy_1.querySqlCallBack(sql, callback);
    };
    GlobalModel.selectLatestOptTableVersion = function (toolg, callback) {
        var sql = "SELECT toolg_id,id FROM V_JOB_LASTEST_VERSION";
        if (toolg)
            sql += " WHERE toolg_id = '" + toolg + "'";
        Proxy_1.querySqlCallBack(sql, function (recs) {
            var ids = [];
            recs.forEach(function (rec) {
                ids.push({ toolg: rec.TOOLG_ID, id: rec.ID });
            }, true);
            callback(ids, 'selectLatestOptTableVersion');
        });
    };
    GlobalModel.selectLatestMatTableVersion = function (matTable) {
        var sql = "select id from v_mat_lastest_version where table_name = '" + matTable + "'";
        return Proxy_1.querySql(sql);
    };
    GlobalModel.selectLatestSetTableVersion = function (modu, setTable, callback) {
        var sql = '';
        switch (setTable) {
            case TextStore_1.default.SET_TABLES.SET_MACHINEGROUP:
                sql = "  SELECT distinct id\n              FROM V_SET_LASTEST_VERSION \n              WHERE TABLE_NAME = '" + setTable + "'\n              AND TOOLG_ID is not null\n              AND  MODULE_ID = '" + modu + "'\n              ";
                break;
            case TextStore_1.default.SET_TABLES.SET_TPFOMPOLICY:
                sql = "SELECT ID FROM V_SET_LASTEST_VERSION \n                WHERE TABLE_NAME = '" + setTable + "' \n                AND MODULE_ID = '" + modu + "'";
                break;
            case TextStore_1.default.SET_TABLES.SET_TRANSPORT:
                sql = "select distinct ID from V_SET_LASTEST_VERSION t \n        where table_name = '" + setTable + "'\n        and toolg_id is not null\n        AND  MODULE_ID = '" + modu + "'";
                break;
            case TextStore_1.default.SET_TABLES.SET_SCHEDULE_MACHINE_DOWN:
                sql = "select distinct id from V_SET_LASTEST_VERSION t \n        where table_name = '" + setTable + "'\n        AND  MODULE_ID = '" + modu + "'";
                break;
            default:
                sql = "select distinct ID from V_SET_LASTEST_VERSION t \n          where table_name = '" + setTable + "'\n          AND MODULE_ID = '" + modu + "'";
                break;
        }
        Proxy_1.querySqlCallBack(sql, callback);
    };
    GlobalModel.selectVerInfo = function (id) {
        var sql = "select ID, FACTORY_ID, MODULE_ID, TOOLG_ID, TABLE_NAME, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME, UPDATE_USER ,NAME, to_char(VER_UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') VER_UPDATE_TIME\n    from SET_VER_CONTROL \n    where id = '" + id + "'";
        return Proxy_1.querySql(sql);
    };
    GlobalModel.selectMatVerInfo = function (id) {
        var sql = "select ID, TOOLG_ID, TABLE_NAME, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME, UPDATE_USER\n    from MAT_VER_CONTROL\n    where id = '" + id + "'";
        return Proxy_1.querySql(sql);
    };
    GlobalModel.selectLatestSetTableVersionByToolg = function (setTable, modu, toolg) {
        var sql = "SELECT b.*\n   FROM (SELECT b.*,ROW_NUMBER() OVER (PARTITION BY b.factory_id,b.module_id,b.toolg_id,  b.TABLE_NAME ORDER BY Update_Time DESC) AS RTN FROM SET_VER_CONTROL b ) b\n   WHERE b.RTN = 1\n   AND table_name = '" + setTable + "'\n   AND MODULE_ID = '" + modu + "'\n    AND TOOLG_ID ='" + toolg + "'";
        /*
        let sql = `select * from V_SET_LASTEST_VERSION t
        where table_name = '${setTable}'
        AND MODULE_ID = '${modu}'
        AND TOOLG_ID ='${toolg}'`*/
        return Proxy_1.querySql(sql);
        // querySqlCallBack(sql,callback)
    };
    GlobalModel.remainDataIn20release = function (setTabVo) {
        // let factory = setTabVo.factory
        // let moduleId = setTabVo.module
        var table = setTabVo.setTable;
        //versions of set system mange by users
        if (table === TextStore_1.default.SET_TABLES.SET_SYSTEM)
            return;
        Proxy_1.querySqlCallBack("call sp_purge_set_table('" + table + "')", function () { });
        /*
        let delSql_set = `DELETE FROM ${table} s
        WHERE EXISTS(
        SELECT * FROM(
        SELECT row_number()over(partition by toolg_id order by update_time desc) rowno, v.*
        FROM set_ver_control v
        WHERE v.factory_id = '${factory}'
        AND v.module_id = '${moduleId}'
        AND v.TABLE_NAME = '${table}'
        ) o20
        WHERE o20.rowno>20
        AND o20.id = s.parentid)`
    
        querySqlCallBack(delSql_set,()=>{
          let delSql_ver = `DELETE FROM set_ver_control s
          WHERE EXISTS(
          SELECT * FROM(
          SELECT row_number()over(partition by toolg_id order by update_time desc) rowno, v.*
          FROM set_ver_control v
          WHERE v.factory_id = '${factory}'
          AND v.module_id = '${moduleId}'
          AND v.TABLE_NAME = '${table}'
          ) o20
          WHERE o20.rowno>20
          AND o20.id = s.id)`
    
          querySqlCallBack(delSql_ver,()=>{})
        })
        */
    };
    return GlobalModel;
}());
exports.default = GlobalModel;
//# sourceMappingURL=GlobalModel.js.map