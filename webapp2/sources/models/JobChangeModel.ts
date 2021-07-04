import {querySql,querySqlCallBack} from "./Proxy"

export default class JobChangeModel{

    async selectJobChange(){
        let sql = `with a as(
            select o.* ,v.dispatch_time d_time
                from opt_output o, (select * from v_job_lastest_version) v
                where v.id = o.parentid(+)
                and v.toolg_id = o.toolg_id(+) 
                and (o.seq <9000 or (o.ch_time_out is not null and (o.seq = 9996 or o.seq = 9997)))
            )
            select row_number() over(PARTITION BY tool_id order by ch_time_out) seq,tool_id ,lot_id, SUBSTR(step_id_target,0,4)||' : '||prod_id prod_step, to_char(ch_time_in,'yyyy-mm-dd hh24:mi:ss') ch_time_in, to_char(ch_time_out,'yyyy-mm-dd hh24:mi:ss') ch_time_out, parentid,op_flg,m_level, to_char(d_time,'yyyy-mm-dd hh24:mi:ss') d_time
            from a
            order by  tool_id,seq`

        /*
        let sql = `
        with a as(
            select o.* ,v.dispatch_time d_time
                from opt_output o, (select * from v_job_lastest_version) v
                where v.id = o.parentid(+)
                and v.toolg_id = o.toolg_id(+) 
                and (o.seq <9000 or (o.ch_time_out is not null and (o.seq = 9996 or o.seq = 9997)))
            )
            select tool_id , seq ,lot_id, SUBSTR(step_id_target,0,4)||' : '||prod_id prod_step, to_char(ch_time_in,'yyyy-mm-dd hh24:mi:ss') ch_time_in, to_char(ch_time_out,'yyyy-mm-dd hh24:mi:ss') ch_time_out, parentid, m_level, to_char(d_time,'yyyy-mm-dd hh24:mi:ss') d_time
            from a
            order by  tool_id,seq`*/
        let resp =  await querySql(sql)

        return resp
    }

    async selectPreviousJobChange(){
        let sql = `with a as(
            select o.* ,v.dispatch_time d_time
                from opt_output o, (select *  from(
                              select row_number() over(partition by toolg_id order by end_time desc) rno,j.* from job_run_control j
                              where result = 'Success'
                          )where rno = 2) v
                where v.id = o.parentid(+)
                and v.toolg_id = o.toolg_id(+) 
                and (o.seq <9000 or (o.ch_time_out is not null and (o.seq = 9996 or o.seq = 9997)))
            )
            select row_number() over(PARTITION BY tool_id order by ch_time_out) seq,tool_id ,lot_id, SUBSTR(step_id_target,0,4)||' : '||prod_id prod_step, to_char(ch_time_in,'yyyy-mm-dd hh24:mi:ss') ch_time_in, to_char(ch_time_out,'yyyy-mm-dd hh24:mi:ss') ch_time_out, parentid,op_flg,m_level, to_char(d_time,'yyyy-mm-dd hh24:mi:ss') d_time
            from a
            order by  tool_id,seq`

        let resp =  await querySql(sql)

        return resp
    }

}