import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const decisionSchema = z.object({
  nodeKey: z.string(),
  choiceId: z.string(),
  score: z.number().min(0).max(100),
  kpiScores: z.record(z.number()),
  feedback: z.string(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const body = await request.json()
    const validatedData = decisionSchema.parse(body)

    // Verify attempt exists
    const attempt = await prisma.attempt.findUnique({
      where: { id: params.attemptId },
    })

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })
    }

    // Create decision
    const decision = await prisma.decision.create({
      data: {
        attemptId: params.attemptId,
        nodeKey: validatedData.nodeKey,
        choiceId: validatedData.choiceId,
        score: validatedData.score,
        kpiScores: validatedData.kpiScores,
        feedback: validatedData.feedback,
      },
    })

    return NextResponse.json(decision)
  } catch (error) {
    console.error('Error saving decision:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
