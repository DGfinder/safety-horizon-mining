'use client'

import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

type Props = {
  node: {
    nodeKey: string
    body: {
      text: string
      atmosphere?: {
        time?: string
        weather?: string
        location?: string
        urgency?: string
      }
      next?: string
    }
  }
  onNext: (nextNodeKey?: string) => void
}

export default function NarrativeDisplay({ node, onNext }: Props) {
  const { text, atmosphere, next } = node.body

  return (
    <div className="p-8 md:p-12">
      {/* Atmosphere Tags */}
      {atmosphere && (
        <div className="flex flex-wrap gap-2 mb-6">
          {atmosphere.time && (
            <span className="px-3 py-1 bg-slate-700/50 text-slate-200 rounded-full text-xs">
              🕐 {atmosphere.time}
            </span>
          )}
          {atmosphere.weather && (
            <span className="px-3 py-1 bg-slate-700/50 text-slate-200 rounded-full text-xs">
              🌤️ {atmosphere.weather}
            </span>
          )}
          {atmosphere.location && (
            <span className="px-3 py-1 bg-slate-700/50 text-slate-200 rounded-full text-xs">
              📍 {atmosphere.location}
            </span>
          )}
          {atmosphere.urgency === 'HIGH' && (
            <span className="px-3 py-1 bg-red-600/50 text-white rounded-full text-xs font-semibold animate-pulse">
              ⚠️ HIGH URGENCY
            </span>
          )}
        </div>
      )}

      {/* Story Text */}
      <div className="prose prose-invert max-w-none mb-8">
        <p className="text-xl md:text-2xl leading-relaxed text-white/90">
          {text}
        </p>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => onNext(next)}
          size="lg"
          className="bg-[#EC5C29] hover:bg-[#EC5C29]/90 text-white font-semibold"
        >
          Continue
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
