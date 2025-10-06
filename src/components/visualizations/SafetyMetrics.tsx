'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'

type SafetyMetric = {
  label: string
  value: number
  max: number
  icon: React.ReactNode
  color: string
  description: string
}

type Props = {
  completedModules: number
  totalModules: number
  avgScore: number
  certificateExpiryDays: number | null
}

export default function SafetyMetrics({ completedModules, totalModules, avgScore, certificateExpiryDays }: Props) {
  const completionRate = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
  const safetyCompliance = avgScore // Using average score as safety compliance indicator

  const metrics: SafetyMetric[] = [
    {
      label: 'Training Completion',
      value: completionRate,
      max: 100,
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: completionRate >= 80 ? '#10b981' : completionRate >= 50 ? '#f59e0b' : '#ef4444',
      description: `${completedModules} of ${totalModules} modules`
    },
    {
      label: 'Safety Compliance',
      value: safetyCompliance,
      max: 100,
      icon: <Shield className="w-6 h-6" />,
      color: safetyCompliance >= 80 ? '#10b981' : safetyCompliance >= 60 ? '#f59e0b' : '#ef4444',
      description: 'Based on assessment scores'
    },
    {
      label: 'Risk Awareness',
      value: Math.min(100, Math.round(avgScore * 1.1)), // Slightly boosted from avg score
      max: 100,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: avgScore >= 75 ? '#10b981' : avgScore >= 50 ? '#f59e0b' : '#ef4444',
      description: 'Decision-making competency'
    },
    {
      label: 'Certification Status',
      value: certificateExpiryDays !== null ? Math.max(0, Math.min(100, certificateExpiryDays)) : 0,
      max: 100,
      icon: <Clock className="w-6 h-6" />,
      color: certificateExpiryDays === null ? '#64748b' : certificateExpiryDays > 30 ? '#10b981' : certificateExpiryDays > 0 ? '#f59e0b' : '#ef4444',
      description: certificateExpiryDays === null ? 'Not certified' : certificateExpiryDays > 0 ? `${certificateExpiryDays} days remaining` : 'Expired'
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricGauge key={metric.label} metric={metric} />
      ))}
    </div>
  )
}

function MetricGauge({ metric }: { metric: SafetyMetric }) {
  const percentage = (metric.value / metric.max) * 100
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span style={{ color: metric.color }}>{metric.icon}</span>
          {metric.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {/* Circular Gauge */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="#e2e8f0"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke={metric.color}
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.5s ease'
                }}
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: metric.color }}>
                  {Math.round(metric.value)}
                </div>
                <div className="text-xs text-slate-500">
                  {metric.label === 'Certification Status' ? 'days' : '%'}
                </div>
              </div>
            </div>
          </div>
          {/* Description */}
          <p className="text-xs text-slate-600 text-center mt-3">
            {metric.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
