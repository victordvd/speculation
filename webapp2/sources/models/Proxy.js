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
Object.defineProperty(exports, "__esModule", { value: true });
function convertStrToDbVal(o) {
    if (o == null)
        return 'null';
    else
        return "'" + o + "'";
}
exports.convertStrToDbVal = convertStrToDbVal;
function querySqlCallBack() {
    var arg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arg[_i] = arguments[_i];
    }
    var sql = arguments[0];
    var callback = arguments[1];
    var ignoreFail = arguments[2];
    var url = (sql.length > 50) ? apiurl + "?fn=" + sql.substring(0, 49).replace(/\s/g, '_') : apiurl + "?fn=" + sql;
    webix.ajax().post(url, {
        dbType: dbtype, apiConnName: apiconnName, sql: sql
    }).then(function (response) {
        if (ignoreFail && response === 'Query Fail.') {
            return;
        }
        // try{ // can't catch
        var json = response.json();
        // console.log('response', json);
        if (json)
            callback(json);
        // }catch(e){
        //   webix.message('Failed.')
        //   console.log('resp text: '+response.text());
        //   if(gCtrl.curOverlayView)
        //     gCtrl.curOverlayView.hideOverlay()
        //   return
        // }
    });
}
exports.querySqlCallBack = querySqlCallBack;
function querySql(sql) {
    return __awaiter(this, void 0, void 0, function () {
        var url, resp, p;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = (sql.length > 50) ? apiurl + "?fn=" + sql.substring(0, 49).replace(/\s/g, '_') : apiurl + "?fnName=" + sql;
                    p = webix.ajax().post(url, {
                        dbType: dbtype, apiConnName: apiconnName, sql: sql
                    });
                    return [4 /*yield*/, p.then(function (response) {
                            resp = response.json();
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, new Promise(function (resolve) { resolve(resp); })];
            }
        });
    });
}
exports.querySql = querySql;
function getIndexHtml(callback) {
    webix.ajax().get("index.html").then(function (data) {
        callback(data.text());
    });
}
exports.getIndexHtml = getIndexHtml;
//# sourceMappingURL=Proxy.js.map