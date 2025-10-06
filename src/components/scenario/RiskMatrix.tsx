'use client'

import { AlertTriangle, Info } from 'lucide-react'

type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

type RiskPoint = {
  id: string
  label: string
  likelihood: 1 | 2 | 3 | 4 | 5 // 1=rare, 5=almost certain
  consequence: 1 | 2 | 3 | 4 | 5 // 1=negligible, 5=catastrophic
}

type Props = {
  title?: string
  risks: RiskPoint[]
  showLegend?: boolean
}

export default function RiskMatrix({ title = 'Risk Assessment Matrix', risks, showLegend = true }: Props) {
  // Calculate risk level based on likelihood × consequence
  const getRiskLevel = (likelihood: number, consequence: number): RiskLevel => {
    const score = likelihood * consequence
    if (score >= 20) return 'critical'
    if (score >= 12) return 'high'
    if (score >= 6) return 'medium'
    return 'low'
  }

  // Get cell color based on risk level
  const getCellColor = (likelihood: number, consequence: number): string => {
    const level = getRiskLevel(likelihood, consequence)
    switch (level) {
      case 'critical':
        return 'bg-red-600/80 border-red-500/50'
      case 'high':
        return 'bg-orange-600/80 border-orange-500/50'
      case 'medium':
        return 'bg-amber-600/80 border-amber-500/50'
      case 'low':
        return 'bg-green-600/80 border-green-500/50'
    }
  }

  // Likelihood labels
  const likelihoodLabels = [
    { value: 5, label: 'Almost Certain' },
    { value: 4, label: 'Likely' },
    { value: 3, label: 'Possible' },
    { value: 2, label: 'Unlikely' },
    { value: 1, label: 'Rare' },
  ]

  // Consequence labels
  const consequenceLabels = [
    { value: 1, label: 'Negligible' },
    { value: 2, label: 'Minor' },
    { value: 3, label: 'Moderate' },
    { value: 4, label: 'Major' },
    { value: 5, label: 'Catastrophic' },
  ]

  // Find risks in each cell
  const getRisksInCell = (likelihood: number, consequence: number) => {
    return risks.filter((r) => r.likelihood === likelihood && r.consequence === consequence)
  }

  return (
    <div className="bg-[#192135] border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-3 h-3" />
            <span>{risks.length} risk{risks.length !== 1 ? 's' : ''} plotted</span>
          </div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="p-4 overflow-x-auto">
        <div className="inline-block min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2"></th>
                <th
                  colSpan={5}
                  className="p-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  Consequence →
                </th>
              </tr>
              <tr>
                <th className="p-2 text-right text-xs font-semibold text-slate-400 uppercase w-24">
                  Likelihood ↓
                </th>
                {consequenceLabels.map((c) => (
                  <th
                    key={c.value}
                    className="p-2 text-center text-xs text-slate-400 min-w-[90px]"
                  >
                    <div className="font-semibold">{c.value}</div>
                    <div className="text-[10px] opacity-70">{c.label}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {likelihoodLabels.map((l) => (
                <tr key={l.value}>
                  <td className="p-2 text-right text-xs text-slate-400 pr-4">
                    <div className="font-semibold">{l.value}</div>
                    <div className="text-[10px] opacity-70">{l.label}</div>
                  </td>
                  {consequenceLabels.map((c) => {
                    const cellRisks = getRisksInCell(l.value, c.value)
                    return (
                      <td
                        key={`${l.value}-${c.value}`}
                        className={`
                          border border-white/10 p-1 text-center
                          ${getCellColor(l.value, c.value)}
                          ${cellRisks.length > 0 ? 'cursor-pointer hover:opacity-90' : 'opacity-50'}
                          transition-opacity
                        `}
                      >
                        {cellRisks.length > 0 && (
                          <div className="flex flex-col gap-1">
                            {cellRisks.map((risk) => (
                              <div
                                key={risk.id}
                                className="bg-black/30 rounded px-2 py-1 text-[10px] text-white font-medium border border-white/20"
                              >
                                {risk.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="bg-white/5 border-t border-white/10 px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Risk Levels:</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-600/80 border border-green-500/50" />
                <span className="text-slate-300">Low (1-5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-600/80 border border-amber-500/50" />
                <span className="text-slate-300">Medium (6-11)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-600/80 border border-orange-500/50" />
                <span className="text-slate-300">High (12-19)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-600/80 border border-red-500/50" />
                <span className="text-slate-300">Critical (20-25)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Risk summary component
export function RiskSummary({ risks }: { risks: RiskPoint[] }) {
  const getRiskLevel = (likelihood: number, consequence: number): RiskLevel => {
    const score = likelihood * consequence
    if (score >= 20) return 'critical'
    if (score >= 12) return 'high'
    if (score >= 6) return 'medium'
    return 'low'
  }

  const riskCounts = risks.reduce(
    (acc, risk) => {
      const level = getRiskLevel(risk.likelihood, risk.consequence)
      acc[level]++
      return acc
    },
    { low: 0, medium: 0, high: 0, critical: 0 }
  )

  const highestRisk = risks.reduce(
    (max, risk) => {
      const score = risk.likelihood * risk.consequence
      return score > max.score ? { score, risk } : max
    },
    { score: 0, risk: risks[0] }
  )

  return (
    <div className="flex items-center gap-4 text-sm">
      {riskCounts.critical > 0 && (
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-semibold">{riskCounts.critical} Critical</span>
        </div>
      )}
      {riskCounts.high > 0 && (
        <span className="text-orange-400">{riskCounts.high} High</span>
      )}
      {riskCounts.medium > 0 && (
        <span className="text-amber-400">{riskCounts.medium} Medium</span>
      )}
      {riskCounts.low > 0 && (
        <span className="text-green-400">{riskCounts.low} Low</span>
      )}
      {highestRisk.risk && (
        <span className="text-slate-400 ml-2">
          Highest: {highestRisk.risk.label}
        </span>
      )}
    </div>
  )
}
