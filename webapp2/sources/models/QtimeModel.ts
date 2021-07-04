import {querySql,querySqlCallBack,convertStrToDbVal} from "./Proxy"

export default class QtimeModel{

    static selectQtimeData = (id:string)=>{
        let sql = `select * from set_queuetime
        where parentid = '${id}'`

        return querySql(sql)
    }

    static insertQtimeData = (guid:string,factory:string,gridData:Array<any>,callbackFn:Function)=>{

        let sql = 'INSERT ALL\n'

        gridData.forEach(rec=>{

            sql+=`INTO set_queuetime(parentid,factoryname,productid,fromstep,tostep,maxqueuetime)
            VALUES('${guid}','${factory}','${rec.PRODUCTID}','${rec.FROMSTEP}','${rec.TOSTEP}',${rec.MAXQUEUETIME})\n`
        })

        sql+='SELECT * FROM dual'
        
        querySqlCallBack(sql,callbackFn)
    }
}