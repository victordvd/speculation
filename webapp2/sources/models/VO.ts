import MaskTransfer from "views/settings/MaskTransfer";

export class GanttJcVO{
    constructor(text,sIdx,eIdx){

        this.text = text
        this.sIdx = sIdx
        this.eIdx = eIdx
    }

    text:string
    sIdx:number
    eIdx:number
}

export class SetSysVO{

    constructor(no,val){

        this.propertno = no
        this.propertyvalue = val
    }

    parentid:string
    propertno:string
    propertyvalue:string


}

export class SetMachineVO{
    constructor(fac,group,machine){
        this.factory = fac
        this.groupname = group
        this.machinename = machine
    }

    factory:string;
    groupname:string;    
    machinename:string;
}

export class MaskTransportVO{

    constructor(rowId,reticleId,isDone,savedChecked,savedCancelled,arrivalTime,inProdId,inMaskId,inEqpFrom,inEqpTo,updateUser,updateTime,reticleOutputTime){
        this.rowId=rowId
        this.reticleId = reticleId
        this.isDone = isDone
        this.savedChecked=savedChecked
        this.savedCancelled = savedCancelled
        this.isChecked=savedChecked
        this.arrivalTime=arrivalTime
        this.inProdId=inProdId
        this.inMaskId=inMaskId
        this.inEqpFrom=inEqpFrom
        this.inEqpTo=inEqpTo
        this.updateUser=updateUser
        this.updateTime=updateTime
        this.reticleOutputTime = reticleOutputTime
    }

    rowId
    reticleId
    isDone:boolean
    isChecked:number//checked on checkbox
    savedChecked:number//checked in DB
    savedCancelled:boolean//unchecked in DB
    arrivalTime:string
    inMaskId:string
    inProdId:string
    inEqpFrom:string
    inEqpTo:string
    outMaskId:string
    outProdId:string
    outEqpTo:string
    updateUser:string
    updateTime:string
    reticleOutputTime:string
}

export class JobChangeVO{
    constructor(eqp,curOper,jcOper,lotId,inTime,lv){
        this.eqp = eqp
        this.curOper = curOper
        this.jcOper = jcOper
        this.lotId = lotId
        this.timeIn = inTime
        this.lv = lv
    }

    eqp
    curOper
    jcOper
    lotId
    timeIn
    lv

}


export class SetTableVO{

    constructor(setTable,factory,module){
        this.setTable = setTable
        this.factory = factory
        this.module = module
    }

    setTable:string
    factory:string
    module:string
    toolg:string
    id:string
    
}

export class MatMfgTargetVO{

    constructor(){

    }

    factory:string
    datetimekey:string
    productId:string
    productType:string
    productDesc:string
    modelType:string
    inQty
    outQty
    eventUserId
    eventTime
}