var N=Object.defineProperty;var O=(i,s,t)=>s in i?N(i,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[s]=t;var _=(i,s,t)=>(O(i,typeof s!="symbol"?s+"":s,t),t);import{e as F,r as R,R as A,f as D,O as W,S as w,l as S,m as r,A as C,o as g,x as j,z as o,k as c,aI as I,P as u,aq as P,ar as U,y as E,j as B,V as q,U as G,E as J,aJ as Y,N as K}from"./index-0a551006.js";import{E as Q}from"./el-card-f8cd3d5a.js";import{E as X,a as Z}from"./el-table-column-f2ece5b7.js";import"./el-tag-ffecbc4c.js";import"./el-scrollbar-de5d96ea.js";import{E as ee}from"./el-progress-e62eda90.js";import{E as te}from"./el-switch-3cc7baac.js";/* empty css                        */import{E as ae,f as se}from"./el-button-618b83bc.js";import{E as ne}from"./index-596062af.js";import{b as re}from"./index-20466372.js";class h{constructor(s){_(this,"date");s?this.date=new Date(s):this.date=new Date}toString(){let s=this.date.getMonth()+1,t=this.date.getDate();return s<10&&(s="0"+s),t<10&&(t="0"+t),this.date.getFullYear()+"-"+s+"-"+t}goToDaysLater(s){this.date.setDate(this.date.getDate()+s)}goToFirstDayOfThisWeek(){this.goToDaysLater(-(this.date.getDay()-1))}}class oe{constructor(){_(this,"start_day","");_(this,"end_day","");_(this,"today","");_(this,"week_titles",["星期一","星期二","星期三","星期四","星期五","星期六","星期日"]);_(this,"data",[])}}const le={class:"card-header"},ce={key:0},ie=F({__name:"Habbit",setup(i){const s=R(!1);var t=A(new oe);const y=D(()=>{for(var a=[],e=new h(t.start_day),n=0;n<7;n++)a.push(e.toString()),e.goToDaysLater(1);return a}),b=a=>{if(a==0){var e=new h;e.goToFirstDayOfThisWeek()}else{var e=new h(t.start_day);e.goToDaysLater(a>0?7:-7)}e.toString()!=t.start_day&&(t.start_day=e.toString(),e.goToDaysLater(6),t.end_day=e.toString(),T())},T=()=>(w.getHabbitRecordByDateRange(t.start_day,t.end_day).then(a=>(t.data.forEach(e=>{e.checks=[!1,!1,!1,!1,!1,!1,!1];for(var n=0;n<e.checks.length;n++)e.checks[n]=a.data.results.some(d=>d.habbit==e.id&&y.value[n]==d.date)}),!0)).catch(a=>!1),!0),f=D(()=>a=>{var e=0;return a.checks.forEach(n=>e+=n?1:0),{percentage:Math.min(100,Math.round(e*100/a.times_per_week)),status:e<a.times_per_week?"warning":"success",text:`${e}/${a.times_per_week}`}});W(()=>{s.value=!1;var a=new h;t.today=a.toString(),a.goToFirstDayOfThisWeek(),t.start_day=a.toString(),a.goToDaysLater(6),t.end_day=a.toString(),w.getHabbits().then(e=>{t.data=e.data.results,t.data.forEach(n=>n.checks=[!1,!1,!1,!1,!1,!1,!1])}).catch(e=>{}),T(),s.value=!0});const H=async(a,e)=>{var n=!1;await re.confirm(`【${a.name}】`+(a.checks[e]?"确定打卡吗？":"确定取消打卡吗？"),"请确认",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(async()=>{await w.postHabbitRecord(a.id,y.value[e],a.checks[e]).then(d=>n=!0).catch(d=>n=!1)}).catch(d=>n=!1),n||(a.checks[e]=!a.checks[e])};return(a,e)=>{const n=J,d=ne,k=ae,V=se,m=X,L=te,z=ee,$=Z,M=Q;return s.value?(g(),S(M,{key:0},{header:r(()=>[j("div",le,[o(d,{effect:"dark",type:"success"},{default:r(()=>[o(n,null,{default:r(()=>[o(c(I))]),_:1}),u("【小习惯，大成就】")]),_:1}),o(V,null,{default:r(()=>[o(k,{type:"success",icon:c(P),size:"small",onClick:e[0]||(e[0]=l=>b(-1))},{default:r(()=>[u("上周")]),_:1},8,["icon"]),o(k,{type:"success",size:"small",onClick:e[1]||(e[1]=l=>b(0))},{default:r(()=>[u("今天")]),_:1}),o(k,{type:"success",size:"small",onClick:e[2]||(e[2]=l=>b(1))},{default:r(()=>[u("下周"),o(n,{class:"el-icon--right"},{default:r(()=>[o(c(U))]),_:1})]),_:1})]),_:1})])]),default:r(()=>[o($,{data:c(t).data,border:"",style:{width:"100%","font-size":"12px"},"table-layout":"auto",stripe:"","row-style":{height:"0px"},"cell-style":{padding:"0px"},"header-cell-style":{padding:"0px"}},{default:r(()=>[o(m,{label:"名称",fixed:"",align:"center"},{default:r(l=>[u(E(l.row.name),1),l.row.description.length>0?(g(),B("span",ce,"("+E(l.row.description)+")",1)):C("",!0)]),_:1}),(g(!0),B(G,null,q(c(y),(l,p)=>(g(),S(m,{align:"center",label:l.substring(5)},{default:r(()=>[o(m,{align:"center",label:c(t).week_titles[p],"class-name":l==c(t).today?"bg-gray":"default_cell"},{default:r(v=>[o(L,{size:"small",style:{"--el-switch-on-color":"#13ce66"},modelValue:v.row.checks[p],"onUpdate:modelValue":x=>v.row.checks[p]=x,"inline-prompt":"","active-icon":c(Y),onChange:x=>H(v.row,p)},null,8,["modelValue","onUpdate:modelValue","active-icon","onChange"])]),_:2},1032,["label","class-name"])]),_:2},1032,["label"]))),256)),o(m,{label:"进度",align:"center"},{default:r(l=>[o(z,{percentage:c(f)(l.row).percentage,status:c(f)(l.row).status},{default:r(()=>[o(d,{round:"",type:c(f)(l.row).status},{default:r(()=>[u(E(c(f)(l.row).text),1)]),_:2},1032,["type"])]),_:2},1032,["percentage","status"])]),_:1})]),_:1},8,["data"])]),_:1})):C("",!0)}}});const de=K(ie,[["__scopeId","data-v-fcdb8a01"]]),Ee=Object.freeze(Object.defineProperty({__proto__:null,default:de},Symbol.toStringTag,{value:"Module"}));export{h as A,de as H,Ee as a};
