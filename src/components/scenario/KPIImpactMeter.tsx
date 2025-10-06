'use client'

import { TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type KPIMetric = {
  name: string
  currentValue: number
  targetValue: number
  impact: number // positive or negative change
  unit?: string
  description?: string
}

type Props = {
  kpis: KPIMetric[]
  title?: string
  layout?: 'grid' | 'list'
}

export default function KPIImpactMeter({ kpis, title = 'KPI Impact Analysis', layout = 'grid' }: Props) {
  const getImpactColor = (impact: number): string => {
    if (impact > 10) return 'text-green-400'
    if (impact > 0) return 'text-blue-400'
    if (impact > -10) return 'text-amber-400'
    return 'text-red-400'
  }

  const getImpactBgColor = (impact: number): string => {
    if (impact > 10) return 'bg-green-950/30 border-green-800/50'
    if (impact > 0) return 'bg-blue-950/30 border-blue-800/50'
    if (impact > -10) return 'bg-amber-950/30 border-amber-800/50'
    return 'bg-red-950/30 border-red-800/50'
  }

  const getProgressPercentage = (current: number, target: number): number => {
    if (target === 0) return 100
    return Math.min(Math.max((current / target) * 100, 0), 100)
  }

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-green-500'
    if (percentage >= 70) return 'bg-blue-500'
    if (percentage >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-[#192135] border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-white/20 text-slate-300">
              {kpis.length} KPIs Tracked
            </Badge>
          </div>
        </div>
      </div>

      {/* KPI Meters */}
      <div className={`p-4 ${layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}`}>
        {kpis.map((kpi, idx) => {
          const percentage = getProgressPercentage(kpi.currentValue, kpi.targetValue)
          const isOnTarget = percentage >= 90

          return (
            <div
              key={idx}
              className={`border rounded-lg p-4 ${getImpactBgColor(kpi.impact)}`}
            >
              {/* KPI Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-slate-400" />
                    <h4 className="text-sm font-semibold text-white">{kpi.name}</h4>
                  </div>
                  {kpi.description && (
                    <p className="text-xs text-slate-400">{kpi.description}</p>
                  )}
                </div>
                {isOnTarget ? (
                  <Badge className="bg-green-600 text-white text-xs">
                    On Target
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-amber-500/50 text-amber-300 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Below Target
                  </Badge>
                )}
              </div>

              {/* Current vs Target */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Current</div>
                  <div className="text-lg font-bold text-white">
                    {kpi.currentValue}
                    {kpi.unit && <span className="text-xs text-slate-400 ml-1">{kpi.unit}</span>}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Target</div>
                  <div className="text-lg font-bold text-slate-300">
                    {kpi.targetValue}
                    {kpi.unit && <span className="text-xs text-slate-400 ml-1">{kpi.unit}</span>}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Progress to Target</span>
                  <span className="font-semibold">{percentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(percentage)} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Impact Indicator */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-xs text-slate-400">Decision Impact</span>
                <div className={`flex items-center gap-2 ${getImpactColor(kpi.impact)}`}>
                  {kpi.impact > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : kpi.impact < 0 ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : null}
                  <span className="text-sm font-bold">
                    {kpi.impact > 0 ? '+' : ''}
                    {kpi.impact}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Footer */}
      <div className="bg-white/5 border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Overall KPI Performance</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-slate-300">
                {kpis.filter((k) => getProgressPercentage(k.currentValue, k.targetValue) >= 90).length} On Target
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-slate-300">
                {kpis.filter((k) => getProgressPercentage(k.currentValue, k.targetValue) < 90).length} Below Target
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact KPI display for summaries
export function KPICompactMeter({ kpi }: { kpi: KPIMetric }) {
  const percentage = Math.min(Math.max((kpi.currentValue / kpi.targetValue) * 100, 0), 100)

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="text-xs text-slate-400 mb-1">{kpi.name}</div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${percentage >= 90 ? 'bg-green-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'} transition-all`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="text-sm font-semibold text-white whitespace-nowrap">
        {kpi.currentValue}/{kpi.targetValue}
      </div>
      {kpi.impact !== 0 && (
        <div className={`text-xs font-bold ${kpi.impact > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {kpi.impact > 0 ? '+' : ''}
          {kpi.impact}%
        </div>
      )}
    </div>
  )
}
