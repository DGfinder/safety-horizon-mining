import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import BulkUserImport from '@/components/admin/BulkUserImport'

async function getImportData() {
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

  const sites = await prisma.site.findMany({
    where: { orgId: user.orgId! },
    include: { crews: true },
    orderBy: { name: 'asc' },
  })

  const courses = await prisma.course.findMany({
    where: { orgId: user.orgId! },
    orderBy: { title: 'asc' },
  })

  return { user, sites, courses }
}

export default async function BulkUserImportPage() {
  const { user, sites, courses } = await getImportData()

  return (
    <AdminLayout currentPage="users">
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Bulk User Import</h1>
          <p className="text-slate-600 mt-1">
            Import multiple users from CSV for quick onboarding
          </p>
        </div>

        <BulkUserImport sites={sites} courses={courses} orgId={user.orgId!} />
      </div>
    </AdminLayout>
  )
}
