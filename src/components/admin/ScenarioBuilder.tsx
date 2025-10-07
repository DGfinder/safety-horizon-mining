'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Plus,
  Save,
  Eye,
  Trash2,
  FileText,
  GitBranch,
  Trophy,
  Settings,
} from 'lucide-react'

interface Module {
  id: string
  title: string
  scenarioId: string | null
  scenario?: Scenario | null
}

interface Scenario {
  id: string
  slug: string
  title: string
  estimatedMinutes: number
  difficulty: string
  kpiFocus: string[]
  nodes: ScenarioNode[]
}

interface ScenarioNode {
  id: string
  nodeKey: string
  nodeType: 'NARRATIVE' | 'DECISION' | 'OUTCOME'
  body: any
}

interface ScenarioBuilderProps {
  module: Module
}

export default function ScenarioBuilder({ module }: ScenarioBuilderProps) {
  const router = useRouter()
  const [scenarioMeta, setScenarioMeta] = useState({
    title: module.scenario?.title || `${module.title} - Scenario`,
    slug: module.scenario?.slug || '',
    estimatedMinutes: module.scenario?.estimatedMinutes || 10,
    difficulty: module.scenario?.difficulty || 'INTERMEDIATE',
    kpiFocus: module.scenario?.kpiFocus || [],
  })
  const [nodes, setNodes] = useState<ScenarioNode[]>(module.scenario?.nodes || [])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const kpiOptions = [
    'just_culture',
    'leadership',
    'communication',
    'psychological_safety',
    'situational_awareness',
    'learning_culture',
    'decision_making',
    'team_coordination',
  ]

  const addNode = (type: 'NARRATIVE' | 'DECISION' | 'OUTCOME') => {
    const prefix = type === 'NARRATIVE' ? 'n' : type === 'DECISION' ? 'd' : 'o'
    const nodeKey = `${prefix}${nodes.length + 1}`

    let defaultBody: any = {}

    if (type === 'NARRATIVE') {
      defaultBody = {
        text: 'Narrative text goes here...',
        atmosphere: {
          time: '',
          weather: '',
          location: '',
        },
        next: '',
      }
    } else if (type === 'DECISION') {
      defaultBody = {
        question: 'What do you do?',
        kpiFocus: [],
        choices: [
          {
            id: 'a',
            text: 'Option A',
            icon: '🤔',
            score: 50,
            kpiScores: {},
            feedback: 'Feedback for this choice',
            nextNode: '',
          },
        ],
      }
    } else if (type === 'OUTCOME') {
      defaultBody = {
        title: 'Outcome',
        result: 'SUCCESS',
        summary: 'Summary of the outcome',
        kpiBreakdown: {},
      }
    }

    const newNode: ScenarioNode = {
      id: `temp-${Date.now()}`,
      nodeKey,
      nodeType: type,
      body: defaultBody,
    }

    setNodes([...nodes, newNode])
    setSelectedNode(nodeKey)
  }

  const updateNode = (nodeKey: string, updates: Partial<ScenarioNode>) => {
    setNodes(
      nodes.map((node) =>
        node.nodeKey === nodeKey ? { ...node, ...updates } : node
      )
    )
  }

  const deleteNode = (nodeKey: string) => {
    if (confirm('Delete this node?')) {
      setNodes(nodes.filter((n) => n.nodeKey !== nodeKey))
      if (selectedNode === nodeKey) setSelectedNode(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/modules/${module.id}/scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meta: scenarioMeta,
          nodes,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      alert('Scenario saved successfully!')
      router.refresh()
    } catch (error) {
      console.error('Error saving scenario:', error)
      alert('Failed to save scenario. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const selectedNodeData = nodes.find((n) => n.nodeKey === selectedNode)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel: Scenario Metadata */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Scenario Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={scenarioMeta.title}
                onChange={(e) =>
                  setScenarioMeta({ ...scenarioMeta, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={scenarioMeta.slug}
                onChange={(e) =>
                  setScenarioMeta({ ...scenarioMeta, slug: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm"
                placeholder="scenario-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={scenarioMeta.estimatedMinutes}
                onChange={(e) =>
                  setScenarioMeta({
                    ...scenarioMeta,
                    estimatedMinutes: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Difficulty
              </label>
              <select
                value={scenarioMeta.difficulty}
                onChange={(e) =>
                  setScenarioMeta({ ...scenarioMeta, difficulty: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                KPI Focus Areas
              </label>
              <div className="space-y-2">
                {kpiOptions.map((kpi) => (
                  <label key={kpi} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={scenarioMeta.kpiFocus.includes(kpi)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setScenarioMeta({
                            ...scenarioMeta,
                            kpiFocus: [...scenarioMeta.kpiFocus, kpi],
                          })
                        } else {
                          setScenarioMeta({
                            ...scenarioMeta,
                            kpiFocus: scenarioMeta.kpiFocus.filter((k) => k !== kpi),
                          })
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700 capitalize">
                      {kpi.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6 space-y-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Scenario'}
            </button>
            {module.scenarioId && (
              <button
                onClick={() => router.push(`/lms/scenarios/${module.scenarioId}?moduleId=${module.id}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Middle Panel: Node List */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Scenario Nodes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <button
                onClick={() => addNode('NARRATIVE')}
                className="w-full px-3 py-2 border border-blue-300 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Add Narrative
              </button>
              <button
                onClick={() => addNode('DECISION')}
                className="w-full px-3 py-2 border border-purple-300 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
              >
                <GitBranch className="w-4 h-4 inline mr-2" />
                Add Decision
              </button>
              <button
                onClick={() => addNode('OUTCOME')}
                className="w-full px-3 py-2 border border-green-300 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
              >
                <Trophy className="w-4 h-4 inline mr-2" />
                Add Outcome
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {nodes.map((node) => {
                const isSelected = selectedNode === node.nodeKey
                const colorMap = {
                  NARRATIVE: 'border-blue-300 bg-blue-50',
                  DECISION: 'border-purple-300 bg-purple-50',
                  OUTCOME: 'border-green-300 bg-green-50',
                }
                return (
                  <div
                    key={node.nodeKey}
                    onClick={() => setSelectedNode(node.nodeKey)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#EC5C29] bg-[#EC5C29]/5'
                        : colorMap[node.nodeType]
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono text-sm font-bold text-slate-900">
                          {node.nodeKey}
                        </div>
                        <div className="text-xs text-slate-600">{node.nodeType}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNode(node.nodeKey)
                        }}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}

              {nodes.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No nodes yet. Add a narrative to start building your scenario.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel: Node Editor */}
      <div>
        {selectedNodeData ? (
          <NodeEditor
            node={selectedNodeData}
            kpiOptions={kpiOptions}
            onUpdate={(updates) => updateNode(selectedNodeData.nodeKey, updates)}
          />
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-slate-500">
              Select a node to edit
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Node Editor Component
function NodeEditor({
  node,
  kpiOptions,
  onUpdate,
}: {
  node: ScenarioNode
  kpiOptions: string[]
  onUpdate: (updates: Partial<ScenarioNode>) => void
}) {
  const updateBody = (updates: any) => {
    onUpdate({ body: { ...node.body, ...updates } })
  }

  if (node.nodeType === 'NARRATIVE') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <FileText className="w-5 h-5" />
            Narrative: {node.nodeKey}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Narrative Text
            </label>
            <textarea
              value={node.body.text || ''}
              onChange={(e) => updateBody({ text: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              value={node.body.atmosphere?.time || ''}
              onChange={(e) =>
                updateBody({
                  atmosphere: { ...node.body.atmosphere, time: e.target.value },
                })
              }
              placeholder="Time (e.g., 07:15 AM)"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
            <input
              type="text"
              value={node.body.atmosphere?.location || ''}
              onChange={(e) =>
                updateBody({
                  atmosphere: { ...node.body.atmosphere, location: e.target.value },
                })
              }
              placeholder="Location"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
            <input
              type="text"
              value={node.body.atmosphere?.weather || ''}
              onChange={(e) =>
                updateBody({
                  atmosphere: { ...node.body.atmosphere, weather: e.target.value },
                })
              }
              placeholder="Weather/Atmosphere"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Next Node
            </label>
            <input
              type="text"
              value={node.body.next || ''}
              onChange={(e) => updateBody({ next: e.target.value })}
              placeholder="d1, n2, etc."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (node.nodeType === 'DECISION') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <GitBranch className="w-5 h-5" />
            Decision: {node.nodeKey}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Question
            </label>
            <textarea
              value={node.body.question || ''}
              onChange={(e) => updateBody({ question: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Choices
            </label>
            <div className="space-y-3">
              {(node.body.choices || []).map((choice: any, i: number) => (
                <div key={i} className="p-3 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={choice.icon}
                      onChange={(e) => {
                        const choices = [...node.body.choices]
                        choices[i].icon = e.target.value
                        updateBody({ choices })
                      }}
                      placeholder="📌"
                      className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
                    />
                    <input
                      type="number"
                      value={choice.score}
                      onChange={(e) => {
                        const choices = [...node.body.choices]
                        choices[i].score = parseInt(e.target.value)
                        updateBody({ choices })
                      }}
                      placeholder="Score"
                      className="w-20 px-2 py-1 border border-slate-300 rounded"
                    />
                  </div>
                  <textarea
                    value={choice.text}
                    onChange={(e) => {
                      const choices = [...node.body.choices]
                      choices[i].text = e.target.value
                      updateBody({ choices })
                    }}
                    rows={2}
                    placeholder="Choice text"
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                  <textarea
                    value={choice.feedback}
                    onChange={(e) => {
                      const choices = [...node.body.choices]
                      choices[i].feedback = e.target.value
                      updateBody({ choices })
                    }}
                    rows={2}
                    placeholder="Feedback"
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    value={choice.nextNode}
                    onChange={(e) => {
                      const choices = [...node.body.choices]
                      choices[i].nextNode = e.target.value
                      updateBody({ choices })
                    }}
                    placeholder="Next node"
                    className="w-full px-2 py-1 border border-slate-300 rounded font-mono text-sm"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const choices = [
                    ...(node.body.choices || []),
                    {
                      id: String.fromCharCode(97 + node.body.choices.length),
                      text: '',
                      icon: '🤔',
                      score: 50,
                      kpiScores: {},
                      feedback: '',
                      nextNode: '',
                    },
                  ]
                  updateBody({ choices })
                }}
                className="text-sm text-purple-600 hover:underline"
              >
                + Add choice
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (node.nodeType === 'OUTCOME') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <Trophy className="w-5 h-5" />
            Outcome: {node.nodeKey}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={node.body.title || ''}
              onChange={(e) => updateBody({ title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Result Type
            </label>
            <select
              value={node.body.result || 'SUCCESS'}
              onChange={(e) => updateBody({ result: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="SUCCESS">Success</option>
              <option value="PARTIAL">Partial</option>
              <option value="FAILURE">Failure</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Summary
            </label>
            <textarea
              value={node.body.summary || ''}
              onChange={(e) => updateBody({ summary: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
