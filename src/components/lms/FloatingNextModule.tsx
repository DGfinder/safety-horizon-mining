'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  moduleTitle: string
  moduleNumber: number
  scenarioId: string
  moduleId: string
}

export default function FloatingNextModule({ moduleTitle, moduleNumber, scenarioId, moduleId }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
      <Link href={`/lms/scenarios/${scenarioId}?moduleId=${moduleId}`}>
        <Button className="bg-[#EC5C29] hover:bg-[#EC5C29]/90 text-white shadow-2xl px-6 py-6 rounded-full flex items-center gap-3 group">
          <div className="text-left">
            <p className="text-xs opacity-90">Next Module</p>
            <p className="font-semibold text-sm">
              {moduleNumber}. {moduleTitle.length > 20 ? moduleTitle.substring(0, 20) + '...' : moduleTitle}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  )
}
