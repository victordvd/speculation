import {querySql,querySqlCallBack} from "./Proxy"


declare var OUTPUT_OFFSET

export default class ResultModel{
  static getLotGridData(toolgId,keyID,callback) {

    /*
    let sql = `SELECT 
    PARENTID, to_char(VER_TIMEKEY,'yyyy/mm/dd hh24:mi:ss') VER_TIMEKEY, TOOLG_ID, TOOL_ID, ENTITY, SEQ, LOT_ID, LOT_TYPE, TECH, PROD_ID, PLAN_ID, STEP_ID, STEP_ID_TARGET, PTY, QTY, RECIPE, PPID, STAGE, LAYER, CH_CNT, CH_ID, to_char(LP_TIME_EARLY,'yyyy/mm/dd hh24:mi:ss') LP_TIME_EARLY, to_char(CH_TIME_IN,'yyyy/mm/dd hh24:mi:ss') CH_TIME_IN, to_char(CH_TIME_OUT,'yyyy/mm/dd hh24:mi:ss') CH_TIME_OUT, to_char(SEASON,'yyyy/mm/dd hh24:mi:ss') SEASON, OP_FLG, to_char(REACH_TIME,'yyyy/mm/dd hh24:mi:ss') REACH_TIME, to_char(Q_TIME,'yyyy/mm/dd hh24:mi:ss') Q_TIME, LP_FLG, REMARK, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME, to_char(Q_TIME_FULL,'yyyy/mm/dd hh24:mi:ss') Q_TIME_FULL, to_char(DUMMY,'yyyy/mm/dd hh24:mi:ss') DUMMY, CONSTRAINTS, CHUCK_FLAG, PT_PTY, RECIPE_GROUP, PARENT_LOT, to_char(LEAD_TIME,'yyyy/mm/dd hh24:mi:ss') LEAD_TIME, to_char(POST_TIME,'yyyy/mm/dd hh24:mi:ss') POST_TIME, FOUP_ID, to_char(OUTPUT_TIME,'yyyy/mm/dd hh24:mi:ss') OUTPUT_TIME, HOLD_CODE, DOMA_PATH, GEN, TARGET_TOOLG_ID, to_char(DISPATCH_TIME,'yyyy/mm/dd hh24:mi:ss') DISPATCH_TIME, M_LEVEL
    FROM　OPT_OUTPUT WHERE PARENTID = '${keyID}'`*/

    /*it's possible a overflow occured in opt's date value*/
    let sql = `with down_id as(
      select distinct parametervalue from job_run_control_parameter p
      where  p.parentid = '${keyID}'
      AND parameterno = 'SET_SCHEDULE_MACHINE_DOWN'
    ),down as(
      select  down_end,remark,tool_id from set_schedule_machine_down
      where parentid = (select * from down_id)
      ), down_add_1s as(
        select  (down_end+interval '1' second) down_end,remark,tool_id from set_schedule_machine_down
        where parentid = (select * from down_id)
  ), down_minus_1s as(
        select (down_end-interval '1' second) down_end,remark,tool_id from set_schedule_machine_down
        where parentid = (select * from down_id)
  )
    SELECT nvl(nvl(d.remark,nvl(dm.remark,da.remark)),o.remark) remark,o.PARENTID, to_char(o.VER_TIMEKEY,'yyyy/mm/dd hh24:mi:ss') VER_TIMEKEY, o.TOOLG_ID, o.TOOL_ID, o.ENTITY, o.SEQ, o.LOT_ID, o.LOT_TYPE, o.TECH, o.PROD_ID, o.PLAN_ID, o.STEP_ID, o.STEP_ID_TARGET, o.PTY, o.QTY, o.RECIPE, o.PPID, o.STAGE, o.LAYER, o.CH_CNT, o.CH_ID, to_char(o.LP_TIME_EARLY,'yyyy/mm/dd hh24:mi:ss') LP_TIME_EARLY, to_char(o.CH_TIME_IN,'yyyy/mm/dd hh24:mi:ss') CH_TIME_IN, to_char(o.CH_TIME_OUT,'yyyy/mm/dd hh24:mi:ss') CH_TIME_OUT, to_char(o.SEASON,'yyyy/mm/dd hh24:mi:ss') SEASON, o.OP_FLG, to_char(o.REACH_TIME,'yyyy/mm/dd hh24:mi:ss') REACH_TIME, to_char(o.Q_TIME,'yyyy/mm/dd hh24:mi:ss') Q_TIME, o.LP_FLG, to_char(o.UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME, to_char(o.Q_TIME_FULL,'yyyy/mm/dd hh24:mi:ss') Q_TIME_FULL, to_char(o.DUMMY,'yyyy/mm/dd hh24:mi:ss') DUMMY, o.CONSTRAINTS, o.CHUCK_FLAG, o.PT_PTY, o.RECIPE_GROUP, o.PARENT_LOT, to_char(o.LEAD_TIME,'yyyy/mm/dd hh24:mi:ss') LEAD_TIME, to_char(o.POST_TIME,'yyyy/mm/dd hh24:mi:ss') POST_TIME, o.FOUP_ID, to_char(o.OUTPUT_TIME,'yyyy/mm/dd hh24:mi:ss') OUTPUT_TIME, o.HOLD_CODE, o.DOMA_PATH, o.GEN, o.TARGET_TOOLG_ID, to_char(o.DISPATCH_TIME,'yyyy/mm/dd hh24:mi:ss') DISPATCH_TIME, o.M_LEVEL, to_char(o.DUMMY,'yyyy/mm/dd hh24:mi:ss') DUMMY
    FROM　OPT_OUTPUT o,down d,down_add_1s da,down_minus_1s dm
    WHERE o.PARENTID = '${keyID}'
    and o.tool_id = d.tool_id(+)
    and o.tool_id = da.tool_id(+)
    and o.tool_id = dm.tool_id(+)
    and o.ch_time_out = d.down_end(+) 
    and o.ch_time_out = da.down_end(+) 
    and o.ch_time_out = dm.down_end(+) 
    `

    querySqlCallBack(sql,callback)
  }

  static getMaskGridData(keyID,callback) {
    /*let sql = `select 
    PARENTID, to_char(VER_TIMEKEY,'yyyy/mm/dd hh24:mi:ss') VER_TIMEKEY, TOOLG_ID, RETICLES_ID, POD_ID, to_char(TIME_IN,'yyyy/mm/dd hh24:mi:ss') TIME_IN, to_char(TIME_OUT,'yyyy/mm/dd hh24:mi:ss') TIME_OUT, LOCATION_FROM, LOCATION, FLOWN_IN, PRIORITY, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME, LOT_ID, STATUS, REASON, to_char(TRIGGER_TIME,'yyyy/mm/dd hh24:mi:ss') TRIGGER_TIME, to_char(OUTPUT_TIME,'yyyy/mm/dd hh24:mi:ss') OUTPUT_TIME
    from opt_reticle_output where parentid = '${keyID}'`*/
    /*
    let sql = `select a.*,b.prod_id
      from opt_reticle_output a ,(
        select tool_id,ch_id,prod_id,min(seq) seq
        from opt_output
        where parentid = '${keyID}' 
        group by tool_id,ch_id,prod_id) b
      where a.parentid = '${keyID}'
      and a.location = b.tool_id
      and a.reticles_id = b.ch_id
      order by a.reticles_id, b.seq`*/

      let sql =`select a.reticles_id,to_char(a.trigger_time,'yyyy/mm/dd hh24:mi:ss') trigger_time,to_char(a.time_in,'yyyy/mm/dd hh24:mi:ss') time_in,a.location_from,a.location, b.prod_id
      from opt_reticle_output a,(select distinct lot_id,prod_id
      from opt_output
      where parentid = '${keyID}') b
      where a.parentid = '${keyID}'
      and a.reason = b.lot_id(+)`

    querySqlCallBack(sql,callback)
  }


  static getQryCondition(toolgId,callback) {
    var str = `select id as \"id\", value as \"value\",  end_time as \"end_time\",TOOLG_ID  
    from ( SELECT ROW_NUMBER() OVER (ORDER BY  end_time desc) as id,id as value,  TO_CHAR(end_time,'YYYY/MM/DD HH24:MI') as end_time, TOOLG_ID FROM JOB_RUN_CONTROL  
    where ver_timekey>sysdate${OUTPUT_OFFSET} and result = 'Success' and toolg_id = '${toolgId}') t`;//and end_time>sysdate-3
    querySqlCallBack(str, callback);
  }

  static getAllGrpQryCondition():any {
    var str = `select id, TO_CHAR(dispatch_time,'YYYY/MM/DD HH24:MI:SS') dispatch_time, TO_CHAR(end_time,'YYYY/MM/DD HH24:MI') end_time, TOOLG_ID
    from JOB_RUN_CONTROL
    where ver_timekey>sysdate${OUTPUT_OFFSET} and result = 'Success'
    order by end_time desc`//end_time>sysdate-3 and
    return querySql(str)
  }
  
  static getKeyId(callback) {
    var str = `select id as \"id\", value as \"value\",  end_time as \"end_time\",TOOLG_ID  
    from ( SELECT ROW_NUMBER() OVER (ORDER BY  end_time desc) as id,id as value,  TO_CHAR(end_time,'YYYY/MM/DD HH24:MI') as end_time, TOOLG_ID FROM JOB_RUN_CONTROL  
    where result = 'Success' ) t where t.id < 7 `;
    querySqlCallBack(str, callback);
  }
  
  static getMaskGanttData(keyID, callback) {
  
    // querySqlCallBack(str, callback);
  }
  
  static getLotGantt(idStr) {

    console.log('get lot gantt: '+idStr)

    let sql = `with down_id as(
      select distinct parametervalue from job_run_control_parameter p
      where  p.parentid in (${idStr})
      AND parameterno = 'SET_SCHEDULE_MACHINE_DOWN'
    ),down as(
      select  down_end,remark,tool_id from set_schedule_machine_down
      where parentid in (select * from down_id)
      ), down_add_1s as(
        select  (down_end+interval '1' second) down_end,remark,tool_id from set_schedule_machine_down
        where parentid in (select * from down_id)
  ), down_minus_1s as(
        select (down_end-interval '1' second) down_end,remark,tool_id from set_schedule_machine_down
        where parentid in (select * from down_id)
  ), lot AS(
    SELECT T1.id, T1.text , '' type, T1.start_date,  T1.end_date, 1 progress, 0 owner_id,
    0 priority, T1.toolg_id,T1.tool_id parent_text,  T1.recipe,  T1.prod_id , T1.step_id_target,
     T1.m_level, T1.seq,T1.ch_time_out,nvl(nvl(d.remark,nvl(dm.remark,da.remark)),T1.remark) remark,parentid, dummy
      FROM (    
      SELECT ROW_NUMBER() OVER (ORDER BY TOOL_ID, CH_TIME_IN desc) + 100 AS id, LOT_ID text,'' type, CH_TIME_IN start_date,CH_TIME_OUT end_date,      
      1 progress, 0 owner_id, 1 parent, 0 priority,toolg_id,tool_id,recipe, prod_id,step_id_target, m_level,seq,remark ,ch_time_out,parentid, dummy
      FROM opt_output     
      WHERE PARENTID in (${idStr})
      ) T1  ,down d ,down_add_1s da, down_minus_1s dm
      where T1.tool_id = d.tool_id(+)
    and T1.tool_id = da.tool_id(+)
    and T1.tool_id = dm.tool_id(+)
    and T1.ch_time_out = d.down_end(+) 
    and T1.ch_time_out = da.down_end(+) 
    and T1.ch_time_out = dm.down_end(+) 
    ),lot_normal as(
       select * from lot where seq < 9000 or seq = 9996 or seq = 9997
    )
    , max_min_time as(
     select min(start_date) min_start_date,max(end_date) max_end_date from lot_normal
    )
    ,eqp AS(
    SELECT     
    ROW_NUMBER() OVER (ORDER BY TOOL_ID) id, toolg_id,    
    RTRIM(TOOL_ID) text, '' type, null start_date, null end_date,  
    1 progress,  0 owner_id, 0 priority,  RTRIM(TOOL_ID) parent_text,'' recipe,'' prod_id,'' step_id_target ,null m_level,null seq,'' remark,parentid,null dummy,  0 parent
    FROM OPT_OUTPUT 
    WHERE PARENTID in (${idStr})
    AND TOOL_ID is not null     
    GROUP BY parentid,toolg_id,tool_id
  )
     ,lot_down_all as(
          select parent_text,max(seq) seq from(    
            select *
            from lot
            where (seq = 9994 OR (seq = 9998 AND remark LIKE 'ToolDown%'))
          )
          group by parent_text
      )
    ,lot_task as(
      
        SELECT id,toolg_id,nvl(text,remark) text,type, nvl(start_date,(select min(start_date) from lot_normal)) start_date, nvl(end_date,(select max(end_date) from lot_normal)) end_date, progress,owner_id,
        priority,parent_text, recipe, prod_id ,step_id_target,m_level,seq,remark,parentid,dummy
        from(
           select a.*,b.seq seq_down from lot a,lot_down_all b
           where a.parent_text = b.parent_text(+)
           and a.seq = b.seq(+)
           and(b.seq is not null 
            or a.seq < 9000 
            or (a.seq = 9996 or a.seq = 9997 and a.start_date is not null and a.end_date is not null))
           )        
      )
      , uni as(
      select * from eqp
      UNION ALL 
      select * from(
        select da.* ,eqp.id parent 
        from( select * from lot_task ) da ,eqp
         WHERE da.parent_text =  eqp.text(+)
         AND da.parentid = eqp.parentid(+)
         )
       )
      select id "id",toolg_id "toolg_id",text "text",type "type",to_char(start_date,'DD-MM-YYYY HH24:MI') "start_date", to_char(end_date,'DD-MM-YYYY HH24:MI') "end_date", progress "progress",owner_id "owner_id",
        priority "priority",parent_text "parent_text", recipe "recipe", prod_id "prod_id", step_id_target "step_id_target", m_level "m_level", remark "remark", parent "parent",seq "seq",parentid "parentid",
        to_char(start_date,'YYYY-MM-DD HH24:MI') "sd",to_char(end_date,'YYYY-MM-DD HH24:MI') "ed", to_char(dummy,'YYYY-MM-DD HH24:MI') "dummy"
      from uni
     ORDER BY parent,parent_text, start_date`

    return querySql(sql)//YYYY-MM-DD //DD-MM-YYYY
  }

    static selectPreviousId = async (idStr)=>{

      let sql = `with rno_job as(
        select row_number() over(partition by factory_id,module_id,toolg_id order by j.end_time desc) rno,j.*
        from job_run_control j
        where result = 'Success'
        )
        select * from rno_job j
        where exists (
        select 1 from rno_job j2 
        where j2.id in (${idStr})
        and j.rno = j2.rno+1
        and j.toolg_id = j2.toolg_id
        )`

        return querySql(sql)
    }

    static selectJobVersionInfo(idStr){

      let sql = `select id,toolg_id,to_char(end_time,'mm/dd hh24:mi') end_time from job_run_control
      where id in (${idStr})`

      return querySql(sql)
    }

    static insertGanttData = (data,callback)=>{

      let sql = ``

   
    }
}