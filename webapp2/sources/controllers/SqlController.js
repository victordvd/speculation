"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SqlController = /** @class */ (function () {
    function SqlController() {
    }
    SqlController.nullOrString = function (val) {
        if (val == null)
            return "''";
        else
            return "'" + val + "'";
    };
    return SqlController;
}());
exports.default = SqlController;
//# sourceMappingURL=SqlController.js.map