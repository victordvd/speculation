"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var webix_jet_1 = require("webix-jet");
require("./styles/app.css");
if (!BUILD_AS_MODULE) {
    webix.ready(function () {
        console.log('webix ready');
        webix.protoUI({
            name: "dhx-gantt",
            defaults: {
                on: {}
            },
            $init: function () {
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
            getGantt: function (waitGantt) {
                return waitGantt ? this._waitGantt : this._gantt;
            },
            $setSize: function (x, y) {
                if (webix.ui.view.prototype.$setSize.call(this, x, y)) {
                    // console.log('gantt resize')
                    // if(this._gantt){
                    // 	this._gantt.render();
                    // 	ResultViewController.setGanttProdInfoText()
                    // }
                }
            },
            _render_once: function () {
                if (this.config.cdn === false) {
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
                    .then(webix.bind(this._after_render_once, this))
                    .catch(function (e) {
                    console.log(e);
                });
            },
            _after_render_once: function () {
                var gantt = this._gantt = /* window.Gantt ? Gantt.getGanttInstance() : */ window.gantt;
                if (this.config.init)
                    this.config.init.call(this, gantt);
                if (this.$view)
                    gantt.init(this.$view);
                if (this.config.ready)
                    this.config.ready.call(this, gantt);
                this._waitGantt.resolve(gantt);
            }
        }, webix.ui.view);
        var app = new MyApp();
        // app.use(plugins.Locale,{ lang:"cn" });
        app.use(webix_jet_1.plugins.Locale, { lang: "en" });
        return app.render();
    });
}
var MyApp = /** @class */ (function (_super) {
    __extends(MyApp, _super);
    function MyApp(config) {
        if (config === void 0) { config = {}; }
        var _this = this;
        var defaults = {
            id: APPNAME,
            version: VERSION,
            debug: !PRODUCTION,
            // start 	: "/Login"//起始頁面
            // start 	: "/Login"//起始頁面
            start: "/Top/Result"
            // start 	: "/Test"
        };
        console.log(defaults, config);
        _this = _super.call(this, __assign({}, defaults, config)) || this;
        return _this;
    }
    return MyApp;
}(webix_jet_1.JetApp));
exports.default = MyApp;
//# sourceMappingURL=myapp.js.map