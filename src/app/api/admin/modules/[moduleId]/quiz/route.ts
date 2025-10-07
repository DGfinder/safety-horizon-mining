import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: Request,
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

    const { moduleId } = params
    const { questions, passingScore } = await request.json()

    // Verify module exists
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    })

    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    // Update module with quiz data
    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: {
        quizData: { questions },
        passingScore,
      },
    })

    return NextResponse.json({
      success: true,
      module: updatedModule,
    })
  } catch (error) {
    console.error('Error saving quiz:', error)
    return NextResponse.json(
      { error: 'Failed to save quiz' },
      { status: 500 }
    )
  }
}
