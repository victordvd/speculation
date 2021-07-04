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
var OverviewScheduleViewController_1 = require("./OverviewScheduleViewController");
var OverviewSchedule = /** @class */ (function (_super) {
    __extends(OverviewSchedule, _super);
    function OverviewSchedule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctrl = new OverviewScheduleViewController_1.default(_this);
        _this.init = _this.ctrl.init;
        return _this;
    }
    OverviewSchedule.prototype.config = function () {
        // let textFilter = { content: "textFilter" }
        var photoRows = [
            {
                cols: [
                    {
                        view: "richselect",
                        id: OverviewSchedule.viewIds.timeCombo,
                        label: "TIME",
                        labelWidth: 55,
                        width: 350,
                        options: [],
                        // height:60,
                        // css:"multi-line-combo",
                        // inputHeight:60,
                        // options:{
                        //     body:{
                        //         view:"list",
                        //         type:{ height:60}
                        //     }
                        // },
                        on: {
                            "onChange": this.ctrl.onTimeComboChange
                        }
                    },
                    {
                        view: "slider",
                        id: OverviewSchedule.viewIds.ganttSlider,
                        label: "Hour Count",
                        labelWidth: 100,
                        width: 250,
                        value: 1,
                        // step:0.5,
                        // min:0.5, 
                        min: 1,
                        max: 24,
                        title: function (obj) { return obj.value; },
                        on: {
                            onChange: this.ctrl.onSliderChange
                        }
                    },
                    {
                        view: "checkbox",
                        id: OverviewSchedule.viewIds.lotChk,
                        labelWidth: 120,
                        width: 150,
                        label: "Show Prod. Info.",
                        value: 1,
                        on: {
                            'onChange': this.ctrl.onCheckboxChange
                        }
                    },
                    {},
                    {
                        view: "button",
                        id: OverviewSchedule.viewIds.syncBtn,
                        width: 300,
                        type: "icon",
                        icon: "wxi-sync",
                        click: this.ctrl.onSyncBtnClick
                    },
                    // { view: "switch", value: 1 },//, label:"Light"
                    {
                        view: "button",
                        id: OverviewSchedule.viewIds.hintBtn,
                        label: "?",
                        width: 30,
                        css: "questionmark",
                        tooltip: "色彩说明",
                        click: this.ctrl.onhintBtnClick
                        // type:"icon",
                        // icon:"question"
                    }
                ]
            },
            /*
            {
                height:23,
                cols:[
                    {
                        view: "button",
                        width:120,
                        label:"Overview",
                        click:this.ctrl.onOverviewBtnClick
                    },
                    {
                        view: "button",
                        width:120,
                        label:"JC comparison",
                        click:this.ctrl.onJCcompBtnClick
                    }
                ]
            },
            {
                view: "dhx-gantt",
                id:AllGantt.viewIds.lotGantt
            } */
            {
                view: "tabview",
                id: OverviewSchedule.viewIds.ganttTabview,
                tabbar: {
                    height: 20,
                    optionWidth: 120,
                    on: {
                        onChange: this.ctrl.onTabbarChange
                    }
                },
                cells: [
                    {
                        header: "Overview",
                        id: OverviewSchedule.viewIds.overallTab,
                        rows: [] //essencial!!
                    },
                    {
                        header: "JC comparasion",
                        id: OverviewSchedule.viewIds.jcTab,
                        rows: [] //essencial!!
                    }
                ]
            }
        ];
        //tmp
        var tmpView = {
            id: "dataView",
            rows: photoRows
        };
        return tmpView;
    };
    OverviewSchedule.viewIds = {
        timeCombo: "timeCombo",
        syncBtn: "syncBtn",
        lotGantt: "lotGantt",
        jcGantt: "jcGantt",
        ganttTabview: "ganttTabview",
        overallTab: "overallTab",
        jcTab: "jcTab",
        ganttSlider: "ganttSlider",
        lotChk: "lotChk",
        hintBtn: "hintBtn",
        hintWin: "hintWin"
    };
    return OverviewSchedule;
}(webix_jet_1.JetView));
exports.default = OverviewSchedule;
//# sourceMappingURL=OverviewSchedule.js.map