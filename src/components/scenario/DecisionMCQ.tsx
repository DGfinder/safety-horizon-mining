'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import DecisionHUD from './DecisionHUD'

type Choice = {
  id: string
  text: string
  icon?: string
  score: number
  kpiScores: Record<string, number>
  feedback: string
  outcome?: string
  nextNode: string
}

type Props = {
  node: {
    nodeKey: string
    body: {
      question: string
      kpiFocus: string[]
      pressureTimer?: number
      choices: Choice[]
    }
  }
  onDecision: (choiceId: string, choiceData: any) => void
}

export default function DecisionMCQ({ node, onDecision }: Props) {
  const { question, kpiFocus, choices } = node.body
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleSelect = (choiceId: string) => {
    if (showFeedback) return
    setSelectedId(choiceId)
  }

  const handleConfirm = () => {
    if (!selectedId) return

    const choice = choices.find((c) => c.id === selectedId)
    if (!choice) return

    setShowFeedback(true)

    // Pass to parent after showing feedback
    onDecision(selectedId, choice)
  }

  const selectedChoice = selectedId ? choices.find((c) => c.id === selectedId) : null

  // Sample decision context (in production, this would come from scenario metadata)
  const decisionContext = {
    timeRemaining: '10 minutes',
    personnelAffected: 8,
    currentRiskLevel: 'medium' as const,
    kpiAtRisk: kpiFocus,
    situationSummary: 'Critical decision point: Your choice will directly impact operational safety and efficiency.',
  }

  return (
    <div className="p-8 md:p-12">
      {/* Decision HUD */}
      <div className="mb-6">
        <DecisionHUD context={decisionContext} />
      </div>

      {/* Question */}
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">{question}</h2>

      {/* Choices */}
      <div className="space-y-4 mb-8">
        {choices.map((choice) => {
          const isSelected = selectedId === choice.id
          const isDisabled = showFeedback && !isSelected

          return (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice.id)}
              disabled={showFeedback}
              className={`
                w-full text-left p-6 rounded-xl border-2 transition-all
                ${
                  isSelected
                    ? 'border-[#EC5C29] bg-[#EC5C29]/10 scale-[1.02]'
                    : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                }
                ${isDisabled ? 'opacity-40' : ''}
                ${showFeedback ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                {choice.icon && (
                  <span className="text-3xl flex-shrink-0 mt-1">{choice.icon}</span>
                )}

                {/* Content */}
                <div className="flex-1">
                  <p className="text-lg text-white font-medium">{choice.text}</p>

                  {/* Show feedback if selected and confirmed */}
                  {showFeedback && isSelected && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-sm text-white/80 mb-2">{choice.feedback}</p>
                      {choice.outcome && (
                        <p className="text-sm text-white/60 italic">{choice.outcome}</p>
                      )}

                      {/* KPI Scores */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {Object.entries(choice.kpiScores).map(([kpi, score]) => (
                          <Badge
                            key={kpi}
                            variant={
                              score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {kpi.replace('_', ' ')}: {score}%
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#EC5C29] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Confirm Button */}
      {!showFeedback && (
        <div className="flex justify-end">
          <Button
            onClick={handleConfirm}
            disabled={!selectedId}
            size="lg"
            className="bg-[#EC5C29] hover:bg-[#EC5C29]/90 text-white font-semibold"
          >
            Confirm Decision
          </Button>
        </div>
      )}

      {showFeedback && selectedChoice && (
        <div className="flex justify-center">
          <div className="text-center py-4">
            <p className="text-white/60 text-sm">Moving to next scene...</p>
          </div>
        </div>
      )}
    </div>
  )
}
