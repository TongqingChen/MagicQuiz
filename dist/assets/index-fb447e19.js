import{b as _,d as y,e as T,w as V,q as I,u as re,f as d,a as E,o as p,j as x,z as L,m as k,H as q,x as M,s as m,k as o,y as G,L as Z,T as Q,_ as J,t as le,c as ie,ak as ue,a7 as K,bG as ce,r as z,b0 as j,O as de,aD as pe,a3 as me,l as h,n as fe,A as S,E as A,p as ge,U as ye,a2 as ve,b1 as be,aH as Ce,aa as he,g as R,bz as W,i as O,bA as U,a$ as Te,bH as Ne}from"./index-0a551006.js";import{x as Se,Q as ke,F as we}from"./el-button-618b83bc.js";const Be=_({a11y:{type:Boolean,default:!0},locale:{type:y(Object)},size:Se,button:{type:y(Object)},experimentalFeatures:{type:y(Object)},keyboardNavigation:{type:Boolean,default:!0},message:{type:y(Object)},zIndex:Number,namespace:{type:String,default:"el"}}),$={};T({name:"ElConfigProvider",props:Be,setup(s,{slots:t}){V(()=>s.message,n=>{Object.assign($,n??{})},{immediate:!0,deep:!0});const e=ke(s);return()=>I(t,"default",{config:e==null?void 0:e.value})}});const ze=_({value:{type:[String,Number],default:""},max:{type:Number,default:99},isDot:Boolean,hidden:Boolean,type:{type:String,values:["primary","success","warning","info","danger"],default:"danger"}}),Ee=["textContent"],xe=T({name:"ElBadge"}),Me=T({...xe,props:ze,setup(s,{expose:t}){const e=s,n=re("badge"),a=d(()=>e.isDot?"":E(e.value)&&E(e.max)?e.max<e.value?`${e.max}+`:`${e.value}`:`${e.value}`);return t({content:a}),(l,u)=>(p(),x("div",{class:m(o(n).b())},[I(l.$slots,"default"),L(Q,{name:`${o(n).namespace.value}-zoom-in-center`,persisted:""},{default:k(()=>[q(M("sup",{class:m([o(n).e("content"),o(n).em("content",l.type),o(n).is("fixed",!!l.$slots.default),o(n).is("dot",l.isDot)]),textContent:G(o(a))},null,10,Ee),[[Z,!l.hidden&&(o(a)||l.isDot)]])]),_:1},8,["name"])],2))}});var Oe=J(Me,[["__file","/home/runner/work/element-plus/element-plus/packages/components/badge/src/badge.vue"]]);const $e=le(Oe),X=["success","info","warning","error"],i=ue({customClass:"",center:!1,dangerouslyUseHTMLString:!1,duration:3e3,icon:void 0,id:"",message:"",onClose:void 0,showClose:!1,type:"info",offset:16,zIndex:0,grouping:!1,repeatNum:1,appendTo:K?document.body:void 0}),_e=_({customClass:{type:String,default:i.customClass},center:{type:Boolean,default:i.center},dangerouslyUseHTMLString:{type:Boolean,default:i.dangerouslyUseHTMLString},duration:{type:Number,default:i.duration},icon:{type:ie,default:i.icon},id:{type:String,default:i.id},message:{type:y([String,Object,Function]),default:i.message},onClose:{type:y(Function),required:!1},showClose:{type:Boolean,default:i.showClose},type:{type:String,values:X,default:i.type},offset:{type:Number,default:i.offset},zIndex:{type:Number,default:i.zIndex},grouping:{type:Boolean,default:i.grouping},repeatNum:{type:Number,default:i.repeatNum}}),Ie={destroy:()=>!0},c=ce([]),Le=s=>{const t=c.findIndex(a=>a.id===s),e=c[t];let n;return t>0&&(n=c[t-1]),{current:e,prev:n}},De=s=>{const{prev:t}=Le(s);return t?t.vm.exposed.bottom.value:0},He=(s,t)=>c.findIndex(n=>n.id===s)>0?20:t,Pe=["id"],Fe=["innerHTML"],je=T({name:"ElMessage"}),Ae=T({...je,props:_e,emits:Ie,setup(s,{expose:t}){const e=s,{Close:n}=be,{ns:a,zIndex:l}=we("message"),{currentZIndex:u,nextZIndex:f}=l,g=z(),b=z(!1),C=z(0);let w;const ee=d(()=>e.type?e.type==="error"?"danger":e.type:"info"),se=d(()=>{const r=e.type;return{[a.bm("icon",r)]:r&&j[r]}}),D=d(()=>e.icon||j[e.type]||""),te=d(()=>De(e.id)),H=d(()=>He(e.id,e.offset)+te.value),ne=d(()=>C.value+H.value),oe=d(()=>({top:`${H.value}px`,zIndex:u.value}));function B(){e.duration!==0&&({stop:w}=Ce(()=>{N()},e.duration))}function P(){w==null||w()}function N(){b.value=!1}function ae({code:r}){r===he.esc&&N()}return de(()=>{B(),f(),b.value=!0}),V(()=>e.repeatNum,()=>{P(),B()}),pe(document,"keydown",ae),me(g,()=>{C.value=g.value.getBoundingClientRect().height}),t({visible:b,bottom:ne,close:N}),(r,F)=>(p(),h(Q,{name:o(a).b("fade"),onBeforeLeave:r.onClose,onAfterLeave:F[0]||(F[0]=Ze=>r.$emit("destroy")),persisted:""},{default:k(()=>[q(M("div",{id:r.id,ref_key:"messageRef",ref:g,class:m([o(a).b(),{[o(a).m(r.type)]:r.type&&!r.icon},o(a).is("center",r.center),o(a).is("closable",r.showClose),r.customClass]),style:fe(o(oe)),role:"alert",onMouseenter:P,onMouseleave:B},[r.repeatNum>1?(p(),h(o($e),{key:0,value:r.repeatNum,type:o(ee),class:m(o(a).e("badge"))},null,8,["value","type","class"])):S("v-if",!0),o(D)?(p(),h(o(A),{key:1,class:m([o(a).e("icon"),o(se)])},{default:k(()=>[(p(),h(ge(o(D))))]),_:1},8,["class"])):S("v-if",!0),I(r.$slots,"default",{},()=>[r.dangerouslyUseHTMLString?(p(),x(ye,{key:1},[S(" Caution here, message could've been compromised, never use user's input as message "),M("p",{class:m(o(a).e("content")),innerHTML:r.message},null,10,Fe)],2112)):(p(),x("p",{key:0,class:m(o(a).e("content"))},G(r.message),3))]),r.showClose?(p(),h(o(A),{key:2,class:m(o(a).e("closeBtn")),onClick:ve(N,["stop"])},{default:k(()=>[L(o(n))]),_:1},8,["class","onClick"])):S("v-if",!0)],46,Pe),[[Z,b.value]])]),_:3},8,["name","onBeforeLeave"]))}});var Re=J(Ae,[["__file","/home/runner/work/element-plus/element-plus/packages/components/message/src/message.vue"]]);let Ue=1;const Y=s=>{const t=!s||R(s)||W(s)||O(s)?{message:s}:s,e={...i,...t};if(!e.appendTo)e.appendTo=document.body;else if(R(e.appendTo)){let n=document.querySelector(e.appendTo);Te(n)||(n=document.body),e.appendTo=n}return e},Ve=s=>{const t=c.indexOf(s);if(t===-1)return;c.splice(t,1);const{handler:e}=s;e.close()},qe=({appendTo:s,...t},e)=>{const n=`message_${Ue++}`,a=t.onClose,l=document.createElement("div"),u={...t,id:n,onClose:()=>{a==null||a(),Ve(C)},onDestroy:()=>{U(null,l)}},f=L(Re,u,O(u.message)||W(u.message)?{default:O(u.message)?u.message:()=>u.message}:null);f.appContext=e||v._context,U(f,l),s.appendChild(l.firstElementChild);const g=f.component,C={id:n,vnode:f,vm:g,handler:{close:()=>{g.exposed.visible.value=!1}},props:f.component.props};return C},v=(s={},t)=>{if(!K)return{close:()=>{}};if(E($.max)&&c.length>=$.max)return{close:()=>{}};const e=Y(s);if(e.grouping&&c.length){const a=c.find(({vnode:l})=>{var u;return((u=l.props)==null?void 0:u.message)===e.message});if(a)return a.props.repeatNum+=1,a.props.type=e.type,a.handler}const n=qe(e,t);return c.push(n),n.handler};X.forEach(s=>{v[s]=(t={},e)=>{const n=Y(t);return v({...n,type:s},e)}});function Ge(s){for(const t of c)(!s||s===t.props.type)&&t.handler.close()}v.closeAll=Ge;v._context=null;const Ke=Ne(v,"$message");export{Ke as E};
