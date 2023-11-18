import{r as i,u as as,a as cs,b as ts,j as s,F as d,f as ns,c as rs,d as E,L as is,e as o,_ as r,l as ds}from"./index-e4b7f291.js";const os="_details_cnt_aq3n4_1",ls="_details_aq3n4_1",_s="_detail_left_aq3n4_27",ps="_img_cnt_aq3n4_45",ms="_cta_btn_cnt_aq3n4_79",hs="_btn_aq3n4_93",us="_add_cart_aq3n4_127",gs="_buy_now_aq3n4_135",ys="_detail_right_aq3n4_145",xs="_p_name_aq3n4_159",js="_pd_price_aq3n4_167",fs="_pay_aq3n4_179",Ns="_off_aq3n4_197",vs="_sec_aq3n4_207",qs="_secLeft_aq3n4_221",bs="_specs_cnt_aq3n4_233",Ss="_spec_heading_aq3n4_245",ws="_specs_aq3n4_233",zs="_similar_products_section_aq3n4_279",Ds="_heading_aq3n4_293",Ps="_similar_products_cnt_aq3n4_305",$s="_similar_product_aq3n4_279",ks="_review_aq3n4_363",Cs="_rating_aq3n4_373",Os="_price_cnt_aq3n4_403",Ls="_price_aq3n4_403",As="_grey_aq3n4_439",a={details_cnt:os,details:ls,detail_left:_s,img_cnt:ps,cta_btn_cnt:ms,btn:hs,add_cart:us,buy_now:gs,detail_right:ys,p_name:xs,pd_price:js,pay:fs,off:Ns,sec:vs,secLeft:qs,specs_cnt:bs,spec_heading:Ss,specs:ws,similar_products_section:zs,heading:Ds,similar_products_cnt:Ps,similar_product:$s,review:ks,rating:Cs,price_cnt:Os,price:Ls,grey:As},Js=()=>{var m,h,u,g,y,x,j,f,N,v,q,b,S,w,z,D,P,$,k,C,O,L,A,I,R,F,J;const[e,M]=i.useState({}),[B,K]=i.useState([]),{pid:_}=as(),U=cs().pathname.split("/")[1],p=ts(),W=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],Q=new Date,H=async()=>{try{const{data:c}=await o.get(`/api/products/get-single/${_}`);try{c.desc=JSON.parse(c.desc)}catch{}M(c)}catch(c){r.error(c.response.data.message)}};i.useEffect(()=>{H()},[]);const Y=async()=>{try{const{data:c}=await o.get(`/api/products/similar-products/${e.category}/${e._id}`);K(c)}catch(c){r.error(c.response.data.message)}};i.useEffect(()=>{e.category!==void 0&&Y()},[e]);const G=()=>{let c=[];localStorage.getItem("cart")!==null&&(c=JSON.parse(localStorage.getItem("cart"))),c.push(_),localStorage.setItem("cart",JSON.stringify(c)),r.success("item added to cart"),p("/cart")};function V(c){return new Promise(t=>{const n=document.createElement("script");n.src=c,n.onload=()=>{t(!0)},n.onerror=()=>{t(!1)},document.body.appendChild(n)})}async function X(){if(!await V("https://checkout.razorpay.com/v1/checkout.js")){r.error("Razorpay SDK failed to load. Are you online?");return}const t=await o.post("/api/products/payment",{products:[e]});if(!t){r.error("Server error. Are you online?");return}const{amount:n,id:T,currency:Z}=t.data,ss={key:"rzp_test_Ao1CK0KgMgwLrb",amount:n.toString(),currency:Z,name:"ShopHub Corp",description:"Test Transaction",image:ds,order_id:T,handler:async function(l){const es={orderCreationId:T,razorpayPaymentId:l.razorpay_payment_id,razorpayOrderId:l.razorpay_order_id,razorpaySignature:l.razorpay_signature};(await o.post("/api/products/payment/success",{paymentDetails:es,products:[e]})).data.status==="Payment successful"&&(r.success("Order Placed!"),p("/account/orders"))},prefill:{name:"",email:"splitter@example.com",contact:"9999999999"},notes:{address:"Razorpay Corporate Office"},theme:{color:"#61dafb"}};new Razorpay(ss).open()}return s.jsxs(s.Fragment,{children:[s.jsx("div",{className:a.details_cnt,children:s.jsxs("div",{className:a.details,children:[s.jsxs("div",{className:a.detail_left,children:[s.jsx("div",{className:a.img_cnt,children:s.jsx("img",{src:e._id?`/api/products/photo/${e==null?void 0:e._id}`:"",alt:e==null?void 0:e.name})}),s.jsxs("div",{className:a.cta_btn_cnt,children:[s.jsxs("button",{onClick:G,className:`${a.add_cart} ${a.btn}`,children:[s.jsx(d,{icon:ns}),"ADD TO CART"]}),s.jsxs("button",{className:`${a.buy_now} ${a.btn}`,onClick:X,children:[s.jsx(d,{icon:rs}),"BUY NOW"]})]})]}),s.jsxs("div",{className:a.detail_right,children:[s.jsx("div",{className:a.p_name,children:e.name}),s.jsxs("div",{className:`${a.rating}`,children:[e.rating,s.jsx(d,{icon:E})]}),s.jsx("div",{className:a.off,children:"Special price"}),s.jsxs("div",{className:a.pd_price,children:[s.jsxs("span",{className:a.pay,children:[" ","₹",e.discount?parseInt(e.price*(100-e.discount)/100):e.price]}),s.jsxs("strike",{children:["₹",e.price]}),s.jsxs("span",{className:a.off,children:[" ",e.discount,"% off"]})]}),s.jsxs("div",{className:a.sec,children:[s.jsx("div",{className:a.secLeft,children:"Delivery"}),s.jsxs("div",{className:a.secRight,children:["Delivery by"," ",(()=>{const c=new Date;c.setDate(Q.getDate()+e.delivery);const t=c.getDate(),n=W[c.getMonth()];return`${t} ${n}`})()," ","| ",s.jsx("span",{className:a.off,children:"Free"})," ",s.jsx("strike",{children:"40"})]})]}),s.jsxs("div",{className:a.sec,children:[s.jsx("div",{className:a.secLeft,children:"Quantity"}),s.jsx("div",{className:a.secRight,children:e.quantity})]}),s.jsxs("div",{className:a.specs_cnt,children:[s.jsx("div",{className:a.spec_heading,children:"Specifications"}),s.jsxs("div",{className:a.specs,children:[((m=e.desc)==null?void 0:m.ram)&&s.jsxs("span",{children:["Ram: ",(h=e.desc)==null?void 0:h.ram]}),((u=e.desc)==null?void 0:u.storage)&&s.jsxs("span",{className:a.grey,children:["Storage: ",(g=e.desc)==null?void 0:g.storage]}),((y=e.desc)==null?void 0:y.camera)&&s.jsxs("span",{className:a.grey,children:["Camera: ",(x=e.desc)==null?void 0:x.camera]}),((j=e.desc)==null?void 0:j.battery)&&s.jsxs("span",{className:a.grey,children:["Battery: ",(f=e.desc)==null?void 0:f.battery]}),((N=e.desc)==null?void 0:N.cpu)&&s.jsxs("span",{className:a.grey,children:["CPU: ",(v=e.desc)==null?void 0:v.cpu]}),((q=e.desc)==null?void 0:q.quantity)&&s.jsxs("span",{className:a.grey,children:["Net Quantity: ",(b=e.desc)==null?void 0:b.quantity]}),((S=e.desc)==null?void 0:S.weight)&&s.jsxs("span",{className:a.grey,children:["Weight: ",(w=e.desc)==null?void 0:w.weight]}),((z=e.desc)==null?void 0:z.type)&&s.jsxs("span",{className:a.grey,children:["Type: ",(D=e.desc)==null?void 0:D.type]}),((P=e.desc)==null?void 0:P.flavor)&&s.jsxs("span",{className:a.grey,children:["Flavor: ",($=e.desc)==null?void 0:$.flavor]}),((k=e.desc)==null?void 0:k.preferrance)&&s.jsxs("span",{className:a.grey,children:["Preferrance: ",(C=e.desc)==null?void 0:C.preferrance]}),((O=e.desc)==null?void 0:O.pack)&&s.jsxs("span",{className:a.grey,children:["Pack: ",(L=e.desc)==null?void 0:L.pack]}),((A=e.desc)==null?void 0:A.warranty)&&s.jsxs("span",{className:a.grey,children:["Warranty: ",(I=e.desc)==null?void 0:I.warranty]}),((R=e==null?void 0:e.desc)==null?void 0:R.size)&&s.jsxs("span",{className:a.grey,children:["Size:"," ",(J=(F=e==null?void 0:e.desc)==null?void 0:F.size)==null?void 0:J.map(c=>c.toUpperCase()+", ")]})]})]})]})]})}),s.jsxs("div",{className:a.similar_products_section,children:[s.jsx("div",{className:a.heading,children:"Similar Products"}),s.jsx("div",{className:a.similar_products_cnt,children:B.map(c=>s.jsxs(is,{to:`/${U}/${c._id}`,target:"_blank",className:a.similar_product,children:[s.jsx("div",{className:a.img_cnt,children:s.jsx("img",{src:`/api/products/photo/${c._id}`,alt:c.name})}),s.jsx("div",{children:c.name.length>61?c.name.substr(0,62)+"...":c.name}),s.jsx("div",{className:a.review,children:s.jsxs("div",{className:a.rating,children:[c.rating,s.jsx(d,{icon:E})]})}),s.jsxs("div",{className:a.price_cnt,children:[s.jsxs("span",{children:["₹",parseInt(c.price*(100-c.discount)/100)]}),s.jsx("strike",{className:a.price,children:c.price}),s.jsxs("span",{className:a.off,children:[c.discount,"% off"]})]})]},c._id))})]})]})};export{Js as default};