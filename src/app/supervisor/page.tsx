import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, AlertTriangle, TrendingUp, CheckCircle2, Clock, Award } from 'lucide-react'
import Link from 'next/link'

async function getSupervisorData() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      site: true,
      org: { include: { settings: true } },
      supervisingCrews: {
        include: {
          members: {
            include: {
              enrollments: {
                include: {
                  course: true,
                  moduleAttempts: {
                    include: { module: true },
                    orderBy: { startedAt: 'desc' },
                  },
                  certificates: {
                    where: { isActive: true },
                    orderBy: { issuedAt: 'desc' },
                    take: 1,
                  },
                },
              },
            },
          },
          site: true,
        },
      },
    },
  })

  if (!user || user.role !== 'SUPERVISOR') {
    redirect('/lms')
  }

  // Calculate team statistics
  const allCrewMembers = user.supervisingCrews.flatMap((crew) => crew.members)
  const totalWorkers = allCrewMembers.length

  const workersWithEnrollments = allCrewMembers.filter((w) => w.enrollments.length > 0)
  const activeEnrollments = workersWithEnrollments.length

  const completedWorkers = allCrewMembers.filter((w) =>
    w.enrollments.some((e) => e.status === 'COMPLETED')
  ).length

  const overdueWorkers = allCrewMembers.filter((w) =>
    w.enrollments.some((e) => e.status === 'OVERDUE')
  ).length

  const expiringCerts = allCrewMembers.filter((w) =>
    w.enrollments.some((e) => {
      const cert = e.certificates[0]
      if (!cert) return false
      const daysUntilExpiry = Math.ceil(
        (new Date(cert.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0
    })
  ).length

  // Team member details
  const teamMembers = allCrewMembers.map((member) => {
    const enrollment = member.enrollments[0]
    const cert = enrollment?.certificates[0]
    const totalModules = enrollment?.course?.modules?.length || 12
    const completedModules = enrollment?.moduleAttempts.filter((a) => a.passed).length || 0
    const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

    let daysUntilExpiry: number | null = null
    if (cert) {
      daysUntilExpiry = Math.ceil(
        (new Date(cert.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    }

    return {
      id: member.id,
      name: member.name || member.email,
      email: member.email,
      jobTitle: member.jobTitle,
      department: member.department,
      enrollmentStatus: enrollment?.status || 'NOT_ENROLLED',
      progressPercent,
      completedModules,
      totalModules,
      daysUntilExpiry,
      isOverdue: enrollment?.status === 'OVERDUE',
      isExpiringSoon: daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0,
    }
  })

  // Sort: overdue first, then expiring soon, then by progress
  teamMembers.sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1
    if (!a.isOverdue && b.isOverdue) return 1
    if (a.isExpiringSoon && !b.isExpiringSoon) return -1
    if (!a.isExpiringSoon && b.isExpiringSoon) return 1
    return b.progressPercent - a.progressPercent
  })

  return {
    user,
    stats: {
      totalWorkers,
      activeEnrollments,
      completedWorkers,
      overdueWorkers,
      expiringCerts,
    },
    crews: user.supervisingCrews,
    teamMembers,
  }
}

export default async function SupervisorDashboardPage() {
  const { user, stats, crews, teamMembers } = await getSupervisorData()

  return (
    <AdminLayout currentPage="supervisor">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Supervisor Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Manage your team's training compliance and performance
          </p>
          {user.site && (
            <p className="text-sm text-slate-500 mt-1">
              {user.site.name} • {crews.length} crew{crews.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Team Size</CardTitle>
              <Users className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalWorkers}</div>
              <p className="text-xs text-slate-500 mt-2">Total workers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.activeEnrollments}</div>
              <p className="text-xs text-slate-500 mt-2">In training</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{stats.completedWorkers}</div>
              <p className="text-xs text-slate-500 mt-2">Certified</p>
            </CardContent>
          </Card>

          <Card className={stats.overdueWorkers > 0 ? 'border-red-300 bg-red-50' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Overdue</CardTitle>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.overdueWorkers}</div>
              <p className="text-xs text-red-600 mt-2">Action required</p>
            </CardContent>
          </Card>

          <Card className={stats.expiringCerts > 0 ? 'border-amber-300 bg-amber-50' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-amber-600">Expiring</CardTitle>
              <Clock className="w-5 h-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.expiringCerts}</div>
              <p className="text-xs text-amber-600 mt-2">Within 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Compliance Status</CardTitle>
              <div className="flex items-center gap-3">
                <Link
                  href="/supervisor/bulk-enroll"
                  className="px-4 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors text-sm font-semibold"
                >
                  Bulk Enroll
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {teamMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No team members yet</h3>
                <p className="text-slate-600">Crew members will appear here once assigned</p>
              </div>
            ) : (
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      member.isOverdue
                        ? 'border-red-300 bg-red-50'
                        : member.isExpiringSoon
                        ? 'border-amber-300 bg-amber-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-semibold text-slate-900">{member.name}</div>
                            <div className="text-sm text-slate-600">
                              {member.jobTitle || member.email}
                              {member.department && ` • ${member.department}`}
                            </div>
                          </div>
                          {member.isOverdue && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                              OVERDUE
                            </span>
                          )}
                          {member.isExpiringSoon && !member.isOverdue && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                              EXPIRING IN {member.daysUntilExpiry} DAYS
                            </span>
                          )}
                        </div>

                        {/* Progress Bar */}
                        {member.enrollmentStatus !== 'NOT_ENROLLED' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                              <span>
                                {member.completedModules} / {member.totalModules} modules completed
                              </span>
                              <span className="font-semibold">{member.progressPercent}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  member.progressPercent === 100
                                    ? 'bg-emerald-500'
                                    : member.isOverdue
                                    ? 'bg-red-500'
                                    : member.isExpiringSoon
                                    ? 'bg-amber-500'
                                    : 'bg-blue-500'
                                }`}
                                style={{ width: `${member.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {member.enrollmentStatus === 'COMPLETED' && (
                          <Award className="w-5 h-5 text-emerald-600" />
                        )}
                        <Link
                          href={`/supervisor/worker/${member.id}`}
                          className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Crew Breakdown */}
        {crews.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Crew Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {crews.map((crew) => {
                  const crewSize = crew.members.length
                  const crewCompleted = crew.members.filter((m) =>
                    m.enrollments.some((e) => e.status === 'COMPLETED')
                  ).length
                  const crewCompletionRate = crewSize > 0 ? Math.round((crewCompleted / crewSize) * 100) : 0

                  return (
                    <div key={crew.id} className="p-4 border border-slate-200 rounded-lg">
                      <h3 className="font-semibold text-slate-900">{crew.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {crew.site.name} • {crew.shift.replace('_', ' ')}
                      </p>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-600">Completion Rate</span>
                          <span className="font-semibold text-slate-900">{crewCompletionRate}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${crewCompletionRate}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          {crewCompleted} / {crewSize} workers certified
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
