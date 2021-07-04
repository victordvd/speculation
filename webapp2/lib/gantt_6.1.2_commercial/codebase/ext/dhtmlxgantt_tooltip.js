/*
@license

dhtmlxGantt v.6.1.2 Professional
This software is covered by DHTMLX Commercial License. Usage without proper license is prohibited.

(c) Dinamenta, UAB.

*/
!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o=e();for(var n in o)("object"==typeof exports?exports:t)[n]=o[n]}}(window,function(){return function(t){var e={};function o(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=t,o.c=e,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/codebase/",o(o.s=213)}({0:function(t,e,o){var n,r=o(3);t.exports={copy:function t(e){var o,n;if(e&&"object"==typeof e)switch(!0){case r.isDate(e):n=new Date(e);break;case r.isArray(e):for(n=new Array(e.length),o=0;o<e.length;o++)n[o]=t(e[o]);break;case r.isStringObject(e):n=new String(e);break;case r.isNumberObject(e):n=new Number(e);break;case r.isBooleanObject(e):n=new Boolean(e);break;default:for(o in n={},e)Object.prototype.hasOwnProperty.apply(e,[o])&&(n[o]=t(e[o]))}return n||e},defined:function(t){return void 0!==t},mixin:function(t,e,o){for(var n in e)(void 0===t[n]||o)&&(t[n]=e[n]);return t},uid:function(){return n||(n=(new Date).valueOf()),++n},bind:function(t,e){return t.bind?t.bind(e):function(){return t.apply(e,arguments)}},event:function(t,e,o,n){t.addEventListener?t.addEventListener(e,o,void 0!==n&&n):t.attachEvent&&t.attachEvent("on"+e,o)},eventRemove:function(t,e,o,n){t.removeEventListener?t.removeEventListener(e,o,void 0!==n&&n):t.detachEvent&&t.detachEvent("on"+e,o)}}},1:function(t,e){function o(t){var e=0,o=0,n=0,r=0;if(t.getBoundingClientRect){var i=t.getBoundingClientRect(),a=document.body,c=document.documentElement||document.body.parentNode||document.body,u=window.pageYOffset||c.scrollTop||a.scrollTop,l=window.pageXOffset||c.scrollLeft||a.scrollLeft,s=c.clientTop||a.clientTop||0,f=c.clientLeft||a.clientLeft||0;e=i.top+u-s,o=i.left+l-f,n=document.body.offsetWidth-i.right,r=document.body.offsetHeight-i.bottom}else{for(;t;)e+=parseInt(t.offsetTop,10),o+=parseInt(t.offsetLeft,10),t=t.offsetParent;n=document.body.offsetWidth-t.offsetWidth-o,r=document.body.offsetHeight-t.offsetHeight-e}return{y:Math.round(e),x:Math.round(o),width:t.offsetWidth,height:t.offsetHeight,right:Math.round(n),bottom:Math.round(r)}}function n(t){var e=!1,o=!1;if(window.getComputedStyle){var n=window.getComputedStyle(t,null);e=n.display,o=n.visibility}else t.currentStyle&&(e=t.currentStyle.display,o=t.currentStyle.visibility);return"none"!=e&&"hidden"!=o}function r(t){return!isNaN(t.getAttribute("tabindex"))&&1*t.getAttribute("tabindex")>=0}function i(t){return!{a:!0,area:!0}[t.nodeName.loLowerCase()]||!!t.getAttribute("href")}function a(t){return!{input:!0,select:!0,textarea:!0,button:!0,object:!0}[t.nodeName.toLowerCase()]||!t.hasAttribute("disabled")}function c(t){if(!t)return"";var e=t.className||"";return e.baseVal&&(e=e.baseVal),e.indexOf||(e=""),s(e)}var u=document.createElement("div");function l(t){return t.tagName?t:(t=t||window.event).target||t.srcElement}function s(t){return(String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g,"")}).apply(t)}t.exports={getNodePosition:o,getFocusableNodes:function(t){for(var e=t.querySelectorAll(["a[href]","area[href]","input","select","textarea","button","iframe","object","embed","[tabindex]","[contenteditable]"].join(", ")),o=Array.prototype.slice.call(e,0),c=0;c<o.length;c++){var u=o[c];(r(u)||a(u)||i(u))&&n(u)||(o.splice(c,1),c--)}return o},getScrollSize:function(){var t=document.createElement("div");t.style.cssText="visibility:hidden;position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;height:110px;min-height:100px;overflow-y:scroll;",document.body.appendChild(t);var e=t.offsetWidth-t.clientWidth;return document.body.removeChild(t),e},getClassName:c,addClassName:function(t,e){e&&-1===t.className.indexOf(e)&&(t.className+=" "+e)},removeClassName:function(t,e){e=e.split(" ");for(var o=0;o<e.length;o++){var n=new RegExp("\\s?\\b"+e[o]+"\\b(?![-_.])","");t.className=t.className.replace(n,"")}},insertNode:function(t,e){u.innerHTML=e;var o=u.firstChild;return t.appendChild(o),o},removeNode:function(t){t&&t.parentNode&&t.parentNode.removeChild(t)},getChildNodes:function(t,e){for(var o=t.childNodes,n=o.length,r=[],i=0;i<n;i++){var a=o[i];a.className&&-1!==a.className.indexOf(e)&&r.push(a)}return r},toNode:function(t){return"string"==typeof t?document.getElementById(t)||document.querySelector(t)||document.body:t||document.body},locateClassName:function(t,e,o){var n=l(t),r="";for(void 0===o&&(o=!0);n;){if(r=c(n)){var i=r.indexOf(e);if(i>=0){if(!o)return n;var a=0===i||!s(r.charAt(i-1)),u=i+e.length>=r.length||!s(r.charAt(i+e.length));if(a&&u)return n}}n=n.parentNode}return null},locateAttribute:function(t,e){if(e){for(var o=l(t);o;){if(o.getAttribute&&o.getAttribute(e))return o;o=o.parentNode}return null}},getTargetNode:l,getRelativeEventPosition:function(t,e){var n=document.documentElement,r=o(e);return{x:t.clientX+n.scrollLeft-n.clientLeft-r.x+e.scrollLeft,y:t.clientY+n.scrollTop-n.clientTop-r.y+e.scrollTop}},isChildOf:function(t,e){if(!t||!e)return!1;for(;t&&t!=e;)t=t.parentNode;return t===e},hasClass:function(t,e){return"classList"in t?t.classList.contains(e):new RegExp("\\b"+e+"\\b").test(t.className)},closest:function(t,e){if(t.closest)return t.closest(e);if(t.matches||t.msMatchesSelector||t.webkitMatchesSelector){var o=t;if(!document.documentElement.contains(o))return null;do{if((o.matches||o.msMatchesSelector||o.webkitMatchesSelector).call(o,e))return o;o=o.parentElement||o.parentNode}while(null!==o&&1===o.nodeType);return null}return console.error("Your browser is not supported"),null}}},211:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=o(1),r=function(){function t(){}return t.prototype.getNode=function(){return this._tooltipNode||(this._tooltipNode=document.createElement("div"),this._tooltipNode.className="gantt_tooltip",gantt._waiAria.tooltipAttr(this._tooltipNode)),this._tooltipNode},t.prototype.setViewport=function(t){return this._root=t,this},t.prototype.show=function(t,e){var o=document.body,r=this.getNode();if(n.isChildOf(r,o)||(this.hide(),o.appendChild(r)),t instanceof MouseEvent){var i=this._calculateTooltipPosition(t);e=i.top,t=i.left}return r.style.top=e+"px",r.style.left=t+"px",gantt._waiAria.tooltipVisibleAttr(r),this},t.prototype.hide=function(){var t=this.getNode();return t&&t.parentNode&&t.parentNode.removeChild(t),gantt._waiAria.tooltipHiddenAttr(t),this},t.prototype.setContent=function(t){return this.getNode().innerHTML=t,this},t.prototype._getViewPort=function(){return this._root||document.body},t.prototype._calculateTooltipPosition=function(t){var e=this._getViewPortSize(),o=this.getNode(),r={top:0,left:0,width:o.offsetWidth,height:o.offsetHeight,bottom:0,right:0},i=gantt.config.tooltip_offset_x,a=gantt.config.tooltip_offset_y,c=document.body,u=n.getRelativeEventPosition(t,c);return r.top=u.y,r.left=u.x,r.top+=a,r.left+=i,r.bottom=r.top+r.height,r.right=r.left+r.width,r.top<e.top?(r.top=e.top,r.bottom=r.top+r.height):r.bottom>e.bottom&&(r.bottom=e.bottom,r.top=r.bottom-r.height),r.left<e.left?(r.left=e.left,r.right=e.left+r.width):r.right>e.right&&(r.right=e.right,r.left=r.right-r.width),u.x>=r.left&&u.x<=r.right&&(r.left=u.x-r.width-i,r.right=r.left+r.width),u.y>=r.top&&u.y<=r.bottom&&(r.top=u.y-r.height-a,r.bottom=r.top+r.height),r},t.prototype._getViewPortSize=function(){var t,e=this._getViewPort(),o=e,r=window.scrollY+document.body.scrollTop,i=window.scrollX+document.body.scrollLeft;return e===gantt.$task_data?(o=gantt.$task,r=0,i=0,t=n.getNodePosition(gantt.$task)):t=n.getNodePosition(o),{left:t.x+i,top:t.y+r,width:t.width,height:t.height,bottom:t.y+t.height+r,right:t.x+t.width+i}},t}();e.Tooltip=r},212:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=o(1),r=o(3),i=o(0),a=o(211),c=function(){function t(){this.tooltip=new a.Tooltip,this._listeners={}}return t.prototype.attach=function(t){var e=this,o=document.body;t.global||(o=gantt.$root);var r=null,a=function(o){var i=n.getTargetNode(o),a=n.closest(i,t.selector);n.isChildOf(i,e.tooltip.getNode())||(r?a?t.onmousemove(o,a):(t.onmouseleave(o,r),r=null):a&&(r=a,t.onmouseenter(o,a)))};this.detach(t.selector),i.event(o,"mousemove",a),this._listeners[t.selector]={node:o,handler:a}},t.prototype.detach=function(t){var e=this._listeners[t];e&&i.eventRemove(e.node,"mousemove",e.handler)},t.prototype.tooltipFor=function(t){var e=this,o=function(t){var e=t;return document.createEventObject&&!document.createEvent&&(e=document.createEventObject(t)),e},n=r.delay(function(t,o){e.tooltip.setContent(o),e.tooltip.show(t)},gantt.config.tooltip_timeout||1),i=r.delay(function(){n.$cancelTimeout(),e.tooltip.hide()},gantt.config.tooltip_hide_timeout||1);this.attach({selector:t.selector,global:t.global,onmouseenter:function(e,r){var i=t.html(e,r);i&&n(o(e),i)},onmousemove:function(e,r){var a=t.html(e,r);a?n(o(e),a):(n.$cancelTimeout(),i())},onmouseleave:function(){n.$cancelTimeout(),i()}})},t}();e.TooltipManager=c},213:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),gantt.config.tooltip_timeout=30,gantt.config.tooltip_offset_y=20,gantt.config.tooltip_offset_x=10,gantt.config.tooltip_hide_timeout=30;var n=new(o(212).TooltipManager);gantt.ext.tooltips=n,gantt.attachEvent("onGanttReady",function(){n.tooltipFor({selector:"["+gantt.config.task_attribute+"]:not(.gantt_task_row)",html:function(t){if(!gantt.config.touch||gantt.config.touch_tooltip){var e=gantt.locate(t);if(gantt.isTaskExists(e)){var o=gantt.getTask(e);return gantt.templates.tooltip_text(o.start_date,o.end_date,o)}return null}},global:!1})})},3:function(t,e){var o={second:1,minute:60,hour:3600,day:86400,week:604800,month:2592e3,quarter:7776e3,year:31536e3};function n(t,e){var o=[];if(t.filter)return t.filter(e);for(var n=0;n<t.length;n++)e(t[n],n)&&(o[o.length]=t[n]);return o}t.exports={getSecondsInUnit:function(t){return o[t]||o.hour},forEach:function(t,e){if(t.forEach)t.forEach(e);else for(var o=t.slice(),n=0;n<o.length;n++)e(o[n],n)},arrayMap:function(t,e){if(t.map)return t.map(e);for(var o=t.slice(),n=[],r=0;r<o.length;r++)n.push(e(o[r],r));return n},arrayFind:function(t,e){if(t.find)return t.find(e);for(var o=0;o<t.length;o++)if(e(t[o],o))return t[o]},arrayFilter:n,arrayDifference:function(t,e){return n(t,function(t,o){return!e(t,o)})},arraySome:function(t,e){if(0===t.length)return!1;for(var o=0;o<t.length;o++)if(e(t[o],o,t))return!0;return!1},hashToArray:function(t){var e=[];for(var o in t)t.hasOwnProperty(o)&&e.push(t[o]);return e},sortArrayOfHash:function(t,e,o){var n=function(t,e){return t<e};t.sort(function(t,r){return t[e]===r[e]?0:o?n(t[e],r[e]):n(r[e],t[e])})},throttle:function(t,e){var o=!1;return function(){o||(t.apply(null,arguments),o=!0,setTimeout(function(){o=!1},e))}},isArray:function(t){return Array.isArray?Array.isArray(t):t&&void 0!==t.length&&t.pop&&t.push},isDate:function(t){return!(!t||"object"!=typeof t||!(t.getFullYear&&t.getMonth&&t.getDate))},isStringObject:function(t){return t&&"object"==typeof t&&"function String() { [native code] }"===Function.prototype.toString.call(t.constructor)},isNumberObject:function(t){return t&&"object"==typeof t&&"function Number() { [native code] }"===Function.prototype.toString.call(t.constructor)},isBooleanObject:function(t){return t&&"object"==typeof t&&"function Boolean() { [native code] }"===Function.prototype.toString.call(t.constructor)},delay:function(t,e){var o,n=function(){n.$cancelTimeout(),t.$pending=!0;var r=Array.prototype.slice.call(arguments);o=setTimeout(function(){t.apply(this,r),n.$pending=!1},e)};return n.$pending=!1,n.$cancelTimeout=function(){clearTimeout(o),t.$pending=!1},n.$execute=function(){t(),t.$cancelTimeout()},n},objectKeys:function(t){if(Object.keys)return Object.keys(t);var e,o=[];for(e in t)Object.prototype.hasOwnProperty.call(t,e)&&o.push(e);return o}}}})});
//# sourceMappingURL=dhtmlxgantt_tooltip.js.map