(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7870],{7257:function(t,e,a){Promise.resolve().then(a.bind(a,4512))},4512:function(t,e,a){"use strict";a.r(e),a.d(e,{default:function(){return r}});var n=a(7437),o=a(2265),s=a(7464),i=a(4033);async function c(t){let e=await fetch(t,{cache:"no-store"});if(!e.ok)throw Error("Failed to fetch data");return e.json()}function r(){let t=(0,i.useSearchParams)(),e=t.get("cari"),a=t.get("tokoh"),r=t.get("topik"),u=t.get("otonomi"),g=t.get("provinsi"),l=t.get("kota"),[p,f]=(0,o.useState)([]),[h,d]=(0,o.useState)(1),[m,y]=(0,o.useState)(!1),[_,w]=(0,o.useState)(!0),[k,x]=(0,o.useState)("");async function v(t,e){let a=await c(t);if(a.contents&&a.contents.next_page_url?(y(!0),d(h+1)):(d(1),y(!1)),e){let t=p;f(t=t.concat(a.contents.data))}else(l||g)&&x(a.location.image),a.contents&&f(a.contents.data)}async function b(){let t="https://staging.gerai.neracaruang.com/api/content?type=album-foto&page="+h;_&&(t+="&sort_popular=1"),(a||r||u)&&(t+="&with_tags=1",r&&(t+="&tags[]="+r),a&&(t+="&tags[]="+a),u&&(t+="&tags[]="+u)),l&&(t+="&city="+l),g&&(t+="&province="+g),e&&(t+="&keyword="+e),v(t,!0)}async function S(t){let n="https://staging.gerai.neracaruang.com/api/content?type=album-foto";w(t),d(1),t&&(n+="&sort_popular=1"),(a||r||u)&&(n+="&with_tags=1",r&&(n+="&tags[]="+r),a&&(n+="&tags[]="+a),u&&(n+="&tags[]="+u)),l&&(n+="&city="+l),g&&(n+="&province="+g),e&&(n+="&keyword="+e),v(n,!1)}return(0,o.useEffect)(()=>{let t="https://staging.gerai.neracaruang.com/api/content?type=album-foto&sort_popular=1";(a||r||u)&&(t+="&with_tags=1",r&&(t+="&tags[]="+r),a&&(t+="&tags[]="+a),u&&(t+="&tags[]="+u)),l&&(t+="&city="+l),g&&(t+="&province="+g),e&&(t+="&keyword="+e),v(t,!1)},[]),(0,n.jsx)("div",{className:"max-w-5xl text-center mx-auto mt-4",children:(0,n.jsx)("div",{className:"px-4 lg:px-8",children:p.length>0&&(0,n.jsx)(s.default,{initData:p,isGrid:!0,loadMore:b,showPopular:S,forMore:m,type:"album",isRegional:g||l,location:k})})})}}},function(t){t.O(0,[2306,6990,2400,1582,1724,5876,6691,4769,6685,451,3402,6324,9675,750,7464,2971,4123,1744],function(){return t(t.s=7257)}),_N_E=t.O()}]);