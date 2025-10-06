'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, BarChart3 } from 'lucide-react'

type PerformanceData = {
  moduleAttempts: Array<{
    module: {
      title: string
      orderIndex: number
    }
    score: number
    completedAt: Date | null
  }>
}

export default function PerformanceDashboard({ data }: { data: PerformanceData }) {
  // Transform data for charts
  const performanceData = data.moduleAttempts
    .filter(attempt => attempt.completedAt)
    .map(attempt => ({
      module: `Module ${attempt.module.orderIndex}`,
      score: attempt.score,
      date: attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : 'N/A'
    }))
    .sort((a, b) => a.module.localeCompare(b.module))

  // Calculate average score
  const avgScore = performanceData.length > 0
    ? Math.round(performanceData.reduce((sum, item) => sum + item.score, 0) / performanceData.length)
    : 0

  // Score trend data (last 5 attempts)
  const trendData = performanceData.slice(-5)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Performance Overview */}
      <Card className="col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#EC5C29]" />
                Performance Trend
              </CardTitle>
              <CardDescription>Your score progression over completed modules</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#192135]">{avgScore}%</div>
              <div className="text-sm text-slate-500">Average Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="module"
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#EC5C29"
                strokeWidth={3}
                dot={{ fill: '#EC5C29', r: 6 }}
                activeDot={{ r: 8 }}
                name="Score (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Module Scores Bar Chart */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#EC5C29]" />
            Module Performance
          </CardTitle>
          <CardDescription>Detailed scores by module</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="module"
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar
                dataKey="score"
                fill="#EC5C29"
                radius={[8, 8, 0, 0]}
                name="Score (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
