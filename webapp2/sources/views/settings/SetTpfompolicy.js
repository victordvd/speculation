"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var webix_jet_1 = require("webix-jet");
var SetTpfompolicyViewController_1 = require("../SetTpfompolicyViewController");
var SetTpfompolicy = /** @class */ (function (_super) {
    __extends(SetTpfompolicy, _super);
    function SetTpfompolicy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctrl = new SetTpfompolicyViewController_1.SetTpfompolicyViewController(_this);
        _this.init = _this.ctrl.init;
        return _this;
    }
    SetTpfompolicy.prototype.config = function () {
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
                        {
                            view: "button",
                            label: "Add Product",
                            type: "icon",
                            icon: "wxi-plus",
                            width: 120,
                            click: this.ctrl.onAddProdBtnClick,
                            hidden: true
                        },
                        {},
                        {
                            view: "multicombo",
                            id: SetTpfompolicy.viewIds.stepCombo,
                            label: "Step",
                            labelWidth: 50,
                            width: 260,
                            tagMode: false,
                            tagTemplate: function (values) {
                                return (values.length ? values.length + " step(s) selected" : "");
                            },
                            options: {
                                selectAll: true,
                                data: []
                            },
                            on: {
                                onChange: this.ctrl.onStepComboItemClick
                            }
                        },
                        {
                            view: "multicombo",
                            id: SetTpfompolicy.viewIds.prodCombo,
                            label: "Product",
                            labelWidth: 100,
                            width: 360,
                            tagMode: false,
                            tagTemplate: function (values) {
                                return (values.length ? values.length + " product(s) selected" : "");
                            },
                            options: {
                                selectAll: true,
                                data: []
                            },
                            on: {
                                onChange: this.ctrl.onProdComboItemClick
                            }
                        },
                        {}
                        // {//closed on 2019/9/5
                        //     view:"button",
                        //     label:"Save",
                        //     type:"icon",
                        // 	icon:"wxi-check",
                        //     width:80,
                        //     click:this.ctrl.onSaveBtnClick
                        // }
                    ]
                },
                {
                    view: "datatable",
                    id: SetTpfompolicy.viewIds.tpfomGrid,
                    leftSplit: 3,
                    // css: "rows",
                    css: "rows center",
                    resizeColumn: { headerOnly: true },
                    columns: SetTpfompolicy.staticCols
                }
            ]
        };
        return layout;
    };
    SetTpfompolicy.viewIds = {
        tpfomGrid: "tpfGrid",
        prodCombo: "prodCombo",
        stepCombo: "stepCombo"
    };
    SetTpfompolicy.staticCols = [
        { id: "OPERATION", header: "OPERATION", width: 110, sort: "string" },
        { id: "PROCESSOPERATIONNAME", header: "STEP ID", width: 90, sort: "string" },
        { id: "MACHINENAME", header: "EQP ID", width: 90, css: "machine", sort: "string" }
    ];
    return SetTpfompolicy;
}(webix_jet_1.JetView));
exports.default = SetTpfompolicy;
//# sourceMappingURL=SetTpfompolicy.js.map