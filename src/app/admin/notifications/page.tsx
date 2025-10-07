import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import NotificationManager from '@/components/admin/NotificationManager'

async function getNotificationData() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user || user.role !== 'ADMIN') {
    redirect('/lms')
  }

  // Get recent email logs
  const emailLogs = await prisma.emailLog.findMany({
    take: 100,
    orderBy: { sentAt: 'desc' },
    include: {
      user: true,
      certificate: {
        include: {
          enrollment: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  })

  // Get org settings for email configuration
  const orgSettings = await prisma.orgSettings.findFirst({
    where: { orgId: user.orgId! },
  })

  // Get upcoming expiry reminders
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const upcomingReminders = await prisma.certificate.findMany({
    where: {
      expiresAt: {
        gte: now,
        lte: thirtyDaysFromNow,
      },
      isActive: true,
    },
    include: {
      enrollment: {
        include: {
          user: true,
          course: true,
        },
      },
    },
    orderBy: {
      expiresAt: 'asc',
    },
  })

  return {
    user,
    emailLogs,
    orgSettings,
    upcomingReminders,
  }
}

export default async function NotificationsPage() {
  const { emailLogs, orgSettings, upcomingReminders } = await getNotificationData()

  return (
    <AdminLayout currentPage="notifications">
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Email Notifications</h1>
          <p className="text-slate-600 mt-1">
            Monitor sent emails and configure automated notification settings
          </p>
        </div>

        <NotificationManager
          emailLogs={emailLogs}
          orgSettings={orgSettings}
          upcomingReminders={upcomingReminders}
        />
      </div>
    </AdminLayout>
  )
}
