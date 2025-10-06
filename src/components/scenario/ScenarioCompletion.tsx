'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Star, Target, TrendingUp, Award, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

type Props = {
  score: number
  passed: boolean
  totalDecisions: number
  correctDecisions: number
  moduleTitle: string
  moduleId?: string
}

export default function ScenarioCompletion({
  score,
  passed,
  totalDecisions,
  correctDecisions,
  moduleTitle,
  moduleId
}: Props) {
  const passThreshold = 70
  const isExcellent = score >= 90
  const isGood = score >= 80

  // Calculate performance metrics
  const accuracy = totalDecisions > 0
    ? Math.round((correctDecisions / totalDecisions) * 100)
    : 0

  const getPerformanceMessage = () => {
    if (isExcellent) return "Outstanding performance! You've demonstrated exceptional crew resource management skills."
    if (isGood) return "Great work! You've shown strong decision-making capabilities."
    if (passed) return "Well done! You've passed this module. Review the feedback to further improve."
    return "Keep practicing. Review the scenario and try again to improve your understanding."
  }

  const getScoreColor = () => {
    if (isExcellent) return 'text-green-600'
    if (isGood) return 'text-blue-600'
    if (passed) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBgColor = () => {
    if (isExcellent) return 'bg-green-50 border-green-200'
    if (isGood) return 'bg-blue-50 border-blue-200'
    if (passed) return 'bg-amber-50 border-amber-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className="max-w-3xl w-full">
        <CardHeader className="text-center pb-4">
          {/* Score Circle */}
          <div className="flex justify-center mb-6">
            <div className={`relative w-40 h-40 rounded-full border-8 ${getScoreBgColor()} flex items-center justify-center`}>
              <div className="text-center">
                <div className={`text-5xl font-bold ${getScoreColor()}`}>{score}%</div>
                <div className="text-sm text-slate-600 mt-1">Score</div>
              </div>
              {passed && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <CardTitle className="text-3xl mb-2">
            {passed ? (
              <span className="flex items-center justify-center gap-2">
                <Trophy className="w-8 h-8 text-[#EC5C29]" />
                Module Complete!
              </span>
            ) : (
              'Review & Try Again'
            )}
          </CardTitle>

          <CardDescription className="text-lg">
            {moduleTitle}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Performance Message */}
          <div className={`p-4 rounded-lg ${getScoreBgColor()}`}>
            <p className={`text-center font-medium ${getScoreColor()}`}>
              {getPerformanceMessage()}
            </p>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-center mb-2">
                <Target className="w-6 h-6 text-[#EC5C29]" />
              </div>
              <div className="text-2xl font-bold text-[#192135]">{accuracy}%</div>
              <div className="text-xs text-slate-600">Accuracy</div>
            </div>

            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-center mb-2">
                <Star className="w-6 h-6 text-[#EC5C29]" />
              </div>
              <div className="text-2xl font-bold text-[#192135]">{correctDecisions}/{totalDecisions}</div>
              <div className="text-xs text-slate-600">Correct Decisions</div>
            </div>

            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-center mb-2">
                <Award className="w-6 h-6 text-[#EC5C29]" />
              </div>
              <div className="text-2xl font-bold text-[#192135]">{passed ? 'PASS' : 'RETRY'}</div>
              <div className="text-xs text-slate-600">Status</div>
            </div>
          </div>

          {/* Key Learnings */}
          <div className="bg-gradient-to-r from-[#192135] to-[#0f1822] text-white p-6 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Key Takeaways
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• Effective crew resource management requires clear communication</li>
              <li>• Risk assessment must consider all available information</li>
              <li>• Situational awareness is critical for safe operations</li>
              <li>• Team coordination improves decision quality</li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/lms"
              className="flex-1 px-6 py-3 bg-[#192135] text-white rounded-lg hover:bg-[#192135]/90 transition text-center font-semibold"
            >
              Back to Dashboard
            </Link>

            {!passed && moduleId && (
              <Link
                href={`/lms/scenarios/${moduleId}`}
                className="flex-1 px-6 py-3 bg-[#EC5C29] text-white rounded-lg hover:bg-[#EC5C29]/90 transition text-center font-semibold"
              >
                Try Again
              </Link>
            )}

            {passed && (
              <Link
                href="/lms"
                className="flex-1 px-6 py-3 border-2 border-[#EC5C29] text-[#EC5C29] rounded-lg hover:bg-[#EC5C29] hover:text-white transition text-center font-semibold"
              >
                Next Module
              </Link>
            )}
          </div>

          {/* Pass Threshold Info */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-slate-500">
              Pass threshold: {passThreshold}% • Your score: {score}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
