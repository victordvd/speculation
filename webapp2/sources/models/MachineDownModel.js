"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var MachineDownModel = /** @class */ (function () {
    function MachineDownModel() {
    }
    //remove para : grpId 2019/7/30
    MachineDownModel.selectMachineDown = function (callback) {
        //select PARENTID, TOOLG_ID, TOOL_ID, CH_ID, to_char(DOWN_START,'yyyy/mm/dd hh24:mi:ss') DOWN_START, to_char(DOWN_END,'yyyy/mm/dd hh24:mi:ss') DOWN_END
        var sql = "select PARENTID, TOOLG_ID, TOOL_ID, CH_ID, DOWN_START, DOWN_END ,nvl(REMARK,'') REMARK, CODE_ID\n        from set_schedule_machine_down\n        where parentid = (select distinct id from V_SET_LASTEST_VERSION t \n            where table_name = 'SET_SCHEDULE_MACHINE_DOWN'\n            and update_time = (select max(update_time) from V_SET_LASTEST_VERSION where table_name = 'SET_SCHEDULE_MACHINE_DOWN')\n            )";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    MachineDownModel.insertMachineDown = function (guid, data, callback) {
        var sql = "INSERT ALL\n";
        var dateFormat = 'yyyy-mm-dd hh24:mi:ss';
        var format = function (str) {
            return str.replace(/T/, ' ');
        };
        //toolg id is no need
        data.forEach(function (rec) {
            var remark = (rec.REMARK == null) ? '' : rec.REMARK;
            var codeIdVal = rec.CODE_ID;
            if (codeIdVal == 1) {
                codeIdVal = "'P0001'";
            }
            else {
                codeIdVal = "null";
            }
            sql += "INTO set_schedule_machine_down(parentid,tool_id,down_start,down_end,remark,code_id)\n            VALUES('" + guid + "','" + rec.TOOL_ID + "',to_date('" + format(rec.DOWN_START) + "','" + dateFormat + "'),to_date('" + format(rec.DOWN_END) + "','" + dateFormat + "'),'" + remark + "'," + codeIdVal + ")\n";
        });
        sql += 'SELECT * FROM dual';
        Proxy_1.querySqlCallBack(sql, callback);
    };
    MachineDownModel.selectMachines = function (callback) {
        var sql = "select machinename from SET_MACHINEGROUP\n        where parentid  in (\n        select id from V_SET_LASTEST_VERSION t \n        where table_name = 'SET_MACHINEGROUP'\n        and module_id = 'PHOTO'\n        )\n        order by machinename";
        Proxy_1.querySqlCallBack(sql, callback);
    };
    return MachineDownModel;
}());
exports.default = MachineDownModel;
//# sourceMappingURL=MachineDownModel.js.map