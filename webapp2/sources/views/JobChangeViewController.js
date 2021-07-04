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
var Top_1 = require("./Top");
var GlobalController_1 = require("../controllers/GlobalController");
var JobChange_1 = require("./JobChange");
var JobChangeModel_1 = require("../models/JobChangeModel");
var VO_1 = require("../models/VO");
var VersionController_1 = require("../controllers/VersionController");
var JobChangeViewController = /** @class */ (function () {
    function JobChangeViewController() {
        var _this = this;
        this.mod = new JobChangeModel_1.default();
        this.init = function () {
            var updBar = $$(Top_1.default.viewIds.updBar);
            updBar.hide();
            GlobalController_1.default.checkCookie(function () {
                _this.loadData();
                //reset version check interval
                // JobChangeViewController.checkVerItv = setInterval(this.checkVersionChange,30000)
                VersionController_1.default.setLoadDataFn(_this.loadData);
            });
        };
        this.convertToGridData = function (rawData) {
            var gridData = [];
            // let idRecs = alasql("select distinct PARENTID from ?",[rawData])
            // idRecs.forEach(idRec=>{
            //     this.curParentIds.push(idRec.PARENTID)
            // })
            //merge continuous lv task
            var lvMgData = {}; //{firstLv:[continuous seqs]}
            var preEqp = null;
            var preSeq = -1;
            var preIdx = -1;
            var preProdStep = null;
            rawData.forEach(function (rec, idx) {
                var eqp = rec.TOOL_ID;
                var seq = rec.SEQ;
                var prodStep = rec.PROD_STEP;
                // let opFlg = rec.OP_FLG
                var ti = new Date(rec.CH_TIME_IN).getTime();
                var dTime = new Date(rec.D_TIME).getTime();
                var dif = ti - dTime;
                //show data of the latest version in earlier 2hr
                if (dif <= 7200000 && rec.M_LEVEL != null) {
                    var key = idx;
                    var preKey = preIdx;
                    if (preEqp === eqp && (preSeq + 1) === seq && preProdStep == prodStep) {
                        lvMgData[preKey].push(idx);
                        preSeq = seq;
                    }
                    else { // if(preIdx===-1||lvIdxes == undefined)
                        lvMgData[key] = [];
                        preEqp = eqp;
                        preSeq = seq;
                        preIdx = idx;
                        preProdStep = prodStep;
                    }
                }
            });
            console.log('lvMg', lvMgData);
            var _loop_1 = function (firstIdx) {
                // let seq = firstSeq.split('|')[1]
                var firstLvRec = rawData[firstIdx];
                lvMgData[firstIdx].forEach(function (ctuIdx) {
                    var ctuLvRec = rawData[ctuIdx];
                    firstLvRec.LOT_ID += '<br>' + ctuLvRec.LOT_ID;
                    firstLvRec.CH_TIME_IN += '<br>' + ctuLvRec.CH_TIME_IN;
                });
            };
            //merge leveled records into 1
            for (var firstIdx in lvMgData) {
                _loop_1(firstIdx);
            }
            var preRec;
            rawData.forEach(function (rec, idx) {
                var tiStr = rec.CH_TIME_IN;
                if (rec.CH_TIME_IN.includes('<br>'))
                    tiStr = tiStr.split('<br>')[0];
                var ti = new Date(tiStr).getTime();
                var dTime = new Date(rec.D_TIME).getTime();
                var dif = ti - dTime;
                //show data of the latest version in earlier 2hr
                if (dif <= 7200000 && rec.OP_FLG !== 'Running') {
                    if (idx === 0) {
                        //high level
                        if (rec.M_LEVEL != null) {
                            gridData.push(new VO_1.JobChangeVO(rec.TOOL_ID, '', rec.PROD_STEP, rec.LOT_ID, rec.CH_TIME_IN, rec.M_LEVEL));
                        }
                    }
                    else {
                        //JC
                        if ((preRec.TOOL_ID === rec.TOOL_ID && preRec.PROD_STEP !== rec.PROD_STEP)) {
                            gridData.push(new VO_1.JobChangeVO(rec.TOOL_ID, preRec.PROD_STEP, rec.PROD_STEP, rec.LOT_ID, rec.CH_TIME_IN, rec.M_LEVEL));
                        }
                    }
                }
                preRec = rec;
            });
            gridData = alasql('select * from ? order by eqp,timeIn', [gridData]);
            return gridData;
        };
        this.loadData = function () { return __awaiter(_this, void 0, void 0, function () {
            var rawData, grid, gridData, idRecs;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mod.selectJobChange()];
                    case 1:
                        rawData = _a.sent();
                        grid = $$(JobChange_1.default.viewIds.jcGrid);
                        grid.clearAll();
                        if (rawData == null || rawData.length === 0)
                            return [2 /*return*/];
                        gridData = [];
                        this.curParentIds = [];
                        idRecs = alasql("select distinct PARENTID from ?", [rawData]);
                        // let mdRec = alasql("select min(DATE(CH_TIME_IN)) md from ?", [rawData])
                        // let minDateTime = mdRec[0].md
                        idRecs.forEach(function (idRec) {
                            _this.curParentIds.push(idRec.PARENTID);
                        });
                        /*
                        //merge continuous lv task
                        let lvMgData = {}//{firstLv:[continuous seqs]}
                        let preEqp = null
                        let preSeq = -1
                        let preIdx = -1
                        let preProdStep = null
                        rawData.forEach((rec,idx)=>{
                            let eqp = rec.TOOL_ID
                            let seq = rec.SEQ
                            let prodStep = rec.PROD_STEP
                
                            let ti =  new Date(rec.CH_TIME_IN).getTime()
                            let dTime = new Date(rec.D_TIME).getTime()
                            let dif = ti-dTime
                            //show data of the latest version in earlier 2hr
                            if(dif<=7200000&&rec.M_LEVEL != null){
                                let key = idx
                                let preKey = preIdx
                                
                                if(preEqp === eqp && (preSeq+1) === seq && preProdStep == prodStep){
                                    lvMgData[preKey].push(idx)
                                    preSeq = seq
                                }else{ // if(preIdx===-1||lvIdxes == undefined)
                                    lvMgData[key] = []
                                    preEqp = eqp
                                    preSeq = seq
                                    preIdx = idx
                                    preProdStep = prodStep
                                }
                            }
                        })
                
                        //merge leveled records into 1
                        for(let firstIdx in lvMgData){
                
                            // let seq = firstSeq.split('|')[1]
                            let firstLvRec = rawData[firstIdx]
                
                            lvMgData[firstIdx].forEach(ctuIdx=>{
                                
                                let ctuLvRec = rawData[ctuIdx]
                
                                firstLvRec.LOT_ID += '<br>'+ ctuLvRec.LOT_ID
                                firstLvRec.CH_TIME_IN += '<br>'+ ctuLvRec.CH_TIME_IN
                            })
                        }
                
                        let preRec
                        rawData.forEach((rec,idx)=>{
                
                            let tiStr = rec.CH_TIME_IN
                            if(rec.CH_TIME_IN.includes('<br>'))
                                tiStr = tiStr.split('<br>')[0]
                
                            let ti =  new Date(tiStr).getTime()
                            let dTime = new Date(rec.D_TIME).getTime()
                            let dif = ti-dTime
                            //show data of the latest version in earlier 2hr
                            if(dif<=7200000 && rec.OP_FLG !== 'Running'){
                                if(idx===0){
                                    if(rec.M_LEVEL != null){
                                        gridData.push(new JobChangeVO(rec.TOOL_ID,'',rec.PROD_STEP,rec.LOT_ID,rec.CH_TIME_IN,rec.M_LEVEL))
                                    }
                                }else{
                                    if((preRec.TOOL_ID === rec.TOOL_ID && preRec.PROD_STEP !== rec.PROD_STEP)){
                                        gridData.push(new JobChangeVO(rec.TOOL_ID,preRec.PROD_STEP,rec.PROD_STEP,rec.LOT_ID,rec.CH_TIME_IN,rec.M_LEVEL))
                                    }
                                }
                            }
                            preRec = rec
                        })
                        */
                        // let preGridData = this.convertToGridData(preRawData)
                        // console.log(preGridData)
                        gridData = this.convertToGridData(rawData);
                        console.log(gridData);
                        //compare 2 versions
                        /*
                        let preEqpMap = {}
                        let eqpMap = {}
                        let mergedData = []
                
                        preGridData.forEach(rec=>{
                            let eqp = rec.eqp
                
                            if(preEqpMap[eqp]==undefined){
                                preEqpMap[eqp] = []
                            }
                
                            preEqpMap[eqp].push(rec)
                        })
                
                        gridData.forEach(rec=>{
                            let eqp = rec.eqp
                
                            if(eqpMap[eqp]==undefined){
                                eqpMap[eqp] = []
                            }
                
                            eqpMap[eqp].push(rec)
                        })
                
                        for(let eqp in eqpMap){
                            let preEqpRows = preEqpMap[eqp]
                            let eqpRows = eqpMap[eqp]
                            
                            if(preEqpRows==undefined){//no need to compare
                                mergedData.concat(eqpRows)
                                continue
                            }
                
                            let preIdx = 0
                            let idx = 0
                
                            while(idx<eqpRows.length && preIdx <preEqpRows.length){
                                let preRow:JobChangeVO = preEqpRows[preIdx]
                                let row:JobChangeVO = eqpRows[idx]
                
                                let preJc = preRow.curOper+preRow.jcOper
                                let jc = row.curOper+row.jcOper
                
                                // if()
                
                
                
                
                            }
                            
                
                
                        }*/
                        //set grid data
                        gridData = alasql('select * from ? order by timeIn', [gridData]);
                        grid.define('data', gridData);
                        // grid.adjustRowHeight()
                        grid.refresh();
                        return [2 /*return*/];
                }
            });
        }); };
        this.onReloadBtnClick = function () {
            _this.loadData();
        };
        /*
        checkVersionChange = ()=>{
            gMod.selectLatestOptTableVersion(null,latestIds=>{
    
                let isIdentical = true
    
                latestIds.every(idObj=>{
                
                    isIdentical = this.curParentIds.includes(idObj.id)
    
                    return isIdentical
    
                })
    
                if(!isIdentical){
    
                    this.loadData()
                }
            })
        }*/
    }
    return JobChangeViewController;
}());
exports.default = JobChangeViewController;
//# sourceMappingURL=JobChangeViewController.js.map