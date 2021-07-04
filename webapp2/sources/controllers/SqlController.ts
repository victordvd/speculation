export default class SqlController{


    static nullOrString = (val:string)=>{

        if(val==null)
            return `''`
        else
            return `'${val}'`

    }



}