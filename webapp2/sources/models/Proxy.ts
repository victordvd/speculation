import gCtrl from "../controllers/GlobalController"

declare var dbtype: any
declare var apiurl: any
declare var apiconnName: any

export function convertStrToDbVal(o){
  if(o==null)
    return 'null'
  else
    return `'${o}'`
}



export function querySqlCallBack(...arg:any[]) {

  let sql = arguments[0]
  let callback = arguments[1]
  let ignoreFail = arguments[2]

  let url = (sql.length>50)?`${apiurl}?fn=${sql.substring(0,49).replace(/\s/g,'_')}`:`${apiurl}?fn=${sql}`

  webix.ajax().post(url, {
    dbType: dbtype, apiConnName: apiconnName, sql: sql
  }).then(response => {

    if(ignoreFail && response === 'Query Fail.'){
      return
    }
    // try{ // can't catch
      let json = response.json();
      // console.log('response', json);
      if(json)
        callback(json);
    // }catch(e){
    //   webix.message('Failed.')
    //   console.log('resp text: '+response.text());
    //   if(gCtrl.curOverlayView)
    //     gCtrl.curOverlayView.hideOverlay()

    //   return
    // }
  })
}

export async function querySql(sql:string) {

  let url = (sql.length>50)?`${apiurl}?fn=${sql.substring(0,49).replace(/\s/g,'_')}`:`${apiurl}?fnName=${sql}`
  
let resp
  let p = webix.ajax().post(url, {
    dbType: dbtype, apiConnName: apiconnName, sql: sql
  })
  

  await p.then(response => {
      resp = response.json()
  })

  return new Promise(resolve => {resolve(resp)})
}

export function getIndexHtml(callback){

  webix.ajax().get("index.html").then(function(data){

    callback(data.text())
  });

}