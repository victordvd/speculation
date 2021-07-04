import {querySqlCallBack} from "./Proxy"

export default class StockerSettingModel{

    static selectStockerData(callback){
        let sql= `
        select * from(
            select *
            from gui_transport
            where parentid = (select distinct ID from V_SET_LASTEST_VERSION t where table_name = 'SET_TRANSPORT' and toolg_id is not null)
            )pivot ( 
                 max(trans_time) for stocker_id_to in('AFST01' AFST01,'AFST02' AFST02,'AFST06' AFST06,'AFST11' AFST11,'AFST12' AFST12,'AFST16' AFST16)
            )
            order by stocker_id_from`
        querySqlCallBack(sql,callback)
    }

    static insertGuiData(sql:string,callback){

        querySqlCallBack(sql,callback)
    }

    static insertIntoTransport(guid,callback){
        
        let sql = `INSERT INTO set_transport (PARENTID, TOOLG_ID, TOOL_ID_FROM, TOOL_ID,EXTRA_COST,UPDATE_TIME)
        WITH T1 AS (SELECT E.TOOL_ID, E.STOCKER_ID FROM V_MAT_EQP_STATUS E )
        ,T2 AS (SELECT E.TOOL_ID, E.STOCKER_ID FROM V_MAT_EQP_STATUS E )
        ,T3 AS (
        SELECT S.parentid PARENTID, '' TOOLG_ID, T1.TOOL_ID TOOL_ID_FROM, T2.TOOL_ID, S.TRANS_TIME/60 EXTRA_COST, SYSDATE UPDATE_TIME
        FROM GUI_TRANSPORT S,T1,T2
        WHERE S.parentid = '${guid}'
        AND S.STOCKER_ID_FROM = T1.STOCKER_ID(+)
        AND S.STOCKER_ID_TO = T2.STOCKER_ID(+))
        SELECT PARENTID,TOOLG_ID,TOOL_ID_FROM,TOOL_ID,EXTRA_COST ,UPDATE_TIME
        FROM T3
        WHERE T3.TOOL_ID_FROM NOT LIKE 'AAPPH%' AND T3.TOOL_ID LIKE 'AAPPH%'`

        querySqlCallBack(sql,callback)
    }
}