import Top from "./Top"
import gCtrl from "../controllers/GlobalController"
import mod from "../models/ReserveModel"
import OptReserve from "./OptReserve"
// import gMod from "../models/GlobalModel"
// import TopViewController from "./TopViewController"
// import oCtrl from "../controllers/OperationController"
// import vCtrl from "../controllers/VersionController"
// import gStore from "../store/GlobalStore"
// import txtStore from "../store/TextStore"

export default class OptReserveViewController{


    init = ()=>{
        let updBar = $$(Top.viewIds.updBar)
        updBar.hide()

        gCtrl.checkCookie(()=>{
            this.loadData()
        })
    }

    loadData = async()=>{

        let grid:any = $$(OptReserve.viewIds.rsvGrid)

        let data = await mod.selectOptReserveData()

        grid.clearAll()
        grid.parse(data,'json')
        grid.refresh()
        
    }

    onReloadBtnClick = ()=>{
        this.loadData()
    }
    
}


