import{r as e,a as s,u as t,q as n}from"../nitro/nitro.mjs";import"node:buffer";import"node:process";import"node:events";import"node:async_hooks";import"node:path";import"node:stream";function a(){const e=t(n({queryKey:["deferred"],queryFn:async()=>(await new Promise((e=>setTimeout(e,3e3))),{message:"Hello deferred from the server!",status:"success",time:new Date})}));return s.jsxs("div",{children:[s.jsx("h1",{children:"Deferred Query"}),s.jsxs("div",{children:["Status: ",e.data.status]}),s.jsxs("div",{children:["Message: ",e.data.message]}),s.jsxs("div",{children:["Time: ",e.data.time.toISOString()]})]})}const h=function(){const[t,n]=e.useState(0);return s.jsxs("div",{className:"p-2",children:[s.jsx(e.Suspense,{fallback:"Loading Middleman...",children:s.jsx(a,{})}),s.jsxs("div",{children:["Count: ",t]}),s.jsx("div",{children:s.jsx("button",{onClick:()=>n(t+1),children:"Increment"})})]})};export{h as component};
//# sourceMappingURL=deferred-DurPtXfH.mjs.map
