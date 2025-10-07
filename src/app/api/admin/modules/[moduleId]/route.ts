import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function PATCH(
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

    const data = await request.json()
    const {
      title,
      description,
      kind,
      courseId,
      orderIndex,
      required,
      passingScore,
    } = data

    const module = await prisma.module.update({
      where: { id: params.moduleId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(kind && { kind }),
        ...(courseId && { courseId }),
        ...(orderIndex && { orderIndex: parseInt(orderIndex) }),
        ...(required !== undefined && { required }),
        ...(passingScore && { passingScore }),
      },
    })

    return NextResponse.json(module)
  } catch (error) {
    console.error('Error updating module:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Delete related content sections first
    await prisma.contentSection.deleteMany({
      where: { moduleId: params.moduleId },
    })

    // Delete the module
    await prisma.module.delete({
      where: { id: params.moduleId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting module:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
