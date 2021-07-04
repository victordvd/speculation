import {JetApp,plugins} from "webix-jet";
import "./styles/app.css";
import ResultViewController from "./views/ResultViewController"

declare var APPNAME;
declare var VERSION;
declare var PRODUCTION;
declare var BUILD_AS_MODULE;
declare var webix;
// declare var EmptyRouter
// declare var HashRouter
// declare var Gantt

declare global {
    interface Window {
        gantt: any
    }
}

if (!BUILD_AS_MODULE){
	webix.ready(() => {

		console.log('webix ready')

		webix.protoUI({
			name:"dhx-gantt",
			defaults:{
				on:{

				}
			},
			$init:function(){
				this._waitGantt = webix.promise.defer();
				webix.delay(webix.bind(this._render_once, this));

				// this.attachEvent("onViewResize", function(){
				// 	webix.message("af");
				// });
				// this.attachEvent("onMouseOut", function(e){
				// 	console.log('mo')
				// });

				// this.$view.onmouseout = ()=>{
				// 	console.log('om')
				// 	setTimeout(()=>{
				// 		//remove remaining gantt tip
				// 		let tipCl:HTMLCollection = document.getElementsByClassName('gantt_tooltip')
				// 		if(tipCl.length>0)
				// 			tipCl[0].remove()
				// 	},1000)		
				// }
			},
			getGantt:function(waitGantt){
				return waitGantt ? this._waitGantt : this._gantt;
			},
			$setSize: function(x,y){
				if(webix.ui.view.prototype.$setSize.call(this,x,y)){
					// console.log('gantt resize')
					// if(this._gantt){
					// 	this._gantt.render();
					// 	ResultViewController.setGanttProdInfoText()
					// }
					
				}
			},
			_render_once:function(){
				
				if (this.config.cdn === false){
					this._after_render_once();
					return;
				}
		
				// var cdn = this.config.cdn || "https://cdn.dhtmlx.com/gantt/5.2";
				// var skin = this.config.skin;
				var sources = [];
				
				// sources.push(cdn+"/dhtmlxgantt.js");
				// sources.push(cdn+(skin ? "/skins/dhtmlxgantt_"+skin+".css" : "/dhtmlxgantt.css"));
				sources.push("lib/gantt_6.1.2_commercial/codebase/dhtmlxgantt.js");
				sources.push("lib/gantt_6.1.2_commercial/codebase/ext/dhtmlxgantt_tooltip.js");
				sources.push("lib/gantt_6.1.2_commercial/codebase/dhtmlxgantt.css");
				webix.require(sources)
				.then( webix.bind(this._after_render_once, this) )
				.catch(function(e){
					console.log(e);
				});
			},
			_after_render_once:function(){
				var gantt = this._gantt =/* window.Gantt ? Gantt.getGanttInstance() : */window.gantt;
		
				if (this.config.init)
					this.config.init.call(this, gantt);
				
				if(this.$view)
					gantt.init(this.$view);
				if (this.config.ready)
					this.config.ready.call(this, gantt);
		
				this._waitGantt.resolve(gantt);
			}
		}, webix.ui.view);

		let app = new MyApp()
		// app.use(plugins.Locale,{ lang:"cn" });
		app.use(plugins.Locale,{ lang:"en" });
		
		return app.render();
	} );
}


export default class MyApp extends JetApp{
	constructor(config={}){
		const defaults = {
			id 		: APPNAME,
			version : VERSION,
			debug 	: !PRODUCTION,
			// start 	: "/Login"//起始頁面
			// start 	: "/Login"//起始頁面
			start 	: "/Top/Result"
			// start 	: "/Test"
		};

		console.log(defaults,config)

		super({ ...defaults, ...config });
	}
}