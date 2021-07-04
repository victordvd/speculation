import {JetView, plugins} from "webix-jet"
import TopViewController from "./TopViewController"
import gStore from "../store/GlobalStore"
import gCtrl from "../controllers/GlobalController"
import vCtrl from "../controllers/VersionController"

declare var version
declare var environment

export default class Top extends JetView{

	static viewIds = {
		topView:"topView",
		appMenu:"appMenu",
		updBar:"updBar",
		curUserLab:"curUserLab",
		updUserLab:"updUserLab",
		updTimeLab:"updTimeLab",
		nameLab:"nameLab",
		maskSwi:"maskSwi",
		topWide:"topWide",
		subView:"subView"
	}

	static ViewNames = {
		Login:"Login",
		OverviewSchedule:"OverviewSchedule",
		MaskTransfer:"settings.MaskTransfer",
		MatchRate:"settings.MatchRate"
	}

	static menuItems_l = [
		// { value:`<span style="color:darkturquoise">u-Scheduling Result(all)</span>`, id:"AllGroupGantt", icon:"wxi-columns"},
		// { value:`<span style="color:darkturquoise">Schedule (overview)</span>`, id:Top.ViewNames.OverviewSchedule, icon:"wxi-columns"},
		{ value:`<span style="color:darkturquoise">Schedule</span>`, id:"Result", icon:"wxi-columns"},
		// { $template:"Separator" },
		// { value:"Job Change", id:"JobChange",  icon:"wxi-columns" },
		// { value:"Schedule Backup", id:"DspBackup",  icon:"wxi-columns" },
		// { value:"Machine Capacity", id:"SetTpfompolicy", icon:"wxi-columns" },
		// { value:"Mask Transfer", id:Top.ViewNames.MaskTransfer, icon:"wxi-pencil" },
		// { value:"拉货清单", id:"OptReserve", icon:"wxi-columns" },
		// { $template:"Separator" },
		// { value:"Settings", id:"setting", icon:"wxi-pencil" ,submenu:[
		// 	{ value:"Machine Group", id:"settings.MachineGroup", icon:"wxi-pencil" },
		// 	{ value:"Stocker Transport", id:"settings.StockerSetting", icon:"wxi-pencil" },
		// 	{ value:"Down 机回线", id:"settings.MachineDown", icon:"wxi-pencil" },
		// 	{ value:"Monitor Spec.", id:"settings.MonitorSpec", icon:"wxi-pencil" },
		// 	{ value:"Lot Hold", id:"settings.LotHold", icon:"wxi-pencil" },
		// 	{ value:"WIP Weight", id:"settings.WipWeight", icon:"wxi-pencil" },
		// 	{ value:"Q-Time", id:"settings.Qtime", icon:"wxi-pencil" },
		// 	{ value:"Match Rate", id:Top.ViewNames.MatchRate, icon:"wxi-pencil" }
		// ]},
		{ $template:"Separator" }
		
	]

	static menuItems_h = [
		{ value:`<span style="color:darkturquoise">Schedule (overview)</span>`, id:Top.ViewNames.OverviewSchedule, icon:"wxi-columns"},
		{ value:`<span style="color:darkturquoise">Schedule (by group)</span>`, id:"Result", icon:"wxi-columns"},
		{ $template:"Separator" },
		{ value:"Job Change", id:"JobChange",  icon:"wxi-columns" },
		{ value:"Schedule Backup", id:"DspBackup",  icon:"wxi-columns" },
		{ value:"Machine Capacity", id:"SetTpfompolicy", icon:"wxi-columns" },
		{ value:"Mask Transfer", id:Top.ViewNames.MaskTransfer, icon:"wxi-pencil" },
		{ value:"拉货清单", id:"OptReserve", icon:"wxi-columns" },
		{ $template:"Separator" },
		{ value:"Settings", id:"setting",icon:"wxi-drag" ,submenu:[
			{ value:"Set System", id:"settings.SetSystem", icon:"wxi-pencil" },
			{ value:"Machine Group", id:"settings.MachineGroup", icon:"wxi-pencil" },
			{ value:"Stocker Transport", id:"settings.StockerSetting", icon:"wxi-pencil" },
			{ value:"Down 机回线", id:"settings.MachineDown", icon:"wxi-pencil" },
			{ value:"Monitor Spec.", id:"settings.MonitorSpec", icon:"wxi-pencil" },
			{ value:"Lot Hold", id:"settings.LotHold", icon:"wxi-pencil" },
			{ value:"WIP Weight", id:"settings.WipWeight", icon:"wxi-pencil" },
			{ value:"Q-Time", id:"settings.Qtime", icon:"wxi-pencil" },
			{ value:"Match Rate", id:Top.ViewNames.MatchRate, icon:"wxi-pencil" }
			]
		},
		{ $template:"Separator" }
	]

	ctrl = new TopViewController(this)

	config(){

		// const _ = this.app.getService("locale")._
		const _ = (val)=>{return val}

		let menu = {
				view:"menu",
				id:Top.viewIds.appMenu, 
				subMenuPos:"right",
				css:"app_menu",
				width:200, 
				layout:"y", 
				submenuConfig:{
					width:200
				},
				select:true,
				template: (obj)=>{
					return "<span class='webix_icon "+obj.icon+"'></span> "+_(obj.value)
				},
				data:Top.menuItems_l,
				on:{
					onMenuItemClick:this.ctrl.onMenuItemClick
				},
				type:{
					subsign:true
				}   
		}

		var ui = {
			id:Top.viewIds.topView,
			type:"accordion", 
			paddingX:5, 
			css:"app_layout", 
			rows:[
				// {height:90},
				{
					cols:[
						{  	
							header:"u-Scheduling"+environment,
							// css:{"background-color": "#EBEDF0"},
							body:{
								// paddingX:5,
								// paddingY:10, 
								rows: [ 
									{
										css:"webix_shadow_medium", 
										rows:[
											menu,
											{
												view:"switch",
												id:Top.viewIds.maskSwi,
												labelWidth:120,
												label:"Mask Alarm",
												value:1
												// click:this.ctrl.onMaskSwitchChange

											},
											{
												view:"button",
												label:"Log out",
												click:this.ctrl.onLogoutBtnClick

											},
											{
												view:"label",
												label: version,
												height: 20,
												css:{"font-size": "8px","text-align":"center"}//,"background-color": "#EBEDF0" cant override parent css
											}
										]
									} 
								]
							}
						},
						{ 
							type:"wide", 
							id:Top.viewIds.topWide,
							paddingY:10, 
							paddingX:5,
						 rows:[
							{ 
								$subview:true,
								id:Top.viewIds.subView
							},
							{
								id:Top.viewIds.updBar,
								borderless:true,
								paddingX:5,
								cols:[
									{
										view:"label",
										id:Top.viewIds.curUserLab,
										label:"Current User:",
										width:270,
										height:20,
										borderless:true
									},	
									{},
									{
										view:"label",
										id:Top.viewIds.nameLab,
										// label:"Name:",
										width:270,
										height:20,
										borderless:true
									},	
									{
										view:"label",
										id:Top.viewIds.updUserLab,
										label:"Update User:",
										width:270,
										height:20,
										borderless:true
									},		
									{
										view:"label", 
										id:Top.viewIds.updTimeLab,
										label:"Update Time:",
										width:270,
										height:20,
										borderless:true
										// align:"right"
									}
								]
							}
						]}
					]
				}
			]
		};

		return ui;
	}

	// init = this.ctrl.init
	// init(){
	// 	//enable menu item href
	// 	// this.use(plugins.Menu, Top.viewIds.appMenu)
	// 	//check version
	// 	vCtrl.triggerOptOutputInterval()
	// }

	init = this.ctrl.init

}