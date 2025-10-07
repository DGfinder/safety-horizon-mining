import { Resend } from 'resend'

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY || '')

interface WelcomeEmailParams {
  to: string
  name: string
  courseName: string
  loginUrl: string
}

interface ExpiryReminderParams {
  to: string
  name: string
  courseName: string
  daysUntilExpiry: number
  renewalUrl: string
}

interface CertificateIssuedParams {
  to: string
  name: string
  courseName: string
  certificateUrl: string
  expiresAt: Date
}

interface IncidentNotificationParams {
  to: string
  name: string
  incidentNumber: string
  incidentTitle: string
  incidentUrl: string
}

export async function sendWelcomeEmail({
  to,
  name,
  courseName,
  loginUrl,
}: WelcomeEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Safety Horizon <noreply@safetyhorizon.training>',
      to,
      subject: `Welcome to ${courseName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #192135 0%, #EC5C29 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">Welcome to Safety Horizon</h1>
            </div>

            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px;">Hi ${name},</p>

              <p style="font-size: 16px;">
                You've been enrolled in <strong>${courseName}</strong>. This course applies aviation human factors principles to mining operations, helping you develop critical crew resource management skills.
              </p>

              <div style="background: white; border-left: 4px solid #EC5C29; padding: 16px; margin: 20px 0; border-radius: 4px;">
                <h3 style="margin-top: 0; color: #192135;">What You'll Learn</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Communication and team coordination</li>
                  <li>Situational awareness in high-risk environments</li>
                  <li>Decision-making under pressure</li>
                  <li>Leadership and psychological safety</li>
                  <li>Just culture and learning from incidents</li>
                </ul>
              </div>

              <p style="text-align: center; margin: 30px 0;">
                <a href="${loginUrl}" style="display: inline-block; background: #EC5C29; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Start Your Training
                </a>
              </p>

              <p style="font-size: 14px; color: #666; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                Questions? Reply to this email or contact your supervisor for assistance.
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send welcome email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error }
  }
}

export async function sendExpiryReminder({
  to,
  name,
  courseName,
  daysUntilExpiry,
  renewalUrl,
}: ExpiryReminderParams) {
  const urgencyLevel =
    daysUntilExpiry <= 7
      ? { color: '#dc2626', label: 'URGENT' }
      : daysUntilExpiry <= 30
        ? { color: '#ea580c', label: 'ACTION REQUIRED' }
        : { color: '#f59e0b', label: 'REMINDER' }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Safety Horizon <noreply@safetyhorizon.training>',
      to,
      subject: `${urgencyLevel.label}: Your ${courseName} certification expires in ${daysUntilExpiry} days`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: ${urgencyLevel.color}; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">Certification Expiry Notice</h1>
            </div>

            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px;">Hi ${name},</p>

              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 16px; font-weight: bold; color: #92400e;">
                  Your ${courseName} certification will expire in ${daysUntilExpiry} days.
                </p>
              </div>

              <p style="font-size: 16px;">
                To maintain compliance and continue working in regulated areas, you must complete your refresher training before your certification expires.
              </p>

              <div style="background: white; border: 2px solid #e5e7eb; padding: 16px; margin: 20px 0; border-radius: 4px;">
                <h3 style="margin-top: 0; color: #192135;">Why This Matters</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li><strong>Regulatory compliance:</strong> Expired certifications may prevent site access</li>
                  <li><strong>Safety:</strong> Refresher training reinforces critical safety behaviors</li>
                  <li><strong>Team performance:</strong> Updated training includes recent incident learnings</li>
                </ul>
              </div>

              <p style="text-align: center; margin: 30px 0;">
                <a href="${renewalUrl}" style="display: inline-block; background: ${urgencyLevel.color}; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Complete Refresher Training
                </a>
              </p>

              <p style="font-size: 14px; color: #666; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                This is an automated reminder based on your certification expiry date. Contact your supervisor if you have questions.
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send expiry reminder:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending expiry reminder:', error)
    return { success: false, error }
  }
}

export async function sendCertificateIssued({
  to,
  name,
  courseName,
  certificateUrl,
  expiresAt,
}: CertificateIssuedParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Safety Horizon <noreply@safetyhorizon.training>',
      to,
      subject: `Congratulations! Your ${courseName} certificate has been issued`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">🎓 Certificate Issued</h1>
            </div>

            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px;">Hi ${name},</p>

              <p style="font-size: 16px;">
                Congratulations! You've successfully completed <strong>${courseName}</strong> and earned your crew resource management certification.
              </p>

              <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #065f46;">
                  <strong>Certificate Valid Until:</strong>
                </p>
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #047857;">
                  ${new Date(expiresAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              <div style="background: white; border: 2px solid #e5e7eb; padding: 16px; margin: 20px 0; border-radius: 4px;">
                <h3 style="margin-top: 0; color: #192135;">What's Next?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Apply your CRM skills in daily operations</li>
                  <li>Share learnings with your crew</li>
                  <li>Report near-misses using your situational awareness training</li>
                  <li>Schedule your refresher training before expiry</li>
                </ul>
              </div>

              <p style="text-align: center; margin: 30px 0;">
                <a href="${certificateUrl}" style="display: inline-block; background: #059669; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Download Certificate (PDF)
                </a>
              </p>

              <p style="font-size: 14px; color: #666; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                Your certificate is digitally signed and includes a QR code for verification. Keep a copy for your records.
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send certificate email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending certificate email:', error)
    return { success: false, error }
  }
}

export async function sendIncidentNotification({
  to,
  name,
  incidentNumber,
  incidentTitle,
  incidentUrl,
}: IncidentNotificationParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Safety Horizon <noreply@safetyhorizon.training>',
      to,
      subject: `New Training Scenario Available: ${incidentNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ea580c 0%, #f59e0b 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">⚠️ Learn from Real Incidents</h1>
            </div>

            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px;">Hi ${name},</p>

              <p style="font-size: 16px;">
                A new training scenario has been created based on a recent incident at your organization.
              </p>

              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #92400e;">
                  <strong>Incident Reference:</strong>
                </p>
                <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #78350f;">
                  ${incidentNumber}
                </p>
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                  ${incidentTitle}
                </p>
              </div>

              <div style="background: white; border: 2px solid #e5e7eb; padding: 16px; margin: 20px 0; border-radius: 4px;">
                <h3 style="margin-top: 0; color: #192135;">Aviation Best Practice</h3>
                <p style="margin: 0; font-size: 14px;">
                  Airlines convert every incident into mandatory scenario training within 30 days. This ensures the entire organization learns from near-misses before they become fatalities. Complete this scenario to understand what happened and how to prevent similar incidents.
                </p>
              </div>

              <p style="text-align: center; margin: 30px 0;">
                <a href="${incidentUrl}" style="display: inline-block; background: #ea580c; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Start Training Scenario
                </a>
              </p>

              <p style="font-size: 14px; color: #666; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                This scenario is based on real events at your site. Completion may be required for continued site access.
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send incident notification:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending incident notification:', error)
    return { success: false, error }
  }
}

export async function sendBulkExpiryReminders() {
  // This would be called by a cron job (e.g., Vercel Cron or GitHub Actions)
  // to check for certifications expiring in 30, 60, or 90 days
  console.log('Bulk expiry reminder job - implement with cron scheduler')
}
