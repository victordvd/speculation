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
var webix_jet_1 = require("webix-jet"); /*匯入 webix JetView*/
var QtimeViewController_1 = require("./QtimeViewController"); /*匯入 view controller*/
/*
宣告 view class name
"extends JetView": 在運行時 webix jet 將會把這個 class 視為 view class
*/
var Qtime = /** @class */ (function (_super) {
    __extends(Qtime, _super);
    function Qtime() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctrl = new QtimeViewController_1.default();
        _this.init = _this.ctrl.init;
        return _this;
    }
    Qtime.prototype.config = function () {
        var _this = this;
        var textFilter = { content: "textFilter" };
        //remove space
        var strEditParse = function (value) {
            if (value)
                return value.trim();
            return value;
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
                    id: Qtime.viewIds.qTimeGrid,
                    editable: true,
                    dragColumn: true,
                    resizeColumn: { headerOnly: true },
                    select: "row",
                    css: "rows",
                    columns: [
                        { id: "index", header: "", sort: "int", width: 50 },
                        { id: "PRODUCTID", header: ['Product ID<span style="color:red">*</span>', textFilter], width: 140, sort: "string", editor: "text", editParse: strEditParse },
                        { id: "FROMSTEP", header: ['Step-From<span style="color:red">*</span>', textFilter], width: 120, sort: "string", editor: "text", editParse: strEditParse },
                        { id: "TOSTEP", header: ['Step-To<span style="color:red">*</span>', textFilter], width: 120, sort: "string", editor: "text", editParse: strEditParse },
                        { id: "MAXQUEUETIME", header: ['Max Queue Time(H)<span style="color:red">*</span>', textFilter], width: 180, sort: "int", editor: "text", css: { 'text-align': 'right' },
                            editParse: function (value) {
                                var v = Number(value);
                                if (Number.isNaN(v)) {
                                    return 0;
                                }
                                else {
                                    if (v < 0)
                                        return 0;
                                    else if (v >= 100)
                                        return 99.99;
                                    else
                                        return v;
                                }
                            }
                        }
                    ],
                    // scheme:{
                    //     $init:function(obj){ obj.index = this.count(); }
                    // },
                    rules: {
                        "PRODUCTID": function (value) {
                            var isDataValid = (value != null && value != '');
                            //added invalidation msg
                            if (!isDataValid) {
                                Qtime.invalidItem[Qtime.invalidType.nullProd] = Qtime.invalidType.nullProd;
                            }
                            else {
                                delete Qtime.invalidItem[Qtime.invalidType.nullProd];
                            }
                            Qtime.checkIsValidate();
                            return isDataValid;
                        },
                        "FROMSTEP": function (value) {
                            var isDataValid = (value != null && value != '');
                            //added invalidation msg
                            if (!isDataValid) {
                                Qtime.invalidItem[Qtime.invalidType.nullFrom] = Qtime.invalidType.nullFrom;
                            }
                            else {
                                delete Qtime.invalidItem[Qtime.invalidType.nullFrom];
                            }
                            Qtime.checkIsValidate();
                            return isDataValid;
                        },
                        "TOSTEP": function (value) {
                            var isDataValid = (value != null && value != '');
                            //added invalidation msg
                            if (!isDataValid) {
                                Qtime.invalidItem[Qtime.invalidType.nullTo] = Qtime.invalidType.nullTo;
                            }
                            else {
                                delete Qtime.invalidItem[Qtime.invalidType.nullTo];
                            }
                            Qtime.checkIsValidate();
                            return isDataValid;
                        }
                    },
                    on: {
                        onValidationError: function (id, obj, details) {
                            _this.ctrl.showValidationMsg();
                        },
                        "data->onStoreUpdated": function () {
                            this.data.each(function (obj, i) {
                                obj.index = i + 1;
                            });
                        }
                    }
                }
            ]
        };
        return layout;
    };
    Qtime.viewIds = {
        qTimeGrid: 'qTimeGrid'
    };
    Qtime.isDataValid = true;
    Qtime.invalidType = {
        nullProd: 'nullProd',
        nullFrom: 'nullFrom',
        nullTo: 'nullTo',
        nullQtime: 'nullQtime'
    };
    Qtime.invalidationMsg = {
        nullProd: '"Product ID" 为必要项目',
        nullFrom: '"Step-From" 为必要项目',
        nullTo: '"Step-To" 为必要项目',
        nullQtime: '"Max Queue" 为必要项目'
    };
    Qtime.invalidItem = {};
    Qtime.checkIsValidate = function () {
        if (Object.keys(Qtime.invalidItem).length === 0) {
            Qtime.isDataValid = true;
        }
        else {
            Qtime.isDataValid = false;
        }
    };
    return Qtime;
}(webix_jet_1.JetView));
exports.default = Qtime;
//# sourceMappingURL=Qtime.js.map