'use client'

import { MapPin, AlertTriangle, CheckCircle, Radio } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type Equipment = {
  id: string
  type: 'loader' | 'haul-truck' | 'excavator' | 'light-vehicle'
  label: string
  x: number // percentage position
  y: number
  status: 'active' | 'idle' | 'alert'
}

type Zone = {
  id: string
  type: 'active' | 'restricted' | 'hazard' | 'safe'
  label: string
  x: number
  y: number
  width: number
  height: number
}

type Props = {
  siteName: string
  equipment?: Equipment[]
  zones?: Zone[]
  currentLocation?: { x: number; y: number; label: string }
  weatherCondition?: string
  visibility?: string
  timeOfDay?: string
}

export default function MineContextPanel({
  siteName,
  equipment = [],
  zones = [],
  currentLocation,
  weatherCondition = 'Clear',
  visibility = 'Good',
  timeOfDay = 'Day Shift',
}: Props) {
  const getZoneColor = (type: Zone['type']) => {
    switch (type) {
      case 'active':
        return 'stroke-blue-400 fill-blue-400/10'
      case 'restricted':
        return 'stroke-amber-400 fill-amber-400/10'
      case 'hazard':
        return 'stroke-red-400 fill-red-400/10'
      case 'safe':
        return 'stroke-green-400 fill-green-400/10'
    }
  }

  const getEquipmentIcon = (type: Equipment['type']) => {
    // Simple geometric shapes representing equipment
    switch (type) {
      case 'loader':
        return (
          <g>
            <rect x="-4" y="-3" width="8" height="6" fill="currentColor" />
            <rect x="-6" y="-2" width="3" height="4" fill="currentColor" />
          </g>
        )
      case 'haul-truck':
        return (
          <g>
            <rect x="-5" y="-3" width="10" height="6" fill="currentColor" />
            <rect x="3" y="-4" width="3" height="8" fill="currentColor" />
          </g>
        )
      case 'excavator':
        return (
          <g>
            <rect x="-4" y="-4" width="8" height="8" fill="currentColor" />
            <line x1="4" y1="0" x2="10" y2="-6" stroke="currentColor" strokeWidth="2" />
          </g>
        )
      case 'light-vehicle':
        return (
          <g>
            <rect x="-3" y="-2" width="6" height="4" fill="currentColor" />
          </g>
        )
    }
  }

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-400'
      case 'idle':
        return 'text-slate-400'
      case 'alert':
        return 'text-amber-400'
    }
  }

  return (
    <div className="bg-[#192135] border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#EC5C29] animate-pulse" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Site Overview
            </h3>
            <Badge variant="outline" className="text-xs border-white/20 text-slate-300">
              {siteName}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Radio className="w-3 h-3" />
              <span>{timeOfDay}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>VIS: {visibility}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{weatherCondition}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Site Diagram */}
      <div className="relative bg-slate-950 aspect-[16/9]">
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
          }}
        >
          {/* Grid pattern for technical blueprint feel */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(148, 163, 184, 0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="800" height="450" fill="url(#grid)" />

          {/* Pit outline - simplified oval shape */}
          <ellipse
            cx="400"
            cy="225"
            rx="350"
            ry="180"
            fill="none"
            stroke="rgba(148, 163, 184, 0.3)"
            strokeWidth="2"
            strokeDasharray="10,5"
          />

          {/* Zones */}
          {zones.map((zone) => (
            <g key={zone.id}>
              <rect
                x={(zone.x / 100) * 800}
                y={(zone.y / 100) * 450}
                width={(zone.width / 100) * 800}
                height={(zone.height / 100) * 450}
                className={getZoneColor(zone.type)}
                strokeWidth="2"
                strokeDasharray="4,4"
                rx="4"
              />
              <text
                x={(zone.x / 100) * 800 + ((zone.width / 100) * 800) / 2}
                y={(zone.y / 100) * 450 + 15}
                textAnchor="middle"
                className="fill-white text-xs font-mono"
                style={{ fontSize: '10px' }}
              >
                {zone.label}
              </text>
            </g>
          ))}

          {/* Equipment */}
          {equipment.map((item) => (
            <g
              key={item.id}
              transform={`translate(${(item.x / 100) * 800}, ${(item.y / 100) * 450})`}
            >
              {/* Equipment icon */}
              <g className={getStatusColor(item.status)}>
                {getEquipmentIcon(item.type)}
              </g>
              {/* Status ring */}
              <circle
                cx="0"
                cy="0"
                r="12"
                fill="none"
                className={getStatusColor(item.status)}
                strokeWidth="1.5"
                opacity="0.6"
              />
              {/* Label */}
              <text
                y="20"
                textAnchor="middle"
                className="fill-white text-xs font-mono"
                style={{ fontSize: '9px' }}
              >
                {item.label}
              </text>
              {/* Alert indicator */}
              {item.status === 'alert' && (
                <circle
                  cx="8"
                  cy="-8"
                  r="3"
                  className="fill-amber-400 animate-pulse"
                />
              )}
            </g>
          ))}

          {/* Current Location */}
          {currentLocation && (
            <g
              transform={`translate(${(currentLocation.x / 100) * 800}, ${
                (currentLocation.y / 100) * 450
              })`}
            >
              {/* Pulsing location marker */}
              <circle
                cx="0"
                cy="0"
                r="8"
                className="fill-[#EC5C29]"
                opacity="0.3"
              >
                <animate
                  attributeName="r"
                  from="8"
                  to="16"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.3"
                  to="0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="0" cy="0" r="6" className="fill-[#EC5C29]" />
              <text
                y="-12"
                textAnchor="middle"
                className="fill-[#EC5C29] text-xs font-bold"
                style={{ fontSize: '10px' }}
              >
                {currentLocation.label}
              </text>
            </g>
          )}

          {/* Compass rose */}
          <g transform="translate(750, 50)">
            <circle cx="0" cy="0" r="25" fill="rgba(15, 23, 42, 0.8)" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1" />
            <text y="-15" textAnchor="middle" className="fill-white text-xs font-bold" style={{ fontSize: '12px' }}>N</text>
            <text y="20" textAnchor="middle" className="fill-slate-400 text-xs" style={{ fontSize: '10px' }}>S</text>
            <text x="15" y="5" textAnchor="middle" className="fill-slate-400 text-xs" style={{ fontSize: '10px' }}>E</text>
            <text x="-15" y="5" textAnchor="middle" className="fill-slate-400 text-xs" style={{ fontSize: '10px' }}>W</text>
            <polygon points="0,-12 -3,-3 3,-3" className="fill-[#EC5C29]" />
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="bg-white/5 border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-slate-300">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="text-slate-300">Idle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-slate-300">Alert</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-3 h-3" />
            <span>Real-time tracking</span>
          </div>
        </div>
      </div>
    </div>
  )
}
