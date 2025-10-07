import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import ContentBuilder from '@/components/admin/ContentBuilder'

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
      contentSections: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  })

  if (!module) {
    redirect('/admin/modules')
  }

  return { module, user }
}

export default async function ModuleContentPage({
  params,
}: {
  params: { moduleId: string }
}) {
  const { module } = await getModuleData(params.moduleId)

  return (
    <AdminLayout currentPage="modules">
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Edit Module Content</h1>
          <p className="text-slate-600 mt-1">{module.title}</p>
        </div>

        <ContentBuilder module={module} />
      </div>
    </AdminLayout>
  )
}
