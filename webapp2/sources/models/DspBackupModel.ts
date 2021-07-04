import {querySql,querySqlCallBack} from "./Proxy"

export default class DspBackupModel{

    selectDspBackup(){
        let sql = `SELECT FACTORYNAME, MACHINENAME, PRODUCTSPECNAME, PROCESSOPERATIONNAME,SEQ, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME 
        FROM V_DSP_BACKUP`

        return querySql(sql)
    }

}