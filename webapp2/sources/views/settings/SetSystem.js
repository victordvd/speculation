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
var SetSystemViewController_1 = require("./SetSystemViewController");
var ComponentFactory_1 = require("../ComponentFactory");
var SetSystem = /** @class */ (function (_super) {
    __extends(SetSystem, _super);
    function SetSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctrl = new SetSystemViewController_1.SetSysViewController(_this);
        _this.init = _this.ctrl.init;
        return _this;
    }
    SetSystem.prototype.config = function () {
        /*
                webix.editors['transform'] = {
                    focus:function(){
                        this.getInputNode(this.node).focus();
                        this.getInputNode(this.node).select();
                    },
                    getValue:function(){
                        return this.getInputNode(this.node).value;
                    },
                    setValue:function(value){
                        this.getInputNode(this.node).value = value;
                    },
                    getInputNode:function(){
                        return this.node.firstChild;
                    },
                    render:function(){
        
                        console.log('trans')
        
                        return webix.html.create("div", {
                            "class":"webix_dt_editor"
                        }, "<input type='text'>");
                    }
                }*/
        var treetab = {
            view: "treetable",
            id: SetSystem.viewIds.treeTab,
            editable: true,
            dragColumn: true,
            resizeColumn: { headerOnly: true },
            //filter all node
            filterMode: {
                level: 1
            },
            columns: [
                { id: "TEXT", header: "Property", width: 400, template: "{common.treetable()} #TEXT#" },
                {
                    id: "PROPERTYVALUE",
                    header: "Value",
                    width: 150,
                    editor: "inline-text",
                    // editor:"transform",
                    // liveEdit:true,
                    template: function (obj) {
                        //customize editor
                        //set value to grid store
                        var onchange = "console.log('chg:',this.value,this);\n\t\t\t\t\t\tthis.setAttribute('value', this.value);\n\t\t\t\t\t\tvar grid = $$('" + SetSystem.viewIds.treeTab + "');\n\t\t\t\t\t\tfor(var i in grid.data.pull){\n\t\t\t\t\t\t\tvar row = grid.data.pull[i];\n\t\t\t\t\t\t\tif(row.PROPERTYNO === this.getAttribute('id')){\n\t\t\t\t\t\t\t\trow.PROPERTYVALUE = this.value; \n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}";
                        var onkeyup = "console.log('onkeyup')\n\n\t\t\t\t\t\tlet el = arguments[0].target\n\t\t\t\t\t\tlet type = el.getAttribute('type')\n\t\t\t\t\t\tlet oldVal = el.getAttribute('value')\n\n\t\t\t\t\t\tif(type==='number'){\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\tif(el.value === ''){\n\t\t\t\t\t\t\t\tel.value = oldVal\n\t\t\t\t\t\t\t\twebix.message({\n\t\t\t\t\t\t\t\t\ttype:'error',\n\t\t\t\t\t\t\t\t\ttext:'\u503C\u5FC5\u987B\u4ECB\u4E8E '+min+' ~ '+max\n\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t}else{\n\t\t\t\t\t\t\t\tlet val = Number(el.value)\n\t\t\t\t\t\t\t\tlet maxTxt = el.getAttribute('max')\n\t\t\t\t\t\t\t\tlet minTxt = el.getAttribute('min')\n\t\t\t\t\t\t\t\tlet max = Number(el.getAttribute('max'))\n\t\t\t\t\t\t\t\tlet min = Number(el.getAttribute('min'))\n\n\t\t\t\t\t\t\t\tif(maxTxt && minTxt){\n\t\t\t\t\t\t\t\t\tif(val>max){\n\t\t\t\t\t\t\t\t\t\tel.value = max\n\t\t\t\t\t\t\t\t\t\twebix.message({\n\t\t\t\t\t\t\t\t\t\t\ttype:'error',\n\t\t\t\t\t\t\t\t\t\t\ttext:'\u503C\u5FC5\u987B\u4ECB\u4E8E '+min+' ~ '+max\n\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\tif(val<min){\n\t\t\t\t\t\t\t\t\t\tel.value = min\n\t\t\t\t\t\t\t\t\t\twebix.message({\n\t\t\t\t\t\t\t\t\t\ttype:'error',\n\t\t\t\t\t\t\t\t\t\ttext:'\u503C\u5FC5\u987B\u4ECB\u4E8E '+min+' ~ '+max\n\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t}else if(minTxt && val<min){\n\t\t\t\t\t\t\t\t\tel.value = min\n\t\t\t\t\t\t\t\t\twebix.message({\n\t\t\t\t\t\t\t\t\ttype:'error',\n\t\t\t\t\t\t\t\t\ttext:'\u503C\u5FC5\u987B\u5C0F\u4E8E '+min\n\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t}else if(maxTxt && val>max){\n\t\t\t\t\t\t\t\t\tel.value = max\n\t\t\t\t\t\t\t\t\twebix.message({\n\t\t\t\t\t\t\t\t\ttype:'error',\n\t\t\t\t\t\t\t\t\ttext:'\u503C\u5FC5\u987B\u5927\u65BC\u4E8E '+max\n\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t}\t\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}";
                        var html = "<" + obj.HTML_EL + " style=\"width:100px;\" onchange=\"" + onchange + "\" onkeyup=\"" + onkeyup + "\" ";
                        // let val = obj.PROPERTYVALUE
                        if (obj.HTML_EL === 'select') {
                            html = html + " id=\"" + obj.PROPERTYNO + "\">"; //value="${obj.PROPERTYVALUE}"
                            var optStr = obj.OPTIONS;
                            var opts = optStr.split(/,/);
                            var optEls_1 = '';
                            if (optStr.includes(':')) {
                                opts.forEach(function (item) {
                                    var vt = item.split(/:/);
                                    if (obj.PROPERTYVALUE == vt[0].trim())
                                        optEls_1 += '<option value="' + vt[0].trim() + '" selected>' + vt[1].trim() + '</option>';
                                    else
                                        optEls_1 += '<option value="' + vt[0].trim() + '">' + vt[1].trim() + '</option>';
                                });
                            }
                            else {
                                opts.forEach(function (item) {
                                    if (obj.PROPERTYVALUE == item.trim())
                                        optEls_1 += '<option selected>' + item.trim() + '</option>';
                                    else
                                        optEls_1 += '<option>' + item.trim() + '</option>';
                                });
                            }
                            html += optEls_1 + '</select>';
                        }
                        else {
                            // html = `<${obj.HTML_EL} ${obj.ATTR} value="${obj.PROPERTYVALUE}" propertyno="${obj.PROPERTYNO}">`
                            html = html + " id=\"" + obj.PROPERTYNO + "\""; //value="${obj.PROPERTYVALUE}"
                            html = html + " " + obj.ATTR + " value=\"" + obj.PROPERTYVALUE + "\">";
                        }
                        if (obj.HINT == null)
                            return html;
                        else
                            return html + " " + obj.HINT;
                    } /*,no effect
                    editparse:(val)=>{
                        console.log('editparse: ',val)
                        return val
                    }*/
                }
            ],
            on: {
                onAfterEditStop: function (state, editor, ignoreUpdate) {
                    // console.log('af edit stop',state,editor)
                    //webix does not support value binding of select element
                    var treeTb = $$(SetSystem.viewIds.treeTab);
                    if (!treeTb)
                        return;
                    var rec = treeTb.data.pull[editor.row];
                    //bind value with select element
                    if (rec.HTML_EL === 'select') {
                        var newv = document.getElementById(rec.PROPERTYNO).value;
                        if (newv == undefined)
                            debugger;
                        rec.PROPERTYVALUE = newv;
                    }
                    else {
                    }
                }, onAfterRender: function () {
                    var editModeTog = $$(SetSystem.viewIds.editModeTog);
                    var colDom = document.getElementsByClassName('webix_column webix_last')[0];
                    if (!colDom)
                        return;
                    var editorCells = [].slice.call(colDom.children);
                    //edit mode
                    if (editModeTog.getValue() == 1) {
                        editorCells.forEach(function (el) {
                            if (el.firstChild)
                                el.firstChild.disabled = false;
                        });
                    }
                    else {
                        editorCells.forEach(function (el) {
                            if (el.firstChild)
                                el.firstChild.disabled = true;
                        });
                    }
                }
                /*,//it seems sometimes not work!!!
                onEditorChange:(cell,val)=>{
                    let treeTb = <webix.ui.treetable>$$(SetSystem.viewIds.treeTab)
                    let rec = treeTb.data.pull[cell.row]
                    if(rec.HTML_EL === 'select'){

                        let newv = (<HTMLSelectElement>document.getElementById(rec.PROPERTYNO)).value

                        if(newv == undefined)
                            debugger

                        rec.PROPERTYVALUE = newv

                    }
                }*/
            } /*,
            rule:{
                "PROPERTYVALUE":val=>{
                    
                    console.log('validate: ',val)
                

                   return true
                }

            }*/
        };
        var grpCombo = ComponentFactory_1.default.initGrpCombo(SetSystem.viewIds.grpCombo, this.ctrl.onGrpComboChange);
        var layout = {
            id: SetSystem.viewIds.setSysLayout,
            rows: [
                {
                    margin: 10,
                    cols: [
                        {
                            view: "toggle",
                            id: SetSystem.viewIds.editModeTog,
                            type: "icon",
                            width: 38,
                            offIcon: "wxi-pencil",
                            onIcon: "wxi-pencil",
                            value: 0,
                            tooltip: "view/edit mode",
                            on: {
                                onChange: this.ctrl.onToggleChange
                            }
                        },
                        grpCombo,
                        {},
                        {
                            view: "label",
                            id: SetSystem.viewIds.savingNameLab,
                            // label:"Name:",
                            width: 270,
                            height: 20,
                            borderless: true
                        },
                        {},
                        {
                            view: "button",
                            id: SetSystem.viewIds.loadBtn,
                            type: "icon",
                            icon: "wxi-dots",
                            label: "Load",
                            width: 100,
                            click: this.ctrl.onLoadBtnClick
                        },
                        {
                            view: "button",
                            id: SetSystem.viewIds.enableBtn,
                            type: "icon",
                            icon: "wxi-check",
                            disabled: true,
                            label: "Enable",
                            width: 100,
                            click: this.ctrl.onEnableBtnClick,
                            on: {
                                onAfterRender: function () {
                                    $$(SetSystem.viewIds.enableBtn).$view.title = 'This version has already enabled';
                                }
                            }
                        },
                        {
                            view: "button",
                            id: SetSystem.viewIds.resetBtn,
                            label: "Reset",
                            type: "icon",
                            icon: "wxi-sync",
                            hidden: true,
                            width: 100,
                            click: this.ctrl.onReloadBtnClick
                        },
                        {
                            view: "button",
                            id: SetSystem.viewIds.saveAsBtn,
                            type: "icon",
                            icon: "wxi-check",
                            label: "Save",
                            hidden: true,
                            width: 120,
                            click: this.ctrl.onSaveAsBtnClick
                        }
                        // {
                        // 	view:"button",
                        // 	id:SetSystem.viewIds.saveBtn,
                        // 	type:"icon",
                        // 	icon:"wxi-check",
                        // 	label:"Save",
                        // 	hidden:true,
                        // 	width:100,
                        // 	click:this.ctrl.onSaveBtnClick
                        // }	
                    ]
                },
                treetab
            ]
        };
        return layout;
    };
    SetSystem.viewIds = {
        setSysLayout: "setSysLayout",
        grpCombo: "grpCombo",
        editModeTog: "editModeTog",
        savingNameLab: "savingNameLab",
        enableBtn: "enableBtn",
        resetBtn: "resetBtn",
        loadBtn: "loadBtn",
        saveAsBtn: "saveAsBtn",
        saveBtn: "saveBtn",
        treeTab: "treeTab",
        saveWin: "saveWin",
        saveNameTxt: "saveNameTxt",
        saveGrid: "saveGrid",
        loadWin: "loadWin",
        loadGrid: "loadGrid"
    };
    SetSystem.isDataValid = true;
    SetSystem.invalidationMsg = {}; //propertno : rule
    return SetSystem;
}(webix_jet_1.JetView));
exports.default = SetSystem;
//# sourceMappingURL=SetSystem.js.map