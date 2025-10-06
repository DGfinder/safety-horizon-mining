'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'
import NarrativeDisplay from './NarrativeDisplay'
import DecisionMCQ from './DecisionMCQ'
import OutcomeDisplay from './OutcomeDisplay'

type ScenarioNode = {
  id: string
  nodeKey: string
  nodeType: string
  body: any
}

type Scenario = {
  id: string
  slug: string
  title: string
  estimatedMinutes: number
  kpiFocus: string[]
  nodes: ScenarioNode[]
}

type Attempt = {
  id: string
}

type Props = {
  scenario: Scenario
  attempt: Attempt
  moduleId?: string
}

export default function ScenarioPlayer({ scenario, attempt, moduleId }: Props) {
  // Find starting node (first narrative or 'n1')
  const startNode = scenario.nodes.find(
    (n) => n.nodeKey === 'n1' || n.nodeType === 'NARRATIVE'
  )

  const [currentNodeKey, setCurrentNodeKey] = useState(startNode?.nodeKey || 'n1')
  const [decisions, setDecisions] = useState<any[]>([])
  const [isComplete, setIsComplete] = useState(false)

  const currentNode = scenario.nodes.find((n) => n.nodeKey === currentNodeKey)

  if (!currentNode) {
    return <div className="text-white p-8">Error: Node not found</div>
  }

  const handleNext = (nextNodeKey?: string) => {
    if (nextNodeKey) {
      setCurrentNodeKey(nextNodeKey)
    } else {
      // Try to find next node from body
      const nextKey = currentNode.body.next
      if (nextKey) {
        setCurrentNodeKey(nextKey)
      }
    }
  }

  const handleDecision = async (choiceId: string, choiceData: any) => {
    // Save decision
    const newDecision = {
      nodeKey: currentNodeKey,
      choiceId,
      score: choiceData.score,
      kpiScores: choiceData.kpiScores,
      feedback: choiceData.feedback,
    }

    setDecisions([...decisions, newDecision])

    // Call API to save decision
    try {
      await fetch(`/api/attempts/${attempt.id}/decisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeKey: currentNodeKey,
          choiceId,
          score: choiceData.score,
          kpiScores: choiceData.kpiScores,
          feedback: choiceData.feedback,
        }),
      })
    } catch (error) {
      console.error('Failed to save decision:', error)
    }

    // Navigate to next node
    const nextNode = choiceData.nextNode
    if (nextNode) {
      setTimeout(() => {
        setCurrentNodeKey(nextNode)
      }, 1500)
    }
  }

  const handleComplete = async (passed: boolean, totalScore: number, kpiScores: any) => {
    setIsComplete(true)

    // Call API to complete attempt
    try {
      await fetch(`/api/attempts/${attempt.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passed,
          totalScore,
          kpiScores,
          moduleId,
        }),
      })
    } catch (error) {
      console.error('Failed to complete attempt:', error)
    }
  }

  // Calculate progress
  const totalNodes = scenario.nodes.length
  const currentIndex = scenario.nodes.findIndex((n) => n.nodeKey === currentNodeKey)
  const progressPercent = Math.round(((currentIndex + 1) / totalNodes) * 100)

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/lms"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-4 text-slate-300">
            <Badge variant="outline" className="text-white border-white/30">
              {scenario.kpiFocus.join(', ')}
            </Badge>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{scenario.estimatedMinutes} min</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{scenario.title}</h1>

        <div className="mt-4">
          <Progress value={progressPercent} className="h-2 bg-slate-700" />
          <p className="text-sm text-slate-400 mt-2">
            Step {currentIndex + 1} of {totalNodes}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-0">
            {currentNode.nodeType === 'NARRATIVE' && (
              <NarrativeDisplay node={currentNode} onNext={handleNext} />
            )}

            {currentNode.nodeType === 'DECISION' && (
              <DecisionMCQ node={currentNode} onDecision={handleDecision} />
            )}

            {currentNode.nodeType === 'OUTCOME' && (
              <OutcomeDisplay
                node={currentNode}
                decisions={decisions}
                scenarioSlug={scenario.slug}
                attemptId={attempt.id}
                moduleId={moduleId}
                onComplete={handleComplete}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
