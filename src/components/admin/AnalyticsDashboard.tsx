'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Users,
  Target,
  Clock,
  Activity,
  Award,
} from 'lucide-react'

interface Enrollment {
  id: string
  status: string
  enrolledAt: Date
  completedAt: Date | null
  user: {
    id: string
    name: string | null
    email: string
    site: { id: string; name: string } | null
    crew: { id: string; name: string } | null
  }
  course: {
    id: string
    title: string
  }
  moduleProgress: Array<{
    id: string
    status: string
    completedAt: Date | null
    module: {
      id: string
      title: string
    }
  }>
  certificates: Array<{
    id: string
    issuedAt: Date
    expiresAt: Date
  }>
}

interface Incident {
  id: string
  incidentNumber: string
  title: string
  severity: string
  category: string
  incidentDate: Date
  kpiAreasAffected: string[]
  site: {
    id: string
    name: string
  }
  reportedBy: {
    id: string
    name: string | null
    email: string
  }
}

interface Site {
  id: string
  name: string
  crews: Array<{
    id: string
    name: string
    members: Array<{
      id: string
      name: string | null
      enrollments: Array<{
        id: string
        status: string
        moduleProgress: Array<{
          id: string
          status: string
        }>
      }>
    }>
  }>
}

interface AnalyticsDashboardProps {
  enrollments: Enrollment[]
  incidents: Incident[]
  sites: Site[]
}

export default function AnalyticsDashboard({
  enrollments,
  incidents,
  sites,
}: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y' | 'all'>('90d')
  const [selectedSite, setSelectedSite] = useState<string>('all')

  // Filter data by time range and site
  const filteredData = useMemo(() => {
    const now = Date.now()
    const ranges = {
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
      all: Infinity,
    }
    const cutoff = now - ranges[timeRange]

    const filteredEnrollments = enrollments.filter((e) => {
      const inTimeRange = new Date(e.enrolledAt).getTime() >= cutoff
      const inSite = selectedSite === 'all' || e.user.site?.id === selectedSite
      return inTimeRange && inSite
    })

    const filteredIncidents = incidents.filter((i) => {
      const inTimeRange = new Date(i.incidentDate).getTime() >= cutoff
      const inSite = selectedSite === 'all' || i.site.id === selectedSite
      return inTimeRange && inSite
    })

    return { filteredEnrollments, filteredIncidents }
  }, [enrollments, incidents, timeRange, selectedSite])

  // Calculate TRIFR (Total Recordable Injury Frequency Rate)
  // TRIFR = (Number of injuries × 1,000,000) / Total hours worked
  // Assuming average 2000 hours/year per employee
  const trifr = useMemo(() => {
    const totalWorkers = enrollments.length
    const recordableIncidents = filteredData.filteredIncidents.filter(
      (i) => i.severity !== 'NEAR_MISS'
    ).length
    const hoursWorked = totalWorkers * 2000 // Simplified
    return hoursWorked > 0 ? (recordableIncidents * 1000000) / hoursWorked : 0
  }, [enrollments, filteredData.filteredIncidents])

  // Calculate training completion correlation
  const trainingCorrelation = useMemo(() => {
    const siteData = sites.map((site) => {
      const siteIncidents = filteredData.filteredIncidents.filter(
        (i) => i.site.id === site.id
      )
      const siteWorkers = site.crews.flatMap((c) => c.members)
      const completedTraining = siteWorkers.filter((w) =>
        w.enrollments.some((e) => e.status === 'COMPLETED')
      ).length
      const completionRate =
        siteWorkers.length > 0 ? completedTraining / siteWorkers.length : 0

      const incidentRate =
        siteWorkers.length > 0 ? siteIncidents.length / siteWorkers.length : 0

      return {
        siteId: site.id,
        siteName: site.name,
        completionRate: Math.round(completionRate * 100),
        incidentRate: incidentRate.toFixed(2),
        workerCount: siteWorkers.length,
      }
    })

    return siteData
  }, [sites, filteredData.filteredIncidents])

  // Calculate KPI weakness heatmap
  const kpiHeatmap = useMemo(() => {
    const kpis = [
      'communication',
      'situational_awareness',
      'decision_making',
      'leadership',
      'psychological_safety',
      'just_culture',
      'learning_culture',
      'team_coordination',
    ]

    const kpiIncidentCount: Record<string, number> = {}
    kpis.forEach((kpi) => {
      kpiIncidentCount[kpi] = filteredData.filteredIncidents.filter((i) =>
        i.kpiAreasAffected.includes(kpi)
      ).length
    })

    const siteKpiData = sites.map((site) => {
      const siteIncidents = filteredData.filteredIncidents.filter(
        (i) => i.site.id === site.id
      )
      const kpiBreakdown: Record<string, number> = {}
      kpis.forEach((kpi) => {
        kpiBreakdown[kpi] = siteIncidents.filter((i) =>
          i.kpiAreasAffected.includes(kpi)
        ).length
      })
      return {
        siteId: site.id,
        siteName: site.name,
        kpiBreakdown,
      }
    })

    return { globalKpiCount: kpiIncidentCount, siteKpiData }
  }, [sites, filteredData.filteredIncidents])

  // Calculate time-to-competency metrics
  const timeToCompetency = useMemo(() => {
    const completed = filteredData.filteredEnrollments.filter(
      (e) => e.status === 'COMPLETED' && e.completedAt
    )

    const times = completed.map((e) => {
      const enrolled = new Date(e.enrolledAt).getTime()
      const completedTime = new Date(e.completedAt!).getTime()
      return (completedTime - enrolled) / (1000 * 60 * 60 * 24) // Days
    })

    const avg = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
    const median =
      times.length > 0 ? times.sort((a, b) => a - b)[Math.floor(times.length / 2)] : 0

    return {
      average: Math.round(avg),
      median: Math.round(median),
      fastest: times.length > 0 ? Math.round(Math.min(...times)) : 0,
      slowest: times.length > 0 ? Math.round(Math.max(...times)) : 0,
    }
  }, [filteredData.filteredEnrollments])

  // Calculate leading indicators (predict at-risk workers)
  const leadingIndicators = useMemo(() => {
    const atRiskWorkers = enrollments
      .filter((e) => {
        const cert = e.certificates[0]
        if (!cert) return false
        const daysUntilExpiry = Math.ceil(
          (new Date(cert.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0
      })
      .map((e) => ({
        name: e.user.name || e.user.email,
        site: e.user.site?.name || 'Unknown',
        crew: e.user.crew?.name || 'Unknown',
        daysLeft: Math.ceil(
          (new Date(e.certificates[0].expiresAt).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        ),
      }))

    return atRiskWorkers
  }, [enrollments])

  // Calculate incident trend (last 6 months)
  const incidentTrend = useMemo(() => {
    const monthlyData: Record<string, number> = {}
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = month.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
      monthlyData[monthKey] = 0
    }

    filteredData.filteredIncidents.forEach((incident) => {
      const incidentMonth = new Date(incident.incidentDate).toLocaleDateString('en-AU', {
        month: 'short',
        year: 'numeric',
      })
      if (monthlyData[incidentMonth] !== undefined) {
        monthlyData[incidentMonth]++
      }
    })

    return Object.entries(monthlyData).map(([month, count]) => ({ month, count }))
  }, [filteredData.filteredIncidents])

  const trendDirection = useMemo(() => {
    if (incidentTrend.length < 2) return 'stable'
    const recent = incidentTrend[incidentTrend.length - 1].count
    const previous = incidentTrend[incidentTrend.length - 2].count
    if (recent < previous) return 'down'
    if (recent > previous) return 'up'
    return 'stable'
  }, [incidentTrend])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Site</label>
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="all">All Sites</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">TRIFR</CardTitle>
            <Activity className="w-4 h-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trifr.toFixed(2)}</div>
            <p className="text-xs text-slate-600 mt-1">
              Total Recordable Injury Frequency Rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Incident Trend</CardTitle>
            {trendDirection === 'down' ? (
              <TrendingDown className="w-4 h-4 text-green-600" />
            ) : trendDirection === 'up' ? (
              <TrendingUp className="w-4 h-4 text-red-600" />
            ) : (
              <Activity className="w-4 h-4 text-slate-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredData.filteredIncidents.length}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {trendDirection === 'down' && 'Decreasing ↓'}
              {trendDirection === 'up' && 'Increasing ↑'}
              {trendDirection === 'stable' && 'Stable →'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Time to Competency</CardTitle>
            <Clock className="w-4 h-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeToCompetency.average} days</div>
            <p className="text-xs text-slate-600 mt-1">
              Median: {timeToCompetency.median} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">At-Risk Workers</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadingIndicators.length}</div>
            <p className="text-xs text-slate-600 mt-1">Expiring certification (30d)</p>
          </CardContent>
        </Card>
      </div>

      {/* Training-Safety Correlation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#EC5C29]" />
            Training Completion vs. Incident Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trainingCorrelation.map((site) => (
              <div key={site.siteId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900">{site.siteName}</div>
                    <div className="text-xs text-slate-600">
                      {site.workerCount} workers
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      {site.completionRate}% trained
                    </div>
                    <div className="text-xs text-slate-600">
                      {site.incidentRate} incidents/worker
                    </div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${site.completionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Insight:</strong> Sites with higher training completion rates typically
              show lower incident rates per worker. Focus training efforts on sites with
              completion rates below 70%.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* KPI Weakness Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            KPI Weakness Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h4 className="font-semibold text-slate-900 mb-3">Global KPI Incident Count</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(kpiHeatmap.globalKpiCount)
                .sort((a, b) => b[1] - a[1])
                .map(([kpi, count]) => {
                  const maxCount = Math.max(...Object.values(kpiHeatmap.globalKpiCount))
                  const intensity = maxCount > 0 ? (count / maxCount) * 100 : 0
                  const bgColor =
                    intensity > 75
                      ? 'bg-red-100 border-red-300 text-red-900'
                      : intensity > 50
                        ? 'bg-orange-100 border-orange-300 text-orange-900'
                        : intensity > 25
                          ? 'bg-yellow-100 border-yellow-300 text-yellow-900'
                          : 'bg-green-100 border-green-300 text-green-900'

                  return (
                    <div
                      key={kpi}
                      className={`p-3 border rounded-lg ${bgColor}`}
                    >
                      <div className="text-xs font-medium capitalize">
                        {kpi.replace(/_/g, ' ')}
                      </div>
                      <div className="text-xl font-bold mt-1">{count}</div>
                    </div>
                  )
                })}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-slate-900 mb-3">Site-Level KPI Breakdown</h4>
            <div className="space-y-3">
              {kpiHeatmap.siteKpiData.map((site) => {
                const topKpis = Object.entries(site.kpiBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .filter(([, count]) => count > 0)

                if (topKpis.length === 0) {
                  return (
                    <div key={site.siteId} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-medium text-green-900">{site.siteName}</div>
                      <div className="text-sm text-green-700 mt-1">
                        ✓ No KPI weaknesses detected
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={site.siteId} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-medium text-slate-900">{site.siteName}</div>
                    <div className="mt-2 space-y-1">
                      {topKpis.map(([kpi, count]) => (
                        <div key={kpi} className="flex items-center gap-2 text-sm">
                          <span className="text-slate-600 capitalize">
                            {kpi.replace(/_/g, ' ')}:
                          </span>
                          <span className="font-semibold text-red-600">{count} incidents</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-900">
              <strong>Recommended Action:</strong> Create targeted training modules for the
              top 3 KPI areas with highest incident counts. Consider refresher scenarios for
              sites showing specific weaknesses.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Incident Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#EC5C29]" />
            6-Month Incident Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {incidentTrend.map((month) => {
              const maxCount = Math.max(...incidentTrend.map((m) => m.count))
              const widthPercent = maxCount > 0 ? (month.count / maxCount) * 100 : 0

              return (
                <div key={month.month} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{month.month}</span>
                    <span className="font-semibold text-slate-900">{month.count}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-[#EC5C29] h-3 rounded-full transition-all"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Leading Indicators - At-Risk Workers */}
      {leadingIndicators.length > 0 && (
        <Card className="border-amber-300 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Predictive Alert: Expiring Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {leadingIndicators
                .sort((a, b) => a.daysLeft - b.daysLeft)
                .map((worker, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-white border border-amber-200 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{worker.name}</div>
                      <div className="text-xs text-slate-600">
                        {worker.site} • {worker.crew}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-amber-700">
                        {worker.daysLeft} days left
                      </div>
                      <div className="text-xs text-amber-600">Action required</div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-4 p-3 bg-amber-100 border border-amber-300 rounded-lg">
              <p className="text-sm text-amber-900">
                <strong>Proactive Measure:</strong> Send automated renewal reminders and
                schedule refresher training before certifications expire to maintain 100%
                compliance.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time to Competency Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Time to Competency Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-xs font-medium text-blue-700">Average</div>
              <div className="text-2xl font-bold text-blue-900 mt-1">
                {timeToCompetency.average}
              </div>
              <div className="text-xs text-blue-600 mt-1">days</div>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-xs font-medium text-green-700">Fastest</div>
              <div className="text-2xl font-bold text-green-900 mt-1">
                {timeToCompetency.fastest}
              </div>
              <div className="text-xs text-green-600 mt-1">days</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-xs font-medium text-slate-700">Median</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {timeToCompetency.median}
              </div>
              <div className="text-xs text-slate-600 mt-1">days</div>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-xs font-medium text-amber-700">Slowest</div>
              <div className="text-2xl font-bold text-amber-900 mt-1">
                {timeToCompetency.slowest}
              </div>
              <div className="text-xs text-amber-600 mt-1">days</div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-sm text-slate-700">
              <strong>Benchmark:</strong> Mining industry standard is 45-60 days for CRM
              certification. Workers completing faster may benefit from being peer trainers or
              mentors.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
