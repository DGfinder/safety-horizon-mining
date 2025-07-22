"use strict";(()=>{var e={};e.id=528,e.ids=[528],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1212:e=>{e.exports=require("async_hooks")},4770:e=>{e.exports=require("crypto")},6162:e=>{e.exports=require("stream")},1764:e=>{e.exports=require("util")},3757:e=>{e.exports=import("prettier/plugins/html")},5747:e=>{e.exports=import("prettier/standalone")},4492:e=>{e.exports=require("node:stream")},6119:(e,s,t)=>{t.r(s),t.d(s,{originalPathname:()=>y,patchFetch:()=>I,requestAsyncStorage:()=>g,routeModule:()=>u,serverHooks:()=>d,staticGenerationAsyncStorage:()=>E});var r={};t.r(r),t.d(r,{GET:()=>l,POST:()=>c});var o=t(9303),n=t(8716),i=t(670),a=t(7070),m=t(2723);let p=process.env.RESEND_API_KEY?new m.R(process.env.RESEND_API_KEY):null;async function c(e){try{let e={RESEND_API_KEY:!!process.env.RESEND_API_KEY,FROM_EMAIL:!!process.env.FROM_EMAIL,TO_EMAIL:!!process.env.TO_EMAIL,CC_EMAIL:!!process.env.CC_EMAIL},s=Object.entries(e).filter(([e,s])=>!s).map(([e])=>e);if(s.length>0)return a.NextResponse.json({success:!1,error:"Missing environment variables",missingVars:s,envCheck:e},{status:500});let t=process.env.FROM_EMAIL||"onboarding@resend.dev",r=process.env.TO_EMAIL||"test@example.com",o=process.env.CC_EMAIL;console.log("Testing email with config:",{from:t,to:r,cc:o,hasApiKey:!!process.env.RESEND_API_KEY});let n={name:"Test User",email:"test@example.com",company:"Test Company",message:"This is a test email to verify the email system is working correctly."};if(!p)return a.NextResponse.json({success:!1,error:"Email service not configured - missing RESEND_API_KEY",config:{from:t,to:r,cc:o,hasApiKey:!1,timestamp:new Date().toISOString()}},{status:500});let i=await p.emails.send({from:t,to:[r],cc:o?[o]:void 0,replyTo:n.email,subject:`🧪 Test Email - ${new Date().toLocaleString()}`,html:`
        <h2>✅ Email System Test</h2>
        <p>This is a test email to verify your email configuration is working correctly.</p>
        
        <h3>Test Data:</h3>
        <p><strong>Name:</strong> ${n.name}</p>
        <p><strong>Email:</strong> ${n.email}</p>
        <p><strong>Company:</strong> ${n.company}</p>
        <p><strong>Message:</strong> ${n.message}</p>
        
        <h3>Email Configuration:</h3>
        <p><strong>From:</strong> ${t}</p>
        <p><strong>To:</strong> ${r}</p>
        <p><strong>CC:</strong> ${o||"None"}</p>
        
        <hr>
        <p><em>Test sent at: ${new Date().toISOString()}</em></p>
        <p><em>If you received this email, your email system is working correctly! 🎉</em></p>
      `,text:`
Email System Test

This is a test email to verify your email configuration is working correctly.

Test Data:
Name: ${n.name}
Email: ${n.email}
Company: ${n.company}
Message: ${n.message}

Email Configuration:
From: ${t}
To: ${r}
CC: ${o||"None"}

Test sent at: ${new Date().toISOString()}
If you received this email, your email system is working correctly!
      `});return a.NextResponse.json({success:!0,message:"Test email sent successfully!",emailResult:{id:i.data?.id,timestamp:new Date().toISOString()},config:{from:t,to:r,cc:o,timestamp:new Date().toISOString()}})}catch(t){console.error("Test email failed:",t);let e="Unknown error",s="UNKNOWN";return t.message&&(e=t.message),t.message?.includes("domain")?(s="DOMAIN_NOT_VERIFIED",e="Domain not verified in Resend. Please verify your domain first."):t.message?.includes("API key")?(s="INVALID_API_KEY",e="Invalid Resend API key. Please check your API key."):t.message?.includes("rate limit")&&(s="RATE_LIMITED",e="Rate limited. Please wait before sending another test email."),a.NextResponse.json({success:!1,error:e,errorCode:s,rawError:t.message,config:{from:process.env.FROM_EMAIL,to:process.env.TO_EMAIL,cc:process.env.CC_EMAIL,hasApiKey:!!process.env.RESEND_API_KEY,timestamp:new Date().toISOString()}},{status:500})}}async function l(){let e={hasResendApiKey:!!process.env.RESEND_API_KEY,fromEmail:process.env.FROM_EMAIL||"Not set",toEmail:process.env.TO_EMAIL||"Not set",ccEmail:process.env.CC_EMAIL||"Not set",timestamp:new Date().toISOString()};return a.NextResponse.json({message:"Email configuration check",config:e,ready:e.hasResendApiKey&&process.env.FROM_EMAIL&&process.env.TO_EMAIL})}let u=new o.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/test-email/route",pathname:"/api/test-email",filename:"route",bundlePath:"app/api/test-email/route"},resolvedPagePath:"/mnt/c/Users/HaydenHamilton/Downloads/safety-horizon-mining/src/app/api/test-email/route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:g,staticGenerationAsyncStorage:E,serverHooks:d}=u,y="/api/test-email/route";function I(){return(0,i.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:E})}}};var s=require("../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),r=s.X(0,[276,438],()=>t(6119));module.exports=r})();