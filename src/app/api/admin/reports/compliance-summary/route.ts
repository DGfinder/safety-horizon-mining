import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'
    const siteId = searchParams.get('siteId')

    // Build query filters
    const userFilter: any = { orgId: user.orgId }
    if (siteId) {
      userFilter.siteId = siteId
    }

    // Get all users in the org/site
    const users = await prisma.user.findMany({
      where: userFilter,
      include: {
        site: true,
        crew: true,
        enrollments: {
          include: {
            course: true,
            moduleAttempts: {
              include: { module: true },
              where: { passed: true },
            },
            certificates: {
              where: { isActive: true },
              orderBy: { issuedAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: [{ name: 'asc' }, { email: 'asc' }],
    })

    // Calculate compliance data
    const complianceData = users.map((user) => {
      const enrollment = user.enrollments[0]
      const cert = enrollment?.certificates[0]

      let status = 'NOT_ENROLLED'
      let progressPercent = 0
      let daysUntilExpiry: number | null = null

      if (enrollment) {
        status = enrollment.status
        const totalModules = 12 // Default course length
        const completedModules = enrollment.moduleAttempts.length
        progressPercent = Math.round((completedModules / totalModules) * 100)

        if (cert) {
          daysUntilExpiry = Math.ceil(
            (new Date(cert.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          )
        }
      }

      return {
        employeeId: user.employeeId || '',
        name: user.name || user.email,
        email: user.email,
        jobTitle: user.jobTitle || '',
        department: user.department || '',
        site: user.site?.name || '',
        crew: user.crew?.name || '',
        status,
        progressPercent,
        certificateSerial: cert?.serial || '',
        certificateIssued: cert?.issuedAt.toISOString().split('T')[0] || '',
        certificateExpires: cert?.expiresAt.toISOString().split('T')[0] || '',
        daysUntilExpiry: daysUntilExpiry?.toString() || '',
        isCompliant: status === 'COMPLETED' && daysUntilExpiry && daysUntilExpiry > 0,
      }
    })

    // Return as JSON
    if (format === 'json') {
      return NextResponse.json({
        reportDate: new Date().toISOString(),
        organizationId: user.orgId,
        totalUsers: complianceData.length,
        compliantUsers: complianceData.filter((d) => d.isCompliant).length,
        data: complianceData,
      })
    }

    // Return as CSV
    if (format === 'csv') {
      const headers = [
        'Employee ID',
        'Name',
        'Email',
        'Job Title',
        'Department',
        'Site',
        'Crew',
        'Status',
        'Progress %',
        'Certificate Serial',
        'Issued Date',
        'Expiry Date',
        'Days Until Expiry',
        'Compliant',
      ]

      const rows = complianceData.map((d) => [
        d.employeeId,
        d.name,
        d.email,
        d.jobTitle,
        d.department,
        d.site,
        d.crew,
        d.status,
        d.progressPercent.toString(),
        d.certificateSerial,
        d.certificateIssued,
        d.certificateExpires,
        d.daysUntilExpiry,
        d.isCompliant ? 'Yes' : 'No',
      ])

      const csv = [
        headers.join(','),
        ...rows.map((row) =>
          row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="compliance-summary-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 })
  } catch (error) {
    console.error('Error generating compliance report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}
