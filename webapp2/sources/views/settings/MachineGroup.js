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
var MachineGroupViewController_1 = require("./MachineGroupViewController");
//import {MachineGroupp as proxy} from "../models/MachineGroupModel"
var MachineGroup = /** @class */ (function (_super) {
    __extends(MachineGroup, _super);
    function MachineGroup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctrl = new MachineGroupViewController_1.MachineGroupViewController(_this);
        _this.init = _this.ctrl.init;
        return _this;
    }
    MachineGroup.prototype.config = function () {
        var machinedata = {
            view: "datatable",
            id: MachineGroup.viewIds.machineTable,
            // dragColumn:true,//incurred combobox disabled
            resizeColumn: { headerOnly: true },
            autoConfig: true,
            editable: true,
            css: "rows",
            select: "row",
            //multiselect: true,
            columns: [
                { id: "num", header: [""], css: "rowheader", width: 40 },
                //{ id: "fac", header: ["Factory"] },
                { id: "machine", header: ["EQP ID"], sort: "string", width: 100, css: "machine" },
                { id: "group", header: ["GROUP ID"], sort: "string", editor: "select", width: 100, template: function (obj) { return obj.group; } }
            ],
            on: {
                //顯示編號，每次排序後都會重新賦值numB
                "data->onStoreUpdated": this.ctrl.onSortMachine
            },
            // rules:{
            //     //machine:this.ctrl.notEmpty,
            //     machine:this.ctrl.checkMachine
            // },
            ready: function () {
                this.validate();
            }
        };
        var layout = {
            id: MachineGroup.viewIds.machineLayout,
            rows: [
                {
                    margin: 10,
                    cols: [
                        {
                            id: MachineGroup.viewIds.grpCombo,
                            view: "richselect",
                            label: "MODULE",
                            width: 180,
                            value: 1,
                            options: [],
                            on: {
                                "onChange": this.ctrl.loadData
                            }
                        },
                        {
                            id: MachineGroup.viewIds.reloadButton,
                            view: "button",
                            label: "Reload",
                            width: 80,
                            type: "icon",
                            icon: "wxi-sync",
                            click: this.ctrl.onLoadBtnClick
                        },
                        {},
                        /*{
                            id:MachineGroupView.viewIds.editButton,
                            view:"button",
                            label:"Edit",
                            value:"edit",
                            width:100,
                            click:this.ctrl.onEditBtnClick
                        },*/
                        {
                            id: MachineGroup.viewIds.addButton,
                            view: "button",
                            label: "Add",
                            value: "add",
                            icon: "wxi-plus",
                            type: "icon",
                            hidden: true,
                            width: 80,
                            click: this.ctrl.onAddBtnClick
                        },
                        {
                            id: MachineGroup.viewIds.delButton,
                            view: "button",
                            label: "Delete",
                            value: "delete",
                            icon: "wxi-minus",
                            type: "icon",
                            hidden: true,
                            width: 80,
                            click: this.ctrl.onDelBtnClick
                        },
                        {},
                        {
                            id: MachineGroup.viewIds.saveButton,
                            view: "button",
                            label: "Save",
                            value: "save",
                            type: "icon",
                            icon: "wxi-check",
                            //hidden: true,
                            width: 80,
                            click: this.ctrl.onSaveBtnClick
                        }
                    ]
                }, machinedata
            ]
        };
        return layout;
    };
    MachineGroup.viewIds = {
        machineLayout: "machineLayout",
        grpCombo: "grpCombo",
        machineTable: "machineTable",
        editButton: "editButton",
        saveButton: "saveButton",
        reloadButton: "reloadButton",
        addButton: "addButton",
        delButton: "delButton",
        uptLabel: "uptLabel"
    };
    return MachineGroup;
}(webix_jet_1.JetView));
exports.default = MachineGroup;
//# sourceMappingURL=MachineGroup.js.map