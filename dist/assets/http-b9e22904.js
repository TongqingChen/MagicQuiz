var he=Object.defineProperty;var ke=(l,r,n)=>r in l?he(l,r,{enumerable:!0,configurable:!0,writable:!0,value:n}):l[r]=n;var p=(l,r,n)=>(ke(l,typeof r!="symbol"?r+"":r,n),n);import{W as M,b as fe,ae as oe,af as ve,X as ce,d as J,a_ as de,a$ as _e,b0 as Ie,u as me,ar as ze,O as h,b1 as Le,R as Ce,c as k,H as re,L as pe,p as ge,o as w,e as ie,l as c,w as I,k as g,n as d,f as t,s as ue,C as Ee,g as z,E as N,B as Oe,a as T,F as U,al as Se,am as Te,b2 as xe,b3 as Ne,r as Re,b4 as $e,b5 as Ae,x as Be,M as Ve,N as Me,h as K,T as Xe,ay as Ye,_ as we,aQ as X,$ as V,j as ye,b6 as De,b7 as Fe,ax as He,aT as Pe,a0 as We,t as je}from"./index-b7ecf7ad.js";import{i as qe,b as be,z as Qe}from"./use-form-item-25dc9654.js";import{d as Ze}from"./el-radio-group-ff9b8059.js";import{u as Ge}from"./index-35dd958d.js";import{g as Ke}from"./scroll-c51ff71d.js";const Ue=(l,r)=>{if(!M||!l||!r)return!1;const n=l.getBoundingClientRect();let s;return r instanceof Element?s=r.getBoundingClientRect():s={top:0,right:window.innerWidth,bottom:window.innerHeight,left:0},n.top<s.bottom&&n.bottom>s.top&&n.right>s.left&&n.left<s.right};var Je="Expected a function";function le(l,r,n){var s=!0,y=!0;if(typeof l!="function")throw new TypeError(Je);return qe(n)&&(s="leading"in n?!!n.leading:s,y="trailing"in n?!!n.trailing:y),Ze(l,r,{leading:s,maxWait:r,trailing:y})}const et=fe({urlList:{type:oe(Array),default:()=>ve([])},zIndex:{type:Number},initialIndex:{type:Number,default:0},infinite:{type:Boolean,default:!0},hideOnClickModal:{type:Boolean,default:!1},teleported:{type:Boolean,default:!1},closeOnPressEscape:{type:Boolean,default:!0},zoomRate:{type:Number,default:1.2}}),tt={close:()=>!0,switch:l=>ce(l)},at=["src"],nt=J({name:"ElImageViewer"}),st=J({...nt,props:et,emits:tt,setup(l,{expose:r,emit:n}){const s=l,y={CONTAIN:{name:"contain",icon:de(_e)},ORIGINAL:{name:"original",icon:de(Ie)}},{t:L}=be(),i=me("image-viewer"),{nextZIndex:ee}=ze(),R=h(),x=h([]),C=Le(),_=h(!0),f=h(s.initialIndex),v=Ce(y.CONTAIN),u=h({scale:1,deg:0,offsetX:0,offsetY:0,enableTransition:!1}),Y=k(()=>{const{urlList:e}=s;return e.length<=1}),$=k(()=>f.value===0),j=k(()=>f.value===s.urlList.length-1),te=k(()=>s.urlList[f.value]),D=k(()=>{const{scale:e,deg:a,offsetX:o,offsetY:m,enableTransition:O}=u.value;let b=o/e,S=m/e;switch(a%360){case 90:case-270:[b,S]=[S,-b];break;case 180:case-180:[b,S]=[-b,-S];break;case 270:case-90:[b,S]=[-S,b];break}const B={transform:`scale(${e}) rotate(${a}deg) translate(${b}px, ${S}px)`,transition:O?"transform .3s":""};return v.value.name===y.CONTAIN.name&&(B.maxWidth=B.maxHeight="100%"),B}),ae=k(()=>ce(s.zIndex)?s.zIndex:ee());function A(){ne(),n("close")}function F(){const e=le(o=>{switch(o.code){case V.esc:s.closeOnPressEscape&&A();break;case V.space:P();break;case V.left:Z();break;case V.up:E("zoomIn");break;case V.right:G();break;case V.down:E("zoomOut");break}}),a=le(o=>{const m=o.deltaY||o.deltaX;E(m<0?"zoomIn":"zoomOut",{zoomRate:s.zoomRate,enableTransition:!1})});C.run(()=>{X(document,"keydown",e),X(document,"wheel",a)})}function ne(){C.stop()}function se(){_.value=!1}function q(e){_.value=!1,e.target.alt=L("el.image.error")}function Q(e){if(_.value||e.button!==0||!R.value)return;u.value.enableTransition=!1;const{offsetX:a,offsetY:o}=u.value,m=e.pageX,O=e.pageY,b=le(B=>{u.value={...u.value,offsetX:a+B.pageX-m,offsetY:o+B.pageY-O}}),S=X(document,"mousemove",b);X(document,"mouseup",()=>{S()}),e.preventDefault()}function H(){u.value={scale:1,deg:0,offsetX:0,offsetY:0,enableTransition:!1}}function P(){if(_.value)return;const e=Qe(y),a=Object.values(y),o=v.value.name,O=(a.findIndex(b=>b.name===o)+1)%e.length;v.value=y[e[O]],H()}function W(e){const a=s.urlList.length;f.value=(e+a)%a}function Z(){$.value&&!s.infinite||W(f.value-1)}function G(){j.value&&!s.infinite||W(f.value+1)}function E(e,a={}){if(_.value)return;const{zoomRate:o,rotateDeg:m,enableTransition:O}={zoomRate:s.zoomRate,rotateDeg:90,enableTransition:!0,...a};switch(e){case"zoomOut":u.value.scale>.2&&(u.value.scale=Number.parseFloat((u.value.scale/o).toFixed(3)));break;case"zoomIn":u.value.scale<7&&(u.value.scale=Number.parseFloat((u.value.scale*o).toFixed(3)));break;case"clockwise":u.value.deg+=m;break;case"anticlockwise":u.value.deg-=m;break}u.value.enableTransition=O}return re(te,()=>{pe(()=>{const e=x.value[0];e!=null&&e.complete||(_.value=!0)})}),re(f,e=>{H(),n("switch",e)}),ge(()=>{var e,a;F(),(a=(e=R.value)==null?void 0:e.focus)==null||a.call(e)}),r({setActiveItem:W}),(e,a)=>(w(),ie(Ye,{to:"body",disabled:!e.teleported},[c(Xe,{name:"viewer-fade",appear:""},{default:I(()=>[g("div",{ref_key:"wrapper",ref:R,tabindex:-1,class:d(t(i).e("wrapper")),style:ue({zIndex:t(ae)})},[g("div",{class:d(t(i).e("mask")),onClick:a[0]||(a[0]=Ee(o=>e.hideOnClickModal&&A(),["self"]))},null,2),z(" CLOSE "),g("span",{class:d([t(i).e("btn"),t(i).e("close")]),onClick:A},[c(t(N),null,{default:I(()=>[c(t(Oe))]),_:1})],2),z(" ARROW "),t(Y)?z("v-if",!0):(w(),T(U,{key:0},[g("span",{class:d([t(i).e("btn"),t(i).e("prev"),t(i).is("disabled",!e.infinite&&t($))]),onClick:Z},[c(t(N),null,{default:I(()=>[c(t(Se))]),_:1})],2),g("span",{class:d([t(i).e("btn"),t(i).e("next"),t(i).is("disabled",!e.infinite&&t(j))]),onClick:G},[c(t(N),null,{default:I(()=>[c(t(Te))]),_:1})],2)],64)),z(" ACTIONS "),g("div",{class:d([t(i).e("btn"),t(i).e("actions")])},[g("div",{class:d(t(i).e("actions__inner"))},[c(t(N),{onClick:a[1]||(a[1]=o=>E("zoomOut"))},{default:I(()=>[c(t(xe))]),_:1}),c(t(N),{onClick:a[2]||(a[2]=o=>E("zoomIn"))},{default:I(()=>[c(t(Ne))]),_:1}),g("i",{class:d(t(i).e("actions__divider"))},null,2),c(t(N),{onClick:P},{default:I(()=>[(w(),ie(Re(t(v).icon)))]),_:1}),g("i",{class:d(t(i).e("actions__divider"))},null,2),c(t(N),{onClick:a[3]||(a[3]=o=>E("anticlockwise"))},{default:I(()=>[c(t($e))]),_:1}),c(t(N),{onClick:a[4]||(a[4]=o=>E("clockwise"))},{default:I(()=>[c(t(Ae))]),_:1})],2)],2),z(" CANVAS "),g("div",{class:d(t(i).e("canvas"))},[(w(!0),T(U,null,Be(e.urlList,(o,m)=>Ve((w(),T("img",{ref_for:!0,ref:O=>x.value[m]=O,key:o,src:o,style:ue(t(D)),class:d(t(i).e("img")),onLoad:se,onError:q,onMousedown:Q},null,46,at)),[[Me,m===f.value]])),128))],2),K(e.$slots,"default")],6)]),_:3})],8,["disabled"]))}});var lt=we(st,[["__file","/home/runner/work/element-plus/element-plus/packages/components/image-viewer/src/image-viewer.vue"]]);const ot=ye(lt),rt=fe({hideOnClickModal:{type:Boolean,default:!1},src:{type:String,default:""},fit:{type:String,values:["","contain","cover","fill","none","scale-down"],default:""},loading:{type:String,values:["eager","lazy"]},lazy:{type:Boolean,default:!1},scrollContainer:{type:oe([String,Object])},previewSrcList:{type:oe(Array),default:()=>ve([])},previewTeleported:{type:Boolean,default:!1},zIndex:{type:Number},initialIndex:{type:Number,default:0},infinite:{type:Boolean,default:!0},closeOnPressEscape:{type:Boolean,default:!0},zoomRate:{type:Number,default:1.2}}),it={load:l=>l instanceof Event,error:l=>l instanceof Event,switch:l=>ce(l),close:()=>!0,show:()=>!0},ut=["src","loading"],ct={key:0},dt=J({name:"ElImage",inheritAttrs:!1}),ft=J({...dt,props:rt,emits:it,setup(l,{emit:r}){const n=l;let s="";const{t:y}=be(),L=me("image"),i=De(),ee=Ge(),R=h(),x=h(!1),C=h(!0),_=h(!1),f=h(),v=h(),u=M&&"loading"in HTMLImageElement.prototype;let Y,$;const j=k(()=>i.style),te=k(()=>{const{fit:e}=n;return M&&e?{objectFit:e}:{}}),D=k(()=>{const{previewSrcList:e}=n;return Array.isArray(e)&&e.length>0}),ae=k(()=>{const{previewSrcList:e,initialIndex:a}=n;let o=a;return a>e.length-1&&(o=0),o}),A=k(()=>n.loading==="eager"?!1:!u&&n.loading==="lazy"||n.lazy),F=()=>{M&&(C.value=!0,x.value=!1,R.value=n.src)};function ne(e){C.value=!1,x.value=!1,r("load",e)}function se(e){C.value=!1,x.value=!0,r("error",e)}function q(){Ue(f.value,v.value)&&(F(),P())}const Q=Fe(q,200);async function H(){var e;if(!M)return;await pe();const{scrollContainer:a}=n;Pe(a)?v.value=a:We(a)&&a!==""?v.value=(e=document.querySelector(a))!=null?e:void 0:f.value&&(v.value=Ke(f.value)),v.value&&(Y=X(v,"scroll",Q),setTimeout(()=>q(),100))}function P(){!M||!v.value||!Q||(Y==null||Y(),v.value=void 0)}function W(e){if(e.ctrlKey){if(e.deltaY<0)return e.preventDefault(),!1;if(e.deltaY>0)return e.preventDefault(),!1}}function Z(){D.value&&($=X("wheel",W,{passive:!1}),s=document.body.style.overflow,document.body.style.overflow="hidden",_.value=!0,r("show"))}function G(){$==null||$(),document.body.style.overflow=s,_.value=!1,r("close")}function E(e){r("switch",e)}return re(()=>n.src,()=>{A.value?(C.value=!0,x.value=!1,P(),H()):F()}),ge(()=>{A.value?H():F()}),(e,a)=>(w(),T("div",{ref_key:"container",ref:f,class:d([t(L).b(),e.$attrs.class]),style:ue(t(j))},[x.value?K(e.$slots,"error",{key:0},()=>[g("div",{class:d(t(L).e("error"))},je(t(y)("el.image.error")),3)]):(w(),T(U,{key:1},[R.value!==void 0?(w(),T("img",He({key:0},t(ee),{src:R.value,loading:e.loading,style:t(te),class:[t(L).e("inner"),t(D)&&t(L).e("preview"),C.value&&t(L).is("loading")],onClick:Z,onLoad:ne,onError:se}),null,16,ut)):z("v-if",!0),C.value?(w(),T("div",{key:1,class:d(t(L).e("wrapper"))},[K(e.$slots,"placeholder",{},()=>[g("div",{class:d(t(L).e("placeholder"))},null,2)])],2)):z("v-if",!0)],64)),t(D)?(w(),T(U,{key:2},[_.value?(w(),ie(t(ot),{key:0,"z-index":e.zIndex,"initial-index":t(ae),infinite:e.infinite,"zoom-rate":e.zoomRate,"url-list":e.previewSrcList,"hide-on-click-modal":e.hideOnClickModal,teleported:e.previewTeleported,"close-on-press-escape":e.closeOnPressEscape,onClose:G,onSwitch:E},{default:I(()=>[e.$slots.viewer?(w(),T("div",ct,[K(e.$slots,"viewer")])):z("v-if",!0)]),_:3},8,["z-index","initial-index","infinite","zoom-rate","url-list","hide-on-click-modal","teleported","close-on-press-escape"])):z("v-if",!0)],64)):z("v-if",!0)],6))}});var vt=we(ft,[["__file","/home/runner/work/element-plus/element-plus/packages/components/image/src/image.vue"]]);const ht=ye(vt);class kt{constructor(){p(this,"meta",{user:0,quiz:0,rel_score:0,abs_score:0,use_minutes:0,note:""});p(this,"questions",[])}}class _t{constructor(){p(this,"qid",0);p(this,"quiz_name","");p(this,"title","");p(this,"type","");p(this,"description","");p(this,"image","");p(this,"answer","");p(this,"level","");p(this,"record_times",0)}}export{ht as E,kt as Q,_t as W};
