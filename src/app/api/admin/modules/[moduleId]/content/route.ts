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

    const { sections } = await request.json()

    // Delete existing sections
    await prisma.contentSection.deleteMany({
      where: { moduleId: params.moduleId },
    })

    // Create new sections
    for (const section of sections) {
      // Skip temporary IDs and create new sections
      await prisma.contentSection.create({
        data: {
          moduleId: params.moduleId,
          orderIndex: section.orderIndex,
          title: section.title,
          blocks: section.blocks || [],
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
