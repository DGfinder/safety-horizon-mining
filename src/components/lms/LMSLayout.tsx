'use client'

import { ReactNode, useState } from 'react'
import LMSSidebar from './LMSSidebar'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  children: ReactNode
  user?: {
    id: string
    name: string | null
    email: string
    role: string
    org?: {
      name: string
    } | null
  }
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
}

export default function LMSLayout({ children, user, enrollmentData }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#192135] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-white/10"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <h1 className="font-bold text-lg">Safety Horizon</h1>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`
            fixed lg:sticky top-0 h-screen z-40 lg:z-0
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <LMSSidebar
            user={user}
            enrollmentData={enrollmentData}
            onNavigate={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 w-full lg:w-auto pt-16 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  )
}
