import{g as t,j as o,c as a,n as s}from"../nitro/nitro.mjs";import"node:buffer";import"node:process";import"node:events";import"node:async_hooks";import"node:path";import"node:stream";var i=function e(t){function r(t,o,a){var s,i={};if(Array.isArray(t))return t.concat(o);for(s in t)i[a?s.toLowerCase():s]=t[s];for(s in o){var p=a?s.toLowerCase():s,u=o[s];i[p]=p in i&&"object"==typeof u?r(i[p],u,"headers"==p):u}return i}function n(o,a,s,i,p){var u="string"!=typeof o?(a=o).url:o,d={config:a},f=r(t,a),h={};i=i||f.data,(f.transformRequest||[]).map((function(t){i=t(i,f.headers)||i})),f.auth&&(h.authorization=f.auth),i&&"object"==typeof i&&"function"!=typeof i.append&&"function"!=typeof i.text&&(i=JSON.stringify(i),h["content-type"]="application/json");try{h[f.xsrfHeaderName]=decodeURIComponent(document.cookie.match(RegExp("(^|; )"+f.xsrfCookieName+"=([^;]*)"))[2])}catch(o){}return f.baseURL&&(u=u.replace(/^(?!.*\/\/)\/?/,f.baseURL+"/")),f.params&&(u+=(~u.indexOf("?")?"&":"?")+(f.paramsSerializer?f.paramsSerializer(f.params):new URLSearchParams(f.params))),(f.fetch||fetch)(u,{method:(s||f.method||"get").toUpperCase(),body:i,headers:r(f.headers,h,!0),credentials:f.withCredentials?"include":p}).then((function(t){for(var o in t)"function"!=typeof t[o]&&(d[o]=t[o]);return"stream"==f.responseType?(d.data=t.body,d):t[f.responseType||"text"]().then((function(t){d.data=t,d.data=JSON.parse(t)})).catch(Object).then((function(){return(f.validateStatus?f.validateStatus(t.status):t.ok)?d:Promise.reject(d)}))}))}return t=t||{},n.request=n,n.get=function(t,o){return n(t,o,"get")},n.delete=function(t,o){return n(t,o,"delete")},n.head=function(t,o){return n(t,o,"head")},n.options=function(t,o){return n(t,o,"options")},n.post=function(t,o,a){return n(t,a,"post",o)},n.put=function(t,o,a){return n(t,a,"put",o)},n.patch=function(t,o,a){return n(t,a,"patch",o)},n.all=Promise.all.bind(Promise),n.spread=function(t){return t.apply.bind(t,t)},n.CancelToken="function"==typeof AbortController?AbortController:Object,n.defaults=t,n.create=e,n}();const p=t(i);const c=(t,a,s)=>{o(s);const i=`/${function(t){return t.replace(/^\/|\/$/g,"")}(a)}/${t}`;return Object.assign(s,{url:i,functionId:t})},u=c("src_services_courses_service_ts--fetchCourses_createServerFn_handler","/_server",((t,o)=>f.__executeServer(t,o))),d=c("src_services_courses_service_ts--fetchPost_createServerFn_handler","/_server",((t,o)=>h.__executeServer(t,o))),f=a({method:"GET"}).handler(u,(async()=>(console.info("Fetching posts..."),p.get("https://jsonplaceholder.typicode.com/posts").then((t=>t.data.slice(0,10)))))),h=a({method:"GET"}).validator((t=>t)).handler(d,(async({data:t})=>(console.info(`Fetching post with id ${t}...`),await p.get(`https://jsonplaceholder.typicode.com/posts/${t}`).then((t=>t.data)).catch((t=>{throw console.error(t),404===t.status?s():t})))));export{u as fetchCourses_createServerFn_handler,d as fetchPost_createServerFn_handler};
//# sourceMappingURL=courses.service-BM-mx28V.mjs.map
