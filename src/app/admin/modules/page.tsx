import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Plus, Edit, Trash2, Copy } from 'lucide-react'
import Link from 'next/link'

async function getModules() {
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

  const modules = await prisma.module.findMany({
    include: {
      course: true,
      contentSections: true,
      scenario: true,
      quiz: true,
    },
    orderBy: [
      { courseId: 'asc' },
      { orderIndex: 'asc' },
    ],
  })

  return { modules, user }
}

function getModuleStatusBadge(module: any) {
  const hasContent = module.contentSections.length > 0
  const hasScenario = !!module.scenarioId
  const hasQuiz = !!module.quizId

  if (module.kind === 'HYBRID' && hasContent && hasScenario) {
    return { text: 'Complete', color: 'bg-green-100 text-green-800' }
  }
  if (module.kind === 'SCENARIO' && hasScenario) {
    return { text: 'Complete', color: 'bg-green-100 text-green-800' }
  }
  if (module.kind === 'QUIZ' && hasQuiz) {
    return { text: 'Complete', color: 'bg-green-100 text-green-800' }
  }
  if (module.kind === 'VIDEO' && hasContent) {
    return { text: 'Complete', color: 'bg-green-100 text-green-800' }
  }
  if (module.kind === 'POLICY' && hasContent) {
    return { text: 'Complete', color: 'bg-green-100 text-green-800' }
  }

  return { text: 'Draft', color: 'bg-yellow-100 text-yellow-800' }
}

function getModuleKindBadge(kind: string) {
  const colors = {
    HYBRID: 'bg-purple-100 text-purple-800',
    SCENARIO: 'bg-blue-100 text-blue-800',
    VIDEO: 'bg-pink-100 text-pink-800',
    POLICY: 'bg-indigo-100 text-indigo-800',
    QUIZ: 'bg-orange-100 text-orange-800',
  }
  return colors[kind as keyof typeof colors] || 'bg-slate-100 text-slate-800'
}

export default async function ModulesListPage() {
  const { modules } = await getModules()

  return (
    <AdminLayout currentPage="modules">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Modules</h1>
            <p className="text-slate-600 mt-1">Manage learning modules and content</p>
          </div>
          <Link
            href="/admin/modules/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Create Module
          </Link>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{modules.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Hybrid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {modules.filter(m => m.kind === 'HYBRID').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {modules.filter(m => m.kind === 'SCENARIO').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Video/Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">
                {modules.filter(m => m.kind === 'VIDEO' || m.kind === 'POLICY').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {modules.filter(m => m.kind === 'QUIZ').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules List */}
        <Card>
          <CardHeader>
            <CardTitle>All Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {modules.map((module) => {
                const status = getModuleStatusBadge(module)
                const kindColor = getModuleKindBadge(module.kind)

                return (
                  <div
                    key={module.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-500 w-8">
                          {module.orderIndex}
                        </span>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 text-lg">
                            {module.title}
                          </div>
                          <div className="text-sm text-slate-600 mt-1">
                            {module.description}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded font-medium ${kindColor}`}>
                              {module.kind}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-medium ${status.color}`}>
                              {status.text}
                            </span>
                            {module.required && (
                              <span className="text-xs px-2 py-1 rounded font-medium bg-red-100 text-red-800">
                                Required
                              </span>
                            )}
                            {module.contentSections.length > 0 && (
                              <span className="text-xs text-slate-500">
                                {module.contentSections.length} sections
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        href={`/admin/modules/${module.id}/edit`}
                        className="p-2 text-slate-600 hover:text-[#EC5C29] hover:bg-[#EC5C29]/10 rounded-lg transition-colors"
                        title="Edit module"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Duplicate module"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete module"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )
              })}

              {modules.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No modules yet</h3>
                  <p className="text-slate-600 mb-4">Create your first module to get started</p>
                  <Link
                    href="/admin/modules/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    Create Module
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
