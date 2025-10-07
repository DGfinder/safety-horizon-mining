import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { enrollmentId, sectionId } = await req.json()

    if (!enrollmentId || !sectionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if completion already exists
    const existing = await prisma.contentSectionCompletion.findFirst({
      where: {
        enrollmentId,
        sectionId,
      },
    })

    if (existing) {
      return NextResponse.json({ message: 'Already completed', completion: existing })
    }

    // Create completion record
    const completion = await prisma.contentSectionCompletion.create({
      data: {
        enrollmentId,
        sectionId,
      },
    })

    return NextResponse.json({ message: 'Section completed', completion })
  } catch (error) {
    console.error('Error completing section:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
