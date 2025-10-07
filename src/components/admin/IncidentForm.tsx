'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, AlertTriangle } from 'lucide-react'

interface Site {
  id: string
  name: string
  siteType: string
}

interface IncidentFormProps {
  sites: Site[]
  userId: string
}

export default function IncidentForm({ sites, userId }: IncidentFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    siteId: sites[0]?.id || '',
    title: '',
    description: '',
    incidentDate: new Date().toISOString().split('T')[0],
    severity: 'NEAR_MISS',
    category: 'EQUIPMENT_OPERATION',
    incidentType: [] as string[],
    location: '',
    equipment: '',
    rootCause: '',
    contributingFactors: [] as string[],
    correctiveActions: [] as string[],
    keyLessons: [] as string[],
    kpiAreasAffected: [] as string[],
  })

  const severityOptions = [
    { value: 'NEAR_MISS', label: 'Near Miss' },
    { value: 'MINOR', label: 'Minor' },
    { value: 'MODERATE', label: 'Moderate' },
    { value: 'MAJOR', label: 'Major' },
    { value: 'CRITICAL', label: 'Critical' },
    { value: 'FATALITY', label: 'Fatality' },
  ]

  const categoryOptions = [
    { value: 'EQUIPMENT_OPERATION', label: 'Equipment Operation' },
    { value: 'COMMUNICATION_FAILURE', label: 'Communication Failure' },
    { value: 'SITUATIONAL_AWARENESS', label: 'Situational Awareness' },
    { value: 'DECISION_MAKING', label: 'Decision Making' },
    { value: 'LEADERSHIP_FAILURE', label: 'Leadership Failure' },
    { value: 'PROCEDURE_VIOLATION', label: 'Procedure Violation' },
    { value: 'ENVIRONMENTAL', label: 'Environmental' },
    { value: 'MEDICAL', label: 'Medical' },
    { value: 'SECURITY', label: 'Security' },
  ]

  const kpiOptions = [
    'communication',
    'situational_awareness',
    'decision_making',
    'leadership',
    'psychological_safety',
    'just_culture',
    'learning_culture',
    'team_coordination',
  ]

  const handleArrayInput = (field: keyof typeof formData, value: string) => {
    const items = value.split('\n').filter(Boolean)
    setFormData({ ...formData, [field]: items })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Generate incident number
      const incidentNumber = `INC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

      const response = await fetch('/api/admin/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          incidentNumber,
          reportedById: userId,
        }),
      })

      if (!response.ok) throw new Error('Failed to create incident')

      const data = await response.json()
      alert('Incident reported successfully!')
      router.push(`/admin/incidents/${data.incident.id}`)
    } catch (error) {
      console.error('Error creating incident:', error)
      alert('Failed to create incident. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#EC5C29]" />
            Incident Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Site *
              </label>
              <select
                value={formData.siteId}
                onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name} ({site.siteType.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Incident Date *
              </label>
              <input
                type="date"
                value={formData.incidentDate}
                onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Incident Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Brief description of the incident"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={6}
              placeholder="Detailed description of what happened, including timeline of events..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Classification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Severity *
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                {severityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Primary Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="e.g., North Pit - Haul Road 2"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Equipment Involved
              </label>
              <input
                type="text"
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                placeholder="e.g., CAT 797F Haul Truck #23"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Investigation Details */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Root Cause
            </label>
            <textarea
              value={formData.rootCause}
              onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
              rows={3}
              placeholder="Primary root cause identified through investigation..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contributing Factors
            </label>
            <textarea
              value={formData.contributingFactors.join('\n')}
              onChange={(e) => handleArrayInput('contributingFactors', e.target.value)}
              rows={4}
              placeholder="One factor per line:&#10;- Fatigue from extended shift&#10;- Poor visibility due to dust&#10;- Inadequate communication"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">Enter one factor per line</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Corrective Actions
            </label>
            <textarea
              value={formData.correctiveActions.join('\n')}
              onChange={(e) => handleArrayInput('correctiveActions', e.target.value)}
              rows={4}
              placeholder="One action per line:&#10;- Implement mandatory pre-shift briefings&#10;- Install additional lighting&#10;- Update communication protocols"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">Enter one action per line</p>
          </div>

          {/* Learning Integration */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Key Lessons Learned
            </label>
            <textarea
              value={formData.keyLessons.join('\n')}
              onChange={(e) => handleArrayInput('keyLessons', e.target.value)}
              rows={4}
              placeholder="One lesson per line:&#10;- Always verify radio contact before proceeding&#10;- Environmental conditions can change rapidly&#10;- Team coordination is critical in low visibility"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">These will become training content</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              KPI Areas Affected
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {kpiOptions.map((kpi) => (
                <label key={kpi} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.kpiAreasAffected.includes(kpi)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          kpiAreasAffected: [...formData.kpiAreasAffected, kpi],
                        })
                      } else {
                        setFormData({
                          ...formData,
                          kpiAreasAffected: formData.kpiAreasAffected.filter((k) => k !== kpi),
                        })
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-700 capitalize">{kpi.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors font-semibold disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Report Incident'}
            </button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
