import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'

async function getComplianceData() {
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

  const users = await prisma.user.findMany({
    where: { orgId: user.orgId },
    include: {
      site: true,
      crew: true,
      enrollments: {
        include: {
          course: true,
          moduleAttempts: {
            include: { module: true },
            where: { passed: true },
          },
          certificates: {
            where: { isActive: true },
            orderBy: { issuedAt: 'desc' },
            take: 1,
          },
        },
      },
    },
    orderBy: [{ name: 'asc' }, { email: 'asc' }],
  })

  const complianceData = users.map((u) => {
    const enrollment = u.enrollments[0]
    const cert = enrollment?.certificates[0]
    const totalModules = 12
    const completedModules = enrollment?.moduleAttempts.length || 0
    const progressPercent = Math.round((completedModules / totalModules) * 100)

    let daysUntilExpiry: number | null = null
    if (cert) {
      daysUntilExpiry = Math.ceil(
        (new Date(cert.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    }

    const isCompliant = enrollment?.status === 'COMPLETED' && daysUntilExpiry && daysUntilExpiry > 0
    const isExpiringSoon = daysUntilExpiry && daysUntilExpiry <= 30 && daysUntilExpiry > 0
    const isOverdue = enrollment?.status === 'OVERDUE'
    const isExpired = daysUntilExpiry && daysUntilExpiry <= 0

    return {
      id: u.id,
      employeeId: u.employeeId,
      name: u.name || u.email,
      email: u.email,
      jobTitle: u.jobTitle,
      department: u.department,
      site: u.site?.name,
      crew: u.crew?.name,
      status: enrollment?.status || 'NOT_ENROLLED',
      progressPercent,
      completedModules,
      totalModules,
      certificateSerial: cert?.serial,
      certificateExpires: cert?.expiresAt,
      daysUntilExpiry,
      isCompliant,
      isExpiringSoon,
      isOverdue,
      isExpired,
    }
  })

  const stats = {
    total: complianceData.length,
    compliant: complianceData.filter((d) => d.isCompliant).length,
    expiringSoon: complianceData.filter((d) => d.isExpiringSoon).length,
    overdue: complianceData.filter((d) => d.isOverdue).length,
    notEnrolled: complianceData.filter((d) => d.status === 'NOT_ENROLLED').length,
  }

  // Sort: overdue → expiring soon → not enrolled → in progress → compliant
  complianceData.sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1
    if (!a.isOverdue && b.isOverdue) return 1
    if (a.isExpired && !b.isExpired) return -1
    if (!a.isExpired && b.isExpired) return 1
    if (a.isExpiringSoon && !b.isExpiringSoon) return -1
    if (!a.isExpiringSoon && b.isExpiringSoon) return 1
    if (a.status === 'NOT_ENROLLED' && b.status !== 'NOT_ENROLLED') return -1
    if (a.status !== 'NOT_ENROLLED' && b.status === 'NOT_ENROLLED') return 1
    return b.progressPercent - a.progressPercent
  })

  return { user, complianceData, stats }
}

export default async function ComplianceSummaryPage() {
  const { complianceData, stats } = await getComplianceData()

  return (
    <AdminLayout currentPage="reports">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/reports" className="text-sm text-[#EC5C29] hover:underline mb-2 inline-block">
              ← Back to Reports
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Compliance Summary Report</h1>
            <p className="text-slate-600 mt-1">
              Generated on {new Date().toLocaleDateString('en-AU', { dateStyle: 'full' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/admin/reports/compliance-summary?format=csv"
              className="px-4 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors font-semibold inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </a>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Workers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-600">Compliant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.compliant}</div>
              <p className="text-xs text-slate-500 mt-1">
                {Math.round((stats.compliant / stats.total) * 100)}%
              </p>
            </CardContent>
          </Card>

          <Card className={stats.expiringSoon > 0 ? 'border-amber-300 bg-amber-50' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-600">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.expiringSoon}</div>
              <p className="text-xs text-amber-600 mt-1">Within 30 days</p>
            </CardContent>
          </Card>

          <Card className={stats.overdue > 0 ? 'border-red-300 bg-red-50' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <p className="text-xs text-red-600 mt-1">Action required</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Not Enrolled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-600">{stats.notEnrolled}</div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Worker Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Employee</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Job Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Site/Crew</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Progress</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Certificate</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceData.map((worker) => (
                    <tr key={worker.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        {worker.isCompliant && (
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-medium">Compliant</span>
                          </span>
                        )}
                        {worker.isExpiringSoon && !worker.isOverdue && (
                          <span className="inline-flex items-center gap-1 text-amber-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-medium">Expiring</span>
                          </span>
                        )}
                        {worker.isOverdue && (
                          <span className="inline-flex items-center gap-1 text-red-600">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-xs font-medium">Overdue</span>
                          </span>
                        )}
                        {worker.status === 'NOT_ENROLLED' && (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <XCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">Not Enrolled</span>
                          </span>
                        )}
                        {worker.status === 'IN_PROGRESS' && !worker.isExpiringSoon && !worker.isOverdue && (
                          <span className="inline-flex items-center gap-1 text-blue-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-medium">In Progress</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{worker.name}</div>
                        <div className="text-xs text-slate-500">{worker.employeeId || worker.email}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{worker.jobTitle || '—'}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {worker.site && <div>{worker.site}</div>}
                        {worker.crew && <div className="text-xs text-slate-500">{worker.crew}</div>}
                        {!worker.site && '—'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                worker.isCompliant
                                  ? 'bg-emerald-500'
                                  : worker.isOverdue
                                  ? 'bg-red-500'
                                  : worker.isExpiringSoon
                                  ? 'bg-amber-500'
                                  : 'bg-blue-500'
                              }`}
                              style={{ width: `${worker.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-600">{worker.progressPercent}%</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {worker.completedModules}/{worker.totalModules} modules
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {worker.certificateSerial || '—'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {worker.certificateExpires ? (
                          <div>
                            <div className={worker.isExpiringSoon || worker.isExpired ? 'text-amber-600 font-medium' : 'text-slate-600'}>
                              {new Date(worker.certificateExpires).toLocaleDateString('en-AU')}
                            </div>
                            {worker.daysUntilExpiry !== null && (
                              <div className={`text-xs ${worker.daysUntilExpiry <= 0 ? 'text-red-600' : worker.daysUntilExpiry <= 30 ? 'text-amber-600' : 'text-slate-500'}`}>
                                {worker.daysUntilExpiry <= 0
                                  ? 'EXPIRED'
                                  : `${worker.daysUntilExpiry} days`}
                              </div>
                            )}
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
