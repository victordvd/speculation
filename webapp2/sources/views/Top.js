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
var TopViewController_1 = require("./TopViewController");
var Top = /** @class */ (function (_super) {
    __extends(Top, _super);
    function Top() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctrl = new TopViewController_1.default(_this);
        // init = this.ctrl.init
        // init(){
        // 	//enable menu item href
        // 	// this.use(plugins.Menu, Top.viewIds.appMenu)
        // 	//check version
        // 	vCtrl.triggerOptOutputInterval()
        // }
        _this.init = _this.ctrl.init;
        return _this;
    }
    Top.prototype.config = function () {
        // const _ = this.app.getService("locale")._
        var _ = function (val) { return val; };
        var menu = {
            view: "menu",
            id: Top.viewIds.appMenu,
            subMenuPos: "right",
            css: "app_menu",
            width: 200,
            layout: "y",
            submenuConfig: {
                width: 200
            },
            select: true,
            template: function (obj) {
                return "<span class='webix_icon " + obj.icon + "'></span> " + _(obj.value);
            },
            data: Top.menuItems_l,
            on: {
                onMenuItemClick: this.ctrl.onMenuItemClick
            },
            type: {
                subsign: true
            }
        };
        var ui = {
            id: Top.viewIds.topView,
            type: "accordion",
            paddingX: 5,
            css: "app_layout",
            rows: [
                // {height:90},
                {
                    cols: [
                        {
                            header: "u-Scheduling" + environment,
                            // css:{"background-color": "#EBEDF0"},
                            body: {
                                // paddingX:5,
                                // paddingY:10, 
                                rows: [
                                    {
                                        css: "webix_shadow_medium",
                                        rows: [
                                            menu,
                                            {
                                                view: "switch",
                                                id: Top.viewIds.maskSwi,
                                                labelWidth: 120,
                                                label: "Mask Alarm",
                                                value: 1
                                                // click:this.ctrl.onMaskSwitchChange
                                            },
                                            {
                                                view: "button",
                                                label: "Log out",
                                                click: this.ctrl.onLogoutBtnClick
                                            },
                                            {
                                                view: "label",
                                                label: version,
                                                height: 20,
                                                css: { "font-size": "8px", "text-align": "center" } //,"background-color": "#EBEDF0" cant override parent css
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            type: "wide",
                            id: Top.viewIds.topWide,
                            paddingY: 10,
                            paddingX: 5,
                            rows: [
                                {
                                    $subview: true,
                                    id: Top.viewIds.subView
                                },
                                {
                                    id: Top.viewIds.updBar,
                                    borderless: true,
                                    paddingX: 5,
                                    cols: [
                                        {
                                            view: "label",
                                            id: Top.viewIds.curUserLab,
                                            label: "Current User:",
                                            width: 270,
                                            height: 20,
                                            borderless: true
                                        },
                                        {},
                                        {
                                            view: "label",
                                            id: Top.viewIds.nameLab,
                                            // label:"Name:",
                                            width: 270,
                                            height: 20,
                                            borderless: true
                                        },
                                        {
                                            view: "label",
                                            id: Top.viewIds.updUserLab,
                                            label: "Update User:",
                                            width: 270,
                                            height: 20,
                                            borderless: true
                                        },
                                        {
                                            view: "label",
                                            id: Top.viewIds.updTimeLab,
                                            label: "Update Time:",
                                            width: 270,
                                            height: 20,
                                            borderless: true
                                            // align:"right"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        return ui;
    };
    Top.viewIds = {
        topView: "topView",
        appMenu: "appMenu",
        updBar: "updBar",
        curUserLab: "curUserLab",
        updUserLab: "updUserLab",
        updTimeLab: "updTimeLab",
        nameLab: "nameLab",
        maskSwi: "maskSwi",
        topWide: "topWide",
        subView: "subView"
    };
    Top.ViewNames = {
        Login: "Login",
        OverviewSchedule: "OverviewSchedule",
        MaskTransfer: "settings.MaskTransfer",
        MatchRate: "settings.MatchRate"
    };
    Top.menuItems_l = [
        // { value:`<span style="color:darkturquoise">u-Scheduling Result(all)</span>`, id:"AllGroupGantt", icon:"wxi-columns"},
        // { value:`<span style="color:darkturquoise">Schedule (overview)</span>`, id:Top.ViewNames.OverviewSchedule, icon:"wxi-columns"},
        { value: "<span style=\"color:darkturquoise\">Schedule</span>", id: "Result", icon: "wxi-columns" },
        // { $template:"Separator" },
        // { value:"Job Change", id:"JobChange",  icon:"wxi-columns" },
        // { value:"Schedule Backup", id:"DspBackup",  icon:"wxi-columns" },
        // { value:"Machine Capacity", id:"SetTpfompolicy", icon:"wxi-columns" },
        // { value:"Mask Transfer", id:Top.ViewNames.MaskTransfer, icon:"wxi-pencil" },
        // { value:"拉货清单", id:"OptReserve", icon:"wxi-columns" },
        // { $template:"Separator" },
        // { value:"Settings", id:"setting", icon:"wxi-pencil" ,submenu:[
        // 	{ value:"Machine Group", id:"settings.MachineGroup", icon:"wxi-pencil" },
        // 	{ value:"Stocker Transport", id:"settings.StockerSetting", icon:"wxi-pencil" },
        // 	{ value:"Down 机回线", id:"settings.MachineDown", icon:"wxi-pencil" },
        // 	{ value:"Monitor Spec.", id:"settings.MonitorSpec", icon:"wxi-pencil" },
        // 	{ value:"Lot Hold", id:"settings.LotHold", icon:"wxi-pencil" },
        // 	{ value:"WIP Weight", id:"settings.WipWeight", icon:"wxi-pencil" },
        // 	{ value:"Q-Time", id:"settings.Qtime", icon:"wxi-pencil" },
        // 	{ value:"Match Rate", id:Top.ViewNames.MatchRate, icon:"wxi-pencil" }
        // ]},
        { $template: "Separator" }
    ];
    Top.menuItems_h = [
        { value: "<span style=\"color:darkturquoise\">Schedule (overview)</span>", id: Top.ViewNames.OverviewSchedule, icon: "wxi-columns" },
        { value: "<span style=\"color:darkturquoise\">Schedule (by group)</span>", id: "Result", icon: "wxi-columns" },
        { $template: "Separator" },
        { value: "Job Change", id: "JobChange", icon: "wxi-columns" },
        { value: "Schedule Backup", id: "DspBackup", icon: "wxi-columns" },
        { value: "Machine Capacity", id: "SetTpfompolicy", icon: "wxi-columns" },
        { value: "Mask Transfer", id: Top.ViewNames.MaskTransfer, icon: "wxi-pencil" },
        { value: "拉货清单", id: "OptReserve", icon: "wxi-columns" },
        { $template: "Separator" },
        { value: "Settings", id: "setting", icon: "wxi-drag", submenu: [
                { value: "Set System", id: "settings.SetSystem", icon: "wxi-pencil" },
                { value: "Machine Group", id: "settings.MachineGroup", icon: "wxi-pencil" },
                { value: "Stocker Transport", id: "settings.StockerSetting", icon: "wxi-pencil" },
                { value: "Down 机回线", id: "settings.MachineDown", icon: "wxi-pencil" },
                { value: "Monitor Spec.", id: "settings.MonitorSpec", icon: "wxi-pencil" },
                { value: "Lot Hold", id: "settings.LotHold", icon: "wxi-pencil" },
                { value: "WIP Weight", id: "settings.WipWeight", icon: "wxi-pencil" },
                { value: "Q-Time", id: "settings.Qtime", icon: "wxi-pencil" },
                { value: "Match Rate", id: Top.ViewNames.MatchRate, icon: "wxi-pencil" }
            ]
        },
        { $template: "Separator" }
    ];
    return Top;
}(webix_jet_1.JetView));
exports.default = Top;
//# sourceMappingURL=Top.js.map