import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { sendWelcomeEmail } from '@/lib/email'

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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const orgId = formData.get('orgId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Read CSV file
    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())

    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 })
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim())
    const requiredHeaders = ['email']
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))

    if (missingHeaders.length > 0) {
      return NextResponse.json({
        error: `Missing required columns: ${missingHeaders.join(', ')}`,
      }, { status: 400 })
    }

    // Parse rows
    const errors: string[] = []
    let created = 0
    let enrolled = 0

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      try {
        const values = line.split(',').map(v => v.trim())
        const row: Record<string, string> = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })

        // Validate email
        if (!row.email || !row.email.includes('@')) {
          errors.push(`Row ${i + 1}: Invalid email ${row.email}`)
          continue
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: row.email },
        })

        if (existingUser) {
          errors.push(`Row ${i + 1}: User ${row.email} already exists`)
          continue
        }

        // Create user
        const newUser = await prisma.user.create({
          data: {
            email: row.email,
            name: row.name || null,
            orgId: orgId,
            role: row.role === 'SUPERVISOR' ? 'SUPERVISOR' : 'LEARNER',
            jobTitle: row.jobTitle || null,
            employeeId: row.employeeId || null,
            department: row.department || null,
            siteId: row.siteId || null,
            crewId: row.crewId || null,
          },
        })

        created++

        // Auto-enroll in course if specified
        let courseName = ''
        if (row.courseId) {
          try {
            const course = await prisma.course.findUnique({
              where: { id: row.courseId },
            })

            if (course) {
              await prisma.enrollment.create({
                data: {
                  userId: newUser.id,
                  courseId: row.courseId,
                  status: 'ENROLLED',
                },
              })
              enrolled++
              courseName = course.title
            }
          } catch (enrollError) {
            errors.push(`Row ${i + 1}: Failed to enroll ${row.email} in course`)
          }
        }

        // Send welcome email if requested
        if (row.sendWelcomeEmail === 'true' && courseName) {
          try {
            await sendWelcomeEmail({
              to: newUser.email,
              name: newUser.name || newUser.email,
              courseName: courseName,
              loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
            })

            // Log the email
            await prisma.emailLog.create({
              data: {
                userId: newUser.id,
                emailType: 'WELCOME',
                metadata: { courseName },
              },
            })
          } catch (emailError) {
            console.error(`Failed to send welcome email to ${row.email}:`, emailError)
            // Don't fail the import if email fails
          }
        }

      } catch (error: any) {
        errors.push(`Row ${i + 1}: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      created,
      enrolled,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to import users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
