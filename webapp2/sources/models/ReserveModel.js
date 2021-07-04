"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var ReserveModel = /** @class */ (function () {
    function ReserveModel() {
    }
    ReserveModel.selectOptReserveData = function () {
        var sql = "select * from OPT_RESERVE r\n        where r.parentid  in (SELECT ID FROM(        \n            SELECT row_number()OVER (PARTITION BY toolg_id ORDER BY VER_TIMEKEY DESC) rno,o.id\n            FROM OPT_VER_CONTROL o\n            WHERE ver_timekey > SYSDATE-1\n            AND TABLE_NAME = 'OPT_RESERVE')\n            WHERE rno = 1)\n        and r.seq = 1\n        order by r.tool_id";
        return Proxy_1.querySql(sql);
    };
    return ReserveModel;
}());
exports.default = ReserveModel;
//# sourceMappingURL=ReserveModel.js.map