"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var webix_jet_1 = require("webix-jet");
var OptReserveViewController_1 = require("./OptReserveViewController");
var OptReserve = /** @class */ (function (_super) {
    __extends(OptReserve, _super);
    function OptReserve() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctrl = new OptReserveViewController_1.default();
        _this.init = _this.ctrl.init;
        return _this;
    }
    OptReserve.prototype.config = function () {
        var textFilter = { content: "textFilter" };
        var layout = {
            rows: [
                {
                    paddingX: 10,
                    margin: 5,
                    borderless: true,
                    cols: [
                        {
                            view: "button",
                            label: "Reload",
                            type: "icon",
                            icon: "wxi-sync",
                            width: 80,
                            click: this.ctrl.onReloadBtnClick
                        },
                        {}
                    ]
                },
                {
                    view: "datatable",
                    id: OptReserve.viewIds.rsvGrid,
                    dragColumn: true,
                    resizeColumn: { headerOnly: true },
                    rowHeight: 60,
                    rowLineHeight: 20,
                    css: "rows",
                    columns: [
                        { id: "TOOL_ID", header: ["EQP ID", textFilter], width: 100, sort: "string" },
                        { id: "DSP_PROD_ID", header: ["DSP Product ID", textFilter], width: 150, sort: "string" },
                        { id: "DSP_STEP_ID", header: ["DSP Step ID", textFilter], width: 100, sort: "string" },
                        { id: "PROD_ID", header: ["Product ID", textFilter], width: 150, sort: "string" },
                        { id: "STEP_ID", header: ["Step ID", textFilter], width: 100, sort: "string" }
                        // { id: "SEQ", header: ["Sequence", textFilter], width: 90 ,sort:"string"}
                    ]
                }
            ]
        };
        return layout;
    };
    OptReserve.viewIds = {
        rsvGrid: "rsvGrid"
    };
    return OptReserve;
}(webix_jet_1.JetView));
exports.default = OptReserve;
//# sourceMappingURL=OptReserve.js.map