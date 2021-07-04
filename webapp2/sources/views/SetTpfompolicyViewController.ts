import SetTpfompolicy from "./SetTpfompolicy"
import model from "../models/SetTpfompolicyModel"
import gModel from "../models/GlobalModel"
import gCtrl from "../controllers/GlobalController"
import oCtrl from "../controllers/OperationController"
import TopViewController from "./TopViewController"
import gStore from "../store/GlobalStore"
import txtStore from "../store/TextStore"
import {SetTableVO} from "../models/VO"

declare var $$
declare var alasql

export class SetTpfompolicyViewController{

    constructor(view:any){
        this.view = view;
    }


    view:SetTpfompolicy
    loadText = []
    saveText = []
    spans = []
    isFirstLoad = true
    currentParentId:string

    init= (view)=>{
        gCtrl.checkCookie(()=>{
            this.loadData()
        })
    }
    

    //for data test
    printData=(data:Array<any>,type)=>{

        if(type==1)
            this.loadText = []
        else
            this.saveText = []

        data.forEach(rec=>{
            // console.log(rec)

            let text = rec.PROCESSOPERATIONNAME+' '+rec.MACHINENAME+' '

            for(let col in rec){
                
                if(col !=='OPERATION' && col!== 'MACHINENAME' && col !== 'PROCESSOPERATIONNAME' && col !== 'id'){
                    text+=rec[col]
                }
            }

            // console.log(text)

            if(type==1)
                this.loadText.push(text)
            else{
                this.saveText.push(text)
            }
        })

        if(type==0&& !this.isFirstLoad){//save compare

            for(let i =0;i<this.saveText.length;i++){
                if(this.saveText[i]!== this.loadText[i]){
                    console.log('not equal: '+i)
                    console.log(this.saveText[i])
                    console.log(this.loadText[i])
                }
            }
        }

    }

    loadData = ()=>{

        let grid:webix.ui.datatable = $$(SetTpfompolicy.viewIds.tpfomGrid)
        let prodCombo:webix.ui.combo = $$(SetTpfompolicy.viewIds.prodCombo)
        let stepCombo:webix.ui.combo = $$(SetTpfompolicy.viewIds.stepCombo)

        grid.showOverlay(txtStore.LOADING)
        grid.config.columns = SetTpfompolicy.staticCols.slice(0)

        grid.clearAll()

        model.selectTpfompolicy(rawData=>{
            // console.log("loading id: "+rawData[0].PARENTID)

            //if no data
            if(rawData==null || rawData.length===0){
                grid.hideOverlay()
                return    
            }

            //set parentId of current data
            this.currentParentId = rawData[0].PARENTID
            
            //set update info
            // TopViewController.setUpdateInfo(this.currentParentId)

            let prods = alasql("select distinct PRODUCTSPECNAME from ? order by PRODUCTSPECNAME",[rawData])
            let machs = alasql("select distinct  MACHINENAME from ?",[rawData])
            let operas = alasql("select distinct  PROCESSOPERATIONNAME from ? order by PROCESSOPERATIONNAME",[rawData])
            let gridData = alasql("select distinct OPERATION ,PROCESSOPERATIONNAME,MACHINENAME from ? order by PROCESSOPERATIONNAME,MACHINENAME", [rawData])
            let id = 1

            //set row id
            for(let i=0;i<gridData.length;i++){
                gridData[i].id = id
                id+=1
            }

            let stepComboItems = []
            let stepComboValStr = ""
            let prodComboItems = []
            let prodComboValStr = ""
            
            //operationname
            operas.forEach((operaObj,idx)=>{
                let oper = operaObj.PROCESSOPERATIONNAME

                if(idx>0)
                    stepComboValStr+=","+oper
                else
                    stepComboValStr+=oper

                stepComboItems.push(oper)
            })

            //products
            prods.forEach((prodObj ,idx) => {
                let prod = prodObj.PRODUCTSPECNAME

                //add prod to combo string
                if(idx>0)
                    prodComboValStr+=","+prod
                else
                    prodComboValStr+=prod

                prodComboItems.push(prod)
                //add cols of product // { id:"OPERATION",    header:["OPERATION",{ content: "textFilter" }], width:110 ,sort:"string"},
                grid.config.columns.push({
                    id:prod,
                    header: {text:prod,css:{"text-align":"center"}},
                    width:140,
                    css:"center",
                    editor:"checkbox",
                    // template:"{common.checkbox()}",
                    template: function(obj){
                        return '<input class="webix_table_checkbox" type="checkbox" disabled="true" '+ 
                          (obj[prod]==1 ? 'checked' : '')+'>';
                    },
                    sort:"int"
                })  


                //set prod porperty to records
                for(let i=0;i<gridData.length;i++){
                    gridData[i][prod] = null
                }
                //split prod records
                /*
                let prodData = alasql(`select ACTIVE from ? where PRODUCTSPECNAME='${prod}' order by PROCESSOPERATIONNAME,MACHINENAME`,[rawData])

                console.log(idx,', ',prod+': len= ',prodData.length)

                for(let i=0;i<gridData.length;i++){
                    if(!prodData[i]){//if there's no record in data
                        // console.log('undefined ',i)
                        gridData[i][prod] = 0
                    }else{
                        // gridData[i][prod] = prodData[i].ACTIVE
                        gridData[i][prod] = 1
                    }
                }
                */
            });

            //set active value to prod
            for(let i=0;i<gridData.length;i++){

                let step = gridData[i].PROCESSOPERATIONNAME
                let eqp = gridData[i].MACHINENAME

                let prodData = alasql(`select PRODUCTSPECNAME from ? where PROCESSOPERATIONNAME = '${step}' and MACHINENAME = '${eqp}'`,[rawData])

                //process active prod -> 1
                prodData.forEach(prodRec=>{

                    let prod = prodRec.PRODUCTSPECNAME

                    gridData[i][prod] = 1
                })

                //process inactive prod -> 0
                for(let col in gridData[i]){
                    if(!gridData[i][col])
                        gridData[i][col] = 0
                }


            }
   
            stepCombo.define("options",{
                selectAll:true,
                data:stepComboItems
            })
            stepCombo.define("value",stepComboValStr)
            stepCombo.refresh()

            prodCombo.define("options",{
                selectAll:true,
                data:prodComboItems
            })
            prodCombo.define("value",prodComboValStr)
            prodCombo.refresh()

            grid.refreshColumns()

            //set rowspan
            for(let i =0;i<operas.length;i++){
                // this.spans.push([i*machs.length+1,"OPERATION",1,machs.length,null,"rowspancenter"])
                this.spans.push([i*machs.length+1,"PROCESSOPERATIONNAME",1,machs.length,null,"rowspancenter"])
            }

            //test data
            // this.printData(gridData,0)
            console.log('grid data',gridData)

            //set data
            grid.define("data",{
                data:gridData,
                spans:this.spans
            })
            // grid.define("leftSplit",3)
            // grid.addSpan(1,"PROCESSOPERATIONNAME",1,machs.length);
            grid.refresh()
            grid.hideOverlay()
        })

        this.isFirstLoad = false
    }

    onReloadBtnClick = (id)=>{
        this.loadData()
    }

    onSaveBtnClick = async (id)=>{

        let factory = txtStore.FACTORY.ARRAY
        let modu = txtStore.MODULE.PHOTO
        let setTable = txtStore.SET_TABLES.SET_TPFOMPOLICY

        let setTabVo = new SetTableVO(setTable,factory,modu)

        let checkAnotherVerFn = (callback)=>{
           
            gModel.selectLatestSetTableVersion(txtStore.MODULE.PHOTO,txtStore.SET_TABLES.SET_TPFOMPOLICY,verObjs=>{
                let latestParentId = verObjs[0].ID

                callback(this.currentParentId===latestParentId)
            })

        }

        let insertToSetTabFn = (guid,callback)=>{

            let grid:webix.ui.datatable = $$(SetTpfompolicy.viewIds.tpfomGrid)

            //get data from datatable
            let data = gCtrl.getAllDataFromGrid(grid)

            let insertData = []
            let insertSqls = []

            data.forEach((row,rIdx )=> {
                for(let col in row){
                    if(col !=='OPERATION' && col!== 'MACHINENAME' && col !== 'PROCESSOPERATIONNAME' && col !== 'id'){

                        insertData.push({
                            PARENTID:guid,
                            FACTORYNAME:"ARRAY",
                            // OPERATION:row.OPERATION,
                            PROCESSOPERATIONNAME:row.PROCESSOPERATIONNAME,
                            MACHINENAME:row.MACHINENAME,
                            PRODUCTSPECNAME:col,
                            ACTIVE:(row[col]===1)?"Y":"N"
                        })
    
                    }
                }
            });
            
            let insertSql = "insert all "
            insertData.forEach((rec,idx)=>{

                if(rec.PRODUCTSPECNAME==='P'){
                    console.log(rec)
                }

                insertSql+=`\n into set_tpfompolicy(PARENTID,FACTORYNAME,PROCESSOPERATIONNAME,MACHINENAME,PRODUCTSPECNAME,ACTIVE,UPDATE_TIME)
                values('${rec.PARENTID}','${rec.FACTORYNAME}','${rec.PROCESSOPERATIONNAME}','${rec.MACHINENAME}','${rec.PRODUCTSPECNAME}','${rec.ACTIVE}',sysdate) `

                //insert every 300-records
                if(idx%300===299 || idx===insertData.length-1){
                    insertSql += "\n select * from dual"
                    insertSqls.push(insertSql)
                    insertSql="insert all "
                }
                
            })

            /*
            let promises = []

            insertSqls.forEach(sql=>{
                setTimeout(()=>{
                    promises.push(new Promise((resolve,reject)=>{
                        model.insertTpfompolicy(sql,resp=>{})
                    }))    
                },100)
                
            })

            Promise.all(promises).then(values => { 
                console.log(values); // [3, 1337, "foo"] 
              });
*/
            
            //declare recursive fn for batch insert
            let batchInsert = (idx)=>{
                model.insertTpfompolicy(insertSqls[idx],resp=>{
                    if(idx<insertSqls.length-2){//before last
                        batchInsert(idx+1)
                    }else{//last batch
                        //insert a new version
                        console.log('batch: '+idx)
                        callback()
                    }  
                })                 
            }

            //start batch insert
            batchInsert(0)

        }

        let insertToVerTabFn = (guid,callback)=>{
            gModel.insertSetVerCtrl(guid,txtStore.FACTORY.ARRAY,txtStore.MODULE.PHOTO,'',txtStore.SET_TABLES.SET_TPFOMPOLICY,gStore.user,()=>{

                // let savingEdTime = new Date()
                // let savingTime = savingEdTime.getTime()-savingStTime.getTime()
                // console.log('saving time: '+savingTime/1000+'s')

                callback()
            })        
        }

        let reloadFn = (callback)=>{
            this.loadData()
            callback()
        }


        oCtrl.runSavingFlow(setTabVo,checkAnotherVerFn,insertToSetTabFn,insertToVerTabFn,reloadFn)

        /*old precess*/
        /*
        oCtrl.confirmSaving(()=>{

            let grid:webix.ui.datatable = $$(SetTpfompolicy.viewIds.tpfomGrid)
            let insertData = []
            let insertSqls = []

            let data = []
            let rawData = grid.data.pull

            for(let i in rawData){
                data.push(rawData[i])
            }

            grid.showOverlay(gCtrl.SAVING)

            webix.alert({
                text:"This saving will be required about 30~60s, don't leave the page before success message showing."
            });

            // this.printData(data,1)

            let savingStTime = new Date()

            gModel.getGUID(guid=>{

                data.forEach((row,rIdx )=> {
                    for(let col in row){
                        if(col !=='OPERATION' && col!== 'MACHINENAME' && col !== 'PROCESSOPERATIONNAME' && col !== 'id'){

                            insertData.push({
                                PARENTID:guid,
                                FACTORYNAME:"ARRAY",
                                // OPERATION:row.OPERATION,
                                PROCESSOPERATIONNAME:row.PROCESSOPERATIONNAME,
                                MACHINENAME:row.MACHINENAME,
                                PRODUCTSPECNAME:col,
                                ACTIVE:(row[col]===1)?"Y":"N"
                            })
        
                        }
                    }
                });
                
                let insertCnt = 0
                let insertSql = "insert all "
                insertData.forEach((rec,idx)=>{
                    insertCnt++
                    insertSql+=`\n into set_tpfompolicy(PARENTID,FACTORYNAME,PROCESSOPERATIONNAME,MACHINENAME,PRODUCTSPECNAME,ACTIVE,UPDATE_TIME)
                    values('${rec.PARENTID}','${rec.FACTORYNAME}','${rec.PROCESSOPERATIONNAME}','${rec.MACHINENAME}','${rec.PRODUCTSPECNAME}','${rec.ACTIVE}',sysdate) `

                    //insert every 200-records
                    if(idx%300===299 || idx===insertData.length-1){
                        insertSql += "\n select * from dual"
                        insertSqls.push(insertSql)
                        insertSql="insert all "
                        insertCnt = 0
                    }
                    
                })

                let batchInsert = (idx)=>{
                    
                    model.insertTpfompolicy(insertSqls[idx],()=>{
                        
                        if(idx<insertSqls.length-1){//before last
                            batchInsert(idx+1)
                        }else{//last batch
                            //insert new version
                            gModel.insertVerCtrl(guid,'ARRAY','PHOTO','','SET_TPFOMPOLICY',gStore.user,()=>{
                                //successful?
                                webix.message(gCtrl.SAVESUCCESS)
                                grid.hideOverlay()

                                let savingEdTime = new Date()
                                let savingTime = savingEdTime.getTime()-savingStTime.getTime()

                                console.log('saving time: '+savingTime/1000+'s')

                                this.loadData()
                            })
                        }
                        
                    })                 
                }

                //start batch insert
                batchInsert(0)

            
            })
        })
        */
    }

    onProdComboItemClick(id,e){

        let combo:webix.ui.multicombo = $$(SetTpfompolicy.viewIds.prodCombo)
        let grid:webix.ui.datatable = $$(SetTpfompolicy.viewIds.tpfomGrid)

        let val = combo.getValue()        

        let list = <any>(combo.getList())

        
        list.serialize().forEach(item=>{

            let hn = grid.getHeaderNode(item.id)

            if(item.$checked===0 && hn != null)
                grid.hideColumn(item.id)
            else if(item.$checked===1 && hn==null)
                grid.showColumn(item.id)

            // grid.refreshColumns()
        })

        
        
    }

    onStepComboItemClick = ()=>{

        let combo:webix.ui.multicombo = $$(SetTpfompolicy.viewIds.stepCombo)
        let grid:webix.ui.datatable = $$(SetTpfompolicy.viewIds.tpfomGrid)
        let val = combo.getValue()        
        let list = <any>(combo.getList())

        grid.filter("PROCESSOPERATIONNAME",)
        console.log(val)

        let vs = val.split(/,/)

        // list.serialize().forEach(item=>{ }
        grid.filter(rec=>{
            let step = rec.PROCESSOPERATIONNAME
            let isMatched = false

            vs.every(v=>{
                if(step===v){
                    isMatched = true
                    return false
                }else{
                    return true
                }
                
            })

            if(isMatched)
                return rec
        })

    }    


    onAddProdBtnClick=()=>{

        let winId = "prodWin"
        if($$(winId))
            return

        webix.ui({
                view:"window",
                id:winId,
                height:150,
                width:300,
                left:50, top:50,
                move:true,
                // close:true,//webix 6.3 feasible
                position:"center",
                // resize: true,
                head:{
                    view:"toolbar", 
                    paddingX:10,
                    cols:[
                        {
                            view:"label",
                            label: "Add" ,
                            width:120
                        },
                        {},
                        {
                            view:"button",
                            type:"icon",
                            width:20,
                            icon:"wxi-close" ,
                            click:function(){
                                $$(winId).close();
                            }
                        }
                    ]
                },
                body:{
                    view:"form",
                    id:"prodForm",
                    elements:[
                        {
                            view:"text",
                            id:"prodText",
                            name:"prod",
                            label:"Product Name",
                            labelWidth:120
                        },
                        { view:"button", value: "Add", click:()=>{
                            
                            let win:webix.ui.window = $$(winId)
                            let prodCombo:webix.ui.combo = $$(SetTpfompolicy.viewIds.prodCombo)

                            if ((<any>$$("prodForm")).validate()){   
                                
                                let grid:webix.ui.datatable = $$(SetTpfompolicy.viewIds.tpfomGrid)
                                let text:webix.ui.text = $$("prodText")
                                let newProd = text.getValue()
                                let data = grid.serialize()

                                //add prod to data
                                data.forEach(rec=>{
                                    rec[newProd] = 0
                                })

                                grid.define("data",{
                                    data:data,
                                    spans:this.spans
                                })

                                //add prod to column
                                grid.config.columns.splice(3,0,{
                                    id:newProd,
                                    header: {text:newProd,css:{"text-align":"center"}},
                                    width:140,
                                    editor:"checkbox",
                                    css:{"align-items":"center"},
                                    template:"{common.checkbox()}",
                                    sort:"int"
                                })
                                grid.refreshColumns()

                                //add prod to combo
                                let comboItems:Array<any> = (<any>prodCombo.getList()).data.order
                                comboItems.unshift(newProd)

                                let newOpt =  {
                                    selectAll:true,
                                    data:comboItems
                                }

                                prodCombo.define("options",newOpt)

                                let comboVal = prodCombo.config.value
                                comboVal+=","+newProd
                                prodCombo.define('value',comboVal)
                                prodCombo.refresh()

                                win.close()
                            }else{
                                webix.message({ type:"error", text:"Form data is invalid" });
                            }
                                
                            }

                        }
                    ],
                    rules:{
                        "prod":webix.rules.isNotEmpty
                    },
                }
            }).show()
   
    }


}