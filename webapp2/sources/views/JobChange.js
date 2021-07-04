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
var JobChangeViewController_1 = require("./JobChangeViewController");
var JobChange = /** @class */ (function (_super) {
    __extends(JobChange, _super);
    function JobChange() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctrl = new JobChangeViewController_1.default();
        _this.init = _this.ctrl.init;
        return _this;
    }
    JobChange.prototype.config = function () {
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
                    id: JobChange.viewIds.jcGrid,
                    dragColumn: true,
                    resizeColumn: { headerOnly: true },
                    rowHeight: 60,
                    rowLineHeight: 20,
                    css: "rows",
                    columns: [
                        // { id: "status", header: ["Status", textFilter], width: 80 ,sort:"string"},
                        { id: "eqp", header: ["Equipment", textFilter], width: 100, sort: "string" },
                        { id: "curOper", header: ["Current Product Operation", textFilter], width: 200, sort: "string" },
                        { id: "jcOper", header: ["JC Product Operation", textFilter], width: 200, sort: "string" },
                        { id: "lotId", header: ["Conform Lot ID", textFilter], width: 140, sort: "string" },
                        { id: "timeIn", header: ["Conform Lot In time", textFilter], width: 160, sort: "string" },
                        { id: "lv", header: ["Level", textFilter], width: 70, sort: "string" }
                    ]
                }
            ]
        };
        return layout;
    };
    JobChange.viewIds = {
        jcGrid: "jcGrid"
    };
    return JobChange;
}(webix_jet_1.JetView));
exports.default = JobChange;
//# sourceMappingURL=JobChange.js.map