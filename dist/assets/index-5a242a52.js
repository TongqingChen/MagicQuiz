import{c as e,bE as o,H as u}from"./index-d1ec9bbb.js";const i=["class","style"],E=/^on[A-Z]/,f=(c={})=>{const{excludeListeners:a=!1,excludeKeys:t}=c,l=e(()=>((t==null?void 0:t.value)||[]).concat(i)),s=u();return s?e(()=>{var n;return o(Object.entries((n=s.proxy)==null?void 0:n.$attrs).filter(([r])=>!l.value.includes(r)&&!(a&&E.test(r))))}):e(()=>({}))};export{f as u};
