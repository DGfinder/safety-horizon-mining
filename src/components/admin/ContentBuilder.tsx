'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Plus,
  GripVertical,
  Trash2,
  Eye,
  Save,
  ChevronDown,
  ChevronUp,
  FileText,
  Video,
  BarChart3,
  Target,
  MessageSquare,
  Grid3x3,
  ChevronRight,
  Table2,
  FileSearch,
  Network,
} from 'lucide-react'

interface Module {
  id: string
  title: string
  kind: string
  contentSections: ContentSection[]
}

interface ContentSection {
  id: string
  orderIndex: number
  title: string
  blocks: any
}

interface ContentBuilderProps {
  module: Module
}

export default function ContentBuilder({ module }: ContentBuilderProps) {
  const router = useRouter()
  const [sections, setSections] = useState<ContentSection[]>(module.contentSections)
  const [saving, setSaving] = useState(false)
  const [expandedSection, setExpandedSection] = useState<number | null>(0)

  const blockTypes = [
    { type: 'text', label: 'Text Block', icon: FileText, color: 'blue' },
    { type: 'video', label: 'Video', icon: Video, color: 'purple' },
    { type: 'stats', label: 'Statistics', icon: BarChart3, color: 'green' },
    { type: 'objectives', label: 'Objectives', icon: Target, color: 'orange' },
    { type: 'reflection', label: 'Reflection', icon: MessageSquare, color: 'pink' },
    { type: 'grid', label: 'Grid Cards', icon: Grid3x3, color: 'indigo' },
    { type: 'expandable-cards', label: 'Expandable Cards', icon: ChevronRight, color: 'teal' },
    { type: 'comparison-table', label: 'Comparison Table', icon: Table2, color: 'cyan' },
    { type: 'case-study', label: 'Case Study', icon: FileSearch, color: 'amber' },
    { type: 'interactive-diagram', label: 'Interactive Diagram', icon: Network, color: 'red' },
  ]

  const addSection = () => {
    const newSection: ContentSection = {
      id: `temp-${Date.now()}`,
      orderIndex: sections.length,
      title: 'New Section',
      blocks: [],
    }
    setSections([...sections, newSection])
    setExpandedSection(sections.length)
  }

  const deleteSection = (index: number) => {
    if (confirm('Are you sure you want to delete this section?')) {
      const updated = sections.filter((_, i) => i !== index)
      setSections(updated.map((s, i) => ({ ...s, orderIndex: i })))
    }
  }

  const moveSectionUp = (index: number) => {
    if (index === 0) return
    const updated = [...sections]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    setSections(updated.map((s, i) => ({ ...s, orderIndex: i })))
  }

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return
    const updated = [...sections]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    setSections(updated.map((s, i) => ({ ...s, orderIndex: i })))
  }

  const updateSection = (index: number, updates: Partial<ContentSection>) => {
    const updated = [...sections]
    updated[index] = { ...updated[index], ...updates }
    setSections(updated)
  }

  const addBlock = (sectionIndex: number, blockType: string) => {
    const section = sections[sectionIndex]
    const blocks = section.blocks || []

    // Create default block based on type
    let newBlock: any = { type: blockType }

    switch (blockType) {
      case 'text':
        newBlock.content = '## Heading\n\nYour content here...'
        break
      case 'video':
        newBlock.url = ''
        newBlock.transcript = ''
        break
      case 'stats':
        newBlock.stats = [
          { number: '0', label: 'Statistic 1' },
          { number: '0', label: 'Statistic 2' },
          { number: '0', label: 'Statistic 3' },
        ]
        break
      case 'objectives':
        newBlock.items = ['Objective 1', 'Objective 2', 'Objective 3']
        break
      case 'reflection':
        newBlock.questions = ['Question 1?', 'Question 2?']
        break
      case 'grid':
        newBlock.title = 'Grid Title'
        newBlock.items = [
          { category: 'Category 1', title: 'Item 1', description: 'Description' },
        ]
        break
      case 'expandable-cards':
        newBlock.cards = [
          { title: 'Card 1', content: 'Content here' },
        ]
        break
      case 'comparison-table':
        newBlock.title = 'Comparison'
        newBlock.leftColumn = { title: 'Column 1', items: ['Item 1'] }
        newBlock.rightColumn = { title: 'Column 2', items: ['Item 1'] }
        break
      case 'case-study':
        newBlock.title = 'Case Study'
        newBlock.situation = ''
        newBlock.task = ''
        newBlock.action = ''
        newBlock.result = ''
        break
      case 'interactive-diagram':
        newBlock.imageUrl = ''
        newBlock.hotspots = []
        break
    }

    updateSection(sectionIndex, { blocks: [...blocks, newBlock] })
  }

  const updateBlock = (sectionIndex: number, blockIndex: number, updates: any) => {
    const section = sections[sectionIndex]
    const blocks = [...(section.blocks || [])]
    blocks[blockIndex] = { ...blocks[blockIndex], ...updates }
    updateSection(sectionIndex, { blocks })
  }

  const deleteBlock = (sectionIndex: number, blockIndex: number) => {
    if (confirm('Delete this block?')) {
      const section = sections[sectionIndex]
      const blocks = (section.blocks || []).filter((_: any, i: number) => i !== blockIndex)
      updateSection(sectionIndex, { blocks })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/modules/${module.id}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      })

      if (!response.ok) throw new Error('Failed to save')

      alert('Content saved successfully!')
      router.refresh()
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={addSection}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/lms/modules/${module.id}`)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, sectionIndex) => (
          <Card key={section.id} className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
                    className="flex-1 text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#EC5C29] rounded px-2"
                    placeholder="Section title"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveSectionUp(sectionIndex)}
                    disabled={sectionIndex === 0}
                    className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => moveSectionDown(sectionIndex)}
                    disabled={sectionIndex === sections.length - 1}
                    className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteSection(sectionIndex)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setExpandedSection(expandedSection === sectionIndex ? null : sectionIndex)
                    }
                    className="p-1 text-slate-600 hover:text-slate-900"
                  >
                    {expandedSection === sectionIndex ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </CardHeader>

            {expandedSection === sectionIndex && (
              <CardContent className="p-6 space-y-4">
                {/* Block Type Selector */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-700 mb-3">Add Content Block:</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {blockTypes.map((blockType) => {
                      const Icon = blockType.icon
                      return (
                        <button
                          key={blockType.type}
                          onClick={() => addBlock(sectionIndex, blockType.type)}
                          className="flex flex-col items-center gap-2 p-3 border border-slate-200 rounded-lg hover:border-[#EC5C29] hover:bg-[#EC5C29]/5 transition-colors text-center"
                        >
                          <Icon className="w-5 h-5 text-slate-600" />
                          <span className="text-xs font-medium text-slate-700">
                            {blockType.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Blocks */}
                <div className="space-y-4">
                  {(section.blocks || []).map((block: any, blockIndex: number) => (
                    <BlockEditor
                      key={blockIndex}
                      block={block}
                      blockIndex={blockIndex}
                      onUpdate={(updates) => updateBlock(sectionIndex, blockIndex, updates)}
                      onDelete={() => deleteBlock(sectionIndex, blockIndex)}
                    />
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {sections.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No content sections yet</h3>
              <p className="text-slate-600 mb-4">Add your first section to start building content</p>
              <button
                onClick={addSection}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add Section
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Block Editor Component
function BlockEditor({
  block,
  blockIndex,
  onUpdate,
  onDelete,
}: {
  block: any
  blockIndex: number
  onUpdate: (updates: any) => void
  onDelete: () => void
}) {
  const getBlockIcon = (type: string) => {
    const icons: any = {
      text: FileText,
      video: Video,
      stats: BarChart3,
      objectives: Target,
      reflection: MessageSquare,
      grid: Grid3x3,
      'expandable-cards': ChevronRight,
      'comparison-table': Table2,
      'case-study': FileSearch,
      'interactive-diagram': Network,
    }
    return icons[type] || FileText
  }

  const Icon = getBlockIcon(block.type)

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-slate-600" />
          <span className="font-medium text-slate-900 capitalize">
            {block.type.replace('-', ' ')}
          </span>
        </div>
        <button
          onClick={onDelete}
          className="p-1 text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Block-specific editor */}
      {block.type === 'text' && (
        <textarea
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm"
          placeholder="Markdown content..."
        />
      )}

      {block.type === 'video' && (
        <div className="space-y-3">
          <input
            type="text"
            value={block.url || ''}
            onChange={(e) => onUpdate({ url: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            placeholder="Video URL"
          />
          <textarea
            value={block.transcript || ''}
            onChange={(e) => onUpdate({ transcript: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            placeholder="Video transcript (optional)"
          />
        </div>
      )}

      {block.type === 'stats' && (
        <div className="space-y-2">
          {(block.stats || []).map((stat: any, i: number) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={stat.number}
                onChange={(e) => {
                  const stats = [...block.stats]
                  stats[i].number = e.target.value
                  onUpdate({ stats })
                }}
                className="w-24 px-3 py-2 border border-slate-300 rounded-lg font-bold"
                placeholder="100"
              />
              <input
                type="text"
                value={stat.label}
                onChange={(e) => {
                  const stats = [...block.stats]
                  stats[i].label = e.target.value
                  onUpdate({ stats })
                }}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="Label"
              />
            </div>
          ))}
        </div>
      )}

      {block.type === 'objectives' && (
        <div className="space-y-2">
          {(block.items || []).map((item: string, i: number) => (
            <input
              key={i}
              type="text"
              value={item}
              onChange={(e) => {
                const items = [...block.items]
                items[i] = e.target.value
                onUpdate({ items })
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              placeholder={`Objective ${i + 1}`}
            />
          ))}
          <button
            onClick={() => onUpdate({ items: [...(block.items || []), ''] })}
            className="text-sm text-[#EC5C29] hover:underline"
          >
            + Add objective
          </button>
        </div>
      )}

      {block.type === 'reflection' && (
        <div className="space-y-2">
          {(block.questions || []).map((question: string, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-sm font-medium text-slate-600 mt-2">{i + 1}.</span>
              <textarea
                value={question}
                onChange={(e) => {
                  const questions = [...block.questions]
                  questions[i] = e.target.value
                  onUpdate({ questions })
                }}
                rows={2}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                placeholder={`Reflection question ${i + 1}`}
              />
              <button
                onClick={() => {
                  const questions = block.questions.filter((_: any, idx: number) => idx !== i)
                  onUpdate({ questions })
                }}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => onUpdate({ questions: [...(block.questions || []), ''] })}
            className="text-sm text-[#EC5C29] hover:underline"
          >
            + Add question
          </button>
        </div>
      )}

      {block.type === 'grid' && (
        <div className="space-y-3">
          <input
            type="text"
            value={block.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
            placeholder="Grid title"
          />
          <div className="space-y-2">
            {(block.items || []).map((item: any, i: number) => (
              <div key={i} className="p-3 border border-slate-200 rounded-lg space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={item.category || ''}
                    onChange={(e) => {
                      const items = [...block.items]
                      items[i].category = e.target.value
                      onUpdate({ items })
                    }}
                    className="w-32 px-2 py-1 border border-slate-300 rounded text-sm font-medium"
                    placeholder="Category"
                  />
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => {
                      const items = [...block.items]
                      items[i].title = e.target.value
                      onUpdate({ items })
                    }}
                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm font-semibold"
                    placeholder="Item title"
                  />
                  <button
                    onClick={() => {
                      const items = block.items.filter((_: any, idx: number) => idx !== i)
                      onUpdate({ items })
                    }}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={item.description || ''}
                  onChange={(e) => {
                    const items = [...block.items]
                    items[i].description = e.target.value
                    onUpdate({ items })
                  }}
                  rows={2}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  placeholder="Description"
                />
              </div>
            ))}
            <button
              onClick={() =>
                onUpdate({
                  items: [...(block.items || []), { category: '', title: '', description: '' }],
                })
              }
              className="text-sm text-[#EC5C29] hover:underline"
            >
              + Add grid item
            </button>
          </div>
        </div>
      )}

      {block.type === 'expandable-cards' && (
        <div className="space-y-2">
          {(block.cards || []).map((card: any, i: number) => (
            <div key={i} className="p-3 border border-slate-200 rounded-lg space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={card.title || ''}
                  onChange={(e) => {
                    const cards = [...block.cards]
                    cards[i].title = e.target.value
                    onUpdate({ cards })
                  }}
                  className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm font-semibold"
                  placeholder="Card title"
                />
                <button
                  onClick={() => {
                    const cards = block.cards.filter((_: any, idx: number) => idx !== i)
                    onUpdate({ cards })
                  }}
                  className="p-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={card.content || ''}
                onChange={(e) => {
                  const cards = [...block.cards]
                  cards[i].content = e.target.value
                  onUpdate({ cards })
                }}
                rows={3}
                className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                placeholder="Card content (markdown supported)"
              />
            </div>
          ))}
          <button
            onClick={() => onUpdate({ cards: [...(block.cards || []), { title: '', content: '' }] })}
            className="text-sm text-[#EC5C29] hover:underline"
          >
            + Add card
          </button>
        </div>
      )}

      {block.type === 'comparison-table' && (
        <div className="space-y-3">
          <input
            type="text"
            value={block.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
            placeholder="Comparison title"
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <input
                type="text"
                value={block.leftColumn?.title || ''}
                onChange={(e) =>
                  onUpdate({
                    leftColumn: { ...block.leftColumn, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                placeholder="Left column title"
              />
              {(block.leftColumn?.items || []).map((item: string, i: number) => (
                <input
                  key={i}
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const items = [...(block.leftColumn?.items || [])]
                    items[i] = e.target.value
                    onUpdate({ leftColumn: { ...block.leftColumn, items } })
                  }}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  placeholder={`Item ${i + 1}`}
                />
              ))}
              <button
                onClick={() =>
                  onUpdate({
                    leftColumn: {
                      ...block.leftColumn,
                      items: [...(block.leftColumn?.items || []), ''],
                    },
                  })
                }
                className="text-xs text-[#EC5C29] hover:underline"
              >
                + Add item
              </button>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={block.rightColumn?.title || ''}
                onChange={(e) =>
                  onUpdate({
                    rightColumn: { ...block.rightColumn, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                placeholder="Right column title"
              />
              {(block.rightColumn?.items || []).map((item: string, i: number) => (
                <input
                  key={i}
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const items = [...(block.rightColumn?.items || [])]
                    items[i] = e.target.value
                    onUpdate({ rightColumn: { ...block.rightColumn, items } })
                  }}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  placeholder={`Item ${i + 1}`}
                />
              ))}
              <button
                onClick={() =>
                  onUpdate({
                    rightColumn: {
                      ...block.rightColumn,
                      items: [...(block.rightColumn?.items || []), ''],
                    },
                  })
                }
                className="text-xs text-[#EC5C29] hover:underline"
              >
                + Add item
              </button>
            </div>
          </div>
        </div>
      )}

      {block.type === 'case-study' && (
        <div className="space-y-3">
          <input
            type="text"
            value={block.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
            placeholder="Case study title"
          />
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Situation</label>
            <textarea
              value={block.situation || ''}
              onChange={(e) => onUpdate({ situation: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              placeholder="Describe the situation..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Task</label>
            <textarea
              value={block.task || ''}
              onChange={(e) => onUpdate({ task: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              placeholder="What was the task or challenge?"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Action</label>
            <textarea
              value={block.action || ''}
              onChange={(e) => onUpdate({ action: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              placeholder="What actions were taken?"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Result</label>
            <textarea
              value={block.result || ''}
              onChange={(e) => onUpdate({ result: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              placeholder="What was the outcome?"
            />
          </div>
        </div>
      )}

      {block.type === 'interactive-diagram' && (
        <div className="space-y-3">
          <input
            type="text"
            value={block.imageUrl || ''}
            onChange={(e) => onUpdate({ imageUrl: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            placeholder="Image URL"
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hotspots (Interactive Points)
            </label>
            {(block.hotspots || []).map((hotspot: any, i: number) => (
              <div key={i} className="p-3 border border-slate-200 rounded-lg mb-2 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={hotspot.x || 0}
                    onChange={(e) => {
                      const hotspots = [...block.hotspots]
                      hotspots[i].x = parseInt(e.target.value)
                      onUpdate({ hotspots })
                    }}
                    className="w-20 px-2 py-1 border border-slate-300 rounded text-sm"
                    placeholder="X %"
                  />
                  <input
                    type="number"
                    value={hotspot.y || 0}
                    onChange={(e) => {
                      const hotspots = [...block.hotspots]
                      hotspots[i].y = parseInt(e.target.value)
                      onUpdate({ hotspots })
                    }}
                    className="w-20 px-2 py-1 border border-slate-300 rounded text-sm"
                    placeholder="Y %"
                  />
                  <input
                    type="text"
                    value={hotspot.label || ''}
                    onChange={(e) => {
                      const hotspots = [...block.hotspots]
                      hotspots[i].label = e.target.value
                      onUpdate({ hotspots })
                    }}
                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                    placeholder="Label"
                  />
                  <button
                    onClick={() => {
                      const hotspots = block.hotspots.filter((_: any, idx: number) => idx !== i)
                      onUpdate({ hotspots })
                    }}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={hotspot.description || ''}
                  onChange={(e) => {
                    const hotspots = [...block.hotspots]
                    hotspots[i].description = e.target.value
                    onUpdate({ hotspots })
                  }}
                  rows={2}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  placeholder="Description shown on click"
                />
              </div>
            ))}
            <button
              onClick={() =>
                onUpdate({
                  hotspots: [...(block.hotspots || []), { x: 50, y: 50, label: '', description: '' }],
                })
              }
              className="text-sm text-[#EC5C29] hover:underline"
            >
              + Add hotspot
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
