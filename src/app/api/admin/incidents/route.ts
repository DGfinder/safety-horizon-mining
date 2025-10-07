import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

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

    const body = await request.json()

    const incident = await prisma.incident.create({
      data: {
        siteId: body.siteId,
        incidentNumber: body.incidentNumber,
        title: body.title,
        description: body.description,
        incidentDate: new Date(body.incidentDate),
        reportedById: body.reportedById,
        severity: body.severity,
        category: body.category,
        incidentType: body.incidentType || [],
        location: body.location,
        equipment: body.equipment || null,
        rootCause: body.rootCause || null,
        contributingFactors: body.contributingFactors || [],
        correctiveActions: body.correctiveActions || [],
        keyLessons: body.keyLessons || [],
        kpiAreasAffected: body.kpiAreasAffected || [],
        investigationStatus: 'REPORTED',
      },
    })

    return NextResponse.json({ success: true, incident })
  } catch (error) {
    console.error('Error creating incident:', error)
    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERVISOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const incidents = await prisma.incident.findMany({
      where: { site: { orgId: user.orgId! } },
      include: {
        site: true,
        reportedBy: true,
        generatedScenario: true,
      },
      orderBy: { incidentDate: 'desc' },
    })

    return NextResponse.json({ incidents })
  } catch (error) {
    console.error('Error fetching incidents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    )
  }
}
