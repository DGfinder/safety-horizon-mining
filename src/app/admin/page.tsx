import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, TrendingUp, Award } from 'lucide-react'
import Link from 'next/link'

async function getAdminDashboardData() {
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

  // Get statistics
  const totalModules = await prisma.module.count()
  const totalUsers = await prisma.user.count()
  const totalEnrollments = await prisma.enrollment.count()
  const totalScenarios = await prisma.scenario.count()

  // Get recent modules
  const recentModules = await prisma.module.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: {
      course: true,
      contentSections: true,
    },
  })

  return {
    user,
    stats: {
      totalModules,
      totalUsers,
      totalEnrollments,
      totalScenarios,
    },
    recentModules,
  }
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData()
  const { user, stats, recentModules } = data

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#192135] to-[#192135]/90 text-white px-8 py-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-white/80 mt-2 text-base">Manage your LMS content, monitor learner progress, and ensure safety excellence</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-[#EC5C29] bg-gradient-to-br from-[#EC5C29]/5 to-transparent hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Modules</CardTitle>
              <div className="p-2 bg-[#EC5C29]/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-[#EC5C29]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalModules}</div>
              <Link href="/admin/modules" className="text-xs text-[#EC5C29] hover:underline mt-2 inline-block font-medium">
                Manage modules →
              </Link>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-600 bg-gradient-to-br from-blue-50/50 to-transparent hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalUsers}</div>
              <Link href="/admin/users" className="text-xs text-blue-600 hover:underline mt-2 inline-block font-medium">
                View users →
              </Link>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600 bg-gradient-to-br from-green-50/50 to-transparent hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Enrollments</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalEnrollments}</div>
              <p className="text-xs text-slate-500 mt-2">Learners in progress</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-600 bg-gradient-to-br from-purple-50/50 to-transparent hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Scenarios</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalScenarios}</div>
              <p className="text-xs text-slate-500 mt-2">Interactive exercises</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/modules/new"
                className="p-6 border-2 border-slate-200 rounded-lg hover:border-[#EC5C29] hover:shadow-lg hover:shadow-[#EC5C29]/10 bg-white hover:bg-[#EC5C29]/5 transition-all text-center group"
              >
                <BookOpen className="w-10 h-10 text-[#EC5C29] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-slate-900 text-base">Create New Module</div>
                <div className="text-xs text-slate-600 mt-1">Build a new learning module</div>
              </Link>

              <Link
                href="/admin/users/new"
                className="p-6 border-2 border-slate-200 rounded-lg hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/10 bg-white hover:bg-blue-50 transition-all text-center group"
              >
                <Users className="w-10 h-10 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-slate-900 text-base">Add User</div>
                <div className="text-xs text-slate-600 mt-1">Invite a new learner or admin</div>
              </Link>

              <Link
                href="/admin/reports"
                className="p-6 border-2 border-slate-200 rounded-lg hover:border-green-600 hover:shadow-lg hover:shadow-green-600/10 bg-white hover:bg-green-50 transition-all text-center group"
              >
                <TrendingUp className="w-10 h-10 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-slate-900 text-base">View Reports</div>
                <div className="text-xs text-slate-600 mt-1">Analyze learner performance</div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recently Updated Modules */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recently Updated Modules</CardTitle>
              <Link href="/admin/modules" className="text-sm text-[#EC5C29] hover:underline">
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentModules.map((module) => (
                <div key={module.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {module.orderIndex}. {module.title}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">{module.description}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                        {module.kind}
                      </span>
                      {module.kind === 'HYBRID' && (
                        <span className="text-xs text-slate-500">
                          {module.contentSections.length} sections
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/admin/modules/${module.id}/edit`}
                    className="px-4 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors text-sm font-semibold"
                  >
                    Edit
                  </Link>
                </div>
              ))}
              {recentModules.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No modules yet. Create your first module to get started!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
