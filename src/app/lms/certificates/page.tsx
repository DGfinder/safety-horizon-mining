import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import LMSLayout from '@/components/lms/LMSLayout'
import Breadcrumbs from '@/components/lms/Breadcrumbs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Award, Calendar, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

async function getCertificatesData() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

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
        orderBy: { issuedAt: 'desc' },
      },
    },
  })

  if (!enrollment) throw new Error('No enrollment found')

  // Calculate progress for sidebar
  const totalModules = enrollment.course.modules.length
  const completedModules = enrollment.moduleAttempts.filter((a) => a.passed).length
  const progressPercent = Math.round((completedModules / totalModules) * 100)

  const activeCert = enrollment.certificates.find(c => c.isActive)
  const certificateExpiryDays = activeCert
    ? Math.ceil((new Date(activeCert.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

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

  return {
    user,
    certificates: enrollment.certificates,
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

export default async function CertificatesPage() {
  const { user, certificates, enrollmentData } = await getCertificatesData()

  const activeCerts = certificates.filter(c => c.isActive)
  const expiredCerts = certificates.filter(c => !c.isActive || new Date(c.expiresAt) < new Date())

  return (
    <LMSLayout user={user} enrollmentData={enrollmentData}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Certificates' }]} />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#192135] flex items-center gap-3">
            <Award className="w-8 h-8 text-[#EC5C29]" />
            My Certificates
          </h1>
          <p className="text-slate-600 mt-1">View and download your training certificates</p>
        </div>

        {/* Active Certificates */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Active Certificates</h2>

          {activeCerts.length > 0 ? (
            <div className="grid gap-4">
              {activeCerts.map((cert) => {
                const daysUntilExpiry = Math.ceil((new Date(cert.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                const isExpiringSoon = daysUntilExpiry < 45

                return (
                  <Card
                    key={cert.id}
                    className={`border-l-4 ${
                      isExpiringSoon ? 'border-l-amber-500 bg-amber-50/50' : 'border-l-green-500 bg-green-50/50'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className={`w-5 h-5 ${isExpiringSoon ? 'text-amber-600' : 'text-green-600'}`} />
                            Crew Resource Management Certificate
                          </CardTitle>
                          <CardDescription className="mt-2">
                            <div className="space-y-1">
                              <p className="flex items-center gap-2">
                                <span className="font-semibold">Certificate ID:</span>
                                <code className="text-xs bg-white px-2 py-1 rounded">{cert.serial}</code>
                              </p>
                              <p className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                              </p>
                              <p className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Expires: {new Date(cert.expiresAt).toLocaleDateString()}
                              </p>
                            </div>
                          </CardDescription>
                        </div>

                        <div className="text-right">
                          {isExpiringSoon ? (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 mb-2">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Expires in {daysUntilExpiry} days
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 mb-2">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          )}
                          <div className="mt-4">
                            {cert.pdfUrl ? (
                              <a
                                href={cert.pdfUrl}
                                download
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#192135] text-white rounded-lg hover:bg-[#192135]/90 transition text-sm"
                              >
                                <Download className="w-4 h-4" />
                                Download PDF
                              </a>
                            ) : (
                              <button
                                disabled
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-400 rounded-lg cursor-not-allowed text-sm"
                              >
                                <Download className="w-4 h-4" />
                                Generating...
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Active Certificates</h3>
                <p className="text-slate-600 mb-6">
                  Complete all training modules to earn your certificate
                </p>
                <Link
                  href="/lms"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#EC5C29] text-white rounded-lg hover:bg-[#EC5C29]/90 transition"
                >
                  Go to Training
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Certificate History */}
        {expiredCerts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Certificate History</h2>
            <div className="grid gap-4">
              {expiredCerts.map((cert) => (
                <Card key={cert.id} className="border-l-4 border-l-slate-300 opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-slate-600">
                          <XCircle className="w-5 h-5" />
                          Crew Resource Management Certificate
                        </CardTitle>
                        <CardDescription className="mt-2">
                          <div className="space-y-1">
                            <p className="flex items-center gap-2">
                              <span className="font-semibold">Certificate ID:</span>
                              <code className="text-xs bg-white px-2 py-1 rounded">{cert.serial}</code>
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Expired: {new Date(cert.expiresAt).toLocaleDateString()}
                            </p>
                            {cert.revokedAt && (
                              <p className="text-red-600 text-sm mt-2">
                                Revoked: {cert.revokedReason || 'No reason provided'}
                              </p>
                            )}
                          </div>
                        </CardDescription>
                      </div>

                      <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-300">
                        Expired
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </LMSLayout>
  )
}
