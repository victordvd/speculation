import TopViewController from "./TopViewController"
import Top from "./Top"
import gMod from "../models/GlobalModel"
import gCtrl from "../controllers/GlobalController"
import oCtrl from "../controllers/OperationController"
import vCtrl from "../controllers/VersionController"
import gStore from "../store/GlobalStore"
import txtStore from "../store/TextStore"
import DspBackup from "./DspBackup"
import DspBackupModel from "../models/DspBackupModel"

declare var $$

export default class DspBackupViewController{

    mod = new DspBackupModel()

    init= ()=>{
        let updBar = $$(Top.viewIds.updBar)
        updBar.hide()

        gCtrl.checkCookie(()=>{

            this.loadData()
            vCtrl.setLoadDataFn(this.loadData)
        })
    }

    loadData = async ()=>{

        let data = await this.mod.selectDspBackup()

        let grid:webix.ui.datatable = $$(DspBackup.viewIds.dspGrid)

        grid.clearAll()
        grid.parse(data,'json')
        grid.refresh()

    }

    onReloadBtnClick = ()=>{
        this.loadData()
    }

}