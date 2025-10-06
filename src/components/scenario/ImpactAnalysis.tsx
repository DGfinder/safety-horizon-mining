'use client'

import { ArrowRight, TrendingUp, TrendingDown, Minus, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type ImpactMetric = {
  label: string
  before: string | number
  after: string | number
  change?: number // percentage change
  impact: 'positive' | 'negative' | 'neutral'
  unit?: string
}

type Props = {
  title?: string
  description?: string
  metrics: ImpactMetric[]
  overallAssessment?: 'excellent' | 'good' | 'acceptable' | 'poor' | 'critical'
}

export default function ImpactAnalysis({
  title = 'Impact Analysis',
  description,
  metrics,
  overallAssessment,
}: Props) {
  const getImpactIcon = (impact: ImpactMetric['impact'], change?: number) => {
    if (change === undefined || change === 0) {
      return <Minus className="w-4 h-4 text-slate-400" />
    }
    if (impact === 'positive') {
      return <TrendingUp className="w-4 h-4 text-green-400" />
    }
    if (impact === 'negative') {
      return <TrendingDown className="w-4 h-4 text-red-400" />
    }
    return <Minus className="w-4 h-4 text-slate-400" />
  }

  const getImpactColor = (impact: ImpactMetric['impact']) => {
    switch (impact) {
      case 'positive':
        return 'text-green-400'
      case 'negative':
        return 'text-red-400'
      default:
        return 'text-slate-400'
    }
  }

  const getAssessmentColor = (assessment?: string) => {
    switch (assessment) {
      case 'excellent':
        return 'bg-green-600 text-white'
      case 'good':
        return 'bg-blue-600 text-white'
      case 'acceptable':
        return 'bg-amber-600 text-white'
      case 'poor':
        return 'bg-orange-600 text-white'
      case 'critical':
        return 'bg-red-600 text-white'
      default:
        return 'bg-slate-600 text-white'
    }
  }

  const getAssessmentIcon = (assessment?: string) => {
    if (assessment === 'excellent' || assessment === 'good') {
      return <CheckCircle className="w-4 h-4" />
    }
    if (assessment === 'poor' || assessment === 'critical') {
      return <XCircle className="w-4 h-4" />
    }
    return <Minus className="w-4 h-4" />
  }

  return (
    <div className="bg-[#192135] border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-slate-400 mt-1">{description}</p>
            )}
          </div>
          {overallAssessment && (
            <Badge className={`${getAssessmentColor(overallAssessment)} font-semibold`}>
              {getAssessmentIcon(overallAssessment)}
              <span className="ml-2">{overallAssessment.toUpperCase()}</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Metric
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Before
              </th>
              <th className="text-center px-2 py-3"></th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                After
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Change
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Impact
              </th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, idx) => (
              <tr
                key={idx}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-3 text-white font-medium">{metric.label}</td>
                <td className="px-4 py-3 text-right text-slate-300 font-mono">
                  {metric.before}
                  {metric.unit && <span className="text-xs text-slate-500 ml-1">{metric.unit}</span>}
                </td>
                <td className="px-2 py-3 text-center">
                  <ArrowRight className="w-4 h-4 text-slate-500 inline" />
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  <span className={getImpactColor(metric.impact)}>
                    {metric.after}
                    {metric.unit && <span className="text-xs opacity-70 ml-1">{metric.unit}</span>}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {metric.change !== undefined && metric.change !== 0 ? (
                    <span className={`font-semibold ${getImpactColor(metric.impact)}`}>
                      {metric.change > 0 ? '+' : ''}
                      {metric.change}%
                    </span>
                  ) : (
                    <span className="text-slate-500 text-xs">No change</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {getImpactIcon(metric.impact, metric.change)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-white/5 border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Decision impact across {metrics.length} key metrics
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-slate-300">
                {metrics.filter((m) => m.impact === 'positive').length} improved
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-3 h-3 text-red-400" />
              <span className="text-slate-300">
                {metrics.filter((m) => m.impact === 'negative').length} declined
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact summary version
export function ImpactSummary({ metrics }: { metrics: ImpactMetric[] }) {
  const positiveCount = metrics.filter((m) => m.impact === 'positive').length
  const negativeCount = metrics.filter((m) => m.impact === 'negative').length

  return (
    <div className="flex items-center gap-4 text-sm">
      <Badge variant="outline" className="border-green-500/50 text-green-400">
        <TrendingUp className="w-3 h-3 mr-1.5" />
        {positiveCount} Positive
      </Badge>
      <Badge variant="outline" className="border-red-500/50 text-red-400">
        <TrendingDown className="w-3 h-3 mr-1.5" />
        {negativeCount} Negative
      </Badge>
      <span className="text-slate-400">{metrics.length - positiveCount - negativeCount} Neutral</span>
    </div>
  )
}
