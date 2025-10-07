import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import LMSLayout from '@/components/lms/LMSLayout'
import ContentSectionPlayer from '@/components/lms/ContentSectionPlayer'
import { auth } from '@/auth'

async function getModuleData(moduleId: string) {
  // Get authenticated session
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      contentSections: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  })

  if (!module) notFound()

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
      contentSectionCompletions: {
        where: {
          contentSection: {
            moduleId: moduleId,
          },
        },
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
  const modules = enrollment.course.modules.map((m) => {
    const attempt = enrollment.moduleAttempts.find((a) => a.moduleId === m.id)
    const isCompleted = attempt?.passed || false
    const isLocked =
      user.org?.settings?.requireSequential &&
      m.orderIndex > (enrollment.currentModuleIndex || 1)

    return {
      id: m.id,
      title: m.title,
      orderIndex: m.orderIndex,
      description: m.description,
      scenarioId: m.scenarioId,
      passed: isCompleted,
      score: attempt?.score || null,
      isLocked: isLocked || false,
    }
  })

  return {
    user,
    module,
    enrollment,
    totalModules,
    completedModules,
    progressPercent,
    certificateExpiryDays,
    modules,
  }
}

interface PageProps {
  params: Promise<{ moduleId: string }>
}

export default async function ModulePage({ params }: PageProps) {
  const { moduleId } = await params
  const data = await getModuleData(moduleId)
  const { user, module, enrollment, totalModules, completedModules, progressPercent, certificateExpiryDays, modules } = data

  // Prepare data for sidebar
  const enrollmentData = {
    totalModules,
    completedModules,
    progressPercent,
    currentModuleIndex: enrollment.currentModuleIndex,
    certificateExpiryDays,
    modules,
  }

  // Handle HYBRID modules - show content sections first
  if (module.kind === 'HYBRID' && module.contentSections.length > 0) {
    return (
      <LMSLayout user={user} enrollmentData={enrollmentData}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <ContentSectionPlayer
            sections={module.contentSections.map(section => ({
              id: section.id,
              orderIndex: section.orderIndex,
              title: section.title,
              subtitle: section.subtitle || undefined,
              sectionType: section.sectionType,
              content: section.content as any, // Type assertion for JSON
              estimatedMinutes: section.estimatedMinutes,
            }))}
            moduleTitle={module.title}
            onComplete={() => {
              // Redirect to scenario after content completion
              if (module.scenarioId) {
                window.location.href = `/lms/scenarios/${module.scenarioId}?moduleId=${module.id}`
              }
            }}
            onSectionComplete={(sectionId) => {
              // Track section completion
              fetch('/api/lms/content-sections/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  enrollmentId: enrollment.id,
                  sectionId: sectionId,
                }),
              })
            }}
          />
        </div>
      </LMSLayout>
    )
  }

  // For non-HYBRID modules, redirect to scenario if it exists
  if (module.scenarioId) {
    redirect(`/lms/scenarios/${module.scenarioId}?moduleId=${module.id}`)
  }

  // If no scenario and no content sections, show error
  return (
    <LMSLayout user={user} enrollmentData={enrollmentData}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-amber-900 mb-2">Module Not Available</h2>
          <p className="text-amber-800">This module does not have any content configured yet.</p>
        </div>
      </div>
    </LMSLayout>
  )
}
