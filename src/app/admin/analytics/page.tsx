import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'

async function getAnalyticsData() {
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

  // Get all enrollments with completion data
  const enrollments = await prisma.enrollment.findMany({
    include: {
      user: {
        include: {
          site: true,
          crew: true,
        },
      },
      course: true,
      moduleProgress: {
        include: {
          module: true,
        },
      },
      certificates: true,
    },
  })

  // Get all incidents
  const incidents = await prisma.incident.findMany({
    include: {
      site: true,
      reportedBy: true,
    },
    orderBy: {
      incidentDate: 'desc',
    },
  })

  // Get sites with crew data
  const sites = await prisma.site.findMany({
    include: {
      crews: {
        include: {
          members: {
            include: {
              enrollments: {
                include: {
                  moduleProgress: true,
                },
              },
            },
          },
        },
      },
    },
  })

  return {
    user,
    enrollments,
    incidents,
    sites,
  }
}

export default async function AnalyticsPage() {
  const { enrollments, incidents, sites } = await getAnalyticsData()

  return (
    <AdminLayout currentPage="analytics">
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Advanced Analytics</h1>
          <p className="text-slate-600 mt-1">
            Training effectiveness, safety correlation, and predictive insights
          </p>
        </div>

        <AnalyticsDashboard
          enrollments={enrollments}
          incidents={incidents}
          sites={sites}
        />
      </div>
    </AdminLayout>
  )
}
