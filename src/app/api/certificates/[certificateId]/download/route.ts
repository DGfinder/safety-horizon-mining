import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { generateCertificatePDF } from '@/lib/pdf'

export async function GET(
  request: Request,
  { params }: { params: { certificateId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get certificate with enrollment and user data
    const certificate = await prisma.certificate.findUnique({
      where: { id: params.certificateId },
      include: {
        enrollment: {
          include: {
            user: true,
            course: true,
          },
        },
      },
    })

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    // Verify user owns this certificate or is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (
      certificate.enrollment.user.id !== session.user.id &&
      user?.role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Generate PDF
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${certificate.verificationCode}`

    const pdfBuffer = await generateCertificatePDF({
      userName: certificate.enrollment.user.name || certificate.enrollment.user.email,
      courseName: certificate.enrollment.course.title,
      serialNumber: certificate.serial,
      issuedAt: certificate.issuedAt,
      expiresAt: certificate.expiresAt,
      verificationCode: certificate.verificationCode,
      verificationUrl,
    })

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${certificate.serial}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating certificate PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    )
  }
}
