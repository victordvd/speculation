"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Top_1 = require("../views/Top");
var ResultViewController_1 = require("./ResultViewController");
var OverviewScheduleViewController_1 = require("./OverviewScheduleViewController");
var GlobalModel_1 = require("models/GlobalModel");
var GlobalController_1 = require("../controllers/GlobalController");
var VersionController_1 = require("../controllers/VersionController");
var MaskTransferViewController_1 = require("./settings/MaskTransferViewController");
var TopViewController = /** @class */ (function () {
    function TopViewController(view) {
        var _this = this;
        this.init = function (view) {
            //enable menu item href
            // this.use(plugins.Menu, Top.viewIds.appMenu)
            //check version
            VersionController_1.default.triggerOptOutputInterval();
            // this.scope = view
        };
        this.onMenuItemClick = function (id) {
            if (id == "setting")
                return;
            _this.view.show(id);
            //remove remaining gantt tip
            var tipCl = document.getElementsByClassName('gantt_tooltip');
            if (tipCl.length > 0)
                tipCl[0].remove();
            // console.log('app: '+id)
            _this.clearUpdateInfo();
            //clear opt_output version
            VersionController_1.default.setLoadDataFn(null);
            var updBar = $$(Top_1.default.viewIds.updBar);
            //hide update info
            if (id === Top_1.default.ViewNames.OverviewSchedule || id === "Result" || id === "JobChange" || id === "SetTpfompolicy") {
                updBar.hide();
            }
            else {
                // clearInterval(AllGroupGanttViewController.syncItvId)
                // clearInterval(ResultViewController.syncItvId)
                updBar.show();
            }
            //disable mask transfer idle interval
            if (OverviewScheduleViewController_1.default.syncItvId)
                clearInterval(OverviewScheduleViewController_1.default.syncItvId);
            if (ResultViewController_1.default.syncItvId)
                clearInterval(ResultViewController_1.default.syncItvId);
            if (MaskTransferViewController_1.default.idleItv)
                clearInterval(MaskTransferViewController_1.default.idleItv);
            if (MaskTransferViewController_1.default.renderItv)
                clearInterval(MaskTransferViewController_1.default.renderItv);
            // if(JobChangeViewController.checkVerItv)
            //     clearInterval(JobChangeViewController.checkVerItv)
        };
        this.clearUpdateInfo = function () {
            var userLab = $$(Top_1.default.viewIds.updUserLab);
            var timeLab = $$(Top_1.default.viewIds.updTimeLab);
            var nameLab = $$(Top_1.default.viewIds.nameLab);
            nameLab.setValue("");
            userLab.setValue("Update User: ");
            timeLab.setValue("Update Time: ");
        };
        this.onLogoutBtnClick = function () {
            webix.confirm({
                title: "Logout",
                ok: "No",
                cancel: "Yes",
                text: "Are you sure to log out?",
                callback: function (result) {
                    if (!result) //"Yes"
                        GlobalController_1.default.clearCookie();
                }
            });
        };
        this.view = view;
    }
    TopViewController.setCurrentUser = function (user) {
        var userLab = $$(Top_1.default.viewIds.curUserLab);
        userLab.setValue("Current User: " + user);
    };
    TopViewController.setUpdateInfo = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var userLab, timeLab, data, user, time;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userLab = $$(Top_1.default.viewIds.updUserLab);
                    timeLab = $$(Top_1.default.viewIds.updTimeLab);
                    //avoid there're no data
                    userLab.setValue("Update User: ");
                    timeLab.setValue("Update Time: ");
                    return [4 /*yield*/, GlobalModel_1.default.selectVerInfo(id)];
                case 1:
                    data = _a.sent();
                    if (data == null || data.length === 0) {
                        console.error('no data for update info!');
                        return [2 /*return*/, null];
                    }
                    user = data[0].UPDATE_USER;
                    time = data[0].UPDATE_TIME;
                    userLab.setValue("Update User: " + user);
                    timeLab.setValue("Update Time: " + time);
                    return [2 /*return*/, data];
            }
        });
    }); };
    TopViewController.setUpdateInfo_MAT = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var userLab, timeLab, data, user, time;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userLab = $$(Top_1.default.viewIds.updUserLab);
                    timeLab = $$(Top_1.default.viewIds.updTimeLab);
                    //avoid there're no data
                    userLab.setValue("Update User: ");
                    timeLab.setValue("Update Time: ");
                    return [4 /*yield*/, GlobalModel_1.default.selectMatVerInfo(id)];
                case 1:
                    data = _a.sent();
                    if (data == null || data.length === 0) {
                        console.error('no data for update info!');
                        return [2 /*return*/, null];
                    }
                    user = data[0].UPDATE_USER;
                    time = data[0].UPDATE_TIME;
                    userLab.setValue("Update User: " + user);
                    timeLab.setValue("Update Time: " + time);
                    return [2 /*return*/, data];
            }
        });
    }); };
    TopViewController.setUpdateInfoWithName = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var nameLab, userLab, timeLab, data, name, user, time;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nameLab = $$(Top_1.default.viewIds.nameLab);
                    userLab = $$(Top_1.default.viewIds.updUserLab);
                    timeLab = $$(Top_1.default.viewIds.updTimeLab);
                    //avoid there're no data
                    nameLab.setValue("Name: ");
                    userLab.setValue("Update User: ");
                    timeLab.setValue("Update Time: ");
                    return [4 /*yield*/, GlobalModel_1.default.selectVerInfo(id)];
                case 1:
                    data = _a.sent();
                    if (data == null || data.length === 0) {
                        console.error('no data for update info!');
                        return [2 /*return*/, null];
                    }
                    name = data[0].NAME;
                    user = data[0].UPDATE_USER;
                    time = data[0].VER_UPDATE_TIME;
                    nameLab.setValue("Name: " + name);
                    userLab.setValue("Update User: " + user);
                    timeLab.setValue("Update Time: " + time);
                    return [2 /*return*/, data];
            }
        });
    }); };
    TopViewController.getCurrentPage = function () {
        var w = $$(Top_1.default.viewIds.topWide);
        return w.getChildViews()[0].$scope.getUrl()[0].page;
    };
    return TopViewController;
}());
exports.default = TopViewController;
//# sourceMappingURL=TopViewController.js.map