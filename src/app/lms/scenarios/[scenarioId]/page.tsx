import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import ScenarioPlayer from '@/components/scenario/ScenarioPlayer'
import LMSLayout from '@/components/lms/LMSLayout'
import { auth } from '@/auth'

async function getScenarioData(scenarioId: string, moduleId?: string) {
  // Get authenticated session
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

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
    where: { id: session.user.id },
    include: {
      org: {
        include: {
          settings: true,
        },
      },
    },
  })

  if (!user) throw new Error('User not found')

  // Get enrollment data for sidebar
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { orderIndex: 'asc' },
          },
        },
      },
      moduleAttempts: {
        include: {
          module: true,
        },
      },
      certificates: {
        where: { isActive: true },
        orderBy: { issuedAt: 'desc' },
        take: 1,
      },
    },
  })

  if (!enrollment) throw new Error('No enrollment found')

  // Calculate progress
  const totalModules = enrollment.course.modules.length
  const completedModules = enrollment.moduleAttempts.filter((a) => a.passed).length
  const progressPercent = Math.round((completedModules / totalModules) * 100)

  // Get active certificate
  const activeCert = enrollment.certificates[0]
  const certificateExpiryDays = activeCert
    ? Math.ceil((new Date(activeCert.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  // Prepare module data for sidebar
  const modules = enrollment.course.modules.map((module) => {
    const attempt = enrollment.moduleAttempts.find((a) => a.moduleId === module.id)
    const isCompleted = attempt?.passed || false
    const isLocked =
      user.org?.settings?.requireSequential &&
      module.orderIndex > (enrollment.currentModuleIndex || 1)

    return {
      id: module.id,
      title: module.title,
      orderIndex: module.orderIndex,
      description: module.description,
      scenarioId: module.scenarioId,
      passed: isCompleted,
      score: attempt?.score || null,
      isLocked: isLocked || false,
    }
  })

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

  const enrollmentData = {
    totalModules,
    completedModules,
    progressPercent,
    currentModuleIndex: enrollment.currentModuleIndex,
    certificateExpiryDays,
    modules,
  }

  return {
    scenario,
    attempt,
    user,
    module,
    enrollmentData,
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
    <LMSLayout user={data.user} enrollmentData={data.enrollmentData}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <ScenarioPlayer
          scenario={data.scenario}
          attempt={data.attempt}
          moduleId={searchParams.moduleId}
        />
      </div>
    </LMSLayout>
  )
}
