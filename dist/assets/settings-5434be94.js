var e=Object.defineProperty;var r=(a,u,A)=>u in a?e(a,u,{enumerable:!0,configurable:!0,writable:!0,value:A}):a[u]=A;var _=(a,u,A)=>(r(a,typeof u!="symbol"?u+"":u,A),A);var E=(a=>(a[a.USER_INFO=0]="USER_INFO",a[a.BIG_DAY=1]="BIG_DAY",a[a.SHOW_FINISHED_DAY=2]="SHOW_FINISHED_DAY",a[a.HABBIT=3]="HABBIT",a[a.DATA=4]="DATA",a[a.RECODRD=5]="RECODRD",a[a.EXAM_TIME_BLINK=6]="EXAM_TIME_BLINK",a))(E||{});class n{constructor(){_(this,"data",[{name:"用户卡片",value:!1},{name:"纪念日",value:!0},{name:"已完成纪念日",value:!0},{name:"习惯打卡",value:!0},{name:"统计卡片",value:!0},{name:"考试记录",value:!0},{name:"时间数字拆分",value:!0}])}copyFrom(u){this.data=u.data}}export{n as S,E as a};
