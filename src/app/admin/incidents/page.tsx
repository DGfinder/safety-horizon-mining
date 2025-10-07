import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Plus, TrendingDown, CheckCircle, FileText, GitBranch } from 'lucide-react'
import Link from 'next/link'

async function getIncidentsData() {
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

  const incidents = await prisma.incident.findMany({
    where: { site: { orgId: user.orgId! } },
    include: {
      site: true,
      reportedBy: true,
      generatedScenario: true,
    },
    orderBy: { incidentDate: 'desc' },
  })

  const stats = {
    total: incidents.length,
    open: incidents.filter((i) => i.investigationStatus !== 'COMPLETED' && i.investigationStatus !== 'CLOSED').length,
    scenariosCreated: incidents.filter((i) => i.scenarioCreated).length,
    criticalCount: incidents.filter((i) => i.severity === 'CRITICAL' || i.severity === 'FATALITY').length,
  }

  return { user, incidents, stats }
}

export default async function IncidentsPage() {
  const { incidents, stats } = await getIncidentsData()

  const severityColors: Record<string, { bg: string; text: string }> = {
    NEAR_MISS: { bg: 'bg-blue-100', text: 'text-blue-700' },
    MINOR: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    MODERATE: { bg: 'bg-orange-100', text: 'text-orange-700' },
    MAJOR: { bg: 'bg-red-100', text: 'text-red-700' },
    CRITICAL: { bg: 'bg-red-200', text: 'text-red-900' },
    FATALITY: { bg: 'bg-black', text: 'text-white' },
  }

  return (
    <AdminLayout currentPage="incidents">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Incident Management</h1>
            <p className="text-slate-600 mt-1">
              Convert incidents into learning opportunities
            </p>
          </div>
          <Link
            href="/admin/incidents/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Report Incident
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Incidents</CardTitle>
              <AlertTriangle className="w-5 h-5 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Open Investigations</CardTitle>
              <FileText className="w-5 h-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.open}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Training Created</CardTitle>
              <GitBranch className="w-5 h-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{stats.scenariosCreated}</div>
              <p className="text-xs text-slate-500 mt-2">Scenarios generated</p>
            </CardContent>
          </Card>

          <Card className={stats.criticalCount > 0 ? 'border-red-300 bg-red-50' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Critical/Fatal</CardTitle>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.criticalCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Incidents List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            {incidents.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No incidents reported</h3>
                <p className="text-slate-600 mb-4">Incident reports will appear here</p>
                <Link
                  href="/admin/incidents/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Report First Incident
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {incidents.map((incident) => {
                  const colors = severityColors[incident.severity] || { bg: 'bg-gray-100', text: 'text-gray-700' }
                  return (
                    <div
                      key={incident.id}
                      className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm font-semibold text-slate-600">
                              {incident.incidentNumber}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                              {incident.severity.replace('_', ' ')}
                            </span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                              {incident.investigationStatus.replace(/_/g, ' ')}
                            </span>
                            {incident.scenarioCreated && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700 flex items-center gap-1">
                                <GitBranch className="w-3 h-3" />
                                Training Created
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-slate-900 mb-1">{incident.title}</h3>
                          <p className="text-sm text-slate-600 mb-2">{incident.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>
                              <strong>Date:</strong> {new Date(incident.incidentDate).toLocaleDateString('en-AU')}
                            </span>
                            <span>
                              <strong>Site:</strong> {incident.site.name}
                            </span>
                            <span>
                              <strong>Location:</strong> {incident.location}
                            </span>
                            {incident.equipment && (
                              <span>
                                <strong>Equipment:</strong> {incident.equipment}
                              </span>
                            )}
                          </div>
                          {incident.kpiAreasAffected.length > 0 && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs font-medium text-slate-600">KPI Impact:</span>
                              {incident.kpiAreasAffected.map((kpi) => (
                                <span
                                  key={kpi}
                                  className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-700"
                                >
                                  {kpi.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {!incident.scenarioCreated && incident.investigationStatus === 'COMPLETED' && (
                            <Link
                              href={`/admin/incidents/${incident.id}/create-scenario`}
                              className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center gap-1"
                            >
                              <GitBranch className="w-4 h-4" />
                              Create Training
                            </Link>
                          )}
                          <Link
                            href={`/admin/incidents/${incident.id}`}
                            className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
