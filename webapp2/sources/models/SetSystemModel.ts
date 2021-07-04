import {querySql,querySqlCallBack} from "./Proxy"
import {SetSysVO} from "./VO"

export class SetSystemModel{

    static selectSystem(toolgId:string,callback){
      // a.id ,a.parent_id , a.propertyno ,a.text
      //let sql = `select a.*,b.propertyvalue,b.parentid
      let sql = `select a.id, a.parent_id, a.propertyno, a.text, a.html_el, a.attr, a.options ,nullable, a.default_val, a.unit,b.propertyvalue,b.parentid
      from gui_system a,(SELECT * FROM set_system 
        where parentid = (select id from V_SET_LASTEST_VERSION t 
          where table_name = 'SET_SYSTEM' and toolg_id = '${toolgId}') ) b
      where  a.propertyno = b.propertyno(+)
      order by a.parent_id ,a.id`

      querySqlCallBack(sql,callback)
    }

    static selectSetSysById(id){

      let sql = `select a.id, a.parent_id, a.propertyno, a.text, a.html_el, a.attr, a.options ,nullable, a.default_val, a.unit,b.propertyvalue,b.parentid
      from gui_system a,(SELECT * FROM set_system where parentid = '${id}') b
      where a.propertyno = b.propertyno(+)
      order by a.parent_id ,a.id`
  
      return querySql(sql)
  
    }

    static getAllVersion(toolgId){

      let sql = `with en as(
        select id from(
         select row_number() over(order by v.update_time desc) rno,v.* from set_ver_control v
         where v.table_name = 'SET_SYSTEM'
         and v.toolg_id = '${toolgId}'
         )where rno = 1
        )
        select case when en.id is null then null else 'V' end enabled, v.*
        from set_ver_control v ,en
        where v.table_name = 'SET_SYSTEM' and v.toolg_id = '${toolgId}'
        and v.id = en.id(+)`
  
      return querySql(sql)
    }

/*
    static getNewestVersion(id,callback){
      let sql =`SELECT * FROM(
      SELECT id FROM set_ver_control 
      WHERE  table_name = 'SET_SYSTEM' and toolg_id = '${id}'
      ORDER BY update_time desc) t
      WHERE rownum = 1`
      querySqlCallBack(sql,callback)
    }*/

    static insertSetSystem(guid:string,data:Array<SetSysVO>,callback){

      let sql = "INSERT ALL\n"

      data.forEach(data=>{

        if(data.propertyvalue==null){
          sql += `INTO set_system(parentid,propertyno,propertyvalue,update_time) 
          VALUES('${guid}','${data.propertno}',null,sysdate)\n`
        }else{
          sql += `INTO set_system(parentid,propertyno,propertyvalue,update_time) 
          VALUES('${guid}','${data.propertno}','${data.propertyvalue}',sysdate)\n`
        }

      })

      sql += "SELECT * FROM dual"
 
      querySqlCallBack(sql,callback)
    }

    static deleteData = (id,callback)=>{

      let sql= `DELETE FROM set_system WHERE parentid = '${id}'`

      querySqlCallBack(sql,callback)
    }

    static deleteVersion = (id,callback)=>{

      let sql= `DELETE FROM set_ver_control WHERE id = '${id}'`

      querySqlCallBack(sql,callback)
    }

    static enableVersion = (id,callback)=>{

      let sql= `UPDATE set_ver_control SET update_time = sysdate WHERE id = '${id}'`

      querySqlCallBack(sql,callback)
    }

}