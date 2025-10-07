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

    // Get the module to duplicate with all its content
    const originalModule = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        contentSections: true,
      },
    })

    if (!originalModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    // Find the highest orderIndex in the same course
    const maxOrderModule = await prisma.module.findFirst({
      where: { courseId: originalModule.courseId },
      orderBy: { orderIndex: 'desc' },
    })

    const newOrderIndex = (maxOrderModule?.orderIndex || 0) + 1

    // Create the duplicate module
    const duplicatedModule = await prisma.module.create({
      data: {
        courseId: originalModule.courseId,
        orderIndex: newOrderIndex,
        title: `${originalModule.title} (Copy)`,
        description: originalModule.description,
        kind: originalModule.kind,
        videoUrl: originalModule.videoUrl,
        policyDocUrl: originalModule.policyDocUrl,
        quizData: originalModule.quizData,
        required: originalModule.required,
        passingScore: originalModule.passingScore,
        // Note: We don't duplicate the scenario, just create a new empty module
        // If you want to duplicate scenarios too, that requires more complex logic
      },
    })

    // Duplicate content sections
    if (originalModule.contentSections.length > 0) {
      await Promise.all(
        originalModule.contentSections.map((section) =>
          prisma.contentSection.create({
            data: {
              moduleId: duplicatedModule.id,
              orderIndex: section.orderIndex,
              title: section.title,
              subtitle: section.subtitle,
              sectionType: section.sectionType,
              content: section.content,
              estimatedMinutes: section.estimatedMinutes,
            },
          })
        )
      )
    }

    return NextResponse.json({
      success: true,
      module: duplicatedModule,
    })
  } catch (error) {
    console.error('Error duplicating module:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate module' },
      { status: 500 }
    )
  }
}
