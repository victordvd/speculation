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
var MaskTransferViewController_1 = require("./MaskTransferViewController");
var GlobalStore_1 = require("../../store/GlobalStore");
var MaskTransfer = /** @class */ (function (_super) {
    __extends(MaskTransfer, _super);
    function MaskTransfer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctrl = new MaskTransferViewController_1.default();
        _this.init = _this.ctrl.init;
        return _this;
    }
    MaskTransfer.prototype.config = function () {
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
                        {},
                        {
                            view: "button",
                            id: MaskTransfer.viewId.saveBtn,
                            label: "Save",
                            type: "icon",
                            icon: "wxi-check",
                            width: 80,
                            click: this.ctrl.onSaveBtnClick
                        }
                    ]
                },
                {
                    view: "tabview",
                    id: MaskTransfer.viewId.maskTv,
                    tabbar: {
                        height: 20,
                        optionWidth: 120,
                        on: {
                            onChange: this.ctrl.onTabChange
                        }
                    },
                    cells: [
                        {
                            header: "Task",
                            id: MaskTransfer.viewId.maskTransTab,
                            body: {
                                view: "datatable",
                                id: MaskTransfer.viewId.maskTansGrid,
                                dragColumn: true,
                                resizeColumn: { headerOnly: true },
                                onClick: {
                                    "editor_checkbox": function (event, column, target) {
                                        var chkEl = target.firstChild;
                                        var val = chkEl.checked ? 1 : 0;
                                        var rowid = chkEl.getAttribute('rowid');
                                        var grid = $$(MaskTransfer.viewId.maskTansGrid);
                                        var data = grid.serialize();
                                        data.forEach(function (row, idx) {
                                            if (row.id == rowid) {
                                                data[idx].isChecked = val;
                                                data[idx].updateUser = GlobalStore_1.default.user;
                                                // data[idx]
                                                grid.refresh();
                                            }
                                        });
                                    }
                                },
                                columns: [
                                    // { id: "reticleOutputTime", header: "Version Time" ,width:160,sort:"string"},
                                    { id: "isChecked", header: "搬送确认", width: 90, css: { "text-align": "center" }, sort: "int", editor: "checkbox",
                                        template: function (obj) {
                                            // return "<input rowid='"+obj.id+"' class='editor_checkbox' type ='checkbox'"+(obj.isChecked?" checked":"")+(obj.savedChecked?" disabled":"")+"/>"; 
                                            // return `<input rowid='${obj.id}' class='editor_checkbox' type ='checkbox'${(obj.isChecked?" checked":"")}${(obj.savedChecked?" disabled":"")}/>`
                                            if (obj.isDone)
                                                return "done";
                                            return "<input rowid='" + obj.id + "' class='editor_checkbox' type ='checkbox' " + (obj.isChecked ? "checked" : "") + "/>";
                                        }
                                    },
                                    { id: "arrivalTime", header: "最后搬送有效时间", width: 160, sort: "string" },
                                    { id: "inEqpFrom", header: "来源设备", width: 130, sort: "string" },
                                    { id: "inMaskId", header: "输入光罩ID", width: 160, sort: "string" },
                                    { id: "inProdId", header: "对应产品ID", width: 160, sort: "string" },
                                    { id: "inEqpTo", header: "目标设备", width: 130, sort: "string" },
                                    { id: "outMaskId", header: "输出光罩ID", width: 160, sort: "string" },
                                    { id: "outEqpTo", header: "输出光罩目标设备", width: 150, sort: "string" },
                                    { id: "updateUser", header: "Update User", width: 150, sort: "string" }
                                ]
                            }
                        },
                        {
                            header: "History",
                            id: MaskTransfer.viewId.maskHistTab,
                            body: {
                                view: "datatable",
                                id: MaskTransfer.viewId.maskHistGrid,
                                dragColumn: true,
                                resizeColumn: { headerOnly: true },
                                css: "rows",
                                columns: [
                                    { id: "index", header: "", sort: "int", width: 50 },
                                    { id: "RETICLE_OUTPUT_TIME", header: ["Version Time", textFilter], width: 160, sort: "string",
                                        format: function (val) {
                                            if (val)
                                                return val.replace('T', ' ');
                                            else
                                                return val;
                                        }
                                    },
                                    { id: "CHECKED", header: ["搬送确认", textFilter], width: 90, sort: "string",
                                        format: function (val) {
                                            if (val == 'Y')
                                                return 'Yes';
                                            else if (val == 'N')
                                                return 'Cancel';
                                            else
                                                return 'No';
                                        }
                                    },
                                    { id: "UPDATE_TIME", header: ["Update Time", textFilter], width: 160, sort: "string",
                                        format: function (val) {
                                            if (val)
                                                return val.replace('T', ' ');
                                            else
                                                return val;
                                        }
                                    },
                                    { id: "ARRIVAL_TIME", header: ["最后搬送有效时间", textFilter], width: 160, sort: "string",
                                        format: function (val) {
                                            if (val)
                                                return val.replace('T', ' ');
                                            else
                                                return val;
                                        }
                                    },
                                    { id: "LOCATION_FROM", header: ["来源设备", textFilter], width: 130, sort: "string" },
                                    { id: "MASK_ID", header: ["输入光罩ID", textFilter], width: 160, sort: "string" },
                                    { id: "PRODUCT_ID", header: ["对应产品ID", textFilter], width: 160, sort: "string" },
                                    { id: "TOOL_ID", header: ["目标设备", textFilter], width: 130, sort: "string" },
                                    { id: "UPDATE_USER", header: ["Update User", textFilter], width: 130, sort: "string" },
                                    { id: "RETICLE_PARENTID", header: ["Version ID", textFilter], width: 200, sort: "string" }
                                ],
                                on: {
                                    "data->onStoreUpdated": function () {
                                        this.data.each(function (obj, i) {
                                            obj.index = i + 1;
                                        });
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        };
        return layout;
    };
    MaskTransfer.viewId = {
        saveBtn: "saveBtn",
        maskTv: "maskTv",
        maskTransTab: "maskTransTab",
        maskHistTab: "maskHistTab",
        maskTansGrid: "maskTansGrid",
        maskHistGrid: "maskHistGrid",
        idleAlart: "idleAlart"
    };
    return MaskTransfer;
}(webix_jet_1.JetView));
exports.default = MaskTransfer;
//# sourceMappingURL=MaskTransfer.js.map