'use client'

import Link from 'next/link'
import { CheckCircle, Lock, Circle, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type Module = {
  id: string
  title: string
  orderIndex: number
  description: string | null
  scenarioId: string | null
  passed: boolean
  score: number | null
  isLocked: boolean
}

type Props = {
  modules: Module[]
  currentModuleIndex: number | null
  onNavigate?: () => void
}

export default function ModuleTree({ modules, currentModuleIndex, onNavigate }: Props) {
  return (
    <div className="space-y-1">
      {modules.map((module) => {
        const isCompleted = module.passed
        const isLocked = module.isLocked
        const isCurrent = module.orderIndex === currentModuleIndex

        return (
          <Link
            key={module.id}
            href={module.scenarioId && !isLocked ? `/lms/scenarios/${module.scenarioId}?moduleId=${module.id}` : '/lms'}
            onClick={onNavigate}
            className={`
              block group relative
              ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
            `}
          >
            <div
              className={`
                flex items-start gap-3 p-3 rounded-lg transition-all
                ${isCurrent && !isCompleted
                  ? 'bg-[#EC5C29]/20 border border-[#EC5C29]/40'
                  : isCompleted
                  ? 'bg-green-950/20 hover:bg-green-950/30'
                  : isLocked
                  ? 'bg-white/5'
                  : 'hover:bg-white/5'
                }
              `}
            >
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : isLocked ? (
                  <Lock className="w-5 h-5 text-slate-500" />
                ) : (
                  <Circle className="w-5 h-5 text-[#EC5C29]" />
                )}
              </div>

              {/* Module Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-slate-400">
                    MOD {String(module.orderIndex).padStart(2, '0')}
                  </span>
                  {isCompleted && module.score !== null && (
                    <Badge variant="outline" className="text-xs border-green-600/50 text-green-400">
                      {module.score}%
                    </Badge>
                  )}
                  {isCurrent && !isCompleted && (
                    <Badge variant="outline" className="text-xs border-[#EC5C29]/50 text-[#EC5C29]">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-medium text-white truncate group-hover:text-[#EC5C29] transition-colors">
                  {module.title}
                </p>
                {isLocked && (
                  <p className="text-xs text-slate-500 mt-1">
                    Complete Module {module.orderIndex - 1} to unlock
                  </p>
                )}
              </div>

              {/* Navigation Arrow */}
              {!isLocked && (
                <div className="flex-shrink-0">
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#EC5C29] transition-colors" />
                </div>
              )}
            </div>

            {/* Connector Line */}
            {module.orderIndex < modules.length && (
              <div className="ml-[22px] h-2 w-0.5 bg-white/10" />
            )}
          </Link>
        )
      })}
    </div>
  )
}
