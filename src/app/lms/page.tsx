import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Lock, PlayCircle, Trophy, Calendar, AlertCircle } from 'lucide-react'
import LMSLayout from '@/components/lms/LMSLayout'
import Breadcrumbs from '@/components/lms/Breadcrumbs'
import ContinueLearningCard from '@/components/lms/ContinueLearningCard'
import FloatingNextModule from '@/components/lms/FloatingNextModule'
import QuickStatsWidget from '@/components/lms/QuickStatsWidget'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import PerformanceDashboard from '@/components/visualizations/PerformanceDashboard'
import SafetyMetrics from '@/components/visualizations/SafetyMetrics'
import TrainingJourney from '@/components/visualizations/TrainingJourney'
import KPIRadar from '@/components/visualizations/KPIRadar'

async function getDashboardData() {
  // Get authenticated session
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Get user
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

  // Redirect admin users to admin dashboard (unless explicitly viewing learner view)
  if (user.role === 'ADMIN') {
    redirect('/admin')
  }

  // Get enrollment
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

  // Calculate average score for visualizations
  const passedAttempts = enrollment.moduleAttempts.filter((a) => a.passed && a.score !== null)
  const avgScore = passedAttempts.length > 0
    ? Math.round(passedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / passedAttempts.length)
    : 0

  return {
    user,
    enrollment,
    totalModules,
    completedModules,
    progressPercent,
    certificateExpiryDays,
    modules,
    avgScore,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  const { user, enrollment, totalModules, completedModules, progressPercent, certificateExpiryDays, modules, avgScore } = data

  const activeCert = enrollment.certificates[0]
  const daysUntilExpiry = certificateExpiryDays

  // Prepare data for sidebar
  const enrollmentData = {
    totalModules,
    completedModules,
    progressPercent,
    currentModuleIndex: enrollment.currentModuleIndex,
    certificateExpiryDays,
    modules,
  }

  // Find current incomplete module for Continue Learning card
  const currentModule = modules.find(m => m.orderIndex === enrollment.currentModuleIndex && !m.passed)
  const nextModule = modules.find(m => m.orderIndex === (enrollment.currentModuleIndex || 0) + 1 && !m.isLocked)

  return (
    <LMSLayout user={user} enrollmentData={enrollmentData}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 🎯 ABOVE THE FOLD - Most Important */}

        {/* Continue Learning Card - PRIMARY ACTION */}
        {currentModule && (
          <div className="mb-6">
            <ContinueLearningCard
              moduleTitle={currentModule.title}
              moduleNumber={currentModule.orderIndex}
              scenarioId={currentModule.scenarioId}
              moduleId={currentModule.id}
              progress={0}
            />
          </div>
        )}

        {/* Quick Stats - AT-A-GLANCE METRICS */}
        <div className="mb-8">
          <QuickStatsWidget
            progressPercent={progressPercent}
            completedModules={completedModules}
            totalModules={totalModules}
            avgScore={avgScore}
            certificateExpiryDays={certificateExpiryDays}
          />
        </div>

        {/* 📊 BELOW THE FOLD - Detailed Information */}

        {/* Certification Status */}
        <Card className="mb-8 border-l-4 border-l-[#EC5C29]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#EC5C29]" />
                  Certification Status
                </CardTitle>
                {activeCert ? (
                  <CardDescription className="mt-2">
                    {daysUntilExpiry && daysUntilExpiry > 30 ? (
                      <span className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        Current until {new Date(activeCert.expiresAt).toLocaleDateString()}
                      </span>
                    ) : daysUntilExpiry && daysUntilExpiry > 0 ? (
                      <span className="flex items-center gap-2 text-amber-600">
                        <AlertCircle className="w-4 h-4" />
                        Expires in {daysUntilExpiry} days - Recertification required
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        Expired - Recertification required
                      </span>
                    )}
                  </CardDescription>
                ) : (
                  <CardDescription className="mt-2 text-amber-600">
                    Complete all modules to earn your certificate
                  </CardDescription>
                )}
              </div>
              {activeCert && (
                <Link
                  href={`/certificates/${activeCert.serial}`}
                  className="px-4 py-2 bg-[#192135] text-white rounded-lg hover:bg-[#192135]/90 transition"
                >
                  View Certificate
                </Link>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{enrollment.course.title}</CardTitle>
            <CardDescription>{enrollment.course.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {completedModules} of {totalModules} modules completed
                  </span>
                  <span className="text-sm font-semibold">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-3" />
              </div>

              {enrollment.dueAt && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  Due: {new Date(enrollment.dueAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Safety Metrics */}
        <div className="mb-8">
          <SafetyMetrics
            completedModules={completedModules}
            totalModules={totalModules}
            avgScore={avgScore}
            certificateExpiryDays={certificateExpiryDays}
          />
        </div>

        {/* Performance Dashboard and Training Journey */}
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          <TrainingJourney
            modules={modules}
            currentModuleIndex={enrollment.currentModuleIndex}
            completedModules={completedModules}
            totalModules={totalModules}
          />
          <KPIRadar
            avgScore={avgScore}
            completedModules={completedModules}
            totalModules={totalModules}
          />
        </div>

        {/* Performance Charts */}
        {enrollment.moduleAttempts.length > 0 && (
          <div className="mb-8">
            <PerformanceDashboard
              data={{
                moduleAttempts: enrollment.moduleAttempts
              }}
            />
          </div>
        )}

        {/* Module List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Course Modules</h2>

          <div className="grid gap-4">
            {enrollment.course.modules.map((module) => {
              const attempt = enrollment.moduleAttempts.find((a) => a.moduleId === module.id)
              const isCompleted = attempt?.passed
              const isInProgress = attempt && !attempt.passed
              const isLocked =
                user.org?.settings?.requireSequential &&
                module.orderIndex > (enrollment.currentModuleIndex || 1)

              return (
                <Card
                  key={module.id}
                  className={`${
                    isCompleted ? 'border-green-200 bg-green-50/50' : ''
                  } ${isLocked ? 'opacity-60' : ''}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Status Icon */}
                        <div className="mt-1">
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : isLocked ? (
                            <Lock className="w-6 h-6 text-slate-400" />
                          ) : (
                            <PlayCircle className="w-6 h-6 text-[#EC5C29]" />
                          )}
                        </div>

                        {/* Module Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline">Module {module.orderIndex}</Badge>
                            {isCompleted && attempt && (
                              <Badge variant="default" className="bg-green-600">
                                Score: {attempt.score}%
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold mb-1">{module.title}</h3>
                          <p className="text-sm text-slate-600">{module.description}</p>

                          {isInProgress && (
                            <p className="text-sm text-amber-600 mt-2">In progress - retry to improve your score</p>
                          )}

                          {isLocked && (
                            <p className="text-sm text-slate-500 mt-2">
                              Complete Module {module.orderIndex - 1} to unlock
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div>
                        {isCompleted ? (
                          <Link
                            href={`/lms/modules/${module.id}`}
                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm"
                          >
                            Review
                          </Link>
                        ) : isLocked ? (
                          <button
                            disabled
                            className="px-4 py-2 bg-slate-200 text-slate-400 rounded-lg cursor-not-allowed text-sm"
                          >
                            Locked
                          </button>
                        ) : (
                          <Link
                            href={`/lms/modules/${module.id}`}
                            className="px-4 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#EC5C29]/90 transition text-sm font-semibold"
                          >
                            {isInProgress ? 'Retry' : 'Start'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Footer CTA */}
        {completedModules === totalModules && !activeCert && (
          <Card className="mt-8 border-[#EC5C29] bg-gradient-to-r from-[#EC5C29]/10 to-[#EC5C29]/5">
            <CardContent className="p-8 text-center">
              <Trophy className="w-16 h-16 text-[#EC5C29] mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
              <p className="text-slate-600 mb-6">
                You've completed all modules. Your certificate is being generated.
              </p>
              <button className="px-6 py-3 bg-[#192135] text-white rounded-lg hover:bg-[#192135]/90 transition font-semibold">
                Download Certificate
              </button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Floating Next Module Button */}
      {nextModule && (
        <FloatingNextModule
          moduleTitle={nextModule.title}
          moduleNumber={nextModule.orderIndex}
          scenarioId={nextModule.scenarioId}
          moduleId={nextModule.id}
        />
      )}
    </LMSLayout>
  )
}
