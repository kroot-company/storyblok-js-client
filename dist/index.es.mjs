/*!
 * storyblok-js-client v0.0.0-development
 * Universal JavaScript SDK for Storyblok's API
 * (c) 2020-2021 Stobylok Team
 */
import*as t from"qs";import e from"axios";function r(t){return"number"==typeof t&&(t==t&&t!==1/0&&t!==-1/0)}function s(t,e,s){if(!r(e))throw new TypeError("Expected `limit` to be a finite number");if(!r(s))throw new TypeError("Expected `interval` to be a finite number");var n=[],a=[],i=0,o=function(){i++;var e=setTimeout((function(){i--,n.length>0&&o(),a=a.filter((function(t){return t!==e}))}),s);a.indexOf(e)<0&&a.push(e);var r=n.shift();r.resolve(t.apply(r.self,r.args))},c=function(){var t=arguments,r=this;return new Promise((function(s,a){n.push({resolve:s,reject:a,args:t,self:r}),i<e&&o()}))};return c.abort=function(){a.forEach(clearTimeout),a=[],n.forEach((function(t){t.reject(new throttle.AbortError)})),n.length=0},c}s.AbortError=function(){Error.call(this,"Throttled function aborted"),this.name="AbortError"};const n=function(t,e){if(!t)return null;let r={};for(let s in t){let n=t[s];e.indexOf(s)>-1&&null!==n&&(r[s]=n)}return r};var a={nodes:{horizontal_rule:t=>({singleTag:"hr"}),blockquote:t=>({tag:"blockquote"}),bullet_list:t=>({tag:"ul"}),code_block:t=>({tag:["pre",{tag:"code",attrs:t.attrs}]}),hard_break:t=>({singleTag:"br"}),heading:t=>({tag:"h"+t.attrs.level}),image:t=>({singleTag:[{tag:"img",attrs:n(t.attrs,["src","alt","title"])}]}),list_item:t=>({tag:"li"}),ordered_list:t=>({tag:"ol"}),paragraph:t=>({tag:"p"})},marks:{bold:()=>({tag:"b"}),strike:()=>({tag:"strike"}),underline:()=>({tag:"u"}),strong:()=>({tag:"strong"}),code:()=>({tag:"code"}),italic:()=>({tag:"i"}),link(t){const e={...t.attrs},{linktype:r="url"}=t.attrs;return"email"===r&&(e.href="mailto:"+e.href),e.anchor&&(e.href=`${e.href}#${e.anchor}`,delete e.anchor),{tag:[{tag:"a",attrs:e}]}},styled:t=>({tag:[{tag:"span",attrs:t.attrs}]})}};class i{constructor(t){t||(t=a),this.marks=t.marks||[],this.nodes=t.nodes||[]}addNode(t,e){this.nodes[t]=e}addMark(t,e){this.marks[t]=e}render(t={}){if(t.content&&Array.isArray(t.content)){let e="";return t.content.forEach(t=>{e+=this.renderNode(t)}),e}return console.warn("The render method must receive an object with a content field, which is an array"),""}renderNode(t){let e=[];t.marks&&t.marks.forEach(t=>{const r=this.getMatchingMark(t);r&&e.push(this.renderOpeningTag(r.tag))});const r=this.getMatchingNode(t);return r&&r.tag&&e.push(this.renderOpeningTag(r.tag)),t.content?t.content.forEach(t=>{e.push(this.renderNode(t))}):t.text?e.push(function(t){const e={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},r=/[&<>"']/g,s=RegExp(r.source);return t&&s.test(t)?t.replace(r,t=>e[t]):t}(t.text)):r&&r.singleTag?e.push(this.renderTag(r.singleTag," /")):r&&r.html&&e.push(r.html),r&&r.tag&&e.push(this.renderClosingTag(r.tag)),t.marks&&t.marks.slice(0).reverse().forEach(t=>{const r=this.getMatchingMark(t);r&&e.push(this.renderClosingTag(r.tag))}),e.join("")}renderTag(t,e){if(t.constructor===String)return`<${t}${e}>`;return t.map(t=>{if(t.constructor===String)return`<${t}${e}>`;{let r="<"+t.tag;if(t.attrs)for(let e in t.attrs){let s=t.attrs[e];null!==s&&(r+=` ${e}="${s}"`)}return`${r}${e}>`}}).join("")}renderOpeningTag(t){return this.renderTag(t,"")}renderClosingTag(t){if(t.constructor===String)return`</${t}>`;return t.slice(0).reverse().map(t=>t.constructor===String?`</${t}>`:`</${t.tag}>`).join("")}getMatchingNode(t){if("function"==typeof this.nodes[t.type])return this.nodes[t.type](t)}getMatchingMark(t){if("function"==typeof this.marks[t.type])return this.marks[t.type](t)}}const o=(t=0,e=t)=>{const r=Math.abs(e-t)||0,s=t<e?1:-1;return((t=0,e)=>[...Array(t)].map(e))(r,(e,r)=>r*s+t)},{stringify:c}=t;let h={};export default class{constructor(t,r){if(!r){let e=t.region?"-"+t.region:"";r=`${!1===t.https?"http":"https"}://api${e}.storyblok.com/v1`}let n=Object.assign({},t.headers),a=5;void 0!==t.oauthToken&&(n.Authorization=t.oauthToken,a=3),void 0!==t.rateLimit&&(a=t.rateLimit),this.richTextResolver=new i(t.richTextSchema),"function"==typeof t.componentResolver&&this.setComponentResolver(t.componentResolver),this.maxRetries=t.maxRetries||5,this.throttle=s(this.throttledRequest,a,1e3),this.cacheVersion=this.cacheVersion||this.newVersion(),this.accessToken=t.accessToken,this.cache=t.cache||{clear:"manual"},this.client=e.create({baseURL:r,timeout:t.timeout||0,headers:n,proxy:t.proxy||!1}),t.responseInterceptor&&this.client.interceptors.response.use(e=>t.responseInterceptor(e))}setComponentResolver(t){this.richTextResolver.addNode("blok",e=>{let r="";return e.attrs.body.forEach(e=>{r+=t(e.component,e)}),{html:r}})}parseParams(t={}){return t.version||(t.version="published"),t.cv||(t.cv=this.cacheVersion),t.token||(t.token=this.getToken()),t}factoryParamOptions(t,e={}){return((t="")=>t.indexOf("/cdn/")>-1)(t)?this.parseParams(e):e}makeRequest(t,e,r,s){const n=this.factoryParamOptions(t,((t={},e=25,r=1)=>({...t,per_page:e,page:r}))(e,r,s));return this.cacheResponse(t,n)}get(t,e){let r="/"+t;const s=this.factoryParamOptions(r,e);return this.cacheResponse(r,s)}async getAll(t,e={},r){const s=e.per_page||25,n="/"+t,a=n.split("/");r=r||a[a.length-1];const i=await this.makeRequest(n,e,s,1),c=Math.ceil(i.total/s);return((t=[],e)=>t.map(e).reduce((t,e)=>[...t,...e],[]))([i,...await(async(t=[],e)=>Promise.all(t.map(e)))(o(1,c),async t=>this.makeRequest(n,e,s,t+1))],t=>Object.values(t.data[r]))}post(t,e){let r="/"+t;return this.throttle("post",r,e)}put(t,e){let r="/"+t;return this.throttle("put",r,e)}delete(t,e){let r="/"+t;return this.throttle("delete",r,e)}getStories(t){return this.get("cdn/stories",t)}getStory(t,e){return this.get("cdn/stories/"+t,e)}setToken(t){this.accessToken=t}getToken(){return this.accessToken}cacheResponse(t,e,r){return void 0===r&&(r=0),new Promise(async(s,n)=>{let a=c({url:t,params:e},{arrayFormat:"brackets"}),i=this.cacheProvider();if("auto"===this.cache.clear&&"draft"===e.version&&await this.flushCache(),"published"===e.version&&"/cdn/spaces/me"!=t){const t=await i.get(a);if(t)return s(t)}try{let r=await this.throttle("get",t,{params:e,paramsSerializer:t=>c(t,{arrayFormat:"brackets"})}),o={data:r.data,headers:r.headers};if(r.headers["per-page"]&&(o=Object.assign({},o,{perPage:parseInt(r.headers["per-page"]),total:parseInt(r.headers.total)})),200!=r.status)return n(r);"published"===e.version&&"/cdn/spaces/me"!=t&&i.set(a,o),s(o)}catch(a){if(a.response&&429===a.response.status&&(r+=1)<this.maxRetries)return console.log(`Hit rate limit. Retrying in ${r} seconds.`),await(o=1e3*r,new Promise(t=>setTimeout(t,o))),this.cacheResponse(t,e,r).then(s).catch(n);n(a)}var o})}throttledRequest(t,e,r){return this.client[t](e,r)}newVersion(){return(new Date).getTime()}cacheProvider(){switch(this.cache.type){case"memory":return{get:t=>h[t],getAll:()=>h,set(t,e){h[t]=e},flush(){h={}}};default:return this.cacheVersion=this.newVersion(),{get(){},getAll(){},set(){},flush(){}}}}async flushCache(){return this.cacheVersion=this.newVersion(),await this.cacheProvider().flush(),this}}
