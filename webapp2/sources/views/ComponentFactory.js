"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComponentFactory = /** @class */ (function () {
    function ComponentFactory() {
    }
    ComponentFactory.initGrpCombo = function (id, onChange) {
        var grpCombo = Object.assign({}, ComponentFactory.combo.grpCombo);
        grpCombo.id = id;
        grpCombo.on = {
            onchange: onChange
        };
        return grpCombo;
    };
    ComponentFactory.combo = {
        grpCombo: {
            view: "richselect",
            id: undefined,
            label: "GROUP ID",
            width: 180,
            value: 1,
            options: [],
            on: {
            // "onChange":this.ctrl.onGrpComboChange
            }
        },
        grid: {
            view: "datatable",
            id: undefined,
            css: "rows",
        }
    };
    ComponentFactory.generateCommonQueryBar = function () {
        var bar = {
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
                },
                {},
                {
                    view: "button",
                    label: "Save",
                    type: "icon",
                    icon: "wxi-check",
                    width: 80,
                }
            ]
        };
    };
    return ComponentFactory;
}());
exports.default = ComponentFactory;
//# sourceMappingURL=ComponentFactory.js.map