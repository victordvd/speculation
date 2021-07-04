import {querySql,querySqlCallBack} from "./Proxy"

export default class{

    static selectMaskTransferCount(){

        let sql = `select * from OPT_RETICLE_OUTPUT a 
        WHERE a.VER_TIMEKEY > (sysdate-1)
        AND  EXISTS (SELECT 1 FROM V_JOB_LASTEST_VERSION J WHERE J.ID = a.PARENTID)
        and a.TIME_IN <= (SYSDATE+1/6)
        and status != 'UNMOUNT'`

        return querySql(sql)

    }

    static selectMaskTransfer(setMaskParentId:string,callback){

        let condition = (setMaskParentId)?` parentid = '${setMaskParentId}'`:`1=0`

        let sql = `with r as(
            select * from OPT_RETICLE_OUTPUT a 
             WHERE a.VER_TIMEKEY > (sysdate-1)
             AND  EXISTS (SELECT 1 FROM V_JOB_LASTEST_VERSION J WHERE J.ID = a.PARENTID)
             and a.TIME_IN <= (SYSDATE+1/6)
            ), o as(
            select * from OPT_OUTPUT O
             WHERE O.VER_TIMEKEY > (sysdate-1)
             AND  EXISTS (SELECT 1 FROM V_JOB_LASTEST_VERSION J WHERE J.ID = O.PARENTID)
            ), s as(
               select * from set_mask_transfer where ${condition}
            )
            SELECT m.materialstate, r.parentid o_parentid,r.output_time reticle_output_time, r.toolg_id, r.TIME_IN,r.RETICLES_ID, r.LOCATION_FROM ,r.LOCATION ,o.prod_id, s.checked,s.parentid s_parentid,s.update_user, s.update_time
            FROM r ,o ,s , (select materialname, machinename,materialstate from v_mat_bsmaterial where materialstate != 'UNMOUNT') m
            WHERE  r.reason = o.lot_id(+)
            and r.RETICLES_ID = s.mask_id(+)
            and r.time_in = s.arrival_time(+)
            and r.location_from = s.location_from(+)
            and r.location = s.tool_id(+)
            and r.Reticles_Id = m.MATERIALNAME(+)
            and r.LOCATION = m.MACHINENAME(+)
            order by r.output_time desc ,r.TIME_IN desc`
            
        /*let sql = `with r as(//for test
            select * from OPT_RETICLE_OUTPUT a 
             WHERE  a.PARENTID in  ('75B47129797A4BE4A08F610DCE8DCE97','DDAF7A41880F47659F5049C10FC7C382')
            ), o as(
            select * from OPT_OUTPUT O
             WHERE O.VER_TIMEKEY > (sysdate-1)
             AND  EXISTS (SELECT 1 FROM V_JOB_LASTEST_VERSION J WHERE J.ID = O.PARENTID)
            ), s as(
               select * from set_mask_transfer where parentid = '${setMaskParentId}'
            )
            SELECT m.materialstate, r.parentid o_parentid, r.toolg_id, r.TIME_IN,r.RETICLES_ID, r.LOCATION_FROM ,r.LOCATION ,o.prod_id, s.parentid s_parentid,s.update_user, s.update_time
            FROM r ,o ,s , (select materialname, machinename,materialstate from v_mat_bsmaterial where materialstate != 'UNMOUNT') m
            WHERE  r.reason = o.lot_id(+)
            and r.RETICLES_ID = s.mask_id(+)
            and r.time_in = s.arrival_time(+)
            and r.location_from = s.location_from(+)
            and r.location = s.tool_id(+)
            and r.Reticles_Id = m.MATERIALNAME(+)
            and r.LOCATION = m.MACHINENAME(+)
            order by r.TIME_IN desc`*/

        querySqlCallBack(sql,callback);
    }

    static insertMaskTranfer(sql,callback){
        querySqlCallBack(sql,callback)
    }

    static selectMaskTransferHistory = ()=>{

        //m.reticle_parentid = r.parentid 
        let sql = `with m as(
            select to_char(RETICLE_OUTPUT_TIME,'yyyy/mm/dd hh24:mi:ss') RETICLE_OUTPUT_TIME,RETICLE_PARENTID, MASK_ID, TOOL_ID, ARRIVAL_TIME, PRODUCT_ID, LOCATION_FROM, UPDATE_USER, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME, CHECKED
            from set_mask_transfer m
            where m.ver_timekey > sysdate-1/6
            )
            , r as(
            select to_char(OUTPUT_TIME,'yyyy/mm/dd hh24:mi:ss') RETICLE_OUTPUT_TIME,parentid RETICLE_PARENTID, reticles_id MASK_ID,location TOOL_ID, time_in ARRIVAL_TIME,'' PRODUCT_ID, LOCATION_FROM,'' UPDATE_USER, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME,'' CHECKED
            from opt_reticle_output r
            where r.ver_timekey > sysdate-1/6
            and not exists (select * from m 
            where m.mask_id = r.reticles_id 
            and m.tool_id = r.location 
            and m.location_from = r.location_from
            and m.arrival_time = r.time_in)
            )
            ,u as(
            select * from m
            union
            select distinct * from r
            )select  RETICLE_OUTPUT_TIME,RETICLE_PARENTID, MASK_ID, TOOL_ID, ARRIVAL_TIME, PRODUCT_ID, LOCATION_FROM, UPDATE_USER, UPDATE_TIME, CHECKED
            from u
            order by u.arrival_time desc ,update_time desc`//where m.ver_timekey > sysdate-1/6

        return querySql(sql)
    }

    
}