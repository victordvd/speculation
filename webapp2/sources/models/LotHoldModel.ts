import {querySql, querySqlCallBack} from "./Proxy"

export default class LotHoldModel{

    static selectLotHoldData = (id)=>{

        // let sql = `select parentid,lot_id,tool_id ,substr(target_step_id,0,4) target_step_id,prod_id,start_time,end_time,create_date
        let sql = `select *
        from SET_LOT_HOLD
        where parentid = '${id}'
        order by create_date desc`

        return querySql(sql)
    }

    static insertIntoSetLotHold = (guid,gridData,callback)=>{

        let sql = "INSERT ALL\n"
        let dateFormat = 'yyyy-mm-dd hh24:mi:ss'

        let format = (str)=>{
            return str.replace(/T/,' ')
        }

        //toolg id is no need
        gridData.forEach(rec=>{

            let lotId = (rec.LOT_ID == null)?"''":`'${rec.LOT_ID}'`
            // let prodId = (rec.PROD_ID == null)?'':rec.PROD_ID
            let stepId = rec.TARGET_STEP_ID//+'-%'

            sql+=`INTO set_lot_hold(parentid,lot_id,target_step_id,tool_id,prod_id,start_time,end_time,create_date)
            VALUES('${guid}',${lotId},'${stepId}','${rec.TOOL_ID}','${rec.PROD_ID}',to_date('${format(rec.START_TIME)}','${dateFormat}'),to_date('${format(rec.END_TIME)}','${dateFormat}'),sysdate)\n`
        })

        sql+='SELECT * FROM dual'

        querySqlCallBack(sql,callback)
    }

}