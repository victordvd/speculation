import {querySqlCallBack} from "./Proxy"
import  {SetMachineVO} from "./VO"

export class MachineGroup{

  static getGrpId(callback) {
    var str = `
    SELECT ROW_NUMBER() OVER (ORDER BY VALUE DESC) AS "id", a.VALUE AS "value" FROM (
      SELECT DISTINCT MODULE_ID AS VALUE FROM SET_MODULE_BASIS WHERE TYPE1 = 'RUN_TOOLG' AND ENABLEFLAG = '1') a
    `;
    querySqlCallBack(str, callback);
  }

  static getMachineList(moduleid:string,callback){
    let sql = `SELECT ROW_NUMBER() OVER (ORDER BY MACHINENAME) AS "num",FACTORYNAME AS "fac",PARENTID AS "parentid",GROUPNAME AS "group", MACHINENAME AS "machine", UPDATE_TIME AS "ut", GROUPNAME AS "orggroup" FROM SET_MACHINEGROUP WHERE PARENTID IN (
          SELECT ID FROM (
              SELECT 
                  ID,
                  ROW_NUMBER() OVER (PARTITION BY MODULE_ID,TOOLG_ID ORDER BY UPDATE_TIME DESC) AS RTN 
              FROM SET_VER_CONTROL 
              WHERE MODULE_ID = '${moduleid}' AND TABLE_NAME = 'SET_MACHINEGROUP'
          ) WHERE RTN = 1 
      ) ORDER BY MACHINENAME`;
    querySqlCallBack(sql,callback);
  }

  static insertAllSetMachineGroup(sql:string,callback){
    querySqlCallBack(sql,callback)
  }

  static insertSetMachineGroup(guid:string,data:Array<SetMachineVO>,callback){
    data.forEach(data=>{

      let stm = `INSERT INTO SET_MACHINEGROUP(PARENTID, UPDATE_TIME, FACTORYNAME, GROUPNAME, MACHINENAME) 
      VALUES('${guid}',SYSDATE,'${data.factory}','${data.groupname}','${data.machinename}')`

      querySqlCallBack(stm,callback)
    })  
  }

  static getNewestVersion(table:string,moduleid:string,toolg:string,callback){
    let sql =`SELECT ID FROM V_SET_LASTEST_VERSION 
    WHERE MODULE_ID = '${moduleid}' AND TOOLG_ID = '${toolg}' AND TABLE_NAME = '${table}' AND ROWNUM = 1
    ORDER BY UPDATE_TIME DESC`
    querySqlCallBack(sql,callback)
  }
}