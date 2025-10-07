'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, AlertTriangle, GitBranch, Save } from 'lucide-react'

interface Incident {
  id: string
  incidentNumber: string
  title: string
  description: string
  incidentDate: Date
  severity: string
  category: string
  location: string
  equipment: string | null
  rootCause: string | null
  contributingFactors: string[]
  correctiveActions: string[]
  keyLessons: string[]
  kpiAreasAffected: string[]
  site: { name: string }
}

interface ScenarioGeneratorProps {
  incident: Incident
}

export default function ScenarioGenerator({ incident }: ScenarioGeneratorProps) {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [scenario, setScenario] = useState<any>(null)

  const generateScenario = () => {
    setGenerating(true)

    // Auto-generate scenario structure from incident
    // This is a template-based approach (no AI needed)
    const scenarioSlug = `incident-${incident.incidentNumber.toLowerCase()}`

    // Create narrative from incident description
    const narrativeText = `${incident.description}\n\nLocation: ${incident.location}\nDate: ${new Date(incident.incidentDate).toLocaleDateString()}\n${incident.equipment ? `Equipment: ${incident.equipment}` : ''}`

    // Generate decision node from contributing factors
    const choices = []

    // Add choices based on what SHOULD have been done (corrective actions)
    incident.correctiveActions.forEach((action, i) => {
      choices.push({
        id: String.fromCharCode(97 + i), // a, b, c, d
        text: action,
        icon: '✅',
        score: 90,
        kpiScores: generateKpiScores(incident.kpiAreasAffected, 90),
        feedback: `Correct! ${action} is a key preventive measure.`,
        nextNode: 'o_success',
      })
    })

    // Add a "wrong" choice based on what actually happened
    if (incident.rootCause) {
      choices.push({
        id: String.fromCharCode(97 + choices.length),
        text: `Continue without addressing: ${incident.rootCause}`,
        icon: '⚠️',
        score: 20,
        kpiScores: generateKpiScores(incident.kpiAreasAffected, 20),
        feedback: `This was a contributing factor to the actual incident: ${incident.title}`,
        nextNode: 'o_failure',
      })
    }

    const generatedScenario = {
      slug: scenarioSlug,
      title: `Learning from: ${incident.title}`,
      estimatedMinutes: 10,
      difficulty: incident.severity === 'CRITICAL' || incident.severity === 'FATALITY' ? 'ADVANCED' : 'INTERMEDIATE',
      kpiFocus: incident.kpiAreasAffected.slice(0, 3), // Max 3 KPIs
      nodes: [
        {
          nodeKey: 'n1',
          nodeType: 'NARRATIVE',
          body: {
            text: narrativeText,
            atmosphere: {
              time: new Date(incident.incidentDate).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
              location: incident.location,
              weather: '',
            },
            next: 'd1',
          },
        },
        {
          nodeKey: 'd1',
          nodeType: 'DECISION',
          body: {
            question: 'Based on this situation, what is the most appropriate action?',
            kpiFocus: incident.kpiAreasAffected,
            choices: choices,
          },
        },
        {
          nodeKey: 'o_success',
          nodeType: 'OUTCOME',
          body: {
            title: 'Incident Prevented',
            result: 'SUCCESS',
            summary: incident.keyLessons.join('\n\n'),
            kpiBreakdown: {},
          },
        },
        {
          nodeKey: 'o_failure',
          nodeType: 'OUTCOME',
          body: {
            title: 'Incident Occurred',
            result: 'FAILURE',
            summary: `This scenario is based on actual incident ${incident.incidentNumber} at ${incident.site.name}.\n\nWhat actually happened: ${incident.description}\n\nLessons learned:\n${incident.keyLessons.join('\n')}`,
            kpiBreakdown: {},
          },
        },
      ],
    }

    setScenario(generatedScenario)
    setGenerating(false)
  }

  const generateKpiScores = (kpis: string[], baseScore: number) => {
    const scores: Record<string, number> = {}
    kpis.forEach(kpi => {
      scores[kpi] = baseScore
    })
    return scores
  }

  const handleSave = async () => {
    if (!scenario) return

    setGenerating(true)
    try {
      const response = await fetch('/api/admin/incidents/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: incident.id,
          scenario: scenario,
        }),
      })

      if (!response.ok) throw new Error('Failed to create scenario')

      const data = await response.json()
      alert('Training scenario created successfully!')
      router.push(`/admin/modules/${data.moduleId}/scenario`)
    } catch (error) {
      console.error('Error creating scenario:', error)
      alert('Failed to create scenario. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Incident Summary */}
      <Card className="border-amber-300 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Source Incident
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-slate-700">Incident Number:</span>
              <span className="ml-2 font-mono">{incident.incidentNumber}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Severity:</span>
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                {incident.severity}
              </span>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Location:</span>
              <span className="ml-2">{incident.location}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Site:</span>
              <span className="ml-2">{incident.site.name}</span>
            </div>
          </div>
          <div>
            <div className="font-semibold text-slate-700 mb-1">Description:</div>
            <p className="text-slate-600 text-sm">{incident.description}</p>
          </div>
          {incident.keyLessons.length > 0 && (
            <div>
              <div className="font-semibold text-slate-700 mb-1">Key Lessons ({incident.keyLessons.length}):</div>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {incident.keyLessons.map((lesson, i) => (
                  <li key={i}>{lesson}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generation Options */}
      {!scenario ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#EC5C29]" />
              Auto-Generate Training Scenario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">
              Automatically convert this incident into an interactive training scenario. The system will:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-2 pl-4">
              <li>Create a narrative based on the incident description</li>
              <li>Generate decision points from corrective actions</li>
              <li>Use key lessons as learning outcomes</li>
              <li>Map KPI areas to scenario choices</li>
              <li>Create both success and failure pathways</li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <GitBranch className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Aviation Best Practice</h4>
                  <p className="text-sm text-blue-700">
                    Airlines convert every incident into mandatory scenario training within 30 days.
                    This ensures the entire organization learns from near-misses before they become fatalities.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={generateScenario}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors font-semibold disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              {generating ? 'Generating...' : 'Generate Training Scenario'}
            </button>
          </CardContent>
        </Card>
      ) : (
        /* Scenario Preview */
        <Card className="border-emerald-300 bg-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-emerald-600" />
              Generated Scenario Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-semibold text-slate-900 mb-1">Scenario Title:</div>
              <div className="text-lg">{scenario.title}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-slate-700">Duration:</div>
                <div>{scenario.estimatedMinutes} minutes</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Difficulty:</div>
                <div className="capitalize">{scenario.difficulty.toLowerCase()}</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Nodes:</div>
                <div>{scenario.nodes.length} (narrative, decision, outcomes)</div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-slate-700 mb-2">Decision Choices:</div>
              <div className="space-y-2">
                {scenario.nodes.find((n: any) => n.nodeType === 'DECISION')?.body.choices.map((choice: any, i: number) => (
                  <div key={i} className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{choice.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">{choice.text}</div>
                        <div className="text-xs text-slate-600 mt-1">Score: {choice.score}/100</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t">
              <button
                onClick={() => setScenario(null)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
              >
                Regenerate
              </button>
              <button
                onClick={handleSave}
                disabled={generating}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {generating ? 'Creating...' : 'Create Scenario Module'}
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
