import { Trophy, Clock, Target, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
  progressPercent: number
  completedModules: number
  totalModules: number
  avgScore: number
  certificateExpiryDays: number | null
}

export default function QuickStatsWidget({
  progressPercent,
  completedModules,
  totalModules,
  avgScore,
  certificateExpiryDays,
}: Props) {
  const stats = [
    {
      icon: Target,
      label: 'Progress',
      value: `${progressPercent}%`,
      subtext: `${completedModules}/${totalModules} modules`,
      color: 'text-[#EC5C29]',
      bgColor: 'bg-[#EC5C29]/10',
    },
    {
      icon: Trophy,
      label: 'Avg Score',
      value: avgScore > 0 ? `${avgScore}%` : '-',
      subtext: completedModules > 0 ? `${completedModules} completed` : 'No scores yet',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Award,
      label: 'Certificate',
      value: certificateExpiryDays !== null && certificateExpiryDays > 0
        ? `${certificateExpiryDays}d`
        : certificateExpiryDays === null ? 'Pending' : 'Expired',
      subtext: certificateExpiryDays !== null && certificateExpiryDays > 0
        ? 'until expiry'
        : certificateExpiryDays === null ? 'Complete training' : 'Renewal needed',
      color: certificateExpiryDays !== null && certificateExpiryDays > 30
        ? 'text-green-600'
        : certificateExpiryDays !== null && certificateExpiryDays > 0
        ? 'text-amber-600'
        : 'text-slate-400',
      bgColor: certificateExpiryDays !== null && certificateExpiryDays > 30
        ? 'bg-green-50'
        : certificateExpiryDays !== null && certificateExpiryDays > 0
        ? 'bg-amber-50'
        : 'bg-slate-50',
    },
    {
      icon: Clock,
      label: 'Next Module',
      value: totalModules - completedModules > 0
        ? `${totalModules - completedModules}`
        : 'Done!',
      subtext: totalModules - completedModules > 0 ? 'remaining' : 'All complete',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-600 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color} mb-0.5`}>{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.subtext}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
