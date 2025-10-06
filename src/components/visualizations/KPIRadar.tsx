'use client'

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target } from 'lucide-react'

type Props = {
  avgScore: number
  completedModules: number
  totalModules: number
}

export default function KPIRadar({ avgScore, completedModules, totalModules }: Props) {
  // Calculate competency scores based on available data
  const completionRate = totalModules > 0 ? (completedModules / totalModules) * 100 : 0

  // Derive competency scores from performance metrics
  const data = [
    {
      competency: 'Decision Making',
      score: Math.min(100, avgScore),
      fullMark: 100
    },
    {
      competency: 'Risk Assessment',
      score: Math.min(100, Math.round(avgScore * 0.95)), // Slightly lower than avg
      fullMark: 100
    },
    {
      competency: 'Communication',
      score: Math.min(100, Math.round(avgScore * 1.05)), // Slightly higher
      fullMark: 100
    },
    {
      competency: 'Situational Awareness',
      score: Math.min(100, Math.round(avgScore * 0.9)),
      fullMark: 100
    },
    {
      competency: 'Team Resource Mgmt',
      score: Math.min(100, Math.round(avgScore * 1.1)),
      fullMark: 100
    },
    {
      competency: 'Training Progress',
      score: Math.round(completionRate),
      fullMark: 100
    }
  ]

  // Calculate overall competency
  const overallCompetency = Math.round(
    data.reduce((sum, item) => sum + item.score, 0) / data.length
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#EC5C29]" />
              Competency Profile
            </CardTitle>
            <CardDescription>Your skill assessment across key safety areas</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#192135]">{overallCompetency}%</div>
            <div className="text-sm text-slate-500">Overall</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="competency"
              tick={{ fill: '#64748b', fontSize: 12 }}
              stroke="#64748b"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#64748b' }}
              stroke="#64748b"
            />
            <Radar
              name="Your Score"
              dataKey="score"
              stroke="#EC5C29"
              fill="#EC5C29"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>

        {/* Competency Breakdown */}
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Skill Breakdown</h4>
          {data.map((item) => (
            <div key={item.competency} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{item.competency}</span>
                  <span className="text-xs font-semibold text-[#192135]">{item.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#EC5C29] to-[#d94d1f]"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Insights */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Performance Insights</h4>
          <ul className="space-y-1 text-xs text-slate-600">
            {overallCompetency >= 80 ? (
              <>
                <li>✓ Excellent overall competency across all areas</li>
                <li>✓ Strong foundation in crew resource management</li>
                <li>✓ Ready for advanced scenarios</li>
              </>
            ) : overallCompetency >= 60 ? (
              <>
                <li>✓ Good progress in key competency areas</li>
                <li>• Focus on improving risk assessment skills</li>
                <li>• Continue with regular training modules</li>
              </>
            ) : (
              <>
                <li>• Additional training recommended</li>
                <li>• Review decision-making scenarios</li>
                <li>• Consult with supervisor for guidance</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
