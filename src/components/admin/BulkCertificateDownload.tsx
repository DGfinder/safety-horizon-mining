'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileArchive, CheckCircle, Loader2 } from 'lucide-react'

interface Site {
  id: string
  name: string
}

interface Course {
  id: string
  title: string
}

interface BulkCertificateDownloadProps {
  sites: Site[]
  courses: Course[]
}

export default function BulkCertificateDownload({
  sites,
  courses,
}: BulkCertificateDownloadProps) {
  const [downloading, setDownloading] = useState(false)
  const [filters, setFilters] = useState({
    siteId: '',
    courseId: '',
    onlyValid: true,
  })

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch('/api/admin/certificates/bulk-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to download certificates')
      }

      // Download the ZIP file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificates_${new Date().toISOString().split('T')[0]}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error: any) {
      alert(error.message || 'Failed to download certificates')
      console.error('Download error:', error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileArchive className="w-5 h-5 text-[#EC5C29]" />
          Bulk Certificate Download
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Select filters to narrow down which certificates to download</li>
            <li>Click "Download Certificates" to generate a ZIP file</li>
            <li>All certificates will be generated as individual PDFs in the ZIP</li>
            <li>Filenames will be: UserName_CertificateSerial.pdf</li>
          </ol>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Site
            </label>
            <select
              value={filters.siteId}
              onChange={(e) => setFilters({ ...filters, siteId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#EC5C29] focus:border-transparent"
            >
              <option value="">All Sites</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Course
            </label>
            <select
              value={filters.courseId}
              onChange={(e) => setFilters({ ...filters, courseId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#EC5C29] focus:border-transparent"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="onlyValid"
              checked={filters.onlyValid}
              onChange={(e) => setFilters({ ...filters, onlyValid: e.target.checked })}
              className="w-4 h-4 text-[#EC5C29] border-slate-300 rounded focus:ring-[#EC5C29]"
            />
            <label htmlFor="onlyValid" className="text-sm text-slate-700">
              Only include valid (non-expired) certificates
            </label>
          </div>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating ZIP...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download Certificates (ZIP)
              </>
            )}
          </button>
          <p className="text-xs text-slate-500 text-center mt-2">
            Large downloads may take 30-60 seconds to generate
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-900 mb-2">Use Cases</h4>
          <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
            <li>Download all certificates for a site before an audit</li>
            <li>Archive certificates at the end of each quarter</li>
            <li>Provide certificates to crew supervisors for verification</li>
            <li>Export certificates for integration with HR systems</li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-900 mb-2">⚠️ Performance Notes</h4>
          <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
            <li>Maximum 500 certificates per download (to prevent timeout)</li>
            <li>If you need more, use filters to split into multiple downloads</li>
            <li>Each PDF is generated on-the-fly with QR codes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
