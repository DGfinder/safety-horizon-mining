import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import ScenarioBuilder from '@/components/admin/ScenarioBuilder'

async function getModuleData(moduleId: string) {
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

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      scenario: {
        include: {
          nodes: {
            orderBy: { nodeKey: 'asc' },
          },
        },
      },
    },
  })

  if (!module) {
    redirect('/admin/modules')
  }

  return { module, user }
}

export default async function ModuleScenarioPage({
  params,
}: {
  params: { moduleId: string }
}) {
  const { module } = await getModuleData(params.moduleId)

  return (
    <AdminLayout currentPage="modules">
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Edit Scenario</h1>
          <p className="text-slate-600 mt-1">{module.title}</p>
        </div>

        <ScenarioBuilder module={module} />
      </div>
    </AdminLayout>
  )
}
