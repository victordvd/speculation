"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proxy_1 = require("./Proxy");
var DspBackupModel = /** @class */ (function () {
    function DspBackupModel() {
    }
    DspBackupModel.prototype.selectDspBackup = function () {
        var sql = "SELECT FACTORYNAME, MACHINENAME, PRODUCTSPECNAME, PROCESSOPERATIONNAME,SEQ, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME \n        FROM V_DSP_BACKUP";
        return Proxy_1.querySql(sql);
    };
    return DspBackupModel;
}());
exports.default = DspBackupModel;
//# sourceMappingURL=DspBackupModel.js.map