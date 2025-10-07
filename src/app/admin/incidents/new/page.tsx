import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import IncidentForm from '@/components/admin/IncidentForm'

async function getFormData() {
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
    orderBy: { name: 'asc' },
  })

  return { user, sites }
}

export default async function NewIncidentPage() {
  const { user, sites } = await getFormData()

  return (
    <AdminLayout currentPage="incidents">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Report New Incident</h1>
          <p className="text-slate-600 mt-1">
            Document incidents to create targeted safety training
          </p>
        </div>

        <IncidentForm sites={sites} userId={user.id} />
      </div>
    </AdminLayout>
  )
}
