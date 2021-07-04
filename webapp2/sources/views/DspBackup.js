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
var DspBackupViewController_1 = require("./DspBackupViewController");
var DspBackup = /** @class */ (function (_super) {
    __extends(DspBackup, _super);
    function DspBackup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctrl = new DspBackupViewController_1.default();
        _this.init = _this.ctrl.init;
        return _this;
    }
    DspBackup.prototype.config = function () {
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
                    id: DspBackup.viewIds.dspGrid,
                    dragColumn: true,
                    resizeColumn: { headerOnly: true },
                    rowHeight: 60,
                    rowLineHeight: 20,
                    css: "rows",
                    columns: [
                        { id: "FACTORYNAME", header: ["Factory", textFilter], width: 100, sort: "string" },
                        { id: "MACHINENAME", header: ["Equipment", textFilter], width: 100, sort: "string" },
                        { id: "PRODUCTSPECNAME", header: ["Product", textFilter], width: 160, sort: "string" },
                        { id: "PROCESSOPERATIONNAME", header: ["Step", textFilter], width: 80, sort: "string" },
                        { id: "SEQ", header: ["Sequence", textFilter], width: 90, sort: "string" },
                        { id: "UPDATE_TIME", header: ["Update Time", textFilter], width: 160, sort: "string" }
                    ]
                }
            ]
        };
        return layout;
    };
    DspBackup.viewIds = {
        dspGrid: 'dpsGrid'
    };
    return DspBackup;
}(webix_jet_1.JetView));
exports.default = DspBackup;
//# sourceMappingURL=DspBackup.js.map