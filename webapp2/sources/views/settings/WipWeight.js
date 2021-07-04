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
var WipWeightViewController_1 = require("./WipWeightViewController");
var EditorController_1 = require("../../controllers/EditorController");
var ComponentFactory_1 = require("../ComponentFactory");
var WipWeight = /** @class */ (function (_super) {
    __extends(WipWeight, _super);
    function WipWeight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctrl = new WipWeightViewController_1.default();
        _this.init = _this.ctrl.init;
        return _this;
    }
    WipWeight.prototype.config = function () {
        var _this = this;
        EditorController_1.default.initDateTimeEditor();
        var grpCombo = ComponentFactory_1.default.initGrpCombo(WipWeight.viewIds.grpCombo, this.ctrl.onGrpComboChange);
        var format = function (val) {
            return val.replace(/T/, ' ');
        };
        var weightEditParse = function (value) {
            var v = Number(value);
            if (Number.isNaN(v)) {
                return 0;
            }
            else {
                if (v > 100)
                    return 100;
                else if (v < 0)
                    return 0;
                else
                    return v;
            }
        };
        var layout = {
            rows: [
                {
                    paddingX: 10,
                    margin: 5,
                    borderless: true,
                    cols: [
                        grpCombo,
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
                            label: "Use default",
                            icon: "wxi-pencil",
                            type: "icon",
                            width: 120,
                            click: this.ctrl.onDefaultBtnClick
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
                    rows: [
                        {
                            view: "tabview",
                            // id: OverviewSchedule.viewIds.ganttTabview,
                            tabbar: {
                                height: 20,
                                optionWidth: 120,
                                on: {
                                // onChange:this.ctrl.onTabbarChange
                                }
                            },
                            cells: [
                                {
                                    header: "Standardized",
                                    cols: [
                                        {
                                            width: 30,
                                            rows: [
                                                {
                                                    view: "button",
                                                    icon: "wxi-plus",
                                                    type: "icon",
                                                    width: 30,
                                                    click: this.ctrl.onStAddBtnClick
                                                },
                                                {
                                                    view: "button",
                                                    icon: "wxi-minus",
                                                    type: "icon",
                                                    width: 30,
                                                    click: this.ctrl.onStDelBtnClick
                                                },
                                                {}
                                            ]
                                        },
                                        {
                                            view: "datatable",
                                            id: WipWeight.viewIds.stGrid,
                                            editable: true,
                                            dragColumn: true,
                                            resizeColumn: { headerOnly: true },
                                            select: "row",
                                            css: "rows",
                                            scroll: "y",
                                            columns: [
                                                // { id: "TOOLG_ID", header: ["Group"], width: 100 ,sort:"string"},
                                                { id: "PTY", header: ['Priority'], width: 80, sort: "string" /*,css:{"text-align":"left"}*/ },
                                                { id: "WEIGHTING", header: ['Weighting<span style="color:red">*</span>'], width: 100, sort: "string", editor: "text", editParse: weightEditParse },
                                                { id: "CREATE_DATE", header: ['Create Date'], width: 180, sort: "string", format: format }
                                                // { id: "LOT_ID", header: ['Lot ID'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "LOT_TYPE", header: ['Lot Type'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "RECIPE", header: ['Recipe<span style="color:red">*</span>'], width: 100 ,sort:"string"},
                                                // { id: "EFFECTIVE_TIME", header: ['Effective Time'], width: 250 ,sort:"string", format:format},
                                                // { id: "COMMAND", header: ['Command'], width: 200 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "PROD_ID", header: ['Product ID<span style="color:red">*</span>'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "LAYER", header: ['Layer'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "STAGE", header: ['Stage<span style="color:red">*</span>'], width: 100 ,sort:"string",editor:"text"},
                                                // { id: "ENTITY", header: ['Entity'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                            ],
                                            on: {
                                                onValidationError: function (id, obj, details) {
                                                    _this.ctrl.showValidationMsg();
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        { view: "resizer" },
                        {
                            view: "tabview",
                            // id: OverviewSchedule.viewIds.ganttTabview,
                            tabbar: {
                                height: 20,
                                optionWidth: 120,
                                on: {
                                // onChange:this.ctrl.onTabbarChange
                                }
                            },
                            cells: [
                                {
                                    header: "Customized",
                                    cols: [
                                        {
                                            width: 30,
                                            rows: [
                                                {
                                                    view: "button",
                                                    icon: "wxi-plus",
                                                    type: "icon",
                                                    width: 30,
                                                    click: this.ctrl.onCsAddBtnClick
                                                },
                                                {
                                                    view: "button",
                                                    icon: "wxi-minus",
                                                    type: "icon",
                                                    width: 30,
                                                    click: this.ctrl.onCsDelBtnClick
                                                },
                                                {}
                                            ]
                                        },
                                        {
                                            view: "datatable",
                                            id: WipWeight.viewIds.csGrid,
                                            editable: true,
                                            dragColumn: true,
                                            resizeColumn: { headerOnly: true },
                                            select: "row",
                                            css: "rows",
                                            scroll: "y",
                                            columns: [
                                                // { id: "TOOLG_ID", header: ["Group"], width: 100 ,sort:"string"},
                                                { id: "PROD_ID", header: ['Product ID<span style="color:blue">+</span>'], width: 160, sort: "string", editor: "text" },
                                                { id: "TARGET_STEP_ID", header: ['Step ID<span style="color:blue">+</span>'], width: 160, sort: "string", editor: "text" },
                                                { id: "LOT_ID", header: ['Lot ID<span style="color:blue">+</span>'], width: 160, sort: "string", editor: "text", css: { "text-align": "left" } },
                                                // { id: "PTY", header: ['Priority'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "LOT_TYPE", header: ['Lot Type'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "RECIPE", header: ['Recipe<span style="color:blue">+</span>'], width: 100 ,sort:"string",editor:"text"},
                                                { id: "WEIGHTING", header: ['Weighting<span style="color:red">*</span>'], width: 100, sort: "string", editor: "text", editParse: weightEditParse },
                                                // { id: "EFFECTIVE_TIME", header: ['Effective Time'], width: 200 ,sort:"string", format:format},
                                                // { id: "COMMAND", header: ['Command'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "LAYER", header: ['Layer'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                // { id: "STAGE", header: ['Stage<span style="color:red">*</span>'], width: 100 ,sort:"string",editor:"text"},
                                                // { id: "ENTITY", header: ['Entity'], width: 160 ,sort:"string",editor:"text",css:{"text-align":"left"}},
                                                { id: "CREATE_DATE", header: ['Create Date'], width: 200, sort: "string", format: format }
                                            ],
                                            rules: {
                                                "LOT_ID": function (value) {
                                                    var grid = $$(WipWeight.viewIds.csGrid);
                                                    var editor = grid.getEditor();
                                                    var step;
                                                    var prod;
                                                    if (editor) {
                                                        var row = grid.getEditor().row;
                                                        if (!row)
                                                            return true;
                                                        step = grid.data.pull[row].TARGET_STEP_ID;
                                                        prod = grid.data.pull[row].PROD_ID;
                                                    }
                                                    else {
                                                        var gridData = grid.serialize();
                                                        var rec = gridData[gridData.length - 1];
                                                        step = rec.TARGET_STEP_ID;
                                                        prod = rec.PROD_ID;
                                                    }
                                                    var isDataValid = (value || step || prod);
                                                    //added invalidation msg
                                                    if (!isDataValid) {
                                                        WipWeight.invalidItem[WipWeight.invalidType.atLeastOne] = WipWeight.invalidationMsg.atLeastOne;
                                                    }
                                                    else {
                                                        delete WipWeight.invalidItem[WipWeight.invalidType.atLeastOne];
                                                    }
                                                    WipWeight.checkIsValidate();
                                                    return isDataValid;
                                                },
                                                "TARGET_STEP_ID": function (value) {
                                                    var grid = $$(WipWeight.viewIds.csGrid);
                                                    var editor = grid.getEditor();
                                                    var lot;
                                                    var prod;
                                                    if (editor) {
                                                        var row = grid.getEditor().row;
                                                        if (!row)
                                                            return true;
                                                        lot = grid.data.pull[row].LOT_ID;
                                                        prod = grid.data.pull[row].PROD_ID;
                                                    }
                                                    else {
                                                        var gridData = grid.serialize();
                                                        var rec = gridData[gridData.length - 1];
                                                        lot = rec.LOT_ID;
                                                        prod = rec.PROD_ID;
                                                    }
                                                    var isDataValid = (value || lot || prod);
                                                    //added invalidation msg
                                                    if (!isDataValid) {
                                                        WipWeight.invalidItem[WipWeight.invalidType.atLeastOne] = WipWeight.invalidationMsg.atLeastOne;
                                                    }
                                                    else {
                                                        delete WipWeight.invalidItem[WipWeight.invalidType.atLeastOne];
                                                    }
                                                    WipWeight.checkIsValidate();
                                                    return isDataValid;
                                                },
                                                "PROD_ID": function (value) {
                                                    var grid = $$(WipWeight.viewIds.csGrid);
                                                    var editor = grid.getEditor();
                                                    var lot;
                                                    var step;
                                                    if (editor) {
                                                        var row = grid.getEditor().row;
                                                        if (!row)
                                                            return true;
                                                        step = grid.data.pull[row].TARGET_STEP_ID;
                                                        lot = grid.data.pull[row].LOT_ID;
                                                    }
                                                    else {
                                                        var gridData = grid.serialize();
                                                        var rec = gridData[gridData.length - 1];
                                                        lot = rec.LOT_ID;
                                                        step = rec.TARGET_STEP_ID;
                                                    }
                                                    var isDataValid = (value || step || lot);
                                                    //added invalidation msg
                                                    if (!isDataValid) {
                                                        WipWeight.invalidItem[WipWeight.invalidType.atLeastOne] = WipWeight.invalidationMsg.atLeastOne;
                                                    }
                                                    else {
                                                        delete WipWeight.invalidItem[WipWeight.invalidType.atLeastOne];
                                                    }
                                                    WipWeight.checkIsValidate();
                                                    return isDataValid;
                                                }
                                            },
                                            on: {
                                                onValidationError: function (id, obj, details) {
                                                    _this.ctrl.showValidationMsg();
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                    ]
                }
            ]
        };
        return layout;
    };
    WipWeight.viewIds = {
        stGrid: "stGrid",
        csGrid: "csGrid",
        grpCombo: "grpCombo"
    };
    WipWeight.isDataValid = true;
    WipWeight.invalidType = {
        // nullWeight:'nullWeight',
        atLeastOne: 'atLeastOne'
    };
    WipWeight.invalidationMsg = {
        // nullWeight:'"Weighting" 为必要项目',
        atLeastOne: '至少需要一个项目<br>("Step ID","Product ID","Lot ID")'
    };
    WipWeight.invalidItem = {};
    WipWeight.checkIsValidate = function () {
        if (Object.keys(WipWeight.invalidItem).length === 0) {
            WipWeight.isDataValid = true;
        }
        else {
            WipWeight.isDataValid = false;
        }
    };
    return WipWeight;
}(webix_jet_1.JetView));
exports.default = WipWeight;
//# sourceMappingURL=WipWeight.js.map