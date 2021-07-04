import {querySql,querySqlCallBack} from "./Proxy"
import {MatMfgTargetVO} from "./VO"
import common from "../controllers/CommonController"

export default class MatchRateModel{

    static insertMatchRateData = (guid,factory,data:Array<MatMfgTargetVO>,user,callback)=>{

        //compose SQL
        let sql = "INSERT ALL\n"
        
        let prodType = 'Production'

        data.forEach(rec=>{
            let inQty = (rec.inQty)?rec.inQty:'null'
            let outQty = (rec.outQty)?rec.outQty:'null'
            // let eventTime = common.getTimeStr(new Date(),'')

            // sql+=`INTO mat_mfg_target(parentid,factory,datetimekey,product_id,product_type,product_desc,model_type,in_qty,out_qty)
            // VALUES('${guid}','${factory}','${rec.datetimekey}','${rec.productId}','${prodType}','${rec.productDesc}','${rec.modelType}',${inQty},${outQty})\n`

            sql+=`INTO mat_mfg_target(parentid,factory,datetimekey,product_id,product_type,product_desc,model_type,in_qty,out_qty)
            VALUES('${guid}','${factory}',to_date('${rec.datetimekey}','yyyy/mm/dd'),'${rec.productId}','${prodType}','${rec.productDesc}','${rec.modelType}',${inQty},${outQty})\n`
        })

        sql+='SELECT * FROM dual'

        querySqlCallBack(sql,callback)
    }

    static selectMfgTarget(id:string){

        let sql = `select * from MAT_MFG_TARGET where parentid = '${id}'`

        //(select id from v_mat_lastest_version where table_name = 'MAT_MFG_TARGET')

        return querySql(sql)
    }


}