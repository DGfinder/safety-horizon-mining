'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Clock, Cloud, MapPin, AlertTriangle } from 'lucide-react'

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
      {/* Professional Context Header */}
      {atmosphere && (
        <div className="mb-6 bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-3">
            {atmosphere.time && (
              <Badge variant="outline" className="border-white/20 text-slate-200">
                <Clock className="w-3 h-3 mr-1.5" />
                {atmosphere.time}
              </Badge>
            )}
            {atmosphere.weather && (
              <Badge variant="outline" className="border-white/20 text-slate-200">
                <Cloud className="w-3 h-3 mr-1.5" />
                {atmosphere.weather}
              </Badge>
            )}
            {atmosphere.location && (
              <Badge variant="outline" className="border-white/20 text-slate-200">
                <MapPin className="w-3 h-3 mr-1.5" />
                {atmosphere.location}
              </Badge>
            )}
            {atmosphere.urgency === 'HIGH' && (
              <Badge className="bg-red-600/80 hover:bg-red-600 text-white border-red-500 animate-pulse">
                <AlertTriangle className="w-3 h-3 mr-1.5" />
                HIGH URGENCY
              </Badge>
            )}
          </div>
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
