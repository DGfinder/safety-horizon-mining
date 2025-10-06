'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle, Lock, Trophy } from 'lucide-react'

type Module = {
  id: string
  title: string
  orderIndex: number
  passed: boolean
  score: number | null
  isLocked: boolean
}

type Props = {
  modules: Module[]
  currentModuleIndex: number | null
  completedModules: number
  totalModules: number
}

export default function TrainingJourney({ modules, currentModuleIndex, completedModules, totalModules }: Props) {
  const progressPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0
  const isComplete = completedModules === totalModules

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Training Journey</CardTitle>
            <CardDescription>Your path to safety excellence</CardDescription>
          </div>
          {isComplete && (
            <Trophy className="w-8 h-8 text-[#EC5C29]" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Overall Progress</span>
            <span className="text-sm font-bold text-[#192135]">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#EC5C29] to-[#d94d1f] transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Journey Map */}
        <div className="space-y-4">
          {modules.map((module, index) => {
            const isCurrent = module.orderIndex === currentModuleIndex
            const isNext = !module.passed && !module.isLocked && !isCurrent

            return (
              <div key={module.id} className="relative">
                {/* Connection Line */}
                {index < modules.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 w-0.5 h-12 ${
                      module.passed ? 'bg-green-500' : 'bg-slate-300'
                    }`}
                  />
                )}

                {/* Module Item */}
                <div className={`
                  flex items-start gap-4 p-4 rounded-lg transition-all
                  ${isCurrent ? 'bg-[#EC5C29]/10 border-2 border-[#EC5C29]' : ''}
                  ${isNext ? 'bg-blue-50 border-2 border-blue-200' : ''}
                  ${module.isLocked ? 'opacity-60' : ''}
                `}>
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {module.passed ? (
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    ) : module.isLocked ? (
                      <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-slate-600" />
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCurrent || isNext ? 'bg-[#EC5C29]' : 'bg-slate-300'
                      }`}>
                        <Circle className={`w-5 h-5 ${isCurrent || isNext ? 'text-white' : 'text-slate-600'}`} />
                      </div>
                    )}
                  </div>

                  {/* Module Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[#192135]">{module.title}</h4>
                      {module.passed && module.score !== null && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          {module.score}%
                        </span>
                      )}
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-[#EC5C29] text-white text-xs font-semibold rounded">
                          Current
                        </span>
                      )}
                      {isNext && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded">
                          Next
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-600">
                      {module.passed
                        ? 'Completed'
                        : module.isLocked
                        ? `Locked - Complete Module ${module.orderIndex - 1} first`
                        : 'Ready to start'
                      }
                    </p>
                  </div>

                  {/* Module Number */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-300">
                      {module.orderIndex.toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Journey Complete Message */}
        {isComplete && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">Journey Complete!</h4>
                <p className="text-sm text-green-700">You've completed all training modules. Well done!</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
