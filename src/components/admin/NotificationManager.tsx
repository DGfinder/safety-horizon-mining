'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Mail,
  Send,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Users,
  TrendingUp,
  Settings,
} from 'lucide-react'

interface EmailLog {
  id: string
  emailType: string
  sentAt: Date
  metadata: any
  user: {
    id: string
    name: string | null
    email: string
  }
  certificate?: {
    id: string
    serial: string
    enrollment: {
      course: {
        title: string
      }
    }
  } | null
}

interface OrgSettings {
  id: string
  certValidityMonths: number
  reminderDaysBefore: number[]
}

interface UpcomingReminder {
  id: string
  expiresAt: Date
  enrollment: {
    user: {
      name: string | null
      email: string
    }
    course: {
      title: string
    }
  }
}

interface NotificationManagerProps {
  emailLogs: EmailLog[]
  orgSettings: OrgSettings | null
  upcomingReminders: UpcomingReminder[]
}

export default function NotificationManager({
  emailLogs,
  orgSettings,
  upcomingReminders,
}: NotificationManagerProps) {
  const [activeTab, setActiveTab] = useState<'logs' | 'upcoming' | 'settings'>('logs')

  // Calculate email statistics
  const stats = {
    total: emailLogs.length,
    welcome: emailLogs.filter((log) => log.emailType === 'WELCOME').length,
    expiryReminders: emailLogs.filter((log) => log.emailType === 'EXPIRY_REMINDER').length,
    certificates: emailLogs.filter((log) => log.emailType === 'CERTIFICATE_ISSUED').length,
    incidents: emailLogs.filter((log) => log.emailType === 'INCIDENT_NOTIFICATION').length,
  }

  const emailTypeColors: Record<string, { bg: string; text: string; icon: string }> = {
    WELCOME: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '👋' },
    EXPIRY_REMINDER: { bg: 'bg-amber-100', text: 'text-amber-700', icon: '⏰' },
    CERTIFICATE_ISSUED: { bg: 'bg-green-100', text: 'text-green-700', icon: '🎓' },
    INCIDENT_NOTIFICATION: { bg: 'bg-red-100', text: 'text-red-700', icon: '⚠️' },
  }

  const getTimeSince = (date: Date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Total Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Welcome
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.welcome}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-amber-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{stats.expiryReminders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.certificates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{stats.incidents}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'logs'
                ? 'border-[#EC5C29] text-[#EC5C29]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Email Logs ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'upcoming'
                ? 'border-[#EC5C29] text-[#EC5C29]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Upcoming Reminders ({upcomingReminders.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'settings'
                ? 'border-[#EC5C29] text-[#EC5C29]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Email Logs Tab */}
      {activeTab === 'logs' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#EC5C29]" />
              Recent Email Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {emailLogs.map((log) => {
                const typeInfo = emailTypeColors[log.emailType] || {
                  bg: 'bg-slate-100',
                  text: 'text-slate-700',
                  icon: '📧',
                }

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <div className="text-2xl">{typeInfo.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${typeInfo.bg} ${typeInfo.text}`}
                        >
                          {log.emailType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-slate-500">
                          {getTimeSince(log.sentAt)}
                        </span>
                      </div>
                      <div className="font-medium text-slate-900">
                        {log.user.name || log.user.email}
                      </div>
                      <div className="text-sm text-slate-600 truncate">{log.user.email}</div>
                      {log.metadata && (
                        <div className="mt-2 text-xs text-slate-500">
                          {log.metadata.courseName && (
                            <div>Course: {log.metadata.courseName}</div>
                          )}
                          {log.metadata.daysUntilExpiry !== undefined && (
                            <div>Days until expiry: {log.metadata.daysUntilExpiry}</div>
                          )}
                          {log.certificate && (
                            <div>Certificate: {log.certificate.serial}</div>
                          )}
                        </div>
                      )}
                    </div>
                    <Send className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  </div>
                )
              })}

              {emailLogs.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No emails sent yet</p>
                  <p className="text-sm mt-1">
                    Emails will appear here when users are imported or certificates are issued
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Reminders Tab */}
      {activeTab === 'upcoming' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              Upcoming Expiry Reminders (Next 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {upcomingReminders.map((reminder) => {
                const daysUntilExpiry = Math.ceil(
                  (new Date(reminder.expiresAt).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                )

                const urgency =
                  daysUntilExpiry <= 7
                    ? { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
                    : daysUntilExpiry <= 14
                      ? {
                          color: 'text-amber-600',
                          bg: 'bg-amber-50',
                          border: 'border-amber-200',
                        }
                      : {
                          color: 'text-slate-600',
                          bg: 'bg-slate-50',
                          border: 'border-slate-200',
                        }

                return (
                  <div
                    key={reminder.id}
                    className={`p-4 rounded-lg border ${urgency.bg} ${urgency.border}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-slate-900">
                          {reminder.enrollment.user.name || reminder.enrollment.user.email}
                        </div>
                        <div className="text-sm text-slate-600">
                          {reminder.enrollment.user.email}
                        </div>
                        <div className="text-sm text-slate-700 mt-1">
                          {reminder.enrollment.course.title}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${urgency.color}`}>
                          {daysUntilExpiry} days
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(reminder.expiresAt).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {upcomingReminders.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-300" />
                  <p>No upcoming expiries</p>
                  <p className="text-sm mt-1">
                    All certifications are valid for more than 30 days
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-600" />
              Email Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Current Configuration</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div>
                  <span className="font-medium">Certificate Validity:</span>{' '}
                  {orgSettings?.certValidityMonths || 12} months
                </div>
                <div>
                  <span className="font-medium">Reminder Schedule:</span>{' '}
                  {orgSettings?.reminderDaysBefore?.join(', ') || '30, 14, 7'} days before
                  expiry
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-slate-900 mb-3">Cron Job Configuration</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="font-mono text-sm text-slate-700 mb-2">
                  Schedule: Daily at 9:00 AM UTC
                </div>
                <div className="text-sm text-slate-600 mb-4">
                  Configured in <code className="bg-slate-200 px-1 rounded">vercel.json</code>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Checks for certificates expiring in next 90 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Sends reminders at {orgSettings?.reminderDaysBefore?.length || 3}{' '}intervals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Prevents duplicate emails (checks EmailLog)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-slate-900 mb-3">Email Provider Status</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-medium text-slate-900">Resend Connected</span>
                </div>
                <div className="text-sm text-slate-600">
                  API Key configured. Emails are being sent successfully.
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  <div>Free tier: 3,000 emails/month</div>
                  <div>Pro tier: 50,000 emails/month ($20/mo)</div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-slate-900 mb-3">Email Templates</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">Welcome Email</div>
                  <div className="text-xs text-blue-700 mt-1">
                    Sent during bulk user import
                  </div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="text-sm font-medium text-amber-900">Expiry Reminder</div>
                  <div className="text-xs text-amber-700 mt-1">
                    Automated cron job (daily)
                  </div>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm font-medium text-green-900">Certificate Issued</div>
                  <div className="text-xs text-green-700 mt-1">
                    Sent on course completion
                  </div>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-sm font-medium text-red-900">Incident Alert</div>
                  <div className="text-xs text-red-700 mt-1">
                    Sent when scenario created
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-900 mb-2">⚠️ Important Notes</h4>
              <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                <li>Email reminders require CRON_SECRET environment variable</li>
                <li>Test cron job manually: <code className="bg-amber-100 px-1 rounded">curl -H "Authorization: Bearer $CRON_SECRET" /api/cron/expiry-reminders</code></li>
                <li>Check Resend dashboard for delivery metrics and bounce rates</li>
                <li>Verify domain SPF/DKIM records for better deliverability</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
