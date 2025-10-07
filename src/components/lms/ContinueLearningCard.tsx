import Link from 'next/link'
import { PlayCircle, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

type Props = {
  moduleTitle: string
  moduleNumber: number
  scenarioId: string
  moduleId: string
  progress?: number
}

export default function ContinueLearningCard({ moduleTitle, moduleNumber, scenarioId, moduleId, progress = 0 }: Props) {
  return (
    <Card className="border-l-4 border-l-[#EC5C29] bg-gradient-to-r from-[#EC5C29]/5 to-transparent hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#EC5C29] flex items-center justify-center">
            <PlayCircle className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#EC5C29] uppercase tracking-wide mb-1">
              Continue Where You Left Off
            </p>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Module {moduleNumber}: {moduleTitle}
            </h3>
            {progress > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>Progress</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>

          {/* Action Button */}
          <Link
            href={`/lms/modules/${moduleId}`}
            className="flex-shrink-0 px-6 py-3 bg-[#EC5C29] text-white rounded-lg hover:bg-[#EC5C29]/90 transition-colors font-semibold flex items-center gap-2 group"
          >
            <span>{progress > 0 ? 'Resume' : 'Start'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
