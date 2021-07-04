
import {querySql,querySqlCallBack} from "../../models/Proxy"
import { JetView } from "webix-jet"

declare var $$
declare var dbtype: any
declare var apiurl: any
declare var apiconnName: any


export default class Archive extends JetView {

    config(){

        let layout = {
            view:"form", 
            elements:[
                { view:"text", id:"idTxt", label:"ID" },
                {cols:[
                    { 
                        view:"button", 
                        value:"Export", 
                        css:"webix_primary",
                        click:()=>{

                            let  idTxt = $$('idTxt')
                            
                            // let id = 'D84339F8DE5A42BE9889507C06A7C9DC'
                            let id = idTxt.getValue()
                            var exportedCnt = 0;

                            function querySqlCallBack(sql, callback) {
                                webix.ajax().post(apiurl, {
                                  dbType: dbtype, apiConnName: apiconnName, sql: sql
                                }).then(response => {
                            
                                    var json = response.json();
                                    if(json)
                                      callback(json);
                            
                                })
                            }
                            
                            let exportCSVFile = (tableName,parentid,filename)=>{
                                
                                //if(tableName!='OPT_RLS_TABLE'){return}
                                
                                return new Promise(resolve => {
                                setTimeout(() => {
                                    
                                        let sql = `select * from ${tableName} where parentid = '${parentid}'`
                            
                                querySqlCallBack(sql,(data)=>{
                                    console.log('export:'+tableName+', length:'+data.length,data);
                            
                                    // var csvRows = ["123,2,4,5\r\n2,4,,5"];
                                    var csvRows = [""];
                            
                                    data.forEach((rec,idx)=>{
                            
                                        let i = 0;
                            
                                        if(idx==0){
                                            for(let col in rec){
                                                if(i==0)
                                                    csvRows[0] +=  col
                                                else
                                                    csvRows[0] +=  ','+col
                                                i++;
                                            }
                                            csvRows[0] += '\r\n'
                                            
                                        }
                            
                                        i=0;
                            
                                        for(let col in rec){
                            
                                            let val = (rec[col]==null)?'':rec[col]
                                            
                                            if(typeof val == 'string'){
                                                if(val.match(/\d{4}-\d{2}-\d{2}T/)!=null)
                                                    val = val.replace('T',' ')
                                            }
                            
                                            if(i==0)
                                                csvRows[0] +=  val
                                            else
                                                csvRows[0] +=  ','+val
                                            i++;
                                        }
                                        
                                        csvRows[0] += '\r\n'
                            
                                    })
                            
                                    var csvString = csvRows.join("%0A");
                                    var a         = document.createElement('a');
                                    var csvData = new Blob([csvString], { type: 'text/csv' }); 
                                    var csvUrl = URL.createObjectURL(csvData);
                                    a.href =  csvUrl;
                                    //a.href        = 'data:attachment/csv,' +  encodeURI(csvString);
                                    a.target      = '_blank';
                                    a.download    = (filename)?filename+'.csv':tableName+'.csv';
                            
                                    document.body.appendChild(a);
                                    a.click();
                                    exportedCnt++;
                                    console.log('exported count:'+exportedCnt);
                                })
                                    
                                  resolve(true);
                                    
                                }, 1000);
                              });
                                
                            }
                            
                            exportCSVFile('opt_output',id,'opt_output_new')
                            exportCSVFile('opt_reticle_output',id,null)
                            exportCSVFile('opt_error_log',id,null)
                            
                            let inputSql = `select parameterno,parametervalue from job_run_control_parameter
                            where parentid = '${id}'`
                            
                            
                            let fn = async (inputRec)=>{
                                
                                
                                            return new Promise((resolve) => {
                                            setTimeout(async() => {
                                            await exportCSVFile(inputRec.PARAMETERNO,inputRec.PARAMETERVALUE,null)  
                                              resolve(true);
                                            }, 500);
                                          });
                                        
                            }
                            
                            
                             querySqlCallBack(inputSql,async (inputData)=>{
                                
                                console.log(inputData);
                                
                                for(let i =0;i<inputData.length;i++){
                                    
                                    let inputRec = inputData[i];
                                    
                                    await fn(inputRec);
                                
                                }
                                
                                /*
                                inputData.forEach(async (inputRec)=>{
                                    
                                    await function(){return new Promise(resolve => {
                                setTimeout(() => {
                                  resolve(x);
                                }, 500);
                              });}
                                    
                                    await exportCSVFile(inputRec.PARAMETERNO,inputRec.PARAMETERVALUE,null)                             
                                    
                                });*/
                                
                            })
                        }
                    }
                ]},
                {}
            ]
        }

        return layout
    }


    init(view){}


}