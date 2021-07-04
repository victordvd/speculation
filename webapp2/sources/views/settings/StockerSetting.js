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
var StockerSettingViewController_1 = require("./StockerSettingViewController");
var StockerSetting = /** @class */ (function (_super) {
    __extends(StockerSetting, _super);
    function StockerSetting() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctrl = new StockerSettingViewController_1.StockerSettingViewContriller(_this);
        _this.init = _this.ctrl.init;
        return _this;
    }
    StockerSetting.prototype.config = function () {
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
                        {},
                        {
                            view: "button",
                            label: "Save",
                            type: "icon",
                            icon: "wxi-check",
                            width: 80,
                            click: this.ctrl.onSaveBtnClick
                        }
                    ]
                },
                {
                    view: "datatable",
                    id: StockerSetting.viewIds.stockerGrid,
                    editable: true,
                    dragColumn: true,
                    resizeColumn: { headerOnly: true },
                    css: "rows",
                    columns: StockerSetting.staticCols
                }
            ]
        };
        return layout;
    };
    StockerSetting.viewIds = {
        stockerGrid: "stockerGrid"
    };
    StockerSetting.staticCols = [
        { id: "STOCKER_ID_FROM", header: "", width: 100, css: "machine", sort: "string" }
    ];
    return StockerSetting;
}(webix_jet_1.JetView));
exports.default = StockerSetting;
//# sourceMappingURL=StockerSetting.js.map