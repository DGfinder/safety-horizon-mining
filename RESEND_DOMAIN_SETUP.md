# Resend Domain Verification Setup

## 🚨 Critical: Domain Verification Required

Your email isn't sending because `@crewresourcemining.com.au` needs to be verified in Resend.

## Setup Steps:

### 1. Login to Resend Dashboard
- Go to [resend.com/domains](https://resend.com/domains)
- Click "Add Domain"

### 2. Add Your Domain
- Enter: `crewresourcemining.com.au`
- Select "Send emails from this domain"

### 3. DNS Records to Add
Resend will provide these DNS records to add to your domain:

**SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

**DKIM Record:**
```
Type: TXT  
Name: resend._domainkey
Value: [provided by Resend]
```

**DMARC Record (Optional but recommended):**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@crewresourcemining.com.au
```

### 4. Verify Domain
- Wait 24-48 hours for DNS propagation
- Click "Verify" in Resend dashboard
- Status should show "Verified"

## Alternative: Use Resend Test Domain (Immediate)

For immediate testing, use Resend's test domain:

```env
FROM_EMAIL=onboarding@resend.dev
```

⚠️ **Note:** Test domain emails may go to spam and have limitations.

## Production Environment Variables

Your hosting platform needs these environment variables:

```env
RESEND_API_KEY=re_EzqK6fJU_7SiDzwWeDoQtv4fK1uPtdtHU
FROM_EMAIL=noreply@crewresourcemining.com.au
TO_EMAIL=info@crewresourcemining.com.au  
CC_EMAIL=hayden.george.hamilton@gmail.com
```

## Common Hosting Platforms:

**Vercel:**
- Go to Project Settings → Environment Variables
- Add each variable

**Netlify:**
- Go to Site Settings → Environment Variables  
- Add each variable

**cPanel/Traditional Hosting:**
- Contact your hosting provider
- Add environment variables to your hosting control panel

## Testing Email Setup

Use the test endpoint: `POST /api/test-email` to debug email issues.