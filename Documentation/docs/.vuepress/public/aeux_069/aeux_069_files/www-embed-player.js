(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var n;function aa(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}}
var ba="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){if(a==Array.prototype||a==Object.prototype)return a;a[b]=c.value;return a};
function ca(a){a=["object"==typeof globalThis&&globalThis,a,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var b=0;b<a.length;++b){var c=a[b];if(c&&c.Math==Math)return c}throw Error("Cannot find global object");}
var da=ca(this);function r(a,b){if(b)a:{for(var c=da,d=a.split("."),e=0;e<d.length-1;e++){var f=d[e];if(!(f in c))break a;c=c[f]}d=d[d.length-1];e=c[d];f=b(e);f!=e&&null!=f&&ba(c,d,{configurable:!0,writable:!0,value:f})}}
r("Symbol",function(a){function b(e){if(this instanceof b)throw new TypeError("Symbol is not a constructor");return new c("jscomp_symbol_"+(e||"")+"_"+d++,e)}
function c(e,f){this.f=e;ba(this,"description",{configurable:!0,writable:!0,value:f})}
if(a)return a;c.prototype.toString=function(){return this.f};
var d=0;return b});
r("Symbol.iterator",function(a){if(a)return a;a=Symbol("Symbol.iterator");for(var b="Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "),c=0;c<b.length;c++){var d=da[b[c]];"function"===typeof d&&"function"!=typeof d.prototype[a]&&ba(d.prototype,a,{configurable:!0,writable:!0,value:function(){return ea(aa(this))}})}return a});
function ea(a){a={next:a};a[Symbol.iterator]=function(){return this};
return a}
function u(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):{next:aa(a)}}
function fa(a){for(var b,c=[];!(b=a.next()).done;)c.push(b.value);return c}
var ha="function"==typeof Object.create?Object.create:function(a){function b(){}
b.prototype=a;return new b},ia=function(){function a(){function c(){}
new c;Reflect.construct(c,[],function(){});
return new c instanceof c}
if("undefined"!=typeof Reflect&&Reflect.construct){if(a())return Reflect.construct;var b=Reflect.construct;return function(c,d,e){c=b(c,d);e&&Reflect.setPrototypeOf(c,e.prototype);return c}}return function(c,d,e){void 0===e&&(e=c);
e=ha(e.prototype||Object.prototype);return Function.prototype.apply.call(c,e,d)||e}}(),ja;
if("function"==typeof Object.setPrototypeOf)ja=Object.setPrototypeOf;else{var ka;a:{var la={a:!0},ma={};try{ma.__proto__=la;ka=ma.a;break a}catch(a){}ka=!1}ja=ka?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null}var na=ja;
function v(a,b){a.prototype=ha(b.prototype);a.prototype.constructor=a;if(na)na(a,b);else for(var c in b)if("prototype"!=c)if(Object.defineProperties){var d=Object.getOwnPropertyDescriptor(b,c);d&&Object.defineProperty(a,c,d)}else a[c]=b[c];a.N=b.prototype}
function oa(){this.m=!1;this.i=null;this.g=void 0;this.f=1;this.j=this.l=0;this.u=this.h=null}
function qa(a){if(a.m)throw new TypeError("Generator is already running");a.m=!0}
oa.prototype.B=function(a){this.g=a};
function ra(a,b){a.h={Ea:b,ra:!0};a.f=a.l||a.j}
oa.prototype["return"]=function(a){this.h={"return":a};this.f=this.j};
function w(a,b,c){a.f=c;return{value:b}}
oa.prototype.F=function(a){this.f=a};
function sa(a){a.l=2;a.j=3}
function ta(a){a.l=0;a.h=null}
function ua(a){a.u=[a.h];a.l=0;a.j=0}
function va(a){var b=a.u.splice(0)[0];(b=a.h=a.h||b)?b.ra?a.f=a.l||a.j:void 0!=b.F&&a.j<b.F?(a.f=b.F,a.h=null):a.f=a.j:a.f=0}
function wa(a){this.f=new oa;this.g=a}
function xa(a,b){qa(a.f);var c=a.f.i;if(c)return ya(a,"return"in c?c["return"]:function(d){return{value:d,done:!0}},b,a.f["return"]);
a.f["return"](b);return za(a)}
function ya(a,b,c,d){try{var e=b.call(a.f.i,c);if(!(e instanceof Object))throw new TypeError("Iterator result "+e+" is not an object");if(!e.done)return a.f.m=!1,e;var f=e.value}catch(g){return a.f.i=null,ra(a.f,g),za(a)}a.f.i=null;d.call(a.f,f);return za(a)}
function za(a){for(;a.f.f;)try{var b=a.g(a.f);if(b)return a.f.m=!1,{value:b.value,done:!1}}catch(c){a.f.g=void 0,ra(a.f,c)}a.f.m=!1;if(a.f.h){b=a.f.h;a.f.h=null;if(b.ra)throw b.Ea;return{value:b["return"],done:!0}}return{value:void 0,done:!0}}
function Aa(a){this.next=function(b){qa(a.f);a.f.i?b=ya(a,a.f.i.next,b,a.f.B):(a.f.B(b),b=za(a));return b};
this["throw"]=function(b){qa(a.f);a.f.i?b=ya(a,a.f.i["throw"],b,a.f.B):(ra(a.f,b),b=za(a));return b};
this["return"]=function(b){return xa(a,b)};
this[Symbol.iterator]=function(){return this}}
function x(a,b){var c=new Aa(new wa(b));na&&a.prototype&&na(c,a.prototype);return c}
r("Reflect",function(a){return a?a:{}});
r("Reflect.construct",function(){return ia});
r("Reflect.setPrototypeOf",function(a){return a?a:na?function(b,c){try{return na(b,c),!0}catch(d){return!1}}:null});
function Ba(a,b,c){if(null==a)throw new TypeError("The 'this' value for String.prototype."+c+" must not be null or undefined");if(b instanceof RegExp)throw new TypeError("First argument to String.prototype."+c+" must not be a regular expression");return a+""}
r("String.prototype.endsWith",function(a){return a?a:function(b,c){var d=Ba(this,b,"endsWith");b+="";void 0===c&&(c=d.length);for(var e=Math.max(0,Math.min(c|0,d.length)),f=b.length;0<f&&0<e;)if(d[--e]!=b[--f])return!1;return 0>=f}});
r("String.prototype.startsWith",function(a){return a?a:function(b,c){var d=Ba(this,b,"startsWith");b+="";for(var e=d.length,f=b.length,g=Math.max(0,Math.min(c|0,d.length)),h=0;h<f&&g<e;)if(d[g++]!=b[h++])return!1;return h>=f}});
function Ca(a,b){a instanceof String&&(a+="");var c=0,d={next:function(){if(c<a.length){var e=c++;return{value:b(e,a[e]),done:!1}}d.next=function(){return{done:!0,value:void 0}};
return d.next()}};
d[Symbol.iterator]=function(){return d};
return d}
r("Array.prototype.keys",function(a){return a?a:function(){return Ca(this,function(b){return b})}});
r("Array.prototype.values",function(a){return a?a:function(){return Ca(this,function(b,c){return c})}});
function Da(a,b){return Object.prototype.hasOwnProperty.call(a,b)}
var Ea="function"==typeof Object.assign?Object.assign:function(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(d)for(var e in d)Da(d,e)&&(a[e]=d[e])}return a};
r("Object.assign",function(a){return a||Ea});
r("Promise",function(a){function b(g){this.g=0;this.h=void 0;this.f=[];var h=this.i();try{g(h.resolve,h.reject)}catch(k){h.reject(k)}}
function c(){this.f=null}
function d(g){return g instanceof b?g:new b(function(h){h(g)})}
if(a)return a;c.prototype.g=function(g){if(null==this.f){this.f=[];var h=this;this.h(function(){h.j()})}this.f.push(g)};
var e=da.setTimeout;c.prototype.h=function(g){e(g,0)};
c.prototype.j=function(){for(;this.f&&this.f.length;){var g=this.f;this.f=[];for(var h=0;h<g.length;++h){var k=g[h];g[h]=null;try{k()}catch(l){this.i(l)}}}this.f=null};
c.prototype.i=function(g){this.h(function(){throw g;})};
b.prototype.i=function(){function g(l){return function(m){k||(k=!0,l.call(h,m))}}
var h=this,k=!1;return{resolve:g(this.C),reject:g(this.j)}};
b.prototype.C=function(g){if(g===this)this.j(new TypeError("A Promise cannot resolve to itself"));else if(g instanceof b)this.G(g);else{a:switch(typeof g){case "object":var h=null!=g;break a;case "function":h=!0;break a;default:h=!1}h?this.u(g):this.l(g)}};
b.prototype.u=function(g){var h=void 0;try{h=g.then}catch(k){this.j(k);return}"function"==typeof h?this.H(h,g):this.l(g)};
b.prototype.j=function(g){this.m(2,g)};
b.prototype.l=function(g){this.m(1,g)};
b.prototype.m=function(g,h){if(0!=this.g)throw Error("Cannot settle("+g+", "+h+"): Promise already settled in state"+this.g);this.g=g;this.h=h;this.B()};
b.prototype.B=function(){if(null!=this.f){for(var g=0;g<this.f.length;++g)f.g(this.f[g]);this.f=null}};
var f=new c;b.prototype.G=function(g){var h=this.i();g.ca(h.resolve,h.reject)};
b.prototype.H=function(g,h){var k=this.i();try{g.call(h,k.resolve,k.reject)}catch(l){k.reject(l)}};
b.prototype.then=function(g,h){function k(t,p){return"function"==typeof t?function(D){try{l(t(D))}catch(N){m(N)}}:p}
var l,m,q=new b(function(t,p){l=t;m=p});
this.ca(k(g,l),k(h,m));return q};
b.prototype["catch"]=function(g){return this.then(void 0,g)};
b.prototype.ca=function(g,h){function k(){switch(l.g){case 1:g(l.h);break;case 2:h(l.h);break;default:throw Error("Unexpected state: "+l.g);}}
var l=this;null==this.f?f.g(k):this.f.push(k)};
b.resolve=d;b.reject=function(g){return new b(function(h,k){k(g)})};
b.race=function(g){return new b(function(h,k){for(var l=u(g),m=l.next();!m.done;m=l.next())d(m.value).ca(h,k)})};
b.all=function(g){var h=u(g),k=h.next();return k.done?d([]):new b(function(l,m){function q(D){return function(N){t[D]=N;p--;0==p&&l(t)}}
var t=[],p=0;do t.push(void 0),p++,d(k.value).ca(q(t.length-1),m),k=h.next();while(!k.done)})};
return b});
r("Object.setPrototypeOf",function(a){return a||na});
r("Array.prototype.entries",function(a){return a?a:function(){return Ca(this,function(b,c){return[b,c]})}});
r("WeakMap",function(a){function b(k){this.f=(h+=Math.random()+1).toString();if(k){k=u(k);for(var l;!(l=k.next()).done;)l=l.value,this.set(l[0],l[1])}}
function c(){}
function d(k){var l=typeof k;return"object"===l&&null!==k||"function"===l}
function e(k){if(!Da(k,g)){var l=new c;ba(k,g,{value:l})}}
function f(k){var l=Object[k];l&&(Object[k]=function(m){if(m instanceof c)return m;Object.isExtensible(m)&&e(m);return l(m)})}
if(function(){if(!a||!Object.seal)return!1;try{var k=Object.seal({}),l=Object.seal({}),m=new a([[k,2],[l,3]]);if(2!=m.get(k)||3!=m.get(l))return!1;m["delete"](k);m.set(l,4);return!m.has(k)&&4==m.get(l)}catch(q){return!1}}())return a;
var g="$jscomp_hidden_"+Math.random();f("freeze");f("preventExtensions");f("seal");var h=0;b.prototype.set=function(k,l){if(!d(k))throw Error("Invalid WeakMap key");e(k);if(!Da(k,g))throw Error("WeakMap key fail: "+k);k[g][this.f]=l;return this};
b.prototype.get=function(k){return d(k)&&Da(k,g)?k[g][this.f]:void 0};
b.prototype.has=function(k){return d(k)&&Da(k,g)&&Da(k[g],this.f)};
b.prototype["delete"]=function(k){return d(k)&&Da(k,g)&&Da(k[g],this.f)?delete k[g][this.f]:!1};
return b});
r("Map",function(a){function b(){var h={};return h.previous=h.next=h.head=h}
function c(h,k){var l=h.f;return ea(function(){if(l){for(;l.head!=h.f;)l=l.previous;for(;l.next!=l.head;)return l=l.next,{done:!1,value:k(l)};l=null}return{done:!0,value:void 0}})}
function d(h,k){var l=k&&typeof k;"object"==l||"function"==l?f.has(k)?l=f.get(k):(l=""+ ++g,f.set(k,l)):l="p_"+k;var m=h.g[l];if(m&&Da(h.g,l))for(var q=0;q<m.length;q++){var t=m[q];if(k!==k&&t.key!==t.key||k===t.key)return{id:l,list:m,index:q,A:t}}return{id:l,list:m,index:-1,A:void 0}}
function e(h){this.g={};this.f=b();this.size=0;if(h){h=u(h);for(var k;!(k=h.next()).done;)k=k.value,this.set(k[0],k[1])}}
if(function(){if(!a||"function"!=typeof a||!a.prototype.entries||"function"!=typeof Object.seal)return!1;try{var h=Object.seal({x:4}),k=new a(u([[h,"s"]]));if("s"!=k.get(h)||1!=k.size||k.get({x:4})||k.set({x:4},"t")!=k||2!=k.size)return!1;var l=k.entries(),m=l.next();if(m.done||m.value[0]!=h||"s"!=m.value[1])return!1;m=l.next();return m.done||4!=m.value[0].x||"t"!=m.value[1]||!l.next().done?!1:!0}catch(q){return!1}}())return a;
var f=new WeakMap;e.prototype.set=function(h,k){h=0===h?0:h;var l=d(this,h);l.list||(l.list=this.g[l.id]=[]);l.A?l.A.value=k:(l.A={next:this.f,previous:this.f.previous,head:this.f,key:h,value:k},l.list.push(l.A),this.f.previous.next=l.A,this.f.previous=l.A,this.size++);return this};
e.prototype["delete"]=function(h){h=d(this,h);return h.A&&h.list?(h.list.splice(h.index,1),h.list.length||delete this.g[h.id],h.A.previous.next=h.A.next,h.A.next.previous=h.A.previous,h.A.head=null,this.size--,!0):!1};
e.prototype.clear=function(){this.g={};this.f=this.f.previous=b();this.size=0};
e.prototype.has=function(h){return!!d(this,h).A};
e.prototype.get=function(h){return(h=d(this,h).A)&&h.value};
e.prototype.entries=function(){return c(this,function(h){return[h.key,h.value]})};
e.prototype.keys=function(){return c(this,function(h){return h.key})};
e.prototype.values=function(){return c(this,function(h){return h.value})};
e.prototype.forEach=function(h,k){for(var l=this.entries(),m;!(m=l.next()).done;)m=m.value,h.call(k,m[1],m[0],this)};
e.prototype[Symbol.iterator]=e.prototype.entries;var g=0;return e});
r("Object.entries",function(a){return a?a:function(b){var c=[],d;for(d in b)Da(b,d)&&c.push([d,b[d]]);return c}});
r("Object.is",function(a){return a?a:function(b,c){return b===c?0!==b||1/b===1/c:b!==b&&c!==c}});
r("Array.prototype.includes",function(a){return a?a:function(b,c){var d=this;d instanceof String&&(d=String(d));var e=d.length,f=c||0;for(0>f&&(f=Math.max(f+e,0));f<e;f++){var g=d[f];if(g===b||Object.is(g,b))return!0}return!1}});
r("String.prototype.includes",function(a){return a?a:function(b,c){return-1!==Ba(this,b,"includes").indexOf(b,c||0)}});
r("Set",function(a){function b(c){this.f=new Map;if(c){c=u(c);for(var d;!(d=c.next()).done;)this.add(d.value)}this.size=this.f.size}
if(function(){if(!a||"function"!=typeof a||!a.prototype.entries||"function"!=typeof Object.seal)return!1;try{var c=Object.seal({x:4}),d=new a(u([c]));if(!d.has(c)||1!=d.size||d.add(c)!=d||1!=d.size||d.add({x:4})!=d||2!=d.size)return!1;var e=d.entries(),f=e.next();if(f.done||f.value[0]!=c||f.value[1]!=c)return!1;f=e.next();return f.done||f.value[0]==c||4!=f.value[0].x||f.value[1]!=f.value[0]?!1:e.next().done}catch(g){return!1}}())return a;
b.prototype.add=function(c){c=0===c?0:c;this.f.set(c,c);this.size=this.f.size;return this};
b.prototype["delete"]=function(c){c=this.f["delete"](c);this.size=this.f.size;return c};
b.prototype.clear=function(){this.f.clear();this.size=0};
b.prototype.has=function(c){return this.f.has(c)};
b.prototype.entries=function(){return this.f.entries()};
b.prototype.values=function(){return this.f.values()};
b.prototype.keys=b.prototype.values;b.prototype[Symbol.iterator]=b.prototype.values;b.prototype.forEach=function(c,d){var e=this;this.f.forEach(function(f){return c.call(d,f,f,e)})};
return b});
var y=this||self;function z(a,b,c){a=a.split(".");c=c||y;a[0]in c||"undefined"==typeof c.execScript||c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)a.length||void 0===b?c[d]&&c[d]!==Object.prototype[d]?c=c[d]:c=c[d]={}:c[d]=b}
var Fa=/^[\w+/_-]+[=]{0,2}$/,Ga=null;function Ha(a){return(a=a.querySelector&&a.querySelector("script[nonce]"))&&(a=a.nonce||a.getAttribute("nonce"))&&Fa.test(a)?a:""}
function A(a,b){for(var c=a.split("."),d=b||y,e=0;e<c.length;e++)if(d=d[c[e]],null==d)return null;return d}
function Ia(){}
function Ja(a){a.ka=void 0;a.getInstance=function(){return a.ka?a.ka:a.ka=new a}}
function Ka(a){var b=typeof a;return"object"!=b?b:a?Array.isArray(a)?"array":b:"null"}
function La(a){var b=Ka(a);return"array"==b||"object"==b&&"number"==typeof a.length}
function Ma(a){return"function"==Ka(a)}
function Na(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}
function Oa(a){return Object.prototype.hasOwnProperty.call(a,Qa)&&a[Qa]||(a[Qa]=++Ra)}
var Qa="closure_uid_"+(1E9*Math.random()>>>0),Ra=0;function Sa(a,b,c){return a.call.apply(a.bind,arguments)}
function Ta(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var e=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(e,d);return a.apply(b,e)}}return function(){return a.apply(b,arguments)}}
function B(a,b,c){Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?B=Sa:B=Ta;return B.apply(null,arguments)}
function Ua(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var d=c.slice();d.push.apply(d,arguments);return a.apply(this,d)}}
var C=Date.now;function Va(a,b){z(a,b,void 0)}
function E(a,b){function c(){}
c.prototype=b.prototype;a.N=b.prototype;a.prototype=new c;a.prototype.constructor=a}
function Wa(a){return a}
;function F(a){if(Error.captureStackTrace)Error.captureStackTrace(this,F);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))}
E(F,Error);F.prototype.name="CustomError";function Xa(a){a=a.url;var b=/[?&]dsh=1(&|$)/.test(a);this.h=!b&&/[?&]ae=1(&|$)/.test(a);this.i=!b&&/[?&]ae=2(&|$)/.test(a);if((this.f=/[?&]adurl=([^&]*)/.exec(a))&&this.f[1]){try{var c=decodeURIComponent(this.f[1])}catch(d){c=null}this.g=c}}
;function Ya(a){var b=!1,c;return function(){b||(c=a(),b=!0);return c}}
;var Za=Array.prototype.indexOf?function(a,b){return Array.prototype.indexOf.call(a,b,void 0)}:function(a,b){if("string"===typeof a)return"string"!==typeof b||1!=b.length?-1:a.indexOf(b,0);
for(var c=0;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},G=Array.prototype.forEach?function(a,b,c){Array.prototype.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e="string"===typeof a?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},$a=Array.prototype.filter?function(a,b){return Array.prototype.filter.call(a,b,void 0)}:function(a,b){for(var c=a.length,d=[],e=0,f="string"===typeof a?a.split(""):a,g=0;g<c;g++)if(g in f){var h=f[g];
b.call(void 0,h,g,a)&&(d[e++]=h)}return d},ab=Array.prototype.map?function(a,b){return Array.prototype.map.call(a,b,void 0)}:function(a,b){for(var c=a.length,d=Array(c),e="string"===typeof a?a.split(""):a,f=0;f<c;f++)f in e&&(d[f]=b.call(void 0,e[f],f,a));
return d},bb=Array.prototype.reduce?function(a,b,c){return Array.prototype.reduce.call(a,b,c)}:function(a,b,c){var d=c;
G(a,function(e,f){d=b.call(void 0,d,e,f,a)});
return d};
function cb(a,b){a:{var c=a.length;for(var d="string"===typeof a?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){c=e;break a}c=-1}return 0>c?null:"string"===typeof a?a.charAt(c):a[c]}
function db(a,b){var c=Za(a,b);0<=c&&Array.prototype.splice.call(a,c,1)}
function eb(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]}
function fb(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(La(d)){var e=a.length||0,f=d.length||0;a.length=e+f;for(var g=0;g<f;g++)a[e+g]=d[g]}else a.push(d)}}
;function gb(a,b){for(var c in a)b.call(void 0,a[c],c,a)}
function hb(a,b){var c=La(b),d=c?b:arguments;for(c=c?0:1;c<d.length;c++){if(null==a)return;a=a[d[c]]}return a}
function ib(a){var b=jb,c;for(c in b)if(a.call(void 0,b[c],c,b))return c}
function kb(a){for(var b in a)return!1;return!0}
function lb(a,b){if(null!==a&&b in a)throw Error('The object already contains the key "'+b+'"');a[b]=!0}
function mb(a,b){for(var c in a)if(!(c in b)||a[c]!==b[c])return!1;for(var d in b)if(!(d in a))return!1;return!0}
function nb(a){var b={},c;for(c in a)b[c]=a[c];return b}
function ob(a){var b=Ka(a);if("object"==b||"array"==b){if(Ma(a.clone))return a.clone();b="array"==b?[]:{};for(var c in a)b[c]=ob(a[c]);return b}return a}
var pb="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function qb(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<pb.length;f++)c=pb[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}}
;var rb;function sb(){if(void 0===rb){var a=null,b=y.trustedTypes;if(b&&b.createPolicy){try{a=b.createPolicy("goog#html",{createHTML:Wa,createScript:Wa,createScriptURL:Wa})}catch(c){y.console&&y.console.error(c.message)}rb=a}else rb=a}return rb}
;function tb(a,b){this.f=a===ub&&b||"";this.g=vb}
tb.prototype.L=!0;tb.prototype.K=function(){return this.f};
function wb(a){return a instanceof tb&&a.constructor===tb&&a.g===vb?a.f:"type_error:Const"}
var vb={},ub={};function xb(a,b){this.f=a===yb&&b||"";this.g=zb}
xb.prototype.L=!0;xb.prototype.K=function(){return this.f.toString()};
xb.prototype.ja=!0;xb.prototype.ga=function(){return 1};
function Ab(a){if(a instanceof xb&&a.constructor===xb&&a.g===zb)return a.f;Ka(a);return"type_error:TrustedResourceUrl"}
var zb={};function Bb(a){var b=sb();a=b?b.createScriptURL(a):a;return new xb(yb,a)}
var yb={};var Cb=String.prototype.trim?function(a){return a.trim()}:function(a){return/^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]};
function Db(a,b){if(b)a=a.replace(Eb,"&amp;").replace(Fb,"&lt;").replace(Gb,"&gt;").replace(Hb,"&quot;").replace(Ib,"&#39;").replace(Jb,"&#0;");else{if(!Kb.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(Eb,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(Fb,"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(Gb,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(Hb,"&quot;"));-1!=a.indexOf("'")&&(a=a.replace(Ib,"&#39;"));-1!=a.indexOf("\x00")&&(a=a.replace(Jb,"&#0;"))}return a}
var Eb=/&/g,Fb=/</g,Gb=/>/g,Hb=/"/g,Ib=/'/g,Jb=/\x00/g,Kb=/[\x00&<>"']/;function H(a,b){this.f=a===Lb&&b||"";this.g=Mb}
H.prototype.L=!0;H.prototype.K=function(){return this.f.toString()};
H.prototype.ja=!0;H.prototype.ga=function(){return 1};
function Nb(a){if(a instanceof H&&a.constructor===H&&a.g===Mb)return a.f;Ka(a);return"type_error:SafeUrl"}
var Ob=/^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;function Pb(a){if(a instanceof H)return a;a="object"==typeof a&&a.L?a.K():String(a);Ob.test(a)||(a="about:invalid#zClosurez");return new H(Lb,a)}
var Mb={},Qb=new H(Lb,"about:invalid#zClosurez"),Lb={};var Rb;a:{var Sb=y.navigator;if(Sb){var Ub=Sb.userAgent;if(Ub){Rb=Ub;break a}}Rb=""}function I(a){return-1!=Rb.indexOf(a)}
;function Vb(){this.f="";this.h=Wb;this.g=null}
Vb.prototype.ja=!0;Vb.prototype.ga=function(){return this.g};
Vb.prototype.L=!0;Vb.prototype.K=function(){return this.f.toString()};
var Wb={};function Xb(a,b){var c=new Vb,d=sb();c.f=d?d.createHTML(a):a;c.g=b;return c}
;function Yb(a,b){var c=b instanceof H?b:Pb(b);a.href=Nb(c)}
function Zb(a,b){a.src=Ab(b);var c;(c=a.ownerDocument&&a.ownerDocument.defaultView)&&c!=y?c=Ha(c.document):(null===Ga&&(Ga=Ha(y.document)),c=Ga);c&&a.setAttribute("nonce",c)}
;function $b(a){return a=Db(a,void 0)}
function ac(a){for(var b=0,c=0;c<a.length;++c)b=31*b+a.charCodeAt(c)>>>0;return b}
;var bc=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^\\/?#]*)@)?([^\\/?#]*?)(?::([0-9]+))?(?=[\\/?#]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;function J(a){return a?decodeURI(a):a}
function K(a,b){return b.match(bc)[a]||null}
function cc(a,b,c){if(Array.isArray(b))for(var d=0;d<b.length;d++)cc(a,String(b[d]),c);else null!=b&&c.push(a+(""===b?"":"="+encodeURIComponent(String(b))))}
function dc(a){var b=[],c;for(c in a)cc(c,a[c],b);return b.join("&")}
function ec(a,b){var c=dc(b);if(c){var d=a.indexOf("#");0>d&&(d=a.length);var e=a.indexOf("?");if(0>e||e>d){e=d;var f=""}else f=a.substring(e+1,d);d=[a.substr(0,e),f,a.substr(d)];e=d[1];d[1]=c?e?e+"&"+c:c:e;c=d[0]+(d[1]?"?"+d[1]:"")+d[2]}else c=a;return c}
var fc=/#|$/;function gc(a,b){var c=a.search(fc);a:{var d=0;for(var e=b.length;0<=(d=a.indexOf(b,d))&&d<c;){var f=a.charCodeAt(d-1);if(38==f||63==f)if(f=a.charCodeAt(d+e),!f||61==f||38==f||35==f)break a;d+=e+1}d=-1}if(0>d)return null;e=a.indexOf("&",d);if(0>e||e>c)e=c;d+=b.length+1;return decodeURIComponent(a.substr(d,e-d).replace(/\+/g," "))}
;var hc=I("Opera"),ic=I("Trident")||I("MSIE"),jc=I("Edge"),kc=I("Gecko")&&!(-1!=Rb.toLowerCase().indexOf("webkit")&&!I("Edge"))&&!(I("Trident")||I("MSIE"))&&!I("Edge"),lc=-1!=Rb.toLowerCase().indexOf("webkit")&&!I("Edge");function mc(){var a=y.document;return a?a.documentMode:void 0}
var nc;a:{var oc="",pc=function(){var a=Rb;if(kc)return/rv:([^\);]+)(\)|;)/.exec(a);if(jc)return/Edge\/([\d\.]+)/.exec(a);if(ic)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(lc)return/WebKit\/(\S+)/.exec(a);if(hc)return/(?:Version)[ \/]?(\S+)/.exec(a)}();
pc&&(oc=pc?pc[1]:"");if(ic){var qc=mc();if(null!=qc&&qc>parseFloat(oc)){nc=String(qc);break a}}nc=oc}var rc=nc,sc;if(y.document&&ic){var tc=mc();sc=tc?tc:parseInt(rc,10)||void 0}else sc=void 0;var uc=sc;var vc={},wc=null;var L=window;function xc(a){var b=A("window.location.href");null==a&&(a='Unknown Error of type "null/undefined"');if("string"===typeof a)return{message:a,name:"Unknown error",lineNumber:"Not available",fileName:b,stack:"Not available"};var c=!1;try{var d=a.lineNumber||a.line||"Not available"}catch(f){d="Not available",c=!0}try{var e=a.fileName||a.filename||a.sourceURL||y.$googDebugFname||b}catch(f){e="Not available",c=!0}return!c&&a.lineNumber&&a.fileName&&a.stack&&a.message&&a.name?a:(b=a.message,null==b&&(a.constructor&&
a.constructor instanceof Function?(a.constructor.name?b=a.constructor.name:(b=a.constructor,yc[b]?b=yc[b]:(b=String(b),yc[b]||(c=/function\s+([^\(]+)/m.exec(b),yc[b]=c?c[1]:"[Anonymous]"),b=yc[b])),b='Unknown Error of type "'+b+'"'):b="Unknown Error of unknown type"),{message:b,name:a.name||"UnknownError",lineNumber:d,fileName:e,stack:a.stack||"Not available"})}
var yc={};function zc(a){this.f=a||{cookie:""}}
n=zc.prototype;n.isEnabled=function(){return navigator.cookieEnabled};
n.set=function(a,b,c){var d=!1;if("object"===typeof c){var e=c.Bb;d=c.secure||!1;var f=c.domain||void 0;var g=c.path||void 0;var h=c.sa}if(/[;=\s]/.test(a))throw Error('Invalid cookie name "'+a+'"');if(/[;\r\n]/.test(b))throw Error('Invalid cookie value "'+b+'"');void 0===h&&(h=-1);c=f?";domain="+f:"";g=g?";path="+g:"";d=d?";secure":"";h=0>h?"":0==h?";expires="+(new Date(1970,1,1)).toUTCString():";expires="+(new Date(C()+1E3*h)).toUTCString();this.f.cookie=a+"="+b+c+g+h+d+(null!=e?";samesite="+e:
"")};
n.get=function(a,b){for(var c=a+"=",d=(this.f.cookie||"").split(";"),e=0,f;e<d.length;e++){f=Cb(d[e]);if(0==f.lastIndexOf(c,0))return f.substr(c.length);if(f==a)return""}return b};
n.remove=function(a,b,c){var d=void 0!==this.get(a);this.set(a,"",{sa:0,path:b,domain:c});return d};
n.isEmpty=function(){return!this.f.cookie};
n.clear=function(){for(var a=(this.f.cookie||"").split(";"),b=[],c=[],d,e,f=0;f<a.length;f++)e=Cb(a[f]),d=e.indexOf("="),-1==d?(b.push(""),c.push(e)):(b.push(e.substring(0,d)),c.push(e.substring(d+1)));for(a=b.length-1;0<=a;a--)this.remove(b[a])};
var Ac=new zc("undefined"==typeof document?null:document);var Bc=!ic||9<=Number(uc);function Cc(a,b){this.x=void 0!==a?a:0;this.y=void 0!==b?b:0}
n=Cc.prototype;n.clone=function(){return new Cc(this.x,this.y)};
n.equals=function(a){return a instanceof Cc&&(this==a?!0:this&&a?this.x==a.x&&this.y==a.y:!1)};
n.ceil=function(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);return this};
n.floor=function(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);return this};
n.round=function(){this.x=Math.round(this.x);this.y=Math.round(this.y);return this};function Dc(a,b){this.width=a;this.height=b}
n=Dc.prototype;n.clone=function(){return new Dc(this.width,this.height)};
n.aspectRatio=function(){return this.width/this.height};
n.isEmpty=function(){return!(this.width*this.height)};
n.ceil=function(){this.width=Math.ceil(this.width);this.height=Math.ceil(this.height);return this};
n.floor=function(){this.width=Math.floor(this.width);this.height=Math.floor(this.height);return this};
n.round=function(){this.width=Math.round(this.width);this.height=Math.round(this.height);return this};function Ec(a){var b=document;return"string"===typeof a?b.getElementById(a):a}
function Fc(a,b){gb(b,function(c,d){c&&"object"==typeof c&&c.L&&(c=c.K());"style"==d?a.style.cssText=c:"class"==d?a.className=c:"for"==d?a.htmlFor=c:Gc.hasOwnProperty(d)?a.setAttribute(Gc[d],c):0==d.lastIndexOf("aria-",0)||0==d.lastIndexOf("data-",0)?a.setAttribute(d,c):a[d]=c})}
var Gc={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",nonce:"nonce",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"};
function Hc(a,b,c){var d=arguments,e=document,f=String(d[0]),g=d[1];if(!Bc&&g&&(g.name||g.type)){f=["<",f];g.name&&f.push(' name="',$b(g.name),'"');if(g.type){f.push(' type="',$b(g.type),'"');var h={};qb(h,g);delete h.type;g=h}f.push(">");f=f.join("")}f=Ic(e,f);g&&("string"===typeof g?f.className=g:Array.isArray(g)?f.className=g.join(" "):Fc(f,g));2<d.length&&Jc(e,f,d);return f}
function Jc(a,b,c){function d(g){g&&b.appendChild("string"===typeof g?a.createTextNode(g):g)}
for(var e=2;e<c.length;e++){var f=c[e];!La(f)||Na(f)&&0<f.nodeType?d(f):G(Kc(f)?eb(f):f,d)}}
function Ic(a,b){b=String(b);"application/xhtml+xml"===a.contentType&&(b=b.toLowerCase());return a.createElement(b)}
function Kc(a){if(a&&"number"==typeof a.length){if(Na(a))return"function"==typeof a.item||"string"==typeof a.item;if(Ma(a))return"function"==typeof a.item}return!1}
function Lc(a,b){for(var c=0;a;){if(b(a))return a;a=a.parentNode;c++}return null}
;function Mc(a){Nc();return Bb(a)}
var Nc=Ia;function Oc(a){var b=Pc;if(b)for(var c in b)Object.prototype.hasOwnProperty.call(b,c)&&a.call(void 0,b[c],c,b)}
function Qc(){var a=[];Oc(function(b){a.push(b)});
return a}
var Pc={hb:"allow-forms",ib:"allow-modals",jb:"allow-orientation-lock",kb:"allow-pointer-lock",lb:"allow-popups",mb:"allow-popups-to-escape-sandbox",nb:"allow-presentation",ob:"allow-same-origin",pb:"allow-scripts",qb:"allow-top-navigation",rb:"allow-top-navigation-by-user-activation"},Rc=Ya(function(){return Qc()});
function Sc(){var a=Ic(document,"IFRAME"),b={};G(Rc(),function(c){a.sandbox&&a.sandbox.supports&&a.sandbox.supports(c)&&(b[c]=!0)});
return b}
;function M(){this.g=this.g;this.B=this.B}
M.prototype.g=!1;M.prototype.dispose=function(){this.g||(this.g=!0,this.o())};
function Tc(a,b){a.g?b():(a.B||(a.B=[]),a.B.push(b))}
M.prototype.o=function(){if(this.B)for(;this.B.length;)this.B.shift()()};
function Uc(a){a&&"function"==typeof a.dispose&&a.dispose()}
function Vc(a){for(var b=0,c=arguments.length;b<c;++b){var d=arguments[b];La(d)?Vc.apply(null,d):Uc(d)}}
;function O(a,b){var c=void 0;return new (c||(c=Promise))(function(d,e){function f(k){try{h(b.next(k))}catch(l){e(l)}}
function g(k){try{h(b["throw"](k))}catch(l){e(l)}}
function h(k){k.done?d(k.value):(new c(function(l){l(k.value)})).then(f,g)}
h((b=b.apply(a,void 0)).next())})}
;function Wc(a){"number"==typeof a&&(a=Math.round(a)+"px");return a}
;Bb(wb(new tb(ub,"//fonts.googleapis.com/css")));var Xc=(new Date).getTime();function Yc(a){if(!a)return"";a=a.split("#")[0].split("?")[0];a=a.toLowerCase();0==a.indexOf("//")&&(a=window.location.protocol+a);/^[\w\-]*:\/\//.test(a)||(a=window.location.href);var b=a.substring(a.indexOf("://")+3),c=b.indexOf("/");-1!=c&&(b=b.substring(0,c));a=a.substring(0,a.indexOf("://"));if("http"!==a&&"https"!==a&&"chrome-extension"!==a&&"file"!==a&&"android-app"!==a&&"chrome-search"!==a&&"chrome-untrusted"!==a&&"chrome"!==a&&"app"!==a)throw Error("Invalid URI scheme in origin: "+a);c="";
var d=b.indexOf(":");if(-1!=d){var e=b.substring(d+1);b=b.substring(0,d);if("http"===a&&"80"!==e||"https"===a&&"443"!==e)c=":"+e}return a+"://"+b+c}
;function Zc(){function a(){e[0]=1732584193;e[1]=4023233417;e[2]=2562383102;e[3]=271733878;e[4]=3285377520;m=l=0}
function b(q){for(var t=g,p=0;64>p;p+=4)t[p/4]=q[p]<<24|q[p+1]<<16|q[p+2]<<8|q[p+3];for(p=16;80>p;p++)q=t[p-3]^t[p-8]^t[p-14]^t[p-16],t[p]=(q<<1|q>>>31)&4294967295;q=e[0];var D=e[1],N=e[2],pa=e[3],fd=e[4];for(p=0;80>p;p++){if(40>p)if(20>p){var Pa=pa^D&(N^pa);var Tb=1518500249}else Pa=D^N^pa,Tb=1859775393;else 60>p?(Pa=D&N|pa&(D|N),Tb=2400959708):(Pa=D^N^pa,Tb=3395469782);Pa=((q<<5|q>>>27)&4294967295)+Pa+fd+Tb+t[p]&4294967295;fd=pa;pa=N;N=(D<<30|D>>>2)&4294967295;D=q;q=Pa}e[0]=e[0]+q&4294967295;e[1]=
e[1]+D&4294967295;e[2]=e[2]+N&4294967295;e[3]=e[3]+pa&4294967295;e[4]=e[4]+fd&4294967295}
function c(q,t){if("string"===typeof q){q=unescape(encodeURIComponent(q));for(var p=[],D=0,N=q.length;D<N;++D)p.push(q.charCodeAt(D));q=p}t||(t=q.length);p=0;if(0==l)for(;p+64<t;)b(q.slice(p,p+64)),p+=64,m+=64;for(;p<t;)if(f[l++]=q[p++],m++,64==l)for(l=0,b(f);p+64<t;)b(q.slice(p,p+64)),p+=64,m+=64}
function d(){var q=[],t=8*m;56>l?c(h,56-l):c(h,64-(l-56));for(var p=63;56<=p;p--)f[p]=t&255,t>>>=8;b(f);for(p=t=0;5>p;p++)for(var D=24;0<=D;D-=8)q[t++]=e[p]>>D&255;return q}
for(var e=[],f=[],g=[],h=[128],k=1;64>k;++k)h[k]=0;var l,m;a();return{reset:a,update:c,digest:d,Da:function(){for(var q=d(),t="",p=0;p<q.length;p++)t+="0123456789ABCDEF".charAt(Math.floor(q[p]/16))+"0123456789ABCDEF".charAt(q[p]%16);return t}}}
;function $c(a,b,c){var d=[],e=[];if(1==(Array.isArray(c)?2:1))return e=[b,a],G(d,function(h){e.push(h)}),ad(e.join(" "));
var f=[],g=[];G(c,function(h){g.push(h.key);f.push(h.value)});
c=Math.floor((new Date).getTime()/1E3);e=0==f.length?[c,b,a]:[f.join(":"),c,b,a];G(d,function(h){e.push(h)});
a=ad(e.join(" "));a=[c,a];0==g.length||a.push(g.join(""));return a.join("_")}
function ad(a){var b=Zc();b.update(a);return b.Da().toLowerCase()}
;function bd(a){var b=Yc(String(y.location.href)),c;(c=y.__SAPISID||y.__APISID||y.__OVERRIDE_SID)?c=!0:(c=new zc(document),c=c.get("SAPISID")||c.get("APISID")||c.get("__Secure-3PAPISID")||c.get("SID"),c=!!c);if(c&&(c=(b=0==b.indexOf("https:")||0==b.indexOf("chrome-extension:"))?y.__SAPISID:y.__APISID,c||(c=new zc(document),c=c.get(b?"SAPISID":"APISID")||c.get("__Secure-3PAPISID")),c)){b=b?"SAPISIDHASH":"APISIDHASH";var d=String(y.location.href);return d&&c&&b?[b,$c(Yc(d),c,a||null)].join(" "):null}return null}
;function cd(){this.g=[];this.f=-1}
cd.prototype.set=function(a,b){b=void 0===b?!0:b;0<=a&&52>a&&0===a%1&&this.g[a]!=b&&(this.g[a]=b,this.f=-1)};
cd.prototype.get=function(a){return!!this.g[a]};
function dd(a){-1==a.f&&(a.f=bb(a.g,function(b,c,d){return c?b+Math.pow(2,d):b},0));
return a.f}
;function ed(a,b){this.h=a;this.i=b;this.g=0;this.f=null}
ed.prototype.get=function(){if(0<this.g){this.g--;var a=this.f;this.f=a.next;a.next=null}else a=this.h();return a};
function gd(a,b){a.i(b);100>a.g&&(a.g++,b.next=a.f,a.f=b)}
;function hd(a){y.setTimeout(function(){throw a;},0)}
var id;
function jd(){var a=y.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!I("Presto")&&(a=function(){var e=Ic(document,"IFRAME");e.style.display="none";document.documentElement.appendChild(e);var f=e.contentWindow;e=f.document;e.open();e.close();var g="callImmediate"+Math.random(),h="file:"==f.location.protocol?"*":f.location.protocol+"//"+f.location.host;e=B(function(k){if(("*"==h||k.origin==h)&&k.data==g)this.port1.onmessage()},this);
f.addEventListener("message",e,!1);this.port1={};this.port2={postMessage:function(){f.postMessage(g,h)}}});
if("undefined"!==typeof a&&!I("Trident")&&!I("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var e=c.qa;c.qa=null;e()}};
return function(e){d.next={qa:e};d=d.next;b.port2.postMessage(0)}}return function(e){y.setTimeout(e,0)}}
;function kd(){this.g=this.f=null}
var md=new ed(function(){return new ld},function(a){a.reset()});
kd.prototype.add=function(a,b){var c=md.get();c.set(a,b);this.g?this.g.next=c:this.f=c;this.g=c};
kd.prototype.remove=function(){var a=null;this.f&&(a=this.f,this.f=this.f.next,this.f||(this.g=null),a.next=null);return a};
function ld(){this.next=this.scope=this.f=null}
ld.prototype.set=function(a,b){this.f=a;this.scope=b;this.next=null};
ld.prototype.reset=function(){this.next=this.scope=this.f=null};function nd(a,b){od||pd();qd||(od(),qd=!0);rd.add(a,b)}
var od;function pd(){if(y.Promise&&y.Promise.resolve){var a=y.Promise.resolve(void 0);od=function(){a.then(sd)}}else od=function(){var b=sd;
!Ma(y.setImmediate)||y.Window&&y.Window.prototype&&!I("Edge")&&y.Window.prototype.setImmediate==y.setImmediate?(id||(id=jd()),id(b)):y.setImmediate(b)}}
var qd=!1,rd=new kd;function sd(){for(var a;a=rd.remove();){try{a.f.call(a.scope)}catch(b){hd(b)}gd(md,a)}qd=!1}
;function td(){this.g=-1}
;function ud(){this.g=64;this.f=[];this.l=[];this.m=[];this.i=[];this.i[0]=128;for(var a=1;a<this.g;++a)this.i[a]=0;this.j=this.h=0;this.reset()}
E(ud,td);ud.prototype.reset=function(){this.f[0]=1732584193;this.f[1]=4023233417;this.f[2]=2562383102;this.f[3]=271733878;this.f[4]=3285377520;this.j=this.h=0};
function vd(a,b,c){c||(c=0);var d=a.m;if("string"===typeof b)for(var e=0;16>e;e++)d[e]=b.charCodeAt(c)<<24|b.charCodeAt(c+1)<<16|b.charCodeAt(c+2)<<8|b.charCodeAt(c+3),c+=4;else for(e=0;16>e;e++)d[e]=b[c]<<24|b[c+1]<<16|b[c+2]<<8|b[c+3],c+=4;for(e=16;80>e;e++){var f=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=(f<<1|f>>>31)&4294967295}b=a.f[0];c=a.f[1];var g=a.f[2],h=a.f[3],k=a.f[4];for(e=0;80>e;e++){if(40>e)if(20>e){f=h^c&(g^h);var l=1518500249}else f=c^g^h,l=1859775393;else 60>e?(f=c&g|h&(c|g),l=2400959708):
(f=c^g^h,l=3395469782);f=(b<<5|b>>>27)+f+k+l+d[e]&4294967295;k=h;h=g;g=(c<<30|c>>>2)&4294967295;c=b;b=f}a.f[0]=a.f[0]+b&4294967295;a.f[1]=a.f[1]+c&4294967295;a.f[2]=a.f[2]+g&4294967295;a.f[3]=a.f[3]+h&4294967295;a.f[4]=a.f[4]+k&4294967295}
ud.prototype.update=function(a,b){if(null!=a){void 0===b&&(b=a.length);for(var c=b-this.g,d=0,e=this.l,f=this.h;d<b;){if(0==f)for(;d<=c;)vd(this,a,d),d+=this.g;if("string"===typeof a)for(;d<b;){if(e[f]=a.charCodeAt(d),++f,++d,f==this.g){vd(this,e);f=0;break}}else for(;d<b;)if(e[f]=a[d],++f,++d,f==this.g){vd(this,e);f=0;break}}this.h=f;this.j+=b}};
ud.prototype.digest=function(){var a=[],b=8*this.j;56>this.h?this.update(this.i,56-this.h):this.update(this.i,this.g-(this.h-56));for(var c=this.g-1;56<=c;c--)this.l[c]=b&255,b/=256;vd(this,this.l);for(c=b=0;5>c;c++)for(var d=24;0<=d;d-=8)a[b]=this.f[c]>>d&255,++b;return a};function wd(a){return"string"==typeof a.className?a.className:a.getAttribute&&a.getAttribute("class")||""}
function xd(a,b){"string"==typeof a.className?a.className=b:a.setAttribute&&a.setAttribute("class",b)}
function yd(a,b){if(a.classList)var c=a.classList.contains(b);else c=a.classList?a.classList:wd(a).match(/\S+/g)||[],c=0<=Za(c,b);return c}
function zd(){var a=document.body;a.classList?a.classList.remove("inverted-hdpi"):yd(a,"inverted-hdpi")&&xd(a,$a(a.classList?a.classList:wd(a).match(/\S+/g)||[],function(b){return"inverted-hdpi"!=b}).join(" "))}
;var Ad="StopIteration"in y?y.StopIteration:{message:"StopIteration",stack:""};function Bd(){}
Bd.prototype.next=function(){throw Ad;};
Bd.prototype.I=function(){return this};
function Cd(a){if(a instanceof Bd)return a;if("function"==typeof a.I)return a.I(!1);if(La(a)){var b=0,c=new Bd;c.next=function(){for(;;){if(b>=a.length)throw Ad;if(b in a)return a[b++];b++}};
return c}throw Error("Not implemented");}
function Dd(a,b){if(La(a))try{G(a,b,void 0)}catch(c){if(c!==Ad)throw c;}else{a=Cd(a);try{for(;;)b.call(void 0,a.next(),void 0,a)}catch(c){if(c!==Ad)throw c;}}}
function Ed(a){if(La(a))return eb(a);a=Cd(a);var b=[];Dd(a,function(c){b.push(c)});
return b}
;function Fd(a,b){this.h={};this.f=[];this.J=this.g=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else if(a)if(a instanceof Fd)for(c=Gd(a),d=0;d<c.length;d++)this.set(c[d],a.get(c[d]));else for(d in a)this.set(d,a[d])}
function Gd(a){Hd(a);return a.f.concat()}
n=Fd.prototype;n.equals=function(a,b){if(this===a)return!0;if(this.g!=a.g)return!1;var c=b||Id;Hd(this);for(var d,e=0;d=this.f[e];e++)if(!c(this.get(d),a.get(d)))return!1;return!0};
function Id(a,b){return a===b}
n.isEmpty=function(){return 0==this.g};
n.clear=function(){this.h={};this.J=this.g=this.f.length=0};
n.remove=function(a){return Object.prototype.hasOwnProperty.call(this.h,a)?(delete this.h[a],this.g--,this.J++,this.f.length>2*this.g&&Hd(this),!0):!1};
function Hd(a){if(a.g!=a.f.length){for(var b=0,c=0;b<a.f.length;){var d=a.f[b];Object.prototype.hasOwnProperty.call(a.h,d)&&(a.f[c++]=d);b++}a.f.length=c}if(a.g!=a.f.length){var e={};for(c=b=0;b<a.f.length;)d=a.f[b],Object.prototype.hasOwnProperty.call(e,d)||(a.f[c++]=d,e[d]=1),b++;a.f.length=c}}
n.get=function(a,b){return Object.prototype.hasOwnProperty.call(this.h,a)?this.h[a]:b};
n.set=function(a,b){Object.prototype.hasOwnProperty.call(this.h,a)||(this.g++,this.f.push(a),this.J++);this.h[a]=b};
n.forEach=function(a,b){for(var c=Gd(this),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this)}};
n.clone=function(){return new Fd(this)};
n.I=function(a){Hd(this);var b=0,c=this.J,d=this,e=new Bd;e.next=function(){if(c!=d.J)throw Error("The map has changed since the iterator was created");if(b>=d.f.length)throw Ad;var f=d.f[b++];return a?f:d.h[f]};
return e};function Jd(a){var b=[];Kd(new Ld,a,b);return b.join("")}
function Ld(){}
function Kd(a,b,c){if(null==b)c.push("null");else{if("object"==typeof b){if(Array.isArray(b)){var d=b;b=d.length;c.push("[");for(var e="",f=0;f<b;f++)c.push(e),Kd(a,d[f],c),e=",";c.push("]");return}if(b instanceof String||b instanceof Number||b instanceof Boolean)b=b.valueOf();else{c.push("{");e="";for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(f=b[d],"function"!=typeof f&&(c.push(e),Md(d,c),c.push(":"),Kd(a,f,c),e=","));c.push("}");return}}switch(typeof b){case "string":Md(b,c);break;case "number":c.push(isFinite(b)&&
!isNaN(b)?String(b):"null");break;case "boolean":c.push(String(b));break;case "function":c.push("null");break;default:throw Error("Unknown type: "+typeof b);}}}
var Nd={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},Od=/\uffff/.test("\uffff")?/[\\"\x00-\x1f\x7f-\uffff]/g:/[\\"\x00-\x1f\x7f-\xff]/g;function Md(a,b){b.push('"',a.replace(Od,function(c){var d=Nd[c];d||(d="\\u"+(c.charCodeAt(0)|65536).toString(16).substr(1),Nd[c]=d);return d}),'"')}
;function Pd(a){if(!a)return!1;try{return!!a.$goog_Thenable}catch(b){return!1}}
;function P(a){this.f=0;this.m=void 0;this.i=this.g=this.h=null;this.j=this.l=!1;if(a!=Ia)try{var b=this;a.call(void 0,function(c){Qd(b,2,c)},function(c){Qd(b,3,c)})}catch(c){Qd(this,3,c)}}
function Rd(){this.next=this.context=this.onRejected=this.g=this.f=null;this.h=!1}
Rd.prototype.reset=function(){this.context=this.onRejected=this.g=this.f=null;this.h=!1};
var Sd=new ed(function(){return new Rd},function(a){a.reset()});
function Td(a,b,c){var d=Sd.get();d.g=a;d.onRejected=b;d.context=c;return d}
function Ud(){var a=Vd;if(a instanceof P)return a;var b=new P(Ia);Qd(b,2,a);return b}
function Wd(a){return new P(function(b,c){c(a)})}
P.prototype.then=function(a,b,c){return Xd(this,Ma(a)?a:null,Ma(b)?b:null,c)};
P.prototype.$goog_Thenable=!0;function Yd(a,b){return Xd(a,null,b,void 0)}
P.prototype.cancel=function(a){if(0==this.f){var b=new Zd(a);nd(function(){$d(this,b)},this)}};
function $d(a,b){if(0==a.f)if(a.h){var c=a.h;if(c.g){for(var d=0,e=null,f=null,g=c.g;g&&(g.h||(d++,g.f==a&&(e=g),!(e&&1<d)));g=g.next)e||(f=g);e&&(0==c.f&&1==d?$d(c,b):(f?(d=f,d.next==c.i&&(c.i=d),d.next=d.next.next):ae(c),be(c,e,3,b)))}a.h=null}else Qd(a,3,b)}
function ce(a,b){a.g||2!=a.f&&3!=a.f||de(a);a.i?a.i.next=b:a.g=b;a.i=b}
function Xd(a,b,c,d){var e=Td(null,null,null);e.f=new P(function(f,g){e.g=b?function(h){try{var k=b.call(d,h);f(k)}catch(l){g(l)}}:f;
e.onRejected=c?function(h){try{var k=c.call(d,h);void 0===k&&h instanceof Zd?g(h):f(k)}catch(l){g(l)}}:g});
e.f.h=a;ce(a,e);return e.f}
P.prototype.u=function(a){this.f=0;Qd(this,2,a)};
P.prototype.C=function(a){this.f=0;Qd(this,3,a)};
function Qd(a,b,c){if(0==a.f){a===c&&(b=3,c=new TypeError("Promise cannot resolve to itself"));a.f=1;a:{var d=c,e=a.u,f=a.C;if(d instanceof P){ce(d,Td(e||Ia,f||null,a));var g=!0}else if(Pd(d))d.then(e,f,a),g=!0;else{if(Na(d))try{var h=d.then;if(Ma(h)){ee(d,h,e,f,a);g=!0;break a}}catch(k){f.call(a,k);g=!0;break a}g=!1}}g||(a.m=c,a.f=b,a.h=null,de(a),3!=b||c instanceof Zd||fe(a,c))}}
function ee(a,b,c,d,e){function f(k){h||(h=!0,d.call(e,k))}
function g(k){h||(h=!0,c.call(e,k))}
var h=!1;try{b.call(a,g,f)}catch(k){f(k)}}
function de(a){a.l||(a.l=!0,nd(a.B,a))}
function ae(a){var b=null;a.g&&(b=a.g,a.g=b.next,b.next=null);a.g||(a.i=null);return b}
P.prototype.B=function(){for(var a;a=ae(this);)be(this,a,this.f,this.m);this.l=!1};
function be(a,b,c,d){if(3==c&&b.onRejected&&!b.h)for(;a&&a.j;a=a.h)a.j=!1;if(b.f)b.f.h=null,ge(b,c,d);else try{b.h?b.g.call(b.context):ge(b,c,d)}catch(e){he.call(null,e)}gd(Sd,b)}
function ge(a,b,c){2==b?a.g.call(a.context,c):a.onRejected&&a.onRejected.call(a.context,c)}
function fe(a,b){a.j=!0;nd(function(){a.j&&he.call(null,b)})}
var he=hd;function Zd(a){F.call(this,a)}
E(Zd,F);Zd.prototype.name="cancel";function Q(a){M.call(this);this.l=1;this.i=[];this.j=0;this.f=[];this.h={};this.m=!!a}
E(Q,M);n=Q.prototype;n.subscribe=function(a,b,c){var d=this.h[a];d||(d=this.h[a]=[]);var e=this.l;this.f[e]=a;this.f[e+1]=b;this.f[e+2]=c;this.l=e+3;d.push(e);return e};
function ie(a,b,c,d){if(b=a.h[b]){var e=a.f;(b=cb(b,function(f){return e[f+1]==c&&e[f+2]==d}))&&a.P(b)}}
n.P=function(a){var b=this.f[a];if(b){var c=this.h[b];0!=this.j?(this.i.push(a),this.f[a+1]=Ia):(c&&db(c,a),delete this.f[a],delete this.f[a+1],delete this.f[a+2])}return!!b};
n.O=function(a,b){var c=this.h[a];if(c){for(var d=Array(arguments.length-1),e=1,f=arguments.length;e<f;e++)d[e-1]=arguments[e];if(this.m)for(e=0;e<c.length;e++){var g=c[e];je(this.f[g+1],this.f[g+2],d)}else{this.j++;try{for(e=0,f=c.length;e<f;e++)g=c[e],this.f[g+1].apply(this.f[g+2],d)}finally{if(this.j--,0<this.i.length&&0==this.j)for(;c=this.i.pop();)this.P(c)}}return 0!=e}return!1};
function je(a,b,c){nd(function(){a.apply(b,c)})}
n.clear=function(a){if(a){var b=this.h[a];b&&(G(b,this.P,this),delete this.h[a])}else this.f.length=0,this.h={}};
n.o=function(){Q.N.o.call(this);this.clear();this.i.length=0};function ke(a){this.f=a}
ke.prototype.set=function(a,b){void 0===b?this.f.remove(a):this.f.set(a,Jd(b))};
ke.prototype.get=function(a){try{var b=this.f.get(a)}catch(c){return}if(null!==b)try{return JSON.parse(b)}catch(c){throw"Storage: Invalid value was encountered";}};
ke.prototype.remove=function(a){this.f.remove(a)};function le(a){this.f=a}
E(le,ke);function me(a){this.data=a}
function ne(a){return void 0===a||a instanceof me?a:new me(a)}
le.prototype.set=function(a,b){le.N.set.call(this,a,ne(b))};
le.prototype.g=function(a){a=le.N.get.call(this,a);if(void 0===a||a instanceof Object)return a;throw"Storage: Invalid value was encountered";};
le.prototype.get=function(a){if(a=this.g(a)){if(a=a.data,void 0===a)throw"Storage: Invalid value was encountered";}else a=void 0;return a};function oe(a){this.f=a}
E(oe,le);oe.prototype.set=function(a,b,c){if(b=ne(b)){if(c){if(c<C()){oe.prototype.remove.call(this,a);return}b.expiration=c}b.creation=C()}oe.N.set.call(this,a,b)};
oe.prototype.g=function(a){var b=oe.N.g.call(this,a);if(b){var c=b.creation,d=b.expiration;if(d&&d<C()||c&&c>C())oe.prototype.remove.call(this,a);else return b}};function pe(){}
;function qe(){}
E(qe,pe);qe.prototype.clear=function(){var a=Ed(this.I(!0)),b=this;G(a,function(c){b.remove(c)})};function re(a){this.f=a}
E(re,qe);n=re.prototype;n.isAvailable=function(){if(!this.f)return!1;try{return this.f.setItem("__sak","1"),this.f.removeItem("__sak"),!0}catch(a){return!1}};
n.set=function(a,b){try{this.f.setItem(a,b)}catch(c){if(0==this.f.length)throw"Storage mechanism: Storage disabled";throw"Storage mechanism: Quota exceeded";}};
n.get=function(a){a=this.f.getItem(a);if("string"!==typeof a&&null!==a)throw"Storage mechanism: Invalid value was encountered";return a};
n.remove=function(a){this.f.removeItem(a)};
n.I=function(a){var b=0,c=this.f,d=new Bd;d.next=function(){if(b>=c.length)throw Ad;var e=c.key(b++);if(a)return e;e=c.getItem(e);if("string"!==typeof e)throw"Storage mechanism: Invalid value was encountered";return e};
return d};
n.clear=function(){this.f.clear()};
n.key=function(a){return this.f.key(a)};function se(){var a=null;try{a=window.localStorage||null}catch(b){}this.f=a}
E(se,re);function te(a,b){this.g=a;this.f=null;if(ic&&!(9<=Number(uc))){ue||(ue=new Fd);this.f=ue.get(a);this.f||(b?this.f=document.getElementById(b):(this.f=document.createElement("userdata"),this.f.addBehavior("#default#userData"),document.body.appendChild(this.f)),ue.set(a,this.f));try{this.f.load(this.g)}catch(c){this.f=null}}}
E(te,qe);var ve={".":".2E","!":".21","~":".7E","*":".2A","'":".27","(":".28",")":".29","%":"."},ue=null;function we(a){return"_"+encodeURIComponent(a).replace(/[.!~*'()%]/g,function(b){return ve[b]})}
n=te.prototype;n.isAvailable=function(){return!!this.f};
n.set=function(a,b){this.f.setAttribute(we(a),b);xe(this)};
n.get=function(a){a=this.f.getAttribute(we(a));if("string"!==typeof a&&null!==a)throw"Storage mechanism: Invalid value was encountered";return a};
n.remove=function(a){this.f.removeAttribute(we(a));xe(this)};
n.I=function(a){var b=0,c=this.f.XMLDocument.documentElement.attributes,d=new Bd;d.next=function(){if(b>=c.length)throw Ad;var e=c[b++];if(a)return decodeURIComponent(e.nodeName.replace(/\./g,"%")).substr(1);e=e.nodeValue;if("string"!==typeof e)throw"Storage mechanism: Invalid value was encountered";return e};
return d};
n.clear=function(){for(var a=this.f.XMLDocument.documentElement,b=a.attributes.length;0<b;b--)a.removeAttribute(a.attributes[b-1].nodeName);xe(this)};
function xe(a){try{a.f.save(a.g)}catch(b){throw"Storage mechanism: Quota exceeded";}}
;function ye(a,b){this.g=a;this.f=b+"::"}
E(ye,qe);ye.prototype.set=function(a,b){this.g.set(this.f+a,b)};
ye.prototype.get=function(a){return this.g.get(this.f+a)};
ye.prototype.remove=function(a){this.g.remove(this.f+a)};
ye.prototype.I=function(a){var b=this.g.I(!0),c=this,d=new Bd;d.next=function(){for(var e=b.next();e.substr(0,c.f.length)!=c.f;)e=b.next();return a?e.substr(c.f.length):c.g.get(e)};
return d};function ze(a,b){1<b.length?a[b[0]]=b[1]:1===b.length&&Object.assign(a,b[0])}
;var Ae=window.yt&&window.yt.config_||window.ytcfg&&window.ytcfg.data_||{};z("yt.config_",Ae,void 0);function R(a){ze(Ae,arguments)}
function S(a,b){return a in Ae?Ae[a]:b}
function Be(){return S("PLAYER_CONFIG",{})}
function Ce(a){var b=Ae.EXPERIMENT_FLAGS;return b?b[a]:void 0}
;function De(){var a=Ee;A("yt.ads.biscotti.getId_")||z("yt.ads.biscotti.getId_",a,void 0)}
function Fe(a){z("yt.ads.biscotti.lastId_",a,void 0)}
;var Ge=[];function He(a){Ge.forEach(function(b){return b(a)})}
function Ie(a){return a&&window.yterr?function(){try{return a.apply(this,arguments)}catch(b){T(b),He(b)}}:a}
function T(a){var b=A("yt.logging.errors.log");b?b(a,"ERROR",void 0,void 0,void 0):(b=S("ERRORS",[]),b.push([a,"ERROR",void 0,void 0,void 0]),R("ERRORS",b))}
function Je(a){var b=A("yt.logging.errors.log");b?b(a,"WARNING",void 0,void 0,void 0):(b=S("ERRORS",[]),b.push([a,"WARNING",void 0,void 0,void 0]),R("ERRORS",b))}
;function Ke(a){a=a.split("&");for(var b={},c=0,d=a.length;c<d;c++){var e=a[c].split("=");if(1==e.length&&e[0]||2==e.length)try{var f=decodeURIComponent((e[0]||"").replace(/\+/g," ")),g=decodeURIComponent((e[1]||"").replace(/\+/g," "));f in b?Array.isArray(b[f])?fb(b[f],g):b[f]=[b[f],g]:b[f]=g}catch(k){if("q"!=e[0]){var h=Error("Error decoding URL component");h.params={key:e[0],value:e[1]};T(h)}}}return b}
function Le(a){var b=[];gb(a,function(c,d){var e=encodeURIComponent(String(d)),f;Array.isArray(c)?f=c:f=[c];G(f,function(g){""==g?b.push(e):b.push(e+"="+encodeURIComponent(String(g)))})});
return b.join("&")}
function Me(a){"?"==a.charAt(0)&&(a=a.substr(1));return Ke(a)}
function Ne(a,b){return Oe(a,b||{},!0)}
function Oe(a,b,c){var d=a.split("#",2);a=d[0];d=1<d.length?"#"+d[1]:"";var e=a.split("?",2);a=e[0];e=Me(e[1]||"");for(var f in b)!c&&null!==e&&f in e||(e[f]=b[f]);return ec(a,e)+d}
;function Pe(a){var b=Qe;a=void 0===a?A("yt.ads.biscotti.lastId_")||"":a;b=Object.assign(Re(b),Se(b));b.ca_type="image";a&&(b.bid=a);return b}
function Re(a){var b={};b.dt=Xc;b.flash="0";a:{try{var c=a.f.top.location.href}catch(f){a=2;break a}a=c?c===a.g.location.href?0:1:2}b=(b.frm=a,b);b.u_tz=-(new Date).getTimezoneOffset();var d=void 0===d?L:d;try{var e=d.history.length}catch(f){e=0}b.u_his=e;b.u_java=!!L.navigator&&"unknown"!==typeof L.navigator.javaEnabled&&!!L.navigator.javaEnabled&&L.navigator.javaEnabled();L.screen&&(b.u_h=L.screen.height,b.u_w=L.screen.width,b.u_ah=L.screen.availHeight,b.u_aw=L.screen.availWidth,b.u_cd=L.screen.colorDepth);
L.navigator&&L.navigator.plugins&&(b.u_nplug=L.navigator.plugins.length);L.navigator&&L.navigator.mimeTypes&&(b.u_nmime=L.navigator.mimeTypes.length);return b}
function Se(a){var b=a.f;try{var c=b.screenX;var d=b.screenY}catch(q){}try{var e=b.outerWidth;var f=b.outerHeight}catch(q){}try{var g=b.innerWidth;var h=b.innerHeight}catch(q){}b=[b.screenLeft,b.screenTop,c,d,b.screen?b.screen.availWidth:void 0,b.screen?b.screen.availTop:void 0,e,f,g,h];c=a.f.top;try{var k=(c||window).document,l="CSS1Compat"==k.compatMode?k.documentElement:k.body;var m=(new Dc(l.clientWidth,l.clientHeight)).round()}catch(q){m=new Dc(-12245933,-12245933)}k=m;m={};l=new cd;y.SVGElement&&
y.document.createElementNS&&l.set(0);c=Sc();c["allow-top-navigation-by-user-activation"]&&l.set(1);c["allow-popups-to-escape-sandbox"]&&l.set(2);y.crypto&&y.crypto.subtle&&l.set(3);y.TextDecoder&&y.TextEncoder&&l.set(4);l=dd(l);m.bc=l;m.bih=k.height;m.biw=k.width;m.brdim=b.join();a=a.g;return m.vis={visible:1,hidden:2,prerender:3,preview:4,unloaded:5}[a.visibilityState||a.webkitVisibilityState||a.mozVisibilityState||""]||0,m.wgl=!!L.WebGLRenderingContext,m}
var Qe=new function(){var a=window.document;this.f=window;this.g=a};
z("yt.ads_.signals_.getAdSignalsString",function(a){return Le(Pe(a))},void 0);C();function U(a){a=Te(a);return"string"===typeof a&&"false"===a?!1:!!a}
function Ue(a,b){var c=Te(a);return void 0===c&&void 0!==b?b:Number(c||0)}
function Te(a){var b=S("EXPERIMENTS_FORCED_FLAGS",{});return void 0!==b[a]?b[a]:S("EXPERIMENT_FLAGS",{})[a]}
;var Ve="XMLHttpRequest"in y?function(){return new XMLHttpRequest}:"ActiveXObject"in y?function(){return new ActiveXObject("Microsoft.XMLHTTP")}:null;
function We(){if(!Ve)return null;var a=Ve();return"open"in a?a:null}
function Xe(a){switch(a&&"status"in a?a.status:-1){case 200:case 201:case 202:case 203:case 204:case 205:case 206:case 304:return!0;default:return!1}}
;function V(a,b){Ma(a)&&(a=Ie(a));return window.setTimeout(a,b)}
function Ye(a){window.clearTimeout(a)}
;var Ze={Authorization:"AUTHORIZATION","X-Goog-Visitor-Id":"SANDBOXED_VISITOR_ID","X-YouTube-Client-Name":"INNERTUBE_CONTEXT_CLIENT_NAME","X-YouTube-Client-Version":"INNERTUBE_CONTEXT_CLIENT_VERSION","X-YouTube-Device":"DEVICE","X-Youtube-Identity-Token":"ID_TOKEN","X-YouTube-Page-CL":"PAGE_CL","X-YouTube-Page-Label":"PAGE_BUILD_LABEL","X-YouTube-Variants-Checksum":"VARIANTS_CHECKSUM"},$e="app debugcss debugjs expflag force_ad_params force_viral_ad_response_params forced_experiments innertube_snapshots innertube_goldens internalcountrycode internalipoverride absolute_experiments conditional_experiments sbb sr_bns_address".split(" "),
af=!1;
function bf(a,b){b=void 0===b?{}:b;if(!c)var c=window.location.href;var d=K(1,a),e=J(K(3,a));d&&e?(d=c,c=a.match(bc),d=d.match(bc),c=c[3]==d[3]&&c[1]==d[1]&&c[4]==d[4]):c=e?J(K(3,c))==e&&(Number(K(4,c))||null)==(Number(K(4,a))||null):!0;d=U("web_ajax_ignore_global_headers_if_set");for(var f in Ze)e=S(Ze[f]),!e||!c&&!cf(a,f)||d&&void 0!==b[f]||(b[f]=e);if(c||cf(a,"X-YouTube-Utc-Offset"))b["X-YouTube-Utc-Offset"]=String(-(new Date).getTimezoneOffset());(c||cf(a,"X-YouTube-Time-Zone"))&&(f="undefined"!=typeof Intl?
(new Intl.DateTimeFormat).resolvedOptions().timeZone:null)&&(b["X-YouTube-Time-Zone"]=f);if(c||cf(a,"X-YouTube-Ad-Signals"))b["X-YouTube-Ad-Signals"]=Le(Pe(void 0));return b}
function df(a){var b=window.location.search,c=J(K(3,a)),d=J(K(5,a));d=(c=c&&(c.endsWith("youtube.com")||c.endsWith("youtube-nocookie.com")))&&d&&d.startsWith("/api/");if(!c||d)return a;var e=Me(b),f={};G($e,function(g){e[g]&&(f[g]=e[g])});
return Oe(a,f||{},!1)}
function cf(a,b){var c=S("CORS_HEADER_WHITELIST")||{},d=J(K(3,a));return d?(c=c[d])?0<=Za(c,b):!1:!0}
function ef(a,b){if(window.fetch&&"XML"!=b.format){var c={method:b.method||"GET",credentials:"same-origin"};b.headers&&(c.headers=b.headers);a=ff(a,b);var d=gf(a,b);d&&(c.body=d);b.withCredentials&&(c.credentials="include");var e=!1,f;fetch(a,c).then(function(g){if(!e){e=!0;f&&Ye(f);var h=g.ok,k=function(l){l=l||{};var m=b.context||y;h?b.onSuccess&&b.onSuccess.call(m,l,g):b.onError&&b.onError.call(m,l,g);b.la&&b.la.call(m,l,g)};
"JSON"==(b.format||"JSON")&&(h||400<=g.status&&500>g.status)?g.json().then(k,function(){k(null)}):k(null)}});
b.wa&&0<b.timeout&&(f=V(function(){e||(e=!0,Ye(f),b.wa.call(b.context||y))},b.timeout))}else hf(a,b)}
function hf(a,b){var c=b.format||"JSON";a=ff(a,b);var d=gf(a,b),e=!1,f=jf(a,function(k){if(!e){e=!0;h&&Ye(h);var l=Xe(k),m=null,q=400<=k.status&&500>k.status,t=500<=k.status&&600>k.status;if(l||q||t)m=kf(a,c,k,b.wb);if(l)a:if(k&&204==k.status)l=!0;else{switch(c){case "XML":l=0==parseInt(m&&m.return_code,10);break a;case "RAW":l=!0;break a}l=!!m}m=m||{};q=b.context||y;l?b.onSuccess&&b.onSuccess.call(q,k,m):b.onError&&b.onError.call(q,k,m);b.la&&b.la.call(q,k,m)}},b.method,d,b.headers,b.responseType,
b.withCredentials);
if(b.R&&0<b.timeout){var g=b.R;var h=V(function(){e||(e=!0,f.abort(),Ye(h),g.call(b.context||y,f))},b.timeout)}return f}
function ff(a,b){b.zb&&(a=document.location.protocol+"//"+document.location.hostname+(document.location.port?":"+document.location.port:"")+a);var c=S("XSRF_FIELD_NAME",void 0),d=b.gb;d&&(d[c]&&delete d[c],a=Ne(a,d));return a}
function gf(a,b){var c=S("XSRF_FIELD_NAME",void 0),d=S("XSRF_TOKEN",void 0),e=b.postBody||"",f=b.D,g=S("XSRF_FIELD_NAME",void 0),h;b.headers&&(h=b.headers["Content-Type"]);b.yb||J(K(3,a))&&!b.withCredentials&&J(K(3,a))!=document.location.hostname||"POST"!=b.method||h&&"application/x-www-form-urlencoded"!=h||b.D&&b.D[g]||(f||(f={}),f[c]=d);f&&"string"===typeof e&&(e=Me(e),qb(e,f),e=b.xa&&"JSON"==b.xa?JSON.stringify(e):dc(e));f=e||f&&!kb(f);!af&&f&&"POST"!=b.method&&(af=!0,T(Error("AJAX request with postData should use POST")));
return e}
function kf(a,b,c,d){var e=null;switch(b){case "JSON":try{var f=c.responseText}catch(g){throw d=Error("Error reading responseText"),d.params=a,Je(d),g;}a=c.getResponseHeader("Content-Type")||"";f&&0<=a.indexOf("json")&&(e=JSON.parse(f));break;case "XML":if(a=(a=c.responseXML)?lf(a):null)e={},G(a.getElementsByTagName("*"),function(g){e[g.tagName]=mf(g)})}d&&nf(e);
return e}
function nf(a){if(Na(a))for(var b in a){var c;(c="html_content"==b)||(c=b.length-5,c=0<=c&&b.indexOf("_html",c)==c);if(c){c=b;var d=a[b];var e=new tb(ub,"HTML that is escaped and sanitized server-side and passed through yt.net.ajax");wb(e);wb(e);d=Xb(d,null);a[c]=d}else nf(a[b])}}
function lf(a){return a?(a=("responseXML"in a?a.responseXML:a).getElementsByTagName("root"))&&0<a.length?a[0]:null:null}
function mf(a){var b="";G(a.childNodes,function(c){b+=c.nodeValue});
return b}
function jf(a,b,c,d,e,f,g){function h(){4==(k&&"readyState"in k?k.readyState:0)&&b&&Ie(b)(k)}
c=void 0===c?"GET":c;d=void 0===d?"":d;var k=We();if(!k)return null;"onloadend"in k?k.addEventListener("loadend",h,!1):k.onreadystatechange=h;U("debug_forward_web_query_parameters")&&(a=df(a));k.open(c,a,!0);f&&(k.responseType=f);g&&(k.withCredentials=!0);c="POST"==c&&(void 0===window.FormData||!(d instanceof FormData));if(e=bf(a,e))for(var l in e)k.setRequestHeader(l,e[l]),"content-type"==l.toLowerCase()&&(c=!1);c&&k.setRequestHeader("Content-Type","application/x-www-form-urlencoded");k.send(d);
return k}
;var of={},pf=0;
function qf(a,b,c,d,e){e=void 0===e?"":e;a&&(c&&(c=Rb,c=!(c&&0<=c.toLowerCase().indexOf("cobalt"))),c?a&&(a instanceof H||(a="object"==typeof a&&a.L?a.K():String(a),a=Ob.test(a)?new H(Lb,a):null),b=Nb(a||Qb),"about:invalid#zClosurez"===b?a="":(b instanceof Vb?a=b:(d="object"==typeof b,a=null,d&&b.ja&&(a=b.ga()),b=Db(d&&b.L?b.K():String(b)),a=Xb(b,a)),a instanceof Vb&&a.constructor===Vb&&a.h===Wb?a=a.f:(Ka(a),a="type_error:SafeHtml"),a=encodeURIComponent(String(Jd(a.toString())))),/^[\s\xa0]*$/.test(a)||(a=
Hc("IFRAME",{src:'javascript:"<body><img src=\\""+'+a+'+"\\"></body>"',style:"display:none"}),(9==a.nodeType?a:a.ownerDocument||a.document).body.appendChild(a))):e?jf(a,b,"POST",e,d):S("USE_NET_AJAX_FOR_PING_TRANSPORT",!1)||d?jf(a,b,"GET","",d):rf(a,b)||sf(a,b))}
function rf(a,b){if(!Ce("web_use_beacon_api_for_ad_click_server_pings"))return!1;if(Ce("use_sonic_js_library_for_v4_support")){a:{try{var c=new Xa({url:a});if(c.h&&c.g||c.i){var d=J(K(5,a));var e=!(!d||!d.endsWith("/aclk")||"1"!==gc(a,"ri"));break a}}catch(f){}e=!1}if(!e)return!1}else if(e=J(K(5,a)),!e||-1==e.indexOf("/aclk")||"1"!==gc(a,"ae")||"1"!==gc(a,"act"))return!1;return tf(a)?(b&&b(),!0):!1}
function tf(a,b){try{if(window.navigator&&window.navigator.sendBeacon&&window.navigator.sendBeacon(a,void 0===b?"":b))return!0}catch(c){}return!1}
function sf(a,b){var c=new Image,d=""+pf++;of[d]=c;c.onload=c.onerror=function(){b&&of[d]&&b();delete of[d]};
c.src=a}
;var uf=0;z("ytDomDomGetNextId",A("ytDomDomGetNextId")||function(){return++uf},void 0);var vf={stopImmediatePropagation:1,stopPropagation:1,preventMouseEvent:1,preventManipulation:1,preventDefault:1,layerX:1,layerY:1,screenX:1,screenY:1,scale:1,rotation:1,webkitMovementX:1,webkitMovementY:1};
function wf(a){this.type="";this.state=this.source=this.data=this.currentTarget=this.relatedTarget=this.target=null;this.charCode=this.keyCode=0;this.metaKey=this.shiftKey=this.ctrlKey=this.altKey=!1;this.clientY=this.clientX=0;this.changedTouches=this.touches=null;try{if(a=a||window.event){this.event=a;for(var b in a)b in vf||(this[b]=a[b]);var c=a.target||a.srcElement;c&&3==c.nodeType&&(c=c.parentNode);this.target=c;var d=a.relatedTarget;if(d)try{d=d.nodeName?d:null}catch(e){d=null}else"mouseover"==
this.type?d=a.fromElement:"mouseout"==this.type&&(d=a.toElement);this.relatedTarget=d;this.clientX=void 0!=a.clientX?a.clientX:a.pageX;this.clientY=void 0!=a.clientY?a.clientY:a.pageY;this.keyCode=a.keyCode?a.keyCode:a.which;this.charCode=a.charCode||("keypress"==this.type?this.keyCode:0);this.altKey=a.altKey;this.ctrlKey=a.ctrlKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.f=a.pageX;this.g=a.pageY}}catch(e){}}
function xf(a){if(document.body&&document.documentElement){var b=document.body.scrollTop+document.documentElement.scrollTop;a.f=a.clientX+(document.body.scrollLeft+document.documentElement.scrollLeft);a.g=a.clientY+b}}
wf.prototype.preventDefault=function(){this.event&&(this.event.returnValue=!1,this.event.preventDefault&&this.event.preventDefault())};
wf.prototype.stopPropagation=function(){this.event&&(this.event.cancelBubble=!0,this.event.stopPropagation&&this.event.stopPropagation())};
wf.prototype.stopImmediatePropagation=function(){this.event&&(this.event.cancelBubble=!0,this.event.stopImmediatePropagation&&this.event.stopImmediatePropagation())};var jb=y.ytEventsEventsListeners||{};z("ytEventsEventsListeners",jb,void 0);var yf=y.ytEventsEventsCounter||{count:0};z("ytEventsEventsCounter",yf,void 0);
function zf(a,b,c,d){d=void 0===d?{}:d;a.addEventListener&&("mouseenter"!=b||"onmouseenter"in document?"mouseleave"!=b||"onmouseenter"in document?"mousewheel"==b&&"MozBoxSizing"in document.documentElement.style&&(b="MozMousePixelScroll"):b="mouseout":b="mouseover");return ib(function(e){var f="boolean"===typeof e[4]&&e[4]==!!d,g=Na(e[4])&&Na(d)&&mb(e[4],d);return!!e.length&&e[0]==a&&e[1]==b&&e[2]==c&&(f||g)})}
var Af=Ya(function(){var a=!1;try{var b=Object.defineProperty({},"capture",{get:function(){a=!0}});
window.addEventListener("test",null,b)}catch(c){}return a});
function Bf(a,b,c,d){d=void 0===d?{}:d;if(!a||!a.addEventListener&&!a.attachEvent)return"";var e=zf(a,b,c,d);if(e)return e;e=++yf.count+"";var f=!("mouseenter"!=b&&"mouseleave"!=b||!a.addEventListener||"onmouseenter"in document);var g=f?function(h){h=new wf(h);if(!Lc(h.relatedTarget,function(k){return k==a}))return h.currentTarget=a,h.type=b,c.call(a,h)}:function(h){h=new wf(h);
h.currentTarget=a;return c.call(a,h)};
g=Ie(g);a.addEventListener?("mouseenter"==b&&f?b="mouseover":"mouseleave"==b&&f?b="mouseout":"mousewheel"==b&&"MozBoxSizing"in document.documentElement.style&&(b="MozMousePixelScroll"),Af()||"boolean"===typeof d?a.addEventListener(b,g,d):a.addEventListener(b,g,!!d.capture)):a.attachEvent("on"+b,g);jb[e]=[a,b,c,g,d];return e}
function Cf(a){a&&("string"==typeof a&&(a=[a]),G(a,function(b){if(b in jb){var c=jb[b],d=c[0],e=c[1],f=c[3];c=c[4];d.removeEventListener?Af()||"boolean"===typeof c?d.removeEventListener(e,f,c):d.removeEventListener(e,f,!!c.capture):d.detachEvent&&d.detachEvent("on"+e,f);delete jb[b]}}))}
;var Df=window.ytcsi&&window.ytcsi.now?window.ytcsi.now:window.performance&&window.performance.timing&&window.performance.now&&window.performance.timing.navigationStart?function(){return window.performance.timing.navigationStart+window.performance.now()}:function(){return(new Date).getTime()};function Ef(a){this.u=a;this.f=null;this.j=0;this.m=null;this.l=0;this.h=[];for(a=0;4>a;a++)this.h.push(0);this.i=0;this.G=Bf(window,"mousemove",B(this.H,this));a=B(this.C,this);Ma(a)&&(a=Ie(a));this.M=window.setInterval(a,25)}
E(Ef,M);Ef.prototype.H=function(a){void 0===a.f&&xf(a);var b=a.f;void 0===a.g&&xf(a);this.f=new Cc(b,a.g)};
Ef.prototype.C=function(){if(this.f){var a=Df();if(0!=this.j){var b=this.m,c=this.f,d=b.x-c.x;b=b.y-c.y;d=Math.sqrt(d*d+b*b)/(a-this.j);this.h[this.i]=.5<Math.abs((d-this.l)/this.l)?1:0;for(c=b=0;4>c;c++)b+=this.h[c]||0;3<=b&&this.u();this.l=d}this.j=a;this.m=this.f;this.i=(this.i+1)%4}};
Ef.prototype.o=function(){window.clearInterval(this.M);Cf(this.G)};function Ff(){}
function Gf(a,b){return Hf(a,0,b)}
function If(a,b){return Hf(a,1,b)}
;function Jf(){}
v(Jf,Ff);function Hf(a,b,c){isNaN(c)&&(c=void 0);var d=A("yt.scheduler.instance.addJob");return d?d(a,b,c):void 0===c?(a(),NaN):V(a,c||0)}
function Kf(a){if(!isNaN(a)){var b=A("yt.scheduler.instance.cancelJob");b?b(a):Ye(a)}}
Jf.prototype.start=function(){var a=A("yt.scheduler.instance.start");a&&a()};
Jf.prototype.pause=function(){var a=A("yt.scheduler.instance.pause");a&&a()};
Ja(Jf);Jf.getInstance();var Lf={};
function Mf(a){var b=void 0===a?{}:a;a=void 0===b.Ja?!0:b.Ja;b=void 0===b.Ua?!1:b.Ua;if(null==A("_lact",window)){var c=parseInt(S("LACT"),10);c=isFinite(c)?C()-Math.max(c,0):-1;z("_lact",c,window);z("_fact",c,window);-1==c&&Nf();Bf(document,"keydown",Nf);Bf(document,"keyup",Nf);Bf(document,"mousedown",Nf);Bf(document,"mouseup",Nf);a&&(b?Bf(window,"touchmove",function(){Of("touchmove",200)},{passive:!0}):(Bf(window,"resize",function(){Of("resize",200)}),Bf(window,"scroll",function(){Of("scroll",200)})));
new Ef(function(){Of("mouse",100)});
Bf(document,"touchstart",Nf,{passive:!0});Bf(document,"touchend",Nf,{passive:!0})}}
function Of(a,b){Lf[a]||(Lf[a]=!0,If(function(){Nf();Lf[a]=!1},b))}
function Nf(){null==A("_lact",window)&&Mf();var a=C();z("_lact",a,window);-1==A("_fact",window)&&z("_fact",a,window);(a=A("ytglobal.ytUtilActivityCallback_"))&&a()}
function Pf(){var a=A("_lact",window),b;null==a?b=-1:b=Math.max(C()-a,0);return b}
;var Qf=y.ytPubsubPubsubInstance||new Q;Q.prototype.subscribe=Q.prototype.subscribe;Q.prototype.unsubscribeByKey=Q.prototype.P;Q.prototype.publish=Q.prototype.O;Q.prototype.clear=Q.prototype.clear;z("ytPubsubPubsubInstance",Qf,void 0);var Rf=y.ytPubsubPubsubSubscribedKeys||{};z("ytPubsubPubsubSubscribedKeys",Rf,void 0);var Sf=y.ytPubsubPubsubTopicToKeys||{};z("ytPubsubPubsubTopicToKeys",Sf,void 0);var Tf=y.ytPubsubPubsubIsSynchronous||{};z("ytPubsubPubsubIsSynchronous",Tf,void 0);
function Uf(a,b){var c=Vf();if(c){var d=c.subscribe(a,function(){var e=arguments;var f=function(){Rf[d]&&b.apply&&"function"==typeof b.apply&&b.apply(window,e)};
try{Tf[a]?f():V(f,0)}catch(g){T(g)}},void 0);
Rf[d]=!0;Sf[a]||(Sf[a]=[]);Sf[a].push(d);return d}return 0}
function Wf(a){var b=Vf();b&&("number"===typeof a?a=[a]:"string"===typeof a&&(a=[parseInt(a,10)]),G(a,function(c){b.unsubscribeByKey(c);delete Rf[c]}))}
function Xf(a,b){var c=Vf();c&&c.publish.apply(c,arguments)}
function Yf(a){var b=Vf();if(b)if(b.clear(a),a)Zf(a);else for(var c in Sf)Zf(c)}
function Vf(){return y.ytPubsubPubsubInstance}
function Zf(a){Sf[a]&&(a=Sf[a],G(a,function(b){Rf[b]&&delete Rf[b]}),a.length=0)}
;var $f=window,W=$f.ytcsi&&$f.ytcsi.now?$f.ytcsi.now:$f.performance&&$f.performance.timing&&$f.performance.now&&$f.performance.timing.navigationStart?function(){return $f.performance.timing.navigationStart+$f.performance.now()}:function(){return(new Date).getTime()};var ag=Ue("initial_gel_batch_timeout",1E3),bg=Math.pow(2,16)-1,cg=null,dg=0,eg=void 0,fg=0,gg=0,hg=0,ig=!0,jg=y.ytLoggingTransportLogPayloadsQueue_||{};z("ytLoggingTransportLogPayloadsQueue_",jg,void 0);var kg=y.ytLoggingTransportGELQueue_||new Map;z("ytLoggingTransportGELQueue_",kg,void 0);var lg=y.ytLoggingTransportTokensToCttTargetIds_||{};z("ytLoggingTransportTokensToCttTargetIds_",lg,void 0);
function mg(){Ye(fg);Ye(gg);gg=0;eg&&eg.isReady()?(ng(kg),"log_event"in jg&&ng(Object.entries(jg.log_event)),kg.clear(),delete jg.log_event):og()}
function og(){U("web_gel_timeout_cap")&&!gg&&(gg=V(mg,6E4));Ye(fg);var a=S("LOGGING_BATCH_TIMEOUT",Ue("web_gel_debounce_ms",1E4));U("shorten_initial_gel_batch_timeout")&&ig&&(a=ag);fg=V(mg,a)}
function ng(a){var b=eg,c=Math.round(W());a=u(a);for(var d=a.next();!d.done;d=a.next()){var e=u(d.value);d=e.next().value;var f=e.next().value;e=ob({context:pg(b.f||qg())});e.events=f;(f=lg[d])&&rg(e,d,f);delete lg[d];sg(e,c);tg(b,"log_event",e,{retry:!0,onSuccess:function(){dg=Math.round(W()-c)}});
ig=!1}}
function sg(a,b){a.requestTimeMs=String(b);U("unsplit_gel_payloads_in_logs")&&(a.unsplitGelPayloadsInLogs=!0);var c=S("EVENT_ID",void 0);if(c){var d=S("BATCH_CLIENT_COUNTER",void 0)||0;!d&&U("web_client_counter_random_seed")&&(d=Math.floor(Math.random()*bg/2));d++;d>bg&&(d=1);R("BATCH_CLIENT_COUNTER",d);c={serializedEventId:c,clientCounter:String(d)};a.serializedClientEventId=c;cg&&dg&&U("log_gel_rtt_web")&&(a.previousBatchInfo={serializedClientEventId:cg,roundtripMs:String(dg)});cg=c;dg=0}}
function rg(a,b,c){if(c.videoId)var d="VIDEO";else if(c.playlistId)d="PLAYLIST";else return;a.credentialTransferTokenTargetId=c;a.context=a.context||{};a.context.user=a.context.user||{};a.context.user.credentialTransferTokens=[{token:b,scope:d}]}
;var ug=y.ytLoggingGelSequenceIdObj_||{};z("ytLoggingGelSequenceIdObj_",ug,void 0);
function vg(a,b,c,d){d=void 0===d?{}:d;var e={};e.eventTimeMs=Math.round(d.timestamp||W());e[a]=b;e.context={lastActivityMs:String(d.timestamp?-1:Pf())};U("log_sequence_info_on_gel_web")&&d.S&&(a=e.context,b=d.S,ug[b]=b in ug?ug[b]+1:0,a.sequence={index:ug[b],groupKey:b},d.xb&&delete ug[d.S]);d=d.fa;a="";d&&(a={},d.videoId?a.videoId=d.videoId:d.playlistId&&(a.playlistId=d.playlistId),lg[d.token]=a,a=d.token);d=kg.get(a)||[];kg.set(a,d);d.push(e);c&&(eg=new c);c=Ue("web_logging_max_batch")||100;e=
W();d.length>=c?mg():10<=e-hg&&(og(),hg=e)}
;function wg(){for(var a={},b=u(Object.entries(Me(S("DEVICE","")))),c=b.next();!c.done;c=b.next()){var d=u(c.value);c=d.next().value;d=d.next().value;"cbrand"===c?a.deviceMake=d:"cmodel"===c?a.deviceModel=d:"cbr"===c?a.browserName=d:"cbrver"===c?a.browserVersion=d:"cos"===c?a.osName=d:"cosver"===c?a.osVersion=d:"cplatform"===c&&(a.platform=d)}return a}
;function xg(){return"INNERTUBE_API_KEY"in Ae&&"INNERTUBE_API_VERSION"in Ae}
function qg(){return{innertubeApiKey:S("INNERTUBE_API_KEY",void 0),innertubeApiVersion:S("INNERTUBE_API_VERSION",void 0),Ka:S("INNERTUBE_CONTEXT_CLIENT_CONFIG_INFO"),La:S("INNERTUBE_CONTEXT_CLIENT_NAME","WEB"),innertubeContextClientVersion:S("INNERTUBE_CONTEXT_CLIENT_VERSION",void 0),Na:S("INNERTUBE_CONTEXT_HL",void 0),Ma:S("INNERTUBE_CONTEXT_GL",void 0),Oa:S("INNERTUBE_HOST_OVERRIDE",void 0)||"",Pa:!!S("INNERTUBE_USE_THIRD_PARTY_AUTH",!1)}}
function pg(a){a={client:{hl:a.Na,gl:a.Ma,clientName:a.La,clientVersion:a.innertubeContextClientVersion,configInfo:a.Ka}};var b=window.devicePixelRatio;b&&1!=b&&(a.client.screenDensityFloat=String(b));b=S("EXPERIMENTS_TOKEN","");""!==b&&(a.client.experimentsToken=b);b=[];var c=S("EXPERIMENTS_FORCED_FLAGS",{});for(d in c)b.push({key:d,value:String(c[d])});var d=S("EXPERIMENT_FLAGS",{});for(var e in d)e.startsWith("force_")&&void 0===c[e]&&b.push({key:e,value:String(d[e])});0<b.length&&(a.request={internalExperimentFlags:b});
S("DELEGATED_SESSION_ID")&&!U("pageid_as_header_web")&&(a.user={onBehalfOfUser:S("DELEGATED_SESSION_ID")});a.client=Object.assign(a.client,wg());return a}
function yg(a,b,c){c=void 0===c?{}:c;var d={"X-Goog-Visitor-Id":c.visitorData||S("VISITOR_DATA","")};if(b&&b.includes("www.youtube-nocookie.com"))return d;(b=c.tb||S("AUTHORIZATION"))||(a?b="Bearer "+A("gapi.auth.getToken")().sb:b=bd([]));b&&(d.Authorization=b,d["X-Goog-AuthUser"]=S("SESSION_INDEX",0),U("pageid_as_header_web")&&(d["X-Goog-PageId"]=S("DELEGATED_SESSION_ID")));return d}
function zg(a){a=Object.assign({},a);delete a.Authorization;var b=bd();if(b){var c=new ud;c.update(S("INNERTUBE_API_KEY",void 0));c.update(b);b=c.digest();c=3;La(b);void 0===c&&(c=0);if(!wc){wc={};for(var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),e=["+/=","+/","-_=","-_.","-_"],f=0;5>f;f++){var g=d.concat(e[f].split(""));vc[f]=g;for(var h=0;h<g.length;h++){var k=g[h];void 0===wc[k]&&(wc[k]=h)}}}c=vc[c];d=[];for(e=0;e<b.length;e+=3){var l=b[e],m=(f=e+1<b.length)?
b[e+1]:0;k=(g=e+2<b.length)?b[e+2]:0;h=l>>2;l=(l&3)<<4|m>>4;m=(m&15)<<2|k>>6;k&=63;g||(k=64,f||(m=64));d.push(c[h],c[l],c[m]||"",c[k]||"")}a.hash=d.join("")}return a}
;function Ag(a,b,c,d){Ac.set(""+a,b,{sa:c,path:"/",domain:void 0===d?"youtube.com":d,secure:!1})}
;function Bg(){var a=new se;(a=a.isAvailable()?new ye(a,"yt.innertube"):null)||(a=new te("yt.innertube"),a=a.isAvailable()?a:null);this.f=a?new oe(a):null;this.g=document.domain||window.location.hostname}
Bg.prototype.set=function(a,b,c,d){c=c||31104E3;this.remove(a);if(this.f)try{this.f.set(a,b,C()+1E3*c);return}catch(f){}var e="";if(d)try{e=escape(Jd(b))}catch(f){return}else e=escape(b);Ag(a,e,c,this.g)};
Bg.prototype.get=function(a,b){var c=void 0,d=!this.f;if(!d)try{c=this.f.get(a)}catch(e){d=!0}if(d&&(c=Ac.get(""+a,void 0))&&(c=unescape(c),b))try{c=JSON.parse(c)}catch(e){this.remove(a),c=void 0}return c};
Bg.prototype.remove=function(a){this.f&&this.f.remove(a);var b=this.g;Ac.remove(""+a,"/",void 0===b?"youtube.com":b)};var Cg=new Bg;function Dg(a,b,c,d){if(d)return null;d=Cg.get("nextId",!0)||1;var e=Cg.get("requests",!0)||{};e[d]={method:a,request:b,authState:zg(c),requestTime:Math.round(W())};Cg.set("nextId",d+1,86400,!0);Cg.set("requests",e,86400,!0);return d}
function Eg(a){var b=Cg.get("requests",!0)||{};delete b[a];Cg.set("requests",b,86400,!0)}
function Fg(a){var b=Cg.get("requests",!0);if(b){for(var c in b){var d=b[c];if(!(6E4>Math.round(W())-d.requestTime)){var e=d.authState,f=zg(yg(!1));mb(e,f)&&(e=d.request,"requestTimeMs"in e&&(e.requestTimeMs=Math.round(W())),tg(a,d.method,e,{}));delete b[c]}}Cg.set("requests",b,86400,!0)}}
;function X(a){return new P(function(b,c){function d(){c(a.error);f()}
function e(){b(a.result);f()}
function f(){a.removeEventListener("success",e);a.removeEventListener("error",d)}
a.addEventListener("success",e);a.addEventListener("error",d)})}
;function Gg(a){this.f=a}
n=Gg.prototype;n.add=function(a,b,c){return Hg(Ig(this,[a],"readwrite"),a).add(b,c)};
n.clear=function(a){return Hg(Ig(this,[a],"readwrite"),a).clear()};
n.close=function(){this.f.close()};
n.count=function(a,b){return Hg(Ig(this,[a]),a).count(b)};
n["delete"]=function(a,b){return Hg(Ig(this,[a],"readwrite"),a)["delete"](b)};
n.get=function(a,b){return Hg(Ig(this,[a]),a).get(b)};
n.getName=function(){return this.f.name};
function Ig(a,b,c){a=a.f.transaction(b,c);return new Jg(a)}
function Kg(a){this.f=a}
n=Kg.prototype;n.add=function(a,b){return X(this.f.add(a,b))};
n.clear=function(){return X(this.f.clear()).then(function(){})};
n.count=function(a){return X(this.f.count(a))};
n["delete"]=function(a){return X(this.f["delete"](a))};
n.get=function(a){return X(this.f.get(a))};
n.index=function(a){return new Lg(this.f.index(a))};
n.getName=function(){return this.f.name};
function Mg(){var a=Error.call(this,"Transaction was aborted");this.message=a.message;"stack"in a&&(this.stack=a.stack);Object.setPrototypeOf(this,Mg.prototype)}
v(Mg,Error);function Jg(a){var b=this;this.f=a;this.g=new Map;this.done=new P(function(c,d){b.f.addEventListener("complete",function(){c()});
b.f.addEventListener("error",function(){d(b.f.error)});
b.f.addEventListener("abort",function(){d(new Mg)})})}
Jg.prototype.abort=function(){this.f.abort();return this.done};
function Hg(a,b){var c=a.f.objectStore(b),d=a.g.get(c);d||(d=new Kg(c),a.g.set(c,d));return d}
function Lg(a){this.f=a}
Lg.prototype.count=function(a){return X(this.f.count(a))};
Lg.prototype.get=function(a){return X(this.f.get(a))};
function Ng(a,b){var c=a.f.openCursor(b,"prev");return X(c).then(function(d){return null===d?null:new Og(c,d)})}
function Og(a,b){this.request=a;this.f=b}
Og.prototype["delete"]=function(){return X(this.f["delete"]()).then(function(){})};
Og.prototype.getValue=function(){return this.f.value};
Og.prototype.update=function(a){return X(this.f.update(a))};function Pg(a,b,c){function d(){l||(l=new Gg(e.result));return l}
c=void 0===c?{}:c;var e=void 0!==b?self.indexedDB.open(a,b):self.indexedDB.open(a);a=c;var f=a.ub,g=a.blocking,h=a.Cb,k=a.upgrade,l;k&&e.addEventListener("upgradeneeded",function(m){if(null===m.newVersion)throw Error("Invariant: newVersion on IDbVersionChangeEvent is null");if(null===e.transaction)throw Error("Invariant: transaction on IDbOpenDbRequest is null");var q=d(),t=new Jg(e.transaction);k(q,m.oldVersion,m.newVersion,t)});
f&&e.addEventListener("blocked",function(){f()});
return X(e).then(function(m){g&&m.addEventListener("versionchange",function(){g()});
h&&m.addEventListener("close",function(){h()});
return d()})}
;var Vd,Qg=["getAll","getAllKeys","getKey","openKeyCursor"],Rg=["getAll","getAllKeys","getKey","openKeyCursor"];
function Sg(){return O(this,function b(){var c,d,e,f,g,h,k,l;return x(b,function(m){switch(m.f){case 1:if(!self.indexedDB)return m["return"](!1);c=u(Qg);for(d=c.next();!d.done;d=c.next())if(e=d.value,!IDBObjectStore.prototype[e])return m["return"](!1);f=u(Rg);for(d=f.next();!d.done;d=f.next())if(g=d.value,!IDBIndex.prototype[g])return m["return"](!1);if(!IDBObjectStore.prototype.getKey)return m["return"](!1);sa(m);l=!1;return w(m,Pg("yt-idb-test-do-not-use",void 0,{blocking:function(){l=!0;h&&(h.close(),
h=void 0)}}),5);
case 5:return h=m.g,w(m,Pg("yt-idb-test-do-not-use",h.f.version+1),6);case 6:return k=m.g,k.close(),k=void 0,m["return"](l);case 3:ua(m);if(h)try{h.close()}catch(q){}if(k)try{k.close()}catch(q){}va(m);break;case 2:return ta(m),m["return"](!1)}})})}
function Tg(){return void 0!==Vd?Ud():new P(function(a){Sg().then(function(b){Vd=b;a(b)})})}
;var Ug;function Vg(){return O(this,function b(){return x(b,function(c){if(!Ug)try{Ug=Pg("LogsDataBase",1,{upgrade:function(d,e){if(1>e){var f=d.f.createObjectStore("LogsRequestsStore",{keyPath:"id",autoIncrement:!0});(new Kg(f)).f.createIndex("newRequest",["status","timestamp"],{unique:!1})}}})}catch(d){"VersionError"===d&&T(d),Ug=Pg("LogsDataBase",1)}return c["return"](Ug)})})}
function Wg(a){return O(this,function c(){var d,e,f,g;return x(c,function(h){if(1==h.f)return w(h,Vg(),2);if(3!=h.f)return d=h.g,e=Hg(Ig(d,["LogsRequestsStore"],"readwrite"),"LogsRequestsStore"),f=Object.assign(Object.assign({},a),{options:JSON.parse(JSON.stringify(a.options))}),w(h,e.add(f),3);g=h.g;return h["return"](g)})})}
function Xg(){return O(this,function b(){var c,d,e,f,g,h,k;return x(b,function(l){switch(l.f){case 1:return c=["NEW",0],d=["NEW",W()],e=IDBKeyRange.bound(c,d),w(l,Vg(),2);case 2:return f=l.g,g=Ig(f,["LogsRequestsStore"],"readwrite"),w(l,Ng(Hg(g,"LogsRequestsStore").index("newRequest"),e),3);case 3:h=l.g;k=void 0;if(null===h||void 0===h||!h.getValue()){l.F(4);break}k=h.getValue();k.status="QUEUED";return w(l,h.update(k),4);case 4:return l["return"](k)}})})}
function Yg(a){return O(this,function c(){var d,e,f;return x(c,function(g){switch(g.f){case 1:return w(g,Vg(),2);case 2:return d=g.g,e=Hg(Ig(d,["LogsRequestsStore"],"readwrite"),"LogsRequestsStore"),w(g,e.get(a),3);case 3:return f=g.g,f.status="QUEUED",w(g,X(e.f.put(f,void 0)),4);case 4:return g["return"](f)}})})}
function Zg(a){return O(this,function c(){var d,e,f;return x(c,function(g){switch(g.f){case 1:return w(g,Vg(),2);case 2:return d=g.g,e=Hg(Ig(d,["LogsRequestsStore"],"readwrite"),"LogsRequestsStore"),w(g,e.get(a),3);case 3:return f=g.g,f.status="NEW",f.na+=1,w(g,X(e.f.put(f,void 0)),4);case 4:return g["return"](f)}})})}
function $g(){return O(this,function b(){var c,d;return x(b,function(e){if(1==e.f)return w(e,Vg(),2);if(3!=e.f)return c=e.g,w(e,c.count("LogsRequestsStore"),3);d=e.g;return e["return"](!d)})})}
function ah(a){return O(this,function c(){var d;return x(c,function(e){if(1==e.f)return w(e,Vg(),2);d=e.g;return e["return"](d["delete"]("LogsRequestsStore",a))})})}
;var bh=Ue("network_polling_interval",3E4);function ch(){this.i=0;this.f=window.navigator.onLine;dh(this);eh(this)}
function fh(){ch.f||(ch.f=new ch);return ch.f}
function gh(a){var b=hh,c=ih;a.i||jh(a);(new P(function(d){a.h=d})).then(function(){b();
c&&(a.g=c)})}
function eh(a){window.addEventListener("online",function(){a.f=!0;a.h&&a.h()})}
function dh(a){window.addEventListener("offline",function(){a.f=!1;a.g&&a.g()})}
function jh(a){a.i=Gf(function(){window.navigator.onLine?(!1===a.f&&T(Error("NetworkStatusManager missed online event.")),a.f=!0,a.h&&a.h()):(!0===a.f&&T(Error("NetworkStatusManager missed offline event.")),a.f=!1,a.g&&a.g());jh(a)},bh)}
;var kh=Ue("networkless_throttle_timeout")||100,lh=Ue("networkless_retry_attempts")||1,mh=0;function nh(a,b){Tg().then(function(c){if(c&&!U("networkless_bypass_write")){var d={url:a,options:b,timestamp:W(),status:"NEW",na:0};Wg(d).then(function(e){d.id=e;e=fh();e.f?oh(d):gh(e)})["catch"](function(){oh(d);
T(Error("Networkless Logging: Log request setting to indexedDB failed."))})}else hf(a,b)})}
function hh(){mh||(mh=If(function(){oh();mh=0;hh()},kh))}
function ih(){Kf(mh);mh=0}
function oh(a){O(this,function c(){var d=this,e,f,g,h;return x(c,function(k){switch(k.f){case 1:e=d;if(!a)return w(k,Xg(),6);if(!a.id){k.F(3);break}return w(k,Yg(a.id),5);case 5:a=k.g;k.F(3);break;case 6:if(a=k.g){k.F(3);break}return w(k,$g(),8);case 8:return(f=k.g)&&ih(),k["return"]();case 3:if(ph(a))g=a.options.onError?a.options.onError:function(){},h=a.options.onSuccess?a.options.onSuccess:function(){},a.options.onError=function(l,m){return O(e,function t(){return x(t,function(p){if(1==p.f)return a&&
a.id?a.na<lh?w(p,Zg(a.id),6):w(p,ah(a.id),2):p.F(2);
2!=p.f&&(mh||gh(fh()),g(l,m));g(l,m);p.f=0})})},a.options.onSuccess=function(l,m){return O(e,function t(){return x(t,function(p){if(1==p.f)return a&&a.id?w(p,ah(a.id),2):p.F(2);
h(l,m);p.f=0})})},hf(a.url,a.options);
else if(Je(Error("Networkless Logging: Stored logs request expired age limit")),a.id)return w(k,ah(a.id),0);k.F(0)}})})}
function ph(a){a=a.timestamp;return 2592E6<=W()-a?!1:!0}
;function qh(a,b){for(var c=[],d=1;d<arguments.length;++d)c[d-1]=arguments[d];d=Error.call(this,a);this.message=d.message;"stack"in d&&(this.stack=d.stack);this.args=[].concat(c instanceof Array?c:fa(u(c)))}
v(qh,Error);function rh(a){var b=this;this.f=null;a?this.f=a:xg()&&(this.f=qg());Gf(function(){Fg(b)},5E3)}
rh.prototype.isReady=function(){!this.f&&xg()&&(this.f=qg());return!!this.f};
function tg(a,b,c,d){!S("VISITOR_DATA")&&"visitor_id"!==b&&.01>Math.random()&&Je(new qh("Missing VISITOR_DATA when sending innertube request.",b,c,d));if(!a.isReady())throw b=new qh("innertube xhrclient not ready",b,c,d),T(b),b.f=0,b;var e={headers:{"Content-Type":"application/json"},method:"POST",D:c,xa:"JSON",R:function(){d.R()},
wa:d.R,onSuccess:function(t,p){if(d.onSuccess)d.onSuccess(p)},
va:function(t){if(d.onSuccess)d.onSuccess(t)},
onError:function(t,p){if(d.onError)d.onError(p)},
Ab:function(t){if(d.onError)d.onError(t)},
timeout:d.timeout,withCredentials:!0},f="",g=a.f.Oa;g&&(f=g);g=a.f.Pa||!1;var h=yg(g,f,d);Object.assign(e.headers,h);e.headers.Authorization&&!f&&(e.headers["x-origin"]=window.location.origin);var k=Ne(""+f+("/youtubei/"+a.f.innertubeApiVersion+"/"+b),{alt:"json",key:a.f.innertubeApiKey}),l;if(d.retry&&U("retry_web_logging_batches")&&"www.youtube-nocookie.com"!=f&&(l=Dg(b,c,h,g))){var m=e.onSuccess,q=e.va;e.onSuccess=function(t,p){Eg(l);m(t,p)};
c.va=function(t,p){Eg(l);q(t,p)}}try{U("use_fetch_for_op_xhr")?ef(k,e):U("networkless_logging")&&d.retry?(e.method="POST",nh(k,e)):(e.method="POST",e.D||(e.D={}),hf(k,e))}catch(t){if("InvalidAccessError"==t.name)l&&(Eg(l),l=0),Je(Error("An extension is blocking network request."));
else throw t;}l&&Gf(function(){Fg(a)},5E3)}
;function sh(a,b,c){c=void 0===c?{}:c;var d=rh;S("ytLoggingEventsDefaultDisabled",!1)&&rh==rh&&(d=null);vg(a,b,d,c)}
;var th=[{ta:function(a){return"Cannot read property '"+a.key+"'"},
ma:{TypeError:[{regexp:/Cannot read property '([^']+)' of (null|undefined)/,groups:["key","value"]},{regexp:/\u65e0\u6cd5\u83b7\u53d6\u672a\u5b9a\u4e49\u6216 (null|undefined) \u5f15\u7528\u7684\u5c5e\u6027\u201c([^\u201d]+)\u201d/,groups:["value","key"]},{regexp:/\uc815\uc758\ub418\uc9c0 \uc54a\uc74c \ub610\ub294 (null|undefined) \ucc38\uc870\uc778 '([^']+)' \uc18d\uc131\uc744 \uac00\uc838\uc62c \uc218 \uc5c6\uc2b5\ub2c8\ub2e4./,groups:["value","key"]},{regexp:/No se puede obtener la propiedad '([^']+)' de referencia nula o sin definir/,
groups:["key"]},{regexp:/Unable to get property '([^']+)' of (undefined or null) reference/,groups:["key","value"]}],Error:[{regexp:/(Permission denied) to access property "([^']+)"/,groups:["reason","key"]}]}},{ta:function(a){return"Cannot call '"+a.key+"'"},
ma:{TypeError:[{regexp:/(?:([^ ]+)?\.)?([^ ]+) is not a function/,groups:["base","key"]},{regexp:/Object (.*) has no method '([^ ]+)'/,groups:["base","key"]},{regexp:/Object doesn't support property or method '([^ ]+)'/,groups:["key"]},{regexp:/\u30aa\u30d6\u30b8\u30a7\u30af\u30c8\u306f '([^']+)' \u30d7\u30ed\u30d1\u30c6\u30a3\u307e\u305f\u306f\u30e1\u30bd\u30c3\u30c9\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u305b\u3093/,groups:["key"]},{regexp:/\uac1c\uccb4\uac00 '([^']+)' \uc18d\uc131\uc774\ub098 \uba54\uc11c\ub4dc\ub97c \uc9c0\uc6d0\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4./,
groups:["key"]}]}}];var uh=new Set,vh=0;function wh(a){xh(a,"WARNING")}
function xh(a,b,c,d,e){e=void 0===e?{}:e;e.name=c||S("INNERTUBE_CONTEXT_CLIENT_NAME",1);e.version=d||S("INNERTUBE_CONTEXT_CLIENT_VERSION",void 0);c=e||{};b=void 0===b?"ERROR":b;b=void 0===b?"ERROR":b;var f=void 0===f?!1:f;if(a&&(U("console_log_js_exceptions")&&(d=[],d.push("Name: "+a.name),d.push("Message: "+a.message),a.hasOwnProperty("params")&&d.push("Error Params: "+JSON.stringify(a.params)),d.push("File name: "+a.fileName),d.push("Stacktrace: "+a.stack),window.console.log(d.join("\n"),a)),(window&&
window.yterr||f)&&!(5<=vh)&&0!==a.f)){var g=xc(a);f=g.message||"Unknown Error";d=g.name||"UnknownError";e=g.lineNumber||"Not available";var h=g.fileName||"Not available";g=g.stack||a.g||"Not available";if(a.hasOwnProperty("args")&&a.args&&a.args.length)for(var k=0,l=0;l<a.args.length;l++){var m=a.args[l],q="params."+l;k+=q.length;if(m)if(Array.isArray(m))for(var t=c,p=0;p<m.length&&!(m[p]&&(k+=yh(p,m[p],q,t),500<k));p++);else if("object"===typeof m)for(t in t=void 0,p=c,m){if(m[t]&&(k+=yh(t,m[t],
q,p),500<k))break}else c[q]=String(JSON.stringify(m)).substring(0,500),k+=c[q].length;else c[q]=String(JSON.stringify(m)).substring(0,500),k+=c[q].length;if(500<=k)break}else if(a.hasOwnProperty("params")&&a.params)if(m=a.params,"object"===typeof a.params)for(l in q=0,m){if(m[l]&&(k="params."+l,t=String(JSON.stringify(m[l])).substr(0,500),c[k]=t,q+=k.length+t.length,500<q))break}else c.params=String(JSON.stringify(m)).substr(0,500);c={message:f,name:d,lineNumber:e,fileName:h,stack:g,params:c};a=Number(a.columnNumber);
isNaN(a)||(c.lineNumber=c.lineNumber+":"+a);a=u(th);for(f=a.next();!f.done;f=a.next())if(f=f.value,f.ma[c.name])for(e=u(f.ma[c.name]),d=e.next();!d.done;d=e.next())if(h=d.value,d=c.message.match(h.regexp)){c.params["error.original"]=d[0];e=h.groups;h={};for(g=0;g<e.length;g++)h[e[g]]=d[g+1],c.params["error."+e[g]]=d[g+1];c.message=f.ta(h);break}window.yterr&&"function"===typeof window.yterr&&window.yterr(c);if(!(uh.has(c.message)||0<=c.stack.indexOf("/YouTubeCenter.js")||0<=c.stack.indexOf("/mytube.js"))){if(U("kevlar_gel_error_routing")){f=
b;d={stackTrace:c.stack};c.fileName&&(d.filename=c.fileName);a=c.lineNumber&&c.lineNumber.split?c.lineNumber.split(":"):[];0!==a.length&&(1!==a.length||isNaN(Number(a[0]))?2!==a.length||isNaN(Number(a[0]))||isNaN(Number(a[1]))||(d.lineNumber=Number(a[0]),d.columnNumber=Number(a[1])):d.lineNumber=Number(a[0]));a={level:"ERROR_LEVEL_UNKNOWN",message:c.message};"ERROR"===f?a.level="ERROR_LEVEL_ERROR":"WARNING"===f&&(a.level="ERROR_LEVEL_WARNNING");f={isObfuscated:!0,browserStackInfo:d};d={pageUrl:window.location.href,
kvPairs:[]};if(e=c.params)for(h=u(Object.keys(e)),g=h.next();!g.done;g=h.next())g=g.value,d.kvPairs.push({key:"client."+g,value:String(e[g])});sh("clientError",{errorMetadata:d,stackTrace:f,logMessage:a});mg()}a=c.params||{};b={gb:{a:"logerror",t:"jserror",type:c.name,msg:c.message.substr(0,250),line:c.lineNumber,level:b,"client.name":a.name},D:{url:S("PAGE_NAME",window.location.href),file:c.fileName},method:"POST"};a.version&&(b["client.version"]=a.version);if(b.D){c.stack&&(b.D.stack=c.stack);f=
u(Object.keys(a));for(d=f.next();!d.done;d=f.next())d=d.value,b.D["client."+d]=a[d];if(a=S("LATEST_ECATCHER_SERVICE_TRACKING_PARAMS",void 0))for(f=u(Object.keys(a)),d=f.next();!d.done;d=f.next())d=d.value,b.D[d]=a[d];a=S("SERVER_NAME",void 0);f=S("SERVER_VERSION",void 0);a&&f&&(b.D["server.name"]=a,b.D["server.version"]=f)}hf(S("ECATCHER_REPORT_HOST","")+"/error_204",b);uh.add(c.message);vh++}}}
function yh(a,b,c,d){c+="."+a;a=String(JSON.stringify(b)).substr(0,500);d[c]=a;return c.length+a.length}
;function zh(a,b,c,d,e,f){xh(a,void 0===b?"ERROR":b,c,d,f)}
;var Ah=window.yt&&window.yt.msgs_||window.ytcfg&&window.ytcfg.msgs||{};z("yt.msgs_",Ah,void 0);function Bh(a){ze(Ah,arguments)}
;function Ch(a){a&&(a.dataset?a.dataset[Dh("loaded")]="true":a.setAttribute("data-loaded","true"))}
function Eh(a,b){return a?a.dataset?a.dataset[Dh(b)]:a.getAttribute("data-"+b):null}
var Fh={};function Dh(a){return Fh[a]||(Fh[a]=String(a).replace(/\-([a-z])/g,function(b,c){return c.toUpperCase()}))}
;var Gh=/\.vflset|-vfl[a-zA-Z0-9_+=-]+/,Hh=/-[a-zA-Z]{2,3}_[a-zA-Z]{2,3}(?=(\/|$))/;function Ih(a,b,c){c=void 0===c?null:c;if(window.spf&&spf.script){c="";if(a){var d=a.indexOf("jsbin/"),e=a.lastIndexOf(".js"),f=d+6;-1<d&&-1<e&&e>f&&(c=a.substring(f,e),c=c.replace(Gh,""),c=c.replace(Hh,""),c=c.replace("debug-",""),c=c.replace("tracing-",""))}spf.script.load(a,c,b)}else Jh(a,b,c)}
function Jh(a,b,c){c=void 0===c?null:c;var d=Kh(a),e=document.getElementById(d),f=e&&Eh(e,"loaded"),g=e&&!f;f?b&&b():(b&&(f=Uf(d,b),b=""+Oa(b),Lh[b]=f),g||(e=Mh(a,d,function(){Eh(e,"loaded")||(Ch(e),Xf(d),V(Ua(Yf,d),0))},c)))}
function Mh(a,b,c,d){d=void 0===d?null:d;var e=Ic(document,"SCRIPT");e.id=b;e.onload=function(){c&&setTimeout(c,0)};
e.onreadystatechange=function(){switch(e.readyState){case "loaded":case "complete":e.onload()}};
d&&e.setAttribute("nonce",d);Zb(e,Mc(a));a=document.getElementsByTagName("head")[0]||document.body;a.insertBefore(e,a.firstChild);return e}
function Nh(a){a=Kh(a);var b=document.getElementById(a);b&&(Yf(a),b.parentNode.removeChild(b))}
function Oh(a,b){if(a&&b){var c=""+Oa(b);(c=Lh[c])&&Wf(c)}}
function Kh(a){var b=document.createElement("a");Yb(b,a);a=b.href.replace(/^[a-zA-Z]+:\/\//,"//");return"js-"+ac(a)}
var Lh={};var Ph=[],Qh=!1;function Rh(){if("1"!=hb(Be(),"args","privembed")){var a=function(){Qh=!0;"google_ad_status"in window?R("DCLKSTAT",1):R("DCLKSTAT",2)};
Ih("//static.doubleclick.net/instream/ad_status.js",a);Ph.push(If(function(){Qh||"google_ad_status"in window||(Oh("//static.doubleclick.net/instream/ad_status.js",a),Qh=!0,R("DCLKSTAT",3))},5E3))}}
function Sh(){return parseInt(S("DCLKSTAT",0),10)}
;function Th(){this.g=!1;this.f=null}
Th.prototype.initialize=function(a,b,c,d,e,f){var g=this;f=void 0===f?!1:f;b?(this.g=!0,Ih(b,function(){g.g=!1;window.botguard?Uh(g,c,d,f):(Nh(b),wh(new qh("Unable to load Botguard","from "+b)))},e)):a&&(eval(a),window.botguard?Uh(this,c,d,f):wh(Error("Unable to load Botguard from JS")))};
function Uh(a,b,c,d){if(d)try{a.f=new window.botguard.bg(b,c?function(){return c(b)}:Ia)}catch(e){wh(e)}else{try{a.f=new window.botguard.bg(b)}catch(e){wh(e)}c&&c(b)}}
Th.prototype.dispose=function(){this.f=null};var Vh=new Th;function Wh(){return!!Vh.f}
function Xh(a){a=void 0===a?{}:a;a=void 0===a?{}:a;return Vh.f?Vh.f.invoke(void 0,void 0,a):null}
;var Yh=C().toString();
function Zh(){a:{if(window.crypto&&window.crypto.getRandomValues)try{var a=Array(16),b=new Uint8Array(16);window.crypto.getRandomValues(b);for(var c=0;c<a.length;c++)a[c]=b[c];var d=a;break a}catch(e){}d=Array(16);for(a=0;16>a;a++){b=C();for(c=0;c<b%23;c++)d[a]=Math.random();d[a]=Math.floor(256*Math.random())}if(Yh)for(a=1,b=0;b<Yh.length;b++)d[a%16]=d[a%16]^d[(a-1)%16]/4^Yh.charCodeAt(b),a++}a=[];for(b=0;b<d.length;b++)a.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(d[b]&63));
return a.join("")}
;var $h=y.ytLoggingDocDocumentNonce_||Zh();z("ytLoggingDocDocumentNonce_",$h,void 0);var ai=1;function bi(a){this.f=a}
bi.prototype.getAsJson=function(){var a={};void 0!==this.f.trackingParams?a.trackingParams=this.f.trackingParams:(a.veType=this.f.veType,void 0!==this.f.veCounter&&(a.veCounter=this.f.veCounter),void 0!==this.f.elementIndex&&(a.elementIndex=this.f.elementIndex));void 0!==this.f.dataElement&&(a.dataElement=this.f.dataElement.getAsJson());void 0!==this.f.youtubeData&&(a.youtubeData=this.f.youtubeData);return a};
bi.prototype.toString=function(){return JSON.stringify(this.getAsJson())};
bi.prototype.isClientVe=function(){return!this.f.trackingParams&&!!this.f.veType};function ci(a){a=void 0===a?0:a;return 0==a?"client-screen-nonce":"client-screen-nonce."+a}
function di(a){a=void 0===a?0:a;return 0==a?"ROOT_VE_TYPE":"ROOT_VE_TYPE."+a}
function ei(a){return S(di(void 0===a?0:a),void 0)}
z("yt_logging_screen.getRootVeType",ei,void 0);function fi(){var a=ei(0),b;a?b=new bi({veType:a,youtubeData:void 0}):b=null;return b}
function gi(){var a=S("csn-to-ctt-auth-info");a||(a={},R("csn-to-ctt-auth-info",a));return a}
function hi(a){a=void 0===a?0:a;var b=S(ci(a));if(!b&&!S("USE_CSN_FALLBACK",!0))return null;b||0!=a||(U("kevlar_client_side_screens")||U("c3_client_side_screens")?b="UNDEFINED_CSN":b=S("EVENT_ID"));return b?b:null}
z("yt_logging_screen.getCurrentCsn",hi,void 0);function ii(a,b,c){var d=gi();(c=hi(c))&&delete d[c];b&&(d[a]=b)}
function ji(a){return gi()[a]}
z("yt_logging_screen.getCttAuthInfo",ji,void 0);function ki(a,b,c,d){c=void 0===c?0:c;if(a!==S(ci(c))||b!==S(di(c)))if(ii(a,d,c),R(ci(c),a),R(di(c),b),0==c||U("web_screen_associated_all_layers"))b=function(){setTimeout(function(){a&&vg("foregroundHeartbeatScreenAssociated",{clientDocumentNonce:$h,clientScreenNonce:a},rh)},0)},"requestAnimationFrame"in window?window.requestAnimationFrame(b):b()}
z("yt_logging_screen.setCurrentScreen",ki,void 0);function li(a,b,c){b=void 0===b?{}:b;c=void 0===c?!1:c;var d=S("EVENT_ID");d&&(b.ei||(b.ei=d));if(b){d=a;var e=void 0===e?!0:e;var f=S("VALID_SESSION_TEMPDATA_DOMAINS",[]),g=J(K(3,window.location.href));g&&f.push(g);g=J(K(3,d));if(0<=Za(f,g)||!g&&0==d.lastIndexOf("/",0))if(U("autoescape_tempdata_url")&&(f=document.createElement("a"),Yb(f,d),d=f.href),d){g=d.match(bc);d=g[5];f=g[6];g=g[7];var h="";d&&(h+=d);f&&(h+="?"+f);g&&(h+="#"+g);d=h;f=d.indexOf("#");if(d=0>f?d:d.substr(0,f))if(e&&!b.csn&&(b.itct||
b.ved)&&(b=Object.assign({csn:hi()},b)),k){var k=parseInt(k,10);isFinite(k)&&0<k&&(e=b,b="ST-"+ac(d).toString(36),e=e?dc(e):"",Ag(b,e,k||5))}else k=b,e="ST-"+ac(d).toString(36),k=k?dc(k):"",Ag(e,k,5)}}if(c)return!1;if((window.ytspf||{}).enabled)spf.navigate(a);else{var l=void 0===l?{}:l;var m=void 0===m?"":m;var q=void 0===q?window:q;c=q.location;a=ec(a,l)+m;a=a instanceof H?a:Pb(a);c.href=Nb(a)}return!0}
;function mi(a,b){this.version=a;this.args=b}
;function ni(a,b){this.topic=a;this.f=b}
ni.prototype.toString=function(){return this.topic};var oi=A("ytPubsub2Pubsub2Instance")||new Q;Q.prototype.subscribe=Q.prototype.subscribe;Q.prototype.unsubscribeByKey=Q.prototype.P;Q.prototype.publish=Q.prototype.O;Q.prototype.clear=Q.prototype.clear;z("ytPubsub2Pubsub2Instance",oi,void 0);var pi=A("ytPubsub2Pubsub2SubscribedKeys")||{};z("ytPubsub2Pubsub2SubscribedKeys",pi,void 0);var qi=A("ytPubsub2Pubsub2TopicToKeys")||{};z("ytPubsub2Pubsub2TopicToKeys",qi,void 0);var ri=A("ytPubsub2Pubsub2IsAsync")||{};z("ytPubsub2Pubsub2IsAsync",ri,void 0);
z("ytPubsub2Pubsub2SkipSubKey",null,void 0);function si(a,b){var c=ti();c&&c.publish.call(c,a.toString(),a,b)}
function ui(a){var b=vi,c=ti();if(!c)return 0;var d=c.subscribe(b.toString(),function(e,f){var g=A("ytPubsub2Pubsub2SkipSubKey");g&&g==d||(g=function(){if(pi[d])try{if(f&&b instanceof ni&&b!=e)try{var h=b.f,k=f;if(!k.args||!k.version)throw Error("yt.pubsub2.Data.deserialize(): serializedData is incomplete.");try{if(!h.J){var l=new h;h.J=l.version}var m=h.J}catch(q){}if(!m||k.version!=m)throw Error("yt.pubsub2.Data.deserialize(): serializedData version is incompatible.");try{f=Reflect.construct(h,
eb(k.args))}catch(q){throw q.message="yt.pubsub2.Data.deserialize(): "+q.message,q;}}catch(q){throw q.message="yt.pubsub2.pubsub2 cross-binary conversion error for "+b.toString()+": "+q.message,q;}a.call(window,f)}catch(q){T(q)}},ri[b.toString()]?A("yt.scheduler.instance")?If(g):V(g,0):g())});
pi[d]=!0;qi[b.toString()]||(qi[b.toString()]=[]);qi[b.toString()].push(d);return d}
function wi(){var a=xi,b=ui(function(c){a.apply(void 0,arguments);yi(b)});
return b}
function yi(a){var b=ti();b&&("number"===typeof a&&(a=[a]),G(a,function(c){b.unsubscribeByKey(c);delete pi[c]}))}
function ti(){return A("ytPubsub2Pubsub2Instance")}
;function zi(a){mi.call(this,1,arguments);this.csn=a}
v(zi,mi);var vi=new ni("screen-created",zi),Ai=[],Bi=0;function Ci(a,b,c){var d=U("use_default_events_client")?void 0:rh;b={csn:a,parentVe:b.getAsJson(),childVes:ab(c,function(f){return f.getAsJson()})};
c=u(c);for(var e=c.next();!e.done;e=c.next())e=e.value.getAsJson(),(kb(e)||!e.trackingParams&&!e.veType)&&zh(Error("Child VE logged with no data"),"WARNING");c={fa:ji(a),S:a};"UNDEFINED_CSN"==a?Di("visualElementAttached",b,c):d?vg("visualElementAttached",b,d,c):sh("visualElementAttached",b,c)}
function Di(a,b,c){Ai.push({payloadName:a,payload:b,options:c});Bi||(Bi=wi())}
function xi(a){if(Ai){for(var b=u(Ai),c=b.next();!c.done;c=b.next())c=c.value,c.payload&&(c.payload.csn=a.csn,vg(c.payloadName,c.payload,null,c.options));Ai.length=0}Bi=0}
;function Ei(a){a=a||{};var b={},c={};this.url=a.url||"";this.args=a.args||nb(b);this.assets=a.assets||{};this.attrs=a.attrs||nb(c);this.fallback=a.fallback||null;this.fallbackMessage=a.fallbackMessage||null;this.html5=!!a.html5;this.disable=a.disable||{};this.loaded=!!a.loaded;this.messages=a.messages||{}}
Ei.prototype.clone=function(){var a=new Ei,b;for(b in this)if(this.hasOwnProperty(b)){var c=this[b];"object"==Ka(c)?a[b]=nb(c):a[b]=c}return a};function Fi(){M.call(this);this.f=[]}
v(Fi,M);Fi.prototype.o=function(){for(;this.f.length;){var a=this.f.pop();a.target.removeEventListener(a.name,a.vb)}M.prototype.o.call(this)};var Gi=/cssbin\/(?:debug-)?([a-zA-Z0-9_-]+?)(?:-2x|-web|-rtl|-vfl|.css)/;function Hi(a){a=a||"";if(window.spf){var b=a.match(Gi);spf.style.load(a,b?b[1]:"",void 0)}else Ii(a)}
function Ii(a){var b=Ji(a),c=document.getElementById(b),d=c&&Eh(c,"loaded");d||c&&!d||(c=Ki(a,b,function(){Eh(c,"loaded")||(Ch(c),Xf(b),V(Ua(Yf,b),0))}))}
function Ki(a,b,c){var d=document.createElement("link");d.id=b;d.onload=function(){c&&setTimeout(c,0)};
a=Mc(a);d.rel="stylesheet";d.href=Ab(a).toString();(document.getElementsByTagName("head")[0]||document.body).appendChild(d);return d}
function Ji(a){var b=Ic(document,"A"),c=new tb(ub,"This URL is never added to the DOM");wb(c);wb(c);Yb(b,new H(Lb,a));a=b.href.replace(/^[a-zA-Z]+:\/\//,"//");return"css-"+ac(a)}
;function Li(a,b,c,d){M.call(this);var e=this;this.m=this.Z=a;this.W=b;this.u=!1;this.api={};this.X=this.G=null;this.H=new Q;Tc(this,Ua(Uc,this.H));this.j={};this.T=this.Y=this.h=this.ea=this.f=null;this.M=!1;this.l=this.C=null;this.aa={};this.Aa=["onReady"];this.da=null;this.oa=NaN;this.U={};this.i=d;Mi(this);this.ba("WATCH_LATER_VIDEO_ADDED",this.Ra.bind(this));this.ba("WATCH_LATER_VIDEO_REMOVED",this.Sa.bind(this));this.ba("onAdAnnounce",this.Ca.bind(this));this.Ba=new Fi(this);Tc(this,Ua(Uc,this.Ba));
this.V=0;c?this.V=V(function(){e.loadNewVideoConfig(c)},0):d&&(Ni(this),Oi(this))}
v(Li,M);n=Li.prototype;n.getId=function(){return this.W};
n.loadNewVideoConfig=function(a){if(!this.g){this.V&&(Ye(this.V),this.V=0);a instanceof Ei||(a=new Ei(a));this.ea=a;this.f=a.clone();Ni(this);this.Y||(this.Y=Pi(this,this.f.args.jsapicallback||"onYouTubePlayerReady"));this.f.args.jsapicallback=null;if(a=this.f.attrs.width)this.m.style.width=Wc(Number(a)||a);if(a=this.f.attrs.height)this.m.style.height=Wc(Number(a)||a);Oi(this);this.u&&Qi(this)}};
function Ni(a){var b;a.i?b=a.i.rootElementId:b=a.f.attrs.id;a.h=b||a.h;"video-player"==a.h&&(a.h=a.W,a.f.attrs.id=a.W);a.m.id==a.h&&(a.h+="-player",a.f.attrs.id=a.h)}
n.Ga=function(){return this.ea};
function Qi(a){a.f&&!a.f.loaded&&(a.f.loaded=!0,"0"!=a.f.args.autoplay?a.api.loadVideoByPlayerVars(a.f.args):a.api.cueVideoByPlayerVars(a.f.args))}
function Ri(a){var b=!0,c=Si(a);c&&a.f&&(a=Ti(a),b=Eh(c,"version")===a);return b&&!!A("yt.player.Application.create")}
function Oi(a){if(!a.g&&!a.M){var b=Ri(a);if(b&&"html5"==(Si(a)?"html5":null))a.T="html5",a.u||Ui(a);else if(Vi(a),a.T="html5",b&&a.l)a.Z.appendChild(a.l),Ui(a);else{a.f&&(a.f.loaded=!0);var c=!1;a.C=function(){c=!0;if(a.i)var d=a.i.serializedExperimentFlags;else a.f&&a.f.args&&(d=a.f.args.fflags);d="true"==Ke(d||"").player_bootstrap_method?A("yt.player.Application.createAlternate")||A("yt.player.Application.create"):A("yt.player.Application.create");var e=a.f?a.f.clone():void 0;d(a.Z,e,a.i);Ui(a)};
a.M=!0;b?a.C():(Ih(Ti(a),a.C),(b=a.i?a.i.cssUrl:a.f.assets.css)&&Hi(b),Wi(a)&&!c&&z("yt.player.Application.create",null,void 0))}}}
function Si(a){var b=Ec(a.h);!b&&a.m&&a.m.querySelector&&(b=a.m.querySelector("#"+a.h));return b}
function Ui(a){if(!a.g){var b=Si(a),c=!1;b&&b.getApiInterface&&b.getApiInterface()&&(c=!0);c?(a.M=!1,b.isNotServable&&a.f&&b.isNotServable(a.f.args.video_id)||Xi(a)):a.oa=V(function(){Ui(a)},50)}}
function Xi(a){Mi(a);a.u=!0;var b=Si(a);b.addEventListener&&(a.G=Yi(a,b,"addEventListener"));b.removeEventListener&&(a.X=Yi(a,b,"removeEventListener"));var c=b.getApiInterface();c=c.concat(b.getInternalApiInterface());for(var d=0;d<c.length;d++){var e=c[d];a.api[e]||(a.api[e]=Yi(a,b,e))}for(var f in a.j)a.G(f,a.j[f]);Qi(a);a.Y&&a.Y(a.api);a.H.O("onReady",a.api)}
function Yi(a,b,c){var d=b[c];return function(){try{return a.da=null,d.apply(b,arguments)}catch(e){"sendAbandonmentPing"!=c&&(e.params=c,a.da=e,Je(e))}}}
function Mi(a){a.u=!1;if(a.X)for(var b in a.j)a.X(b,a.j[b]);for(var c in a.U)Ye(parseInt(c,10));a.U={};a.G=null;a.X=null;for(var d in a.api)a.api[d]=null;a.api.addEventListener=a.ba.bind(a);a.api.removeEventListener=a.Wa.bind(a);a.api.destroy=a.dispose.bind(a);a.api.getLastError=a.Ha.bind(a);a.api.getPlayerType=a.Ia.bind(a);a.api.getCurrentVideoConfig=a.Ga.bind(a);a.api.loadNewVideoConfig=a.loadNewVideoConfig.bind(a);a.api.isReady=a.Qa.bind(a)}
n.Qa=function(){return this.u};
n.ba=function(a,b){var c=this,d=Pi(this,b);if(d){if(!(0<=Za(this.Aa,a)||this.j[a])){var e=Zi(this,a);this.G&&this.G(a,e)}this.H.subscribe(a,d);"onReady"==a&&this.u&&V(function(){d(c.api)},0)}};
n.Wa=function(a,b){if(!this.g){var c=Pi(this,b);c&&ie(this.H,a,c)}};
function Pi(a,b){var c=b;if("string"==typeof b){if(a.aa[b])return a.aa[b];c=function(){var d=A(b);d&&d.apply(y,arguments)};
a.aa[b]=c}return c?c:null}
function Zi(a,b){var c="ytPlayer"+b+a.W;a.j[b]=c;y[c]=function(d){var e=V(function(){if(!a.g){a.H.O(b,d);var f=a.U,g=String(e);g in f&&delete f[g]}},0);
lb(a.U,String(e))};
return c}
n.Ca=function(a){Xf("a11y-announce",a)};
n.Ra=function(a){Xf("WATCH_LATER_VIDEO_ADDED",a)};
n.Sa=function(a){Xf("WATCH_LATER_VIDEO_REMOVED",a)};
n.Ia=function(){return this.T||(Si(this)?"html5":null)};
n.Ha=function(){return this.da};
function Vi(a){a.cancel();Mi(a);a.T=null;a.f&&(a.f.loaded=!1);var b=Si(a);b&&(Ri(a)||!Wi(a)?a.l=b:(b&&b.destroy&&b.destroy(),a.l=null));for(a=a.Z;b=a.firstChild;)a.removeChild(b)}
n.cancel=function(){if(this.C){var a=Ti(this);Oh(a,this.C)}Ye(this.oa);this.M=!1};
n.o=function(){Vi(this);if(this.l&&this.f&&this.l.destroy)try{this.l.destroy()}catch(b){T(b)}this.aa=null;for(var a in this.j)y[this.j[a]]=null;this.ea=this.f=this.api=null;delete this.Z;delete this.m;M.prototype.o.call(this)};
function Wi(a){return a.f&&a.f.args&&a.f.args.fflags?-1!=a.f.args.fflags.indexOf("player_destroy_old_version=true"):!1}
function Ti(a){return a.i?a.i.jsUrl:a.f.assets.js}
;var $i={},aj="player_uid_"+(1E9*Math.random()>>>0);function bj(a){delete $i[a.getId()]}
;function cj(a){return(0===a.search("cue")||0===a.search("load"))&&"loadModule"!==a}
function dj(a,b,c){"string"===typeof a&&(a={mediaContentUrl:a,startSeconds:b,suggestedQuality:c});a:{if((b=a.mediaContentUrl)&&(b=/\/([ve]|embed)\/([^#?]+)/.exec(b))&&b[2]){b=b[2];break a}b=null}a.videoId=b;return ej(a)}
function ej(a,b,c){if("string"===typeof a)return{videoId:a,startSeconds:b,suggestedQuality:c};b=["endSeconds","startSeconds","mediaContentUrl","suggestedQuality","videoId"];c={};for(var d=0;d<b.length;d++){var e=b[d];a[e]&&(c[e]=a[e])}return c}
function fj(a,b,c,d){if(Na(a)&&!Array.isArray(a)){b="playlist list listType index startSeconds suggestedQuality".split(" ");c={};for(d=0;d<b.length;d++){var e=b[d];a[e]&&(c[e]=a[e])}return c}b={index:b,startSeconds:c,suggestedQuality:d};"string"===typeof a&&16===a.length?b.list="PL"+a:b.playlist=a;return b}
;function gj(a){a=void 0===a?!1:a;M.call(this);this.f=new Q(a);Tc(this,Ua(Uc,this.f))}
E(gj,M);gj.prototype.subscribe=function(a,b,c){return this.g?0:this.f.subscribe(a,b,c)};
gj.prototype.j=function(a,b){this.g||this.f.O.apply(this.f,arguments)};function hj(a,b,c){gj.call(this);this.h=a;this.i=b;this.l=c}
v(hj,gj);function ij(a,b,c){if(!a.g){var d=a.h;d.g||a.i!=d.f||(a={id:a.l,command:b},c&&(a.data=c),d.f.postMessage(Jd(a),d.i))}}
hj.prototype.o=function(){this.i=this.h=null;gj.prototype.o.call(this)};function jj(a){M.call(this);this.f=a;this.f.subscribe("command",this.ya,this);this.h={};this.j=!1}
v(jj,M);n=jj.prototype;n.start=function(){this.j||this.g||(this.j=!0,ij(this.f,"RECEIVING"))};
n.ya=function(a,b,c){if(this.j&&!this.g){var d=b||{};switch(a){case "addEventListener":"string"===typeof d.event&&(a=d.event,a in this.h||(c=B(this.Ya,this,a),this.h[a]=c,this.addEventListener(a,c)));break;case "removeEventListener":"string"===typeof d.event&&kj(this,d.event);break;default:this.i.isReady()&&this.i.isExternalMethodAvailable(a,c||null)&&(b=lj(a,b||{}),c=this.i.handleExternalCall(a,b,c||null),(c=mj(a,c))&&this.j&&!this.g&&ij(this.f,a,c))}}};
n.Ya=function(a,b){this.j&&!this.g&&ij(this.f,a,this.ha(a,b))};
n.ha=function(a,b){if(null!=b)return{value:b}};
function kj(a,b){b in a.h&&(a.removeEventListener(b,a.h[b]),delete a.h[b])}
n.o=function(){var a=this.f;a.g||ie(a.f,"command",this.ya,this);this.f=null;for(var b in this.h)kj(this,b);M.prototype.o.call(this)};function nj(a,b){jj.call(this,b);this.i=a;this.start()}
v(nj,jj);nj.prototype.addEventListener=function(a,b){this.i.addEventListener(a,b)};
nj.prototype.removeEventListener=function(a,b){this.i.removeEventListener(a,b)};
function lj(a,b){switch(a){case "loadVideoById":return b=ej(b),[b];case "cueVideoById":return b=ej(b),[b];case "loadVideoByPlayerVars":return[b];case "cueVideoByPlayerVars":return[b];case "loadPlaylist":return b=fj(b),[b];case "cuePlaylist":return b=fj(b),[b];case "seekTo":return[b.seconds,b.allowSeekAhead];case "playVideoAt":return[b.index];case "setVolume":return[b.volume];case "setPlaybackQuality":return[b.suggestedQuality];case "setPlaybackRate":return[b.suggestedRate];case "setLoop":return[b.loopPlaylists];
case "setShuffle":return[b.shufflePlaylist];case "getOptions":return[b.module];case "getOption":return[b.module,b.option];case "setOption":return[b.module,b.option,b.value];case "handleGlobalKeyDown":return[b.keyCode,b.shiftKey,b.ctrlKey,b.altKey,b.metaKey,b.key,b.code]}return[]}
function mj(a,b){switch(a){case "isMuted":return{muted:b};case "getVolume":return{volume:b};case "getPlaybackRate":return{playbackRate:b};case "getAvailablePlaybackRates":return{availablePlaybackRates:b};case "getVideoLoadedFraction":return{videoLoadedFraction:b};case "getPlayerState":return{playerState:b};case "getCurrentTime":return{currentTime:b};case "getPlaybackQuality":return{playbackQuality:b};case "getAvailableQualityLevels":return{availableQualityLevels:b};case "getDuration":return{duration:b};
case "getVideoUrl":return{videoUrl:b};case "getVideoEmbedCode":return{videoEmbedCode:b};case "getPlaylist":return{playlist:b};case "getPlaylistIndex":return{playlistIndex:b};case "getOptions":return{options:b};case "getOption":return{option:b}}}
nj.prototype.ha=function(a,b){switch(a){case "onReady":return;case "onStateChange":return{playerState:b};case "onPlaybackQualityChange":return{playbackQuality:b};case "onPlaybackRateChange":return{playbackRate:b};case "onError":return{errorCode:b}}return jj.prototype.ha.call(this,a,b)};
nj.prototype.o=function(){jj.prototype.o.call(this);delete this.i};function oj(a,b,c){M.call(this);var d=this;c=c||S("POST_MESSAGE_ORIGIN",void 0)||window.document.location.protocol+"//"+window.document.location.hostname;this.h=b||null;this.u="*";this.i=c;this.sessionId=null;this.channel="widget";this.C=!!a;this.m=function(e){a:if(!("*"!=d.i&&e.origin!=d.i||d.h&&e.source!=d.h||"string"!==typeof e.data)){try{var f=JSON.parse(e.data)}catch(g){break a}if(!(null==f||d.C&&(d.sessionId&&d.sessionId!=f.id||d.channel&&d.channel!=f.channel))&&f)switch(f.event){case "listening":"null"!=
e.origin&&(d.i=d.u=e.origin);d.h=e.source;d.sessionId=f.id;d.f&&(d.f(),d.f=null);break;case "command":d.j&&(!d.l||0<=Za(d.l,f.func))&&d.j(f.func,f.args,e.origin)}}};
this.l=this.f=this.j=null;window.addEventListener("message",this.m)}
v(oj,M);oj.prototype.sendMessage=function(a,b){var c=b||this.h;if(c){this.sessionId&&(a.id=this.sessionId);this.channel&&(a.channel=this.channel);try{var d=JSON.stringify(a);c.postMessage(d,this.u)}catch(e){Je(e)}}};
oj.prototype.o=function(){window.removeEventListener("message",this.m);M.prototype.o.call(this)};function pj(){var a=this.g=new oj(!!S("WIDGET_ID_ENFORCE")),b=B(this.Va,this);a.j=b;a.l=null;this.g.channel="widget";if(a=S("WIDGET_ID"))this.g.sessionId=a;this.i=[];this.l=!1;this.j={}}
n=pj.prototype;n.Va=function(a,b,c){"addEventListener"==a&&b?(a=b[0],this.j[a]||"onReady"==a||(this.addEventListener(a,qj(this,a)),this.j[a]=!0)):this.ua(a,b,c)};
n.ua=function(){};
function qj(a,b){return B(function(c){this.sendMessage(b,c)},a)}
n.addEventListener=function(){};
n.Fa=function(){this.l=!0;this.sendMessage("initialDelivery",this.ia());this.sendMessage("onReady");G(this.i,this.za,this);this.i=[]};
n.ia=function(){return null};
function rj(a,b){a.sendMessage("infoDelivery",b)}
n.za=function(a){this.l?this.g.sendMessage(a):this.i.push(a)};
n.sendMessage=function(a,b){this.za({event:a,info:void 0==b?null:b})};
n.dispose=function(){this.g=null};function sj(a){pj.call(this);this.f=a;this.h=[];this.addEventListener("onReady",B(this.Ta,this));this.addEventListener("onVideoProgress",B(this.cb,this));this.addEventListener("onVolumeChange",B(this.eb,this));this.addEventListener("onApiChange",B(this.Xa,this));this.addEventListener("onPlaybackQualityChange",B(this.Za,this));this.addEventListener("onPlaybackRateChange",B(this.ab,this));this.addEventListener("onStateChange",B(this.bb,this));this.addEventListener("onWebglSettingsChanged",B(this.fb,
this))}
v(sj,pj);n=sj.prototype;n.ua=function(a,b,c){if(this.f.isExternalMethodAvailable(a,c)){b=b||[];if(0<b.length&&cj(a)){var d=b;if(Na(d[0])&&!Array.isArray(d[0]))d=d[0];else{var e={};switch(a){case "loadVideoById":case "cueVideoById":e=ej.apply(window,d);break;case "loadVideoByUrl":case "cueVideoByUrl":e=dj.apply(window,d);break;case "loadPlaylist":case "cuePlaylist":e=fj.apply(window,d)}d=e}b.length=1;b[0]=d}this.f.handleExternalCall(a,b,c);cj(a)&&rj(this,this.ia())}};
n.Ta=function(){var a=B(this.Fa,this);this.g.f=a};
n.addEventListener=function(a,b){this.h.push({eventType:a,listener:b});this.f.addEventListener(a,b)};
n.ia=function(){if(!this.f)return null;var a=this.f.getApiInterface();db(a,"getVideoData");for(var b={apiInterface:a},c=0,d=a.length;c<d;c++){var e=a[c];if(0===e.search("get")||0===e.search("is")){var f=0;0===e.search("get")?f=3:0===e.search("is")&&(f=2);f=e.charAt(f).toLowerCase()+e.substr(f+1);try{var g=this.f[e]();b[f]=g}catch(h){}}}b.videoData=this.f.getVideoData();b.currentTimeLastUpdated_=C()/1E3;return b};
n.bb=function(a){a={playerState:a,currentTime:this.f.getCurrentTime(),duration:this.f.getDuration(),videoData:this.f.getVideoData(),videoStartBytes:0,videoBytesTotal:this.f.getVideoBytesTotal(),videoLoadedFraction:this.f.getVideoLoadedFraction(),playbackQuality:this.f.getPlaybackQuality(),availableQualityLevels:this.f.getAvailableQualityLevels(),currentTimeLastUpdated_:C()/1E3,playbackRate:this.f.getPlaybackRate(),mediaReferenceTime:this.f.getMediaReferenceTime()};this.f.getVideoUrl&&(a.videoUrl=
this.f.getVideoUrl());this.f.getVideoContentRect&&(a.videoContentRect=this.f.getVideoContentRect());this.f.getProgressState&&(a.progressState=this.f.getProgressState());this.f.getPlaylist&&(a.playlist=this.f.getPlaylist());this.f.getPlaylistIndex&&(a.playlistIndex=this.f.getPlaylistIndex());this.f.getStoryboardFormat&&(a.storyboardFormat=this.f.getStoryboardFormat());rj(this,a)};
n.Za=function(a){rj(this,{playbackQuality:a})};
n.ab=function(a){rj(this,{playbackRate:a})};
n.Xa=function(){for(var a=this.f.getOptions(),b={namespaces:a},c=0,d=a.length;c<d;c++){var e=a[c],f=this.f.getOptions(e);b[e]={options:f};for(var g=0,h=f.length;g<h;g++){var k=f[g],l=this.f.getOption(e,k);b[e][k]=l}}this.sendMessage("apiInfoDelivery",b)};
n.eb=function(){rj(this,{muted:this.f.isMuted(),volume:this.f.getVolume()})};
n.cb=function(a){a={currentTime:a,videoBytesLoaded:this.f.getVideoBytesLoaded(),videoLoadedFraction:this.f.getVideoLoadedFraction(),currentTimeLastUpdated_:C()/1E3,playbackRate:this.f.getPlaybackRate(),mediaReferenceTime:this.f.getMediaReferenceTime()};this.f.getProgressState&&(a.progressState=this.f.getProgressState());rj(this,a)};
n.fb=function(){var a={sphericalProperties:this.f.getSphericalProperties()};rj(this,a)};
n.dispose=function(){pj.prototype.dispose.call(this);for(var a=0;a<this.h.length;a++){var b=this.h[a];this.f.removeEventListener(b.eventType,b.listener)}this.h=[]};function tj(a,b,c){M.call(this);this.f=a;this.i=c;this.j=Bf(window,"message",B(this.l,this));this.h=new hj(this,a,b);Tc(this,Ua(Uc,this.h))}
v(tj,M);tj.prototype.l=function(a){var b;if(b=!this.g)if(b=a.origin==this.i)a:{b=this.f;do{b:{var c=a.source;do{if(c==b){c=!0;break b}if(c==c.parent)break;c=c.parent}while(null!=c);c=!1}if(c){b=!0;break a}b=b.opener}while(null!=b);b=!1}if(b&&(b=a.data,"string"===typeof b)){try{b=JSON.parse(b)}catch(d){return}b.command&&(c=this.h,c.g||c.j("command",b.command,b.data,a.origin))}};
tj.prototype.o=function(){Cf(this.j);this.f=null;M.prototype.o.call(this)};function uj(){var a=nb(vj),b;return Yd(new P(function(c,d){a.onSuccess=function(e){Xe(e)?c(e):d(new wj("Request failed, status="+(e&&"status"in e?e.status:-1),"net.badstatus",e))};
a.onError=function(e){d(new wj("Unknown request error","net.unknown",e))};
a.R=function(e){d(new wj("Request timed out","net.timeout",e))};
b=hf("//googleads.g.doubleclick.net/pagead/id",a)}),function(c){c instanceof Zd&&b.abort();
return Wd(c)})}
function wj(a,b){F.call(this,a+", errorCode="+b);this.errorCode=b;this.name="PromiseAjaxError"}
v(wj,F);function xj(){this.g=0;this.f=null}
xj.prototype.then=function(a,b,c){return 1===this.g&&a?(a=a.call(c,this.f),Pd(a)?a:yj(a)):2===this.g&&b?(a=b.call(c,this.f),Pd(a)?a:zj(a)):this};
xj.prototype.getValue=function(){return this.f};
xj.prototype.$goog_Thenable=!0;function zj(a){var b=new xj;a=void 0===a?null:a;b.g=2;b.f=void 0===a?null:a;return b}
function yj(a){var b=new xj;a=void 0===a?null:a;b.g=1;b.f=void 0===a?null:a;return b}
;function Aj(a){F.call(this,a.message||a.description||a.name);this.isMissing=a instanceof Bj;this.isTimeout=a instanceof wj&&"net.timeout"==a.errorCode;this.isCanceled=a instanceof Zd}
v(Aj,F);Aj.prototype.name="BiscottiError";function Bj(){F.call(this,"Biscotti ID is missing from server")}
v(Bj,F);Bj.prototype.name="BiscottiMissingError";var vj={format:"RAW",method:"GET",timeout:5E3,withCredentials:!0},Cj=null;function Ee(){if("1"===hb(Be(),"args","privembed"))return Wd(Error("Biscotti ID is not available in private embed mode"));Cj||(Cj=Yd(uj().then(Dj),function(a){return Ej(2,a)}));
return Cj}
function Dj(a){a=a.responseText;if(0!=a.lastIndexOf(")]}'",0))throw new Bj;a=JSON.parse(a.substr(4));if(1<(a.type||1))throw new Bj;a=a.id;Fe(a);Cj=yj(a);Fj(18E5,2);return a}
function Ej(a,b){var c=new Aj(b);Fe("");Cj=zj(c);0<a&&Fj(12E4,a-1);throw c;}
function Fj(a,b){V(function(){Yd(uj().then(Dj,function(c){return Ej(b,c)}),Ia)},a)}
function Gj(){try{var a=A("yt.ads.biscotti.getId_");return a?a():Ee()}catch(b){return Wd(b)}}
;function Hj(a){if("1"!==hb(Be(),"args","privembed")){a&&De();try{Gj().then(function(){},function(){}),V(Hj,18E5)}catch(b){T(b)}}}
;var Y=A("ytglobal.prefsUserPrefsPrefs_")||{};z("ytglobal.prefsUserPrefsPrefs_",Y,void 0);function Ij(){this.f=S("ALT_PREF_COOKIE_NAME","PREF");var a=Ac.get(""+this.f,void 0);if(a){a=decodeURIComponent(a).split("&");for(var b=0;b<a.length;b++){var c=a[b].split("="),d=c[0];(c=c[1])&&(Y[d]=c.toString())}}}
n=Ij.prototype;n.get=function(a,b){Jj(a);Kj(a);var c=void 0!==Y[a]?Y[a].toString():null;return null!=c?c:b?b:""};
n.set=function(a,b){Jj(a);Kj(a);if(null==b)throw Error("ExpectedNotNull");Y[a]=b.toString()};
n.remove=function(a){Jj(a);Kj(a);delete Y[a]};
n.save=function(){Ag(this.f,this.dump(),63072E3)};
n.clear=function(){for(var a in Y)delete Y[a]};
n.dump=function(){var a=[],b;for(b in Y)a.push(b+"="+encodeURIComponent(String(Y[b])));return a.join("&")};
function Kj(a){if(/^f([1-9][0-9]*)$/.test(a))throw Error("ExpectedRegexMatch: "+a);}
function Jj(a){if(!/^\w+$/.test(a))throw Error("ExpectedRegexMismatch: "+a);}
function Lj(a){a=void 0!==Y[a]?Y[a].toString():null;return null!=a&&/^[A-Fa-f0-9]+$/.test(a)?parseInt(a,16):null}
Ja(Ij);function Mj(a,b){for(var c=[],d=1;d<arguments.length;++d)c[d-1]=arguments[d];if(!Nj(a)||c.some(function(e){return!Nj(e)}))throw Error("Only objects may be merged.");
c=u(c);for(d=c.next();!d.done;d=c.next())Oj(a,d.value);return a}
function Oj(a,b){for(var c in b)if(Nj(b[c])){if(c in a&&!Nj(a[c]))throw Error("Cannot merge an object into a non-object.");c in a||(a[c]={});Oj(a[c],b[c])}else if(Pj(b[c])){if(c in a&&!Pj(a[c]))throw Error("Cannot merge an array into a non-array.");c in a||(a[c]=[]);Qj(a[c],b[c])}else a[c]=b[c];return a}
function Qj(a,b){for(var c=u(b),d=c.next();!d.done;d=c.next())d=d.value,Nj(d)?a.push(Oj({},d)):Pj(d)?a.push(Qj([],d)):a.push(d);return a}
function Nj(a){return"object"===typeof a&&!Array.isArray(a)}
function Pj(a){return"object"===typeof a&&Array.isArray(a)}
;function Rj(a,b){mi.call(this,1,arguments)}
v(Rj,mi);function Sj(a,b){mi.call(this,1,arguments)}
v(Sj,mi);var Tj=new ni("aft-recorded",Rj),Uj=new ni("timing-sent",Sj);var Vj=window;function Wj(){this.timing={};this.clearResourceTimings=function(){};
this.webkitClearResourceTimings=function(){};
this.mozClearResourceTimings=function(){};
this.msClearResourceTimings=function(){};
this.oClearResourceTimings=function(){}}
var Xj=Vj.performance||Vj.mozPerformance||Vj.msPerformance||Vj.webkitPerformance||new Wj;var Yj=!1;B(Xj.clearResourceTimings||Xj.webkitClearResourceTimings||Xj.mozClearResourceTimings||Xj.msClearResourceTimings||Xj.oClearResourceTimings||Ia,Xj);function Zj(a){var b=ak(a);if(b.aft)return b.aft;a=S((a||"")+"TIMING_AFT_KEYS",["ol"]);for(var c=a.length,d=0;d<c;d++){var e=b[a[d]];if(e)return e}return NaN}
function bk(a){var b;(b=A("ytcsi."+(a||"")+"data_"))||(b={tick:{},info:{}},Va("ytcsi."+(a||"")+"data_",b));return b}
function ck(a){a=bk(a);a.info||(a.info={});return a.info}
function ak(a){a=bk(a);a.tick||(a.tick={});return a.tick}
function dk(a){var b=bk(a).nonce;b||(b=Zh(),bk(a).nonce=b);return b}
function ek(a){var b=ak(a||""),c=Zj(a);c&&!Yj&&(si(Tj,new Rj(Math.round(c-b._start),a)),Yj=!0)}
;function fk(){var a=A("ytcsi.debug");a||(a=[],z("ytcsi.debug",a,void 0),z("ytcsi.reference",{},void 0));return a}
function gk(a){a=a||"";var b=A("ytcsi.reference");b||(fk(),b=A("ytcsi.reference"));if(b[a])return b[a];var c=fk(),d={timerName:a,info:{},tick:{},span:{}};c.push(d);return b[a]=d}
;var hk=y.ytLoggingLatencyUsageStats_||{};z("ytLoggingLatencyUsageStats_",hk,void 0);function ik(){this.f=0}
function jk(){ik.f||(ik.f=new ik);return ik.f}
ik.prototype.tick=function(a,b,c){kk(this,"tick_"+a+"_"+b)||sh("latencyActionTicked",{tickName:a,clientActionNonce:b},{timestamp:c})};
ik.prototype.info=function(a,b){var c=Object.keys(a).join("");kk(this,"info_"+c+"_"+b)||(c=Object.assign({},a),c.clientActionNonce=b,sh("latencyActionInfo",c))};
ik.prototype.span=function(a,b){var c=Object.keys(a).join("");kk(this,"span_"+c+"_"+b)||(a.clientActionNonce=b,sh("latencyActionSpan",a))};
function kk(a,b){hk[b]=hk[b]||{count:0};var c=hk[b];c.count++;c.time=W();a.f||(a.f=Gf(function(){var d=W(),e;for(e in hk)hk[e]&&6E4<d-hk[e].time&&delete hk[e];a&&(a.f=0)},5E3));
return 5<c.count?(6===c.count&&1>1E5*Math.random()&&(c=new qh("CSI data exceeded logging limit with key",b.split("_")),0<=b.indexOf("plev")||wh(c)),!0):!1}
;var Z={},lk=(Z.ad_allowed="adTypesAllowed",Z.yt_abt="adBreakType",Z.ad_cpn="adClientPlaybackNonce",Z.ad_docid="adVideoId",Z.yt_ad_an="adNetworks",Z.ad_at="adType",Z.browse_id="browseId",Z.p="httpProtocol",Z.t="transportProtocol",Z.cpn="clientPlaybackNonce",Z.ccs="creatorInfo.creatorCanaryState",Z.cseg="creatorInfo.creatorSegment",Z.csn="clientScreenNonce",Z.docid="videoId",Z.GetHome_rid="requestIds",Z.GetSearch_rid="requestIds",Z.GetPlayer_rid="requestIds",Z.GetWatchNext_rid="requestIds",Z.GetBrowse_rid=
"requestIds",Z.GetLibrary_rid="requestIds",Z.is_continuation="isContinuation",Z.is_nav="isNavigation",Z.b_p="kabukiInfo.browseParams",Z.is_prefetch="kabukiInfo.isPrefetch",Z.is_secondary_nav="kabukiInfo.isSecondaryNav",Z.prev_browse_id="kabukiInfo.prevBrowseId",Z.query_source="kabukiInfo.querySource",Z.voz_type="kabukiInfo.vozType",Z.yt_lt="loadType",Z.mver="creatorInfo.measurementVersion",Z.yt_ad="isMonetized",Z.nr="webInfo.navigationReason",Z.nrsu="navigationRequestedSameUrl",Z.ncnp="webInfo.nonPreloadedNodeCount",
Z.pnt="performanceNavigationTiming",Z.prt="playbackRequiresTap",Z.plt="playerInfo.playbackType",Z.pis="playerInfo.playerInitializedState",Z.paused="playerInfo.isPausedOnLoad",Z.yt_pt="playerType",Z.fmt="playerInfo.itag",Z.yt_pl="watchInfo.isPlaylist",Z.yt_pre="playerInfo.preloadType",Z.yt_ad_pr="prerollAllowed",Z.pa="previousAction",Z.yt_red="isRedSubscriber",Z.rce="mwebInfo.responseContentEncoding",Z.scrh="screenHeight",Z.scrw="screenWidth",Z.st="serverTimeMs",Z.ssdm="shellStartupDurationMs",Z.aq=
"tvInfo.appQuality",Z.br_trs="tvInfo.bedrockTriggerState",Z.kebqat="kabukiInfo.earlyBrowseRequestInfo.abandonmentType",Z.kebqa="kabukiInfo.earlyBrowseRequestInfo.adopted",Z.label="tvInfo.label",Z.is_mdx="tvInfo.isMdx",Z.preloaded="tvInfo.isPreloaded",Z.upg_player_vis="playerInfo.visibilityState",Z.query="unpluggedInfo.query",Z.upg_chip_ids_string="unpluggedInfo.upgChipIdsString",Z.yt_vst="videoStreamType",Z.vph="viewportHeight",Z.vpw="viewportWidth",Z.yt_vis="isVisible",Z.rcl="mwebInfo.responseContentLength",
Z.GetSettings_rid="requestIds",Z.GetTrending_rid="requestIds",Z.GetMusicSearchSuggestions_rid="requestIds",Z.REQUEST_ID="requestIds",Z),mk="isContinuation isNavigation kabukiInfo.earlyBrowseRequestInfo.adopted kabukiInfo.isPrefetch kabukiInfo.isSecondaryNav isMonetized navigationRequestedSameUrl performanceNavigationTiming playerInfo.isPausedOnLoad prerollAllowed isRedSubscriber tvInfo.isMdx tvInfo.isPreloaded isVisible watchInfo.isPlaylist playbackRequiresTap".split(" "),nk={},ok=(nk.ccs="CANARY_STATE_",
nk.mver="MEASUREMENT_VERSION_",nk.pis="PLAYER_INITIALIZED_STATE_",nk.yt_pt="LATENCY_PLAYER_",nk.pa="LATENCY_ACTION_",nk.yt_vst="VIDEO_STREAM_TYPE_",nk),pk="all_vc ap c cver cbrand cmodel cplatform ctheme ei l_an l_mm plid srt yt_fss yt_li vpst vpni2 vpil2 icrc icrt pa GetAccountOverview_rid GetHistory_rid cmt d_vpct d_vpnfi d_vpni nsru pc pfa pfeh pftr pnc prerender psc rc start tcrt tcrc ssr vpr vps yt_abt yt_fn yt_fs yt_pft yt_pre yt_pt yt_pvis ytu_pvis yt_ref yt_sts tds".split(" ");
function qk(a){return!!S("FORCE_CSI_ON_GEL",!1)||U("csi_on_gel")||!!bk(a).useGel}
function rk(a){a=bk(a);if(!("gel"in a))a.gel={gelTicks:{},gelInfos:{}};else if(a.gel){var b=a.gel;b.gelInfos||(b.gelInfos={});b.gelTicks||(b.gelTicks={})}return a.gel}
;function sk(a,b,c){if(null!==b)if(ck(c)[a]=b,qk(c)){var d=b;b=rk(c);if(b.gelInfos)b.gelInfos["info_"+a]=!0;else{var e={};b.gelInfos=(e["info_"+a]=!0,e)}if(a.match("_rid")){var f=a.split("_rid")[0];a="REQUEST_ID"}if(a in lk){b=lk[a];0<=Za(mk,b)&&(d=!!d);a in ok&&"string"===typeof d&&(d=ok[a]+d.toUpperCase());a=d;d=b.split(".");for(var g=e={},h=0;h<d.length-1;h++){var k=d[h];g[k]={};g=g[k]}g[d[d.length-1]]="requestIds"===b?[{id:a,endpoint:f}]:a;f=Mj({},e)}else 0<=Za(pk,a)||wh(new qh("Unknown label logged with GEL CSI",
a)),f=void 0;f&&qk(c)&&(b=gk(c||""),Mj(b.info,f),b=rk(c),"gelInfos"in b||(b.gelInfos={}),Mj(b.gelInfos,f),c=dk(c),jk().info(f,c))}else gk(c||"").info[a]=b}
function tk(a,b,c){var d=ak(c);if(U("use_first_tick")&&uk(a,c))return d[a];if(!b&&"_"!==a[0]){var e=a;Xj.mark&&(0==e.lastIndexOf("mark_",0)||(e="mark_"+e),c&&(e+=" ("+c+")"),Xj.mark(e))}e=b||W();d[a]=e;e=rk(c);e.gelTicks&&(e.gelTicks["tick_"+a]=!0);c||b||W();if(qk(c)){gk(c||"").tick[a]=b||W();e=dk(c);if("_start"===a){var f=jk();kk(f,"baseline_"+e)||sh("latencyActionBaselined",{clientActionNonce:e},{timestamp:b})}else jk().tick(a,e,b);ek(c);e=!0}else e=!1;if(!e){if(!A("yt.timing."+(c||"")+"pingSent_")&&
(f=S((c||"")+"TIMING_ACTION",void 0),e=ak(c),A("ytglobal.timing"+(c||"")+"ready_")&&f&&uk("_start")&&Zj(c)))if(ek(c),c)vk(c);else{f=!0;var g=S("TIMING_WAIT",[]);if(g.length)for(var h=0,k=g.length;h<k;++h)if(!(g[h]in e)){f=!1;break}f&&vk(c)}gk(c||"").tick[a]=b||W()}return d[a]}
function uk(a,b){var c=ak(b);return a in c}
function vk(a){if(!qk(a)){var b=ak(a),c=ck(a),d=b._start,e=S("CSI_SERVICE_NAME","youtube"),f={v:2,s:e,action:S((a||"")+"TIMING_ACTION",void 0)},g=c.srt;void 0!==b.srt&&delete c.srt;b.aft=Zj(a);var h=ak(a),k=h.pbr,l=h.vc;h=h.pbs;k&&l&&h&&k<l&&l<h&&ck(a).yt_pvis&&"youtube"===e&&(sk("yt_lt","hot_bg",a),e=b.vc,k=b.pbs,delete b.aft,c.aft=Math.round(k-e));for(var m in c)"_"!==m.charAt(0)&&(f[m]=c[m]);b.ps=W();m={};e=[];for(var q in b)"_"!==q.charAt(0)&&(k=Math.round(b[q]-d),m[q]=k,e.push(q+"."+k));f.rt=
e.join(",");b=!!c.ap;U("debug_csi_data")&&(c=A("yt.timing.csiData"),c||(c=[],Va("yt.timing.csiData",c)),c.push({page:location.href,time:new Date,args:f}));c="";for(var t in f)f.hasOwnProperty(t)&&(c+="&"+t+"="+f[t]);f="/csi_204?"+c.substring(1);if(window.navigator&&window.navigator.sendBeacon&&b){var p=void 0===p?"":p;tf(f,p)||qf(f,void 0,void 0,void 0,p)}else qf(f);z("yt.timing."+(a||"")+"pingSent_",!0,void 0);si(Uj,new Sj(m.aft+(Number(g)||0),a))}}
if(U("overwrite_polyfill_on_logging_lib_loaded")){var wk=window;wk.ytcsi&&(wk.ytcsi.info=sk,wk.ytcsi.tick=tk)};var xk=null,yk=null,zk=null,Ak={};function Bk(a){var b=a.id;a=a.ve_type;var c=ai++;a=new bi({veType:a,veCounter:c,elementIndex:void 0,dataElement:void 0,youtubeData:void 0});Ak[b]=a;b=hi();c=fi();b&&c&&Ci(b,c,[a])}
function Ck(a){var b=a.csn;a=a.root_ve_type;if(b&&a&&(ki(b,a),a=fi()))for(var c in Ak){var d=Ak[c];d&&Ci(b,a,[d])}}
function Dk(a){Ak[a.id]=new bi({trackingParams:a.tracking_params})}
function Ek(a){var b=hi(),c=Ak[a.id];if(b&&c){a=U("use_default_events_client")?void 0:rh;var d="INTERACTION_LOGGING_GESTURE_TYPE_GENERIC_CLICK";c={csn:b,ve:c.getAsJson(),gestureType:d};d={fa:ji(b),S:b};"UNDEFINED_CSN"==b?Di("visualElementGestured",c,d):a?vg("visualElementGestured",c,a,d):sh("visualElementGestured",c,d)}}
function Fk(a){a=a.ids;var b=hi();if(b)for(var c=0;c<a.length;c++){var d=Ak[a[c]];if(d){var e=b,f=U("use_default_events_client")?void 0:rh;d={csn:e,ve:d.getAsJson(),eventType:1};var g={fa:ji(e),S:e};"UNDEFINED_CSN"==e?Di("visualElementShown",d,g):f?vg("visualElementShown",d,f,g):sh("visualElementShown",d,g)}}}
;z("yt.setConfig",R,void 0);z("yt.config.set",R,void 0);z("yt.setMsg",Bh,void 0);z("yt.msgs.set",Bh,void 0);z("yt.logging.errors.log",zh,void 0);
z("writeEmbed",function(){var a=S("PLAYER_CONFIG",void 0);Hj(!0);"gvn"==a.args.ps&&(document.body.style.backgroundColor="transparent");var b=document.referrer,c=S("POST_MESSAGE_ORIGIN");window!=window.top&&b&&b!=document.URL&&(a.args.loaderUrl=b);S("LIGHTWEIGHT_AUTOPLAY")&&(a.args.autoplay="1");b="player";var d=void 0===d?!0:d;b="string"===typeof b?Ec(b):b;var e=aj+"_"+Oa(b),f=$i[e];f&&d?a&&a.args&&a.args.fflags&&a.args.fflags.includes("web_player_remove_playerproxy=true")?f.api.loadVideoByPlayerVars(a.args||
null):f.loadNewVideoConfig(a):(f=new Li(b,e,a,void 0),$i[e]=f,Xf("player-added",f.api),Tc(f,Ua(bj,f)));a=f.api;xk=a;a.addEventListener("onScreenChanged",Ck);a.addEventListener("onLogClientVeCreated",Bk);a.addEventListener("onLogServerVeCreated",Dk);a.addEventListener("onLogVeClicked",Ek);a.addEventListener("onLogVesShown",Fk);d=S("POST_MESSAGE_ID","player");S("ENABLE_JS_API")?zk=new sj(a):S("ENABLE_POST_API")&&"string"===typeof d&&"string"===typeof c&&(yk=new tj(window.parent,d,c),zk=new nj(a,yk.h));
Rh()},void 0);
z("yt.www.watch.ads.restrictioncookie.spr",function(a){qf(a+"mac_204?action_fcts=1");return!0},void 0);
var Gk=Ie(function(){tk("ol");var a=Ij.getInstance(),b=!!((Lj("f"+(Math.floor(119/31)+1))||0)&67108864),c=1<window.devicePixelRatio;if(document.body&&yd(document.body,"exp-invert-logo"))if(c&&!yd(document.body,"inverted-hdpi")){var d=document.body;if(d.classList)d.classList.add("inverted-hdpi");else if(!yd(d,"inverted-hdpi")){var e=wd(d);xd(d,e+(0<e.length?" inverted-hdpi":"inverted-hdpi"))}}else!c&&yd(document.body,"inverted-hdpi")&&zd();b!=c&&(b="f"+(Math.floor(119/31)+1),d=Lj(b)||0,d=c?d|67108864:
d&-67108865,0==d?delete Y[b]:(c=d.toString(16),Y[b]=c.toString()),a.save())}),Hk=Ie(function(){var a=xk;
a&&a.sendAbandonmentPing&&a.sendAbandonmentPing();S("PL_ATT")&&Vh.dispose();a=0;for(var b=Ph.length;a<b;a++)Kf(Ph[a]);Ph.length=0;Nh("//static.doubleclick.net/instream/ad_status.js");Qh=!1;R("DCLKSTAT",0);Vc(zk,yk);if(a=xk)a.removeEventListener("onScreenChanged",Ck),a.removeEventListener("onLogClientVeCreated",Bk),a.removeEventListener("onLogServerVeCreated",Dk),a.removeEventListener("onLogVeClicked",Ek),a.removeEventListener("onLogVesShown",Fk),a.destroy();Ak={}});
window.addEventListener?(window.addEventListener("load",Gk),window.addEventListener("unload",Hk)):window.attachEvent&&(window.attachEvent("onload",Gk),window.attachEvent("onunload",Hk));Va("yt.abuse.player.botguardInitialized",A("yt.abuse.player.botguardInitialized")||Wh);Va("yt.abuse.player.invokeBotguard",A("yt.abuse.player.invokeBotguard")||Xh);Va("yt.abuse.dclkstatus.checkDclkStatus",A("yt.abuse.dclkstatus.checkDclkStatus")||Sh);
Va("yt.player.exports.navigate",A("yt.player.exports.navigate")||li);Va("yt.util.activity.init",A("yt.util.activity.init")||Mf);Va("yt.util.activity.getTimeSinceActive",A("yt.util.activity.getTimeSinceActive")||Pf);Va("yt.util.activity.setTimestamp",A("yt.util.activity.setTimestamp")||Nf);}).call(this);
