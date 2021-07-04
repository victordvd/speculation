"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GanttJcVO = /** @class */ (function () {
    function GanttJcVO(text, sIdx, eIdx) {
        this.text = text;
        this.sIdx = sIdx;
        this.eIdx = eIdx;
    }
    return GanttJcVO;
}());
exports.GanttJcVO = GanttJcVO;
var SetSysVO = /** @class */ (function () {
    function SetSysVO(no, val) {
        this.propertno = no;
        this.propertyvalue = val;
    }
    return SetSysVO;
}());
exports.SetSysVO = SetSysVO;
var SetMachineVO = /** @class */ (function () {
    function SetMachineVO(fac, group, machine) {
        this.factory = fac;
        this.groupname = group;
        this.machinename = machine;
    }
    return SetMachineVO;
}());
exports.SetMachineVO = SetMachineVO;
var MaskTransportVO = /** @class */ (function () {
    function MaskTransportVO(rowId, reticleId, isDone, savedChecked, savedCancelled, arrivalTime, inProdId, inMaskId, inEqpFrom, inEqpTo, updateUser, updateTime, reticleOutputTime) {
        this.rowId = rowId;
        this.reticleId = reticleId;
        this.isDone = isDone;
        this.savedChecked = savedChecked;
        this.savedCancelled = savedCancelled;
        this.isChecked = savedChecked;
        this.arrivalTime = arrivalTime;
        this.inProdId = inProdId;
        this.inMaskId = inMaskId;
        this.inEqpFrom = inEqpFrom;
        this.inEqpTo = inEqpTo;
        this.updateUser = updateUser;
        this.updateTime = updateTime;
        this.reticleOutputTime = reticleOutputTime;
    }
    return MaskTransportVO;
}());
exports.MaskTransportVO = MaskTransportVO;
var JobChangeVO = /** @class */ (function () {
    function JobChangeVO(eqp, curOper, jcOper, lotId, inTime, lv) {
        this.eqp = eqp;
        this.curOper = curOper;
        this.jcOper = jcOper;
        this.lotId = lotId;
        this.timeIn = inTime;
        this.lv = lv;
    }
    return JobChangeVO;
}());
exports.JobChangeVO = JobChangeVO;
var SetTableVO = /** @class */ (function () {
    function SetTableVO(setTable, factory, module) {
        this.setTable = setTable;
        this.factory = factory;
        this.module = module;
    }
    return SetTableVO;
}());
exports.SetTableVO = SetTableVO;
var MatMfgTargetVO = /** @class */ (function () {
    function MatMfgTargetVO() {
    }
    return MatMfgTargetVO;
}());
exports.MatMfgTargetVO = MatMfgTargetVO;
//# sourceMappingURL=VO.js.map