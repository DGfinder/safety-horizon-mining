import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import ScenarioPlayer from '@/components/scenario/ScenarioPlayer'

// For MVP, hardcode user
const DEMO_USER_EMAIL = 'wayne@pilotmine.com.au'

async function getScenarioData(scenarioId: string, moduleId?: string) {
  const scenario = await prisma.scenario.findUnique({
    where: { id: scenarioId },
    include: {
      nodes: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!scenario) notFound()

  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
  })

  if (!user) throw new Error('User not found')

  // Create new attempt
  const attempt = await prisma.attempt.create({
    data: {
      scenarioId: scenario.id,
      userId: user.id,
    },
  })

  // Get module if provided
  const module = moduleId
    ? await prisma.module.findUnique({
        where: { id: moduleId },
      })
    : null

  return {
    scenario,
    attempt,
    user,
    module,
  }
}

export default async function ScenarioPage({
  params,
  searchParams,
}: {
  params: { scenarioId: string }
  searchParams: { moduleId?: string }
}) {
  const data = await getScenarioData(params.scenarioId, searchParams.moduleId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ScenarioPlayer
        scenario={data.scenario}
        attempt={data.attempt}
        moduleId={searchParams.moduleId}
      />
    </div>
  )
}
