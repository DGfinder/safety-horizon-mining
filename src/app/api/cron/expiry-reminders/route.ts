import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendExpiryReminder } from '@/lib/email'

export const dynamic = 'force-dynamic'

// This endpoint should be called by a cron job (Vercel Cron, GitHub Actions, etc.)
// Add CRON_SECRET to your environment variables for security
export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)

    // Find all certificates expiring in the next 90 days
    const expiringCertificates = await prisma.certificate.findMany({
      where: {
        expiresAt: {
          gte: now,
          lte: ninetyDaysFromNow,
        },
      },
      include: {
        enrollment: {
          include: {
            user: true,
            course: true,
          },
        },
      },
    })

    const remindersSent: Array<{ userId: string; email: string; daysUntilExpiry: number }> = []
    const errors: Array<{ userId: string; error: string }> = []

    for (const cert of expiringCertificates) {
      const daysUntilExpiry = Math.ceil(
        (new Date(cert.expiresAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )

      // Send reminders at 90, 60, 30, 14, 7, 3, and 1 day intervals
      const reminderDays = [90, 60, 30, 14, 7, 3, 1]
      const shouldSendReminder = reminderDays.includes(daysUntilExpiry)

      if (!shouldSendReminder) continue

      // Check if we already sent a reminder today
      const reminderSentToday = await prisma.emailLog.findFirst({
        where: {
          userId: cert.enrollment.user.id,
          emailType: 'EXPIRY_REMINDER',
          certificateId: cert.id,
          sentAt: {
            gte: new Date(now.setHours(0, 0, 0, 0)),
          },
        },
      })

      if (reminderSentToday) continue

      // Send the reminder
      const result = await sendExpiryReminder({
        to: cert.enrollment.user.email,
        name: cert.enrollment.user.name || cert.enrollment.user.email,
        courseName: cert.enrollment.course.title,
        daysUntilExpiry,
        renewalUrl: `${process.env.NEXT_PUBLIC_APP_URL}/lms/courses/${cert.enrollment.course.slug}`,
      })

      if (result.success) {
        // Log the sent email
        await prisma.emailLog.create({
          data: {
            userId: cert.enrollment.user.id,
            emailType: 'EXPIRY_REMINDER',
            certificateId: cert.id,
            sentAt: new Date(),
            metadata: {
              daysUntilExpiry,
              courseTitle: cert.enrollment.course.title,
            },
          },
        })

        remindersSent.push({
          userId: cert.enrollment.user.id,
          email: cert.enrollment.user.email,
          daysUntilExpiry,
        })
      } else {
        errors.push({
          userId: cert.enrollment.user.id,
          error: String(result.error),
        })
      }
    }

    return NextResponse.json({
      success: true,
      remindersSent: remindersSent.length,
      errors: errors.length,
      details: {
        remindersSent,
        errors,
      },
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send expiry reminders',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
