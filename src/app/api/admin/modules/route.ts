import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!title || !description || !kind || !courseId || !orderIndex) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the module
    const module = await prisma.module.create({
      data: {
        title,
        description,
        kind,
        courseId,
        orderIndex: parseInt(orderIndex),
        required: required ?? true,
        passingScore: passingScore || 70,
      },
    })

    return NextResponse.json(module, { status: 201 })
  } catch (error) {
    console.error('Error creating module:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
