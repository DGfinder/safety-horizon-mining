import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { generateCertificatePDF } from '@/lib/pdf'
import archiver from 'archiver'
import { Readable } from 'stream'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { filters } = await request.json()

    // Build certificate query based on filters
    const whereClause: any = {
      isActive: true,
    }

    if (filters.siteId) {
      whereClause.enrollment = {
        user: {
          siteId: filters.siteId,
        },
      }
    }

    if (filters.courseId) {
      whereClause.enrollment = {
        ...whereClause.enrollment,
        courseId: filters.courseId,
      }
    }

    if (filters.onlyValid) {
      whereClause.expiresAt = {
        gte: new Date(),
      }
    }

    // Get certificates
    const certificates = await prisma.certificate.findMany({
      where: whereClause,
      include: {
        enrollment: {
          include: {
            user: true,
            course: true,
          },
        },
      },
      take: 500, // Limit to prevent timeout
    })

    if (certificates.length === 0) {
      return NextResponse.json({ error: 'No certificates found' }, { status: 404 })
    }

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    })

    const chunks: Buffer[] = []
    archive.on('data', (chunk) => chunks.push(chunk))

    // Generate PDFs and add to archive
    for (const cert of certificates) {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${cert.verificationCode}`

      const pdfBuffer = await generateCertificatePDF({
        userName: cert.enrollment.user.name || cert.enrollment.user.email,
        courseName: cert.enrollment.course.title,
        serialNumber: cert.serial,
        issuedAt: cert.issuedAt,
        expiresAt: cert.expiresAt,
        verificationCode: cert.verificationCode,
        verificationUrl,
      })

      // Create filename: LastName_FirstName_CRM-2025-001234.pdf
      const userName = cert.enrollment.user.name || cert.enrollment.user.email.split('@')[0]
      const sanitizedName = userName.replace(/[^a-zA-Z0-9]/g, '_')
      const filename = `${sanitizedName}_${cert.serial}.pdf`

      archive.append(pdfBuffer, { name: filename })
    }

    // Finalize archive
    await archive.finalize()

    const zipBuffer = Buffer.concat(chunks)

    // Return ZIP file
    const timestamp = new Date().toISOString().split('T')[0]
    const siteName = filters.siteId ? 'site' : 'all'
    const filename = `certificates_${siteName}_${timestamp}.zip`

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error generating bulk certificates:', error)
    return NextResponse.json(
      { error: 'Failed to generate certificates' },
      { status: 500 }
    )
  }
}
