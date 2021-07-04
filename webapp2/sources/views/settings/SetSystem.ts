import { JetView } from "webix-jet"
import {SetSysViewController} from "./SetSystemViewController"
import cmp from "../ComponentFactory"

declare var $$

export default class SetSystem extends JetView{

	ctrl:SetSysViewController = new SetSysViewController(this)

	static viewIds = {
		setSysLayout:"setSysLayout",

		grpCombo:"grpCombo",
		editModeTog:"editModeTog",
		savingNameLab:"savingNameLab",
		enableBtn:"enableBtn",
		resetBtn:"resetBtn",
		loadBtn:"loadBtn",
		saveAsBtn:"saveAsBtn",
		saveBtn:"saveBtn",

		treeTab:"treeTab",

		saveWin:"saveWin",
		saveNameTxt:"saveNameTxt",
		saveGrid:"saveGrid",

		loadWin:"loadWin",
		loadGrid:"loadGrid"
	}

	static isDataValid = true

    static invalidationMsg = {}//propertno : rule

	config(){
/*
		webix.editors['transform'] = {
			focus:function(){
				this.getInputNode(this.node).focus();
				this.getInputNode(this.node).select();
			},
			getValue:function(){
				return this.getInputNode(this.node).value;
			},
			setValue:function(value){
				this.getInputNode(this.node).value = value;
			},
			getInputNode:function(){
				return this.node.firstChild;
			},
			render:function(){

				console.log('trans')

				return webix.html.create("div", {
					"class":"webix_dt_editor"
				}, "<input type='text'>");
			}
		}*/

		let treetab = {
			view:"treetable",
			id:SetSystem.viewIds.treeTab,
			editable:true,
			dragColumn:true,
			resizeColumn: { headerOnly: true },
			//filter all node
			filterMode:{
				level:1
			},
			columns:[
			    { id:"TEXT",header:"Property", width:400, template:"{common.treetable()} #TEXT#" },
			    {
					id:"PROPERTYVALUE",
					header:"Value",
					width:150,
					editor:"inline-text",
					// editor:"transform",
					// liveEdit:true,
					template:(obj)=>{

						//customize editor
						//set value to grid store
						let onchange = `console.log('chg:',this.value,this);
						this.setAttribute('value', this.value);
						var grid = $$('${SetSystem.viewIds.treeTab}');
						for(var i in grid.data.pull){
							var row = grid.data.pull[i];
							if(row.PROPERTYNO === this.getAttribute('id')){
								row.PROPERTYVALUE = this.value; 
							}
						}`

						let onkeyup = `console.log('onkeyup')

						let el = arguments[0].target
						let type = el.getAttribute('type')
						let oldVal = el.getAttribute('value')

						if(type==='number'){
							
							if(el.value === ''){
								el.value = oldVal
								webix.message({
									type:'error',
									text:'值必须介于 '+min+' ~ '+max
								})
							}else{
								let val = Number(el.value)
								let maxTxt = el.getAttribute('max')
								let minTxt = el.getAttribute('min')
								let max = Number(el.getAttribute('max'))
								let min = Number(el.getAttribute('min'))

								if(maxTxt && minTxt){
									if(val>max){
										el.value = max
										webix.message({
											type:'error',
											text:'值必须介于 '+min+' ~ '+max
										})
									}

									if(val<min){
										el.value = min
										webix.message({
										type:'error',
										text:'值必须介于 '+min+' ~ '+max
										})
									}

								}else if(minTxt && val<min){
									el.value = min
									webix.message({
									type:'error',
									text:'值必须小于 '+min
									})
								}else if(maxTxt && val>max){
									el.value = max
									webix.message({
									type:'error',
									text:'值必须大於于 '+max
									})
								}	
							}
						}`

						let html = `<${obj.HTML_EL} style="width:100px;" onchange="${onchange}" onkeyup="${onkeyup}" `

						// let val = obj.PROPERTYVALUE
						if(obj.HTML_EL==='select'){
							html = `${html} id="${obj.PROPERTYNO}">`//value="${obj.PROPERTYVALUE}"

							let optStr = <string>obj.OPTIONS
							let opts = optStr.split(/,/)
							let optEls = ''

							if(optStr.includes(':')){
								opts.forEach(item=>{
									let vt = item.split(/:/)
									if(obj.PROPERTYVALUE==vt[0].trim())
										optEls += '<option value="'+vt[0].trim()+'" selected>'+vt[1].trim()+'</option>'
									else
										optEls += '<option value="'+vt[0].trim()+'">'+vt[1].trim()+'</option>'
								})
							}else{
								opts.forEach(item=>{

									if(obj.PROPERTYVALUE==item.trim())
										optEls += '<option selected>'+item.trim()+'</option>'
									else
										optEls += '<option>'+item.trim()+'</option>'

								})
		
							}
							html+=optEls+'</select>'
						}else{
							// html = `<${obj.HTML_EL} ${obj.ATTR} value="${obj.PROPERTYVALUE}" propertyno="${obj.PROPERTYNO}">`
							html = `${html} id="${obj.PROPERTYNO}"`//value="${obj.PROPERTYVALUE}"
							html = `${html} ${obj.ATTR} value="${obj.PROPERTYVALUE}">`
						}

						if(obj.HINT==null)
							return html
						else
							return html+" "+obj.HINT
					}/*,no effect
					editparse:(val)=>{
						console.log('editparse: ',val)
						return val
					}*/
				}
			]
			,on:{
				onAfterEditStop:(state, editor, ignoreUpdate)=>{

					// console.log('af edit stop',state,editor)

					//webix does not support value binding of select element
					let treeTb = <webix.ui.treetable>$$(SetSystem.viewIds.treeTab)

					if(!treeTb)
						return

					let rec = treeTb.data.pull[editor.row]	

					//bind value with select element
					if(rec.HTML_EL === 'select'){

						let newv = (<HTMLSelectElement>document.getElementById(rec.PROPERTYNO)).value

						if(newv == undefined)
							debugger

						rec.PROPERTYVALUE = newv

					}else{

					}
				},onAfterRender:()=>{

					let editModeTog = $$(SetSystem.viewIds.editModeTog)
			
					let colDom =document.getElementsByClassName('webix_column webix_last')[0]

					if(!colDom)
						return

					let  editorCells = [].slice.call(colDom.children)
					
					//edit mode
					if(editModeTog.getValue()==1){
						editorCells.forEach(el=>{
							if(el.firstChild)
								el.firstChild.disabled = false
						})
					}else{
						editorCells.forEach(el=>{
							if(el.firstChild)
								el.firstChild.disabled = true
						})
					}
				}
				/*,//it seems sometimes not work!!!
				onEditorChange:(cell,val)=>{
					let treeTb = <webix.ui.treetable>$$(SetSystem.viewIds.treeTab)
					let rec = treeTb.data.pull[cell.row]
					if(rec.HTML_EL === 'select'){

						let newv = (<HTMLSelectElement>document.getElementById(rec.PROPERTYNO)).value

						if(newv == undefined)
							debugger

						rec.PROPERTYVALUE = newv

					}
				}*/
					
			}/*,
			rule:{
				"PROPERTYVALUE":val=>{
					
					console.log('validate: ',val)
				

				   return true
				}

			}*/
		}


		let grpCombo = cmp.initGrpCombo(SetSystem.viewIds.grpCombo,this.ctrl.onGrpComboChange)

		let layout = {
			id:SetSystem.viewIds.setSysLayout,
			rows:[
				{
					margin:10,
					cols:[
						{ 
							view:"toggle",
							id: SetSystem.viewIds.editModeTog,
							type:"icon",
							width:38,
							offIcon:"wxi-pencil", 
							onIcon:"wxi-pencil",
							value:0,
							tooltip:"view/edit mode",
							on:{
								onChange:this.ctrl.onToggleChange
							}
	
						},
						grpCombo,
						{},
						{
							view:"label",
							id:SetSystem.viewIds.savingNameLab,
							// label:"Name:",
							width:270,
							height:20,
							borderless:true
						},
						{},
						{
							view:"button",
							id:SetSystem.viewIds.loadBtn,
							type:"icon",
							icon:"wxi-dots",
							label:"Load",
							width:100,
							click:this.ctrl.onLoadBtnClick
						},
						{
							view:"button",
							id:SetSystem.viewIds.enableBtn,
							type:"icon",
							icon:"wxi-check",
							disabled:true,
							label:"Enable",
							width:100,
							click:this.ctrl.onEnableBtnClick,
							on:{
								onAfterRender:()=>{
									$$(SetSystem.viewIds.enableBtn).$view.title = 'This version has already enabled'
								}
							}

						},
						{
							view:"button",
							id:SetSystem.viewIds.resetBtn,
							label:"Reset",
							type:"icon",
							icon:"wxi-sync",
							hidden:true,
							width:100,
							click:this.ctrl.onReloadBtnClick
						},
						{
							view:"button",
							id:SetSystem.viewIds.saveAsBtn,
							type:"icon",
							icon:"wxi-check",
							label:"Save",
							hidden:true,
							width:120,
							click:this.ctrl.onSaveAsBtnClick
						}
						// {
						// 	view:"button",
						// 	id:SetSystem.viewIds.saveBtn,
						// 	type:"icon",
						// 	icon:"wxi-check",
						// 	label:"Save",
						// 	hidden:true,
						// 	width:100,
						// 	click:this.ctrl.onSaveBtnClick
						// }	
					]
				},
				treetab
			]
		}

		return layout
	}

	init  = this.ctrl.init
}