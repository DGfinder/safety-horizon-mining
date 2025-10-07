'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BookOpen, Video, FileText, HelpCircle, Layers } from 'lucide-react'

interface Course {
  id: string
  title: string
}

interface ModuleFormProps {
  courses: Course[]
  initialData?: {
    id: string
    title: string
    description: string
    kind: string
    courseId: string
    orderIndex: number
    required: boolean
    passingScore: number
  }
}

export default function ModuleForm({ courses, initialData }: ModuleFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    kind: initialData?.kind || 'HYBRID',
    courseId: initialData?.courseId || courses[0]?.id || '',
    orderIndex: initialData?.orderIndex || 1,
    required: initialData?.required ?? true,
    passingScore: initialData?.passingScore || 70,
  })
  const [saving, setSaving] = useState(false)

  const moduleTypes = [
    {
      value: 'HYBRID',
      label: 'Hybrid Module',
      description: 'Educational content + interactive scenario',
      icon: Layers,
      color: 'purple',
      features: ['Content sections', 'Decision scenario', 'Optional quiz'],
    },
    {
      value: 'SCENARIO',
      label: 'Scenario Only',
      description: 'Interactive decision-making scenario',
      icon: HelpCircle,
      color: 'blue',
      features: ['Decision nodes', 'Outcome feedback', 'No prerequisite content'],
    },
    {
      value: 'VIDEO',
      label: 'Video Module',
      description: 'Video content with optional materials',
      icon: Video,
      color: 'pink',
      features: ['Video player', 'Transcripts', 'Supplementary resources'],
    },
    {
      value: 'POLICY',
      label: 'Policy/Reading',
      description: 'Text-based learning content',
      icon: FileText,
      color: 'indigo',
      features: ['Rich text', 'PDF embeds', 'Downloadable documents'],
    },
    {
      value: 'QUIZ',
      label: 'Assessment Only',
      description: 'Standalone quiz or test',
      icon: BookOpen,
      color: 'orange',
      features: ['Multiple choice', 'True/false', 'Scored assessment'],
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = initialData
        ? `/api/admin/modules/${initialData.id}`
        : '/api/admin/modules'

      const method = initialData ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save module')
      }

      const module = await response.json()

      // Redirect to content builder based on module type
      if (formData.kind === 'HYBRID' || formData.kind === 'VIDEO' || formData.kind === 'POLICY') {
        router.push(`/admin/modules/${module.id}/content`)
      } else if (formData.kind === 'SCENARIO') {
        router.push(`/admin/modules/${module.id}/scenario`)
      } else if (formData.kind === 'QUIZ') {
        router.push(`/admin/modules/${module.id}/quiz`)
      } else {
        router.push('/admin/modules')
      }
    } catch (error) {
      console.error('Error saving module:', error)
      alert('Failed to save module. Please try again.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Module Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Module Type</CardTitle>
          <CardDescription>Choose the type of learning module you want to create</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moduleTypes.map((type) => {
              const Icon = type.icon
              const isSelected = formData.kind === type.value
              const colors = {
                purple: 'border-purple-500 bg-purple-50',
                blue: 'border-blue-500 bg-blue-50',
                pink: 'border-pink-500 bg-pink-50',
                indigo: 'border-indigo-500 bg-indigo-50',
                orange: 'border-orange-500 bg-orange-50',
              }
              const selectedColor = colors[type.color as keyof typeof colors]

              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, kind: type.value })}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? selectedColor
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 mb-3 ${
                    isSelected ? `text-${type.color}-600` : 'text-slate-400'
                  }`} />
                  <div className="font-semibold text-slate-900 mb-1">{type.label}</div>
                  <div className="text-xs text-slate-600 mb-3">{type.description}</div>
                  <ul className="space-y-1">
                    {type.features.map((feature, i) => (
                      <li key={i} className="text-xs text-slate-500">• {feature}</li>
                    ))}
                  </ul>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Define the module details and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Module Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#EC5C29] focus:border-transparent"
              placeholder="e.g., Introduction to Safety Leadership"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#EC5C29] focus:border-transparent"
              placeholder="Brief overview of what learners will gain from this module"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Course *
              </label>
              <select
                required
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#EC5C29] focus:border-transparent"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Module Order *
              </label>
              <input
                type="number"
                required
                min={1}
                value={formData.orderIndex}
                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#EC5C29] focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.required}
                  onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                  className="w-4 h-4 text-[#EC5C29] border-slate-300 rounded focus:ring-[#EC5C29]"
                />
                <span className="text-sm font-medium text-slate-700">Required Module</span>
              </label>
              <p className="text-xs text-slate-500 mt-1 ml-6">Learners must complete this to progress</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Passing Score (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.passingScore}
                onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#EC5C29] focus:border-transparent"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-slate-600 hover:text-slate-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors font-semibold disabled:opacity-50"
        >
          {saving ? 'Saving...' : initialData ? 'Update & Continue' : 'Create & Continue'}
        </button>
      </div>
    </form>
  )
}
