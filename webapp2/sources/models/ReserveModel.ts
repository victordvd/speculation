import {querySql,querySqlCallBack} from "./Proxy"

export default class ReserveModel{

    static selectOptReserveData(){
        
        let sql = `select * from OPT_RESERVE r
        where r.parentid  in (SELECT ID FROM(        
            SELECT row_number()OVER (PARTITION BY toolg_id ORDER BY VER_TIMEKEY DESC) rno,o.id
            FROM OPT_VER_CONTROL o
            WHERE ver_timekey > SYSDATE-1
            AND TABLE_NAME = 'OPT_RESERVE')
            WHERE rno = 1)
        and r.seq = 1
        order by r.tool_id`

        return querySql(sql)
    }

}