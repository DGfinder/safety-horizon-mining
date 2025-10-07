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

    const { incidentId, scenario } = await request.json()

    // Get incident
    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
      include: { site: { include: { org: true } } },
    })

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 })
    }

    if (incident.scenarioCreated) {
      return NextResponse.json({ error: 'Scenario already created for this incident' }, { status: 400 })
    }

    // Get or create default course
    let course = await prisma.course.findFirst({
      where: { orgId: incident.site.org.id },
    })

    if (!course) {
      course = await prisma.course.create({
        data: {
          orgId: incident.site.org.id,
          slug: 'crm-mining',
          title: 'Crew Resource Management for Mining',
          status: 'PUBLISHED',
        },
      })
    }

    // Get next module number
    const maxModule = await prisma.module.findFirst({
      where: { courseId: course.id },
      orderBy: { orderIndex: 'desc' },
    })
    const nextModuleNumber = (maxModule?.orderIndex || 0) + 1

    // Create scenario
    const createdScenario = await prisma.scenario.create({
      data: {
        slug: scenario.slug,
        title: scenario.title,
        moduleNumber: nextModuleNumber,
        estimatedMinutes: scenario.estimatedMinutes,
        difficulty: scenario.difficulty,
        kpiFocus: scenario.kpiFocus,
        status: 'DRAFT',
      },
    })

    // Create scenario nodes
    await Promise.all(
      scenario.nodes.map((node: any) =>
        prisma.scenarioNode.create({
          data: {
            scenarioId: createdScenario.id,
            nodeKey: node.nodeKey,
            nodeType: node.nodeType,
            body: node.body,
          },
        })
      )
    )

    // Create module
    const module = await prisma.module.create({
      data: {
        courseId: course.id,
        orderIndex: nextModuleNumber,
        title: scenario.title,
        description: `Training scenario generated from incident ${incident.incidentNumber}`,
        kind: 'SCENARIO',
        scenarioId: createdScenario.id,
        required: true,
        passingScore: 70,
      },
    })

    // Update incident to mark scenario as created
    await prisma.incident.update({
      where: { id: incidentId },
      data: {
        scenarioCreated: true,
        generatedScenarioId: createdScenario.id,
      },
    })

    return NextResponse.json({
      success: true,
      scenarioId: createdScenario.id,
      moduleId: module.id,
    })
  } catch (error) {
    console.error('Error generating scenario:', error)
    return NextResponse.json(
      { error: 'Failed to generate scenario' },
      { status: 500 }
    )
  }
}
