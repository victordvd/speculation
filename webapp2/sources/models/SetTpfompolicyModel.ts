import {querySqlCallBack} from "./Proxy"

export default class SetTpfompolicyModel{
    // static selectProducts(callback){

    //     let sql = `
    //     select listagg(''''||productspecname||''''||' as '||productspecname,', ')within group(order by productspecname) PRODS
    //     from(
    //     select distinct productspecname 
    //     from set_tpfompolicy
    //     where parentid = (select ID from V_SET_LASTEST_VERSION t where table_name = 'SET_TPFOMPOLICY'))`

    //     querySqlCallBack(sql,callback)
    // }

    static selectTpfompolicy(callback){

      let sql = `select productspecname , processoperationname, machinename,1 active
      from set_tpfompolicy s
      where exists (select id from v_set_lastest_version v where v.id = s.parentid)
      and active = 'Y'`

        /* 2019/10/22
      let sql = `WITH FLOW AS(
        SELECT PRODUCTSPECNAME,PROCESSOPERATIONNAME,DESCRIPTION AS OPERATION,FACTORYNAME||'_'||PRODUCTSPECNAME||'_'||PROCESSFLOWNAME||'_'||PROCESSOPERATIONNAME AS CONDITIONID FROM MAT_PROCESS_FLOW pf
        WHERE VER_TIMEKEY > SYSDATE-1 
          AND pf.PARENTID = (SELECT ID FROM V_MAT_LASTEST_VERSION l WHERE l.TABLE_NAME = 'MAT_PROCESS_FLOW')
          AND pf.Processflowtype = 'Main'
          AND pf.PROCESSOPERATIONTYPE = 'Production'
      ),ALL_STEP AS(
        SELECT DISTINCT 
          f.PROCESSOPERATIONNAME,
          f.OPERATION,
          CASE WHEN j.CONDITIONID IS NULL THEN 'Y' ELSE 'N' END AS FLAG
        FROM FLOW f 
        LEFT JOIN (SELECT * FROM MAT_POSMACHINE j WHERE j.VER_TIMEKEY >SYSDATE-1 AND j.PARENTID = (SELECT ID FROM V_MAT_LASTEST_VERSION l WHERE l.TABLE_NAME = 'MAT_POSMACHINE' AND j.MACHINENAME LIKE 'AAPPH%')) j 
        ON j.CONDITIONID = f.CONDITIONID 
      ),SOURCE_POLICY AS(
        SELECT 
          a.PRODUCTSPECNAME,
          b.PROCESSOPERATIONNAME,
          b.OPERATION,
          c.TOOL_ID AS MACHINENAME
        FROM (SELECT DISTINCT PRODUCTSPECNAME FROM FLOW) a,
             (SELECT PROCESSOPERATIONNAME,OPERATION FROM ALL_STEP WHERE FLAG = 'N') b,
             (SELECT * FROM MAT_EQP_STATUS es WHERE es.VER_TIMEKEY >SYSDATE-1 AND es.PARENTID = (SELECT ID FROM V_MAT_LASTEST_VERSION l WHERE l.TABLE_NAME = 'MAT_EQP_STATUS') AND es.TOOL_ID LIKE 'AAPPH%') c
      )SELECT
        st.PARENTID,
        nvl(sp.PRODUCTSPECNAME,st.PRODUCTSPECNAME) PRODUCTSPECNAME, 
        nvl(sp.PROCESSOPERATIONNAME,st.PROCESSOPERATIONNAME) PROCESSOPERATIONNAME,
        nvl(sp.MACHINENAME,st.MACHINENAME) MACHINENAME,
        nvl(sp.OPERATION,' ') OPERATION,
        case when st.ACTIVE='Y' then 1 when st.ACTIVE='N' then 0 when st.ACTIVE is null then 0 end active
      FROM SOURCE_POLICY sp
      FULL OUTER JOIN (SELECT * FROM SET_TPFOMPOLICY WHERE PARENTID = (SELECT ID FROM V_SET_LASTEST_VERSION WHERE TABLE_NAME = 'SET_TPFOMPOLICY' AND MODULE_ID = 'PHOTO' AND ROWNUM = 1)) st 
        ON st.PRODUCTSPECNAME = sp.PRODUCTSPECNAME
          AND st.PROCESSOPERATIONNAME = sp.PROCESSOPERATIONNAME
          AND st.MACHINENAME = sp.MACHINENAME
      ORDER BY st.PARENTID, sp.PRODUCTSPECNAME, sp.PROCESSOPERATIONNAME, sp.MACHINENAME`*/

        querySqlCallBack(sql,callback)
    }

    static insertTpfompolicy(sql:string,callback){
        
        querySqlCallBack(sql,callback)
        
    }
}