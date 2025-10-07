import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

async function getCertificateData(verificationCode: string) {
  const certificate = await prisma.certificate.findUnique({
    where: { verificationCode },
    include: {
      enrollment: {
        include: {
          user: true,
          course: true,
        },
      },
    },
  })

  return certificate
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: { verificationCode: string }
}) {
  const certificate = await getCertificateData(params.verificationCode)

  if (!certificate) {
    notFound()
  }

  const now = new Date()
  const isExpired = new Date(certificate.expiresAt) < now
  const isRevoked = certificate.revokedAt !== null
  const isValid = certificate.isActive && !isExpired && !isRevoked

  const daysUntilExpiry = Math.ceil(
    (new Date(certificate.expiresAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div
            className={`p-8 text-center ${
              isValid
                ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                : isExpired
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                  : 'bg-gradient-to-r from-red-500 to-red-700'
            }`}
          >
            {isValid ? (
              <>
                <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-white">Certificate Valid</h1>
                <p className="text-white/90 mt-2">This certification is authentic and current</p>
              </>
            ) : isExpired ? (
              <>
                <AlertTriangle className="w-16 h-16 text-white mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-white">Certificate Expired</h1>
                <p className="text-white/90 mt-2">This certification has expired</p>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-white mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-white">Certificate Revoked</h1>
                <p className="text-white/90 mt-2">This certification has been revoked</p>
              </>
            )}
          </div>

          {/* Certificate Details */}
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">
                {certificate.enrollment.user.name || certificate.enrollment.user.email}
              </h2>
              <p className="text-center text-slate-600 text-sm">
                {certificate.enrollment.user.email}
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 space-y-4">
              <div>
                <div className="text-sm font-semibold text-slate-600 mb-1">Course</div>
                <div className="text-lg text-slate-900">{certificate.enrollment.course.title}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-600 mb-1">Certificate No.</div>
                  <div className="font-mono text-sm text-slate-900">{certificate.serial}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-600 mb-1">Verification Code</div>
                  <div className="font-mono text-sm text-slate-900">
                    {certificate.verificationCode}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-600 mb-1">Issued</div>
                  <div className="text-slate-900">
                    {new Date(certificate.issuedAt).toLocaleDateString('en-AU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-600 mb-1">Expires</div>
                  <div
                    className={
                      isExpired
                        ? 'text-red-600 font-semibold'
                        : daysUntilExpiry <= 30
                          ? 'text-amber-600 font-semibold'
                          : 'text-slate-900'
                    }
                  >
                    {new Date(certificate.expiresAt).toLocaleDateString('en-AU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {isExpired && ' (Expired)'}
                    {!isExpired && daysUntilExpiry <= 30 && ` (${daysUntilExpiry} days left)`}
                  </div>
                </div>
              </div>

              {isRevoked && certificate.revokedReason && (
                <div className="border-t pt-4">
                  <div className="text-sm font-semibold text-red-600 mb-1">Revocation Reason</div>
                  <div className="text-sm text-slate-700">{certificate.revokedReason}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Revoked on{' '}
                    {new Date(certificate.revokedAt!).toLocaleDateString('en-AU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Status Summary */}
            <div
              className={`rounded-lg p-4 border-2 ${
                isValid
                  ? 'bg-emerald-50 border-emerald-200'
                  : isExpired
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {isValid ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : isExpired ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3
                    className={`font-semibold mb-1 ${
                      isValid
                        ? 'text-emerald-900'
                        : isExpired
                          ? 'text-amber-900'
                          : 'text-red-900'
                    }`}
                  >
                    {isValid
                      ? 'Certification Current'
                      : isExpired
                        ? 'Refresher Training Required'
                        : 'Certification Invalid'}
                  </h3>
                  <p
                    className={`text-sm ${
                      isValid
                        ? 'text-emerald-700'
                        : isExpired
                          ? 'text-amber-700'
                          : 'text-red-700'
                    }`}
                  >
                    {isValid &&
                      'This individual is currently certified in Crew Resource Management for Mining Operations.'}
                    {isExpired &&
                      'This certification has expired. The holder must complete refresher training to regain certification.'}
                    {isRevoked &&
                      'This certification has been revoked and is no longer valid for compliance purposes.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
            <p className="text-xs text-center text-slate-600">
              This verification page confirms the authenticity of this Safety Horizon Mining
              certificate.
              <br />
              For questions, contact your site administrator or visit safetyhorizon.training
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
