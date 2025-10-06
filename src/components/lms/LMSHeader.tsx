'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { signOut } from 'next-auth/react'

type Props = {
  user?: {
    id: string
    name: string | null
    email: string
    role: string
    org?: {
      name: string
    } | null
  }
  progressPercent?: number
  notificationCount?: number
  onSearchClick?: () => void
}

const navigationTabs = [
  { label: 'Dashboard', href: '/lms' },
  { label: 'Certificates', href: '/lms/certificates' },
  { label: 'Analytics', href: '/lms/analytics' },
  { label: 'Resources', href: '/lms/resources' },
]

export default function LMSHeader({ user, progressPercent = 0, notificationCount = 0, onSearchClick }: Props) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#192135] text-white shadow-lg">
      <div className="flex h-16 items-center px-4 lg:px-6">
        {/* Logo & Brand */}
        <Link href="/lms" className="flex items-center gap-2 mr-6">
          <img src="/img/logo.svg" alt="Crew Resource Mining" className="h-8 w-auto" />
          <span className="hidden md:block font-bold text-sm">Crew Resource Mining</span>
        </Link>

        {/* Main Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 flex-1">
          {navigationTabs.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg transition-colors
                  ${isActive
                    ? 'bg-[#EC5C29] text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearchClick}
            className="text-slate-300 hover:text-white hover:bg-white/10"
            title="Search (Cmd+K)"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-300 hover:text-white hover:bg-white/10"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white">
              <DropdownMenuLabel className="text-slate-900">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notificationCount > 0 ? (
                <div className="p-4 text-sm text-slate-600 text-center">
                  No new notifications
                </div>
              ) : (
                <div className="p-4 text-sm text-slate-600 text-center">
                  No new notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 hover:bg-white/10"
                >
                  {/* Mini Progress Ring */}
                  <div className="relative w-8 h-8">
                    <svg className="w-8 h-8 -rotate-90">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-white/20"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 14}`}
                        strokeDashoffset={`${2 * Math.PI * 14 * (1 - progressPercent / 100)}`}
                        className="text-[#EC5C29] transition-all duration-500"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                      {progressPercent}
                    </div>
                  </div>

                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white">{user.name || 'User'}</p>
                    <p className="text-xs text-slate-400">{user.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <DropdownMenuLabel className="text-slate-900">
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-slate-500 font-normal">{user.email}</p>
                    {user.org && (
                      <p className="text-xs text-slate-500 font-normal mt-1">{user.org.name}</p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/lms/profile" className="flex items-center cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/lms/settings" className="flex items-center cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu - Bottom Sheet Style */}
      <nav className="lg:hidden border-t border-white/10 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        {navigationTabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors
                ${isActive
                  ? 'bg-[#EC5C29] text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
