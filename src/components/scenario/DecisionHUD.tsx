'use client'

import { AlertTriangle, Shield, TrendingUp, Clock, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type DecisionContext = {
  timeRemaining?: string
  personnelAffected?: number
  currentRiskLevel?: 'low' | 'medium' | 'high' | 'critical'
  kpiAtRisk?: string[]
  situationSummary?: string
}

type Props = {
  context: DecisionContext
  decisionNumber?: number
  totalDecisions?: number
}

export default function DecisionHUD({ context, decisionNumber, totalDecisions }: Props) {
  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'low':
        return 'text-green-400 border-green-400/50 bg-green-950/30'
      case 'medium':
        return 'text-amber-400 border-amber-400/50 bg-amber-950/30'
      case 'high':
        return 'text-orange-400 border-orange-400/50 bg-orange-950/30'
      case 'critical':
        return 'text-red-400 border-red-400/50 bg-red-950/30 animate-pulse'
      default:
        return 'text-slate-400 border-slate-400/50 bg-slate-950/30'
    }
  }

  const getRiskIcon = (level?: string) => {
    switch (level) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Shield className="w-5 h-5" />
    }
  }

  return (
    <div className="bg-[#192135] border border-white/10 rounded-lg overflow-hidden">
      {/* HUD Header */}
      <div className="bg-white/5 border-b border-white/10 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#EC5C29] animate-pulse" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Decision Required
            </h3>
            {decisionNumber && totalDecisions && (
              <Badge variant="outline" className="text-xs border-white/20 text-slate-300">
                {decisionNumber} of {totalDecisions}
              </Badge>
            )}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {new Date().toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>
      </div>

      {/* Main HUD Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {/* Risk Level */}
          <div
            className={`border rounded-lg p-3 ${getRiskColor(context.currentRiskLevel)}`}
          >
            <div className="flex items-center gap-2 mb-2">
              {getRiskIcon(context.currentRiskLevel)}
              <span className="text-xs uppercase font-semibold">Risk Level</span>
            </div>
            <div className="text-lg font-bold uppercase">
              {context.currentRiskLevel || 'Unknown'}
            </div>
          </div>

          {/* Time Remaining */}
          {context.timeRemaining && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400 uppercase">Time Window</span>
              </div>
              <div className="text-lg font-semibold text-white">
                {context.timeRemaining}
              </div>
            </div>
          )}

          {/* Personnel Affected */}
          {context.personnelAffected !== undefined && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400 uppercase">Personnel</span>
              </div>
              <div className="text-lg font-semibold text-white">
                {context.personnelAffected} affected
              </div>
            </div>
          )}

          {/* KPIs at Risk */}
          {context.kpiAtRisk && context.kpiAtRisk.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400 uppercase">KPIs at Risk</span>
              </div>
              <div className="text-lg font-semibold text-white">
                {context.kpiAtRisk.length}
              </div>
            </div>
          )}
        </div>

        {/* Situation Summary */}
        {context.situationSummary && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-1 rounded-full bg-[#EC5C29]" />
              <span className="text-xs text-slate-400 uppercase font-semibold">
                Situation Brief
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {context.situationSummary}
            </p>
          </div>
        )}

        {/* KPI Details */}
        {context.kpiAtRisk && context.kpiAtRisk.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {context.kpiAtRisk.map((kpi, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="border-amber-500/50 text-amber-300 bg-amber-950/20"
                >
                  {kpi}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="bg-white/5 border-t border-white/10 px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span>Systems Operational</span>
          </div>
          <span className="text-slate-500 font-mono">
            Your decision will impact operational outcomes
          </span>
        </div>
      </div>
    </div>
  )
}

// Compact version for inline use
export function DecisionHUDCompact({ context }: { context: DecisionContext }) {
  return (
    <div className="flex items-center gap-4 text-sm">
      {context.currentRiskLevel && (
        <Badge
          variant="outline"
          className={
            context.currentRiskLevel === 'critical' || context.currentRiskLevel === 'high'
              ? 'border-red-500/50 text-red-300'
              : 'border-amber-500/50 text-amber-300'
          }
        >
          <AlertTriangle className="w-3 h-3 mr-1.5" />
          {context.currentRiskLevel.toUpperCase()} RISK
        </Badge>
      )}
      {context.personnelAffected !== undefined && (
        <span className="text-slate-300">
          <Users className="w-3 h-3 inline mr-1" />
          {context.personnelAffected} personnel
        </span>
      )}
      {context.timeRemaining && (
        <span className="text-slate-300">
          <Clock className="w-3 h-3 inline mr-1" />
          {context.timeRemaining}
        </span>
      )}
    </div>
  )
}
