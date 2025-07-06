import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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
    
    // Log successful submission (in production, save to database/send email)
    console.log('Valid contact form submission:', {
      ...sanitizedData,
      ip,
      timestamp: new Date().toISOString(),
    });
    
    // Here you would integrate with email service (SendGrid, Resend, etc.)
    // await sendNotificationEmail(sanitizedData);
    
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