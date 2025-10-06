'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="text-6xl font-bold text-[#EC5C29] mb-4">404</div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription className="text-base">
            The page you're looking for doesn't exist or has been moved
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#EC5C29]/90 transition font-semibold"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-[#EC5C29] text-[#EC5C29] rounded-lg hover:bg-[#EC5C29] hover:text-white transition font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
