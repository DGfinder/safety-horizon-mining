import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import ApiDocumentation from '@/components/admin/ApiDocumentation'

async function getApiData() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user || user.role !== 'ADMIN') {
    redirect('/lms')
  }

  // Get API keys (if we implement them)
  // For now, we'll use session-based auth

  return { user }
}

export default async function ApiDocsPage() {
  await getApiData()

  return (
    <AdminLayout currentPage="api-docs">
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">API Documentation</h1>
          <p className="text-slate-600 mt-1">
            Integrate Safety Horizon with your existing systems
          </p>
        </div>

        <ApiDocumentation />
      </div>
    </AdminLayout>
  )
}
