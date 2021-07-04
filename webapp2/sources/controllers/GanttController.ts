

export default class GanttController{

      static processLotData = (output)=> {

        let newOutput = []

        //add dummy task
        for (let i = 0; i <output.length; i++) {
        }

        let preJob = null;
        let preEqp = null;
        let preJobText = null
        //edIdx
        let jobChgStIdx = 0
        //{sIdx,eIdx,text}
        let jobChgObjs = []

        /*資料處理*/
        let tmp9998rec
        let preVisibleTask
        for (let i = 0; i <output.length; i++) {

            let task = output[i]
            let seq = task.seq
            let dummy = task.dummy

            if(dummy){
                let dummyTask = Object.assign({},task)

                dummyTask.start_date = dummy
                dummyTask.end_date = task.start_date
                dummyTask.isDummy = true

                newOutput.push(dummyTask)
            }

            //dates can't be null
            if(task.start_date==null){
                task.start_date = ''
                task.unscheduled = true
            }
            if(task.end_date==null){
                task.end_date = ''
                task.unscheduled = true
            }

            if (task.parent == 0) {
                task.render = "split";

            } else {

                let step = ''
                if(task.step_id_target)
                    step = task.step_id_target.substring(0,4)
                    
                let curJob = task.prod_id +'-'+ step
                let curJobText = (task.text)?task.text.substring(2,4) +'<br>'+ step:''
                let curEqp = task.parent_text

                //first task of eqp has no change
                if (curEqp!=preEqp) {

                    //set start_date to 9998 task
                    if(tmp9998rec && preVisibleTask){
                        tmp9998rec.start_date = preVisibleTask.end_date
                    }
                    
                    task.jobChg = false
                    if(preJob!=null&&!preJob.includes('null')){

                        if(tmp9998rec){//if there's 9998 in eqp seq, set first lot as no jc
                            output[jobChgStIdx].jobChg = false
                        }

                        jobChgObjs.push({text:preJobText,sIdx:jobChgStIdx,eIdx:i-1})
                    }

                    tmp9998rec = null
                    preVisibleTask = null
                    jobChgStIdx = i
                    // jobChgObjs.push({text:preJob,sIdx:i})
                } else {

                    if(curJob === preJob){
                        task.jobChg = false
                    }else{
                        task.jobChg = true

                        if(preJob!=null&&!preJob.includes('null')){
                            jobChgObjs.push({text:preJobText,sIdx:jobChgStIdx,eIdx:i-1})
                        }
                        jobChgStIdx = i
                    }
                }

                if(i===output.length-1){
                    if(tmp9998rec && tmp9998rec.parent_text == curEqp){
                        tmp9998rec.start_date = task.end_date
                        jobChgObjs.push({text:curJobText,sIdx:i,eIdx:output.length-1})
                    }else{
                        jobChgObjs.push({text:preJobText,sIdx:jobChgStIdx,eIdx:output.length-1})
                    }
                }

                if(seq){
                    if(seq<9000 || seq==9994 || seq==9996 || seq==9997){
                        preVisibleTask = task

                    }else if(task.seq == 9998){//reset 9998's start_date
                        tmp9998rec = task
                    }
                }
                preJobText = curJobText 
                preJob = curJob
                preEqp = curEqp
            }


            newOutput.push(task)
        }

        // return [newOutput,jobChgObjs]
        return [output,jobChgObjs]
    }




}