'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Award, HelpCircle, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import CircularProgress from './CircularProgress'
import ModuleTree from './ModuleTree'

type Props = {
  user?: {
    id: string
    name: string | null
    email: string
    role: string
    org?: {
      name: string
    } | null
  }
  enrollmentData?: {
    totalModules: number
    completedModules: number
    progressPercent: number
    currentModuleIndex: number | null
    certificateExpiryDays: number | null
    modules: Array<{
      id: string
      title: string
      orderIndex: number
      description: string | null
      scenarioId: string | null
      passed: boolean
      score: number | null
      isLocked: boolean
    }>
  }
  onNavigate?: () => void
}

export default function LMSSidebar({ user, enrollmentData, onNavigate }: Props) {
  const pathname = usePathname()

  return (
    <div className="w-80 h-screen bg-[#192135] text-white flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#EC5C29] flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Safety Horizon</h1>
            <p className="text-xs text-slate-400">Mining Training LMS</p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="font-semibold text-sm">{user.name || 'User'}</p>
            <p className="text-xs text-slate-400">{user.org?.name || 'Organization'}</p>
            <Badge variant="outline" className="mt-2 text-xs border-white/20 text-white">
              {user.role === 'ADMIN' ? 'Administrator' : user.role === 'SUPERVISOR' ? 'Supervisor' : 'Learner'}
            </Badge>
          </div>
        )}
      </div>

      {/* Progress Overview */}
      {enrollmentData && (
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Training Progress
          </h3>

          <div className="flex items-center justify-between mb-6">
            <CircularProgress
              value={enrollmentData.progressPercent}
              size={80}
              strokeWidth={8}
            />
            <div className="flex-1 ml-4">
              <div className="text-2xl font-bold">{enrollmentData.progressPercent}%</div>
              <div className="text-sm text-slate-400">
                {enrollmentData.completedModules} of {enrollmentData.totalModules} modules
              </div>
            </div>
          </div>

          {/* Certificate Status */}
          {enrollmentData.certificateExpiryDays !== null && (
            <div className={`
              p-3 rounded-lg border
              ${enrollmentData.certificateExpiryDays > 30
                ? 'bg-green-950/30 border-green-800/50'
                : enrollmentData.certificateExpiryDays > 0
                ? 'bg-amber-950/30 border-amber-800/50'
                : 'bg-red-950/30 border-red-800/50'
              }
            `}>
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-xs font-semibold">Certificate Status</span>
              </div>
              <p className="text-xs text-slate-300">
                {enrollmentData.certificateExpiryDays > 0
                  ? `${enrollmentData.certificateExpiryDays} days until expiry`
                  : enrollmentData.certificateExpiryDays === 0
                  ? 'Expires today'
                  : 'Expired - Recertification required'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Module Tree */}
      {enrollmentData && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Course Modules
            </h3>
            <ModuleTree
              modules={enrollmentData.modules}
              currentModuleIndex={enrollmentData.currentModuleIndex}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="p-6 border-t border-white/10 space-y-2">
        <Link
          href="/lms"
          onClick={onNavigate}
          className={`
            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${pathname === '/lms' ? 'bg-[#EC5C29] text-white' : 'hover:bg-white/5 text-slate-300'}
          `}
        >
          <Home className="w-4 h-4" />
          <span className="text-sm">Dashboard</span>
        </Link>

        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm">Main Site</span>
        </Link>

        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-sm">Help & Resources</span>
        </button>
      </div>
    </div>
  )
}
