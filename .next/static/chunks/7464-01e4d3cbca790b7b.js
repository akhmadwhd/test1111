"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7464],{7774:function(e,t,a){a.r(t),a.d(t,{default:function(){return x}});var s=a(7437),i=a(2265),l=a(9450),n=a(9222),o=a(2067),r=a.n(o),c=a(4033),d=a(7544),u=a(2410),m=a(1678);function x(e){var t;let[a,o]=(0,i.useState)([]),[x,p]=(0,i.useState)([]),[h,g]=(0,i.useState)(),[v,f]=(0,i.useState)(!0),[j,b]=(0,i.useState)((0,l.PG)()),[y,N]=(0,i.useState)(1),[w,k]=(0,i.useState)(1),[_,S]=(0,i.useState)(!1),[C,F]=(0,i.useState)(!1),[R,z]=(0,i.useState)(!1);(0,c.useRouter)();let E={headers:{Authorization:"Bearer ".concat(null==j?void 0:j.token)}},Z=async()=>null==j?S(!0):(null==x?void 0:x.id)?n.Z.post("".concat("https://staging.gerai.neracaruang.com/api","/reply-comment/").concat(null==e?void 0:e.id,"/").concat(null==x?void 0:x.id),{comment:h},E).then(e=>{g(""),p([]),B(),N(1)}):n.Z.post("".concat("https://staging.gerai.neracaruang.com/api","/post-comment/").concat(null==e?void 0:e.id),{comment:h},E).then(e=>{g(""),B(),N(1)}),P=e=>{if(z(!0),null==j)return S(!0);n.Z.post("".concat("https://staging.gerai.neracaruang.com/api","/like"),{id:e,type:"content_comment"},E).then(e=>B()),setTimeout(()=>{z(!1)},4e3)},B=()=>{n.Z.get("".concat("https://staging.gerai.neracaruang.com/api","/get-comment/").concat(null==e?void 0:e.id)).then(e=>{var t,a,s,i;o(null==e?void 0:null===(a=e.data)||void 0===a?void 0:null===(t=a.data)||void 0===t?void 0:t.data),k(null==e?void 0:null===(i=e.data)||void 0===i?void 0:null===(s=i.data)||void 0===s?void 0:s.last_page)}).catch(e=>console.log(e))},M=()=>{n.Z.get("".concat("https://staging.gerai.neracaruang.com/api","/get-comment/").concat(null==e?void 0:e.id,"?page=").concat(y+1)).then(e=>{var t,s;let i=a;i=i.concat(null==e?void 0:null===(s=e.data)||void 0===s?void 0:null===(t=s.data)||void 0===t?void 0:t.data),N(y+1),o(i)}).catch(e=>console.log(e))};return(0,i.useEffect)(()=>{B()},[]),console.log(a),(0,s.jsxs)("div",{className:"px-3 md:px-8 pb-1",children:[(0,s.jsxs)("div",{className:"md:px-8 py-3 bg-white border border-0 border-gray-200 text-start shadow shadow-inner text-primary mb-5 ".concat(e.isRegional?"text-secondary":"text-primary"),children:[(null==a?void 0:a.length)>0&&(null==a?void 0:a.map((t,a)=>{var i;return(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{className:"py-2",children:[(0,s.jsx)("p",{className:"inline text-xs font-semibold ".concat(e.isRegional?"text-secondary":"text-primary"),children:null==t?void 0:null===(i=t.user)||void 0===i?void 0:i.name}),(0,s.jsx)("p",{className:"inline text-[10px] pl-1 italic text-secondary",children:r()(null==t?void 0:t.created_at).format("DD/MM/YY hh:mm")+" WIB"}),(0,s.jsx)("p",{className:"text-xs font-normal italic text-tertiary",children:null==t?void 0:t.comment}),(0,s.jsxs)("ul",{className:"list-disc",children:[(0,s.jsx)("li",{className:"inline text-[11px] cursor-pointer hover:font-semibold ".concat(e.isRegional?"text-secondary":"text-primary"),onClick:()=>(null==e?void 0:e.arsip)?"":P(null==t?void 0:t.id),children:(0,s.jsxs)("button",{className:"disabled:opacity-50",disabled:R,children:["• ",null==t?void 0:t.likes," Suka"]})}),(0,s.jsx)("li",{className:"inline text-[11px] pl-3 cursor-pointer hover:font-semibold ".concat(e.isRegional?"text-secondary":"text-primary"),onClick:()=>(null==e?void 0:e.arsip)?"":p(t),children:"• Balas"})]})]}),(null==t?void 0:t.replies.length)>0&&t.replies.map((t,a)=>{var i,l;return(0,s.jsxs)("div",{className:"pl-12",children:[(0,s.jsx)("p",{className:"inline text-xs font-semibold ".concat(e.isRegional?"text-secondary":"text-primary"),children:null==t?void 0:null===(i=t.user)||void 0===i?void 0:i.name}),(0,s.jsx)("p",{className:"inline text-[10px] pl-1 italic text-secondary",children:r()(null==t?void 0:t.created_at).format("DD/MM/YY hh:mm")+" WIB"}),(0,s.jsxs)("div",{className:"flex gap-2",children:[t.reply_to&&(0,s.jsxs)("p",{className:"text-xs flex gap-1",children:[(0,s.jsx)(m.W2d,{className:"font-bold text-gray-600"})," ",(0,s.jsx)("span",{className:"font-semibold text-secondary",children:null===(l=t.reply_to)||void 0===l?void 0:l.user.name})]}),(0,s.jsx)("p",{className:"text-xs font-normal italic text-tertiary",children:null==t?void 0:t.comment})]}),(0,s.jsxs)("ul",{className:"list-disc",children:[(0,s.jsx)("li",{className:"inline text-[11px] cursor-pointer hover:font-semibold ".concat(e.isRegional?"text-secondary":"text-primary"),onClick:()=>(null==e?void 0:e.arsip)?"":P(t.id),children:(0,s.jsxs)("button",{className:"disabled:opacity-50",disabled:R,children:["• ",null==t?void 0:t.likes," Suka"]})}),(0,s.jsx)("li",{className:"inline text-[11px] pl-3 cursor-pointer hover:font-semibold ".concat(e.isRegional?"text-secondary":"text-primary"),onClick:()=>(null==e?void 0:e.arsip)?"":p(t),children:"• Balas"})]})]},"reply"+a)})]},"comment"+a)})),w!=y?(0,s.jsx)("div",{className:"text-center",children:(0,s.jsx)("button",{className:"rounded-full hover:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] hover:bg-green-600 ".concat(e.isRegional?"bg-secondary":"bg-primary"," rounded-full text-white text-sm leading-[12px] font-semibold py-3 px-5 cursor-pointer"),onClick:()=>M(),children:"Load more"})}):"",(0,s.jsx)("div",{className:"".concat(0===x.length?"hidden":"block"),children:(0,s.jsxs)("div",{href:"#",className:"p-4 bg-white rounded-lg shadow",children:[(0,s.jsxs)("p",{className:"text-sm pl-1 italic text-secondary",children:["Balas : ",null==x?void 0:null===(t=x.user)||void 0===t?void 0:t.name]}),(0,s.jsx)("p",{className:"text-sm pl-1 pt-2 italic text-secondary",children:null==x?void 0:x.comment})]})}),e.showComment?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("div",{className:"pt-4",children:(0,s.jsx)("textarea",{id:"message",rows:"4",type:"text",value:h,onChange:e=>g(e.target.value),className:"bg-white border ".concat(e.isRegional?"border-secondary":"border-primary"," text-sm rounded-lg block w-full p-2.5"),placeholder:"Komentar",required:!0})}),(0,s.jsx)("div",{className:"text-right pt-2",children:(0,s.jsx)("input",{type:"submit",onClick:()=>Z(),className:"hover:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] ".concat(e.isRegional?"bg-secondary":"bg-primary"," rounded-full text-white text-sm leading-[12px] font-semibold py-3 px-5 cursor-pointer")})})]}):(0,s.jsx)("div",{className:"text-center pt-5 ".concat((null==e?void 0:e.arsip)?"hidden":""),children:(0,s.jsx)("button",{className:"rounded-full hover:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] ".concat(e.isRegional?"bg-secondary":"bg-primary"," rounded-full text-white text-sm leading-[12px] font-semibold py-3 px-5 cursor-pointer"),onClick:()=>e.showPropsComment(!e.showComment),children:"Ketuk untuk berkomentar"})})]}),(0,s.jsx)("div",{className:"bg-white w-full fixed top-0 left-0 bottom-0 ".concat(_?"bg-opacity-90":"bg-opacity-0 h-0"," z-[999] transition-all duration-200 ease-in-out"),onClick:()=>{S(!1)}}),_&&(0,s.jsx)("div",{className:"".concat(_?"bg-opacity-90":"bg-opacity-0 h-0"," transition-all duration-200 ease-in-out"),children:(0,s.jsxs)("div",{className:"fixed md:px-10 z-[999] overflow-x-hidden overflow-y-auto bottom-0 px-4 left-[calc(0%)]  md:left-[calc(50%-384px)] h-[calc(90%-1rem)] w-full max-w-screen-md",children:[(0,s.jsx)("div",{className:"absolute -right-1 -top-1 cursor-pointer",onClick:()=>{S(!1)},children:(0,s.jsx)(u.QAE,{className:"font-bold text-[25px] text-gray-600"})}),(0,s.jsx)("div",{href:"#",className:"mb-4 py-1 bg-white rounded-lg shadow",children:(0,s.jsx)("p",{className:"text-sm pl-1 italic text-primary",children:"Silahkan login untuk memberi komentar, suka, atau balas komentar."})}),(0,s.jsx)(d.Z,{})]})})]})}},7070:function(e,t,a){a.r(t),a.d(t,{default:function(){return p}});var s=a(7437);a(6691);var i=a(2265),l=a(9222),n=a(4033),o=a(7544),r=a(2410);a(4690);var c=a(9450),d=a(7918),u=a(485),m=a(7774),x=a(5267);function p(e){var t,a,p;let{read:h,like:g,comment:v,id:f,type:j=!1,isRegional:b,showingComment:y,data:N,initData:w,channelValue:k,eventValue:_,arsip:S}=e,[C,F]=(0,i.useState)(!1),[R,z]=(0,i.useState)((0,c.PG)()),[E,Z]=(0,i.useState)(g),[P,B]=(0,i.useState)(!1),[M,T]=(0,i.useState)(!1),[D,L]=(0,i.useState)(!1),A={headers:{Authorization:"Bearer ".concat(null==R?void 0:R.token)}};console.log(g);let I=()=>{L(!D)},G=window.location.href,K=()=>null==R?B(!0):l.Z.post("".concat("https://staging.gerai.neracaruang.com/api","/like"),{id:f,type:!1==j?"content":"discussion"},A).then(e=>{var t,a;return(null==e?void 0:null===(a=e.data)||void 0===a?void 0:null===(t=a.data)||void 0===t?void 0:t.is_liked)?(T(!1),Z(E+1)):(T(!1),Z(E-1))}).catch(e=>{T(!0)});(0,n.usePathname)();let V=["","k","M","G","T","P","E"],W=e=>{var t=Math.log10(Math.abs(e))/3|0;if(0==t)return e;var a=V[t];return(e/Math.pow(10,3*t)).toFixed(1)+a};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("div",{className:"flex justify-around text-primary pb-6 pt-8 flex-col md:flex-row gap-4",children:[(0,s.jsx)("div",{id:"small-modal",tabIndex:"-1",className:"fixed top-1/3 md:left-[30%] z-50 ".concat(C?"show":"hidden"," w-full p-4 overflow-x-hidden overflow-y-auto bottom-0"),children:(0,s.jsx)("div",{className:"relative w-full max-w-md max-h-full",children:(0,s.jsxs)("div",{className:"relative bg-white rounded-lg shadow",children:[(0,s.jsx)("div",{className:"flex items-center justify-between p-5 rounded-t",children:(0,s.jsx)("h3",{className:"text-xl font-medium",children:"Share ke :"})}),(0,s.jsxs)("div",{className:"p-3 space-y-3",children:[(0,s.jsx)("div",{className:"pl-3 inline",children:(0,s.jsx)(d.cG,{url:G,quote:G,body:G,children:(0,s.jsx)(d.LQ,{size:32,round:!0})})}),(0,s.jsx)("div",{className:"pl-3 inline",children:(0,s.jsx)(d.Dk,{url:G,quote:G,hashtag:"#neracaruang",children:(0,s.jsx)(d.Vq,{size:32,round:!0})})}),(0,s.jsx)("div",{className:"pl-3 inline",children:(0,s.jsx)(d.N0,{url:G,title:G,separator:"",children:(0,s.jsx)(d.ud,{size:32,round:!0})})}),(0,s.jsx)("div",{className:"pl-3 inline",children:(0,s.jsx)(d.B,{url:G,title:"",children:(0,s.jsx)(d.Zm,{size:32,round:!0})})}),(0,s.jsx)("div",{className:"pl-3 inline",children:(0,s.jsx)(d.r2,{url:G,children:(0,s.jsx)(d.pA,{size:32,round:!0})})})]}),(0,s.jsx)("div",{className:"text-center p-6 text-center border-gray-200 rounded-b",onClick:()=>F(!1),children:(0,s.jsx)("button",{"data-modal-hide":"small-modal",type:"button",className:"bg-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center",children:"Tutup"})})]})})}),(0,s.jsxs)("div",{className:"flex justify-around space-x-4 md:gap-1 items-center py-3 px-4 md:px-0",children:[(0,s.jsxs)("div",{className:"flex items-center italic justify-center text-xs ".concat(b?"text-secondary":"text-primary"),children:[(0,s.jsx)(u.default,{src:b?"/card/icon_dibaca_regional.svg":"/card/icon_dibaca.svg",dummy:"/card/icon_dibaca.svg",width:32,height:32}),(0,s.jsxs)("span",{className:"px-1",children:[" ",null!==(t=W(h))&&void 0!==t?t:0," "]}),(0,s.jsx)("span",{className:"hidden md:block",children:"baca"})]}),(0,s.jsxs)("div",{className:"flex items-center italic justify-center text-xs ".concat(b?"text-secondary":"text-primary"),children:[(0,s.jsx)("div",{className:"inline cursor-pointer",onClick:()=>S?"":K(),children:(0,s.jsx)(u.default,{src:b?"/card/icon_suka_regional.svg":"/card/icon_suka.svg",dummy:"/card/icon_suka.svg",width:32,height:32})}),(0,s.jsxs)("span",{className:"px-1",children:[" ",null!==(a=W(E))&&void 0!==a?a:0," "]}),(0,s.jsx)("span",{className:"hidden md:block",children:"suka"})]}),(0,s.jsxs)("div",{className:"flex items-center italic justify-center text-xs ".concat(b?"text-secondary":"text-primary"),onClick:()=>{y?y():I()},children:[(0,s.jsx)(u.default,{src:b?"/card/icon_komentar_regional.svg":"/card/icon_komentar.svg",dummy:"/card/icon_komentar.svg",width:32,height:32}),(0,s.jsxs)("span",{className:"px-1",children:[" ",null!==(p=W(v))&&void 0!==p?p:0," "]}),(0,s.jsx)("span",{className:"hidden md:block",children:"komentar"})]}),(0,s.jsx)("div",{className:"flex justify-center",children:(0,s.jsx)("div",{className:"flex cursor-pointer","data-modal-target":"small-modal","data-modal-toggle":"small-modal",onClick:()=>F(!0),children:(0,s.jsx)(u.default,{src:b?"/card/icon_teruskan_regional.svg":"/card/icon_teruskan.svg",dummy:"/card/icon_teruskan.svg",width:32,height:32})})})]})]}),(0,s.jsx)("div",{className:"".concat(M?"block flex justify-center pb-3":"hidden"),children:(0,s.jsx)("div",{className:"p-4 bg-white rounded-lg shadow max-w-sm ",children:(0,s.jsx)("p",{className:"text-sm italic text-secondary",children:"Klik terlalu cepat"})})}),!y&&!j&&(0,s.jsx)(m.default,{id:f,showPropsComment:I,showComment:D,isRegional:b}),j&&(0,s.jsx)(x.default,{showPropsComment:I,showComment:D,channelValue:k,eventValue:_,initData:w,arsip:S}),(0,s.jsx)("div",{className:"bg-white w-full fixed top-0 left-0 bottom-0 ".concat(P?"bg-opacity-90":"bg-opacity-0 h-0"," z-[999] transition-all duration-200 ease-in-out"),onClick:()=>{B(!1)}}),P&&(0,s.jsx)("div",{className:"".concat(P?"bg-opacity-90 px-3 md:px-8 pb-1":"bg-opacity-0 h-0"," transition-all duration-200 ease-in-out"),children:(0,s.jsxs)("div",{className:"fixed md:px-10 z-[999] overflow-x-hidden overflow-y-auto bottom-0 left-[calc(50%-384px)] h-[calc(90%-1rem)] w-full max-w-screen-md",children:[(0,s.jsxs)("div",{href:"#",className:"mb-4 py-1 bg-white rounded-lg shadow relative pt-6 md:pt-0",children:[(0,s.jsx)("div",{className:"absolute right-0 -top-1 cursor-pointer",onClick:()=>{B(!1)},children:(0,s.jsx)(r.QAE,{className:"font-bold text-[30px] text-gray-600"})}),(0,s.jsx)("p",{className:"text-sm pl-1 italic text-primary",children:"Silahkan login untuk memberi komentar, suka, atau balas komentar."})]}),(0,s.jsx)(o.Z,{})]})})]})}},7464:function(e,t,a){a.r(t),a.d(t,{default:function(){return R}});var s=a(7437),i=a(2265);function l(e){let{showPopular:t}=e,[a,l]=(0,i.useState)(!1);return(0,s.jsxs)("div",{className:"max-w-max w-max md:w-full bg-secondary rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] flex justify-center",children:[(0,s.jsx)("button",{className:"rounded-full p-2 px-5 font-semibold ".concat(a?"bg-primary text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]":"bg-transparent text-[#FFFFFF80]"),onClick:()=>{l(!0),t(!0)},children:"Terpopuler"}),(0,s.jsx)("button",{className:"rounded-full p-2 px-5 font-semibold ".concat(a?"bg-transparent text-[#FFFFFF80]":"bg-primary text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"),onClick:()=>{l(!1),t(!1)},children:"Terbaru"})]})}var n=a(750),o=a(4033),r=a(1396),c=a.n(r),d=a(485),u=a(9457);a(461);var m=a(8910);function x(e){let t=e.disabled?" opacity-50":"";return(0,s.jsxs)("div",{onClick:e.onClick,className:"absolute top-[50%] text-black bg-white bg-opacity-40 ".concat(e.left?"left-0":"left-auto right-[0px]"),children:[e.left&&(0,s.jsx)(m.oTp,{className:"".concat(t," ").concat(e.isRegional?"text-secondary":"text-primary"," text-[40px] cursor-pointer bg-opacity-70")}),!e.left&&(0,s.jsx)(m.Djl,{className:"".concat(t," ").concat(e.isRegional?"text-secondary":"text-primary"," text-[40px] cursor-pointer bg-opacity-70")})]})}var p=e=>{var t;let{data:a,isRegional:l,type:n,showingPopUp:o}=e,[r,c]=(0,i.useState)(0),[m,p]=(0,i.useState)(!1),[h,g]=(0,i.useState)(!1),[v,f]=(0,i.useState)(),[j,b]=(0,i.useState)(a.length>1),[y,N]=(0,u.E)({initial:0,loop:(null==a?void 0:a.length)>1,slideChanged(e){c(e.track.details.rel)},created(){a.length>0&&p(!0)}},[e=>{if(a.length>0){let a;let i=!1;function t(){clearTimeout(a)}function s(){clearTimeout(a),i||(a=setTimeout(()=>{e.next()},6e3))}e.on("created",()=>{e.container.addEventListener("mouseover",()=>{i=!0,t()}),e.container.addEventListener("mouseout",()=>{i=!1,s()}),s()}),e.on("dragStarted",t),e.on("animationEnded",s),e.on("updated",s)}}]);return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)("div",{className:"".concat("info-grafis"==n?"flex flex-col items-center":"md:px-4 bg-white border border-gray-200 rounded-3xl shadow drop-shadow-md flex flex-col items-center"),children:(0,s.jsxs)("div",{className:"pt-5 w-full ".concat(0===a.length?"pb-8":""),children:[(0,s.jsx)("div",{className:"px-2 md:px-0",children:(0,s.jsxs)("div",{className:"relative",children:[(0,s.jsx)("div",{ref:y,className:"keen-slider",children:a.length>0?a.map((e,t)=>(0,s.jsx)("div",{className:"keen-slider__slide w-full object-fill cursor-pointer",onClick:()=>{o("https://staging.gerai.neracaruang.com//"+e.image,t)},children:(0,s.jsx)(d.default,{src:"https://staging.gerai.neracaruang.com//"+e.image,sizes:"100vw",className:"w-screen object-cover h-auto",width:0,height:0,dummy:"/detail-kabar.png"})},t)):(0,s.jsx)("div",{className:"keen-slider__slide w-full object-fill cursor-pointer",children:(0,s.jsx)("img",{src:"/images/banner/banner_footer.png",className:"w-full object-cover"})})}),m&&j&&N.current&&(0,s.jsxs)("div",{className:"",children:[(0,s.jsx)(x,{left:!0,onClick:e=>{var t;return e.stopPropagation()||(null===(t=N.current)||void 0===t?void 0:t.prev())},disabled:0===r,isRegional:l}),(0,s.jsx)(x,{onClick:e=>{var t;return e.stopPropagation()||(null===(t=N.current)||void 0===t?void 0:t.next())},disabled:r===N.current.track.details.slides.length-1,isRegional:l})]})]})}),(0,s.jsx)("div",{className:"p-4 text-secondary",children:null===(t=a[r])||void 0===t?void 0:t.summary})]})})})},h=a(1920),g=a.n(h);function v(e){let{content:t,diskusi:a}=e;return(0,s.jsx)("div",{className:"text-tertiary text-sm space-y-4 px-3 md:px-0 ".concat(a?g().className:""),dangerouslySetInnerHTML:{__html:t}})}var f=a(7070),j=a(7768),b=a.n(j),y=a(2410);a(156);var N=a(4690),w=a(3378),k=a(9200),_=a(1213);a(2495),a(6678);var S=a(597),C=e=>{var t,a,l,n,o,r,u,m,x,h,g;let{data:j,isRegional:C,type:F}=e,[R,z]=(0,i.useState)(!1),[E,Z]=(0,i.useState)(),[P,B]=(0,i.useState)(!1),[M,T]=(0,i.useState)(-1),D=(0,i.useRef)(null),[L,A]=(0,i.useState)(!0),[I,G]=(0,i.useState)(0),[K,V]=(0,i.useState)("center"),W=[4320,2160,1080,640,384,256,128],Y=e=>"".concat("https://staging.gerai.neracaruang.com/","/").concat(e),q=j.medias,Q=q.map(e=>{var t,a;return{src:Y(e.image),width:900,height:700,description:(null!==(t=null==e?void 0:e.summary)&&void 0!==t?t:"")+"\n"+(null!==(a=null==e?void 0:e.documented_by)&&void 0!==a?a:""),srcSet:W.map(t=>({src:Y(e.image),width:t,height:Math.round(.7777777777777778*t)}))}});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("div",{className:"max-w-screen-sm mx-auto text-center border rounded-box py-4 drop-shadow-lg shadow-lg",children:[(0,s.jsx)("div",{className:"",children:(0,s.jsx)("h1",{className:"font-semibold px-4 text-3xl ".concat(C?"text-secondary":"text-primary"),children:j.title})}),(0,s.jsxs)("div",{className:"flex flex-row md:flex-col md:grid md:grid-cols-7 justify-between px-4 items-center",children:[(0,s.jsx)("div",{className:"col-span-2",children:(0,s.jsx)("div",{className:"py-5",children:(0,s.jsx)(c(),{href:"/"+((null===(t=j.location)||void 0===t?void 0:t.type)==="province"?"provinsi":(null===(a=j.location)||void 0===a?void 0:a.type)==="city"?"kota":"nasional")+"/"+(null==j?void 0:null===(l=j.location)||void 0===l?void 0:l.slug)+"/"+F,children:(0,s.jsx)(d.default,{src:"https://staging.gerai.neracaruang.com/"+(null==j?void 0:null===(n=j.location)||void 0===n?void 0:n.image),className:"mx-auto w-full h-[48px] object-contain",dummy:"/images/dummy/default-location.webp",width:177,height:48})})})}),(0,s.jsxs)("div",{className:"text-sm col-span-3 ".concat((null===(o=j.tags)||void 0===o?void 0:o.length)>0?"mx-auto":"order-3 justify-end"," ").concat(C?"text-secondary":"text-primary"," ").concat(b().className," italic py-5"),children:[(0,s.jsx)("p",{className:"".concat((null===(r=j.tags)||void 0===r?void 0:r.length)===0?"text-right":"text-right md:text-center"," "),children:null===(u=j.writer)||void 0===u?void 0:u.name})," ",(0,s.jsx)("p",{className:"text-right",children:"("+j.publish_date+")"})]}),(0,s.jsx)("div",{className:"flex w-full col-span-2 gap-2 md:w-auto justify-center md:justify-end hidden md:flex",children:null===(m=j.tags)||void 0===m?void 0:m.map(e=>(0,s.jsx)("div",{className:"py-2",children:(0,s.jsx)(c(),{href:"/"+("otonomi daerah"===e.subject?"otonomi":e.subject)+"/"+e.slug+"/"+F,children:(0,s.jsx)(d.default,{src:"https://staging.gerai.neracaruang.com/"+(null==e?void 0:e.image),width:35,height:35,alt:"",dummy:"/card/icon_ekonomi.svg"})})}))})]}),j&&(0,s.jsxs)(s.Fragment,{children:[j.medias.length>0?(0,s.jsx)(p,{data:j.medias,isRegional:C,type:F,showingPopUp:(e,t)=>{(0,w.yX)(j.slug),z(!0),Z(e),T(t)}}):(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(d.default,{src:"https://staging.gerai.neracaruang.com//"+j.medias[0].image,sizes:"100vw",className:"w-screen object-cover h-auto ",width:0,height:0,dummy:"/detail-kabar.png"}),(0,s.jsx)("div",{className:"px-4 py-3",children:(0,s.jsx)(v,{content:j.medias[0].summary})})]}),(0,s.jsx)(f.default,{read:null!==(x=j.reads)&&void 0!==x?x:0,like:null!==(h=j.likes)&&void 0!==h?h:0,comment:null!==(g=j.total_comments)&&void 0!==g?g:0,id:j.id,data:j,showingComment:()=>{B(!0)},isRegional:C})]})]}),R&&(0,s.jsx)(k.ZP,{index:M,slides:Q,open:M>=0,close:()=>T(-1),captions:{ref:D,showToggle:L,descriptionTextAlign:K,descriptionMaxLines:I},on:{open:void setTimeout(()=>{if(window.innerWidth>=768){var e;A(!0),null===(e=D.current)||void 0===e||e.hide()}else A(!1)},10)},plugins:[S.Z,_.Z],toolbar:{buttons:["zoom","close"]},render:{iconCaptionsHidden:()=>(0,s.jsx)("div",{className:"wrapper-btn-caption flex justify-end",children:(0,s.jsx)("button",{type:"button",className:"yarl__button-custom",children:"Deskripsi"},"my-button")}),iconCaptionsVisible:()=>(0,s.jsx)("div",{className:"wrapper-btn-caption flex justify-end",children:(0,s.jsx)("button",{type:"button",className:"yarl__button_custom-close-caption",children:"Tutup"},"my-button")})}}),(0,s.jsx)("div",{className:"bg-white w-full fixed top-0 left-0 bottom-0 ".concat(P?"bg-opacity-90":"bg-opacity-0 h-0"," z-[997] transition-all duration-200 ease-in-out"),onClick:()=>{B(!1)}}),P&&(0,s.jsx)("div",{className:"".concat(P?"bg-opacity-90":"bg-opacity-0 h-0"," transition-all duration-200 ease-in-out grid justify-items-center"),children:(0,s.jsxs)("div",{className:"fixed z-50 z-[998] overflow-x-hidden max-h-screen md:w-full bottom-0 w-full px-1 md:px-0 max-w-screen-sm mx-auto",children:[(0,s.jsx)("div",{className:"absolute right-1 top-1 cursor-pointer",onClick:()=>{B(!1)},children:(0,s.jsx)(y.QAE,{className:"font-bold text-[25px] text-gray-600"})}),(0,s.jsx)(N.Z,{id:null==j?void 0:j.id,data:j,type:F,isRegional:C})]})})]})};async function F(e){let t=await fetch(e,{cache:"no-store"});if(!t.ok)throw Error("Failed to fetch data");return t.json()}function R(e){let{initData:t,isGrid:a,location:r,showMoreButton:c,type:u,forMore:m,textOther:x,isRegional:p,noSort:h,isDetail:g,noSearchDiskusi:v}=e,f=(0,o.useSearchParams)(),j=(0,o.useParams)(),b=f.get("topik"),y=f.get("otonomi"),N=f.get("provinsi"),w=f.get("kota"),[k,_]=(0,i.useState)([]),[S,R]=(0,i.useState)(2),[z,E]=(0,i.useState)(!0),[Z,P]=(0,i.useState)(!0),[B,M]=(0,i.useState)();async function T(e,t){var a,s;let i=await F(e);if((null===(a=i.contents)||void 0===a?void 0:a.next_page_url)||(null===(s=i.data)||void 0===s?void 0:s.next_page_url)?E(!0):(R(1),E(!1)),t){let e=k;if("diskusi"===u||"arsip"===u)e=e.concat(i.data.data);else{let t;t=i.contents?i.contents.data:i.data,e=e.concat(t)}_(e)}else"diskusi"===u||"arsip"===u?_(i.data.data):_(i.contents?i.contents.data:i.data)}async function D(){let e;R(S+1),g?e=m:(e="diskusi"===u?"https://staging.gerai.neracaruang.com/api/discussions?page="+S:"arsip"===u?"https://staging.gerai.neracaruang.com/api/discussion-archives?page="+S:"https://staging.gerai.neracaruang.com/api/content?type="+("album"===u?"album-foto":u)+"&page="+S,Z&&(e+="&sort_popular=1"),("tokoh"===j.region||"topik"===j.region||"otonomi"===j.region)&&(e+="&with_tags=1","topik"===j.region&&(e+="&tags[]="+j.slug),"tokoh"===j.region&&(e+="&tags[]="+j.slug),"otonomi"===j.region&&(e+="&tags[]="+j.slug)),"kota"===j.region&&(e+="&city="+j.slug),"provinsi"===j.region&&(e+="&province="+j.slug),"nasional"===j.region&&(e+="&city="+j.slug)),console.log(j,e),T(e,!0)}async function L(e){let t;t="diskusi"===u?"https://staging.gerai.neracaruang.com/api/discussions?page=1":"arsip"===u?"https://staging.gerai.neracaruang.com/api/discussion-archives?page=1":"https://staging.gerai.neracaruang.com/api/content?type="+("album"===u?"album-foto":u),P(e),R(2),e&&(t+="&sort_popular=1"),"kota"===j.region&&(t+="&city="+j.slug),"provinsi"===j.region&&(t+="&province="+j.slug),"nasional"===j.region&&(t+="&city="+j.slug),("tokoh"===j.region||b||y)&&(t+="&with_tags=1",b&&(t+="&tags[]="+b),"tokoh"===j.region&&(t+="&tags[]="+j.region=="tokoh"),y&&(t+="&tags[]="+y)),w&&(t+="&city="+w),N&&(t+="&province="+N),T(t,!1)}(0,i.useEffect)(()=>{_(t),R(2),E(!0)},[t]);let A=async()=>{let e=await F("https://staging.gerai.neracaruang.com/api/discussions?keyword="+B);_(e.data.data)};return(0,s.jsxs)("div",{children:[(0,s.jsx)("div",{className:"flex mb-3 ".concat(c?"justify-between":"justify-center"),children:!h&&(0,s.jsxs)("div",{className:"text-center",children:[r&&(0,s.jsx)("div",{className:"py-5 ml-9",children:(0,s.jsx)(d.default,{src:"https://staging.gerai.neracaruang.com/"+r,className:"mx-auto",dummy:"/images/dummy/default-location.webp",width:280,height:58,alt:"icon provinsi"})}),(0,s.jsx)("div",{className:"pb-4 md:flex flex justify-center ".concat((null==j?void 0:j.region)||(null==j?void 0:j.city)?"pt-5":""),children:(0,s.jsx)(l,{showPopular:L})})]})}),"diskusi"==u&&!v&&(0,s.jsx)("div",{className:"relative flex flex-col w-100 mx-auto",children:(0,s.jsxs)("div",{className:"flex items-center pb-5",children:[(0,s.jsx)("div",{className:"absolute left-2 cursor-pointer hover:scale-110",children:(0,s.jsxs)("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[(0,s.jsx)("circle",{cx:"4.5",cy:"4.5",r:"4",stroke:"#6E6E70"}),(0,s.jsx)("path",{d:"M11 11C11.1952 11.1953 11.5118 11.1953 11.7071 11C11.9023 10.8048 11.9023 10.4882 11.7071 10.2929L11 11ZM6.99996 7.00004L11 11L11.7071 10.2929L7.70707 6.29293L6.99996 7.00004Z",fill:"#6E6E70"})]})}),(0,s.jsx)("input",{type:"text",className:"w-full rounded-full bg-[#F5F5F5] pl-6 pr-3 py-1 shadow-search px-5 focus:outline-none font-normal text-xs italic leading-[14px] text-black",placeholder:"pencarian",onKeyUp:e=>A(),onChange:e=>M(e.target.value)})]})}),k&&k.length>0?(0,s.jsx)("div",{className:"max-w-screen-lg w-full gap-4 md:gap-8 mx-auto ".concat(a?"flex flex-col md:grid md:grid-cols-2":"flex flex-col"),children:k.map((e,t)=>(0,s.jsx)("div",{className:"w-full relative md:col-span-1 mx-auto",children:"info-grafis"===u?(0,s.jsx)(C,{type:u,data:e,isRegional:p}):(0,s.jsx)(n.Z,{data:e,isGrid:a,type:u,isRegional:p,params:j})},u+"-card"+t))}):(0,s.jsxs)("p",{className:"font-bold italic text-center ".concat(p?"text-secondary":"text-primary"),children:["Tidak ada ",u,"."]}),m&&z&&(0,s.jsxs)("div",{className:"mt-8 pt-4 absolute left-0 overflow-y-hidden h-fit w-full bg-gray-100",style:{boxShadow:"0 -9px 10px -9px #333"},children:[(0,s.jsxs)("p",{className:"z-10 relative font-semibold mb-4 text-center w-full italic text-tertiary capitalize cursor-pointer",onClick:()=>D(),children:[x," Berikutnya..."]}),(0,s.jsx)("div",{className:"max-w-screen-lg mx-auto",children:(0,s.jsxs)("div",{className:"gap-8 px-8 mx-auto ".concat(a?"grid md:grid-cols-2":""),children:[(0,s.jsx)("div",{className:"bg-gray-500 h-52 w-full rounded-lg"}),a&&(0,s.jsx)("div",{className:"invisible md:visible",children:(0,s.jsx)("div",{className:"bg-gray-500 h-52 w-full rounded-lg"})})]})}),(0,s.jsx)("div",{className:"absolute bottom-0 h-full w-full",style:{background:"linear-gradient(0deg, rgba(0, 79, 130, 0.04), rgba(0, 79, 130, 0.04)), linear-gradient(360deg, #F8FAFC 18.86%, rgba(217, 217, 217, 0.4) 56%, rgba(217, 217, 217, 0) 83.76%), linear-gradient(0deg, rgba(255, 251, 251, 0.8) 38.29%, rgba(245, 245, 245, 0.336) 118.38%)"}})]})]})}},5267:function(e,t,a){a.r(t),a.d(t,{default:function(){return p}});var s=a(7437),i=a(2265),l=a(9450),n=a(7965),o=a.n(n),r=a(9222),c=a(2067),d=a.n(c),u=a(2410),m=a(1678),x=a(7544);function p(e){var t;let{channelValue:a,eventValue:n,initData:c,showPropsComment:p,showComment:h,arsip:g}=e,[v,f]=(0,i.useState)([]),[j,b]=(0,i.useState)(),[y,N]=(0,i.useState)(),[w,k]=(0,i.useState)((0,l.PG)()),[_,S]=(0,i.useState)(!1),C=(0,i.useRef)(null),F=(0,i.useRef)(null),[R,z]=(0,i.useState)(!1),E={headers:{Authorization:"Bearer ".concat(null==w?void 0:w.token)}};(0,i.useEffect)(()=>{if(c.comments.data.length>0&&f(c.comments.data),a&&n){var e=new(o())("9f91236be940c66eddef",{cluster:"ap1"});return e.subscribe(a).bind(n,function(e){f(t=>[...t,e.data])}),()=>{e.unsubscribe(a)}}},[]);let Z=async()=>null==w?S(!0):j?r.Z.post("".concat("https://staging.gerai.neracaruang.com/api","/discussion/reply/").concat(null==c?void 0:c.id,"/").concat(null==j?void 0:j.id),{comment:y},E).then(e=>{N(""),b()}):r.Z.post("".concat("https://staging.gerai.neracaruang.com/api","/discussion/comment/").concat(null==c?void 0:c.id),{comment:y},E).then(e=>{N("")}),P=()=>{var e;null===(e=C.current)||void 0===e||e.scrollIntoView({behavior:"smooth"}),setTimeout(()=>{var e;null===(e=F.current)||void 0===e||e.scrollIntoView({behavior:"smooth"})},1e3)},B=async()=>{let e=await function(e){let t=fetch("".concat("https://staging.gerai.neracaruang.com/api","/discussions/").concat(e),{cache:"no-store"}).then(e=>e.json()).then(e=>e.data);return t}(c.slug);f(e.comments.data),console.log(e)};(0,i.useEffect)(()=>{P()},[v]);let M=e=>{if((null==w?void 0:w.token)==null)return S(!0);r.Z.post("".concat("https://staging.gerai.neracaruang.com/api","/like"),{id:e,type:"discussion_comment"},E).then(e=>{B()}).catch(e=>{B()})};return(0,s.jsxs)("div",{className:"px-3 md:px-8 py-3 bg-white border border-0 border-gray-200 text-start shadow shadow-inner text-primary mb-5",ref:F,children:[(0,s.jsxs)("div",{className:"flex flex-col text-start max-h-96 flex-grow overflow-y-auto gap-4",children:[v.map((e,t)=>{var a,i,l;return(0,s.jsx)("div",{children:(0,s.jsxs)("div",{className:"py-2",children:[(0,s.jsx)("p",{className:"inline text-xs font-semibold",children:null==e?void 0:null===(a=e.user)||void 0===a?void 0:a.name}),(0,s.jsx)("p",{className:"inline text-[10px] pl-1 italic text-secondary",children:d()(null==e?void 0:e.created_at).format("DD/MM/YY hh:mm")+" WIB"}),(0,s.jsxs)("div",{className:"flex gap-2",children:[e.reply_to&&(0,s.jsxs)("p",{className:"text-xs flex gap-1",children:[(0,s.jsx)(m.W2d,{className:"font-bold text-gray-600"})," ",(0,s.jsx)("span",{className:"font-semibold text-tertiary",children:null===(l=e.reply_to)||void 0===l?void 0:null===(i=l.user)||void 0===i?void 0:i.name})]}),(0,s.jsx)("p",{className:"text-xs font-normal italic text-tertiary",children:null==e?void 0:e.comments})]}),g?(0,s.jsx)("ul",{className:"list-disc",children:(0,s.jsxs)("li",{className:"inline text-[11px] text-tertiary",children:["• ",null==e?void 0:e.likes," Suka"]})}):(0,s.jsxs)("ul",{className:"list-disc",children:[(0,s.jsxs)("li",{className:"inline text-[11px] cursor-pointer",onClick:()=>M(null==e?void 0:e.id),children:["• ",null==e?void 0:e.likes," Suka"]}),(0,s.jsx)("li",{className:"inline text-[11px] pl-3 cursor-pointer",onClick:()=>b(e),children:"• Balas"})]})]})},t)}),(0,s.jsx)("div",{ref:C})]}),(0,s.jsx)("div",{className:"".concat(j?"block":"hidden"),children:(0,s.jsxs)("div",{href:"#",className:"p-4 bg-white rounded-lg shadow",children:[(0,s.jsxs)("p",{className:"text-sm pl-1 italic text-secondary",children:["Balas : ",null==j?void 0:null===(t=j.user)||void 0===t?void 0:t.name]}),(0,s.jsx)("p",{className:"text-sm pl-1 pt-2 italic ",children:null==j?void 0:j.comments})]})}),h?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("div",{className:"pt-4",children:(0,s.jsx)("textarea",{id:"message",rows:"4",type:"text",value:y,onChange:e=>N(e.target.value),className:"bg-white border border-primary text-sm rounded-lg block w-full p-2.5",placeholder:"Komentar",required:!0})}),(0,s.jsx)("div",{className:"text-right pt-2",children:(0,s.jsx)("input",{type:"submit",onClick:()=>Z(),className:"btn-primary hover:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] hover:bg-primary_light bg-primary rounded-full text-white text-sm leading-[12px] font-semibold py-3 px-5 cursor-pointer"})})]}):(0,s.jsx)("div",{className:"text-center pt-5 ",children:(0,s.jsx)("button",{className:"rounded-full btn-primary hover:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] hover:bg-primary_light bg-primary rounded-full text-white text-sm leading-[12px] font-semibold py-3 px-5 cursor-pointer ".concat(g?"hidden":""),onClick:()=>p(!h),children:"Ketuk untuk berkomentar"})}),(0,s.jsx)("div",{className:"bg-white w-full fixed top-0 left-0 bottom-0 ".concat(_?"bg-opacity-90":"bg-opacity-0 h-0"," z-[999] transition-all duration-200 ease-in-out"),onClick:()=>{S(!1)}}),_&&(0,s.jsx)("div",{className:"".concat(_?"bg-opacity-90":"bg-opacity-0 h-0"," transition-all duration-200 ease-in-out"),children:(0,s.jsxs)("div",{className:"fixed md:px-10 z-[999] overflow-x-hidden overflow-y-auto bottom-0 left-[calc(50%-384px)] h-[calc(90%-1rem)] w-full max-w-screen-md",children:[(0,s.jsx)("div",{className:"absolute -right-1 -top-1 cursor-pointer",onClick:()=>{S(!1)},children:(0,s.jsx)(u.QAE,{className:"font-bold text-[30px] text-gray-600"})}),(0,s.jsx)("div",{href:"#",className:"mb-4 py-1 bg-white rounded-lg shadow text-center",children:(0,s.jsx)("p",{className:"text-sm pl-1 italic text-primary",children:"Silahkan login untuk memberi komentar, suka, atau balas komentar."})}),(0,s.jsx)(x.Z,{})]})})]})}}}]);