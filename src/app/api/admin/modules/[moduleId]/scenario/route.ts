import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
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

    const { meta, nodes } = await request.json()

    // Get the module
    const module = await prisma.module.findUnique({
      where: { id: params.moduleId },
    })

    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    // Create or update the scenario
    let scenario
    if (module.scenarioId) {
      // Update existing scenario
      scenario = await prisma.scenario.update({
        where: { id: module.scenarioId },
        data: {
          title: meta.title,
          slug: meta.slug,
          estimatedMinutes: meta.estimatedMinutes,
          difficulty: meta.difficulty,
          kpiFocus: meta.kpiFocus,
        },
      })

      // Delete existing nodes
      await prisma.scenarioNode.deleteMany({
        where: { scenarioId: scenario.id },
      })
    } else {
      // Create new scenario
      scenario = await prisma.scenario.create({
        data: {
          title: meta.title,
          slug: meta.slug,
          moduleNumber: module.orderIndex,
          estimatedMinutes: meta.estimatedMinutes,
          difficulty: meta.difficulty,
          kpiFocus: meta.kpiFocus,
          status: 'DRAFT',
        },
      })

      // Link scenario to module
      await prisma.module.update({
        where: { id: params.moduleId },
        data: { scenarioId: scenario.id },
      })
    }

    // Create new nodes
    for (const node of nodes) {
      await prisma.scenarioNode.create({
        data: {
          scenarioId: scenario.id,
          nodeKey: node.nodeKey,
          nodeType: node.nodeType,
          body: node.body,
        },
      })
    }

    return NextResponse.json({ success: true, scenarioId: scenario.id })
  } catch (error) {
    console.error('Error saving scenario:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
