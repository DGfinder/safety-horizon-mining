import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import ModuleForm from '@/components/admin/ModuleForm'

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
  })

  if (!module) {
    redirect('/admin/modules')
  }

  const courses = await prisma.course.findMany({
    orderBy: { title: 'asc' },
  })

  return { module, courses, user }
}

export default async function EditModulePage({
  params,
}: {
  params: { moduleId: string }
}) {
  const { module, courses } = await getModuleData(params.moduleId)

  return (
    <AdminLayout currentPage="modules">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Edit Module</h1>
          <p className="text-slate-600 mt-1">Update module settings and metadata</p>
        </div>

        <ModuleForm
          courses={courses}
          initialData={{
            id: module.id,
            title: module.title,
            description: module.description,
            kind: module.kind,
            courseId: module.courseId,
            orderIndex: module.orderIndex,
            required: module.required,
            passingScore: module.passingScore,
          }}
        />
      </div>
    </AdminLayout>
  )
}
