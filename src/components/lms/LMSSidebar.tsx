'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight, Award, AlertCircle, PlayCircle, CheckCircle, Home, FileText, HelpCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import ModuleTree from './ModuleTree'
import { Button } from '@/components/ui/button'

type Props = {
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

export default function LMSSidebar({ enrollmentData, onNavigate }: Props) {
  const pathname = usePathname()
  const [showAllModules, setShowAllModules] = useState(false)

  // Get current and next module for quick access
  const currentModule = enrollmentData?.modules.find(
    (m) => m.orderIndex === enrollmentData.currentModuleIndex
  )
  const nextModule = enrollmentData?.modules.find(
    (m) => m.orderIndex === (enrollmentData.currentModuleIndex || 0) + 1
  )

  // Check if certificate is expiring soon (within 45 days)
  const showCertAlert = enrollmentData?.certificateExpiryDays !== null &&
    enrollmentData.certificateExpiryDays < 45

  return (
    <div className="w-65 h-full bg-[#192135] text-white flex flex-col overflow-y-auto" style={{ width: '260px' }}>
      {/* Certificate Alert (if expiring soon) */}
      {showCertAlert && enrollmentData && (
        <div className="m-4">
          <div className={`
            p-3 rounded-lg border
            ${enrollmentData.certificateExpiryDays! > 30
              ? 'bg-green-950/30 border-green-800/50'
              : enrollmentData.certificateExpiryDays! > 0
              ? 'bg-amber-950/30 border-amber-800/50'
              : 'bg-red-950/30 border-red-800/50'
            }
          `}>
            <div className="flex items-center gap-2 mb-1">
              {enrollmentData.certificateExpiryDays! > 0 ? (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-xs font-semibold">Certificate Alert</span>
            </div>
            <p className="text-xs text-slate-300">
              {enrollmentData.certificateExpiryDays! > 0
                ? `${enrollmentData.certificateExpiryDays} days until expiry`
                : 'Expired - Recertification required'
              }
            </p>
          </div>
        </div>
      )}

      {/* Quick Access */}
      {enrollmentData && (currentModule || nextModule) && (
        <div className="px-4 py-3 border-b border-white/10">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Quick Access
          </h3>
          <div className="space-y-2">
            {currentModule && !currentModule.passed && (
              <Link
                href={`/lms/scenarios/${currentModule.scenarioId}?moduleId=${currentModule.id}`}
                onClick={onNavigate}
                className="block p-3 rounded-lg bg-[#EC5C29]/20 border border-[#EC5C29]/40 hover:bg-[#EC5C29]/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <PlayCircle className="w-4 h-4 text-[#EC5C29]" />
                  <span className="text-xs text-[#EC5C29] font-semibold">Current Module</span>
                </div>
                <p className="text-sm text-white font-medium truncate">
                  {currentModule.orderIndex}. {currentModule.title}
                </p>
              </Link>
            )}
            {nextModule && !nextModule.isLocked && (
              <Link
                href={`/lms/scenarios/${nextModule.scenarioId}?moduleId=${nextModule.id}`}
                onClick={onNavigate}
                className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400 font-semibold">Up Next</span>
                </div>
                <p className="text-sm text-white font-medium truncate">
                  {nextModule.orderIndex}. {nextModule.title}
                </p>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Navigation Links */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 transition-colors text-sm"
        >
          <Home className="w-4 h-4" />
          <span>Main Site</span>
        </Link>

        <Link
          href="/lms/resources"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 transition-colors text-sm"
        >
          <FileText className="w-4 h-4" />
          <span>Resources</span>
        </Link>

        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 transition-colors text-sm"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help</span>
        </button>
      </div>
    </div>
  )
}
