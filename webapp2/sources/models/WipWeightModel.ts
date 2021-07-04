import {querySql, querySqlCallBack} from "./Proxy"
import sqlCtrl from "../controllers/SqlController"

export default class WipWeightModel{

    static selectWipData = (id)=>{

        //where TOOLG_ID = '${toolgId}'
        let sql = `select PARENTID, ID, TOOLG_ID, LOT_ID, PTY, LOT_TYPE, RECIPE, WEIGHTING, to_char(EFFECTIVE_TIME,'yyyy/mm/dd hh24:mi:ss') EFFECTIVE_TIME, PROD_ID, LAYER, STAGE, to_char(CREATE_DATE,'yyyy/mm/dd hh24:mi:ss') CREATE_DATE, COMMAND, ENTITY, WAIT, TARGET_STEP_ID, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME
        from SET_WIP_WEIGHTING
        where parentid = '${id}'
        order by PTY,CREATE_DATE desc`

        return querySql(sql)
    }

    static insertWipData = (guid,toolgId,gridData,callback)=>{

        let sql = "INSERT ALL\n"
        // let dateFormat = 'yyyy-mm-dd hh24:mi:ss'

        // let format = (str)=>{
        //     return str.replace(/T/,' ')
        // }

        gridData.forEach(rec=>{

            let prodId = sqlCtrl.nullOrString(rec.PROD_ID)
            let lotId = sqlCtrl.nullOrString(rec.LOT_ID)
            let stepId = sqlCtrl.nullOrString(rec.TARGET_STEP_ID)
            let createData = (rec.CREATE_DATE == null)?'sysdate':`to_date('${rec.CREATE_DATE}','yyyy/mm/dd hh24:mi:ss')`

            sql+=`INTO set_wip_weighting(parentid,toolg_id,pty,prod_id,target_step_id,lot_id,weighting,create_date)
            VALUES('${guid}','${toolgId}',${rec.PTY},${prodId},${stepId},${lotId},${rec.WEIGHTING},${createData})\n`
        })

        sql+='SELECT * FROM dual'

        querySqlCallBack(sql,callback)
    }


}
