'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Download, CheckCircle, AlertCircle, Users } from 'lucide-react'

interface Site {
  id: string
  name: string
  crews: { id: string; name: string }[]
}

interface Course {
  id: string
  title: string
}

interface BulkUserImportProps {
  sites: Site[]
  courses: Course[]
  orgId: string
}

export default function BulkUserImport({ sites, courses, orgId }: BulkUserImportProps) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<any>(null)

  const csvTemplate = `name,email,jobTitle,employeeId,department,siteId,crewId,role,courseId,sendWelcomeEmail
John Smith,john.smith@example.com,Haul Truck Operator,EMP001,Mining Operations,${sites[0]?.id || 'SITE_ID'},${sites[0]?.crews[0]?.id || 'CREW_ID'},LEARNER,${courses[0]?.id || 'COURSE_ID'},true
Jane Doe,jane.doe@example.com,Shift Supervisor,EMP002,Operations,${sites[0]?.id || 'SITE_ID'},,SUPERVISOR,${courses[0]?.id || 'COURSE_ID'},true`

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'user-import-template.csv'
    a.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResults(null)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('orgId', orgId)

    try {
      const response = await fetch('/api/admin/users/bulk-import', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to import users')
      }

      const data = await response.json()
      setResults(data)
      setFile(null)
    } catch (error: any) {
      alert(error.message || 'Failed to import users. Please check your CSV format.')
      console.error('Import error:', error)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Download Template</h4>
                <p className="text-sm text-slate-600">
                  Get the CSV template with the correct column format
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Fill Your Data</h4>
                <p className="text-sm text-slate-600">
                  Add user details, one per row in Excel or Google Sheets
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Upload & Import</h4>
                <p className="text-sm text-slate-600">
                  Upload your CSV and users will be created automatically
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-slate-900 mb-2">CSV Columns:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div>
                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">name</span>
                <span className="text-slate-600 ml-2">- Full name</span>
              </div>
              <div>
                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">email</span>
                <span className="text-red-600 ml-1">*</span>
                <span className="text-slate-600 ml-1">- Email address</span>
              </div>
              <div>
                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">jobTitle</span>
                <span className="text-slate-600 ml-2">- Job title</span>
              </div>
              <div>
                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">employeeId</span>
                <span className="text-slate-600 ml-2">- Employee ID</span>
              </div>
              <div>
                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">department</span>
                <span className="text-slate-600 ml-2">- Department</span>
              </div>
              <div>
                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">siteId</span>
                <span className="text-slate-600 ml-2">- Site UUID</span>
              </div>
              <div>
                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">crewId</span>
                <span className="text-slate-600 ml-2">- Crew UUID</span>
              </div>
              <div>
                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">role</span>
                <span className="text-slate-600 ml-2">- LEARNER/SUPERVISOR</span>
              </div>
              <div>
                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">courseId</span>
                <span className="text-slate-600 ml-2">- Course UUID</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              <span className="text-red-600">*</span> Required field
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Download Template</CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-semibold"
          >
            <Download className="w-4 h-4" />
            Download CSV Template
          </button>
          <p className="text-sm text-slate-600 mt-3">
            The template includes example data with the correct format and column headers.
          </p>
        </CardContent>
      </Card>

      {/* Reference Data */}
      <Card>
        <CardHeader>
          <CardTitle>Reference: Site & Course IDs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Sites & Crews</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {sites.map((site) => (
                  <div key={site.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="font-medium text-slate-900">{site.name}</div>
                    <div className="text-xs font-mono text-slate-600 mt-1">{site.id}</div>
                    {site.crews.length > 0 && (
                      <div className="mt-2 pl-3 border-l-2 border-slate-300">
                        {site.crews.map((crew) => (
                          <div key={crew.id} className="text-sm mt-1">
                            <span className="text-slate-700">{crew.name}</span>
                            <span className="text-xs font-mono text-slate-500 ml-2">{crew.id}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Courses</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {courses.map((course) => (
                  <div key={course.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="font-medium text-slate-900">{course.title}</div>
                    <div className="text-xs font-mono text-slate-600 mt-1">{course.id}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Step 2: Upload Your CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer inline-block px-4 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors font-semibold"
            >
              Choose CSV File
            </label>
            {file && (
              <div className="mt-4 text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 text-green-600 inline mr-2" />
                Selected: {file.name}
              </div>
            )}
          </div>

          {file && (
            <button
              onClick={handleImport}
              disabled={importing}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold disabled:opacity-50"
            >
              <Users className="w-5 h-5" />
              {importing ? 'Importing Users...' : 'Import Users'}
            </button>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card className={results.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {results.success ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Import Successful
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Import Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.success ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{results.created}</div>
                    <div className="text-sm text-slate-600">Users created</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{results.enrolled}</div>
                    <div className="text-sm text-slate-600">Course enrollments</div>
                  </div>
                </div>
                {results.errors && results.errors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-amber-700 mb-2">Warnings:</h4>
                    <ul className="text-sm text-amber-600 space-y-1">
                      {results.errors.map((error: string, i: number) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  onClick={() => router.push('/admin/users')}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  View Users
                </button>
              </div>
            ) : (
              <div>
                <p className="text-red-700 font-medium mb-2">{results.error}</p>
                {results.details && (
                  <pre className="text-xs bg-red-100 p-3 rounded overflow-auto">
                    {JSON.stringify(results.details, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
