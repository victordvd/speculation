"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var top_1 = require("views/top");
var GlobalController = /** @class */ (function () {
    function GlobalController() {
    }
    GlobalController.convertBase64ToHex = function (b64) {
        var raw = atob(b64);
        var HEX = '';
        for (var i = 0; i < raw.length; i++) {
            var _hex = raw.charCodeAt(i).toString(16);
            HEX += (_hex.length == 2 ? _hex : '0' + _hex);
        }
        return HEX.toUpperCase();
    };
    GlobalController.setUpdateInfo = function (user, time) {
        var userLab = $$(top_1.default.viewIds.userLab);
        var timeLab = $$(top_1.default.viewIds.timeLab);
        userLab.setValue(user);
        timeLab.setValue(time);
    };
    //common string
    GlobalController.SAVING = "Saving...";
    GlobalController.LOADING = "Loading...";
    GlobalController.SAVESUCCESS = "Saved successfully";
    return GlobalController;
}());
exports.default = GlobalController;
//# sourceMappingURL=GlobalController.js.map