'use client'

import { ReactNode, useState } from 'react'
import LMSHeader from './LMSHeader'
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      {/* Top Header */}
      <LMSHeader
        user={user}
        progressPercent={enrollmentData?.progressPercent}
        notificationCount={0}
        onSearchClick={() => {
          // TODO: Implement global search modal
          console.log('Search clicked')
        }}
      />

      {/* Mobile Sidebar Toggle (shows when sidebar is hidden) */}
      <div className="lg:hidden fixed bottom-4 left-4 z-50">
        <Button
          variant="default"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-[#EC5C29] hover:bg-[#EC5C29]/90 text-white w-12 h-12 rounded-full shadow-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-16 z-40 lg:z-0
            h-[calc(100vh-4rem)]
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <LMSSidebar
            enrollmentData={enrollmentData}
            onNavigate={() => setSidebarOpen(false)}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100">
          {children}
        </main>
      </div>
    </div>
  )
}
