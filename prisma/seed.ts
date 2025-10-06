import { PrismaClient, NodeType, ScenarioStatus, Difficulty, ModuleKind } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // ============================================================================
  // 1. Create Organization & Settings
  // ============================================================================

  let org = await prisma.org.findFirst({
    where: { name: 'Pilot Mine Operations' },
  })

  if (!org) {
    org = await prisma.org.create({
      data: {
        name: 'Pilot Mine Operations',
        region: 'Western Australia',
      },
    })
  }
  console.log('✅ Created/found org:', org.name)

  await prisma.orgSettings.upsert({
    where: { orgId: org.id },
    update: {},
    create: {
      orgId: org.id,
      certValidityMonths: 12,
      reminderDaysBefore: [30, 14, 7],
      requireSequential: true,
      gamificationEnabled: false, // Disabled by default
      leaderboardEnabled: false,
      badgesEnabled: false,
      teamChallengesEnabled: false,
      primaryColor: '#EC5C29',
    },
  })
  console.log('✅ Created org settings')

  // ============================================================================
  // 2. Create Users
  // ============================================================================

  const learner = await prisma.user.upsert({
    where: { email: 'wayne@pilotmine.com.au' },
    update: {},
    create: {
      email: 'wayne@pilotmine.com.au',
      name: 'Wayne Bowron',
      orgId: org.id,
      role: 'LEARNER',
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@pilotmine.com.au' },
    update: {},
    create: {
      email: 'admin@pilotmine.com.au',
      name: 'Admin User',
      orgId: org.id,
      role: 'ADMIN',
    },
  })
  console.log('✅ Created users:', learner.name, admin.name)

  // ============================================================================
  // 3. Create Course
  // ============================================================================

  const course = await prisma.course.upsert({
    where: { slug: 'crm-for-mining' },
    update: {},
    create: {
      orgId: org.id,
      slug: 'crm-for-mining',
      title: 'Crew Resource Management for Mining',
      description: 'Aviation-proven human factors training adapted for mining operations. 12 modules covering communication, situational awareness, decision-making, and safety culture.',
      status: 'PUBLISHED',
    },
  })
  console.log('✅ Created course:', course.title)

  // ============================================================================
  // 4. Create 12 Modules (from curriculum)
  // ============================================================================

  const modules = [
    {
      orderIndex: 1,
      title: 'Foundations of HF & Safety Culture',
      description: 'Core principles and cultural transformation',
      kind: ModuleKind.SCENARIO,
    },
    {
      orderIndex: 2,
      title: 'Situational Awareness & Risk Perception',
      description: 'Environmental monitoring and threat assessment',
      kind: ModuleKind.SCENARIO,
    },
    {
      orderIndex: 3,
      title: 'Communication & Briefing Protocols',
      description: 'Clear, structured team communication',
      kind: ModuleKind.SCENARIO,
    },
    {
      orderIndex: 4,
      title: 'Decision-Making Under Pressure',
      description: 'Systematic approaches to critical decisions',
      kind: ModuleKind.SCENARIO,
    },
    {
      orderIndex: 5,
      title: 'Error Management & Recovery',
      description: 'Trap, detect, and mitigate human errors',
      kind: ModuleKind.SCENARIO,
    },
    {
      orderIndex: 6,
      title: 'Leadership & Team Dynamics',
      description: 'Effective crew resource management',
      kind: ModuleKind.SCENARIO,
    },
    {
      orderIndex: 7,
      title: 'Workload & Stress Management',
      description: 'Managing cognitive load and fatigue',
      kind: ModuleKind.SCENARIO,
    },
    {
      orderIndex: 8,
      title: 'Just Culture Implementation',
      description: 'Building a learning-focused safety culture',
      kind: ModuleKind.SCENARIO,
    },
    {
      orderIndex: 9,
      title: 'Incident Investigation & Learning',
      description: 'Human factors analysis techniques',
      kind: ModuleKind.SCENARIO,
    },
    {
      orderIndex: 10,
      title: 'Emergency Response & Crisis Management',
      description: 'High-pressure scenario management',
      kind: ModuleKind.SCENARIO,
    },
    {
      orderIndex: 11,
      title: 'Technology Interface & Automation',
      description: 'Human-machine interaction optimization',
      kind: ModuleKind.SCENARIO,
    },
    {
      orderIndex: 12,
      title: 'Continuous Improvement Systems',
      description: 'Sustaining safety culture long-term',
      kind: ModuleKind.SCENARIO,
    },
  ]

  for (const moduleData of modules) {
    await prisma.module.upsert({
      where: {
        courseId_orderIndex: {
          courseId: course.id,
          orderIndex: moduleData.orderIndex,
        },
      },
      update: {},
      create: {
        courseId: course.id,
        ...moduleData,
        required: true,
        passingScore: 70,
      },
    })
  }
  console.log('✅ Created 12 modules')

  // ============================================================================
  // 5. Create Sample Scenarios
  // ============================================================================

  // ---- Scenario 0: The Near-Miss Report (Module 1) ----
  const scenario0 = await prisma.scenario.upsert({
    where: { slug: 'near-miss-report' },
    update: {},
    create: {
      slug: 'near-miss-report',
      title: 'The Near-Miss Report: Building a Learning Culture',
      moduleNumber: 1,
      version: 1,
      status: ScenarioStatus.PUBLISHED,
      estimatedMinutes: 14,
      difficulty: Difficulty.BEGINNER,
      kpiFocus: ['just_culture', 'leadership', 'communication'],
    },
  })

  await prisma.scenarioNode.createMany({
    data: [
      // Opening narrative
      {
        scenarioId: scenario0.id,
        nodeKey: 'n1',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "07:15 AM. Your shift has just started. Jake, one of your loader operators, approaches you looking uneasy. 'Boss, I need to report something. About 20 minutes ago, I had a close call with HT-44. Poor visibility around the crusher, and our radio check-in didn't happen. We missed each other by maybe 3 meters.'",
          atmosphere: {
            time: '07:15 AM',
            weather: 'Dust haze from overnight operations',
            location: 'Crusher zone',
          },
          next: 'd1',
        },
      },
      // Decision 1: Initial response (tone-setting)
      {
        scenarioId: scenario0.id,
        nodeKey: 'd1',
        nodeType: NodeType.DECISION,
        body: {
          question: "This is your first interaction. How do you respond?",
          kpiFocus: ['just_culture', 'leadership', 'communication'],
          choices: [
            {
              id: 'a',
              text: '"Why weren\'t you paying more attention? You know the protocol."',
              icon: '😠',
              score: 15,
              kpiScores: {
                just_culture: 10,
                leadership: 15,
                communication: 20,
                psychological_safety: 5,
              },
              feedback:
                'Blame culture starts here. When the first response is blame, people stop reporting. Aviation learned this the hard way—punitive responses silence safety reporting. You\'ve just taught Jake that honesty brings criticism.',
              nextNode: 'n2_blame',
            },
            {
              id: 'b',
              text: '"Thank you for reporting this, Jake. Let\'s sit down and go through what happened."',
              icon: '🤝',
              score: 95,
              kpiScores: {
                just_culture: 100,
                leadership: 95,
                communication: 95,
                psychological_safety: 100,
              },
              feedback:
                'Perfect. Just Culture principle #1: Acknowledge reporting courage. Aviation CRM teaches that psychological safety begins with the leader\'s response. You\'ve reinforced that speaking up is valued here.',
              nextNode: 'n2_learning',
            },
            {
              id: 'c',
              text: '"These things happen. Don\'t stress about it—no harm done."',
              icon: '🤷',
              score: 30,
              kpiScores: {
                just_culture: 25,
                leadership: 35,
                communication: 30,
                learning_culture: 20,
              },
              feedback:
                'Normalization of deviance. This is how the Columbia Space Shuttle disaster happened—treating near-misses as non-events. Every near-miss is a gift: it reveals system weaknesses before they cause harm.',
              nextNode: 'n2_neutral',
            },
          ],
        },
      },
      // Branch: Blame path
      {
        scenarioId: scenario0.id,
        nodeKey: 'n2_blame',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "Jake's shoulders slump. 'Sorry boss. Won't happen again.' He walks away quickly. You notice other operators watching the interaction.",
          next: 'd2',
        },
      },
      // Branch: Learning path
      {
        scenarioId: scenario0.id,
        nodeKey: 'n2_learning',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "Jake visibly relaxes. 'Thanks. I've been thinking about it all night. There were a few things that went wrong...' You grab your notebook and head to the meeting room.",
          next: 'd2',
        },
      },
      // Branch: Neutral path
      {
        scenarioId: scenario0.id,
        nodeKey: 'n2_neutral',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "Jake nods but doesn't look convinced. 'Okay... just wanted to let you know.' You sense hesitation, like he has more to say but isn't sure if he should.",
          next: 'd2',
        },
      },
      // Decision 2: Investigation approach
      {
        scenarioId: scenario0.id,
        nodeKey: 'd2',
        nodeType: NodeType.DECISION,
        body: {
          question: 'How do you investigate this near-miss?',
          kpiFocus: ['systems_thinking', 'investigation', 'communication'],
          choices: [
            {
              id: 'a',
              text: 'Interview Jake privately to get his account',
              icon: '👤',
              score: 50,
              kpiScores: {
                systems_thinking: 40,
                investigation: 55,
                communication: 60,
                thoroughness: 45,
              },
              feedback:
                'Individual focus misses the system. Aviation accident investigation taught us: human error is rarely the root cause—it\'s a symptom. You\'re looking at one person instead of the Swiss Cheese Model of organizational failures.',
              nextNode: 'n3',
            },
            {
              id: 'b',
              text: 'Convene operations team, review procedures, check radio logs, inspect sight lines',
              icon: '🔍',
              score: 95,
              kpiScores: {
                systems_thinking: 100,
                investigation: 95,
                communication: 90,
                thoroughness: 100,
              },
              feedback:
                'Excellent systems thinking. Like NTSB investigations, you\'re looking at the whole system: equipment, procedures, environment, communication, and human factors. This is how aviation finds root causes.',
              nextNode: 'n3',
            },
            {
              id: 'c',
              text: 'File incident report with management before word spreads',
              icon: '📋',
              score: 25,
              kpiScores: {
                systems_thinking: 15,
                investigation: 20,
                leadership: 30,
                trust: 20,
              },
              feedback:
                'Political self-protection over safety learning. Your first instinct was CYA, not understanding. This signals to your team that management image matters more than safety improvement.',
              nextNode: 'n3',
            },
          ],
        },
      },
      // Narrative: Investigation findings
      {
        scenarioId: scenario0.id,
        nodeKey: 'n3',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "Your investigation reveals multiple factors: 1) Dust from overnight blast reduced visibility to <50m, 2) Radio protocol requires check-in at crusher, but both operators missed it, 3) Jake's shift started 10 minutes late due to toolbox talk overrun, 4) HT-44 driver was also running behind schedule, 5) Sight lines at crusher have been degraded by stockpile growth.",
          next: 'd3',
        },
      },
      // Decision 3: Root cause identification (Swiss Cheese Model)
      {
        scenarioId: scenario0.id,
        nodeKey: 'd3',
        nodeType: NodeType.DECISION,
        body: {
          question: 'What do you identify as the root cause?',
          kpiFocus: ['systems_thinking', 'root_cause_analysis'],
          choices: [
            {
              id: 'a',
              text: 'Jake and the HT driver both failed to follow radio protocol',
              icon: '❌',
              score: 20,
              kpiScores: {
                systems_thinking: 15,
                root_cause_analysis: 20,
                learning_culture: 25,
                hf_understanding: 10,
              },
              feedback:
                'Active error focus, not root cause. James Reason\'s Swiss Cheese Model teaches: latent failures in the system allowed active errors to align. Why did two trained operators both miss protocol? That\'s your real question.',
              nextNode: 'n4',
            },
            {
              id: 'b',
              text: 'Multiple systemic failures: visibility, schedule pressure, procedure compliance, and infrastructure',
              icon: '🧀',
              score: 100,
              kpiScores: {
                systems_thinking: 100,
                root_cause_analysis: 100,
                learning_culture: 95,
                hf_understanding: 100,
              },
              feedback:
                'Perfect application of the Swiss Cheese Model. You identified the holes that aligned: environmental (dust), organizational (schedule pressure), procedural (radio check-in), and physical (sight lines). This is how aviation prevents recurrence.',
              nextNode: 'n4',
            },
            {
              id: 'c',
              text: 'Bad timing—wrong place at the wrong time',
              icon: '🎲',
              score: 10,
              kpiScores: {
                systems_thinking: 5,
                root_cause_analysis: 10,
                learning_culture: 15,
                accountability: 5,
              },
              feedback:
                'Luck attribution eliminates learning. Saying "bad luck" means you learned nothing and will change nothing. Aviation rejected this mindset after too many disasters attributed to "pilot error" or "bad luck."',
              nextNode: 'n4',
            },
          ],
        },
      },
      // Narrative: Team briefing prep
      {
        scenarioId: scenario0.id,
        nodeKey: 'n4',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "Morning briefing is in 15 minutes. The whole team will be there—26 operators. You need to decide how to communicate this near-miss. Your choice will shape the site's safety culture for months.",
          next: 'd4',
        },
      },
      // Decision 4: Team communication (Learning culture)
      {
        scenarioId: scenario0.id,
        nodeKey: 'd4',
        nodeType: NodeType.DECISION,
        body: {
          question: 'How do you address the team?',
          kpiFocus: ['leadership', 'communication', 'just_culture'],
          choices: [
            {
              id: 'a',
              text: 'Issue formal warning to Jake as example to team',
              icon: '⚠️',
              score: 5,
              kpiScores: {
                leadership: 5,
                communication: 10,
                just_culture: 0,
                psychological_safety: 0,
              },
              feedback:
                'You just destroyed psychological safety site-wide. Every operator now knows: report a near-miss, get punished. Aviation learned this kills reporting. Tenerife disaster: First Officer hesitated to challenge Captain. 583 died.',
              nextNode: 'n5',
            },
            {
              id: 'b',
              text: 'Thank Jake publicly, share systemic findings, announce improvements',
              icon: '📢',
              score: 100,
              kpiScores: {
                leadership: 100,
                communication: 100,
                just_culture: 100,
                psychological_safety: 100,
              },
              feedback:
                'Leadership masterclass. You publicly reinforced reporting, explained systems thinking, and showed learning leads to action. This is how aviation created cultures where First Officers challenge Captains and save lives.',
              nextNode: 'n5',
            },
            {
              id: 'c',
              text: 'Keep it quiet to avoid regulatory attention',
              icon: '🤫',
              score: 0,
              kpiScores: {
                leadership: 0,
                communication: 5,
                just_culture: 0,
                integrity: 0,
              },
              feedback:
                'Cover-up culture. This is how systemic failures persist until they kill people. Challenger explosion: engineers raised concerns, management silenced them. Seven astronauts died. Culture of silence = culture of death.',
              nextNode: 'n5',
            },
          ],
        },
      },
      // Narrative: Implementation phase
      {
        scenarioId: scenario0.id,
        nodeKey: 'n5',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "Week later. You have budget approval for changes. Operations manager asks: 'What are we fixing?'",
          next: 'd5',
        },
      },
      // Decision 5: Systemic improvements
      {
        scenarioId: scenario0.id,
        nodeKey: 'd5',
        nodeType: NodeType.DECISION,
        body: {
          question: 'What corrective actions do you implement?',
          kpiFocus: ['proactive_safety', 'systems_thinking'],
          choices: [
            {
              id: 'a',
              text: 'Verbal warning to operators: "Follow radio protocol or face discipline"',
              icon: '📣',
              score: 15,
              kpiScores: {
                proactive_safety: 10,
                systems_thinking: 15,
                effectiveness: 20,
                sustainability: 10,
              },
              feedback:
                'Threat-based compliance, not systemic fix. Why did protocol fail? Schedule pressure, habit, distraction? Threats don\'t address root causes. Aviation moved beyond "fly better" to redesigning systems.',
              nextNode: 'n6',
            },
            {
              id: 'b',
              text: 'Install proximity alarms, redesign crusher sight lines, revise radio protocol, schedule buffer time',
              icon: '🛠️',
              score: 100,
              kpiScores: {
                proactive_safety: 100,
                systems_thinking: 100,
                effectiveness: 95,
                sustainability: 100,
              },
              feedback:
                'Defense in depth. Multiple barriers address multiple failure modes. Aviation calls this "layers of protection." You\'re redesigning the system so it\'s harder to make the same mistake. This is how you prevent the next near-miss from becoming a fatality.',
              nextNode: 'n6',
            },
            {
              id: 'c',
              text: 'No changes—it was one incident, procedures are adequate',
              icon: '🚫',
              score: 5,
              kpiScores: {
                proactive_safety: 0,
                systems_thinking: 10,
                learning_culture: 5,
                complacency: 100,
              },
              feedback:
                'Complacency kills. "It hasn\'t happened before" means you\'re one alignment away from tragedy. Every aviation disaster was preceded by near-misses that were ignored. Normalization of deviance leads to catastrophe.',
              nextNode: 'n6',
            },
          ],
        },
      },
      // Narrative: Follow-up with Jake
      {
        scenarioId: scenario0.id,
        nodeKey: 'n6',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "End of shift. Jake finds you. 'Hey boss, wanted to check in about that near-miss report. Am I... is everything okay?'",
          next: 'd6',
        },
      },
      // Decision 6: Psychological safety reinforcement
      {
        scenarioId: scenario0.id,
        nodeKey: 'd6',
        nodeType: NodeType.DECISION,
        body: {
          question: 'Final message to Jake:',
          kpiFocus: ['psychological_safety', 'leadership'],
          choices: [
            {
              id: 'a',
              text: '"Don\'t let it happen again. Next time could be serious."',
              icon: '👎',
              score: 20,
              kpiScores: {
                psychological_safety: 10,
                leadership: 25,
                learning_culture: 20,
                reporting_culture: 15,
              },
              feedback:
                'Threat closes the loop with fear. Jake will hesitate to report next time. You\'ve undermined all previous work. Psychological safety is fragile—one threatening comment can undo months of culture building.',
              nextNode: 'o_needs_improvement',
            },
            {
              id: 'b',
              text: '"Jake, because you spoke up, we\'re making this site safer for everyone. Thank you. I need you to keep bringing these things forward."',
              icon: '👍',
              score: 100,
              kpiScores: {
                psychological_safety: 100,
                leadership: 100,
                learning_culture: 100,
                reporting_culture: 100,
              },
              feedback:
                'Perfect closure. You\'ve closed the reporting loop with gratitude and impact. Jake knows his courage mattered. Other operators witnessed this. You\'ve just built a foundation of psychological safety that will save lives.',
              nextNode: 'o_excellence',
            },
            {
              id: 'c',
              text: '"Yeah, all good. Just be more careful going forward."',
              icon: '🤷',
              score: 40,
              kpiScores: {
                psychological_safety: 35,
                leadership: 45,
                learning_culture: 40,
                missed_opportunity: 100,
              },
              feedback:
                'Missed opportunity. You didn\'t close the learning loop. Jake doesn\'t know what changed because of his report. Psychological safety requires visible impact—show people their voice creates change.',
              nextNode: 'o_building',
            },
          ],
        },
      },
      // Outcome: Excellence
      {
        scenarioId: scenario0.id,
        nodeKey: 'o_excellence',
        nodeType: NodeType.OUTCOME,
        body: {
          title: 'Just Culture Champion',
          summary:
            'You demonstrated exceptional understanding of Human Factors and Safety Culture principles. Your responses built psychological safety, applied systems thinking, and created a learning culture.',
          kpiResults: {
            just_culture: 'Excellent - You model aviation-grade safety culture',
            systems_thinking: 'Excellent - Swiss Cheese Model applied perfectly',
            leadership: 'Excellent - You built trust and psychological safety',
            learning_culture: 'Excellent - Transformed near-miss into learning',
          },
          lessons: [
            'Just Culture starts with leader response to reporting',
            'Swiss Cheese Model: multiple system failures align to create incidents',
            'Psychological safety is fragile—nurture it constantly',
            'Systemic solutions prevent recurrence; blame does not',
            'Aviation CRM: authority gradients must allow upward reporting',
            'Near-misses are gifts: they reveal system weaknesses before tragedy',
          ],
        },
      },
      // Outcome: Building Foundations
      {
        scenarioId: scenario0.id,
        nodeKey: 'o_building',
        nodeType: NodeType.OUTCOME,
        body: {
          title: 'Building Foundations',
          summary:
            'You showed good instincts toward learning culture but missed opportunities to fully embed Human Factors principles. With practice, you\'ll strengthen these foundations.',
          kpiResults: {
            just_culture: 'Developing - Good start, strengthen psychological safety',
            systems_thinking: 'Developing - Begin seeing beyond individual error',
            leadership: 'Moderate - Build consistency in cultural messaging',
            learning_culture: 'Moderate - Connect reports to visible change',
          },
          lessons: [
            'Every interaction either builds or erodes psychological safety',
            'Look beyond "who" to "why"—systems over individuals',
            'Close the loop: show reporters their impact',
            'Consistency matters: one punitive response undoes months of trust',
            'Aviation learned: blame cultures hide problems until they kill',
          ],
        },
      },
      // Outcome: Needs Improvement
      {
        scenarioId: scenario0.id,
        nodeKey: 'o_needs_improvement',
        nodeType: NodeType.OUTCOME,
        body: {
          title: 'Blame Culture Risk',
          summary:
            'Your responses reinforced blame culture patterns that aviation has proven deadly. Review foundational CRM principles on psychological safety and systems thinking.',
          kpiResults: {
            just_culture: 'Needs Improvement - Blame focus vs. learning focus',
            systems_thinking: 'Needs Improvement - Individual error focus',
            leadership: 'Needs Improvement - Threat-based vs. trust-based',
            psychological_safety: 'At Risk - People will stop reporting',
          },
          lessons: [
            'Blame cultures silence reporting. Silence kills.',
            'Tenerife disaster: 583 died because First Officer feared speaking up',
            'Individual blame ignores systemic causes—problems persist',
            'Aviation\'s lesson: punitive cultures hide risks until catastrophe',
            'Just Culture = accountability for choices, learning from outcomes',
            'Swiss Cheese Model: incidents require multiple system failures',
          ],
        },
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Created scenario 0: The Near-Miss Report (Module 1)')

  // ---- Scenario 1: Night Shift Vibration (Module 2) ----
  const scenario1 = await prisma.scenario.upsert({
    where: { slug: 'night-shift-vibration' },
    update: {},
    create: {
      slug: 'night-shift-vibration',
      title: 'Night Shift: The Vibration Call',
      moduleNumber: 2,
      version: 1,
      status: ScenarioStatus.PUBLISHED,
      estimatedMinutes: 8,
      difficulty: Difficulty.INTERMEDIATE,
      kpiFocus: ['communication', 'situational_awareness'],
    },
  })

  await prisma.scenarioNode.createMany({
    data: [
      {
        scenarioId: scenario1.id,
        nodeKey: 'n1',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "02:15 AM. Dense fog blankets the open pit. Your radio crackles: 'Wayne, it's Sarah. HT512 is showing a vibration alarm. I'm getting nervous.'",
          atmosphere: {
            time: '02:15 AM',
            weather: 'Dense fog, low visibility',
            location: 'Open pit mine',
          },
          next: 'd1',
        },
      },
      {
        scenarioId: scenario1.id,
        nodeKey: 'd1',
        nodeType: NodeType.DECISION,
        body: {
          question: "What's your immediate response?",
          kpiFocus: ['communication', 'situational_awareness'],
          choices: [
            {
              id: 'a',
              text: 'Tell her to keep going cautiously',
              icon: '⚠️',
              score: 20,
              kpiScores: {
                communication: 30,
                situational_awareness: 20,
                decision_making: 15,
              },
              feedback:
                'Prioritizing production over safety signals creates pressure on your team to ignore warnings. This choice increases the risk of escalation.',
              outcome:
                '20 minutes later: Catastrophic tyre failure. Sarah sustains minor injuries. Production halted for 8 hours. Cost: $125,000.',
              nextNode: 'o_failure',
            },
            {
              id: 'b',
              text: 'Stop the truck immediately, dispatch fitter',
              icon: '🛑',
              score: 85,
              kpiScores: {
                communication: 90,
                situational_awareness: 95,
                decision_making: 80,
              },
              feedback:
                'Excellent decision. You demonstrated situational awareness by recognizing the potential escalation and prioritized safety over production pressure.',
              outcome:
                'Fitter identifies loose wheel bearing. 25-minute delay prevents potential catastrophic failure. Sarah thanks you for listening.',
              nextNode: 'n2',
            },
            {
              id: 'c',
              text: "Ask Sarah: 'What's your gut telling you?'",
              icon: '🤝',
              score: 95,
              kpiScores: {
                communication: 100,
                situational_awareness: 85,
                authority_gradient: 100,
                decision_making: 90,
              },
              feedback:
                "Outstanding. You empowered your team member, flattened the authority gradient, and gathered critical on-ground intelligence before deciding. This is textbook CRM.",
              outcome:
                "Sarah recommends stopping. Her expertise prevented a major incident. She feels valued and will speak up again.",
              nextNode: 'n2',
            },
          ],
        },
      },
      {
        scenarioId: scenario1.id,
        nodeKey: 'n2',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "The fitter finds a loose bearing. 'Another 30 minutes and that wheel would've come off,' he says. You made the right call.",
          next: 'd2',
        },
      },
      {
        scenarioId: scenario1.id,
        nodeKey: 'd2',
        nodeType: NodeType.DECISION,
        body: {
          question:
            'Your supervisor radios: "Wayne, we need to make up that 25 minutes. Push the next haul cycle." How do you respond?',
          kpiFocus: ['authority_gradient', 'communication'],
          choices: [
            {
              id: 'a',
              text: 'Comply without question',
              icon: '✅',
              score: 30,
              kpiScores: {
                authority_gradient: 20,
                communication: 40,
                decision_making: 25,
              },
              feedback:
                'Steep authority gradients prevent safety concerns from being raised. Compliance without question can lead to shortcuts and increased risk.',
              outcome:
                'The crew rushes. A near-miss occurs on the next cycle. Nobody speaks up.',
              nextNode: 'o_failure',
            },
            {
              id: 'b',
              text: 'Explain safety rationale, maintain standard cycle',
              icon: '💬',
              score: 90,
              kpiScores: {
                authority_gradient: 95,
                communication: 90,
                decision_making: 85,
              },
              feedback:
                'Excellent assertiveness. You challenged authority appropriately, explained your safety rationale, and maintained standards. This is how aviation prevents disasters.',
              outcome:
                "Supervisor understands. 'You're right. Safety first.' Production recovers naturally over the shift.",
              nextNode: 'o_success',
            },
            {
              id: 'c',
              text: 'Push the cycle to avoid conflict',
              icon: '⏭️',
              score: 25,
              kpiScores: {
                authority_gradient: 15,
                communication: 35,
                decision_making: 20,
              },
              feedback:
                'Avoiding conflict when safety is at stake creates a culture where production always wins. This erodes psychological safety.',
              outcome:
                'Crew feels the pressure. Corners get cut. Trust erodes.',
              nextNode: 'o_failure',
            },
          ],
        },
      },
      {
        scenarioId: scenario1.id,
        nodeKey: 'o_success',
        nodeType: NodeType.OUTCOME,
        body: {
          title: 'Excellent CRM Performance',
          summary:
            'You demonstrated strong situational awareness, effective communication, and appropriate assertiveness. The team feels safe to speak up.',
          kpiResults: {
            communication: 'Strong',
            situational_awareness: 'Excellent',
            authority_gradient: 'Well managed',
            decision_making: 'Sound',
          },
          lessons: [
            'Empowering team members leads to better safety intelligence',
            'Challenging authority when safety is at risk prevents incidents',
            'Short-term delays prevent long-term disasters',
          ],
        },
      },
      {
        scenarioId: scenario1.id,
        nodeKey: 'o_failure',
        nodeType: NodeType.OUTCOME,
        body: {
          title: 'Opportunity for Improvement',
          summary:
            'Production pressure led to compromised safety decisions. Review how authority gradients and communication patterns affected outcomes.',
          kpiResults: {
            communication: 'Needs improvement',
            situational_awareness: 'Needs development',
            authority_gradient: 'Too steep',
            decision_making: 'Pressured',
          },
          lessons: [
            'Safety warnings from crew should never be dismissed',
            'Flattening authority gradient enables better safety reporting',
            'Swiss cheese model: Multiple small failures lead to incidents',
          ],
        },
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Created scenario 1: Night Shift Vibration')

  // ---- Scenario 1.5: The Shift Handover (Module 3) ----
  const scenario1_5 = await prisma.scenario.upsert({
    where: { slug: 'shift-handover' },
    update: {},
    create: {
      slug: 'shift-handover',
      title: 'The Shift Handover: When Communication Fails',
      moduleNumber: 3,
      version: 1,
      status: ScenarioStatus.PUBLISHED,
      estimatedMinutes: 13,
      difficulty: Difficulty.BEGINNER,
      kpiFocus: ['communication', 'briefing_protocols', 'situational_awareness'],
    },
  })

  await prisma.scenarioNode.createMany({
    data: [
      // Opening narrative
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'n1',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "17:45. Day shift ending in 15 minutes. You're the outgoing supervisor. Night shift supervisor Maria walks into the control room. 'Quick handover? Got a lot to cover tonight.' Behind her, the night shift crew is already gathering—8 operators waiting for briefing. You have critical information: Loader 16 has intermittent hydraulic warnings, North pit blast scheduled for 22:00, and Zone 4 is restricted due to geotechnical concerns.",
          atmosphere: {
            time: '17:45',
            weather: 'Clear, dusk approaching',
            location: 'Control room',
            urgency: 'MEDIUM',
          },
          next: 'd1',
        },
      },
      // Decision 1: Handover briefing structure
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'd1',
        nodeType: NodeType.DECISION,
        body: {
          question: 'How do you conduct the shift handover?',
          kpiFocus: ['communication', 'briefing_protocols'],
          choices: [
            {
              id: 'a',
              text: 'Quick verbal rundown: "Loader 16 acting up, blast at 22:00, Zone 4 closed. Questions?"',
              icon: '⏩',
              score: 25,
              kpiScores: {
                communication: 20,
                briefing_protocols: 15,
                completeness: 25,
                risk_management: 30,
              },
              feedback:
                'Rushed, unstructured communication is how critical information gets lost. Aviation learned this: informal briefings lead to missed details. United Airlines Flight 173 crashed because crew communication broke down during emergency.',
              nextNode: 'n2_rushed',
            },
            {
              id: 'b',
              text: 'Use structured SBAR briefing with full crew present: Situation, Background, Assessment, Recommendations',
              icon: '📋',
              score: 100,
              kpiScores: {
                communication: 100,
                briefing_protocols: 100,
                completeness: 95,
                risk_management: 100,
              },
              feedback:
                'Perfect. SBAR is aviation-standard communication protocol. Structured briefings ensure nothing is missed. Every critical detail gets communicated in a predictable format. This is how aviation achieves <1 fatal accident per 10 million flights.',
              nextNode: 'n2_structured',
            },
            {
              id: 'c',
              text: 'Pull Maria aside privately, let her brief the crew herself',
              icon: '🤫',
              score: 40,
              kpiScores: {
                communication: 35,
                briefing_protocols: 30,
                team_awareness: 40,
                information_loss: 80,
              },
              feedback:
                'Information degradation. Each handoff loses ~30% of detail. Aviation uses "all affected parties present" rule. Critical safety information must reach frontline operators directly, not through telephone game.',
              nextNode: 'n2_private',
            },
          ],
        },
      },
      // Branch: Rushed path
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'n2_rushed',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "Maria scribbles notes. 'Got it. See you tomorrow.' The night crew disperses quickly. You notice confusion on a few faces—did everyone catch the Zone 4 restriction?",
          next: 'd2',
        },
      },
      // Branch: Structured path
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'n2_structured',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "You gather everyone. 'Before we start: Situation - three critical items tonight. Background - let me walk through each one. Assessment - here's what it means for operations. Recommendations - here's what we need to do.' The crew is attentive, taking notes.",
          next: 'd2',
        },
      },
      // Branch: Private path
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'n2_private',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "You walk Maria through everything in the hallway. 'Make sure everyone knows about Zone 4.' She nods, already distracted by her phone. 'Yep, I'll tell them.'",
          next: 'd2',
        },
      },
      // Decision 2: Equipment issue communication (specificity)
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'd2',
        nodeType: NodeType.DECISION,
        body: {
          question: 'How do you communicate the Loader 16 hydraulic issue?',
          kpiFocus: ['communication', 'specificity', 'risk_assessment'],
          choices: [
            {
              id: 'a',
              text: '"Loader 16 is having issues. Keep an eye on it."',
              icon: '🤷',
              score: 20,
              kpiScores: {
                communication: 15,
                specificity: 10,
                actionable_information: 20,
                risk_assessment: 25,
              },
              feedback:
                'Vague is dangerous. "Issues" could mean anything. What should operators watch for? What actions should they take? Aviation: "Autopilot glitchy" vs. "Autopilot disconnects at FL350, requires manual trim." Specificity saves lives.',
              nextNode: 'n3',
            },
            {
              id: 'b',
              text: '"Loader 16: intermittent hydraulic pressure warnings. Occurs during bucket curl. If pressure drops below 2000 PSI or warning persists >30 seconds, stop operations, notify supervisor, call fitter. Logged in equipment diary."',
              icon: '📊',
              score: 100,
              kpiScores: {
                communication: 100,
                specificity: 100,
                actionable_information: 100,
                risk_assessment: 95,
              },
              feedback:
                'Aviation-grade specificity. You provided: symptom, trigger, threshold, action, escalation path, documentation. Operators know exactly what to watch for and what to do. This is how you prevent "I didn\'t know it was serious" incidents.',
              nextNode: 'n3',
            },
            {
              id: 'c',
              text: '"Loader 16 might need a fitter. Use your judgment."',
              icon: '🎲',
              score: 10,
              kpiScores: {
                communication: 5,
                specificity: 10,
                responsibility_clarity: 15,
                risk_assessment: 10,
              },
              feedback:
                'Abdication masked as empowerment. "Use judgment" without context transfers risk without support. Aviation learned: crews need clear decision criteria. Ambiguity kills. Provide parameters, then trust judgment within those bounds.',
              nextNode: 'n3',
            },
          ],
        },
      },
      // Narrative: Blast timing communication
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'n3',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "You move to the blast schedule. 'North pit blast at 22:00.' An operator interrupts: 'All zones or just North B?' Good question—blast area specifics matter for positioning equipment.",
          next: 'd3',
        },
      },
      // Decision 3: Closed-loop communication (verification)
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'd3',
        nodeType: NodeType.DECISION,
        body: {
          question: 'How do you handle the clarification question?',
          kpiFocus: ['communication', 'closed_loop', 'psychological_safety'],
          choices: [
            {
              id: 'a',
              text: '"I already said North pit. Pay attention."',
              icon: '😤',
              score: 5,
              kpiScores: {
                communication: 5,
                psychological_safety: 0,
                closed_loop: 10,
                team_dynamics: 5,
              },
              feedback:
                'You just killed psychological safety. That operator won\'t ask questions again—and neither will anyone else who watched. Aviation: crews that fear asking questions crash planes. Asiana 214, San Francisco: First Officer saw approach was wrong, didn\'t challenge Captain. 3 died.',
              nextNode: 'n4',
            },
            {
              id: 'b',
              text: '"Excellent question. North pit, Zones B and C only. Zone A continues production. Let me mark it on the board. Everyone clear on exclusion boundaries?"',
              icon: '✅',
              score: 100,
              kpiScores: {
                communication: 100,
                psychological_safety: 100,
                closed_loop: 100,
                visual_aids: 95,
              },
              feedback:
                'Perfect closed-loop communication. You: 1) Praised the question (psychological safety), 2) Provided specific answer, 3) Used visual aid (board), 4) Verified understanding. This is aviation CRM briefing protocol. Clarity prevents incidents.',
              nextNode: 'n4',
            },
            {
              id: 'c',
              text: '"Check the blast sheet in the office."',
              icon: '📄',
              score: 30,
              kpiScores: {
                communication: 25,
                accessibility: 30,
                real_time_clarity: 20,
                opportunity_cost: 70,
              },
              feedback:
                'Information scavenger hunt. In briefings, answer questions on the spot. Aviation: "Check the manual" during emergency = disaster. Real-time clarity prevents errors. Your job is to make critical information immediately accessible.',
              nextNode: 'n4',
            },
          ],
        },
      },
      // Narrative: Documentation phase
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'n4',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "Briefing complete. Maria has the shift logbook open. You need to document the handover. What you write (or don't write) could be critical evidence if something goes wrong tonight.",
          next: 'd4',
        },
      },
      // Decision 4: Written documentation
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'd4',
        nodeType: NodeType.DECISION,
        body: {
          question: 'What do you document in the shift logbook?',
          kpiFocus: ['documentation', 'completeness', 'accountability'],
          choices: [
            {
              id: 'a',
              text: '"Handover complete. M. Rivera"',
              icon: '✍️',
              score: 15,
              kpiScores: {
                documentation: 10,
                completeness: 15,
                legal_defensibility: 20,
                accountability: 25,
              },
              feedback:
                'Legally useless. If an incident occurs, "handover complete" proves nothing. What was communicated? What were the risks? Aviation black boxes record everything because memory fails and disputes arise. Document specifics.',
              nextNode: 'n5',
            },
            {
              id: 'b',
              text: 'Detailed entry: "17:45 handover. Critical items: 1) Loader 16 hydraulic warnings (pressure <2000 PSI, stop ops), 2) North pit blast 22:00 Zones B&C (exclusion 21:30-22:30), 3) Zone 4 geotechnical restriction (no heavy equipment). Night supervisor M. Rivera acknowledged. 8 operators briefed." Signed & timed.',
              icon: '📝',
              score: 100,
              kpiScores: {
                documentation: 100,
                completeness: 100,
                legal_defensibility: 100,
                accountability: 100,
              },
              feedback:
                'Aviation-standard documentation. Specific, timestamped, actionable, witnessed. If investigated, this log proves what was communicated. In court or regulator review, documentation quality determines outcomes. This protects you AND your team.',
              nextNode: 'n5',
            },
            {
              id: 'c',
              text: '"See emails for details."',
              icon: '📧',
              score: 25,
              kpiScores: {
                documentation: 20,
                accessibility: 30,
                centralization: 15,
                reliability: 25,
              },
              feedback:
                'Fragmented documentation. Aviation rule: critical safety information in centralized, accessible log. Emails get buried, deleted, or not read. Emergency responders need immediate access to shift information. Logbook is your single source of truth.',
              nextNode: 'n5',
            },
          ],
        },
      },
      // Narrative: Operator asks for clarification
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'n5',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "As you're packing up, a younger operator approaches nervously. 'Sorry, one more question about Zone 4—is the restriction just the haul road or the whole loading area?' It's 18:05, you're officially off shift.",
          next: 'd5',
        },
      },
      // Decision 5: Post-briefing questions (accessibility)
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'd5',
        nodeType: NodeType.DECISION,
        body: {
          question: 'How do you respond?',
          kpiFocus: ['psychological_safety', 'communication', 'accessibility'],
          choices: [
            {
              id: 'a',
              text: '"Ask Maria, she\'s the supervisor now."',
              icon: '👋',
              score: 35,
              kpiScores: {
                psychological_safety: 30,
                accessibility: 35,
                handover_quality: 40,
                knowledge_transfer: 30,
              },
              feedback:
                'Technically correct, practically risky. You have the context. Maria might not have the full picture yet. Aviation: answer the question, then ensure night shift supervisor is looped in. Safety over shift boundaries.',
              nextNode: 'n6',
            },
            {
              id: 'b',
              text: '"Great question. Whole loading area restricted—geotechnical team found ground movement. Here\'s the survey map. Maria, can you add this to tonight\'s pre-start briefing?"',
              icon: '🗺️',
              score: 100,
              kpiScores: {
                psychological_safety: 100,
                accessibility: 100,
                thoroughness: 100,
                collaboration: 95,
              },
              feedback:
                'Leadership excellence. You: 1) Answered immediately with specifics, 2) Provided visual reference, 3) Reinforced with night supervisor, 4) Modeled psychological safety. This operator will always ask questions. That saves lives.',
              nextNode: 'n6',
            },
            {
              id: 'c',
              text: '"If you were paying attention during briefing, you\'d know."',
              icon: '😒',
              score: 0,
              kpiScores: {
                psychological_safety: 0,
                accessibility: 5,
                professionalism: 0,
                culture_toxicity: 100,
              },
              feedback:
                'Toxic. You just taught the whole crew: don\'t ask questions, you\'ll get shamed. Aviation knows: fear of looking stupid kills people. TWA Flight 514: crew confused about altitude restriction, didn\'t clarify, flew into mountain. 92 died. Answer every question, every time.',
              nextNode: 'n6',
            },
          ],
        },
      },
      // Narrative: Final handover
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'n6',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "18:15. Maria is about to start her pre-start briefing with the crew. She looks at you: 'Anything else I should know before you go?'",
          next: 'd6',
        },
      },
      // Decision 6: Final verification (handover quality)
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'd6',
        nodeType: NodeType.DECISION,
        body: {
          question: 'Final handover verification:',
          kpiFocus: ['closed_loop', 'thoroughness'],
          choices: [
            {
              id: 'a',
              text: '"Nope, you\'re good to go."',
              icon: '👍',
              score: 30,
              kpiScores: {
                closed_loop: 25,
                thoroughness: 30,
                risk_verification: 35,
                assumptions: 80,
              },
              feedback:
                'Assumption of understanding. You didn\'t verify what Maria heard vs. what you said. Aviation uses read-backs: "Cleared to FL350" → "Climbing to FL350, roger." Verify critical information was received accurately.',
              nextNode: 'o_moderate',
            },
            {
              id: 'b',
              text: '"Let me verify: can you summarize the three critical items for tonight?" [Listen to her recap] "Perfect. And if Loader 16 warning persists, what\'s the action?" [Verify specific knowledge]',
              icon: '🔄',
              score: 100,
              kpiScores: {
                closed_loop: 100,
                thoroughness: 100,
                risk_verification: 100,
                quality_assurance: 100,
              },
              feedback:
                'Perfect closed-loop communication. Aviation standard: critical items must be restated by receiver. This catches misunderstandings before they become incidents. "Read back is not just words—it\'s confirmation of mental model alignment." You verified understanding, not just receipt.',
              nextNode: 'o_excellence',
            },
            {
              id: 'c',
              text: '"Just read the logbook entry, it\'s all there."',
              icon: '📖',
              score: 40,
              kpiScores: {
                closed_loop: 35,
                engagement: 30,
                handover_quality: 40,
                passive_transfer: 80,
              },
              feedback:
                'Passive information transfer. Reading ≠ understanding ≠ action. Aviation: written procedures + verbal briefing + verification. Relying on one channel alone is insufficient for critical safety information. Multi-modal communication prevents errors.',
              nextNode: 'o_moderate',
            },
          ],
        },
      },
      // Outcome: Excellence
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'o_excellence',
        nodeType: NodeType.OUTCOME,
        body: {
          title: 'Communication Excellence',
          summary:
            'You demonstrated aviation-standard communication protocols. Structured briefings, closed-loop verification, specific information, and psychological safety create the foundation for zero-harm operations.',
          kpiResults: {
            communication: 'Excellent - SBAR protocol mastered',
            briefing_protocols: 'Excellent - Structured and complete',
            closed_loop: 'Excellent - Verified understanding',
            psychological_safety: 'Excellent - Encouraged questions',
          },
          lessons: [
            'SBAR protocol ensures nothing is missed in critical communication',
            'Specificity prevents "I didn\'t know" incidents—provide symptoms, thresholds, actions',
            'Closed-loop: sender transmits → receiver confirms → sender verifies',
            'Praise questions publicly—psychological safety enables safety reporting',
            'Document specifics: what was said, when, who acknowledged',
            'Aviation: read-backs prevent 80% of communication errors',
          ],
        },
      },
      // Outcome: Moderate
      {
        scenarioId: scenario1_5.id,
        nodeKey: 'o_moderate',
        nodeType: NodeType.OUTCOME,
        body: {
          title: 'Building Communication Skills',
          summary:
            'You communicated critical information but missed opportunities for structured protocols and verification. Strengthening briefing discipline will reduce communication-related incidents.',
          kpiResults: {
            communication: 'Moderate - Information shared but not verified',
            briefing_protocols: 'Developing - Needs structure and completeness',
            closed_loop: 'Needs Work - Assumed understanding vs. verified',
            documentation: 'Variable - Inconsistent detail and accessibility',
          },
          lessons: [
            'Rushed briefings lose ~30% of critical detail',
            'Structured protocols (SBAR) prevent information loss',
            'Closed-loop verification catches misunderstandings early',
            'Documentation quality determines legal and investigative outcomes',
            'Every clarification question is a gift—answer it fully',
            'Aviation standard: never assume understanding, always verify',
          ],
        },
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Created scenario 1.5: The Shift Handover (Module 3)')

  // ---- Scenario 2: Pre-Start Shortcut (Module 4) ----
  const scenario2 = await prisma.scenario.upsert({
    where: { slug: 'pre-start-shortcut' },
    update: {},
    create: {
      slug: 'pre-start-shortcut',
      title: 'The Pre-Start Shortcut',
      moduleNumber: 4,
      version: 1,
      status: ScenarioStatus.PUBLISHED,
      estimatedMinutes: 6,
      difficulty: Difficulty.BEGINNER,
      kpiFocus: ['decision_making', 'error_management'],
    },
  })

  await prisma.scenarioNode.createMany({
    data: [
      {
        scenarioId: scenario2.id,
        nodeKey: 'n1',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "06:00 AM. Shift handover ran long. You're behind schedule. Your loader needs a pre-start inspection.",
          atmosphere: {
            time: '06:00 AM',
            weather: 'Clear',
            location: 'Equipment yard',
          },
          next: 'd1',
        },
      },
      {
        scenarioId: scenario2.id,
        nodeKey: 'd1',
        nodeType: NodeType.DECISION,
        body: {
          question: 'Do you complete the full pre-start or abbreviate to catch up?',
          kpiFocus: ['decision_making', 'error_management'],
          choices: [
            {
              id: 'a',
              text: 'Skip non-critical checks',
              icon: '⏭️',
              score: 15,
              kpiScores: {
                decision_making: 10,
                error_management: 20,
                situational_awareness: 15,
              },
              feedback:
                'Normalization of deviance: Small shortcuts compound. What seems minor today becomes standard practice tomorrow.',
              outcome:
                'You miss hydraulic fluid leak. Loader fails mid-shift. Major delay.',
              nextNode: 'o_failure',
            },
            {
              id: 'b',
              text: 'Complete full pre-start',
              icon: '✅',
              score: 95,
              kpiScores: {
                decision_making: 100,
                error_management: 95,
                situational_awareness: 90,
              },
              feedback:
                'Perfect. Procedures exist for a reason. This disciplined approach prevents the small errors that cascade into major incidents.',
              outcome:
                'Pre-start reveals worn brake pad. Prevented failure. You catch up naturally.',
              nextNode: 'o_success',
            },
            {
              id: 'c',
              text: 'Radio supervisor for guidance',
              icon: '📞',
              score: 75,
              kpiScores: {
                decision_making: 70,
                communication: 85,
                authority_gradient: 80,
              },
              feedback:
                'Good communication, but you already know the answer. Trust your training and procedures.',
              outcome:
                'Supervisor says complete full check. Slight delay, no issues.',
              nextNode: 'o_success',
            },
          ],
        },
      },
      {
        scenarioId: scenario2.id,
        nodeKey: 'o_success',
        nodeType: NodeType.OUTCOME,
        body: {
          title: 'Procedure Discipline',
          summary:
            'You maintained procedural integrity under time pressure. This disciplined approach prevents incidents.',
          kpiResults: {
            decision_making: 'Excellent',
            error_management: 'Proactive',
          },
          lessons: [
            'Procedures are written in blood - never shortcut safety',
            'Time pressure is not a valid reason to skip checks',
            'Finding issues during pre-start saves hours of downtime',
          ],
        },
      },
      {
        scenarioId: scenario2.id,
        nodeKey: 'o_failure',
        nodeType: NodeType.OUTCOME,
        body: {
          title: 'Normalization of Deviance',
          summary:
            'Small shortcuts led to major failure. Time saved upfront cost much more later.',
          kpiResults: {
            decision_making: 'Pressured',
            error_management: 'Reactive',
          },
          lessons: [
            'Shortcutting procedures is the first link in the error chain',
            'Production pressure should never override safety procedures',
            'What you walk past, you accept as standard',
          ],
        },
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Created scenario 2: Pre-Start Shortcut')

  // ---- Scenario 2.5: The Wrong Stockpile (Module 5) ----
  const scenario2_5 = await prisma.scenario.upsert({
    where: { slug: 'wrong-stockpile' },
    update: {},
    create: {
      slug: 'wrong-stockpile',
      title: 'The Wrong Stockpile: Error Management & Recovery',
      moduleNumber: 5,
      version: 1,
      status: ScenarioStatus.PUBLISHED,
      estimatedMinutes: 12,
      difficulty: Difficulty.INTERMEDIATE,
      kpiFocus: ['error_management', 'communication', 'just_culture', 'systems_thinking'],
    },
  })

  await prisma.scenarioNode.createMany({
    data: [
      // ---- NARRATIVE 1: Error Discovery ----
      {
        scenarioId: scenario2_5.id,
        nodeKey: 'n1',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "10:30 AM. You've been loading haul trucks from Stockpile 7 for the past 90 minutes. Production is smooth—you're ahead of schedule.\n\nThen you glance at your tablet. The shift plan says **Stockpile 9**.\n\nYour stomach drops. You've been loading the wrong material. 12 trucks. Each hauling 220 tonnes to the crusher. That's 2,640 tonnes of low-grade ore mixed into the high-grade stream.\n\nThe next truck pulls up, waiting for your bucket.",
          atmosphere: {
            time: '10:30 AM',
            weather: 'Hot, 38°C',
            location: 'ROM Pad, Stockpile 7',
            urgency: 'HIGH',
          },
          characterContext: {
            role: 'Loader Operator',
            experience: '3 years',
            pressures: ['Ahead of schedule', 'Hot conditions', 'Truck waiting'],
          },
          next: 'd1',
        },
      },

      // ---- DECISION 1: Immediate Response ----
      {
        scenarioId: scenario2_5.id,
        nodeKey: 'd1',
        nodeType: NodeType.DECISION,
        body: {
          question: 'You just realized you\'ve been loading from the wrong stockpile for 90 minutes. 12 trucks of wrong material already sent. A truck is waiting. What do you do?',
          timeLimit: null,
          kpiFocus: ['error_management', 'communication'],
          choices: [
            {
              id: 'a',
              text: 'Keep loading. No one noticed yet. Quietly switch to Stockpile 9 and hope contamination gets diluted.',
              icon: '🤐',
              score: 5,
              kpiScores: {
                error_management: 0,
                communication: 0,
                psychological_safety: 0,
                just_culture: 0,
              },
              feedback: "**Cover-up culture kills.** Aviation disasters teach: hidden errors compound until catastrophe. Eastern Airlines 401 crashed because crew didn't admit altitude error until impact.\n\n**Error Management Principle:** The moment you recognize an error, you must report it. Silence turns mistakes into disasters.",
              outcome: 'You wave off the truck and switch stockpiles. Your supervisor notices the unusual move and radios: "Everything okay?" You reply "Yeah, all good." Two hours later, the plant identifies contamination. An investigation traces it to you. Trust is shattered.',
              nextNode: 'n2_coverup',
            },
            {
              id: 'b',
              text: 'Stop loading immediately. Radio supervisor: "Stop all trucks from Stockpile 7. I loaded wrong material. Need immediate recovery protocol."',
              icon: '🚨',
              score: 100,
              kpiScores: {
                error_management: 100,
                communication: 100,
                psychological_safety: 95,
                just_culture: 100,
              },
              feedback: "**Perfect error management.** You recognized the error, stopped propagation, and initiated recovery protocol immediately.\n\n**Aviation Parallel:** United 232 crew admitted hydraulic failure instantly, coordinated recovery, saved 185 lives. Early error acknowledgment enables team problem-solving.",
              outcome: 'You wave off the waiting truck and hit the emergency stop. Your supervisor responds within 10 seconds: "Copy. Halting Stockpile 7 trucks. Stand by." Relief washes over you—the system is designed for this.',
              nextNode: 'n2_reported',
            },
            {
              id: 'c',
              text: 'Finish this truck load, then casually mention it to the supervisor during lunch. "Hey, might have mixed a bit of material this morning."',
              icon: '⏰',
              score: 20,
              kpiScores: {
                error_management: 15,
                communication: 20,
                psychological_safety: 30,
                just_culture: 10,
              },
              feedback: "**Delayed reporting = amplified consequences.** Every minute of delay allows more contamination, higher costs, and eroded trust.\n\n**Error Management Rule:** Report errors when discovered, not when convenient. Air France 447 pilots delayed recognizing stall for 4 minutes—all 228 died.",
              outcome: 'You load the truck. By lunch, 6 more trucks have hauled contaminated material. Your "casual mention" triggers a full production stop—18 trucks, 4,000 tonnes affected. The delay makes recovery far more complex.',
              nextNode: 'n2_delayed',
            },
          ],
        },
      },

      // ---- NARRATIVE 2A: Cover-up Path ----
      {
        scenarioId: scenario2_5.id,
        nodeKey: 'n2_coverup',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "The investigation finds inconsistencies in truck logs, tablet GPS data, and plant analysis. Your supervisor asks directly: \"Did you load from Stockpile 7 this morning?\"\n\nCover-up cultures don't survive scrutiny. And they destroy psychological safety site-wide.",
          next: 'o_coverup_failure',
        },
      },

      // ---- NARRATIVE 2B: Delayed Report ----
      {
        scenarioId: scenario2_5.id,
        nodeKey: 'n2_delayed',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "The production stop ripples across the mine. 18 trucks. 4,000 tonnes. The plant supervisor radios: \"Why didn't you report this immediately when you discovered it?\"\n\nDelayed reporting is still better than cover-up—but the window for optimal recovery has closed.",
          next: 'd2_delayed',
        },
      },

      // ---- NARRATIVE 2C: Immediate Report (Optimal Path) ----
      {
        scenarioId: scenario2_5.id,
        nodeKey: 'n2_reported',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "Your supervisor arrives within 3 minutes. She's calm, focused. \"Okay. 12 trucks from Stockpile 7 to the crusher. Let's get plant ops on the line and figure out containment.\"\n\nNo anger. No blame. Just problem-solving.\n\nThis is what just culture looks like.",
          next: 'd2',
        },
      },

      // ---- DECISION 2: Impact Assessment ----
      {
        scenarioId: scenario2_5.id,
        nodeKey: 'd2',
        nodeType: NodeType.DECISION,
        body: {
          question: 'Supervisor asks: "Walk me through what happened. How did this start?" How do you respond?',
          kpiFocus: ['systems_thinking', 'communication'],
          choices: [
            {
              id: 'a',
              text: '"I screwed up. I didn\'t check the tablet carefully enough. My fault."',
              icon: '😔',
              score: 40,
              kpiScores: {
                systems_thinking: 20,
                communication: 50,
                error_management: 40,
              },
              feedback: "**Accountability ≠ Self-blame.** Taking personal responsibility is good, but stopping there misses systemic factors.\n\n**Swiss Cheese Model:** Errors happen when multiple system layers fail. Focus only on \"my fault\" prevents identifying latent organizational failures.",
              outcome: 'Your supervisor nods, but presses: "What made it easy to miss? Were there any system factors?" She\'s trying to help you think systemically.',
              nextNode: 'n3',
            },
            {
              id: 'b',
              text: '"Shift handover ran late—started rushed. Stockpiles 7 and 9 look identical from cab. Tablet notification was buried under GPS app. I didn\'t cross-check."',
              icon: '🔍',
              score: 95,
              kpiScores: {
                systems_thinking: 100,
                communication: 95,
                error_management: 90,
              },
              feedback: "**Excellent systems analysis.** You identified:\n- Latent failure: Late handover (schedule pressure)\n- Design issue: Visually identical stockpiles\n- Interface problem: Buried tablet notification\n- Active error: Missed cross-check\n\n**Aviation Standard:** NTSB investigations always map contributing factors. Personal accountability + systems analysis = learning.",
              outcome: 'Your supervisor takes notes. "Good. That\'s useful. Late handovers are a pattern—we need to address that. And the stockpile marking is worth reviewing." She\'s building a prevention plan, not a punishment case.',
              nextNode: 'n3',
            },
            {
              id: 'c',
              text: '"The shift plan wasn\'t clear. And the stockpile signs are faded. Hard to blame me when systems are ambiguous."',
              icon: '🛡️',
              score: 25,
              kpiScores: {
                systems_thinking: 40,
                communication: 20,
                error_management: 15,
              },
              feedback: "**Deflection undermines learning.** Yes, systems matter—but starting with blame deflection (\"hard to blame me\") signals defensiveness, not learning.\n\n**Just Culture Balance:** Acknowledge your role + identify systemic factors. Defensiveness shuts down honest analysis.",
              outcome: 'Your supervisor\'s tone shifts slightly. "We\'ll review the systems. But every operator gets the same plan and signs—most cross-check. Let\'s focus on what we can learn here."',
              nextNode: 'n3',
            },
          ],
        },
      },

      // ---- DECISION 2 (DELAYED PATH): Delayed Explanation ----
      {
        scenarioId: scenario2_5.id,
        nodeKey: 'd2_delayed',
        nodeType: NodeType.DECISION,
        body: {
          question: 'Why did you wait until lunch to report this error?',
          kpiFocus: ['communication', 'psychological_safety'],
          choices: [
            {
              id: 'a',
              text: '"I was embarrassed. Didn\'t want to look incompetent."',
              icon: '😟',
              score: 50,
              kpiScores: {
                psychological_safety: 40,
                communication: 45,
              },
              feedback: "**Honesty is valuable, but the delay had real costs.** Your supervisor can work with this—but the organization needs to understand why psychological safety gaps cause reporting delays.",
              outcome: 'Your supervisor nods. "I understand. But embarrassment can\'t delay safety reports. We need to work on making this easier for everyone."',
              nextNode: 'o_delayed',
            },
            {
              id: 'b',
              text: '"I thought I could fix it quietly without disrupting production."',
              icon: '🤔',
              score: 35,
              kpiScores: {
                psychological_safety: 30,
                communication: 30,
                error_management: 25,
              },
              feedback: "**Production pressure overrode safety protocol.** This reveals a systemic issue: if workers believe reporting errors will be punished or discouraged, they'll hide them.",
              outcome: 'Your supervisor looks concerned. "Production never outweighs transparency. That\'s a culture issue we need to address."',
              nextNode: 'o_delayed',
            },
          ],
        },
      },

      // ---- NARRATIVE 3: Recovery Protocol ----
      {
        scenarioId: scenario2_5.id,
        nodeKey: 'n3',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "The plant supervisor joins on the radio: \"We can isolate the 12 trucks' worth of contaminated material. Minimal impact if we act now. Good catch stopping it early.\"\n\nYour supervisor turns to you: \"This is exactly why we need people to report immediately. You gave us time to recover.\"",
          next: 'd3',
        },
      },

      // ---- DECISION 3: Learning & Documentation ----
      {
        scenarioId: scenario2_5.id,
        nodeKey: 'd3',
        nodeType: NodeType.DECISION,
        body: {
          question: 'Later that day, your supervisor asks: "Want to help document this for the site safety meeting? Share what you learned?" How do you respond?',
          kpiFocus: ['just_culture', 'leadership'],
          choices: [
            {
              id: 'a',
              text: '"No way. I don\'t want everyone knowing I made a mistake."',
              icon: '🙈',
              score: 20,
              kpiScores: {
                just_culture: 10,
                leadership: 15,
                psychological_safety: 20,
              },
              feedback: "**Understandable fear, but missed leadership opportunity.** Your vulnerability could help others feel safe reporting.\n\n**Cultural Impact:** When people hide their learning moments, others repeat the same errors. Public vulnerability builds site-wide psychological safety.",
              outcome: 'Your supervisor accepts your choice. "Okay. But think about it—your story could help others." You wonder if you missed a chance to contribute.',
              nextNode: 'o_learning_partial',
            },
            {
              id: 'b',
              text: '"Yes. If sharing this helps someone else catch an error earlier, it\'s worth it."',
              icon: '🎤',
              score: 100,
              kpiScores: {
                just_culture: 100,
                leadership: 100,
                psychological_safety: 100,
                learning_culture: 100,
              },
              feedback: "**Exceptional leadership.** By sharing your error publicly, you:\n- Normalize error reporting\n- Build site-wide psychological safety\n- Model just culture principles\n- Prevent others from repeating the mistake\n\n**Aviation Example:** After United 232, the crew shared lessons globally. Thousands of pilots benefited. Vulnerability creates safety.",
              outcome: 'Your supervisor smiles. "That takes courage. This is exactly the culture we\'re trying to build. Thank you."',
              nextNode: 'o_excellence',
            },
            {
              id: 'c',
              text: '"Only if it\'s anonymous. I\'ll share lessons, but don\'t use my name."',
              icon: '🎭',
              score: 65,
              kpiScores: {
                just_culture: 60,
                leadership: 50,
                psychological_safety: 70,
              },
              feedback: "**Compromise approach.** Anonymous sharing preserves lessons but loses some cultural impact.\n\n**Trade-off:** Named sharing builds more psychological safety (\"If she can admit errors, so can I\"), but anonymous is better than silence.",
              outcome: 'Your supervisor agrees. "Works for me. The lessons are what matter most." It\'s a step toward openness.',
              nextNode: 'o_learning_partial',
            },
          ],
        },
      },

      // ---- OUTCOME: Cover-up Failure ----
      {
        scenarioId: scenario2_5.id,
        nodeKey: 'o_coverup_failure',
        nodeType: NodeType.OUTCOME,
        body: {
          title: '❌ Cover-Up Culture: The Opposite of Safety',
          summary: 'Attempting to hide errors destroys trust, prevents recovery, and creates a culture where future errors stay hidden until disaster.',
          kpiResults: {
            error_management: 'Critical Failure',
            psychological_safety: 'Destroyed',
            just_culture: 'Blame Culture',
            systems_thinking: 'Not Applied',
          },
          consequences: [
            '**Immediate:** Trust with supervisor permanently damaged',
            '**Operational:** 2,640 tonnes of contaminated material, delayed discovery increased recovery costs',
            '**Cultural:** Site-wide message: "Errors must be hidden to survive here"',
            '**Safety:** Future errors will be concealed, increasing catastrophic risk',
          ],
          lessons: [
            '**Aviation Truth:** Every major disaster involved hidden errors. Eastern 401, Air France 447, and Tenerife all had crews who delayed admitting mistakes until too late.',
            '**Cover-Up Math:** Hidden error = no recovery time = maximum consequence',
            '**Just Culture:** Systems must reward reporting, not punish honesty',
            '**Error Chain:** Cover-ups add links to the error chain instead of breaking it',
          ],
          aviationContext: 'In 1977, 583 people died at Tenerife because a First Officer hesitated to challenge a Captain\'s error. In 1972, 101 died on Eastern 401 because the crew didn\'t admit altitude error until impact. **Cover-up cultures kill.**',
        },
      },

      // ---- OUTCOME: Delayed Report ----
      {
        scenarioId: scenario2_5.id,
        nodeKey: 'o_delayed',
        nodeType: NodeType.OUTCOME,
        body: {
          title: '⚠️ Delayed Reporting: Better Than Silence, Worse Than Immediate',
          summary: 'You eventually reported the error, which is better than cover-up—but the delay amplified consequences and revealed psychological safety gaps.',
          kpiResults: {
            error_management: 'Needs Improvement',
            psychological_safety: 'Moderate',
            communication: 'Developing',
            just_culture: 'Partial',
          },
          consequences: [
            '**Operational:** 18 trucks, 4,000 tonnes contaminated (vs. 12 trucks if reported immediately)',
            '**Recovery:** Containment more complex and costly',
            '**Trust:** Supervisor questions your judgment but appreciates eventual honesty',
            '**Cultural Signal:** Reporting happened, but hesitation suggests fear or pressure',
          ],
          lessons: [
            '**Timing Matters:** Error management window shrinks every second. Immediate reporting = maximum recovery options.',
            '**Psychological Safety Gap:** If workers delay reports due to fear/embarrassment, the organization has cultural work to do.',
            '**Production vs. Safety:** Any system where workers fear stopping production to report errors is fundamentally unsafe.',
            '**Learning Opportunity:** Your honesty about delay reasons helps leadership improve safety culture.',
          ],
          aviationContext: 'Air France 447 pilots delayed recognizing their stall for 4 critical minutes—all 228 died. Error recognition + immediate action = survival. Delay = catastrophe.',
        },
      },

      // ---- OUTCOME: Learning Partial ----
      {
        scenarioId: scenario2_5.id,
        nodeKey: 'o_learning_partial',
        nodeType: NodeType.OUTCOME,
        body: {
          title: '✅ Good Error Management, Room to Lead',
          summary: 'You managed the error well—immediate reporting, systems analysis, recovery cooperation. Sharing lessons more openly would amplify cultural impact.',
          kpiResults: {
            error_management: 'Excellent',
            communication: 'Strong',
            just_culture: 'Good',
            leadership: 'Developing',
          },
          strengths: [
            '✅ Recognized error immediately and stopped propagation',
            '✅ Initiated recovery protocol without delay',
            '✅ Provided systems analysis, not just self-blame',
            '✅ Cooperated fully with investigation',
          ],
          growthAreas: [
            '**Public Learning:** Sharing lessons openly builds site-wide psychological safety',
            '**Leadership Opportunity:** Your vulnerability could help others feel safe reporting',
            '**Cultural Impact:** Named error-sharing normalizes honesty across organization',
          ],
          lessons: [
            '**Error Management Formula:** Recognize → Report → Recover → Learn → Share',
            '**Swiss Cheese Model:** You identified latent failures (late handover, visual similarity, interface design) + active error (missed cross-check)',
            '**Just Culture:** Organization responded with problem-solving, not punishment—exactly as designed',
            '**Defense in Depth:** Every error reveals opportunities to add system barriers',
          ],
          aviationContext: 'United Airlines 232 crew admitted hydraulic failure instantly, coordinated recovery with ATC, and saved 185 of 296 people. Post-crash, they shared lessons globally—preventing future disasters. **Immediate reporting + public learning = lives saved.**',
        },
      },

      // ---- OUTCOME: Excellence ----
      {
        scenarioId: scenario2_5.id,
        nodeKey: 'o_excellence',
        nodeType: NodeType.OUTCOME,
        body: {
          title: '🏆 Exceptional Error Management & Leadership',
          summary: 'You demonstrated world-class error management: immediate recognition, transparent reporting, systems analysis, and the courage to share lessons publicly.',
          kpiResults: {
            error_management: 'Exceptional',
            communication: 'Excellent',
            just_culture: 'Exemplary',
            leadership: 'Outstanding',
            systems_thinking: 'Strong',
          },
          strengths: [
            '✅ **Immediate Error Recognition:** Stopped propagation within seconds',
            '✅ **Transparent Communication:** Clear, direct report with no delay or deflection',
            '✅ **Systems Analysis:** Identified latent failures (schedule pressure, design, interface) and active errors',
            '✅ **Recovery Cooperation:** Full participation in containment and investigation',
            '✅ **Public Learning:** Chose to share lessons, building site-wide psychological safety',
          ],
          impact: [
            '**Operational:** Minimized contamination to 12 trucks (2,640 tonnes vs. potential 4,000+)',
            '**Financial:** Early detection enabled low-cost recovery',
            '**Cultural:** Your public sharing will encourage others to report errors early',
            '**Safety:** Identified system improvements (handover timing, stockpile marking, interface design)',
          ],
          lessons: [
            '**Error Management Gold Standard:** You followed aviation CRM principles perfectly—recognize, report, recover, learn, share.',
            '**Swiss Cheese Model:** By stopping the error chain immediately, you prevented multiple system failures from aligning into catastrophe.',
            '**Just Culture in Action:** Organization rewarded honesty with problem-solving, not punishment. This is how trust is built.',
            '**Leadership Through Vulnerability:** Your willingness to share mistakes publicly models psychological safety for the entire site.',
            '**Defense in Depth:** Your error revealed 3 systemic improvements: handover scheduling, stockpile visual differentiation, tablet interface redesign.',
          ],
          aviationContext: '**You applied the United 232 principle:** When Captain Al Haynes lost hydraulics, he admitted the failure instantly, coordinated with crew and ATC, and saved 185 lives. Post-crash, he spent years sharing lessons globally.\n\n**Error management truth:** Hidden errors compound. Admitted errors get solved. Shared errors prevent recurrence.\n\n**You didn\'t just manage an error—you strengthened your site\'s safety culture.**',
        },
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Created scenario 2.5: The Wrong Stockpile (Module 5)')

  // ---- Scenario 3: The Authority Gradient (Module 6) ----
  const scenario3 = await prisma.scenario.upsert({
    where: { slug: 'authority-gradient' },
    update: {},
    create: {
      slug: 'authority-gradient',
      title: 'The Authority Gradient: Leadership & Team Dynamics',
      moduleNumber: 6,
      version: 1,
      status: ScenarioStatus.PUBLISHED,
      estimatedMinutes: 14,
      difficulty: Difficulty.INTERMEDIATE,
      kpiFocus: ['leadership', 'psychological_safety', 'communication', 'team_dynamics'],
    },
  })

  await prisma.scenarioNode.createMany({
    data: [
      // ---- NARRATIVE 1: Junior Operator Hesitation ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'n1',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "14:30. You\'re the afternoon shift supervisor, running your daily toolbox meeting with 6 operators. You\'ve been at this mine for 15 years—longest tenure on site. The crew respects you, but some say you can be... intense.\n\nYou\'re explaining tomorrow\'s blast plan when you notice Riley, a 22-year-old dump truck operator (3 months on site), glancing at the blast map with a furrowed brow. She opens her mouth, hesitates, then looks down at her boots.\n\nYou continue the briefing. As the crew disperses, Riley lingers near the door, clearly wanting to say something but looking uncomfortable.",
          atmosphere: {
            time: '14:30',
            weather: 'Overcast',
            location: 'Site Office, Toolbox Room',
            urgency: 'MODERATE',
          },
          characterContext: {
            role: 'Shift Supervisor',
            experience: '15 years',
            pressures: ['Reputation as tough leader', 'Schedule pressure', 'Crew watching'],
          },
          next: 'd1',
        },
      },

      // ---- DECISION 1: Initial Response to Hesitation ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'd1',
        nodeType: NodeType.DECISION,
        body: {
          question: 'Riley is clearly hesitant to speak up during the briefing and now lingers uncomfortably. How do you respond?',
          kpiFocus: ['leadership', 'psychological_safety'],
          choices: [
            {
              id: 'a',
              text: 'Ignore it. If she had something important, she would\'ve spoken up. I have a site to run.',
              icon: '🚶',
              score: 10,
              kpiScores: {
                leadership: 5,
                psychological_safety: 0,
                communication: 10,
                team_dynamics: 5,
              },
              feedback: "**Authority gradient just got steeper.** When leaders ignore hesitation signals, they train teams to stay silent.\n\n**Aviation Truth:** Tenerife disaster (583 deaths) - First Officer hesitated to challenge Captain. Captain didn\'t create space for input. Result: deadliest crash in history.",
              outcome: 'Riley watches you leave, shoulders slumping. She walks to her truck without saying a word. Whatever she noticed goes unreported.',
              nextNode: 'n2_dismissed',
            },
            {
              id: 'b',
              text: 'Walk over privately: "Riley, you looked like you had a question during briefing. What\'s on your mind?"',
              icon: '🤝',
              score: 100,
              kpiScores: {
                leadership: 100,
                psychological_safety: 100,
                communication: 95,
                team_dynamics: 100,
              },
              feedback: "**Exceptional leadership.** You:\n- Noticed non-verbal cues\n- Created private space (reduces social pressure)\n- Used open question (\"What\'s on your mind?\" vs. \"Did you have a question?\")\n- Signaled genuine interest\n\n**This is how flat hierarchies are built—one interaction at a time.**",
              outcome: 'Riley looks relieved. "I... yeah. I noticed something on the blast map. But I wasn\'t sure if it was worth bringing up. You\'ve been doing this way longer than me."',
              nextNode: 'n2_invited',
            },
            {
              id: 'c',
              text: 'Call out in front of the group: "Riley, you\'ve been frowning this whole time. Got a problem with the plan?"',
              icon: '📢',
              score: 25,
              kpiScores: {
                leadership: 20,
                psychological_safety: 15,
                communication: 30,
                team_dynamics: 10,
              },
              feedback: "**Public call-out increases pressure, reduces honesty.** Spotlighting hesitant team members often backfires—they feel put on the spot and defensive.\n\n**CRM Principle:** Create psychological safety through private invitation, not public challenge. United 173 crew members hesitated to challenge Captain about fuel—public hierarchy prevented honest communication.",
              outcome: 'Riley\'s face flushes. "Oh, no problem. Just... thinking." The crew shifts uncomfortably. Whatever Riley noticed, she\'s not sharing it now.',
              nextNode: 'n2_pressured',
            },
          ],
        },
      },

      // ---- NARRATIVE 2A: Dismissed Path ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'n2_dismissed',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "The next morning, the blast goes ahead as planned. Thirty minutes post-blast, a geotechnical alert triggers: unexpected ground movement in Zone 7—exactly where Riley was studying the map yesterday.\n\nNo one is hurt, but production halts for 6 hours while geotech assesses stability. The mine manager asks: \"Did anyone flag concerns before the blast?\"",
          next: 'o_dismissed_failure',
        },
      },

      // ---- NARRATIVE 2B: Invited to Speak (Optimal Path) ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'n2_invited',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "Riley pulls out her phone, showing the blast map photo. \"See Zone 7? We had that rain last week, and I drove past there yesterday—there\'s surface water pooling near the crest. I learned in training that water + blast vibration can cause slope instability. But... I don\'t know, maybe I\'m overthinking it?\"\n\nShe\'s deferring to your experience, but her observation is technically sound.",
          next: 'd2',
        },
      },

      // ---- NARRATIVE 2C: Pressured Publicly ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'n2_pressured',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "Later that day, another operator mentions seeing water pooling near Zone 7. You realize Riley may have been trying to flag the same concern but felt unable to speak up after being put on the spot.\n\nThe blast is tomorrow. You have time to investigate—but you\'ve lost Riley\'s trust.",
          next: 'd2_recovery',
        },
      },

      // ---- DECISION 2: Validating Junior Input ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'd2',
        nodeType: NodeType.DECISION,
        body: {
          question: 'Riley has flagged a valid geotech concern (water pooling + blast vibration). How do you respond?',
          kpiFocus: ['leadership', 'decision_making'],
          choices: [
            {
              id: 'a',
              text: '"Good eye, but the blast engineers already assessed this. They know what they\'re doing. Don\'t worry about it."',
              icon: '👍',
              score: 40,
              kpiScores: {
                leadership: 30,
                decision_making: 35,
                psychological_safety: 40,
                systems_thinking: 20,
              },
              feedback: "**Partial validation, but dismissive follow-through.** You acknowledged her input (\"good eye\") but then dismissed it (\"don\'t worry\").\n\n**Result:** Riley learns her observations aren\'t actionable. Next time, she won\'t bother speaking up.\n\n**Aviation Lesson:** Korean Air had a culture where junior crew observations were acknowledged but rarely acted upon. It took multiple crashes to change.",
              outcome: 'Riley nods but looks unconvinced. She doesn\'t push further. You assume the blast engineers have it covered—but you haven\'t actually verified.',
              nextNode: 'n3_partial',
            },
            {
              id: 'b',
              text: '"That\'s exactly the kind of observation we need. Let\'s walk the site together right now, then I\'ll loop in geotech to verify."',
              icon: '🔍',
              score: 100,
              kpiScores: {
                leadership: 100,
                decision_making: 100,
                psychological_safety: 100,
                team_dynamics: 100,
                systems_thinking: 95,
              },
              feedback: "**World-class leadership.** You:\n- Validated input (\"exactly what we need\")\n- Took immediate action (\"right now\")\n- Involved her in verification (\"together\")\n- Escalated appropriately (\"loop in geotech\")\n- Modeled learning culture\n\n**This is how you flatten authority gradients and build high-reliability teams.**",
              outcome: 'Riley\'s eyes light up. "Really? Okay, yeah, let\'s go." Twenty minutes later, you\'re standing at Zone 7. The pooling is worse than expected. You radio geotech.',
              nextNode: 'n3_validated',
            },
            {
              id: 'c',
              text: '"Interesting. I\'ll mention it to the blast engineer. Thanks for bringing it up."',
              icon: '📝',
              score: 60,
              kpiScores: {
                leadership: 55,
                decision_making: 50,
                psychological_safety: 65,
                systems_thinking: 45,
              },
              feedback: "**Better than dismissal, but lacks urgency and involvement.** You\'ll escalate, but Riley is left out of the loop.\n\n**Leadership Missed Opportunity:** Involving junior team members in problem-solving builds competence and psychological safety. You acknowledged her input but didn\'t empower her.",
              outcome: 'Riley feels heard, but wonders if anything will actually happen. You make a mental note to call geotech later—but the afternoon gets busy.',
              nextNode: 'n3_deferred',
            },
          ],
        },
      },

      // ---- DECISION 2 (RECOVERY PATH): Rebuilding Trust ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'd2_recovery',
        nodeType: NodeType.DECISION,
        body: {
          question: 'You realize Riley was trying to flag the water pooling issue but felt shut down. How do you rebuild trust?',
          kpiFocus: ['leadership', 'psychological_safety'],
          choices: [
            {
              id: 'a',
              text: 'Investigate the water pooling issue, fix it, but don\'t address the earlier interaction with Riley.',
              icon: '🔧',
              score: 50,
              kpiScores: {
                leadership: 45,
                psychological_safety: 40,
                decision_making: 60,
              },
              feedback: "**You fixed the technical problem but not the cultural one.** Riley learns that speaking up is risky and uncomfortable—even when you\'re right.\n\n**Missed Opportunity:** Repairing relationships after leadership missteps is critical. Ignoring it signals that psychological safety doesn\'t matter.",
              outcome: 'The geotech issue is addressed, but Riley remains cautious around you. The authority gradient just got steeper.',
              nextNode: 'o_recovery_partial',
            },
            {
              id: 'b',
              text: 'Pull Riley aside: "I owe you an apology. I put you on the spot earlier and shut down what turned out to be a valid concern. That was poor leadership. How can I do better?"',
              icon: '🙏',
              score: 95,
              kpiScores: {
                leadership: 100,
                psychological_safety: 95,
                communication: 100,
                team_dynamics: 90,
              },
              feedback: "**Exceptional leadership recovery.** You:\n- Acknowledged the mistake publicly to Riley\n- Owned the impact (\"shut down a valid concern\")\n- Named it as a leadership failure (accountability)\n- Asked for her input (\"How can I do better?\")\n\n**Aviation Standard:** The best CRM cultures admit and learn from leadership errors. This is how you rebuild psychological safety.",
              outcome: 'Riley is visibly surprised. "I... thank you. That means a lot. Maybe just—when someone looks unsure, give them space to share privately?" You nod and investigate the geotech issue together.',
              nextNode: 'n3_validated',
            },
          ],
        },
      },

      // ---- NARRATIVE 3A: Partial Validation ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'n3_partial',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "The blast proceeds the next morning. Post-blast monitoring detects minor ground movement in Zone 7—not catastrophic, but enough to halt operations for 4 hours while geotech assesses.\n\nRiley watches from her truck. She was right—but learned her concerns don\'t trigger action. **That lesson will shape her behavior for years.**",
          next: 'o_partial',
        },
      },

      // ---- NARRATIVE 3B: Validated and Involved ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'n3_validated',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "Geotech arrives within 30 minutes. After assessment, the lead engineer radios: \"Good catch. We need to pump that water and delay the blast 24 hours for stability monitoring.\"\n\nShe looks at you and Riley: \"Who spotted this?\" You gesture to Riley. The engineer extends a hand: \"Nice work. That could\'ve been a real problem.\"",
          next: 'd3',
        },
      },

      // ---- NARRATIVE 3C: Deferred Action ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'n3_deferred',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "The afternoon gets busy. You forget to call geotech. The blast proceeds the next morning. Post-blast, minor ground movement is detected in Zone 7—exactly what Riley flagged.\n\nNo one is hurt, but production halts for 4 hours. Riley hears about it and thinks: \"I tried to tell them.\" **She learns her voice doesn\'t matter.**",
          next: 'o_deferred',
        },
      },

      // ---- DECISION 3: Public Recognition ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'd3',
        nodeType: NodeType.DECISION,
        body: {
          question: 'Riley\'s observation prevented a potential slope failure. Tomorrow\'s toolbox meeting—26 operators. How do you handle it?',
          kpiFocus: ['leadership', 'psychological_safety'],
          choices: [
            {
              id: 'a',
              text: 'Don\'t mention it. Riley knows she did well—public praise might embarrass her or make others jealous.',
              icon: '🤐',
              score: 30,
              kpiScores: {
                leadership: 25,
                psychological_safety: 30,
                team_dynamics: 20,
                learning_culture: 10,
              },
              feedback: "**Missed cultural opportunity.** Public recognition of junior voices:\n- Normalizes speaking up across experience levels\n- Shows that observations lead to real action\n- Builds site-wide psychological safety\n\n**Silence sends a message too:** \"Input happens in the shadows, not openly.\"",
              outcome: 'The briefing covers the blast delay but doesn\'t mention Riley\'s role. Operators assume it was a routine geotech decision. Riley feels undervalued.',
              nextNode: 'o_validated_partial',
            },
            {
              id: 'b',
              text: 'Open toolbox meeting: "Yesterday, Riley flagged a geotech concern that could\'ve caused a slope failure. Her observation saved us time, money, and risk. This is exactly why we need everyone\'s eyes on safety—experience doesn\'t matter, good observations do."',
              icon: '📢',
              score: 100,
              kpiScores: {
                leadership: 100,
                psychological_safety: 100,
                team_dynamics: 100,
                learning_culture: 100,
                communication: 95,
              },
              feedback: "**Exceptional leadership messaging.** You:\n- Gave specific credit (\"Riley flagged...\")\n- Explained impact (\"saved us time, money, risk\")\n- Reinforced cultural value (\"everyone\'s eyes\")\n- Flattened hierarchy (\"experience doesn\'t matter\")\n\n**Avianca 052 Lesson:** When junior crew members learn their voices don\'t matter, disasters happen. You just prevented that.",
              outcome: 'Riley stands taller. Other junior operators exchange glances—they just learned speaking up is valued. Your authority gradient just flattened.',
              nextNode: 'o_excellence',
            },
            {
              id: 'c',
              text: 'Privately thank Riley again, and mention it casually to a few senior operators: "Keep an eye out for observations from the newer crew—they catch things we miss."',
              icon: '🗣️',
              score: 70,
              kpiScores: {
                leadership: 65,
                psychological_safety: 70,
                team_dynamics: 60,
                learning_culture: 55,
              },
              feedback: "**Good intent, limited cultural impact.** Private recognition is valuable, but public recognition:\n- Normalizes upward communication site-wide\n- Shows junior operators their peers are heard\n- Models vulnerability (\"they catch things we miss\")\n\n**Half-measure:** You\'re building culture with seniors, but juniors don\'t see it.",
              outcome: 'Senior operators appreciate the reminder. But the broader crew never learns what Riley\'s observation prevented. Cultural impact is limited.',
              nextNode: 'o_validated_partial',
            },
          ],
        },
      },

      // ---- OUTCOME: Dismissed Failure ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'o_dismissed_failure',
        nodeType: NodeType.OUTCOME,
        body: {
          title: '❌ Steep Authority Gradient: Silenced Voices',
          summary: 'By ignoring Riley\'s hesitation, you reinforced a culture where junior team members stay silent—even when they notice critical safety issues.',
          kpiResults: {
            leadership: 'Critical Failure',
            psychological_safety: 'Absent',
            team_dynamics: 'Hierarchical',
            communication: 'One-Way',
          },
          consequences: [
            '**Operational:** 6-hour production loss due to unaddressed geotech issue',
            '**Cultural:** Riley learned speaking up is pointless—she won\'t try again',
            '**Team Impact:** Other operators witnessed leadership ignore hesitation cues',
            '**Safety:** Future observations will go unreported, increasing catastrophic risk',
          ],
          lessons: [
            '**Tenerife Truth:** 583 people died because a First Officer hesitated to challenge a Captain, and the Captain didn\'t create space for input. Steep authority gradients kill.',
            '**Leadership = Noticing:** Effective leaders read non-verbal cues (furrowed brows, hesitation, lingering) and create space for input.',
            '**Silence Isn\'t Neutral:** Ignoring hesitation trains teams to stay silent. Every ignored signal steepens the hierarchy.',
            '**Aviation Standard:** CRM flattens hierarchies intentionally. Captains invite input. First Officers are trained to assert. Your interaction did the opposite.',
          ],
          aviationContext: '**United Airlines 173 (1978):** Captain fixated on landing gear issue. Crew noticed fuel running low but hesitated to challenge him forcefully. Plane crashed short of runway—10 died. Post-crash finding: **Steep authority gradient prevented crew communication.**\n\n**Your scenario mirrors this perfectly.** Riley had critical info. You ignored her cues. The system failed.',
        },
      },

      // ---- OUTCOME: Partial Validation ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'o_partial',
        nodeType: NodeType.OUTCOME,
        body: {
          title: '⚠️ Acknowledged But Not Empowered',
          summary: 'You created space for Riley to speak, but dismissed her concern without investigation. She was right—and learned her voice doesn\'t trigger action.',
          kpiResults: {
            leadership: 'Developing',
            psychological_safety: 'Moderate',
            decision_making: 'Needs Improvement',
            team_dynamics: 'Improving',
          },
          consequences: [
            '**Operational:** 4-hour delay due to unverified geotech issue',
            '**Cultural:** Riley learned: \"I can speak, but I won\'t be heard\"',
            '**Trust Impact:** Partial—Riley tried once, but won\'t push hard next time',
            '**Systemic:** Deference to \"experts\" prevented ground-level verification',
          ],
          lessons: [
            '**Authority Gradient Paradox:** You invited input (good!) but then deferred to assumed expertise without verification (bad). Riley\'s observation was dismissed by proxy.',
            '**Verification Matters:** \"The engineers assessed it\" is only valid if you actually verify. Assumptions create gaps.',
            '**Empowerment = Action:** Psychological safety requires that speaking up leads to visible action, not just acknowledgment.',
            '**Korean Air Lesson:** Junior crew members would report issues, but Captains rarely acted on them. It took systemic culture change to fix.',
          ],
          aviationContext: '**Avianca 052 (1990):** Junior crew noticed fuel emergency but didn\'t assert strongly. Captain and ATC assumed \"we\'re fine.\" Plane ran out of fuel on approach—73 died.\n\n**Key Finding:** Junior voices were heard but not acted upon. **Acknowledgment without action = false psychological safety.**',
        },
      },

      // ---- OUTCOME: Deferred Action ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'o_deferred',
        nodeType: NodeType.OUTCOME,
        body: {
          title: '⚠️ Good Intentions, Poor Follow-Through',
          summary: 'You acknowledged Riley\'s concern and intended to escalate—but follow-through failed. Riley learns her voice isn\'t a priority.',
          kpiResults: {
            leadership: 'Needs Improvement',
            psychological_safety: 'Fragile',
            decision_making: 'Poor',
            communication: 'Inconsistent',
          },
          consequences: [
            '**Operational:** 4-hour production loss from preventable issue',
            '**Credibility:** Riley tried to help and was ignored—trust damaged',
            '**Cultural:** \"They say they want input, but nothing happens\"',
            '**Future:** Riley won\'t bother speaking up next time',
          ],
          lessons: [
            '**Follow-Through Is Leadership:** Good intentions mean nothing if action doesn\'t follow. Riley\'s observation died in your mental to-do list.',
            '**Busy Isn\'t an Excuse:** Safety escalations can\'t wait for \"when I have time.\" Urgency signals priority.',
            '**Feedback Loop:** If people never see their input lead to action, they stop providing input. You broke the loop.',
            '**Systems Thinking:** A culture that values safety observations requires **systems that ensure follow-through**—not reliance on memory.',
          ],
          aviationContext: '**United 173 crash:** Crew members mentioned low fuel multiple times. Captain acknowledged but didn\'t act with urgency. Plane crashed—10 died.\n\n**Pattern:** Acknowledgment + delayed action = disaster. Your scenario followed this exactly.',
        },
      },

      // ---- OUTCOME: Recovery Partial ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'o_recovery_partial',
        nodeType: NodeType.OUTCOME,
        body: {
          title: '✅ Technical Fix, Cultural Miss',
          summary: 'You addressed the geotech issue, but didn\'t repair the relationship with Riley. The technical problem is solved; the cultural problem persists.',
          kpiResults: {
            leadership: 'Developing',
            psychological_safety: 'At Risk',
            decision_making: 'Good',
            communication: 'One-Way',
          },
          strengths: [
            '✅ Investigated and resolved geotech issue',
            '✅ Prevented slope failure',
            '✅ Acted on information once you had it',
          ],
          growthAreas: [
            '**Relationship Repair:** Leadership errors (public call-out) require explicit acknowledgment and apology',
            '**Psychological Safety Is Fragile:** One bad interaction can silence someone for months—or years',
            '**Cultural Debt:** Unaddressed leadership mistakes accumulate, steepening authority gradients over time',
          ],
          lessons: [
            '**Technical vs. Cultural Problems:** You solved the immediate risk but didn\'t address the leadership failure that almost prevented discovery.',
            '**Apologies Matter:** Admitting leadership mistakes builds trust. Ignoring them erodes it.',
            '**Long-Term Impact:** Riley will hesitate next time. So will anyone else who witnessed the interaction.',
          ],
          aviationContext: '**CRM Training Evolution:** Early CRM focused on technical skills. Modern CRM emphasizes relationship repair, acknowledgment of errors, and explicit apologies when leaders make mistakes.\n\n**You handled the technical side—but missed the human side.**',
        },
      },

      // ---- OUTCOME: Validated Partial ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'o_validated_partial',
        nodeType: NodeType.OUTCOME,
        body: {
          title: '✅ Good Leadership, Missed Cultural Amplification',
          summary: 'You validated Riley, involved her in problem-solving, and prevented a slope failure. Public recognition would have amplified cultural impact site-wide.',
          kpiResults: {
            leadership: 'Strong',
            psychological_safety: 'Good',
            decision_making: 'Excellent',
            team_dynamics: 'Improving',
          },
          strengths: [
            '✅ Created space for Riley to share concern',
            '✅ Took immediate investigative action',
            '✅ Involved Riley in verification process',
            '✅ Escalated appropriately to geotech',
            '✅ Prevented slope failure',
          ],
          growthAreas: [
            '**Public Recognition:** Site-wide messaging reinforces cultural values beyond individual interactions',
            '**Modeling for Others:** When junior operators see peers recognized, they learn speaking up is safe',
            '**Authority Gradient:** Private validation helps one person; public validation flattens hierarchy for everyone',
          ],
          lessons: [
            '**Individual vs. Systemic Impact:** You built trust with Riley (excellent), but didn\'t leverage the moment to shape broader culture.',
            '**Leadership Visibility:** Public recognition of junior voices signals: \"Experience doesn\'t gatekeep safety input here.\"',
            '**Missed Opportunity:** Riley\'s story could have inspired other hesitant operators to speak up. Instead, only she benefited.',
          ],
          aviationContext: '**CRM Culture Shift:** Airlines transformed safety by publicly celebrating examples of junior crew asserting concerns. You handled Riley perfectly—but imagine if 25 other operators learned from her example.',
        },
      },

      // ---- OUTCOME: Excellence ----
      {
        scenarioId: scenario3.id,
        nodeKey: 'o_excellence',
        nodeType: NodeType.OUTCOME,
        body: {
          title: '🏆 Exceptional Leadership: Flattening the Authority Gradient',
          summary: 'You noticed hesitation, created space for input, validated the concern, involved Riley in verification, and publicly reinforced the cultural value site-wide. This is textbook CRM leadership.',
          kpiResults: {
            leadership: 'Exceptional',
            psychological_safety: 'Excellent',
            team_dynamics: 'High-Performing',
            communication: 'Open',
            learning_culture: 'Strong',
          },
          strengths: [
            '✅ **Read Non-Verbal Cues:** Noticed Riley\'s hesitation during briefing',
            '✅ **Created Private Space:** Invited input without public pressure',
            '✅ **Immediate Action:** Investigated together, modeled urgency',
            '✅ **Appropriate Escalation:** Looped in geotech for expert verification',
            '✅ **Public Recognition:** Reinforced cultural values site-wide',
            '✅ **Flattened Hierarchy:** Explicitly stated \"experience doesn\'t matter, observations do\"',
          ],
          impact: [
            '**Operational:** Prevented slope failure, avoided potential injuries and production loss',
            '**Individual:** Riley learned her voice matters—she\'ll speak up again',
            '**Team-Wide:** 25 operators learned junior voices are valued here',
            '**Cultural:** Authority gradient measurably flattened—psychological safety increased',
          ],
          lessons: [
            '**Leadership Is Noticing:** You read Riley\'s non-verbal cues (furrowed brow, hesitation, lingering). Most leaders miss these signals.',
            '**Invitation > Command:** You created space (\"What\'s on your mind?\") instead of demanding (\"What\'s your problem?\").',
            '**Action Validates Words:** Riley didn\'t just feel heard—she saw her observation lead to immediate investigation and expert escalation.',
            '**Public Recognition Amplifies:** By sharing Riley\'s story in the toolbox meeting, you taught 25 other operators that speaking up leads to positive outcomes.',
            '**Experience Doesn\'t Equal Expertise:** Your statement (\"experience doesn\'t matter, observations do\") explicitly flattened the hierarchy. Junior operators now know their input has equal weight.',
          ],
          aviationContext: '**Tenerife (1977) vs. Your Scenario:**\n- **Tenerife:** First Officer hesitated. Captain didn\'t create space. 583 died.\n- **Your Site:** Riley hesitated. You created space. Slope failure prevented.\n\n**The difference? Your leadership.**\n\n**United 173 Aftermath:** Post-crash, United Airlines completely redesigned CRM training. Captains were taught to:\n1. Notice hesitation cues\n2. Explicitly invite input\n3. Validate junior observations\n4. Take immediate action\n5. Publicly reinforce the behavior\n\n**You just demonstrated all five.** This is world-class CRM leadership applied to mining.\n\n**Korean Air Transformation:** Once one of the world\'s most dangerous airlines (steep authority gradient, junior crew afraid to speak), Korean Air flattened hierarchies through:\n- Leadership training (what you just did)\n- Public recognition of upward communication\n- Explicit cultural messaging (\"rank doesn\'t matter in safety\")\n\n**Result:** Korean Air became one of the safest airlines globally.\n\n**You just took the first step toward building that culture at your site.**',
        },
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Created scenario 3: The Authority Gradient (Module 6)')

  // ---- Scenario 4: Emergency Radio Failure (Module 10) ----
  const scenario4 = await prisma.scenario.upsert({
    where: { slug: 'emergency-radio-failure' },
    update: {},
    create: {
      slug: 'emergency-radio-failure',
      title: 'Emergency: Radio Failure',
      moduleNumber: 10,
      version: 1,
      status: ScenarioStatus.PUBLISHED,
      estimatedMinutes: 10,
      difficulty: Difficulty.ADVANCED,
      kpiFocus: ['emergency_response', 'communication', 'leadership'],
    },
  })

  await prisma.scenarioNode.createMany({
    data: [
      {
        scenarioId: scenario4.id,
        nodeKey: 'n1',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: "13:45. Rock fall in South pit. Dust cloud. Radio system down. You're the senior supervisor on site.",
          atmosphere: {
            time: '13:45 PM',
            weather: 'Clear, dust from rockfall',
            location: 'South pit',
            urgency: 'HIGH',
          },
          next: 'd1',
        },
      },
      {
        scenarioId: scenario4.id,
        nodeKey: 'd1',
        nodeType: NodeType.DECISION,
        body: {
          question: 'First action?',
          kpiFocus: ['emergency_response', 'leadership'],
          pressureTimer: 60,
          choices: [
            {
              id: 'a',
              text: 'Wait for radio fix',
              icon: '⏸️',
              score: 10,
              kpiScores: {
                emergency_response: 5,
                leadership: 15,
                decision_making: 10,
              },
              feedback:
                'In emergencies, waiting is rarely the right answer. Leadership requires decisive action.',
              outcome:
                'Delay allows situation to deteriorate. Crew confused. Opportunity lost.',
              nextNode: 'o_failure',
            },
            {
              id: 'b',
              text: 'Activate emergency protocol, visual signals',
              icon: '🚨',
              score: 100,
              kpiScores: {
                emergency_response: 100,
                leadership: 95,
                decision_making: 100,
                communication: 90,
              },
              feedback:
                'Perfect. You immediately activated backup systems and took command. This is crisis management excellence.',
              outcome:
                'Crew evacuates using hand signals. All personnel accounted. Zero injuries.',
              nextNode: 'o_success',
            },
            {
              id: 'c',
              text: 'Drive around warning people',
              icon: '🚗',
              score: 45,
              kpiScores: {
                emergency_response: 40,
                leadership: 50,
                decision_making: 45,
              },
              feedback:
                'Good intent but inefficient. Emergency protocols exist for exactly this scenario.',
              outcome:
                'Takes too long. Some crew already evacuating. Confusion about who is in charge.',
              nextNode: 'n2',
            },
          ],
        },
      },
      {
        scenarioId: scenario4.id,
        nodeKey: 'n2',
        nodeType: NodeType.NARRATIVE,
        body: {
          text: 'Dust settles. You realize 2 trucks unaccounted for. No radio contact.',
          next: 'd2',
        },
      },
      {
        scenarioId: scenario4.id,
        nodeKey: 'd2',
        nodeType: NodeType.DECISION,
        body: {
          question: 'How do you account for missing personnel?',
          kpiFocus: ['emergency_response', 'situational_awareness'],
          choices: [
            {
              id: 'a',
              text: 'Send search teams',
              icon: '🔍',
              score: 60,
              kpiScores: {
                emergency_response: 55,
                situational_awareness: 65,
                leadership: 60,
              },
              feedback:
                'Reasonable, but in unstable conditions this risks more people. Check muster points first.',
              outcome:
                'Both drivers at muster point. Search was unnecessary risk.',
              nextNode: 'o_success',
            },
            {
              id: 'b',
              text: 'Check digital tracking/muster point',
              icon: '📍',
              score: 95,
              kpiScores: {
                emergency_response: 100,
                situational_awareness: 95,
                decision_making: 90,
              },
              feedback:
                'Excellent use of technology and protocols. Verify before deploying rescue.',
              outcome:
                'GPS shows both trucks at safe location. Drivers confirm via runner.',
              nextNode: 'o_success',
            },
          ],
        },
      },
      {
        scenarioId: scenario4.id,
        nodeKey: 'o_success',
        nodeType: NodeType.OUTCOME,
        body: {
          title: 'Crisis Management Success',
          summary:
            'You demonstrated excellent emergency response, activated protocols, and maintained situational awareness under pressure.',
          kpiResults: {
            emergency_response: 'Excellent',
            leadership: 'Strong',
            communication: 'Adapted well',
            situational_awareness: 'Maintained',
          },
          lessons: [
            'Emergency protocols exist for when primary systems fail',
            'Decisive leadership prevents confusion in crisis',
            'Use all available information before deploying rescue',
          ],
        },
      },
      {
        scenarioId: scenario4.id,
        nodeKey: 'o_failure',
        nodeType: NodeType.OUTCOME,
        body: {
          title: 'Emergency Response Needs Improvement',
          summary:
            'Hesitation and unclear leadership during crisis. Review emergency protocols and command structure.',
          kpiResults: {
            emergency_response: 'Reactive',
            leadership: 'Unclear',
            decision_making: 'Delayed',
          },
          lessons: [
            'Emergencies require immediate activation of protocols',
            'Leadership vacuum leads to confusion and risk',
            'Backup communication systems must be rehearsed',
          ],
        },
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Created scenario 4: Emergency Radio Failure (Module 10)')

  // ============================================================================
  // 6. Link Scenarios to Modules
  // ============================================================================

  await prisma.module.update({
    where: {
      courseId_orderIndex: {
        courseId: course.id,
        orderIndex: 1,
      },
    },
    data: {
      scenarioId: scenario0.id,
    },
  })

  await prisma.module.update({
    where: {
      courseId_orderIndex: {
        courseId: course.id,
        orderIndex: 2,
      },
    },
    data: {
      scenarioId: scenario1.id,
    },
  })

  await prisma.module.update({
    where: {
      courseId_orderIndex: {
        courseId: course.id,
        orderIndex: 3,
      },
    },
    data: {
      scenarioId: scenario1_5.id,
    },
  })

  await prisma.module.update({
    where: {
      courseId_orderIndex: {
        courseId: course.id,
        orderIndex: 4,
      },
    },
    data: {
      scenarioId: scenario2.id,
    },
  })

  await prisma.module.update({
    where: {
      courseId_orderIndex: {
        courseId: course.id,
        orderIndex: 5,
      },
    },
    data: {
      scenarioId: scenario2_5.id,
    },
  })

  await prisma.module.update({
    where: {
      courseId_orderIndex: {
        courseId: course.id,
        orderIndex: 6,
      },
    },
    data: {
      scenarioId: scenario3.id,
    },
  })

  await prisma.module.update({
    where: {
      courseId_orderIndex: {
        courseId: course.id,
        orderIndex: 10,
      },
    },
    data: {
      scenarioId: scenario4.id,
    },
  })

  console.log('✅ Linked scenarios to modules')

  // ============================================================================
  // 7. Create Sample Enrollment (Optional)
  // ============================================================================

  const enrollment = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: learner.id,
        courseId: course.id,
      },
    },
    update: {},
    create: {
      userId: learner.id,
      courseId: course.id,
      status: 'ENROLLED',
      dueAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    },
  })
  console.log('✅ Created sample enrollment for', learner.name)

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log('   - 1 Organization (Pilot Mine Operations)')
  console.log('   - 2 Users (Wayne Bowron, Admin)')
  console.log('   - 1 Course (CRM for Mining)')
  console.log('   - 12 Modules')
  console.log('   - 3 Scenarios (Night Shift, Pre-Start, Emergency)')
  console.log('   - 1 Enrollment\n')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
