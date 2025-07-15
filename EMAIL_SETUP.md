# Email Setup Instructions

## Contact Form Email Integration

The contact form is now configured to send email notifications using [Resend](https://resend.com).

### Setup Steps:

1. **Sign up for Resend**
   - Go to [resend.com](https://resend.com)
   - Create a free account
   - Verify your domain (or use their testing domain for development)

2. **Get API Key**
   - Go to your Resend dashboard
   - Navigate to API Keys
   - Create a new API key
   - Copy the API key

3. **Configure Environment Variables**
   - Update `.env.local` with your actual values:
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   FROM_EMAIL=noreply@crewresourcemining.com.au
   TO_EMAIL=info@crewresourcemining.com.au
   ```

4. **Domain Setup (Production)**
   - For production, you'll need to:
     - Add your domain to Resend
     - Verify domain ownership via DNS records
     - Update FROM_EMAIL to use your verified domain

### Testing

- The form will work without a valid API key (it will log an error but still respond successfully)
- With a valid API key, emails will be sent to the TO_EMAIL address
- Form submissions are always logged to the console for debugging

### Current Features

✅ **Form Validation**: Client and server-side validation  
✅ **Rate Limiting**: 5 submissions per 15 minutes per IP  
✅ **Bot Protection**: Honeypot field for spam detection  
✅ **Security**: Input sanitization and XSS protection  
✅ **Email Notifications**: HTML and plain text emails  
✅ **Error Handling**: Graceful degradation if email fails  

### Email Template

The notification email includes:
- Sender's name, email, and company
- Message content
- Reply-to header set to sender's email
- Professional HTML formatting