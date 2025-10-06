'use client'

import { CheckCircle2, XCircle, AlertTriangle, Lightbulb } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
  isCorrect: boolean
  feedback: string
  explanation?: string
  safetyTip?: string
}

export default function DecisionFeedback({ isCorrect, feedback, explanation, safetyTip }: Props) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Feedback Card */}
      <Card className={`border-2 ${
        isCorrect
          ? 'border-green-500 bg-green-50'
          : 'border-red-500 bg-red-50'
      }`}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {isCorrect ? (
                <CheckCircle2 className="w-7 h-7 text-white" />
              ) : (
                <XCircle className="w-7 h-7 text-white" />
              )}
            </div>

            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-2 ${
                isCorrect ? 'text-green-900' : 'text-red-900'
              }`}>
                {isCorrect ? 'Correct Decision!' : 'Incorrect Decision'}
              </h3>
              <p className={`${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {feedback}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Explanation Card */}
      {explanation && (
        <Card className="border-blue-200 bg-blue-50 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">Why This Matters</h4>
                <p className="text-blue-800 text-sm">{explanation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Safety Tip Card */}
      {safetyTip && (
        <Card className="border-amber-200 bg-amber-50 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-amber-900 mb-1">Safety Insight</h4>
                <p className="text-amber-800 text-sm">{safetyTip}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
