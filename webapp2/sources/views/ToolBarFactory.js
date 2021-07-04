"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BarType;
(function (BarType) {
    BarType[BarType["Query"] = 0] = "Query";
    BarType[BarType["Edit"] = 1] = "Edit";
    BarType[BarType["Control"] = 2] = "Control";
})(BarType || (BarType = {}));
var EditCmp;
(function (EditCmp) {
    EditCmp[EditCmp["RESET"] = 0] = "RESET";
    EditCmp[EditCmp["SAVE"] = 1] = "SAVE";
    EditCmp[EditCmp["ADD"] = 2] = "ADD";
    EditCmp[EditCmp["MODIFY"] = 3] = "MODIFY";
    EditCmp[EditCmp["DELETE"] = 4] = "DELETE";
})(EditCmp || (EditCmp = {}));
var ToolBarFactory = /** @class */ (function () {
    function ToolBarFactory() {
    }
    ToolBarFactory.prototype.grpCombo = function (on) {
        return {
            view: "richselect",
            id: ToolBarFactory.viewIds.grpCombo,
            label: "Group ID",
            width: 180,
            value: 1,
            options: [],
            on: on
        };
    };
    ToolBarFactory.prototype.initToolBar = function () {
    };
    ToolBarFactory.queryCmp = {};
    ToolBarFactory.viewIds = {
        grpCombo: "grpCombo"
    };
    return ToolBarFactory;
}());
exports.ToolBarFactory = ToolBarFactory;
//# sourceMappingURL=ToolBarFactory.js.map