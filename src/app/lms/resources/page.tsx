import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import LMSLayout from '@/components/lms/LMSLayout'
import Breadcrumbs from '@/components/lms/Breadcrumbs'
import { Card, CardContent } from '@/components/ui/card'
import { FileText } from 'lucide-react'

async function getResourcesData() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { org: { include: { settings: true } } },
  })

  if (!user) throw new Error('User not found')

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: user.id },
    include: {
      course: { include: { modules: { orderBy: { orderIndex: 'asc' } } } },
      moduleAttempts: { include: { module: true } },
      certificates: { where: { isActive: true }, orderBy: { issuedAt: 'desc' }, take: 1 },
    },
  })

  if (!enrollment) throw new Error('No enrollment found')

  const totalModules = enrollment.course.modules.length
  const completedModules = enrollment.moduleAttempts.filter((a) => a.passed).length
  const progressPercent = Math.round((completedModules / totalModules) * 100)
  const activeCert = enrollment.certificates[0]
  const certificateExpiryDays = activeCert
    ? Math.ceil((new Date(activeCert.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  const modules = enrollment.course.modules.map((module) => {
    const attempt = enrollment.moduleAttempts.find((a) => a.moduleId === module.id)
    const isCompleted = attempt?.passed || false
    const isLocked = user.org?.settings?.requireSequential && module.orderIndex > (enrollment.currentModuleIndex || 1)
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

  return {
    user,
    enrollmentData: {
      totalModules,
      completedModules,
      progressPercent,
      currentModuleIndex: enrollment.currentModuleIndex,
      certificateExpiryDays,
      modules,
    },
  }
}

export default async function ResourcesPage() {
  const { user, enrollmentData } = await getResourcesData()

  return (
    <LMSLayout user={user} enrollmentData={enrollmentData}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Breadcrumbs items={[{ label: 'Resources' }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#192135] flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#EC5C29]" />
            Learning Resources
          </h1>
          <p className="text-slate-600 mt-1">Access additional training materials and documentation</p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Resources Coming Soon</h3>
            <p className="text-slate-600">
              Training resources, documentation, and support materials will be available here.
            </p>
          </CardContent>
        </Card>
      </div>
    </LMSLayout>
  )
}
