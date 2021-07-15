(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{13:function(t,e,n){},15:function(t,e,n){},16:function(t,e,n){"use strict";n.r(e);var i=n(4),o=n.n(i),a=n(6),c=n.n(a),s=(n(13),n(2)),r=n(3),l=n(8),h=n(7),u=n(1),d=n.n(u),p=n(0),v=function(){function t(){Object(s.a)(this,t)}return Object(r.a)(t,null,[{key:"checkNull",value:function(t){return null==t?"-":t}},{key:"getPositionTable",value:function(){return d()("#positionTable")}},{key:"addPosition",value:function(t){console.log("addposi"+t);var e=x.getData().filter((function(e){return e.contract==t.contract&&e.ls==t.ls&&e.cp==t.cp&&e.strike==t.strike}));e.length>0?e[0].addAmount(t.amount):(t.addRow(),x.getData().push(t),x.plotPosition())}},{key:"parsePositionForRaw",value:function(t){var e="L"==t.ls?g.LONG:g.SHORT,n=t.contract,i="C"==n.type?m.CALL:m.PUT,o=n.strike,a=t.price;return P.getTXOInstance(e,i,b.TXO,o,1,a)}},{key:"parsePosition",value:function(t,e){var n="C"==t.type?m.CALL:m.PUT,i=t.strike,o=void 0;return g.LONG===e?o=t.ask:g.SHORT===e&&(o=t.bid),P.getTXOInstance(e,n,b.TXO,i,1,o)}},{key:"createPosiBtn",value:function(e,n){var i=t.parsePosition(e,n);return void 0==i.price?"":Object(p.jsxs)("button",{onClick:function(){i=t.parsePosition(e,n),t.addPosition(i)},children:["    ",i.price]})}}]),t}();v.posiFn={};var f=function t(){Object(s.a)(this,t)};f.txoData={};var x=function(){function t(){Object(s.a)(this,t),this.profit=void 0,this.settle=void 0,this.strike=void 0,this.cp=void 0,this.ls=void 0,this.price=void 0}return Object(r.a)(t,null,[{key:"getData",value:function(){return this.data}},{key:"addPosition",value:function(t){this.data.push(t)}},{key:"removeAllPosition",value:function(){this.data=[],v.getPositionTable().find("tr:gt(0)").remove(),t.plotPosition()}},{key:"removePosition",value:function(t){var e=void 0;this.data.forEach((function(n,i){n.equals(t)&&(e=i)})),void 0!==e&&this.data.splice(e,1),console.log("removed rec: "+e)}},{key:"plotPosition",value:function(){for(var t=document.querySelector("#fplot"),e=this.getAnalyzeFn();t.firstChild;)t.removeChild(t.firstChild);var n={target:t,tip:{xLine:!0,yLine:!0},grid:!0,yAxis:{label:"Profit (tick)"},xAxis:{domain:[f.txoData.spot-500,f.txoData.spot+500],label:"Settle Price"},data:e.data,annotations:e.annotations},i=d()("#spot").val();i&&n.annotations.push({x:i,text:"spot: "+i}),functionPlot(n)}},{key:"getAnalyzeFn",value:function(){var t=new Set,e=[];return this.data.forEach((function(n){var i,o,a,c,s,r;n.strike,n.strike;n.contract===b.TXO?(s=n.ls===g.LONG?-1:1,1===(r=n.cp===m.CALL?1:-1)?(i=0,o=s*n.price*n.amount,a=-s*r*n.amount,c=(s*n.price+s*r*n.strike)*n.amount):(i=-s*r*n.amount,o=(s*n.price+s*r*n.strike)*n.amount,a=0,c=s*n.price*n.amount),t.add(n.strike),e.push([n.contract,n.strike,[i,o],[a,c]])):(i=n.ls===g.LONG?1*n.amount:-1*n.amount,o=-n.price*n.amount,e.push([n.contract,[i,o]]))})),this.addPosiFunc(Array.from(t),e)}},{key:"addPosiFunc",value:function(t,e){t.push(1/0),t.sort((function(t,e){return t-e}));var n=[],i=[];t.forEach((function(e,o){var a=[[t[o],t[o+1]],0,0];0===o?(n.push([[0,t[0]],0,0]),n.push(a)):o===t.length-1||n.push(a),e!==1/0&&i.push({x:e,text:e})})),0===n.length&&0!==e.length&&n.push([[0,1/0],0,0]),e.forEach((function(t){var e=t[0],i=t[1];n.forEach((function(n){e===b.TXO?n[0][1]<=i?(n[1]+=t[2][0],n[2]+=t[2][1]):(n[1]+=t[3][0],n[2]+=t[3][1]):(n[1]+=t[1][0],n[2]+=t[1][1])}))})),console.log(n);var o=[];return o.push({range:[0,1/0],fn:"0",skipTip:!0}),n.forEach((function(t){o.push({range:t[0],fn:t[1]+"*x+"+t[2]})})),{annotations:i,data:o}}}]),t}();x.data=[];var g,m,b,k=function t(e,n){Object(s.a)(this,t),this.x=void 0,this.y=void 0,this.x=e,this.y=n},O=function(){function t(){Object(s.a)(this,t)}return Object(r.a)(t,null,[{key:"init",value:function(){t.canvas=document.getElementById("canv"),t.ctx=t.canvas.getContext("2d"),t.y_base=t.canvas.height/2,t.draw(),t.canvas.addEventListener("mousemove",(function(e){t.draw();var n=t.canvas.getBoundingClientRect(),i=e.pageX-Number(n.left.toFixed(0)),o=e.pageY-Number(n.top.toFixed(0)),a=t.min_settle+i*t.settlePerPx,c=0;x.getData().forEach((function(t){c+=t.getProfit(a)})),t.ctx.beginPath(),t.ctx.strokeStyle="green",t.ctx.lineWidth=1,t.ctx.moveTo(i,0),t.ctx.lineTo(i,t.canvas.height),t.ctx.stroke(),t.ctx.fillStyle="#000",t.ctx.font="10px Arial";var s="price: "+a.toString(),r="profit: "+c/t.profitPerPx;t.ctx.measureText(s).width>t.canvas.width-i-10?(t.ctx.textAlign="right",t.ctx.fillText(s,i-10,o+5),t.ctx.fillText(r,i-10,o+15)):(t.ctx.textAlign="left",t.ctx.fillText(s,i+20,o+5),t.ctx.fillText(r,i+20,o+15))})),t.canvas.addEventListener("mouseout",(function(e){t.clear(),t.draw()}))}},{key:"draw",value:function(){var e=this;t.clear(),t.settlePerPx=t.settle_range/t.canvas.width,t.profitPerPx=t.profit_range/t.canvas.height,t.ctx.beginPath(),t.ctx.strokeStyle="black",t.ctx.moveTo(0,t.canvas.height/2),t.ctx.lineTo(t.canvas.width,t.canvas.height/2),t.ctx.stroke(),x.getData().forEach((function(n){var i;i=n.contract===b.TXO?n.strike:50*Number(Number(n.price/50).toFixed(0));var o=t.convertSettleToX(i);t.max_settle=i+t.settle_range/2,t.min_settle=i-t.settle_range/2,n.contract===b.TXO&&(t.ctx.beginPath(),t.ctx.strokeStyle="red",t.ctx.moveTo(o,0),t.ctx.lineTo(o,t.canvas.height),t.ctx.stroke()),t.ctx.fillStyle="Teal ",t.ctx.font="8px Arial",t.ctx.textAlign="center",t.ctx.strokeStyle="black";for(var a=t.min_settle;a<=t.max_settle;a+=50)t.ctx.beginPath(),t.ctx.moveTo(e.convertSettleToX(a),t.canvas.height/2*t.profitPerPx-5),t.ctx.lineTo(e.convertSettleToX(a),t.canvas.height/2*t.profitPerPx+1),t.ctx.stroke(),t.ctx.fillText(a.toString(),e.convertSettleToX(a),t.canvas.height/2*t.profitPerPx+10);e.drawPosition(n)}))}},{key:"convertSettleToX",value:function(e){return(e-t.min_settle)/this.settlePerPx}},{key:"convertProfitToY",value:function(e){return(t.profit_range/2-e)/this.profitPerPx}},{key:"clear",value:function(){t.ctx.fillStyle="#FFF",t.ctx.fillRect(0,0,t.canvas.width,t.canvas.height)}},{key:"drawPosition",value:function(e){var n=this;t.ctx.strokeStyle="blue",t.ctx.beginPath(),e.getInflections(this.max_settle,this.profit_range/2,this.min_settle,-this.profit_range/2).forEach((function(e,i){var o=n.convertSettleToX(e.x),a=n.convertProfitToY(e.y);0===i?t.ctx.moveTo(o,a):t.ctx.lineTo(o,a)})),t.ctx.stroke()}}]),t}();O.isInit=!1,O.settle_range=600,O.settlePerPx=void 0,O.max_settle=void 0,O.min_settle=void 0,O.profit_range=300,O.profitPerPx=void 0,O.canvas=void 0,O.ctx=void 0,O.y_base=void 0,function(t){t.LONG="Long",t.SHORT="Short"}(g||(g={})),function(t){t.CALL="Call",t.PUT="Put"}(m||(m={})),function(t){t.TX="TX",t.TXO="TXO"}(b||(b={}));var P=function(){function t(){Object(s.a)(this,t),this.enabled=void 0,this.contract=void 0,this.ls=void 0,this.strike=void 0,this.cp=void 0,this.amount=void 0,this.price=void 0,this.row=d()("<tr>"),this.td_act=void 0,this.td_cp=void 0,this.td_con=void 0,this.td_strike=void 0,this.td_amount=void 0,this.td_price=void 0,this.amountField=void 0}return Object(r.a)(t,[{key:"valChange",value:function(){this.contract!==b.TXO?(this.td_cp.children().prop("disabled",!0),this.td_strike.children().prop("disabled",!0)):(this.td_cp.children().prop("disabled",!1),this.td_strike.children().prop("disabled",!1)),x.plotPosition()}},{key:"addRow",value:function(){this.row.click((function(){d()(this).addClass("selected").siblings().removeClass("selected")})),this.setDelBtn(),this.setContract(),this.setActionCbx(),this.setCPCbx(),this.setStrikePrice(),this.setAmount(),this.setPrice(),v.getPositionTable().append(this.row)}},{key:"setDelBtn",value:function(){var t=this;console.log("add del");var e=d()("<td>"),n=d()("<button>");n.addClass("btn btn-default btn-sm");var i=d()("<span>").addClass("glyphicon glyphicon-remove");i.css("color","red"),n.append(i),n.click((function(){x.removePosition(t),t.row.remove(),x.plotPosition()})),e.append(n),this.row.append(e)}},{key:"setActionCbx",value:function(){var t=this,e=d()("<td>"),n=d()("<select>"),i=document.createElement("option");i.text=g.LONG;var o=document.createElement("option");o.text=g.SHORT,n.append(i),n.append(o),n.change((function(){d()("option:selected",n).val()===g.LONG?t.ls=g.LONG:t.ls=g.SHORT,console.log("chk chg "+t.ls),t.valChange()})),this.ls==g.LONG?i.selected=!0:o.selected=!0,e.append(n),this.row.append(e),this.td_act=e}},{key:"setContract",value:function(){var t=this,e=d()("<td>"),n=d()("<select>"),i=document.createElement("option");i.text=b.TXO;var o=document.createElement("option");o.text=b.TX,n.append(i),n.append(o),n.change((function(){d()("option:selected",n).val()===b.TXO?t.contract=b.TXO:t.contract=b.TX,console.log("cp chg "+t.contract),t.valChange()})),this.contract==b.TXO?i.selected=!0:o.selected=!0,e.append(n),this.row.append(e),this.td_con=e}},{key:"setCPCbx",value:function(){var t=this,e=d()("<td>"),n=d()("<select>"),i=document.createElement("option");i.text=m.CALL;var o=document.createElement("option");o.text=m.PUT,n.append(i),n.append(o),n.change((function(){d()("option:selected",n).val()===m.CALL?t.cp=m.CALL:t.cp=m.PUT,console.log("cp chg "+t.cp),t.valChange()})),this.cp==m.CALL?i.selected=!0:o.selected=!0,e.append(n),this.row.append(e),this.td_cp=e}},{key:"setStrikePrice",value:function(){var t=this,e=d()("<td>"),n=d()("<input>");n.attr("type","number"),n.attr("step",50),n.val(this.strike),n.change((function(){t.strike=Number(n.val()),console.log("strike chg "+t.strike),t.valChange()})),e.append(n),this.row.append(e),this.td_strike=e}},{key:"setAmount",value:function(){var t=this,e=d()("<td>");this.amountField=d()("<input>"),this.amountField.attr("type","number"),this.amountField.val(this.amount),this.amountField.change((function(){t.amount=Number(t.amountField.val()),console.log("input chg "+t.amount),t.valChange()})),e.append(this.amountField),this.row.append(e),this.td_amount=e}},{key:"addAmount",value:function(t){this.amount+=t,this.amountField.val(this.amount),this.valChange()}},{key:"setPrice",value:function(){var t=this,e=d()("<td>"),n=d()("<input>");n.attr("type","number"),n.attr("step",.5),n.val(this.price),n.change((function(){t.price=Number(n.val()),console.log("price chg "+t.price),t.valChange()})),e.append(n),this.row.append(e),this.td_price=e}},{key:"getProfit",value:function(t){var e,n=this.ls===g.LONG?-1:1;if(this.contract===b.TX)e=this.price-t*n;else if(this.contract===b.TXO){var i=this.cp===m.CALL?1:-1;e=n*this.price,(1===i?t>this.strike:t<this.strike)&&(e-=n*i*(t-this.strike))}return e*this.amount}},{key:"getSettle",value:function(t){var e,n=this.ls===g.LONG?-1:1;if(this.contract===b.TX)e=(t/this.amount-this.price)/n;else if(this.contract===b.TXO){var i=this.cp===m.CALL?1:-1,o=(t/this.amount-n*this.price)*i;e=this.strike+o*i}return e}},{key:"getInflections",value:function(t,e,n,i){var o=[],a=this.getProfit(n);if(a<i){var c=this.getSettle(i);o.push(new k(c,i))}else o.push(new k(n,a));var s=this.getProfit(this.strike),r=this.strike;o.push(new k(r,s));var l=this.getProfit(t);if(l>e){var h=this.getSettle(e);o.push(new k(h,e))}else o.push(new k(t,l));return o}},{key:"equals",value:function(t){return console.log("position equal"),this.row===t.row}}],[{key:"getTXInstance",value:function(e,n,i){var o=new t;return o.amount=n,o.contract=b.TX,o.ls=e,o.price=i,o}},{key:"getTXOInstance",value:function(e,n,i,o,a,c){var s=new t;return s.amount=a,s.contract=b.TXO,s.ls=e,s.strike=o,s.cp=n,s.price=c,s}}]),t}();var T=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(){return Object(s.a)(this,n),e.apply(this,arguments)}return Object(r.a)(n,[{key:"componentDidMount",value:function(){console.log("onload"),d.a.get(window.location.href.match(/^.*\//)[0]+"servlet/getTxoData",(function(t){f.txoData=t.data,console.log("load data:"+f.txoData),console.log("spot:"+f.txoData.spot),d()("#spot").val(f.txoData.spot),function(){var t=d()("#contractSelector");t.append("<tr><th>Buy</th><th>Sell</th><th>Strike</th><th>Buy</th><th>Sell</th></tr>");for(var e=0;e<f.txoData.strikes.length;e++){var n=f.txoData.callContracts[e],i=f.txoData.putContracts[e],o=f.txoData.strikes[e];if(!(Math.abs(o-f.txoData.spot)>600)){var a="<td>"+v.createPosiBtn(n,g.LONG)+"</td><td>"+v.createPosiBtn(n,g.SHORT)+"</td><th>"+o+"</td><td>"+v.createPosiBtn(i,g.LONG)+"</td><td>"+v.createPosiBtn(i,g.SHORT)+"</td>";a=Math.abs(o-f.txoData.spot)<=25?'<tr style="background-color:skyblue;">'+a+"</tr>":"<tr>"+a+"</tr>",t.append(a)}}}(),x.plotPosition()})),d()("#addBtn").click((function(){var t=P.getTXOInstance(g.LONG,m.CALL,b.TXO,16e3,1,64.5);v.addPosition(t)})),d()("#clearBtn").click((function(){x.removeAllPosition()})),d()("#spot").change((function(){x.plotPosition()}))}},{key:"render",value:function(){return Object(p.jsxs)("div",{children:[Object(p.jsx)("div",{children:Object(p.jsx)("button",{id:"refreshBtn",children:"Refresh"})}),Object(p.jsxs)("div",{children:[Object(p.jsx)("div",{id:"fplot"}),Object(p.jsx)("div",{children:Object(p.jsx)("table",{id:"contractSelector",children:" "})})]}),Object(p.jsx)("br",{}),Object(p.jsxs)("div",{children:[Object(p.jsx)("label",{children:"Spot"}),Object(p.jsx)("input",{id:"spot",type:"number"}),Object(p.jsx)("button",{id:"addBtn",children:"Add"}),Object(p.jsx)("button",{id:"clearBtn",children:"Clear"})]}),Object(p.jsx)("div",{children:Object(p.jsx)("table",{id:"positionTable",children:Object(p.jsxs)("tr",{children:[Object(p.jsx)("th",{}),Object(p.jsx)("th",{children:"\u6a19\u7684"}),Object(p.jsx)("th",{children:"\u8cb7\u8ce3"}),Object(p.jsx)("th",{children:"C/P"}),Object(p.jsx)("th",{children:"\u5c65\u7d04\u50f9"}),Object(p.jsx)("th",{children:"\u6578\u91cf"}),Object(p.jsx)("th",{children:"\u50f9\u683c"})]})})})]})}}]),n}(o.a.Component);n(15);var y=function(){return Object(p.jsx)(T,{})},j=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,17)).then((function(e){var n=e.getCLS,i=e.getFID,o=e.getFCP,a=e.getLCP,c=e.getTTFB;n(t),i(t),o(t),a(t),c(t)}))};c.a.render(Object(p.jsx)(o.a.StrictMode,{children:Object(p.jsx)(y,{})}),document.getElementById("root")),j()}},[[16,1,2]]]);
//# sourceMappingURL=main.7b417a95.chunk.js.map