import {querySql,querySqlCallBack,convertStrToDbVal} from "./Proxy"

export default class MonitorSpecModel{
    
    static selectData(){

        let sql = `
        WITH FLOW AS(  
           SELECT 
               PRODUCTSPECNAME, 
               PROCESSOPERATIONNAME,
               DESCRIPTION AS OPERATION,FACTORYNAME||'_'||PRODUCTSPECNAME||'_'||PROCESSFLOWNAME||'_'||PROCESSOPERATIONNAME AS CONDITIONID ,
               ROW_NUMBER() OVER (PARTITION BY PRODUCTSPECNAME ORDER BY POSITION) AS RTN
           FROM MAT_PROCESS_FLOW pf
           WHERE pf.PARENTID = (SELECT ID FROM V_MAT_LASTEST_VERSION l WHERE l.TABLE_NAME = 'MAT_PROCESS_FLOW')
               AND pf.Processflowtype = 'Main'
               AND pf.PROCESSOPERATIONTYPE = 'Production'
       ),SOURCE_STEPS AS(
           SELECT DISTINCT
               a.PROCESSOPERATIONNAME,
               b.PROCESSOPERATIONNAME AS NEXT_PROCESSOPERATIONNAME,
               a.OPERATION
           FROM (SELECT PRODUCTSPECNAME,PROCESSOPERATIONNAME,OPERATION,RTN FROM FLOW f WHERE EXISTS(SELECT 1 FROM (SELECT * FROM MAT_POSMACHINE j WHERE j.PARENTID = (SELECT ID FROM V_MAT_LASTEST_VERSION l WHERE l.TABLE_NAME = 'MAT_POSMACHINE')) j WHERE j.MACHINENAME LIKE 'AAPPH%' AND j.CONDITIONID = f.CONDITIONID )) a
           LEFT JOIN FLOW b
               ON a.PRODUCTSPECNAME = b.PRODUCTSPECNAME AND a.RTN = b.RTN-1
       )SELECT 
           st.PARENTID,
           NVL(st.STEP_ID,sp.PROCESSOPERATIONNAME) AS STEP_ID,
           st.SUB_STEP_ID,
           NVL(st.LAYER_NAME,sp.OPERATION) AS LAYER_NAME,
           st.L2,
           st.L3,
           st.L2_CNT,
           st.L3_CNT,
           st.UPDATE_USER,
           st.UPDATE_TIME,
           sp.NEXT_PROCESSOPERATIONNAME AS SUB_STEP_SELECTION
       FROM (SELECT * FROM SET_MONITOR_SPEC WHERE PARENTID = (SELECT ID FROM V_SET_LASTEST_VERSION WHERE TABLE_NAME = 'SET_MONITOR_SPEC' AND MODULE_ID = 'PHOTO' AND ROWNUM = 1)) st 
       FULL OUTER JOIN SOURCE_STEPS sp
           ON st.STEP_ID = sp.PROCESSOPERATIONNAME
               AND NVL(st.SUB_STEP_ID,sp.NEXT_PROCESSOPERATIONNAME) = sp.NEXT_PROCESSOPERATIONNAME
      ORDER BY st.PARENTID, st.STEP_ID, st.SUB_STEP_ID
        `

        return querySql(sql)
    }

    static insertMonitorSpecData = (guid,data,callback) =>{

        if(data==null || data.length===0){
            callback()
        }

        let sql = `INSERT ALL\n`

        data.forEach(rec=>{

            sql += `INTO SET_MONITOR_SPEC(parentid,step_id,sub_step_id,layer_name,l2,l3,l2_cnt,l3_cnt,update_time,update_user)
            VALUES('${guid}','${rec.STEP_ID}',${convertStrToDbVal(rec.SUB_STEP_ID)},${convertStrToDbVal(rec.LAYER_NAME)},${rec.L2},${rec.L3},${rec.L2_CNT},${rec.L3_CNT},to_date('${rec.UPDATE_TIME}','yyyy-mm-dd hh24:mi:ss'),'${rec.UPDATE_USER}') \n`
            
        })

        sql += ` SELECT * FROM dual`

        querySqlCallBack(sql,callback)
    }

}