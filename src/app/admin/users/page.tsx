import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Plus,
  Mail,
  Calendar,
  TrendingUp,
  Edit,
  Trash2,
  Shield,
  User,
  Crown,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'
import Link from 'next/link'

async function getUsersData() {
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

  // Get all organizations with their users
  const organizations = await prisma.org.findMany({
    include: {
      users: {
        include: {
          enrollments: {
            include: {
              course: {
                include: {
                  modules: true,
                },
              },
              moduleAttempts: {
                where: { passed: true },
              },
            },
          },
          profile: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { name: 'asc' },
  })

  // Calculate statistics
  const totalUsers = await prisma.user.count()
  const totalAdmins = await prisma.user.count({ where: { role: 'ADMIN' } })
  const totalSupervisors = await prisma.user.count({ where: { role: 'SUPERVISOR' } })
  const totalLearners = await prisma.user.count({ where: { role: 'LEARNER' } })

  return {
    organizations,
    stats: {
      totalUsers,
      totalAdmins,
      totalSupervisors,
      totalLearners,
    },
  }
}

function getRoleBadge(role: string) {
  const config = {
    ADMIN: { icon: Crown, color: 'bg-purple-100 text-purple-800', label: 'Admin' },
    SUPERVISOR: { icon: Shield, color: 'bg-blue-100 text-blue-800', label: 'Supervisor' },
    LEARNER: { icon: User, color: 'bg-green-100 text-green-800', label: 'Learner' },
  }
  return config[role as keyof typeof config] || config.LEARNER
}

function getEnrollmentStatus(enrollment: any) {
  if (!enrollment) {
    return { icon: XCircle, color: 'text-slate-400', label: 'Not Enrolled' }
  }

  if (enrollment.completedAt) {
    return { icon: CheckCircle2, color: 'text-green-600', label: 'Completed' }
  }

  if (enrollment.startedAt) {
    return { icon: Clock, color: 'text-blue-600', label: 'In Progress' }
  }

  return { icon: Clock, color: 'text-slate-600', label: 'Enrolled' }
}

export default async function AdminUsersPage() {
  const { organizations, stats } = await getUsersData()

  return (
    <AdminLayout currentPage="users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Users</h1>
            <p className="text-slate-600 mt-1">Manage user accounts and permissions</p>
          </div>
          <Link
            href="/admin/users/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add User
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <CardTitle className="text-sm font-medium text-slate-600">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalAdmins}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Supervisors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalSupervisors}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Learners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalLearners}</div>
            </CardContent>
          </Card>
        </div>

        {/* Organizations and Users */}
        <div className="space-y-6">
          {organizations.map((org) => (
            <Card key={org.id}>
              <CardHeader className="bg-slate-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{org.name}</CardTitle>
                    {org.region && (
                      <p className="text-sm text-slate-600 mt-1">{org.region}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {org.users.length} {org.users.length === 1 ? 'user' : 'users'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {org.users.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p>No users in this organization yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {org.users.map((user) => {
                      const roleBadge = getRoleBadge(user.role)
                      const RoleIcon = roleBadge.icon
                      const enrollment = user.enrollments[0]
                      const enrollmentStatus = getEnrollmentStatus(enrollment)
                      const EnrollmentIcon = enrollmentStatus.icon

                      // Calculate progress
                      let progress = 0
                      if (enrollment) {
                        const totalModules = enrollment.course?.modules?.length || 0
                        const completedModules = enrollment.moduleAttempts.length
                        progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
                      }

                      return (
                        <div key={user.id} className="p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div>
                                  <h3 className="text-lg font-semibold text-slate-900">
                                    {user.name || 'Unnamed User'}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-600">{user.email}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-4">
                                {/* Role Badge */}
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${roleBadge.color} text-xs font-medium`}>
                                  <RoleIcon className="w-3.5 h-3.5" />
                                  {roleBadge.label}
                                </div>

                                {/* Enrollment Status */}
                                <div className="flex items-center gap-1.5 text-sm">
                                  <EnrollmentIcon className={`w-4 h-4 ${enrollmentStatus.color}`} />
                                  <span className="text-slate-700">{enrollmentStatus.label}</span>
                                </div>

                                {/* Progress */}
                                {enrollment && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <TrendingUp className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-700">{progress}% complete</span>
                                  </div>
                                )}

                                {/* Created Date */}
                                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                  <Calendar className="w-4 h-4" />
                                  Joined {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                              </div>

                              {/* Progress Bar */}
                              {enrollment && progress > 0 && (
                                <div className="mt-3">
                                  <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                      className="bg-[#EC5C29] h-2 rounded-full transition-all"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 ml-4">
                              <Link
                                href={`/admin/users/${user.id}/edit`}
                                className="p-2 text-slate-600 hover:text-[#EC5C29] hover:bg-[#EC5C29]/10 rounded-lg transition-colors"
                                title="Edit user"
                              >
                                <Edit className="w-5 h-5" />
                              </Link>
                              <button
                                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete user"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {organizations.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No organizations yet</h3>
                <p className="text-slate-600">Create your first organization to get started</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
