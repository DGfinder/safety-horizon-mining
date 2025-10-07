import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import ModuleForm from '@/components/admin/ModuleForm'

async function checkAdminAccess() {
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

  return user
}

async function getCourses() {
  return await prisma.course.findMany({
    orderBy: { title: 'asc' },
  })
}

export default async function NewModulePage() {
  await checkAdminAccess()
  const courses = await getCourses()

  return (
    <AdminLayout currentPage="modules">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Create New Module</h1>
          <p className="text-slate-600 mt-1">Define the module type and basic information</p>
        </div>

        <ModuleForm courses={courses} />
      </div>
    </AdminLayout>
  )
}
