import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

type BreadcrumbItem = {
  label: string
  href?: string
}

type Props = {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: Props) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
      <Link href="/lms" className="hover:text-[#EC5C29] transition-colors flex items-center gap-1">
        <Home className="w-4 h-4" />
        <span>Dashboard</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-slate-400" />
          {item.href && index < items.length - 1 ? (
            <Link href={item.href} className="hover:text-[#EC5C29] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
