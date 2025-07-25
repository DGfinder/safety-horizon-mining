import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Input validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address').max(255, 'Email too long'),
  company: z.string().min(2, 'Company must be at least 2 characters').max(200, 'Company too long'),
  message: z.string().max(2000, 'Message too long').optional(),
  honeypot: z.string().optional(), // Bot detection
});

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // 5 requests per window

  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

// Input sanitization
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Email sending function
async function sendNotificationEmail(data: {
  name: string;
  email: string;
  company: string;
  message: string;
}) {
  if (!resend) {
    throw new Error('Email service not configured - missing RESEND_API_KEY');
  }

  const fromEmail = process.env.FROM_EMAIL || 'noreply@crewresourcemining.com.au';
  const toEmail = process.env.TO_EMAIL || 'info@crewresourcemining.com.au';
  const ccEmail = process.env.CC_EMAIL;
  
  try {
    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      cc: ccEmail ? [ccEmail] : undefined,
      replyTo: data.email,
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company & Role:</strong> ${data.company}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message || 'No message provided'}</p>
        <hr>
        <p><em>Submitted via crewresourcemining.com.au contact form</em></p>
      `,
      text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Company & Role: ${data.company}
Message: ${data.message || 'No message provided'}

Submitted via crewresourcemining.com.au contact form
      `
    });
    
    return emailResult;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = contactSchema.parse(body);
    
    // Bot detection - if honeypot field is filled, it's likely a bot
    if (validatedData.honeypot && validatedData.honeypot.trim() !== '') {
      console.log('Bot detected:', { ip, honeypot: validatedData.honeypot });
      return NextResponse.json(
        { message: 'Form submitted successfully' }, // Don't reveal bot detection
        { status: 200 }
      );
    }
    
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(validatedData.name),
      email: validatedData.email, // Email validation already ensures safety
      company: sanitizeInput(validatedData.company),
      message: validatedData.message ? sanitizeInput(validatedData.message) : '',
    };
    
    // Log successful submission
    console.log('Valid contact form submission:', {
      ...sanitizedData,
      ip,
      timestamp: new Date().toISOString(),
    });
    
    // Send notification email
    let emailSent = false;
    let emailError = null;
    
    try {
      const emailResult = await sendNotificationEmail(sanitizedData);
      console.log('Notification email sent successfully:', {
        id: emailResult.data?.id,
        timestamp: new Date().toISOString()
      });
      emailSent = true;
    } catch (error: any) {
      emailError = error.message || 'Unknown email error';
      console.error('Failed to send notification email:', {
        error: emailError,
        data: sanitizedData,
        config: {
          hasApiKey: !!process.env.RESEND_API_KEY,
          fromEmail: process.env.FROM_EMAIL,
          toEmail: process.env.TO_EMAIL,
          ccEmail: process.env.CC_EMAIL
        }
      });
      
      // Log specific error types for debugging
      if (error.message?.includes('domain')) {
        console.error('DOMAIN ERROR: Please verify your domain in Resend dashboard');
      } else if (error.message?.includes('API key')) {
        console.error('API KEY ERROR: Invalid Resend API key');
      }
    }
    
    return NextResponse.json(
      { message: 'Thank you for your inquiry! We\'ll contact you within 24 hours.' },
      { status: 200 }
    );
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}