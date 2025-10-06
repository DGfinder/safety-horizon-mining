'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, RotateCcw, Home, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import ImpactAnalysis from './ImpactAnalysis'
import KPIImpactMeter from './KPIImpactMeter'

type Props = {
  node: {
    nodeKey: string
    body: {
      title: string
      summary: string
      kpiResults?: Record<string, string>
      lessons?: string[]
    }
  }
  decisions: any[]
  scenarioSlug: string
  attemptId: string
  moduleId?: string
  onComplete: (passed: boolean, totalScore: number, kpiScores: any) => void
}

export default function OutcomeDisplay({
  node,
  decisions,
  scenarioSlug,
  attemptId,
  moduleId,
  onComplete,
}: Props) {
  const { title, summary, kpiResults, lessons } = node.body
  const [hasCompleted, setHasCompleted] = useState(false)

  // Calculate results
  const totalScore = decisions.length > 0
    ? Math.round(decisions.reduce((sum, d) => sum + d.score, 0) / decisions.length)
    : 0

  const passed = totalScore >= 70

  // Calculate KPI averages
  const kpiScores: Record<string, number> = {}
  if (decisions.length > 0) {
    const allKpis = new Set<string>()
    decisions.forEach((d) => {
      Object.keys(d.kpiScores).forEach((kpi) => allKpis.add(kpi))
    })

    allKpis.forEach((kpi) => {
      const scores = decisions
        .filter((d) => d.kpiScores[kpi] !== undefined)
        .map((d) => d.kpiScores[kpi])
      kpiScores[kpi] = scores.length > 0
        ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
        : 0
    })
  }

  useEffect(() => {
    if (!hasCompleted) {
      onComplete(passed, totalScore, kpiScores)
      setHasCompleted(true)
    }
  }, [hasCompleted, passed, totalScore, kpiScores, onComplete])

  return (
    <div className="p-8 md:p-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          {passed ? (
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-amber-400" />
            </div>
          )}
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h2>
        <p className="text-lg text-white/70">{summary}</p>
      </div>

      {/* Score Card */}
      <Card className="bg-white/10 border-white/20 mb-8">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-white mb-2">{totalScore}%</div>
            <div className="text-white/60">
              {passed ? (
                <Badge className="bg-green-600 text-white">
                  ✓ Passed (70% required)
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Needs Improvement (70% required)
                </Badge>
              )}
            </div>
          </div>

          {/* KPI Breakdown */}
          {Object.keys(kpiScores).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white/60 mb-3 text-center">
                KPI PERFORMANCE
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(kpiScores).map(([kpi, score]) => (
                  <div
                    key={kpi}
                    className="text-center p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="text-2xl font-bold text-white mb-1">{score}%</div>
                    <div className="text-xs text-white/60 capitalize">
                      {kpi.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Professional Impact Analysis */}
      <div className="mb-8">
        <ImpactAnalysis
          title="Decision Impact Summary"
          description="Analysis of key operational metrics affected by your decisions"
          metrics={[
            {
              label: 'Safety Incidents',
              before: 3,
              after: passed ? 0 : 2,
              change: passed ? -100 : -33,
              impact: passed ? 'positive' : 'positive',
              unit: 'incidents',
            },
            {
              label: 'Production Rate',
              before: 850,
              after: passed ? 920 : 800,
              change: passed ? 8 : -6,
              impact: passed ? 'positive' : 'negative',
              unit: 't/hr',
            },
            {
              label: 'Equipment Utilization',
              before: 75,
              after: passed ? 88 : 70,
              change: passed ? 17 : -7,
              impact: passed ? 'positive' : 'negative',
              unit: '%',
            },
            {
              label: 'Crew Morale',
              before: 70,
              after: passed ? 85 : 68,
              change: passed ? 21 : -3,
              impact: passed ? 'positive' : 'negative',
              unit: '%',
            },
          ]}
          overallAssessment={
            passed
              ? totalScore >= 90
                ? 'excellent'
                : 'good'
              : totalScore >= 60
              ? 'acceptable'
              : 'poor'
          }
        />
      </div>

      {/* KPI Impact Meters */}
      <div className="mb-8">
        <KPIImpactMeter
          title="Key Performance Indicators"
          kpis={Object.entries(kpiScores).map(([name, currentValue]) => ({
            name: name.replace('_', ' '),
            currentValue,
            targetValue: 100,
            impact: passed ? (currentValue >= 90 ? 15 : 8) : currentValue >= 70 ? 5 : -10,
            unit: '%',
            description: `${name.replace('_', ' ')} performance metric`,
          }))}
        />
      </div>

      {/* Key Lessons */}
      {lessons && lessons.length > 0 && (
        <Card className="bg-white/10 border-white/20 mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Key Lessons</h3>
            <ul className="space-y-3">
              {lessons.map((lesson, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-[#EC5C29] font-bold mt-1">•</span>
                  <span className="text-white/80">{lesson}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href={`/lms/scenarios/${scenarioSlug}?moduleId=${moduleId}`}>
          <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white/30">
            <RotateCcw className="mr-2 w-5 h-5" />
            Retry Scenario
          </Button>
        </Link>

        <Link href="/lms">
          <Button size="lg" className="w-full sm:w-auto bg-[#EC5C29] hover:bg-[#EC5C29]/90 text-white">
            <Home className="mr-2 w-5 h-5" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Next Module Hint */}
      {passed && moduleId && (
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            <Trophy className="w-4 h-4 inline mr-1" />
            Module completed! Continue to the next module from your dashboard.
          </p>
        </div>
      )}
    </div>
  )
}
