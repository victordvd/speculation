
export default class CommonController{

    static getDateStr(dt:Date,spliter:string){


        let y = dt.getFullYear()
        let m = (dt.getMonth()>=9)?dt.getMonth()+1:'0'+dt.getMonth()
        let d = (dt.getDate()>=9)?dt.getDate()+1:'0'+dt.getDate()

        return y+spliter+m+spliter+d
    }

    static getTimeStr(dt:Date,spliter:string){

        let y = String(dt.getFullYear())
        let m = (dt.getMonth()>=9)?dt.getMonth()+1:'0'+dt.getMonth()
        let d = (dt.getDate()>=9)?dt.getDate()+1:'0'+dt.getDate()
        let h = (dt.getHours()>=10)?dt.getHours():'0'+dt.getHours()
        let min = (dt.getMinutes()>=10)?dt.getMinutes():'0'+dt.getMinutes()
        let s = (dt.getSeconds()>=10)?dt.getSeconds():'0'+dt.getSeconds()

        if(spliter)
            return y+spliter+m+spliter+d+' '+h+':'+min+':'+s
        else
            return y+m+d+h+min+s
    }
}