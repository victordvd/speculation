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
var MonitorSpecViewController_1 = require("./MonitorSpecViewController"); /*匯入 view controller*/
/*
宣告 view class name
"extends JetView": 在運行時 webix jet 將會把這個 class 視為 view class
*/
var MonitorSpec = /** @class */ (function (_super) {
    __extends(MonitorSpec, _super);
    function MonitorSpec() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /*實例化 view controller*/
        _this.ctrl = new MonitorSpecViewController_1.default();
        /*在畫面初始化,所運行的程序*/
        _this.init = _this.ctrl.init;
        return _this;
    }
    MonitorSpec.prototype.config = function () {
        var _this = this;
        /*定義畫面元件*/
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
                            click: this.ctrl.onReloadBtnClick /*事件綁定至 view controller*/
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
                    view: "treetable",
                    id: MonitorSpec.viewIds.specGrid,
                    editable: true,
                    resizeColumn: { headerOnly: true },
                    /*表格欄位定義*/
                    columns: [
                        { id: "isSingleSetting", header: "Operation(☑:use default)", width: 200, sort: "string",
                            template: function (obj, common) {
                                /*
                                    set value into grid store and change row class
                                */
                                var onchange = "\n                                    var grid = $$('" + MonitorSpec.viewIds.specGrid + "');\n                                    var data =  grid.data.pull;\n\n                                    var id = this.getAttribute('id');\n                                    var prowid = Number(this.getAttribute('rowid'));\n                                    var checked = this.checked;\n\n                                    console.log('chk change:',checked,id,prowid);\n                                    \n                                    if(checked){\n                                        grid.removeRowCss(prowid,'monitor-disable');\n                                        grid.addRowCss(prowid,'monitor-enable');\n                                    }else{\n                                        grid.removeRowCss(prowid,'monitor-enable');\n                                        grid.addRowCss(prowid,'monitor-disable');\n                                    }\n\n                                    for(var rowid in data){\n                                        var row = data[rowid];\n\n                                        if(row.STEP_ID == id && row.SUB_STEP_ID == 'default'){\n\n                                            row.isSingleSetting  = (checked)?1:0;\n                                        }\n      \n                                        if(row.$parent == prowid){\n                                            if(checked){\n                                                grid.removeRowCss(rowid,'monitor-enable');\n                                                grid.addRowCss(rowid,'monitor-disable');\n                                            }else{\n                                                grid.removeRowCss(rowid,'monitor-disable');\n                                                grid.addRowCss(rowid,'monitor-enable');\n                                            }\n                                        }\n                                    }";
                                if (obj.isSingleSetting == null) {
                                    return common.treetable(obj, common) + '<span>' + obj.STEP_ID + '</span>';
                                }
                                else if (obj.STEP_ID === '%' || obj.hasNoSubSteps) {
                                    return common.treetable(obj, common) + "<span> " + obj.STEP_ID + "</span>";
                                }
                                else {
                                    if (obj.isSingleSetting == 1)
                                        return common.treetable(obj, common) + "<span> " + obj.STEP_ID + ("</span><input id=\"" + obj.STEP_ID + "\" rowid=\"" + obj.id + "\" onchange=\"" + onchange + "\" type=\"checkbox\" class=\"webix_tree_checkbox\" checked>");
                                    else
                                        return common.treetable(obj, common) + "<span> " + obj.STEP_ID + ("</span><input id=\"" + obj.STEP_ID + "\" rowid=\"" + obj.id + "\" onchange=\"" + onchange + "\" type=\"checkbox\" class=\"webix_tree_checkbox\">");
                                }
                            }
                        },
                        { id: "SUB_STEP_ID", header: "Next Operation", width: 150, sort: "string" },
                        { id: "L2", header: 'L2 Time(H)<span style="color:red">*</span>', width: 120, sort: "int", editor: "text",
                            /*輸入轉換*/
                            editParse: function (value) {
                                var v = Number(value);
                                if (Number.isNaN(v)) {
                                    return 1;
                                }
                                else {
                                    if (v > 200)
                                        return 200;
                                    else if (v < 1)
                                        return 1;
                                    else
                                        return Math.floor(v);
                                }
                            }
                        },
                        { id: "L3", header: 'L3 Time(H)<span style="color:red">*</span>', width: 120, sort: "int", editor: "text",
                            editParse: function (value) {
                                var v = Number(value);
                                if (Number.isNaN(v)) {
                                    return 1;
                                }
                                else {
                                    if (v > 200)
                                        return 200;
                                    else if (v < 1)
                                        return 1;
                                    else
                                        return Math.floor(v);
                                }
                            }
                        },
                        { id: "L2_CNT", header: 'L2 Monitor Count<span style="color:red">*</span>', width: 160, sort: "int", editor: "text",
                            editParse: function (value) {
                                var v = Number(value);
                                if (Number.isNaN(v)) {
                                    return 1;
                                }
                                else {
                                    if (v > 5)
                                        return 5;
                                    else if (v < 1)
                                        return 1;
                                    else
                                        return Math.floor(v);
                                }
                            }
                        },
                        { id: "L3_CNT", header: 'L3 Monitor Count<span style="color:red">*</span>', width: 160, sort: "int", editor: "text",
                            editParse: function (value) {
                                var v = Number(value);
                                if (Number.isNaN(v)) {
                                    return 1;
                                }
                                else {
                                    if (v > 5)
                                        return 5;
                                    else if (v < 1)
                                        return 1;
                                    else
                                        return Math.floor(v);
                                }
                            }
                        },
                        { id: "LAYER_NAME", header: "Description", width: 200, sort: "string", editor: "text" }
                    ],
                    /*驗證規則*/
                    rules: {
                        "L2": function (val) {
                            var grid = $$(MonitorSpec.viewIds.specGrid);
                            var editor = grid.getEditor();
                            if (!editor)
                                return true;
                            var row = grid.getEditor().row;
                            if (!row)
                                return true;
                            var end = grid.data.pull[row].L3;
                            MonitorSpec.isDataValid = val < end;
                            //added invalidation msg
                            if (!MonitorSpec.isDataValid) {
                                MonitorSpec.invalidItem[MonitorSpec.invalidType.l2GreaterThanL3] = MonitorSpec.invalidationMsg.l2GreaterThanL3;
                            }
                            else {
                                delete MonitorSpec.invalidItem[MonitorSpec.invalidType.l2GreaterThanL3];
                            }
                            //show validation msg
                            _this.ctrl.showValidationMsg();
                            return MonitorSpec.isDataValid;
                        },
                        "L3": function (val) {
                            // if(val==null || val == ''){
                            //     MonitorSpec.isDataValid = false
                            //     return MonitorSpec.isDataValid
                            // }
                            var grid = $$(MonitorSpec.viewIds.specGrid);
                            var editor = grid.getEditor();
                            if (!editor)
                                return true;
                            var row = editor.row;
                            if (!row)
                                return true;
                            var start = grid.data.pull[row].L2;
                            MonitorSpec.isDataValid = val > start;
                            return MonitorSpec.isDataValid;
                        }
                    },
                    on: {
                        /*編輯後,標記該 record 已變更*/
                        onAfterEditStop: function (state, editor, ignoreUpdate) {
                            var treeTb = $$(MonitorSpec.viewIds.specGrid);
                            var rec = treeTb.data.pull[editor.row];
                            //set change flag
                            rec.isChanged = true;
                        }
                    }
                }
                /*
                {
                    view:"datatable",
                    id:MonitorSpec.viewIds.specGrid,
                    editable:true,
                    dragColumn:true,
                    subrow:`test:<input type="number">`,
                    resizeColumn: { headerOnly: true },
                    columns:[
                        { id: "STEP_ID", header: "Operation",template:"{common.subrow()} #STEP_ID#", width: 100 ,sort:"string",editor:"select"},
                        { id: "SUB_STEP_ID", header: "Next Operation", width: 100 ,sort:"string",editor:"select"},
                        { id: "L2", header: "L2 Time", width: 90 ,sort:"int",editor:"text"},
                        { id: "L3", header: "L3 Time", width: 90 ,sort:"int",editor:"text"},
                        { id: "L2_CNT", header: "L2 Monitor Count", width: 160 ,sort:"int",editor:"text"},
                        { id: "L3_CNT", header: "L3 Monitor Count", width: 160 ,sort:"int",editor:"text"},
                        { id: "LAYER_NAME", header: "Description", width: 200 ,sort:"string",editor:"text"}
                    ]
                }*/
            ]
        };
        return layout;
    };
    /*定義元件 id*/
    MonitorSpec.viewIds = {
        specGrid: "specGrid"
    };
    /*驗證相關*/
    MonitorSpec.isDataValid = true;
    MonitorSpec.invalidType = {
        l2GreaterThanL3: 'l2GreaterThanL3'
    };
    MonitorSpec.invalidationMsg = {
        l2GreaterThanL3: 'L3必须大于L2'
    };
    MonitorSpec.invalidItem = {};
    return MonitorSpec;
}(webix_jet_1.JetView));
exports.default = MonitorSpec;
//# sourceMappingURL=MonitorSpec.js.map