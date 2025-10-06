'use client'

import { Cloud, CloudRain, Sun, Wind, Eye, Thermometer, Droplets, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type AtmosphereCondition = {
  weather: 'clear' | 'cloudy' | 'rain' | 'storm' | 'dust'
  visibility: number // meters
  temperature: number // celsius
  windSpeed: number // km/h
  humidity: number // percentage
  timeOfDay: 'early-morning' | 'day-shift' | 'evening' | 'night-shift'
  lightLevel: 'excellent' | 'good' | 'reduced' | 'poor'
}

type Props = {
  conditions: AtmosphereCondition
  alerts?: string[]
  compact?: boolean
}

export default function AtmosphereDisplay({ conditions, alerts = [], compact = false }: Props) {
  const getWeatherIcon = () => {
    switch (conditions.weather) {
      case 'clear':
        return <Sun className="w-5 h-5 text-amber-400" />
      case 'cloudy':
        return <Cloud className="w-5 h-5 text-slate-400" />
      case 'rain':
        return <CloudRain className="w-5 h-5 text-blue-400" />
      case 'storm':
        return <CloudRain className="w-5 h-5 text-red-400" />
      case 'dust':
        return <Wind className="w-5 h-5 text-amber-600" />
    }
  }

  const getVisibilityStatus = (vis: number): { status: string; color: string } => {
    if (vis >= 1000) return { status: 'Excellent', color: 'text-green-400' }
    if (vis >= 500) return { status: 'Good', color: 'text-blue-400' }
    if (vis >= 200) return { status: 'Reduced', color: 'text-amber-400' }
    return { status: 'Poor', color: 'text-red-400' }
  }

  const getWindStatus = (speed: number): { status: string; color: string } => {
    if (speed < 20) return { status: 'Calm', color: 'text-green-400' }
    if (speed < 40) return { status: 'Moderate', color: 'text-amber-400' }
    return { status: 'High', color: 'text-red-400' }
  }

  const getTempColor = (temp: number): string => {
    if (temp > 35) return 'text-red-400'
    if (temp > 28) return 'text-amber-400'
    if (temp < 5) return 'text-blue-400'
    return 'text-green-400'
  }

  const getTimeLabel = (): string => {
    switch (conditions.timeOfDay) {
      case 'early-morning':
        return '05:00-07:00'
      case 'day-shift':
        return '07:00-19:00'
      case 'evening':
        return '19:00-21:00'
      case 'night-shift':
        return '21:00-05:00'
    }
  }

  const visibilityStatus = getVisibilityStatus(conditions.visibility)
  const windStatus = getWindStatus(conditions.windSpeed)

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-1">
          {getWeatherIcon()}
          <span className="capitalize">{conditions.weather}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{conditions.visibility}m</span>
        </div>
        <div className="flex items-center gap-1">
          <Thermometer className="w-4 h-4" />
          <span>{conditions.temperature}°C</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-4 h-4" />
          <span>{conditions.windSpeed} km/h</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#192135] border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Environmental Conditions
            </h3>
          </div>
          <Badge variant="outline" className="text-xs border-white/20 text-slate-300">
            {getTimeLabel()}
          </Badge>
        </div>
      </div>

      {/* Main Conditions Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Weather */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              {getWeatherIcon()}
              <span className="text-xs text-slate-400 uppercase">Weather</span>
            </div>
            <div className="text-lg font-semibold text-white capitalize">
              {conditions.weather}
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400 uppercase">Visibility</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-white">{conditions.visibility}m</span>
              <span className={`text-xs font-medium ${visibilityStatus.color}`}>
                {visibilityStatus.status}
              </span>
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400 uppercase">Temperature</span>
            </div>
            <div className={`text-lg font-semibold ${getTempColor(conditions.temperature)}`}>
              {conditions.temperature}°C
            </div>
          </div>

          {/* Wind */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400 uppercase">Wind Speed</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-white">{conditions.windSpeed} km/h</span>
              <span className={`text-xs font-medium ${windStatus.color}`}>
                {windStatus.status}
              </span>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400 uppercase">Humidity</span>
            </div>
            <div className="text-lg font-semibold text-white">
              {conditions.humidity}%
            </div>
          </div>

          {/* Light Level */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400 uppercase">Light Level</span>
            </div>
            <div className="text-lg font-semibold text-white capitalize">
              {conditions.lightLevel}
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mt-4 space-y-2">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 rounded bg-amber-950/30 border border-amber-800/50"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-amber-200">{alert}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with operational status */}
      <div className="bg-white/5 border-t border-white/10 px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Shift: {conditions.timeOfDay.replace('-', ' ').toUpperCase()}</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-green-400">Conditions Monitored</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact inline version for use in headers
export function AtmosphereCompact({ conditions }: { conditions: AtmosphereCondition }) {
  return <AtmosphereDisplay conditions={conditions} compact />
}
