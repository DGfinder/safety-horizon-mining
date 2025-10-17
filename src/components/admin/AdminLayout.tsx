import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, BookOpen, Users, Settings, FileText, LogOut, AlertTriangle, UserCheck, BarChart3, Bell, Code } from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

export default function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Modules', href: '/admin/modules', icon: BookOpen },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Incidents', href: '/admin/incidents', icon: AlertTriangle },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'API Docs', href: '/admin/api-docs', icon: Code },
    { name: 'Supervisor', href: '/supervisor', icon: UserCheck },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#192135] text-white">
        {/* Logo */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Image
              src="/img/logo.svg"
              alt="Crew Resource Mining"
              width={60}
              height={24}
              className="h-6 w-auto"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Crew Resource Mining</h1>
            <p className="text-xs text-white/60 mt-0.5">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = currentPage === item.name.toLowerCase()
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#EC5C29] text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            href="/lms"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-8 shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-slate-900 capitalize">
                {currentPage === 'dashboard' ? 'Admin Dashboard' : currentPage}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/lms"
                className="text-sm px-4 py-2 text-slate-600 hover:text-[#EC5C29] hover:bg-slate-50 rounded-lg transition-colors font-medium"
              >
                View as Learner
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
