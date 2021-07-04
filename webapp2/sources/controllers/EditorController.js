"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EditorController = /** @class */ (function () {
    function EditorController() {
    }
    /*
        customize a datetime editor
    */
    EditorController.initDateTimeEditor = function () {
        webix.editors['datetime'] = {
            focus: function () {
                this.getInputNode(this.node).focus();
                this.getInputNode(this.node).select();
            },
            getValue: function () {
                return this.getInputNode(this.node).value;
            },
            setValue: function (value) {
                this.getInputNode(this.node).value = value;
            },
            getInputNode: function () {
                return this.node.firstChild;
            },
            render: function () {
                return webix.html.create("div", {
                    "class": "webix_dt_editor"
                }, "<input type='datetime-local'>");
            }
        };
    };
    return EditorController;
}());
exports.default = EditorController;
//# sourceMappingURL=EditorController.js.map