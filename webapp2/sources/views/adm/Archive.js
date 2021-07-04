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
var webix_jet_1 = require("webix-jet");
var Archive = /** @class */ (function (_super) {
    __extends(Archive, _super);
    function Archive() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Archive.prototype.config = function () {
        var _this = this;
        var layout = {
            view: "form",
            elements: [
                { view: "text", id: "idTxt", label: "ID" },
                { cols: [
                        {
                            view: "button",
                            value: "Export",
                            css: "webix_primary",
                            click: function () {
                                var idTxt = $$('idTxt');
                                // let id = 'D84339F8DE5A42BE9889507C06A7C9DC'
                                var id = idTxt.getValue();
                                var exportedCnt = 0;
                                function querySqlCallBack(sql, callback) {
                                    webix.ajax().post(apiurl, {
                                        dbType: dbtype, apiConnName: apiconnName, sql: sql
                                    }).then(function (response) {
                                        var json = response.json();
                                        if (json)
                                            callback(json);
                                    });
                                }
                                var exportCSVFile = function (tableName, parentid, filename) {
                                    //if(tableName!='OPT_RLS_TABLE'){return}
                                    return new Promise(function (resolve) {
                                        setTimeout(function () {
                                            var sql = "select * from " + tableName + " where parentid = '" + parentid + "'";
                                            querySqlCallBack(sql, function (data) {
                                                console.log('export:' + tableName + ', length:' + data.length, data);
                                                // var csvRows = ["123,2,4,5\r\n2,4,,5"];
                                                var csvRows = [""];
                                                data.forEach(function (rec, idx) {
                                                    var i = 0;
                                                    if (idx == 0) {
                                                        for (var col in rec) {
                                                            if (i == 0)
                                                                csvRows[0] += col;
                                                            else
                                                                csvRows[0] += ',' + col;
                                                            i++;
                                                        }
                                                        csvRows[0] += '\r\n';
                                                    }
                                                    i = 0;
                                                    for (var col in rec) {
                                                        var val = (rec[col] == null) ? '' : rec[col];
                                                        if (typeof val == 'string') {
                                                            if (val.match(/\d{4}-\d{2}-\d{2}T/) != null)
                                                                val = val.replace('T', ' ');
                                                        }
                                                        if (i == 0)
                                                            csvRows[0] += val;
                                                        else
                                                            csvRows[0] += ',' + val;
                                                        i++;
                                                    }
                                                    csvRows[0] += '\r\n';
                                                });
                                                var csvString = csvRows.join("%0A");
                                                var a = document.createElement('a');
                                                var csvData = new Blob([csvString], { type: 'text/csv' });
                                                var csvUrl = URL.createObjectURL(csvData);
                                                a.href = csvUrl;
                                                //a.href        = 'data:attachment/csv,' +  encodeURI(csvString);
                                                a.target = '_blank';
                                                a.download = (filename) ? filename + '.csv' : tableName + '.csv';
                                                document.body.appendChild(a);
                                                a.click();
                                                exportedCnt++;
                                                console.log('exported count:' + exportedCnt);
                                            });
                                            resolve(true);
                                        }, 1000);
                                    });
                                };
                                exportCSVFile('opt_output', id, 'opt_output_new');
                                exportCSVFile('opt_reticle_output', id, null);
                                exportCSVFile('opt_error_log', id, null);
                                var inputSql = "select parameterno,parametervalue from job_run_control_parameter\n                            where parentid = '" + id + "'";
                                var fn = function (inputRec) { return __awaiter(_this, void 0, void 0, function () {
                                    var _this = this;
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, new Promise(function (resolve) {
                                                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, exportCSVFile(inputRec.PARAMETERNO, inputRec.PARAMETERVALUE, null)];
                                                            case 1:
                                                                _a.sent();
                                                                resolve(true);
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); }, 500);
                                            })];
                                    });
                                }); };
                                querySqlCallBack(inputSql, function (inputData) { return __awaiter(_this, void 0, void 0, function () {
                                    var i, inputRec;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                console.log(inputData);
                                                i = 0;
                                                _a.label = 1;
                                            case 1:
                                                if (!(i < inputData.length)) return [3 /*break*/, 4];
                                                inputRec = inputData[i];
                                                return [4 /*yield*/, fn(inputRec)];
                                            case 2:
                                                _a.sent();
                                                _a.label = 3;
                                            case 3:
                                                i++;
                                                return [3 /*break*/, 1];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                }); });
                            }
                        }
                    ] },
                {}
            ]
        };
        return layout;
    };
    Archive.prototype.init = function (view) { };
    return Archive;
}(webix_jet_1.JetView));
exports.default = Archive;
//# sourceMappingURL=Archive.js.map