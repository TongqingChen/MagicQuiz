var Ae=Object.defineProperty;var Ne=(e,n,o)=>n in e?Ae(e,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[n]=o;var d=(e,n,o)=>(Ne(e,typeof n!="symbol"?n+"":n,o),o);import{C as he,aj as De,z as Ee,bh as ue,aA as we,aD as ze,u as ke,ar as Pe,i as Me,aL as de,y as H,aO as Ve,aK as Re,bk as He,aM as Fe,bl as _,bm as ce,W as R,a5 as Ue,b as Ke,j as fe,d as le,D as w,bn as ee,r as se,an as Ye,bo as je,O as Ge,b5 as We,c as $,x as A,U as Be,b4 as me,bj as ve,V as Xe,_ as qe,ad as N,o as v,a as h,w as g,X as ne,v as b,n as m,f as pe,N as X,m as Z,g as q,s as S,t as D,af as J,q as te,Y as oe,T as Je,a6 as Ie,b7 as Se,b8 as Te,aC as ge,a4 as Ze,ax as Qe,k as be,aS as ye,aJ as xe}from"./index-d9119af0.js";import{E as _e,B as en}from"./el-button-86d0f62c.js";import{E as nn}from"./index-8120f1da.js";import{a as tn,i as on}from"./validator-dd6bb28f.js";const sn=(e,n,o)=>{let s={offsetX:0,offsetY:0};const r=i=>{const f=i.clientX,t=i.clientY,{offsetX:p,offsetY:k}=s,u=e.value.getBoundingClientRect(),U=u.left,K=u.top,y=u.width,Y=u.height,M=document.documentElement.clientWidth,O=document.documentElement.clientHeight,j=-U+p,Q=-K+k,x=M-U-y+p,B=O-K-Y+k,P=W=>{const I=Math.min(Math.max(p+W.clientX-f,j),x),V=Math.min(Math.max(k+W.clientY-t,Q),B);s={offsetX:I,offsetY:V},e.value.style.transform=`translate(${ue(I)}, ${ue(V)})`},G=()=>{document.removeEventListener("mousemove",P),document.removeEventListener("mouseup",G)};document.addEventListener("mousemove",P),document.addEventListener("mouseup",G)},a=()=>{n.value&&e.value&&n.value.addEventListener("mousedown",r)},l=()=>{n.value&&e.value&&n.value.removeEventListener("mousedown",r)};he(()=>{De(()=>{o.value?a():l()})}),Ee(()=>{l()})},an=(e,n={})=>{we(e)||ze("[useLockscreen]","You need to pass a ref param to this function");const o=n.ns||ke("popup"),s=Pe(()=>o.bm("parent","hidden"));if(!Me||de(document.body,s.value))return;let r=0,a=!1,l="0";const i=()=>{setTimeout(()=>{Fe(document==null?void 0:document.body,s.value),a&&document&&(document.body.style.width=l)},200)};H(e,f=>{if(!f){i();return}a=!de(document.body,s.value),a&&(l=document.body.style.width),r=tn(o.namespace.value);const t=document.documentElement.clientHeight<document.body.scrollHeight,p=Ve(document.body,"overflowY");r>0&&(t||p==="scroll")&&a&&(document.body.style.width=`calc(100% - ${r}px)`),Re(document.body,s.value)}),He(()=>i())},ln=(e,n)=>{let o;H(()=>e.value,s=>{var r,a;s?(o=document.activeElement,we(n)&&((a=(r=n.value).focus)==null||a.call(r))):o.focus()})},Oe=e=>{if(!e)return{onClick:_,onMousedown:_,onMouseup:_};let n=!1,o=!1;return{onClick:l=>{n&&o&&e(l),n=o=!1},onMousedown:l=>{n=l.target===l.currentTarget},onMouseup:l=>{o=l.target===l.currentTarget}}},ae="_trap-focus-children",T=[],Ce=e=>{if(T.length===0)return;const n=T[T.length-1][ae];if(n.length>0&&e.code===Ue.tab){if(n.length===1){e.preventDefault(),document.activeElement!==n[0]&&n[0].focus();return}const o=e.shiftKey,s=e.target===n[0],r=e.target===n[n.length-1];s&&o&&(e.preventDefault(),n[n.length-1].focus()),r&&!o&&(e.preventDefault(),n[0].focus())}},rn={beforeMount(e){e[ae]=ce(e),T.push(e),T.length<=1&&document.addEventListener("keydown",Ce)},updated(e){R(()=>{e[ae]=ce(e)})},unmounted(){T.shift(),T.length===0&&document.removeEventListener("keydown",Ce)}},un=Ke({mask:{type:Boolean,default:!0},customMaskEvent:{type:Boolean,default:!1},overlayClass:{type:fe([String,Array,Object])},zIndex:{type:fe([String,Number])}}),dn={click:e=>e instanceof MouseEvent},cn="overlay";var fn=le({name:"ElOverlay",props:un,emits:dn,setup(e,{slots:n,emit:o}){const s=ke(cn),r=f=>{o("click",f)},{onClick:a,onMousedown:l,onMouseup:i}=Oe(e.customMaskEvent?void 0:r);return()=>e.mask?w("div",{class:[s.b(),e.overlayClass],style:{zIndex:e.zIndex},onClick:a,onMousedown:l,onMouseup:i},[se(n,"default")],ee.STYLE|ee.CLASS|ee.PROPS,["onClick","onMouseup","onMousedown"]):Ye("div",{class:e.overlayClass,style:{zIndex:e.zIndex,position:"fixed",top:"0px",right:"0px",bottom:"0px",left:"0px"}},[se(n,"default")])}});const mn=fn,vn=le({name:"ElMessageBox",directives:{TrapFocus:rn},components:{ElButton:_e,ElFocusTrap:je,ElInput:nn,ElOverlay:mn,ElIcon:Ge,...We},inheritAttrs:!1,props:{buttonSize:{type:String,validator:on},modal:{type:Boolean,default:!0},lockScroll:{type:Boolean,default:!0},showClose:{type:Boolean,default:!0},closeOnClickModal:{type:Boolean,default:!0},closeOnPressEscape:{type:Boolean,default:!0},closeOnHashChange:{type:Boolean,default:!0},center:Boolean,draggable:Boolean,roundButton:{default:!1,type:Boolean},container:{type:String,default:"body"},boxType:{type:String,default:""}},emits:["vanish","action"],setup(e,{emit:n}){const{locale:o,zIndex:s,ns:r,size:a}=en("message-box",$(()=>e.buttonSize)),{t:l}=o,{nextZIndex:i}=s,f=A(!1),t=Be({autofocus:!0,beforeClose:null,callback:null,cancelButtonText:"",cancelButtonClass:"",confirmButtonText:"",confirmButtonClass:"",customClass:"",customStyle:{},dangerouslyUseHTMLString:!1,distinguishCancelAndClose:!1,icon:"",inputPattern:null,inputPlaceholder:"",inputType:"text",inputValue:null,inputValidator:null,inputErrorMessage:"",message:null,modalFade:!0,modalClass:"",showCancelButton:!1,showConfirmButton:!0,type:"",title:void 0,showInput:!1,action:"",confirmButtonLoading:!1,cancelButtonLoading:!1,confirmButtonDisabled:!1,editorErrorMessage:"",validateError:!1,zIndex:i()}),p=$(()=>{const c=t.type;return{[r.bm("icon",c)]:c&&me[c]}}),k=ve(),u=ve(),U=$(()=>t.icon||me[t.type]||""),K=$(()=>!!t.message),y=A(),Y=A(),M=A(),O=A(),j=A(),Q=$(()=>t.confirmButtonClass);H(()=>t.inputValue,async c=>{await R(),e.boxType==="prompt"&&c!==null&&V()},{immediate:!0}),H(()=>f.value,c=>{var C,L;c&&(e.boxType!=="prompt"&&(t.autofocus?M.value=(L=(C=j.value)==null?void 0:C.$el)!=null?L:y.value:M.value=y.value),t.zIndex=i()),e.boxType==="prompt"&&(c?R().then(()=>{var ie;O.value&&O.value.$el&&(t.autofocus?M.value=(ie=Le())!=null?ie:y.value:M.value=y.value)}):(t.editorErrorMessage="",t.validateError=!1))});const x=$(()=>e.draggable);sn(y,Y,x),he(async()=>{await R(),e.closeOnHashChange&&window.addEventListener("hashchange",B)}),Ee(()=>{e.closeOnHashChange&&window.removeEventListener("hashchange",B)});function B(){f.value&&(f.value=!1,R(()=>{t.action&&n("action",t.action)}))}const P=()=>{e.closeOnClickModal&&I(t.distinguishCancelAndClose?"close":"cancel")},G=Oe(P),W=c=>{if(t.inputType!=="textarea")return c.preventDefault(),I("confirm")},I=c=>{var C;e.boxType==="prompt"&&c==="confirm"&&!V()||(t.action=c,t.beforeClose?(C=t.beforeClose)==null||C.call(t,c,t,B):B())},V=()=>{if(e.boxType==="prompt"){const c=t.inputPattern;if(c&&!c.test(t.inputValue||""))return t.editorErrorMessage=t.inputErrorMessage||l("el.messagebox.error"),t.validateError=!0,!1;const C=t.inputValidator;if(typeof C=="function"){const L=C(t.inputValue);if(L===!1)return t.editorErrorMessage=t.inputErrorMessage||l("el.messagebox.error"),t.validateError=!0,!1;if(typeof L=="string")return t.editorErrorMessage=L,t.validateError=!0,!1}}return t.editorErrorMessage="",t.validateError=!1,!0},Le=()=>{const c=O.value.$refs;return c.input||c.textarea},re=()=>{I("close")},$e=()=>{e.closeOnPressEscape&&re()};return e.lockScroll&&an(f),ln(f),{...Xe(t),ns:r,overlayEvent:G,visible:f,hasMessage:K,typeClass:p,contentId:k,inputId:u,btnSize:a,iconComponent:U,confirmButtonClasses:Q,rootRef:y,focusStartRef:M,headerRef:Y,inputRef:O,confirmRef:j,doClose:B,handleClose:re,onCloseRequested:$e,handleWrapperClick:P,handleInputEnter:W,handleAction:I,t:l}}}),pn=["aria-label","aria-describedby"],gn=["aria-label"],bn=["id"];function yn(e,n,o,s,r,a){const l=N("el-icon"),i=N("close"),f=N("el-input"),t=N("el-button"),p=N("el-focus-trap"),k=N("el-overlay");return v(),h(Je,{name:"fade-in-linear",onAfterLeave:n[11]||(n[11]=u=>e.$emit("vanish")),persisted:""},{default:g(()=>[ne(w(k,{"z-index":e.zIndex,"overlay-class":[e.ns.is("message-box"),e.modalClass],mask:e.modal},{default:g(()=>[b("div",{role:"dialog","aria-label":e.title,"aria-modal":"true","aria-describedby":e.showInput?void 0:e.contentId,class:m(`${e.ns.namespace.value}-overlay-message-box`),onClick:n[8]||(n[8]=(...u)=>e.overlayEvent.onClick&&e.overlayEvent.onClick(...u)),onMousedown:n[9]||(n[9]=(...u)=>e.overlayEvent.onMousedown&&e.overlayEvent.onMousedown(...u)),onMouseup:n[10]||(n[10]=(...u)=>e.overlayEvent.onMouseup&&e.overlayEvent.onMouseup(...u))},[w(p,{loop:"",trapped:e.visible,"focus-trap-el":e.rootRef,"focus-start-el":e.focusStartRef,onReleaseRequested:e.onCloseRequested},{default:g(()=>[b("div",{ref:"rootRef",class:m([e.ns.b(),e.customClass,e.ns.is("draggable",e.draggable),{[e.ns.m("center")]:e.center}]),style:pe(e.customStyle),tabindex:"-1",onClick:n[7]||(n[7]=X(()=>{},["stop"]))},[e.title!==null&&e.title!==void 0?(v(),Z("div",{key:0,ref:"headerRef",class:m(e.ns.e("header"))},[b("div",{class:m(e.ns.e("title"))},[e.iconComponent&&e.center?(v(),h(l,{key:0,class:m([e.ns.e("status"),e.typeClass])},{default:g(()=>[(v(),h(q(e.iconComponent)))]),_:1},8,["class"])):S("v-if",!0),b("span",null,D(e.title),1)],2),e.showClose?(v(),Z("button",{key:0,type:"button",class:m(e.ns.e("headerbtn")),"aria-label":e.t("el.messagebox.close"),onClick:n[0]||(n[0]=u=>e.handleAction(e.distinguishCancelAndClose?"close":"cancel")),onKeydown:n[1]||(n[1]=J(X(u=>e.handleAction(e.distinguishCancelAndClose?"close":"cancel"),["prevent"]),["enter"]))},[w(l,{class:m(e.ns.e("close"))},{default:g(()=>[w(i)]),_:1},8,["class"])],42,gn)):S("v-if",!0)],2)):S("v-if",!0),b("div",{id:e.contentId,class:m(e.ns.e("content"))},[b("div",{class:m(e.ns.e("container"))},[e.iconComponent&&!e.center&&e.hasMessage?(v(),h(l,{key:0,class:m([e.ns.e("status"),e.typeClass])},{default:g(()=>[(v(),h(q(e.iconComponent)))]),_:1},8,["class"])):S("v-if",!0),e.hasMessage?(v(),Z("div",{key:1,class:m(e.ns.e("message"))},[se(e.$slots,"default",{},()=>[e.dangerouslyUseHTMLString?(v(),h(q(e.showInput?"label":"p"),{key:1,for:e.showInput?e.inputId:void 0,innerHTML:e.message},null,8,["for","innerHTML"])):(v(),h(q(e.showInput?"label":"p"),{key:0,for:e.showInput?e.inputId:void 0},{default:g(()=>[te(D(e.dangerouslyUseHTMLString?"":e.message),1)]),_:1},8,["for"]))])],2)):S("v-if",!0)],2),ne(b("div",{class:m(e.ns.e("input"))},[w(f,{id:e.inputId,ref:"inputRef",modelValue:e.inputValue,"onUpdate:modelValue":n[2]||(n[2]=u=>e.inputValue=u),type:e.inputType,placeholder:e.inputPlaceholder,"aria-invalid":e.validateError,class:m({invalid:e.validateError}),onKeydown:J(e.handleInputEnter,["enter"])},null,8,["id","modelValue","type","placeholder","aria-invalid","class","onKeydown"]),b("div",{class:m(e.ns.e("errormsg")),style:pe({visibility:e.editorErrorMessage?"visible":"hidden"})},D(e.editorErrorMessage),7)],2),[[oe,e.showInput]])],10,bn),b("div",{class:m(e.ns.e("btns"))},[e.showCancelButton?(v(),h(t,{key:0,loading:e.cancelButtonLoading,class:m([e.cancelButtonClass]),round:e.roundButton,size:e.btnSize,onClick:n[3]||(n[3]=u=>e.handleAction("cancel")),onKeydown:n[4]||(n[4]=J(X(u=>e.handleAction("cancel"),["prevent"]),["enter"]))},{default:g(()=>[te(D(e.cancelButtonText||e.t("el.messagebox.cancel")),1)]),_:1},8,["loading","class","round","size"])):S("v-if",!0),ne(w(t,{ref:"confirmRef",type:"primary",loading:e.confirmButtonLoading,class:m([e.confirmButtonClasses]),round:e.roundButton,disabled:e.confirmButtonDisabled,size:e.btnSize,onClick:n[5]||(n[5]=u=>e.handleAction("confirm")),onKeydown:n[6]||(n[6]=J(X(u=>e.handleAction("confirm"),["prevent"]),["enter"]))},{default:g(()=>[te(D(e.confirmButtonText||e.t("el.messagebox.confirm")),1)]),_:1},8,["loading","class","round","disabled","size"]),[[oe,e.showConfirmButton]])],2)],6)]),_:3},8,["trapped","focus-trap-el","focus-start-el","onReleaseRequested"])],42,pn)]),_:3},8,["z-index","overlay-class","mask"]),[[oe,e.visible]])]),_:3})}var Cn=qe(vn,[["render",yn],["__file","/home/runner/work/element-plus/element-plus/packages/components/message-box/src/index.vue"]]);const F=new Map,hn=e=>{let n=document.body;return e.appendTo&&(Ie(e.appendTo)&&(n=document.querySelector(e.appendTo)),ye(e.appendTo)&&(n=e.appendTo),ye(n)||(n=document.body)),n},En=(e,n,o=null)=>{const s=w(Cn,e,be(e.message)||Se(e.message)?{default:be(e.message)?e.message:()=>e.message}:null);return s.appContext=o,Te(s,n),hn(e).appendChild(n.firstElementChild),s.component},wn=()=>document.createElement("div"),kn=(e,n)=>{const o=wn();e.onVanish=()=>{Te(null,o),F.delete(r)},e.onAction=a=>{const l=F.get(r);let i;e.showInput?i={value:r.inputValue,action:a}:i=a,e.callback?e.callback(i,s.proxy):a==="cancel"||a==="close"?e.distinguishCancelAndClose&&a!=="cancel"?l.reject("close"):l.reject("cancel"):l.resolve(i)};const s=En(e,o,n),r=s.proxy;for(const a in e)ge(e,a)&&!ge(r.$props,a)&&(r[a]=e[a]);return r.visible=!0,r};function z(e,n=null){if(!Me)return Promise.reject();let o;return Ie(e)||Se(e)?e={message:e}:o=e.callback,new Promise((s,r)=>{const a=kn(e,n??z._context);F.set(a,{options:e,callback:o,resolve:s,reject:r})})}const Mn=["alert","confirm","prompt"],Bn={alert:{closeOnPressEscape:!1,closeOnClickModal:!1},confirm:{showCancelButton:!0},prompt:{showCancelButton:!0,showInput:!0}};Mn.forEach(e=>{z[e]=In(e)});function In(e){return(n,o,s,r)=>{let a="";return Ze(o)?(s=o,a=""):Qe(o)?a="":a=o,z(Object.assign({title:a,message:n,type:"",...Bn[e]},s,{boxType:e}),r)}}z.close=()=>{F.forEach((e,n)=>{n.doClose()}),F.clear()};z._context=null;const E=z;E.install=e=>{E._context=e._context,e.config.globalProperties.$msgbox=E,e.config.globalProperties.$messageBox=E,e.config.globalProperties.$alert=E.alert,e.config.globalProperties.$confirm=E.confirm,e.config.globalProperties.$prompt=E.prompt};const zn=E;var Sn=(e=>(e[e.UNKNOWN=-1]="UNKNOWN",e[e.CHOICE=0]="CHOICE",e[e.LOGIC=1]="LOGIC",e[e.CODING=2]="CODING",e))(Sn||{});class Pn{constructor(){d(this,"index",-1);d(this,"id",-1);d(this,"type",-1);d(this,"title","");d(this,"description","");d(this,"image","");d(this,"answer","");d(this,"userAnswer","");d(this,"displayType","");d(this,"score",0)}}var Tn=(e=>(e[e.IDLE=0]="IDLE",e[e.ONGOING=1]="ONGOING",e[e.FINISHED=2]="FINISHED",e))(Tn||{});class Vn{constructor(){d(this,"scores",0);d(this,"id",0);d(this,"state",0);d(this,"start_time",0);d(this,"use_minutes",0);d(this,"name","");d(this,"subjectId",0);d(this,"subjectName","");d(this,"exam_seconds",0);d(this,"meta",[])}}const On={key:0},Rn=le({__name:"CountDown",props:{start_text:{default:"【剩余时间】"},duration_secs:{default:60},blink:{type:Boolean,default:!1},start_flag:{type:Boolean,default:!1}},emits:["end_event"],setup(e,{emit:n}){const o=e,s=Be({timer:0,durationSecs:60,text:"",blinkFlag:!0,color:{}}),r=()=>{s.durationSecs=o.duration_secs,clearInterval(s.timer),s.timer=window.setInterval(()=>{if(o.blink&&(s.blinkFlag=!s.blinkFlag),!o.blink||s.blinkFlag){let f=--s.durationSecs;const t=["","",""];for(var l=0;l<3;l++){var i=f%60;f=Math.floor(f/60),t[l]=`00${i}`.slice(-2)}s.text=`${o.start_text}${t[2]}:${t[1]}:${t[0]}`,s.durationSecs<=0&&a()}},o.blink?500:1e3)},a=()=>{var l=Math.round((o.duration_secs-s.durationSecs)/60);clearInterval(s.timer),s.text=`【用时】${l}分钟`,s.blinkFlag=!0,n("end_event"),console.log("stopTickToc")};return H(()=>o.start_flag,(l,i)=>{l?r():a()}),xe(()=>{clearInterval(s.timer)}),(l,i)=>s.blinkFlag?(v(),Z("span",On,D(s.text),1)):S("",!0)}});export{Vn as E,Sn as Q,Rn as _,Tn as a,Pn as b,zn as c};
