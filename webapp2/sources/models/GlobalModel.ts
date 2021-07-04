import {querySqlCallBack,querySql} from "./Proxy"
import gCtrl from "../controllers/GlobalController"
import txtStore from "../store/TextStore"
import {SetTableVO} from "../models/VO"

export default class GlobalModel{

  static getGUID(callback){
    let sql = "SELECT sys_guid() guid FROM dual"

    querySqlCallBack(sql,guidObj=>{
      let guid = gCtrl.convertBase64ToHex( guidObj[0].GUID)
      callback(guid)
    })
  }
  
  static selectVerInfo = (id)=>{
  
    let sql = `select ID, FACTORY_ID, MODULE_ID, TOOLG_ID, TABLE_NAME, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME, UPDATE_USER ,NAME, to_char(VER_UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') VER_UPDATE_TIME
    from SET_VER_CONTROL 
    where id = '${id}'`

    return querySql(sql)
  }

  static selectMatVerInfo = (id)=>{
  
    let sql = `select ID, TOOLG_ID, TABLE_NAME, to_char(UPDATE_TIME,'yyyy/mm/dd hh24:mi:ss') UPDATE_TIME, UPDATE_USER
    from MAT_VER_CONTROL
    where id = '${id}'`

    return querySql(sql)
  }

  static insertSetVerCtrl(id,factory_id,module_id,toolg_id,table_name,updateUser,callback){

    let toolgId = (toolg_id==null)?'null':`'${toolg_id}'`

    let sql = `INSERT INTO 
    set_ver_control(id,factory_id,module_id,toolg_id,table_name,update_time,update_user) 
    VALUES('${id}','${factory_id}','${module_id}',${toolgId},'${table_name}',sysdate,'${updateUser}')`

    querySqlCallBack(sql,callback)
  }

  static insertMatVerCtrl(id,toolg_id,table_name,updateUser,callback){

    let toolgId = (toolg_id==null)?'null':`'${toolg_id}'`

    let sql = `INSERT INTO mat_ver_control(id,toolg_id,table_name,update_time,update_user) 
    VALUES('${id}',${toolgId},'${table_name}',sysdate,'${updateUser}')`

    querySqlCallBack(sql,callback)
  }

  static overwriteVerCtrl(oldId,newId,updateUser,enabled,callback){

    let sql

    if(enabled){
      sql = `UPDATE set_ver_control
      SET id = '${newId}',update_user = '${updateUser}', ver_update_time = sysdate , update_time = sysdate
      WHERE id = '${oldId}'`
    }else{
      sql = `UPDATE set_ver_control
      SET id = '${newId}',update_user = '${updateUser}', ver_update_time = sysdate
      WHERE id = '${oldId}'`
    }

    

    querySqlCallBack(sql,callback)
  }

  static insertVerCtrlWithName(id,factory_id,module_id,toolg_id,table_name,updateUser,name,enabled,callback){

    let toolgId = (toolg_id==null)?'null':`'${toolg_id}'`


    let updateTime  = (enabled)?"sysdate":"to_date('2010-01-01','yyyy-mm-dd')"
    // let sql = `INSERT INTO 
    // set_ver_control(id,factory_id,module_id,toolg_id,table_name,update_time,update_user,ver_update_time) 
    // VALUES('${id}','${factory_id}','${module_id}',${toolgId},'${table_name}',sysdate,'${updateUser}',sysdate)`

    let sql = `INSERT INTO 
    set_ver_control(id,factory_id,module_id,toolg_id,table_name,update_time,update_user,name,ver_update_time) 
    VALUES('${id}','${factory_id}','${module_id}',${toolgId},'${table_name}' ,${updateTime},'${updateUser}','${name}',sysdate)`

    querySqlCallBack(sql,callback)
    // querySql(sql)
  }

  static selectPhotoToolgId(callback){

    let sql = `SELECT TOOLG_ID FROM SET_MODULE_BASIS
    WHERE type1 = 'RUN_TOOLG' AND ENABLEFLAG = '1' AND MODULE_ID = 'PHOTO'
    ORDER BY toolg_id`

    querySqlCallBack(sql,callback)
  }

  static selectUserInfo(id,pw,callback){

    let sql = `SELECT *
    FROM SET_USERBASIS
    WHERE id='${id}'`

    if(pw=== ''){
      sql+=`AND password is null`
    }else{
      sql+=`AND password='${pw}'`
    }
    
    querySqlCallBack(sql,callback)
  }

  static selectLatestOptTableVersion(toolg,callback){
    let sql = `SELECT toolg_id,id FROM V_JOB_LASTEST_VERSION`

    if(toolg)
      sql+=` WHERE toolg_id = '${toolg}'`

    querySqlCallBack(sql,recs=>{

      let ids = []

      recs.forEach(rec=>{
        ids.push({toolg:rec.TOOLG_ID,id:rec.ID})
      },true)   

      callback(ids,'selectLatestOptTableVersion')
    })
  }

  static selectLatestSetTableVersionByToolg = (setTable,modu,toolg)=>{

    let sql =`SELECT b.*
   FROM (SELECT b.*,ROW_NUMBER() OVER (PARTITION BY b.factory_id,b.module_id,b.toolg_id,  b.TABLE_NAME ORDER BY Update_Time DESC) AS RTN FROM SET_VER_CONTROL b ) b
   WHERE b.RTN = 1
   AND table_name = '${setTable}'
   AND MODULE_ID = '${modu}'
    AND TOOLG_ID ='${toolg}'`

    /*
    let sql = `select * from V_SET_LASTEST_VERSION t 
    where table_name = '${setTable}'
    AND MODULE_ID = '${modu}'
    AND TOOLG_ID ='${toolg}'`*/

    return querySql(sql)
    // querySqlCallBack(sql,callback)
  }


  static selectLatestMatTableVersion(matTable){

    let sql = `select id from v_mat_lastest_version where table_name = '${matTable}'`

    return querySql(sql)
  }

  static selectLatestSetTableVersion(modu,setTable,callback){

    let sql = ''

    switch(setTable){
      case txtStore.SET_TABLES.SET_MACHINEGROUP:
        sql = `  SELECT distinct id
              FROM V_SET_LASTEST_VERSION 
              WHERE TABLE_NAME = '${setTable}'
              AND TOOLG_ID is not null
              AND  MODULE_ID = '${modu}'
              `
        break;
      case txtStore.SET_TABLES.SET_TPFOMPOLICY:
        sql = `SELECT ID FROM V_SET_LASTEST_VERSION 
                WHERE TABLE_NAME = '${setTable}' 
                AND MODULE_ID = '${modu}'`
        break;
      case txtStore.SET_TABLES.SET_TRANSPORT:
        sql = `select distinct ID from V_SET_LASTEST_VERSION t 
        where table_name = '${setTable}'
        and toolg_id is not null
        AND  MODULE_ID = '${modu}'`
        break;
      case txtStore.SET_TABLES.SET_SCHEDULE_MACHINE_DOWN:
        sql = `select distinct id from V_SET_LASTEST_VERSION t 
        where table_name = '${setTable}'
        AND  MODULE_ID = '${modu}'`
        break;
      default:
          sql = `select distinct ID from V_SET_LASTEST_VERSION t 
          where table_name = '${setTable}'
          AND MODULE_ID = '${modu}'`
          break;
    }

    querySqlCallBack(sql,callback)
  }

  static remainDataIn20release = (setTabVo:SetTableVO)=>{
    
    // let factory = setTabVo.factory
    // let moduleId = setTabVo.module
    let table = setTabVo.setTable

    //versions of set system mange by users
    if(table === txtStore.SET_TABLES.SET_SYSTEM)
      return

    querySqlCallBack(`call sp_purge_set_table('${table}')`,()=>{})
    /*
    let delSql_set = `DELETE FROM ${table} s
    WHERE EXISTS(
    SELECT * FROM(
    SELECT row_number()over(partition by toolg_id order by update_time desc) rowno, v.*
    FROM set_ver_control v
    WHERE v.factory_id = '${factory}' 
    AND v.module_id = '${moduleId}'
    AND v.TABLE_NAME = '${table}'
    ) o20
    WHERE o20.rowno>20
    AND o20.id = s.parentid)`

    querySqlCallBack(delSql_set,()=>{
      let delSql_ver = `DELETE FROM set_ver_control s
      WHERE EXISTS(
      SELECT * FROM(
      SELECT row_number()over(partition by toolg_id order by update_time desc) rowno, v.*
      FROM set_ver_control v
      WHERE v.factory_id = '${factory}' 
      AND v.module_id = '${moduleId}'
      AND v.TABLE_NAME = '${table}'
      ) o20
      WHERE o20.rowno>20
      AND o20.id = s.id)`

      querySqlCallBack(delSql_ver,()=>{})
    })
    */

  }
}