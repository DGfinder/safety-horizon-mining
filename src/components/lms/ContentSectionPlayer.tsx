'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  BookOpen,
  Video,
  Activity,
  Target,
  Home
} from 'lucide-react'

// Type definitions for content sections
interface ContentSection {
  id: string
  orderIndex: number
  title: string
  subtitle?: string
  sectionType: 'TEXT' | 'VIDEO' | 'INTERACTIVE' | 'DIAGRAM' | 'MIXED'
  content: any // JSON content (structure varies by type)
  estimatedMinutes: number
  completed?: boolean
}

interface ContentSectionPlayerProps {
  sections: ContentSection[]
  moduleTitle: string
  onComplete: () => void
  onSectionComplete: (sectionId: string) => void
}

export default function ContentSectionPlayer({
  sections,
  moduleTitle,
  onComplete,
  onSectionComplete,
}: ContentSectionPlayerProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())

  const currentSection = sections[currentSectionIndex]
  const progress = (completedSections.size / sections.length) * 100
  const isLastSection = currentSectionIndex === sections.length - 1

  const handleNext = () => {
    // Mark current section as complete
    if (!completedSections.has(currentSection.id)) {
      const newCompleted = new Set(completedSections)
      newCompleted.add(currentSection.id)
      setCompletedSections(newCompleted)
      onSectionComplete(currentSection.id)
    }

    if (isLastSection) {
      // All content sections complete
      onComplete()
    } else {
      setCurrentSectionIndex(currentSectionIndex + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const jumpToSection = (index: number) => {
    setCurrentSectionIndex(index)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header with progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{moduleTitle}</h1>
            <p className="text-sm text-slate-600 mt-1">
              Section {currentSectionIndex + 1} of {sections.length}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="w-4 h-4" />
            <span>{currentSection.estimatedMinutes} min</span>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
        <p className="text-xs text-slate-500 mt-2">
          {completedSections.size} of {sections.length} sections completed
        </p>
      </div>

      {/* Section navigation breadcrumbs */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => jumpToSection(index)}
            className={`
              px-3 py-1 rounded-full text-xs font-medium transition-colors
              ${index === currentSectionIndex
                ? 'bg-[#EC5C29] text-white'
                : completedSections.has(section.id)
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }
            `}
          >
            {completedSections.has(section.id) && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
            {section.orderIndex}. {section.title}
          </button>
        ))}
      </div>

      {/* Content Card */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-slate-50">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {getSectionIcon(currentSection.sectionType)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{currentSection.title}</CardTitle>
              {currentSection.subtitle && (
                <p className="text-sm text-slate-600 mt-1">{currentSection.subtitle}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ContentRenderer content={currentSection.content} type={currentSection.sectionType} />
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentSectionIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="text-sm text-slate-600">
          Section {currentSectionIndex + 1} / {sections.length}
        </div>

        <Button
          onClick={handleNext}
          className="bg-[#EC5C29] hover:bg-[#D54D1F]"
        >
          {isLastSection ? (
            <>
              Complete Content
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Next Section
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Helper function to get icon for section type
function getSectionIcon(type: string) {
  const iconClass = "w-6 h-6 text-[#EC5C29]"

  switch (type) {
    case 'VIDEO':
      return <Video className={iconClass} />
    case 'INTERACTIVE':
      return <Activity className={iconClass} />
    case 'DIAGRAM':
      return <Target className={iconClass} />
    case 'TEXT':
      return <BookOpen className={iconClass} />
    case 'MIXED':
      return <Home className={iconClass} />
    default:
      return <BookOpen className={iconClass} />
  }
}

// Content Renderer - renders different content types
function ContentRenderer({ content, type }: { content: any; type: string }) {
  // MIXED type content has multiple sub-components
  if (type === 'MIXED') {
    return (
      <div className="space-y-8">
        {Object.entries(content).map(([key, value]: [string, any]) => {
          return (
            <div key={key}>
              <ContentBlock block={value} />
            </div>
          )
        })}
      </div>
    )
  }

  // Single content block
  return <ContentBlock block={content} />
}

// Render individual content blocks
function ContentBlock({ block }: { block: any }) {
  if (!block || !block.type) return null

  switch (block.type) {
    case 'text':
      return <TextBlock data={block} />
    case 'video':
      return <VideoBlock data={block} />
    case 'stats':
      return <StatsBlock data={block} />
    case 'objectives':
      return <ObjectivesBlock data={block} />
    case 'reflection':
      return <ReflectionBlock data={block} />
    case 'interactive-diagram':
      return <InteractiveDiagramPlaceholder data={block} />
    case 'interactive':
      return <InteractivePlaceholder data={block} />
    case 'grid':
      return <GridBlock data={block} />
    case 'expandable-cards':
      return <ExpandableCardsBlock data={block} />
    case 'comparison-table':
      return <ComparisonTableBlock data={block} />
    case 'comparison':
      return <TextBlock data={block} />
    case 'case-study':
      return <CaseStudyBlock data={block} />
    case 'video-carousel':
      return <VideoCarouselPlaceholder data={block} />
    default:
      return null
  }
}

// Text Block
function TextBlock({ data }: { data: any }) {
  return (
    <div className="prose prose-slate max-w-none">
      {data.title && <h3 className="text-lg font-semibold text-slate-900 mb-3">{data.title}</h3>}
      <div
        className="text-slate-700 leading-relaxed whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: formatMarkdown(data.body) }}
      />
    </div>
  )
}

// Video Block (placeholder for now)
function VideoBlock({ data }: { data: any }) {
  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden">
      <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#EC5C29]/20 to-transparent"></div>
        <div className="relative text-center text-white p-8">
          <Video className="w-16 h-16 mx-auto mb-4 opacity-60" />
          <h4 className="text-xl font-semibold mb-2">{data.title}</h4>
          <p className="text-sm opacity-80 mb-4">Duration: {data.duration}</p>
          <Button className="bg-[#EC5C29] hover:bg-[#D54D1F]">
            Play Video
          </Button>
        </div>
      </div>
      {data.transcript && (
        <div className="p-4 bg-slate-50">
          <details>
            <summary className="text-sm font-medium text-slate-700 cursor-pointer">
              View Transcript
            </summary>
            <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">{data.transcript}</p>
          </details>
        </div>
      )}
    </div>
  )
}

// Stats Block
function StatsBlock({ data }: { data: any }) {
  return (
    <div>
      {data.title && <h3 className="text-lg font-semibold text-slate-900 mb-4">{data.title}</h3>}
      <div className="grid md:grid-cols-3 gap-4">
        {data.stats.map((stat: any, index: number) => (
          <Card key={index} className="border-l-4 border-l-[#EC5C29]">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-[#EC5C29] mb-2">{stat.number}</div>
              <div className="text-sm font-medium text-slate-900 mb-1">{stat.label}</div>
              <div className="text-xs text-slate-500">{stat.source}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Objectives Block
function ObjectivesBlock({ data }: { data: any }) {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          {data.title}
        </h3>
        <ul className="space-y-2">
          {data.objectives.map((objective: string, index: number) => (
            <li key={index} className="flex items-start gap-2 text-slate-700">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>{objective}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// Reflection Block
function ReflectionBlock({ data }: { data: any }) {
  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardContent className="pt-6">
        <h4 className="font-semibold text-amber-900 mb-3">🤔 Reflection</h4>
        <p className="text-slate-700 italic">{data.prompt}</p>
      </CardContent>
    </Card>
  )
}

// Comparison Table Block
function ComparisonTableBlock({ data }: { data: any }) {
  return (
    <div>
      {data.title && <h3 className="text-lg font-semibold text-slate-900 mb-4">{data.title}</h3>}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              {data.columns.map((col: string, index: number) => (
                <th key={index} className="text-left p-3 font-semibold text-slate-900 border">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row: any, index: number) => (
              <tr key={index} className="border-b hover:bg-slate-50">
                {Object.values(row).map((cell: any, cellIndex: number) => (
                  <td key={cellIndex} className="p-3 text-slate-700 border">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Grid Block (for Dirty Dozen)
function GridBlock({ data }: { data: any }) {
  return (
    <div>
      {data.title && <h3 className="text-lg font-semibold text-slate-900 mb-6">{data.title}</h3>}
      <div className="space-y-8">
        {data.categories.map((category: any, catIndex: number) => (
          <div key={catIndex}>
            <h4
              className="text-md font-bold mb-4 pb-2 border-b-2"
              style={{ borderColor: category.color, color: category.color }}
            >
              {category.name}
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              {category.items.map((item: any, itemIndex: number) => (
                <Card key={itemIndex} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      >
                        {item.number}
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900">{item.name}</h5>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700 mb-3">{item.definition}</p>
                    {item.miningExample && (
                      <div className="bg-amber-50 p-3 rounded text-sm mb-3">
                        <strong className="text-amber-900">Example:</strong> {item.miningExample}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Expandable Cards (for CRM competencies)
function ExpandableCardsBlock({ data }: { data: any }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div>
      {data.title && <h3 className="text-lg font-semibold text-slate-900 mb-6">{data.title}</h3>}
      <div className="space-y-4">
        {data.competencies.map((comp: any, index: number) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all ${expanded === index ? 'ring-2 ring-[#EC5C29]' : ''}`}
            onClick={() => setExpanded(expanded === index ? null : index)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{comp.icon}</div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-slate-900">
                    {comp.number}. {comp.name}
                  </h4>
                  <p className="text-sm text-slate-600 italic">{comp.tagline}</p>
                </div>
                <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expanded === index ? 'rotate-90' : ''}`} />
              </div>
            </CardHeader>
            {expanded === index && (
              <CardContent className="pt-0">
                <div className="prose prose-slate prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(comp.description) }} />
                </div>
                {comp.deepDive && (
                  <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-900">
                    <strong>Deep dive:</strong> {comp.deepDive}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

// Case Study Block
function CaseStudyBlock({ data }: { data: any }) {
  return (
    <Card className="border-l-4 border-l-red-500 bg-red-50">
      <CardHeader>
        <CardTitle className="text-lg">{data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-700 mb-4 whitespace-pre-line">{data.scenario}</p>

        <div className="space-y-3">
          {data.layers.map((layer: any, index: number) => (
            <div key={index} className="bg-white p-4 rounded border">
              <h5 className="font-semibold text-slate-900 mb-2">{layer.layer}</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                {layer.weaknesses.map((weakness: string, wIndex: number) => (
                  <li key={wIndex}>{weakness}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {data.conclusion && (
          <div className="mt-4 p-4 bg-slate-900 text-white rounded">
            <div dangerouslySetInnerHTML={{ __html: formatMarkdown(data.conclusion) }} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Placeholders for interactive elements (to be built later)
function InteractiveDiagramPlaceholder({ data }: { data: any }) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">{data.title}</h3>
        <p className="text-slate-700 mb-4">{data.description}</p>
        <div className="bg-white p-8 rounded-lg border-2 border-dashed border-blue-300 text-center">
          <Activity className="w-12 h-12 mx-auto mb-3 text-blue-400" />
          <p className="text-sm text-slate-600">Interactive diagram: {data.interaction?.instruction}</p>
          <p className="text-xs text-slate-500 mt-2">(Full interactive version coming soon)</p>
        </div>
      </CardContent>
    </Card>
  )
}

function InteractivePlaceholder({ data }: { data: any }) {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">{data.title}</h3>
        <p className="text-slate-700 mb-4">{data.prompt || data.instructions}</p>
        <div className="bg-white p-8 rounded-lg border-2 border-dashed border-green-300 text-center">
          <Activity className="w-12 h-12 mx-auto mb-3 text-green-400" />
          <p className="text-sm text-slate-600">Interactive exercise</p>
          <p className="text-xs text-slate-500 mt-2">(Full interactive version coming soon)</p>
        </div>
        {data.feedback && (
          <div className="mt-4 p-4 bg-white rounded">
            <p className="text-sm text-slate-700 whitespace-pre-line">{data.feedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function VideoCarouselPlaceholder({ data }: { data: any }) {
  return (
    <div>
      {data.title && <h3 className="text-lg font-semibold text-slate-900 mb-4">{data.title}</h3>}
      <div className="grid md:grid-cols-3 gap-4">
        {data.videos.map((video: any, index: number) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="aspect-video bg-slate-800 rounded mb-3 flex items-center justify-center">
                <Video className="w-12 h-12 text-slate-600" />
              </div>
              <h5 className="font-semibold text-slate-900 text-sm mb-1">{video.title}</h5>
              <p className="text-xs text-slate-600">{video.duration}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Simple markdown formatter (basic support for **bold**, bullet points)
function formatMarkdown(text: string): string {
  if (!text) return ''

  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Bullet points
    .replace(/^• /gm, '<li>')
    .replace(/(<li>.*?)(?=\n|$)/g, '$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
}
