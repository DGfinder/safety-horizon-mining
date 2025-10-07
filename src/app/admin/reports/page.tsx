import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileText, Users, Award, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'
import BulkCertificateDownload from '@/components/admin/BulkCertificateDownload'

async function getReportsData() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { org: { include: { settings: true } } },
  })

  if (!user || user.role !== 'ADMIN') {
    redirect('/lms')
  }

  // Get org-wide statistics
  const totalUsers = await prisma.user.count({ where: { orgId: user.orgId! } })
  const totalEnrollments = await prisma.enrollment.count({
    where: { course: { orgId: user.orgId! } },
  })
  const completedEnrollments = await prisma.enrollment.count({
    where: { course: { orgId: user.orgId! }, status: 'COMPLETED' },
  })
  const activeCertificates = await prisma.certificate.count({
    where: { enrollment: { course: { orgId: user.orgId! } }, isActive: true },
  })

  // Get sites for filtering
  const sites = await prisma.site.findMany({
    where: { orgId: user.orgId! },
    include: { _count: { select: { users: true } } },
    orderBy: { name: 'asc' },
  })

  // Get courses
  const courses = await prisma.course.findMany({
    where: { orgId: user.orgId! },
    orderBy: { title: 'asc' },
  })

  return {
    user,
    stats: {
      totalUsers,
      totalEnrollments,
      completedEnrollments,
      activeCertificates,
    },
    sites,
    courses,
  }
}

export default async function ReportsPage() {
  const { user, stats, sites, courses } = await getReportsData()

  const reportTypes = [
    {
      id: 'compliance-summary',
      title: 'Compliance Summary',
      description: 'Org-wide training compliance status',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      endpoint: '/api/admin/reports/compliance-summary',
    },
    {
      id: 'certification-status',
      title: 'Certification Status',
      description: 'Active certificates and expiry dates',
      icon: Award,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      endpoint: '/api/admin/reports/certification-status',
    },
    {
      id: 'user-roster',
      title: 'User Roster',
      description: 'Complete user list with roles and sites',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      endpoint: '/api/admin/reports/user-roster',
    },
    {
      id: 'training-history',
      title: 'Training History',
      description: 'Module attempts and scores by user',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      endpoint: '/api/admin/reports/training-history',
    },
    {
      id: 'expiry-forecast',
      title: 'Expiry Forecast',
      description: 'Certificates expiring in next 30/60/90 days',
      icon: Calendar,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      endpoint: '/api/admin/reports/expiry-forecast',
    },
    {
      id: 'competency-matrix',
      title: 'Competency Matrix',
      description: 'Skills matrix by role and module',
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      endpoint: '/api/admin/reports/competency-matrix',
    },
  ]

  return (
    <AdminLayout currentPage="reports">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Compliance Reports</h1>
          <p className="text-slate-600 mt-1">
            Generate audit-ready reports for regulatory compliance
          </p>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalEnrollments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.completedEnrollments}</div>
              <p className="text-xs text-slate-500 mt-1">
                {stats.totalEnrollments > 0
                  ? Math.round((stats.completedEnrollments / stats.totalEnrollments) * 100)
                  : 0}
                % completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Certs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.activeCertificates}</div>
            </CardContent>
          </Card>
        </div>

        {/* Report Types */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTypes.map((report) => {
                const Icon = report.icon
                return (
                  <Link
                    key={report.id}
                    href={`/admin/reports/${report.id}`}
                    className={`p-6 border-2 ${report.borderColor} ${report.bgColor} rounded-lg hover:shadow-md transition-all cursor-pointer`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Icon className={`w-8 h-8 ${report.color}`} />
                      <Download className="w-5 h-5 text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{report.title}</h3>
                    <p className="text-sm text-slate-600">{report.description}</p>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Site Filters */}
        {sites.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Filter by Site</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {sites.map((site) => (
                  <div
                    key={site.id}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="font-semibold text-slate-900">{site.name}</div>
                    <div className="text-sm text-slate-600 mt-1">
                      {site.siteType.replace('_', ' ')} • {site._count.users} users
                    </div>
                    <Link
                      href={`/admin/reports?siteId=${site.id}`}
                      className="text-sm text-[#EC5C29] hover:underline mt-2 inline-block"
                    >
                      View site reports →
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bulk Certificate Download */}
        <BulkCertificateDownload sites={sites} courses={courses} />

        {/* Quick Export */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Export all compliance data for external analysis or regulatory submission
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="/api/admin/reports/full-export?format=csv"
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-semibold inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export as CSV
                </a>
                <a
                  href="/api/admin/reports/full-export?format=pdf"
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export as PDF
                </a>
                <a
                  href="/api/admin/reports/full-export?format=xlsx"
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export as Excel
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
