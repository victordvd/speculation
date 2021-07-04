import {querySqlCallBack} from "./Proxy"

export default class MachineDownModel{

    //remove para : grpId 2019/7/30
    static selectMachineDown(callback){
        //select PARENTID, TOOLG_ID, TOOL_ID, CH_ID, to_char(DOWN_START,'yyyy/mm/dd hh24:mi:ss') DOWN_START, to_char(DOWN_END,'yyyy/mm/dd hh24:mi:ss') DOWN_END
        let sql = `select PARENTID, TOOLG_ID, TOOL_ID, CH_ID, DOWN_START, DOWN_END ,nvl(REMARK,'') REMARK, CODE_ID
        from set_schedule_machine_down
        where parentid = (select distinct id from V_SET_LASTEST_VERSION t 
            where table_name = 'SET_SCHEDULE_MACHINE_DOWN'
            and update_time = (select max(update_time) from V_SET_LASTEST_VERSION where table_name = 'SET_SCHEDULE_MACHINE_DOWN')
            )`

        querySqlCallBack(sql,callback)
    }

    static insertMachineDown(guid,data,callback){

        let sql = "INSERT ALL\n"
        let dateFormat = 'yyyy-mm-dd hh24:mi:ss'

        let format = (str)=>{

            return str.replace(/T/,' ')
        }

        //toolg id is no need
        data.forEach(rec=>{

            let remark = (rec.REMARK == null)?'':rec.REMARK
            let codeIdVal = rec.CODE_ID

            if(codeIdVal == 1 ){
                codeIdVal = "'P0001'"
            }else{
                codeIdVal = "null"
            }

            sql+=`INTO set_schedule_machine_down(parentid,tool_id,down_start,down_end,remark,code_id)
            VALUES('${guid}','${rec.TOOL_ID}',to_date('${format(rec.DOWN_START)}','${dateFormat}'),to_date('${format(rec.DOWN_END)}','${dateFormat}'),'${remark}',${codeIdVal})\n`
        })

        sql+='SELECT * FROM dual'

        querySqlCallBack(sql,callback)
    }

    static selectMachines(callback){

        let sql = `select machinename from SET_MACHINEGROUP
        where parentid  in (
        select id from V_SET_LASTEST_VERSION t 
        where table_name = 'SET_MACHINEGROUP'
        and module_id = 'PHOTO'
        )
        order by machinename`

        querySqlCallBack(sql,callback)
    }

}