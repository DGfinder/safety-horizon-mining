import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { sendCertificateIssued } from '@/lib/email'

const completeSchema = z.object({
  passed: z.boolean(),
  totalScore: z.number().min(0).max(100),
  kpiScores: z.record(z.number()),
  moduleId: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const body = await request.json()
    const validatedData = completeSchema.parse(body)

    // Get attempt with user and enrollment
    const attempt = await prisma.attempt.findUnique({
      where: { id: params.attemptId },
      include: {
        user: {
          include: {
            enrollments: {
              include: {
                course: {
                  include: {
                    modules: {
                      orderBy: { orderIndex: 'asc' },
                    },
                  },
                },
              },
            },
          },
        },
        scenario: true,
      },
    })

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })
    }

    // Update attempt
    await prisma.attempt.update({
      where: { id: params.attemptId },
      data: {
        finishedAt: new Date(),
        totalScore: validatedData.totalScore,
        kpiScores: validatedData.kpiScores,
        passed: validatedData.passed,
      },
    })

    // If moduleId provided, create/update module attempt
    if (validatedData.moduleId) {
      const module = await prisma.module.findUnique({
        where: { id: validatedData.moduleId },
      })

      if (!module) {
        return NextResponse.json({ error: 'Module not found' }, { status: 404 })
      }

      // Find enrollment
      const enrollment = attempt.user.enrollments.find(
        (e) => e.courseId === module.courseId
      )

      if (!enrollment) {
        return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
      }

      // Count existing attempts for this module
      const attemptNumber =
        (await prisma.moduleAttempt.count({
          where: {
            enrollmentId: enrollment.id,
            moduleId: validatedData.moduleId,
          },
        })) + 1

      // Create module attempt
      const moduleAttempt = await prisma.moduleAttempt.create({
        data: {
          enrollmentId: enrollment.id,
          moduleId: validatedData.moduleId,
          attemptNumber,
          status: validatedData.passed ? 'COMPLETED' : 'FAILED',
          score: validatedData.totalScore,
          kpiScores: validatedData.kpiScores,
          passed: validatedData.passed,
          scenarioAttemptId: params.attemptId,
          completedAt: new Date(),
          feedback: `Scenario completed with ${validatedData.totalScore}% score.`,
        },
      })

      // If passed, update enrollment progress
      if (validatedData.passed) {
        const completedModules = await prisma.moduleAttempt.count({
          where: {
            enrollmentId: enrollment.id,
            passed: true,
          },
        })

        const totalModules = await prisma.module.count({
          where: { courseId: module.courseId },
        })

        const allCompleted = completedModules >= totalModules

        // Update enrollment
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: {
            status: allCompleted ? 'COMPLETED' : 'IN_PROGRESS',
            currentModuleIndex: module.orderIndex + 1,
            completedAt: allCompleted ? new Date() : null,
          },
        })

        // If all completed, generate certificate
        if (allCompleted) {
          const existingCert = await prisma.certificate.findFirst({
            where: {
              enrollmentId: enrollment.id,
              isActive: true,
            },
          })

          if (!existingCert) {
            const year = new Date().getFullYear()
            const serial = `CRM-${year}-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`
            const verificationCode = `${Math.random().toString(36).substring(2, 10).toUpperCase()}`

            // Get cert validity from org settings
            const orgSettings = await prisma.orgSettings.findUnique({
              where: { orgId: attempt.user.orgId! },
            })

            const validityMonths = orgSettings?.certValidityMonths || 12
            const expiresAt = new Date()
            expiresAt.setMonth(expiresAt.getMonth() + validityMonths)

            const newCertificate = await prisma.certificate.create({
              data: {
                enrollmentId: enrollment.id,
                serial,
                verificationCode,
                expiresAt,
              },
            })

            // Send certificate email notification
            try {
              const certificateUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/certificates/${newCertificate.id}/download`

              await sendCertificateIssued({
                to: attempt.user.email,
                name: attempt.user.name || attempt.user.email,
                courseName: enrollment.course.title,
                certificateUrl,
                expiresAt: newCertificate.expiresAt,
              })

              // Log the email
              await prisma.emailLog.create({
                data: {
                  userId: attempt.user.id,
                  emailType: 'CERTIFICATE_ISSUED',
                  certificateId: newCertificate.id,
                  metadata: {
                    courseName: enrollment.course.title,
                    serial: newCertificate.serial,
                  },
                },
              })
            } catch (emailError) {
              console.error('Failed to send certificate email:', emailError)
              // Don't fail the completion if email fails
            }
          }
        }
      }

      return NextResponse.json({
        success: true,
        attempt: {
          id: attempt.id,
          totalScore: validatedData.totalScore,
          passed: validatedData.passed,
        },
        moduleAttempt,
      })
    }

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        totalScore: validatedData.totalScore,
        passed: validatedData.passed,
      },
    })
  } catch (error) {
    console.error('Error completing attempt:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
