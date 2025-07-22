import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      FROM_EMAIL: !!process.env.FROM_EMAIL,
      TO_EMAIL: !!process.env.TO_EMAIL,
      CC_EMAIL: !!process.env.CC_EMAIL,
    };

    const missingEnvVars = Object.entries(envCheck)
      .filter(([key, exists]) => !exists)
      .map(([key]) => key);

    if (missingEnvVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        missingVars: missingEnvVars,
        envCheck
      }, { status: 500 });
    }

    // Get email configuration
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    const toEmail = process.env.TO_EMAIL || 'test@example.com';
    const ccEmail = process.env.CC_EMAIL;

    console.log('Testing email with config:', {
      from: fromEmail,
      to: toEmail,
      cc: ccEmail,
      hasApiKey: !!process.env.RESEND_API_KEY
    });

    // Test email content
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      company: 'Test Company',
      message: 'This is a test email to verify the email system is working correctly.'
    };

    // Check if Resend is initialized
    if (!resend) {
      return NextResponse.json({
        success: false,
        error: 'Email service not configured - missing RESEND_API_KEY',
        config: {
          from: fromEmail,
          to: toEmail,
          cc: ccEmail,
          hasApiKey: false,
          timestamp: new Date().toISOString()
        }
      }, { status: 500 });
    }

    // Send test email
    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      cc: ccEmail ? [ccEmail] : undefined,
      replyTo: testData.email,
      subject: `🧪 Test Email - ${new Date().toLocaleString()}`,
      html: `
        <h2>✅ Email System Test</h2>
        <p>This is a test email to verify your email configuration is working correctly.</p>
        
        <h3>Test Data:</h3>
        <p><strong>Name:</strong> ${testData.name}</p>
        <p><strong>Email:</strong> ${testData.email}</p>
        <p><strong>Company:</strong> ${testData.company}</p>
        <p><strong>Message:</strong> ${testData.message}</p>
        
        <h3>Email Configuration:</h3>
        <p><strong>From:</strong> ${fromEmail}</p>
        <p><strong>To:</strong> ${toEmail}</p>
        <p><strong>CC:</strong> ${ccEmail || 'None'}</p>
        
        <hr>
        <p><em>Test sent at: ${new Date().toISOString()}</em></p>
        <p><em>If you received this email, your email system is working correctly! 🎉</em></p>
      `,
      text: `
Email System Test

This is a test email to verify your email configuration is working correctly.

Test Data:
Name: ${testData.name}
Email: ${testData.email}
Company: ${testData.company}
Message: ${testData.message}

Email Configuration:
From: ${fromEmail}
To: ${toEmail}
CC: ${ccEmail || 'None'}

Test sent at: ${new Date().toISOString()}
If you received this email, your email system is working correctly!
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      emailResult: {
        id: emailResult.data?.id,
        timestamp: new Date().toISOString()
      },
      config: {
        from: fromEmail,
        to: toEmail,
        cc: ccEmail,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Test email failed:', error);
    
    // Provide detailed error information
    let errorDetails = 'Unknown error';
    let errorCode = 'UNKNOWN';
    
    if (error.message) {
      errorDetails = error.message;
    }
    
    if (error.message?.includes('domain')) {
      errorCode = 'DOMAIN_NOT_VERIFIED';
      errorDetails = 'Domain not verified in Resend. Please verify your domain first.';
    } else if (error.message?.includes('API key')) {
      errorCode = 'INVALID_API_KEY';
      errorDetails = 'Invalid Resend API key. Please check your API key.';
    } else if (error.message?.includes('rate limit')) {
      errorCode = 'RATE_LIMITED';
      errorDetails = 'Rate limited. Please wait before sending another test email.';
    }

    return NextResponse.json({
      success: false,
      error: errorDetails,
      errorCode,
      rawError: error.message,
      config: {
        from: process.env.FROM_EMAIL,
        to: process.env.TO_EMAIL,
        cc: process.env.CC_EMAIL,
        hasApiKey: !!process.env.RESEND_API_KEY,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

// GET endpoint for testing configuration without sending email
export async function GET() {
  const config = {
    hasResendApiKey: !!process.env.RESEND_API_KEY,
    fromEmail: process.env.FROM_EMAIL || 'Not set',
    toEmail: process.env.TO_EMAIL || 'Not set', 
    ccEmail: process.env.CC_EMAIL || 'Not set',
    timestamp: new Date().toISOString()
  };

  return NextResponse.json({
    message: 'Email configuration check',
    config,
    ready: config.hasResendApiKey && 
           process.env.FROM_EMAIL && 
           process.env.TO_EMAIL
  });
}