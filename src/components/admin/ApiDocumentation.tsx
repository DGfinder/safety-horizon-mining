'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Code, Copy, Check, Book, Webhook, Key, Zap } from 'lucide-react'

export default function ApiDocumentation() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'endpoints' | 'webhooks' | 'examples'>('endpoints')

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedEndpoint(id)
    setTimeout(() => setCopiedEndpoint(null), 2000)
  }

  const apiEndpoints = [
    {
      method: 'POST',
      path: '/api/admin/enrollments',
      description: 'Create a new course enrollment',
      auth: 'Session',
      body: {
        userId: 'string',
        courseId: 'string',
      },
      response: {
        success: true,
        enrollment: {
          id: 'uuid',
          userId: 'uuid',
          courseId: 'uuid',
          status: 'ENROLLED',
        },
      },
    },
    {
      method: 'GET',
      path: '/api/admin/users/{userId}/compliance',
      description: 'Get compliance status for a specific user',
      auth: 'Session',
      params: {
        userId: 'UUID of the user',
      },
      response: {
        user: {
          id: 'uuid',
          name: 'string',
          email: 'string',
        },
        enrollments: [
          {
            courseTitle: 'string',
            status: 'COMPLETED',
            completedAt: 'date',
            certificate: {
              serial: 'CRM-2025-123456',
              expiresAt: 'date',
              isValid: true,
            },
          },
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/admin/reports/compliance-summary',
      description: 'Export compliance summary report',
      auth: 'Session',
      query: {
        format: 'csv | json',
        siteId: '(optional) Filter by site',
      },
      response: 'CSV file download or JSON data',
    },
    {
      method: 'GET',
      path: '/api/certificates/verify/{verificationCode}',
      description: 'Verify certificate authenticity (public endpoint)',
      auth: 'None',
      params: {
        verificationCode: 'Certificate verification code',
      },
      response: {
        valid: true,
        certificate: {
          serial: 'CRM-2025-123456',
          userName: 'string',
          courseName: 'string',
          issuedAt: 'date',
          expiresAt: 'date',
          isActive: true,
        },
      },
    },
    {
      method: 'POST',
      path: '/api/admin/users/bulk-import',
      description: 'Bulk import users from CSV',
      auth: 'Session',
      body: 'FormData with "file" field (CSV)',
      response: {
        success: true,
        created: 50,
        enrolled: 50,
        errors: ['array of error messages'],
      },
    },
    {
      method: 'POST',
      path: '/api/admin/incidents',
      description: 'Create new incident report',
      auth: 'Session',
      body: {
        siteId: 'string',
        title: 'string',
        description: 'string',
        severity: 'NEAR_MISS | MINOR | MODERATE | MAJOR | CRITICAL | FATALITY',
        category: 'EQUIPMENT_OPERATION | etc',
        rootCause: 'string',
        contributingFactors: ['array'],
        correctiveActions: ['array'],
        keyLessons: ['array'],
        kpiAreasAffected: ['array'],
      },
      response: {
        success: true,
        incident: {
          id: 'uuid',
          incidentNumber: 'INC-2025-001',
        },
      },
    },
  ]

  const webhookEvents = [
    {
      event: 'enrollment.created',
      description: 'Triggered when a user is enrolled in a course',
      payload: {
        event: 'enrollment.created',
        timestamp: 'ISO 8601 date',
        data: {
          enrollmentId: 'uuid',
          userId: 'uuid',
          courseId: 'uuid',
          status: 'ENROLLED',
        },
      },
    },
    {
      event: 'certificate.issued',
      description: 'Triggered when a certificate is issued to a user',
      payload: {
        event: 'certificate.issued',
        timestamp: 'ISO 8601 date',
        data: {
          certificateId: 'uuid',
          userId: 'uuid',
          serial: 'CRM-2025-123456',
          issuedAt: 'date',
          expiresAt: 'date',
        },
      },
    },
    {
      event: 'certificate.expiring',
      description: 'Triggered 30 days before certificate expires',
      payload: {
        event: 'certificate.expiring',
        timestamp: 'ISO 8601 date',
        data: {
          certificateId: 'uuid',
          userId: 'uuid',
          expiresAt: 'date',
          daysRemaining: 30,
        },
      },
    },
    {
      event: 'incident.created',
      description: 'Triggered when a new incident is reported',
      payload: {
        event: 'incident.created',
        timestamp: 'ISO 8601 date',
        data: {
          incidentId: 'uuid',
          incidentNumber: 'INC-2025-001',
          severity: 'string',
          siteId: 'uuid',
        },
      },
    },
    {
      event: 'scenario.generated',
      description: 'Triggered when scenario is auto-generated from incident',
      payload: {
        event: 'scenario.generated',
        timestamp: 'ISO 8601 date',
        data: {
          scenarioId: 'uuid',
          incidentId: 'uuid',
          moduleId: 'uuid',
        },
      },
    },
  ]

  const codeExamples = {
    javascript: `// Enroll a user in a course
const response = await fetch('/api/admin/enrollments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session_token=...' // Use session authentication
  },
  body: JSON.stringify({
    userId: 'user-uuid-here',
    courseId: 'course-uuid-here'
  })
});

const data = await response.json();
console.log('Enrollment created:', data.enrollment);`,
    python: `import requests

# Get user compliance status
response = requests.get(
    'https://yourdomain.com/api/admin/users/{userId}/compliance',
    cookies={'session_token': '...'}
)

compliance_data = response.json()
for enrollment in compliance_data['enrollments']:
    print(f"Course: {enrollment['courseTitle']}")
    print(f"Status: {enrollment['status']}")
    if enrollment.get('certificate'):
        print(f"Expires: {enrollment['certificate']['expiresAt']}")`,
    curl: `# Export compliance report as CSV
curl -X GET \\
  'https://yourdomain.com/api/admin/reports/compliance-summary?format=csv' \\
  -H 'Cookie: session_token=...' \\
  -o compliance_report.csv

# Verify certificate (no auth required)
curl -X GET \\
  'https://yourdomain.com/api/certificates/verify/ABCD1234' \\
  | jq .`,
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5 text-[#EC5C29]" />
            API Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700">
            The Safety Horizon API allows you to integrate with external systems such as:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-1">Incident Management</h4>
              <p className="text-sm text-blue-700">Cority, Intelex, Gensuite</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-1">HR Systems</h4>
              <p className="text-sm text-green-700">Workday, SAP SuccessFactors</p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-1">BI Tools</h4>
              <p className="text-sm text-purple-700">Power BI, Tableau, Looker</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold text-amber-900 mb-1">Compliance Systems</h4>
              <p className="text-sm text-amber-700">Regulatory reporting tools</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-slate-900 mb-2">Authentication</h4>
            <p className="text-sm text-slate-700">
              Most endpoints require session-based authentication (admin login required).
              Public endpoints like certificate verification do not require authentication.
            </p>
            <p className="text-sm text-slate-600 mt-2">
              <strong>Coming soon:</strong> API key authentication for server-to-server integrations
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'endpoints'
                ? 'border-[#EC5C29] text-[#EC5C29]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            API Endpoints
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'webhooks'
                ? 'border-[#EC5C29] text-[#EC5C29]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Webhooks
          </button>
          <button
            onClick={() => setActiveTab('examples')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'examples'
                ? 'border-[#EC5C29] text-[#EC5C29]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Code Examples
          </button>
        </nav>
      </div>

      {/* Endpoints Tab */}
      {activeTab === 'endpoints' && (
        <div className="space-y-4">
          {apiEndpoints.map((endpoint, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        endpoint.method === 'GET'
                          ? 'bg-blue-100 text-blue-700'
                          : endpoint.method === 'POST'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono text-slate-900">{endpoint.path}</code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(endpoint.path, `endpoint-${index}`)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {copiedEndpoint === `endpoint-${index}` ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-slate-600 mt-2">{endpoint.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-1">Authentication</div>
                  <div className="text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        endpoint.auth === 'None'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {endpoint.auth}
                    </span>
                  </div>
                </div>

                {endpoint.params && (
                  <div>
                    <div className="text-xs font-semibold text-slate-600 mb-2">URL Parameters</div>
                    <div className="bg-slate-50 rounded p-3">
                      <pre className="text-xs text-slate-700">
                        {JSON.stringify(endpoint.params, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {endpoint.query && (
                  <div>
                    <div className="text-xs font-semibold text-slate-600 mb-2">Query Parameters</div>
                    <div className="bg-slate-50 rounded p-3">
                      <pre className="text-xs text-slate-700">
                        {JSON.stringify(endpoint.query, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {endpoint.body && (
                  <div>
                    <div className="text-xs font-semibold text-slate-600 mb-2">Request Body</div>
                    <div className="bg-slate-900 rounded p-3 overflow-x-auto">
                      <pre className="text-xs text-green-400">
                        {typeof endpoint.body === 'string'
                          ? endpoint.body
                          : JSON.stringify(endpoint.body, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {endpoint.response && (
                  <div>
                    <div className="text-xs font-semibold text-slate-600 mb-2">Response</div>
                    <div className="bg-slate-900 rounded p-3 overflow-x-auto">
                      <pre className="text-xs text-blue-400">
                        {typeof endpoint.response === 'string'
                          ? endpoint.response
                          : JSON.stringify(endpoint.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Webhooks Tab */}
      {activeTab === 'webhooks' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="w-5 h-5 text-purple-600" />
              Webhook Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Coming Soon</h3>
              <p className="text-sm text-purple-800 mb-3">
                Webhook support will be available in Q2 2025. You'll be able to configure
                webhook URLs to receive real-time notifications for these events:
              </p>
            </div>

            {webhookEvents.map((webhook, index) => (
              <div key={index} className="border-l-4 border-purple-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <code className="text-sm font-mono font-semibold text-slate-900">
                    {webhook.event}
                  </code>
                </div>
                <p className="text-sm text-slate-600 mb-3">{webhook.description}</p>
                <div className="bg-slate-900 rounded p-3 overflow-x-auto">
                  <pre className="text-xs text-green-400">
                    {JSON.stringify(webhook.payload, null, 2)}
                  </pre>
                </div>
              </div>
            ))}

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-slate-900 mb-2">Webhook Configuration (Preview)</h4>
              <div className="space-y-2 text-sm text-slate-700">
                <div>
                  <strong>Webhook URL:</strong> Configure in Settings → Integrations
                </div>
                <div>
                  <strong>Signing Secret:</strong> Each payload will be signed with HMAC-SHA256
                </div>
                <div>
                  <strong>Retry Policy:</strong> Failed webhooks will retry 3 times (exponential backoff)
                </div>
                <div>
                  <strong>Event Filtering:</strong> Subscribe to specific events only
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Examples Tab */}
      {activeTab === 'examples' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-green-600" />
                  JavaScript / TypeScript
                </CardTitle>
                <button
                  onClick={() => copyToClipboard(codeExamples.javascript, 'js-example')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {copiedEndpoint === 'js-example' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded p-4 overflow-x-auto">
                <pre className="text-sm text-green-400">{codeExamples.javascript}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  Python
                </CardTitle>
                <button
                  onClick={() => copyToClipboard(codeExamples.python, 'py-example')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {copiedEndpoint === 'py-example' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded p-4 overflow-x-auto">
                <pre className="text-sm text-blue-400">{codeExamples.python}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-amber-600" />
                  cURL
                </CardTitle>
                <button
                  onClick={() => copyToClipboard(codeExamples.curl, 'curl-example')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {copiedEndpoint === 'curl-example' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded p-4 overflow-x-auto">
                <pre className="text-sm text-amber-400">{codeExamples.curl}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rate Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-slate-600" />
            Rate Limits & Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Rate Limits</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>100 requests per minute (per admin session)</li>
                <li>1000 requests per hour</li>
                <li>Bulk operations (imports) not rate limited</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Best Practices</h4>
              <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                <li>Cache responses where possible</li>
                <li>Use bulk endpoints for batch operations</li>
                <li>Implement exponential backoff on errors</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-900 mb-2">⚠️ Security Notes</h4>
            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
              <li>Never expose session tokens in client-side code</li>
              <li>Use HTTPS for all API requests</li>
              <li>Validate and sanitize all user inputs</li>
              <li>Log API access for audit trails</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
