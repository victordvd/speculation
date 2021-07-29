(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{117:function(t,e,n){},192:function(t,e,n){},195:function(t,e,n){"use strict";n.r(e);var i=n(2),o=n.n(i),a=n(73),c=n.n(a),s=(n(117),n(6)),r=n(9),l=n(23),h=n(26),d=n(1),u=n.n(d),p=n(4),v=n(0),f=function(){function t(){Object(s.a)(this,t)}return Object(r.a)(t,null,[{key:"checkNull",value:function(t){return null==t?"-":t}},{key:"getPositionTable",value:function(){return u()("#positionTable")}},{key:"addPosition",value:function(t){console.log("addposi"+t);var e=O.getData().filter((function(e){return e.contract==t.contract&&e.ls==t.ls&&e.cp==t.cp&&e.strike==t.strike}));e.length>0?e[0].addAmount(t.amount):(t.addRow(),O.getData().push(t),O.plotPosition())}},{key:"parsePositionForRaw",value:function(t){var e="Long"==t.ls?g.LONG:g.SHORT,n=t.contract,i="Call"==n.type?m.CALL:m.PUT,o=n.strike,a=t.price,c=t.amount;return P.getTXOInstance(e,i,k.TXO,o,c,a)}},{key:"parsePosition",value:function(t,e){var n="C"==t.type?m.CALL:m.PUT,i=t.strike,o=void 0;return g.LONG===e?o=t.ask:g.SHORT===e&&(o=t.bid),P.getTXOInstance(e,n,k.TXO,i,1,o)}},{key:"createPosiBtn",value:function(e,n){var i=t.parsePosition(e,n),o={border:"1px solid black",padding:"3px"};if(void 0==i.price)return Object(v.jsx)(p.Col,{style:o});return Object(v.jsx)(p.Col,{style:o,children:Object(v.jsxs)("button",{style:{width:"100%"},onClick:function(){i=t.parsePosition(e,n),t.addPosition(i)},children:["    ",i.price]})})}}]),t}();f.posiFn={};var x=function t(){Object(s.a)(this,t)};x.txoData={};var b=n(108),j=n.n(b),O=function(){function t(){Object(s.a)(this,t),this.profit=void 0,this.settle=void 0,this.strike=void 0,this.cp=void 0,this.ls=void 0,this.price=void 0}return Object(r.a)(t,null,[{key:"getData",value:function(){return this.data}},{key:"getDataJson",value:function(){var t=[];return this.data.forEach((function(e){t.push({contract:e.contract,contractWeek:e.contractWeek,ls:e.ls,cp:e.cp,strike:e.strike,amount:e.amount,price:e.price})})),JSON.stringify(t)}},{key:"addPosition",value:function(t){this.data.push(t)}},{key:"removeAllPosition",value:function(){this.data=[],f.getPositionTable().find("tr:gt(0)").remove(),t.plotPosition()}},{key:"removePosition",value:function(t){var e=void 0;this.data.forEach((function(n,i){n.equals(t)&&(e=i)})),void 0!==e&&this.data.splice(e,1),console.log("removed rec: "+e)}},{key:"plotPosition",value:function(){for(var t=document.querySelector("#fplot"),e=this.getAnalyzeFn();t.firstChild;)t.removeChild(t.firstChild);var n={target:t,tip:{xLine:!0,yLine:!0},grid:!0,yAxis:{label:"Profit (tick)"},xAxis:{domain:[x.txoData.spot-500,x.txoData.spot+500],label:"Settle Price"},data:e.data,annotations:e.annotations},i=u()("#spot").val();i&&n.annotations.push({x:i,text:"spot: "+i}),j()(n)}},{key:"getAnalyzeFn",value:function(){var t=new Set,e=[];return this.data.forEach((function(n){var i,o,a,c,s,r;n.strike,n.strike;n.contract===k.TXO?(s=n.ls===g.LONG?-1:1,1===(r=n.cp===m.CALL?1:-1)?(i=0,o=s*n.price*n.amount,a=-s*r*n.amount,c=(s*n.price+s*r*n.strike)*n.amount):(i=-s*r*n.amount,o=(s*n.price+s*r*n.strike)*n.amount,a=0,c=s*n.price*n.amount),t.add(n.strike),e.push([n.contract,n.strike,[i,o],[a,c]])):(i=n.ls===g.LONG?1*n.amount:-1*n.amount,o=-n.price*n.amount,e.push([n.contract,[i,o]]))})),this.addPosiFunc(Array.from(t),e)}},{key:"addPosiFunc",value:function(t,e){t.push(1/0),t.sort((function(t,e){return t-e}));var n=[],i=[];t.forEach((function(e,o){var a=[[t[o],t[o+1]],0,0];0===o?(n.push([[0,t[0]],0,0]),n.push(a)):o===t.length-1||n.push(a),e!==1/0&&i.push({x:e,text:e})})),0===n.length&&0!==e.length&&n.push([[0,1/0],0,0]),e.forEach((function(t){var e=t[0],i=t[1];n.forEach((function(n){e===k.TXO?n[0][1]<=i?(n[1]+=t[2][0],n[2]+=t[2][1]):(n[1]+=t[3][0],n[2]+=t[3][1]):(n[1]+=t[1][0],n[2]+=t[1][1])}))})),console.log(n);var o=u()("#defaultCost").val(),a=[],c="rgb(255, 0, 0)";return a.push({range:[0,1/0],fn:"0",skipTip:!0}),n.forEach((function(t,e){var i=t[1]+"*x+"+t[2];o>0&&(i+="-"+Number(o)*n.length),console.log(i);var s=c;s=e%2===0?c:"rgb(0, 0, 255)",a.push({range:t[0],fn:i,color:s})})),{annotations:i,data:a}}}]),t}();O.data=[];var g,m,k,C=function t(e,n){Object(s.a)(this,t),this.x=void 0,this.y=void 0,this.x=e,this.y=n},y=function(){function t(){Object(s.a)(this,t)}return Object(r.a)(t,null,[{key:"init",value:function(){t.canvas=document.getElementById("canv"),t.ctx=t.canvas.getContext("2d"),t.y_base=t.canvas.height/2,t.draw(),t.canvas.addEventListener("mousemove",(function(e){t.draw();var n=t.canvas.getBoundingClientRect(),i=e.pageX-Number(n.left.toFixed(0)),o=e.pageY-Number(n.top.toFixed(0)),a=t.min_settle+i*t.settlePerPx,c=0;O.getData().forEach((function(t){c+=t.getProfit(a)})),t.ctx.beginPath(),t.ctx.strokeStyle="green",t.ctx.lineWidth=1,t.ctx.moveTo(i,0),t.ctx.lineTo(i,t.canvas.height),t.ctx.stroke(),t.ctx.fillStyle="#000",t.ctx.font="10px Arial";var s="price: "+a.toString(),r="profit: "+c/t.profitPerPx;t.ctx.measureText(s).width>t.canvas.width-i-10?(t.ctx.textAlign="right",t.ctx.fillText(s,i-10,o+5),t.ctx.fillText(r,i-10,o+15)):(t.ctx.textAlign="left",t.ctx.fillText(s,i+20,o+5),t.ctx.fillText(r,i+20,o+15))})),t.canvas.addEventListener("mouseout",(function(e){t.clear(),t.draw()}))}},{key:"draw",value:function(){var e=this;t.clear(),t.settlePerPx=t.settle_range/t.canvas.width,t.profitPerPx=t.profit_range/t.canvas.height,t.ctx.beginPath(),t.ctx.strokeStyle="black",t.ctx.moveTo(0,t.canvas.height/2),t.ctx.lineTo(t.canvas.width,t.canvas.height/2),t.ctx.stroke(),O.getData().forEach((function(n){var i;i=n.contract===k.TXO?n.strike:50*Number(Number(n.price/50).toFixed(0));var o=t.convertSettleToX(i);t.max_settle=i+t.settle_range/2,t.min_settle=i-t.settle_range/2,n.contract===k.TXO&&(t.ctx.beginPath(),t.ctx.strokeStyle="red",t.ctx.moveTo(o,0),t.ctx.lineTo(o,t.canvas.height),t.ctx.stroke()),t.ctx.fillStyle="Teal ",t.ctx.font="8px Arial",t.ctx.textAlign="center",t.ctx.strokeStyle="black";for(var a=t.min_settle;a<=t.max_settle;a+=50)t.ctx.beginPath(),t.ctx.moveTo(e.convertSettleToX(a),t.canvas.height/2*t.profitPerPx-5),t.ctx.lineTo(e.convertSettleToX(a),t.canvas.height/2*t.profitPerPx+1),t.ctx.stroke(),t.ctx.fillText(a.toString(),e.convertSettleToX(a),t.canvas.height/2*t.profitPerPx+10);e.drawPosition(n)}))}},{key:"convertSettleToX",value:function(e){return(e-t.min_settle)/this.settlePerPx}},{key:"convertProfitToY",value:function(e){return(t.profit_range/2-e)/this.profitPerPx}},{key:"clear",value:function(){t.ctx.fillStyle="#FFF",t.ctx.fillRect(0,0,t.canvas.width,t.canvas.height)}},{key:"drawPosition",value:function(e){var n=this;t.ctx.strokeStyle="blue",t.ctx.beginPath(),e.getInflections(this.max_settle,this.profit_range/2,this.min_settle,-this.profit_range/2).forEach((function(e,i){var o=n.convertSettleToX(e.x),a=n.convertProfitToY(e.y);0===i?t.ctx.moveTo(o,a):t.ctx.lineTo(o,a)})),t.ctx.stroke()}}]),t}();y.isInit=!1,y.settle_range=600,y.settlePerPx=void 0,y.max_settle=void 0,y.min_settle=void 0,y.profit_range=300,y.profitPerPx=void 0,y.canvas=void 0,y.ctx=void 0,y.y_base=void 0,function(t){t.LONG="Long",t.SHORT="Short"}(g||(g={})),function(t){t.CALL="Call",t.PUT="Put"}(m||(m={})),function(t){t.TX="TX",t.TXO="TXO"}(k||(k={}));var P=function(){function t(){Object(s.a)(this,t),this.enabled=void 0,this.contract=void 0,this.contractWeek=void 0,this.ls=void 0,this.strike=void 0,this.cp=void 0,this.amount=void 0,this.price=void 0,this.row=u()("<tr>"),this.td_act=void 0,this.td_cp=void 0,this.td_con=void 0,this.td_strike=void 0,this.td_amount=void 0,this.td_price=void 0,this.amountField=void 0}return Object(r.a)(t,[{key:"valChange",value:function(){this.contract!==k.TXO?(this.td_cp.children().prop("disabled",!0),this.td_strike.children().prop("disabled",!0)):(this.td_cp.children().prop("disabled",!1),this.td_strike.children().prop("disabled",!1)),O.plotPosition()}},{key:"addRow",value:function(){this.row.click((function(){u()(this).addClass("selected").siblings().removeClass("selected")})),this.setDelBtn(),this.setContract(),this.setActionCbx(),this.setCPCbx(),this.setStrikePrice(),this.setAmount(),this.setPrice(),f.getPositionTable().append(this.row)}},{key:"setDelBtn",value:function(){var t=this;console.log("add del");var e=u()("<td>"),n=u()("<button>");n.addClass("btn btn-default btn-sm");var i=u()("<span>").addClass("glyphicon glyphicon-remove");i.css("color","red"),n.append(i),n.click((function(){O.removePosition(t),t.row.remove(),O.plotPosition()})),e.append(n),this.row.append(e)}},{key:"setActionCbx",value:function(){var t=this,e=u()("<td>"),n=u()("<select>"),i=document.createElement("option");i.text=g.LONG;var o=document.createElement("option");o.text=g.SHORT,n.append(i),n.append(o),n.change((function(){u()("option:selected",n).val()===g.LONG?t.ls=g.LONG:t.ls=g.SHORT,console.log("chk chg "+t.ls),t.valChange()})),this.ls==g.LONG?i.selected=!0:o.selected=!0,e.append(n),this.row.append(e),this.td_act=e}},{key:"setContract",value:function(){var t=this,e=u()("<td>"),n=u()("<select>"),i=document.createElement("option");i.text=k.TXO;var o=document.createElement("option");o.text=k.TX,n.append(i),n.append(o),n.change((function(){u()("option:selected",n).val()===k.TXO?t.contract=k.TXO:t.contract=k.TX,console.log("cp chg "+t.contract),t.valChange()})),this.contract==k.TXO?i.selected=!0:o.selected=!0,e.append(n),this.row.append(e),this.td_con=e}},{key:"setCPCbx",value:function(){var t=this,e=u()("<td>"),n=u()("<select>"),i=document.createElement("option");i.text=m.CALL;var o=document.createElement("option");o.text=m.PUT,n.append(i),n.append(o),n.change((function(){u()("option:selected",n).val()===m.CALL?t.cp=m.CALL:t.cp=m.PUT,console.log("cp chg "+t.cp),t.valChange()})),this.cp==m.CALL?i.selected=!0:o.selected=!0,e.append(n),this.row.append(e),this.td_cp=e}},{key:"setStrikePrice",value:function(){var t=this,e=u()("<td>"),n=u()("<input>");n.attr("type","number"),n.attr("step",50),n.val(this.strike),n.change((function(){t.strike=Number(n.val()),console.log("strike chg "+t.strike),t.valChange()})),e.append(n),this.row.append(e),this.td_strike=e}},{key:"setAmount",value:function(){var t=this,e=u()("<td>");this.amountField=u()("<input>"),this.amountField.attr("type","number"),this.amountField.val(this.amount),this.amountField.change((function(){t.amount=Number(t.amountField.val()),console.log("input chg "+t.amount),t.valChange()})),e.append(this.amountField),this.row.append(e),this.td_amount=e}},{key:"addAmount",value:function(t){this.amount+=t,this.amountField.val(this.amount),this.valChange()}},{key:"setPrice",value:function(){var t=this,e=u()("<td>"),n=u()("<input>");n.attr("type","number"),n.attr("step",.5),n.val(this.price),n.change((function(){t.price=Number(n.val()),console.log("price chg "+t.price),t.valChange()})),e.append(n),this.row.append(e),this.td_price=e}},{key:"getProfit",value:function(t){var e,n=this.ls===g.LONG?-1:1;if(this.contract===k.TX)e=this.price-t*n;else if(this.contract===k.TXO){var i=this.cp===m.CALL?1:-1;e=n*this.price,(1===i?t>this.strike:t<this.strike)&&(e-=n*i*(t-this.strike))}return e*this.amount}},{key:"getSettle",value:function(t){var e,n=this.ls===g.LONG?-1:1;if(this.contract===k.TX)e=(t/this.amount-this.price)/n;else if(this.contract===k.TXO){var i=this.cp===m.CALL?1:-1,o=(t/this.amount-n*this.price)*i;e=this.strike+o*i}return e}},{key:"getInflections",value:function(t,e,n,i){var o=[],a=this.getProfit(n);if(a<i){var c=this.getSettle(i);o.push(new C(c,i))}else o.push(new C(n,a));var s=this.getProfit(this.strike),r=this.strike;o.push(new C(r,s));var l=this.getProfit(t);if(l>e){var h=this.getSettle(e);o.push(new C(h,e))}else o.push(new C(t,l));return o}},{key:"equals",value:function(t){return console.log("position equal"),this.row===t.row}}],[{key:"getTXInstance",value:function(e,n,i){var o=new t;return o.amount=n,o.contract=k.TX,o.ls=e,o.price=i,o}},{key:"getTXOInstance",value:function(e,n,i,o,a,c){var s=new t;return s.amount=a,s.contract=k.TXO,s.ls=e,s.strike=o,s.cp=n,s.price=c,s}}]),t}(),T=n(46),S=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(t){var i;return Object(s.a)(this,n),(i=e.call(this,t)).state={items:[Object(v.jsxs)(p.Row,{children:[Object(v.jsx)(p.Col,{children:"Buy"}),Object(v.jsx)(p.Col,{children:"Sell"}),Object(v.jsx)(p.Col,{children:"Strike"}),Object(v.jsx)(p.Col,{children:"Buy"}),Object(v.jsx)(p.Col,{children:"Sell"})]})]},t.children=[Object(v.jsxs)(p.Row,{children:[Object(v.jsx)(p.Col,{children:"Buy"}),Object(v.jsx)(p.Col,{children:"Sell"}),Object(v.jsx)(p.Col,{children:"Strike"}),Object(v.jsx)(p.Col,{children:"Buy"}),Object(v.jsx)(p.Col,{children:"Sell"})]})],i}return Object(r.a)(n,[{key:"addRow",value:function(t){this.setState({items:[].concat(Object(T.a)(this.state.items),[t])})}},{key:"clear",value:function(){this.setState({items:[Object(v.jsxs)(p.Row,{children:[Object(v.jsx)(p.Col,{children:"Buy"}),Object(v.jsx)(p.Col,{children:"Sell"}),Object(v.jsx)(p.Col,{children:"Strike"}),Object(v.jsx)(p.Col,{children:"Buy"}),Object(v.jsx)(p.Col,{children:"Sell"})]})]})}},{key:"render",value:function(){return Object(v.jsx)(p.Container,{children:o.a.Children.map(this.state.items,(function(t){return t}))})}}]),n}(o.a.Component),w=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(t){var i;return Object(s.a)(this,n),(i=e.call(this,t)).state={items:[]},i}return Object(r.a)(n,[{key:"addContractCode",value:function(t){this.setState({items:[].concat(Object(T.a)(this.state.items),[Object(v.jsx)("option",{value:t,children:t})])})}},{key:"setContractCode",value:function(t){this.setState({items:Object(T.a)(this.state.items),value:t})}},{key:"clear",value:function(){this.setState({items:[]})}},{key:"handleChange",value:function(t){console.log("contract cmb:"+t.target.value),this.setState({items:this.state.items,value:t.target.value}),this.props.onChangeImpl(t.target.value)}},{key:"render",value:function(){var t=this;return Object(v.jsx)("select",{value:this.state.value,onChange:function(e){return t.handleChange.apply(t,[e])},children:o.a.Children.map(this.state.items,(function(t){return t}))})}}]),n}(o.a.Component),L=n(44),_=n(109),X=n.n(_),A=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(t){var i;return Object(s.a)(this,n),(i=e.call(this,t)).handleOpenModal=function(){i.setState({isOpen:!0})},i.handleCloseModal=function(){i.setState({isOpen:!1})},i.loadJson=function(){var t=JSON.parse(i.state.json);f.parsePositionForRaw(t)},i.state={isOpen:!1,json:""},i.handleOpenModal=i.handleOpenModal.bind(Object(L.a)(i)),i.handleCloseModal=i.handleCloseModal.bind(Object(L.a)(i)),i}return Object(r.a)(n,[{key:"handleChange",value:function(t){this.setState({isOpen:this.state.isOpen,json:t.target.value})}},{key:"render",value:function(){return Object(v.jsxs)(X.a,{isOpen:this.state.isOpen,children:[Object(v.jsx)("textarea",{style:{"min-height":"500px",width:"100%"},value:this.state.json,onChange:this.handleChange}),Object(v.jsx)("button",{onClick:this.loadJson,children:"Load"}),Object(v.jsx)("button",{onClick:this.handleCloseModal,children:"Close"})]})}}]),n}(o.a.Component),D=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(){var t;Object(s.a)(this,n);for(var i=arguments.length,a=new Array(i),c=0;c<i;c++)a[c]=arguments[c];return(t=e.call.apply(e,[this].concat(a))).contractSelector=o.a.createRef(),t.contractWeekCombo=o.a.createRef(),t.jsonPopup=o.a.createRef(),t}return Object(r.a)(n,[{key:"addContractRows",value:function(){this.contractSelector.current.clear();for(var t=0;t<x.txoData.strikes.length;t++){var e=x.txoData.callContracts[t],n=x.txoData.putContracts[t],i=x.txoData.strikes[t],o=f.createPosiBtn(e,g.LONG),a=f.createPosiBtn(e,g.SHORT),c=f.createPosiBtn(n,g.LONG),s=f.createPosiBtn(n,g.SHORT),r={};Math.abs(i-x.txoData.spot)<=50&&(r={"background-color":"skyblue"});var l=Object(v.jsxs)(p.Row,{style:r,children:[o,a,Object(v.jsx)(p.Col,{children:i}),c,s]});this.contractSelector.current.addRow(l)}}},{key:"loadTxoData",value:function(t,e){u.a.get(window.location.href.match(/^.*\//)[0]+"servlet/getTxoData",{contractWeek:e},(function(n){x.txoData=n.data,console.log("load data contractWeek:"+e+" target week: "+x.txoData.targetContractCode),console.log(x.txoData),console.log("spot:"+x.txoData.spot),u()("#spot").val(x.txoData.spot),t.contractWeekCombo.current.clear(),x.txoData.contractCodes.forEach((function(e){t.contractWeekCombo.current.addContractCode(e)})),t.contractWeekCombo.current.setContractCode(x.txoData.targetContractCode),t.addContractRows(),O.plotPosition()}))}},{key:"componentDidMount",value:function(){var t=this;console.log("onload"),this.loadTxoData(this),u()("#addBtn").click((function(){var t=P.getTXOInstance(g.LONG,m.CALL,k.TXO,16e3,1,64.5);f.addPosition(t)})),u()("#clearBtn").click((function(){O.removeAllPosition()})),u()("#toJsonBtn").click((function(){var t=O.getDataJson();window.alert(t)})),u()("#loadJsonBtn").click((function(){t.jsonPopup.current.handleOpenModal()})),u()("#spot").change((function(){O.plotPosition()}))}},{key:"render",value:function(){var t=this;return Object(v.jsxs)("div",{style:{padding:"20px"},children:[Object(v.jsx)(A,{ref:this.jsonPopup,children:"popup"}),Object(v.jsxs)("div",{children:[Object(v.jsxs)("div",{children:[Object(v.jsx)("label",{children:"Spot"}),Object(v.jsx)("input",{id:"spot",type:"number"})]}),Object(v.jsxs)("div",{children:[Object(v.jsx)("label",{children:"Default Cost(tick/lot)"}),Object(v.jsx)("input",{id:"defaultCost",type:"number",min:"0",defaultValue:"2"})]}),Object(v.jsx)("div",{id:"fplot",style:{display:"inline-block","vertical-align":"top"}}),Object(v.jsxs)("div",{style:{display:"inline-block","max-height":"400px",overflow:"auto",width:"500px",padding:"5px",border:"1px solid black"},children:[Object(v.jsx)("div",{children:Object(v.jsxs)("div",{children:[Object(v.jsx)("label",{children:"Contract Week"}),Object(v.jsx)(w,{ref:this.contractWeekCombo,onChangeImpl:function(e){return t.loadTxoData.apply(null,[t,e])}})]})}),Object(v.jsx)(S,{ref:this.contractSelector})]})]}),Object(v.jsx)("br",{}),Object(v.jsxs)("div",{children:[Object(v.jsx)("button",{id:"addBtn",children:"Add"}),Object(v.jsx)("button",{id:"clearBtn",children:"Clear"}),Object(v.jsx)("button",{id:"toJsonBtn",children:"To JSON"}),Object(v.jsx)("button",{id:"loadJsonBtn",children:"Load JSON"})]}),Object(v.jsx)("div",{children:Object(v.jsx)("table",{id:"positionTable",children:Object(v.jsxs)("tr",{children:[Object(v.jsx)("th",{}),Object(v.jsx)("th",{children:"\u6a19\u7684"}),Object(v.jsx)("th",{children:"\u8cb7\u8ce3"}),Object(v.jsx)("th",{children:"C/P"}),Object(v.jsx)("th",{children:"\u5c65\u7d04\u50f9"}),Object(v.jsx)("th",{children:"\u6578\u91cf"}),Object(v.jsx)("th",{children:"\u50f9\u683c"})]})})})]})}}]),n}(o.a.Component);n(192);var N=function(){return Object(v.jsx)(D,{})},B=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,200)).then((function(e){var n=e.getCLS,i=e.getFID,o=e.getFCP,a=e.getLCP,c=e.getTTFB;n(t),i(t),o(t),a(t),c(t)}))};c.a.render(Object(v.jsx)(o.a.StrictMode,{children:Object(v.jsx)(N,{})}),document.getElementById("root")),B()}},[[195,1,2]]]);
//# sourceMappingURL=main.e65195b6.chunk.js.map