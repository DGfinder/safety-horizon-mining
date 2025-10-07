import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import ScenarioGenerator from '@/components/admin/ScenarioGenerator'

async function getIncidentData(incidentId: string) {
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

  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
    include: {
      site: true,
      reportedBy: true,
    },
  })

  if (!incident) {
    redirect('/admin/incidents')
  }

  if (incident.scenarioCreated) {
    redirect(`/admin/incidents/${incidentId}`)
  }

  return { user, incident }
}

export default async function CreateScenarioFromIncidentPage({
  params,
}: {
  params: { incidentId: string }
}) {
  const { incident } = await getIncidentData(params.incidentId)

  return (
    <AdminLayout currentPage="incidents">
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Generate Training Scenario</h1>
          <p className="text-slate-600 mt-1">
            Convert incident <span className="font-mono text-sm">{incident.incidentNumber}</span> into interactive training
          </p>
        </div>

        <ScenarioGenerator incident={incident} />
      </div>
    </AdminLayout>
  )
}
