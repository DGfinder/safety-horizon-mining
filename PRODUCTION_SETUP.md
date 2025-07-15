# Production Environment Setup Guide

## 🚨 Critical: Environment Variables Required

Your `.env.local` file only works in development. Production needs these variables configured in your hosting platform.

## Required Environment Variables

```env
RESEND_API_KEY=re_EzqK6fJU_7SiDzwWeDoQtv4fK1uPtdtHU
FROM_EMAIL=noreply@crewresourcemining.com.au
TO_EMAIL=info@crewresourcemining.com.au
CC_EMAIL=hayden.george.hamilton@gmail.com
```

## Setup by Hosting Platform:

### 🔷 Vercel
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   - `RESEND_API_KEY` = `re_EzqK6fJU_7SiDzwWeDoQtv4fK1uPtdtHU`
   - `FROM_EMAIL` = `noreply@crewresourcemining.com.au`
   - `TO_EMAIL` = `info@crewresourcemining.com.au`
   - `CC_EMAIL` = `hayden.george.hamilton@gmail.com`
4. Redeploy your application

### 🔷 Netlify
1. Go to Site Settings
2. Click "Environment Variables"
3. Add each variable (same values as above)
4. Redeploy your site

### 🔷 AWS Amplify
1. Go to App Settings → Environment Variables
2. Add each variable
3. Redeploy

### 🔷 Railway
1. Go to Variables tab
2. Add each environment variable
3. Deploy

### 🔷 Heroku
```bash
heroku config:set RESEND_API_KEY=re_EzqK6fJU_7SiDzwWeDoQtv4fK1uPtdtHU
heroku config:set FROM_EMAIL=noreply@crewresourcemining.com.au
heroku config:set TO_EMAIL=info@crewresourcemining.com.au
heroku config:set CC_EMAIL=hayden.george.hamilton@gmail.com
```

### 🔷 cPanel/Traditional Hosting
1. Login to cPanel
2. Find "Environment Variables" or "Node.js"
3. Add each variable
4. Restart your application

## Testing Your Setup

### 1. Test Email Configuration
Visit: `https://yoursite.com/api/test-email` (GET request)

This will show your current configuration without sending an email.

### 2. Send Test Email  
POST to: `https://yoursite.com/api/test-email`

This will attempt to send a test email and show detailed error information.

### 3. Check Logs
Look for detailed error messages in your hosting platform's logs.

## Common Issues & Solutions:

### ❌ "Domain not verified"
- **Problem:** Your domain needs verification in Resend
- **Solution:** Follow `RESEND_DOMAIN_SETUP.md`
- **Quick Fix:** Use `FROM_EMAIL=onboarding@resend.dev` temporarily

### ❌ "Invalid API key"  
- **Problem:** API key not set in production
- **Solution:** Add `RESEND_API_KEY` to your hosting platform

### ❌ "Environment variables not found"
- **Problem:** Variables not configured in production
- **Solution:** Add all required variables to your hosting platform

### ❌ Email works locally but not in production
- **Problem:** `.env.local` only works in development
- **Solution:** Configure environment variables in your hosting platform

## Verification Checklist:

- [ ] Domain verified in Resend dashboard
- [ ] All 4 environment variables added to hosting platform
- [ ] Application redeployed after adding variables
- [ ] Test email endpoint returns success
- [ ] Contact form sends emails successfully

## Support:
- Test endpoint: `GET /api/test-email`
- Test send: `POST /api/test-email`  
- Check server logs for detailed error messages