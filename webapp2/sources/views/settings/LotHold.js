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
var LotHoldViewController_1 = require("./LotHoldViewController");
var EditorController_1 = require("../../controllers/EditorController");
var LotHold = /** @class */ (function (_super) {
    __extends(LotHold, _super);
    function LotHold() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctrl = new LotHoldViewController_1.default();
        _this.init = _this.ctrl.init;
        return _this;
    }
    LotHold.prototype.config = function () {
        var _this = this;
        EditorController_1.default.initDateTimeEditor();
        var format = function (val) {
            return val.replace(/T/, ' ');
        };
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
                            label: "Add",
                            icon: "wxi-plus",
                            type: "icon",
                            width: 100,
                            click: this.ctrl.onAddBtnClick
                        },
                        {
                            view: "button",
                            label: "Remove",
                            icon: "wxi-minus",
                            type: "icon",
                            width: 100,
                            click: this.ctrl.onDelBtnClick
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
                    id: LotHold.viewIds.lotHoldGrid,
                    editable: true,
                    dragColumn: true,
                    resizeColumn: { headerOnly: true },
                    select: "row",
                    css: "rows",
                    columns: [
                        // { id: "TOOLG_ID", header: ["TOOLG_ID"], width: 100 ,sort:"string"},
                        // { id: "CH_ID", header: ["CH_ID"], width: 100 ,sort:"string"},
                        { id: "TOOL_ID", header: ['EQP ID<span style="color:red">*</span>'], width: 100, sort: "string", editor: "richselect" },
                        { id: "PROD_ID", header: ['Product ID<span style="color:red">*</span>'], width: 160, sort: "string", editor: "text", css: { "text-align": "left" } },
                        { id: "TARGET_STEP_ID", header: ['Step ID<span style="color:red">*</span>'], width: 160, sort: "string", editor: "text", css: { "text-align": "left" },
                        },
                        { id: "LOT_ID", header: ['Lot ID'], width: 160, sort: "string", editor: "text", css: { "text-align": "left" } },
                        { id: "START_TIME", header: ['Start Time<span style="color:red">*</span>'], width: 250, sort: "string", format: format, editor: "datetime" },
                        { id: "END_TIME", header: ['End Time<span style="color:red">*</span>'], width: 250, sort: "string", format: format, editor: "datetime" }
                        // { id: "PTY", header: ["PTY"], width: 80 ,sort:"string"},
                        // { id: "LOT_TYPE", header: ["LOT_TYPE"], width: 80 ,sort:"string"},
                        // { id: "RECIPE", header: ["RECIPE"], width: 80 ,sort:"string"},
                        // { id: "PPID", header: ["PPID"], width: 80 ,sort:"string"},
                        // { id: "ACTION", header: ["ACTION"], width: 80 ,sort:"string"},
                        // { id: "PLAN_ID", header: ["PLAN_ID"], width: 80 ,sort:"string"},
                        // { id: "CREATE_DATE", header: ["CREATE_DATE"], width: 80 ,sort:"string"},
                        // { id: "COMMAND", header: ["COMMAND"], width: 80 ,sort:"string"}
                    ],
                    rules: {
                        /*
                        "LOT_ID":(value)=>{
                            let isDataValid = (value != null && value != '')

                             //added invalidation msg
                             if(!isDataValid){
                                LotHold.invalidItem[LotHold.invalidType.nullLot] = LotHold.invalidationMsg.nullLot
                            }else{
                                delete LotHold.invalidItem[LotHold.invalidType.nullLot]
                            }
                            LotHold.checkIsValidate()

                           return isDataValid
                        },*/
                        "TARGET_STEP_ID": function (value) {
                            var isDataValid = (value != null && value != '');
                            //added invalidation msg
                            if (!isDataValid) {
                                LotHold.invalidItem[LotHold.invalidType.nullStep] = LotHold.invalidationMsg.nullStep;
                            }
                            else {
                                delete LotHold.invalidItem[LotHold.invalidType.nullStep];
                            }
                            LotHold.checkIsValidate();
                            return isDataValid;
                        },
                        "PROD_ID": function (value) {
                            var isDataValid = (value != null && value != '');
                            //added invalidation msg
                            if (!isDataValid) {
                                LotHold.invalidItem[LotHold.invalidType.nullProd] = LotHold.invalidationMsg.nullProd;
                            }
                            else {
                                delete LotHold.invalidItem[LotHold.invalidType.nullProd];
                            }
                            LotHold.checkIsValidate();
                            return isDataValid;
                        },
                        "START_TIME": function (val) {
                            if (val == null || val == '') {
                                LotHold.isDataValid = false;
                                return LotHold.isDataValid;
                            }
                            var grid = $$(LotHold.viewIds.lotHoldGrid);
                            var editor = grid.getEditor();
                            if (!editor)
                                return true;
                            var row = grid.getEditor().row;
                            if (!row)
                                return true;
                            var end = grid.data.pull[row].END_TIME;
                            var sDate = new Date(val);
                            var eDate = new Date(end);
                            var isDataValid = true;
                            //added invalidation msg
                            if (val > end) {
                                isDataValid = false;
                                LotHold.invalidItem[LotHold.invalidType.stDateGreaterThanEdDate] = LotHold.invalidationMsg.stDateGreaterThanEdDate;
                            }
                            else if (eDate.getTime() - sDate.getTime() >= 24 * 60 * 60 * 1000) {
                                isDataValid = false;
                                LotHold.invalidItem[LotHold.invalidType.overOneDay] = LotHold.invalidationMsg.overOneDay;
                            }
                            else {
                                delete LotHold.invalidItem[LotHold.invalidType.stDateGreaterThanEdDate];
                                delete LotHold.invalidItem[LotHold.invalidType.overOneDay];
                            }
                            LotHold.checkIsValidate();
                            return isDataValid;
                        },
                        "END_TIME": function (val) {
                            if (val == null || val == '') {
                                LotHold.isDataValid = false;
                                return LotHold.isDataValid;
                            }
                            var grid = $$(LotHold.viewIds.lotHoldGrid);
                            var editor = grid.getEditor();
                            if (!editor)
                                return true;
                            var row = editor.row;
                            if (!row)
                                return true;
                            var start = grid.data.pull[row].START_TIME;
                            var sDate = new Date(start);
                            var eDate = new Date(val);
                            var isDataValid = true;
                            if (val < start) {
                                isDataValid = false;
                            }
                            else if (eDate.getTime() - sDate.getTime() > 24 * 60 * 60 * 1000) {
                                isDataValid = false;
                            }
                            LotHold.checkIsValidate();
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
        };
        return layout;
    };
    LotHold.viewIds = {
        lotHoldGrid: "lotHoldGrid"
    };
    LotHold.isDataValid = true;
    LotHold.invalidType = {
        stDateGreaterThanEdDate: 'stDateGreaterThanEdDate',
        nullProd: 'nullProd',
        nullStep: 'nullStep',
        overOneDay: 'overOneDay'
    };
    LotHold.invalidationMsg = {
        nullProd: '"Product ID" 为必要项目',
        nullStep: '"Step ID" 为必要项目',
        stDateGreaterThanEdDate: '"End Time" 必须大于 "Start Time"',
        overOneDay: '时间的间隔不能超过一天'
    };
    LotHold.invalidItem = {};
    LotHold.checkIsValidate = function () {
        if (Object.keys(LotHold.invalidItem).length === 0) {
            LotHold.isDataValid = true;
        }
        else {
            LotHold.isDataValid = false;
        }
    };
    return LotHold;
}(webix_jet_1.JetView));
exports.default = LotHold;
//# sourceMappingURL=LotHold.js.map