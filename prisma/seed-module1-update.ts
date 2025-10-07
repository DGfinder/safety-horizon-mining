// Module 1 Update for seed.ts
// This code should be added to seed.ts to create Module 1 as HYBRID with content sections

import { module1Sections } from './module1-content'
import { module1ScenarioNodes, module1ScenarioMeta } from './module1-scenario'
import { module1Quiz } from './module1-quiz'

// ============================================================================
// UPDATE: Change Module 1 to HYBRID kind
// ============================================================================

// In the modules array, change Module 1:
const modules = [
  {
    orderIndex: 1,
    title: 'Foundations of HF & Safety Culture',
    description: 'Core principles and cultural transformation',
    kind: 'HYBRID', // Changed from SCENARIO
  },
  // ... rest of modules
]

// ============================================================================
// ADD: Create Module 1 scenario (Your First HF Decision)
// ============================================================================

async function seedModule1(prisma: any, courseId: string) {
  console.log('🌱 Seeding Module 1: Foundations of HF & Safety Culture...')

  // Get Module 1
  const module1 = await prisma.module.findUnique({
    where: {
      courseId_orderIndex: {
        courseId: courseId,
        orderIndex: 1,
      },
    },
  })

  if (!module1) {
    throw new Error('Module 1 not found. Ensure modules are created first.')
  }

  // ============================================================================
  // 1. Create the new practice scenario: "Your First HF Decision"
  // ============================================================================

  const practiceScenario = await prisma.scenario.upsert({
    where: { slug: module1ScenarioMeta.slug },
    update: {},
    create: {
      slug: module1ScenarioMeta.slug,
      title: module1ScenarioMeta.title,
      moduleNumber: module1ScenarioMeta.moduleNumber,
      version: module1ScenarioMeta.version,
      status: module1ScenarioMeta.status,
      estimatedMinutes: module1ScenarioMeta.estimatedMinutes,
      difficulty: module1ScenarioMeta.difficulty,
      kpiFocus: module1ScenarioMeta.kpiFocus,
    },
  })

  // Create scenario nodes
  await prisma.scenarioNode.createMany({
    data: module1ScenarioNodes.map((node: any) => ({
      scenarioId: practiceScenario.id,
      nodeKey: node.nodeKey,
      nodeType: node.nodeType,
      body: node.body,
    })),
    skipDuplicates: true,
  })

  console.log('✅ Created practice scenario:', practiceScenario.title)

  // ============================================================================
  // 2. Create Content Sections (1A through 1F)
  // ============================================================================

  for (const sectionData of module1Sections) {
    await prisma.contentSection.upsert({
      where: {
        moduleId_orderIndex: {
          moduleId: module1.id,
          orderIndex: sectionData.orderIndex,
        },
      },
      update: {
        title: sectionData.title,
        subtitle: sectionData.subtitle,
        sectionType: sectionData.sectionType,
        content: sectionData.content,
        estimatedMinutes: sectionData.estimatedMinutes,
      },
      create: {
        moduleId: module1.id,
        orderIndex: sectionData.orderIndex,
        title: sectionData.title,
        subtitle: sectionData.subtitle,
        sectionType: sectionData.sectionType,
        content: sectionData.content,
        estimatedMinutes: sectionData.estimatedMinutes,
      },
    })

    console.log(`✅ Created content section ${sectionData.orderIndex}: ${sectionData.title}`)
  }

  // ============================================================================
  // 3. Update Module 1 to link scenario and quiz data
  // ============================================================================

  await prisma.module.update({
    where: {
      courseId_orderIndex: {
        courseId: courseId,
        orderIndex: 1,
      },
    },
    data: {
      kind: 'HYBRID',
      scenarioId: practiceScenario.id,
      quizData: module1Quiz, // Store quiz as JSON
    },
  })

  console.log('✅ Module 1 updated: HYBRID with content sections, scenario, and quiz')

  return {
    module: module1,
    scenario: practiceScenario,
    sectionsCount: module1Sections.length,
  }
}

// Export for use in main seed.ts
export { seedModule1 }

// ============================================================================
// USAGE IN seed.ts
// ============================================================================

/*
Add to main seed.ts after creating modules:

import { seedModule1 } from './seed-module1-update'

async function main() {
  // ... existing code ...

  // Create modules
  for (const moduleData of modules) {
    await prisma.module.upsert({ ... })
  }
  console.log('✅ Created 12 modules')

  // Seed Module 1 with hybrid content
  await seedModule1(prisma, course.id)

  // ... continue with scenarios for other modules ...
}
*/
