import{G as b,j as e,H as $,r as l,h as w,b as k,L as C,F as v,I as y,z as E,J as S,K as A,M as I,e as U,_ as j}from"./index-e4b7f291.js";const F="/assets/profile-e4e50203.svg",M="/assets/profile-bg-e065bee7.png",P="_input_heading_1ddm6_1",R="_edit_btn_1ddm6_19",O="_input_cnt_1ddm6_33",B="_edit_disable_1ddm6_73",D="_save_btn_1ddm6_85",r={input_heading:P,edit_btn:R,input_cnt:O,edit_disable:B,save_btn:D},g=({heading:c,field:i,setField:d,updateUserCredentials:_})=>{const o=b(),h=a=>{d(m=>({...m,value:a.target.value}))},u=()=>{o($({[i.name]:i.value})),d(a=>({...a,edit:!a.edit})),_()};return e.jsxs("div",{children:[e.jsxs("div",{className:r.input_heading,children:[c,e.jsx("div",{className:r.edit_btn,onClick:()=>d(a=>({...a,edit:!a.edit})),children:i.edit?"Cancel":"Edit"})]}),e.jsxs("div",{className:`${r.input_cnt} ${i.edit?"":r.edit_disable}`,children:[e.jsx("input",{type:"text",value:i.value,placeholder:"Edit User name",onChange:h,disabled:!i.edit}),i.edit&&e.jsx("div",{className:r.save_btn,onClick:u,children:"SAVE"})]})]})},L="_profile_cnt_tnrna_1",T="_profile_left_tnrna_15",G="_title_tnrna_25",H="_user_tnrna_43",z="_settings_tnrna_53",J="_setting_sec_tnrna_61",K="_head_tnrna_69",V="_set_tnrna_53",Y="_active_tnrna_121",q="_link_tnrna_131",Q="_profile_right_tnrna_155",W="_edit_details_tnrna_173",X="_bg_white_shdw_tnrna_189",Z="_d_flex_tnrna_201",s={profile_cnt:L,profile_left:T,title:G,user:H,settings:z,setting_sec:J,head:K,set:V,active:Y,link:q,profile_right:Q,edit_details:W,bg_white_shdw:X,d_flex:Z},se=()=>{const[c,i]=l.useState("profile"),[d,_]=l.useState({edit:!1,value:"",name:"username"}),[o,h]=l.useState({edit:!1,value:"",name:"email"}),[u,a]=l.useState({edit:!1,value:"",name:"phone"}),[m,x]=l.useState({edit:!1,value:"",name:"address"}),{user:n}=w(t=>t.user),N=b(),f=k(),p=async()=>{try{const{data:t}=await U.put("/api/auth/update-user",{username:d.value,email:o.value,phone:u.value,address:m.value});t&&j.success("Account Details Updated!")}catch(t){j.error(t.response.data.message)}};return l.useEffect(()=>{n?(_(t=>({...t,value:n.username})),h(t=>({...t,value:n.email})),a(t=>({...t,value:n.phone})),x(t=>({...t,value:n.address}))):f("/login")},[n]),e.jsxs("div",{className:s.profile_cnt,children:[e.jsxs("div",{className:s.profile_left,children:[e.jsxs("div",{className:`${s.title} ${s.bg_white_shdw}`,children:[e.jsx("img",{src:F,alt:"profile",width:50,height:50}),e.jsxs("div",{children:[e.jsx("div",{children:"Hello,"}),e.jsx("div",{className:s.user,children:n==null?void 0:n.username})]})]}),e.jsxs("div",{className:`${s.settings} ${s.bg_white_shdw}`,children:[e.jsx("div",{className:`${s.setting_sec} ${s.link}`,children:e.jsxs(C,{to:"/account/orders",style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsxs("div",{className:s.head,children:[e.jsx(v,{icon:y}),e.jsx("div",{children:"MY ORDERS"})]}),e.jsx(v,{icon:E,color:"grey",style:{marginRight:"20px"}})]})}),e.jsxs("div",{className:`${s.setting_sec}`,children:[e.jsxs("div",{className:s.head,children:[e.jsx(v,{icon:S}),e.jsx("div",{children:"ACCOUNT SETTINGS"})]}),e.jsx("div",{className:`${s.set} ${c==="profile"?s.active:""}`,onClick:()=>i("profile"),children:"Profile Information"}),e.jsx("div",{className:`${s.set} ${c==="address"?s.active:""}`,onClick:()=>i("address"),children:"Manage Addresses"})]}),e.jsx("div",{className:`${s.setting_sec} ${s.link}`,onClick:()=>{N(A()),f("/")},children:e.jsxs("div",{className:s.head,children:[e.jsx(v,{icon:I}),e.jsx("div",{children:"Logout"})]})})]})]}),e.jsx("div",{className:`${s.profile_right} ${s.bg_white_shdw}`,children:c==="profile"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:s.edit_details,children:[e.jsx(g,{heading:"Personal Information",field:d,setField:_,updateUserCredentials:p}),e.jsx(g,{heading:"Email Address",field:o,setField:h,updateUserCredentials:p}),e.jsx(g,{heading:"Mobile Number",field:u,setField:a,updateUserCredentials:p})]}),e.jsx("img",{src:M,alt:"profile-background"})]}):e.jsx("div",{className:s.edit_details,children:e.jsx(g,{heading:"Manage Addresses",field:m,setField:x,updateUserCredentials:p})})})]})};export{se as default};
