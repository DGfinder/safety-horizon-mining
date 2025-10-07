export const module1Sections = [
  // ============================
  // SECTION 1A: WHY Human Factors?
  // ============================
  {
    orderIndex: 1,
    title: 'WHY Human Factors?',
    subtitle: 'The Tenerife Disaster and the Birth of CRM',
    sectionType: 'MIXED',
    estimatedMinutes: 10,
    content: {
      introduction: {
        type: 'text',
        body: `On March 27, 1977, two Boeing 747s collided on the runway at Tenerife Airport in the Canary Islands. 583 people lost their lives in what remains the deadliest accident in aviation history.

The aircraft were not faulty. The weather was poor, but not catastrophic. The pilots were highly experienced professionals.

**So what went wrong?**

The answer changed aviation forever: **Human Factors.**`
      },

      video: {
        type: 'video',
        title: 'The Tenerife Disaster: A Turning Point',
        videoUrl: '/videos/tenerife-disaster.mp4', // placeholder
        thumbnail: '/images/tenerife-thumbnail.jpg',
        transcript: `[Video narration would cover: the sequence of events, miscommunication between crew and ATC, authority gradient issues, stress and fatigue, resulting in the KLM captain's premature takeoff decision]`
      },

      keyStats: {
        type: 'stats',
        stats: [
          {
            number: '80%',
            label: 'Aviation Accidents',
            description: 'Attributed to human factors, not mechanical failure'
          },
          {
            number: '70%',
            label: 'Mining Incidents',
            description: 'Involve human error as a contributing factor'
          },
          {
            number: '$100B+',
            label: 'Annual Cost',
            description: 'Global cost of workplace accidents due to human factors'
          }
        ]
      },

      tenerifeLessons: {
        type: 'text',
        body: `### What Tenerife Taught Us

The investigation revealed a cascade of human errors:

- **Communication breakdown:** Misunderstood radio transmissions in poor audio conditions
- **Authority gradient:** Junior officers reluctant to challenge the captain's decision
- **Stress and fatigue:** Crews under pressure from delays and fuel concerns
- **Complacency:** Experienced captain overconfident in routine procedures
- **Situational awareness:** Loss of the big picture due to task fixation

**None of these were about technical skill. All were about human performance.**

This disaster led to the creation of **Crew Resource Management (CRM)** - a systematic approach to managing human factors in high-risk industries.`
      },

      whyMining: {
        type: 'text',
        body: `### Why Does This Matter in Mining?

Mining shares the same characteristics as aviation:
- **High-consequence environment:** Small errors can have catastrophic results
- **Complex systems:** Multiple people, machines, and processes interact
- **Time pressure:** Production targets create stress
- **Hierarchical culture:** Authority gradients can suppress safety concerns
- **24/7 operations:** Fatigue is a constant risk

If aviation learned these lessons the hard way, mining can benefit from their discoveries.`
      },

      objectives: {
        type: 'objectives',
        title: 'By the end of this module, you will be able to:',
        items: [
          'Explain what Human Factors are and why they matter in mining',
          'Identify the 12 Dirty Dozen error precursors in workplace scenarios',
          'Apply the SHELL Model to analyze human-system interactions',
          'Understand how the Swiss Cheese Model explains accident causation',
          'Recognize the parallels between aviation CRM and mining safety culture',
          'Use the 6 core CRM competencies in your daily work'
        ]
      },

      reflection: {
        type: 'reflection',
        prompt: 'Before moving on, think about:',
        questions: [
          'Have you ever witnessed an incident where human factors played a role?',
          'What pressures or conditions in your workplace might lead to errors?',
          'How does your team currently handle mistakes or near-misses?'
        ]
      }
    }
  },

  // ============================
  // SECTION 1B: WHAT is Human Factors?
  // ============================
  {
    orderIndex: 2,
    title: 'WHAT is Human Factors?',
    subtitle: 'The SHELL Model',
    sectionType: 'MIXED',
    estimatedMinutes: 8,
    content: {
      definition: {
        type: 'text',
        body: `### Defining Human Factors

**Human Factors** is the science of understanding how people interact with systems, equipment, and each other - and designing those interactions to optimize human performance and minimize error.

It's not about blaming people. It's about understanding:
- Why people make mistakes
- What conditions make errors more likely
- How we can design systems to prevent or catch errors before they cause harm

Think of it as **engineering for humans**, not just machines.`
      },

      shellIntro: {
        type: 'text',
        body: `### The SHELL Model

Developed by Elwyn Edwards and refined by Frank Hawkins, the SHELL Model is one of the most widely used frameworks for understanding human factors.

**SHELL stands for:**
- **S**oftware
- **H**ardware
- **E**nvironment
- **L**iveware (you)
- **L**iveware (others)

The human (**Liveware**) sits at the center, interacting with four interfaces. When these interfaces don't fit well together, errors occur.`
      },

      shellDiagram: {
        type: 'interactive-diagram',
        title: 'The SHELL Model',
        description: 'Click each component to learn more',
        diagramUrl: '/images/shell-model.svg', // placeholder for future SVG
        hotspots: [
          {
            id: 'software',
            label: 'Software',
            description: 'Procedures, rules, manuals, checklists, policies, symbology'
          },
          {
            id: 'hardware',
            label: 'Hardware',
            description: 'Machines, tools, equipment, controls, displays, PPE'
          },
          {
            id: 'environment',
            label: 'Environment',
            description: 'Physical conditions: noise, heat, light, dust, vibration, altitude'
          },
          {
            id: 'liveware-center',
            label: 'Liveware (You)',
            description: 'The human at the center: your capabilities, limitations, and state'
          },
          {
            id: 'liveware-others',
            label: 'Liveware (Others)',
            description: 'Other people: teamwork, communication, leadership, culture'
          }
        ]
      },

      shellExamples: {
        type: 'text',
        body: `### SHELL in Mining: Real Examples

**Software-Liveware Mismatch:**
- Pre-start checklist written in technical jargon that operators don't understand
- Safety procedure that takes 20 minutes when production pressure only allows 5
- Incident report form so complex nobody fills it out properly

**Hardware-Liveware Mismatch:**
- Controls designed for average-sized person, but operator is very tall or short
- Safety interlock that's awkward to reach, leading to workarounds
- Radio with poor audio quality in high-noise environment

**Environment-Liveware Mismatch:**
- Dust levels making it impossible to see hand signals clearly
- Heat stress reducing concentration during long shifts
- Poor lighting making it hard to read gauges accurately

**Liveware-Liveware Mismatch:**
- Language barriers between crew members
- Cultural differences in how people communicate urgency
- Authority gradient preventing junior worker from speaking up`
      },

      keyPrinciple: {
        type: 'text',
        body: `### The Central Principle

**Humans are not infinitely adaptable.**

For decades, the approach was: "The system is fine, train the human to adapt."

Human Factors flips this: **"Design the system to fit the human."**

We can't eliminate human limitations (fatigue, distraction, memory lapses), but we can design systems that account for them.`
      },

      checkYourUnderstanding: {
        type: 'interactive',
        title: 'Check Your Understanding',
        activityType: 'matching',
        instruction: 'Match each SHELL component to the mining example:',
        pairs: [
          { left: 'Software', right: 'Underground communication protocol' },
          { left: 'Hardware', right: 'Haul truck cabin controls' },
          { left: 'Environment', right: 'Dust and noise levels' },
          { left: 'Liveware (You)', right: 'Operator fatigue and workload' },
          { left: 'Liveware (Others)', right: 'Team coordination during blasting' }
        ]
      }
    }
  },

  // ============================
  // SECTION 1C: The 12 Dirty Dozen
  // ============================
  {
    orderIndex: 3,
    title: 'The 12 Dirty Dozen',
    subtitle: 'Error Precursors in High-Risk Work',
    sectionType: 'MIXED',
    estimatedMinutes: 12,
    content: {
      introduction: {
        type: 'text',
        body: `### The Dirty Dozen

In the 1990s, Transport Canada identified **12 common human error precursors** that appear again and again in aviation incidents. These became known as the "Dirty Dozen."

These aren't personality flaws or moral failings. They're **normal human states** that increase the likelihood of making a mistake.

**Key insight:** If you can recognize these conditions in yourself or your team, you can take steps to mitigate the risk before an error occurs.`
      },

      dirtyDozenGrid: {
        type: 'grid',
        title: 'The 12 Dirty Dozen',
        categories: [
          {
            name: 'Physical States',
            color: 'red',
            items: [
              {
                number: 1,
                name: 'Fatigue',
                icon: '😴',
                description: 'Physical or mental exhaustion reducing alertness and performance',
                miningExample: 'Operator on 12-hour night shift, 6th consecutive day, making errors in load calculations'
              },
              {
                number: 2,
                name: 'Stress',
                icon: '😰',
                description: 'Excessive pressure (time, workload, personal issues) impairing judgment',
                miningExample: 'Supervisor rushing crew to meet production target, skipping safety checks'
              },
              {
                number: 3,
                name: 'Complacency',
                icon: '😌',
                description: 'Over-confidence from routine, leading to reduced vigilance',
                miningExample: 'Experienced driller skipping pre-start checks: "I have done this a thousand times"'
              }
            ]
          },
          {
            name: 'Cognitive States',
            color: 'orange',
            items: [
              {
                number: 4,
                name: 'Lack of Knowledge',
                icon: '❓',
                description: 'Insufficient training or understanding to perform task safely',
                miningExample: 'New operator unaware of specific hazards in underground void areas'
              },
              {
                number: 5,
                name: 'Distraction',
                icon: '📱',
                description: 'Attention diverted from primary task',
                miningExample: 'Mobile equipment operator texting while driving, misses stop sign'
              },
              {
                number: 6,
                name: 'Lack of Awareness',
                icon: '🔍',
                description: 'Failure to perceive or understand current situation (situational awareness)',
                miningExample: 'Truck driver unaware another vehicle is in their blind spot during reversing'
              }
            ]
          },
          {
            name: 'Social States',
            color: 'blue',
            items: [
              {
                number: 7,
                name: 'Lack of Communication',
                icon: '🔇',
                description: 'Failure to share critical information clearly and completely',
                miningExample: 'Outgoing shift not briefing incoming shift about equipment malfunction'
              },
              {
                number: 8,
                name: 'Lack of Teamwork',
                icon: '🤝',
                description: 'Poor coordination, cooperation, or mutual support',
                miningExample: 'Crew members working in isolation, not watching out for each other\'s safety'
              },
              {
                number: 9,
                name: 'Lack of Assertiveness',
                icon: '🙊',
                description: 'Reluctance to speak up or challenge when something seems wrong',
                miningExample: 'Junior worker notices unsafe condition but doesn\'t report it to supervisor'
              }
            ]
          },
          {
            name: 'Organizational Factors',
            color: 'purple',
            items: [
              {
                number: 10,
                name: 'Lack of Resources',
                icon: '🔧',
                description: 'Insufficient tools, equipment, time, or personnel to do the job properly',
                miningExample: 'Maintenance team forced to use improvised tools because proper parts are backordered'
              },
              {
                number: 11,
                name: 'Pressure',
                icon: '⏱️',
                description: 'Real or perceived demands to cut corners or rush',
                miningExample: 'Management message: "Production is down, we need to catch up this shift"'
              },
              {
                number: 12,
                name: 'Norms',
                icon: '👥',
                description: 'Unwritten rules or habits that normalize unsafe practices',
                miningExample: 'Site culture where "everyone" bypasses this annoying safety interlock'
              }
            ]
          }
        ]
      },

      recognitionGuide: {
        type: 'text',
        body: `### How to Use the Dirty Dozen

**1. Self-Check:** Before starting high-risk tasks, ask yourself:
   - Am I fatigued? Stressed? Distracted?
   - Do I fully understand this task?
   - Do I have the right resources and support?

**2. Team Check:** Look out for these signs in colleagues:
   - Unusual quietness or irritability (stress)
   - Repeated errors or slow response (fatigue, distraction)
   - Skipping steps in familiar tasks (complacency)

**3. Mitigate:** If you identify a Dirty Dozen condition:
   - **Stop:** Don't proceed with high-risk task in compromised state
   - **Speak Up:** Tell your supervisor or team
   - **Mitigate:** Get rest, ask for help, double-check work, take a break`
      },

      realScenario: {
        type: 'text',
        body: `### Real Mining Incident (Simplified)

An experienced truck driver was involved in a collision after 10 hours on shift. Investigation found:

- **Fatigue:** Driver on 6th consecutive 12-hour shift
- **Pressure:** Production targets behind due to equipment breakdown earlier in week
- **Norms:** Site culture of "pushing through" without breaks to meet targets
- **Complacency:** Driver very experienced, stopped doing full pre-drive checks
- **Lack of Awareness:** Didn't notice another vehicle due to reduced alertness

**Not one error - a combination of Dirty Dozen conditions creating the perfect storm.**`
      }
    }
  },

  // ============================
  // SECTION 1D: Swiss Cheese Model
  // ============================
  {
    orderIndex: 4,
    title: 'The Swiss Cheese Model',
    subtitle: 'How Accidents Happen',
    sectionType: 'MIXED',
    estimatedMinutes: 10,
    content: {
      introduction: {
        type: 'text',
        body: `### Why Do Accidents Happen?

**Old thinking:** "Someone made a mistake. Find them. Punish them. Problem solved."

**Human Factors thinking:** "Accidents happen when multiple layers of defense fail at the same time."

This is the **Swiss Cheese Model**, developed by psychologist James Reason in 1990.`
      },

      cheeseModel: {
        type: 'text',
        body: `### The Swiss Cheese Model

Imagine your safety system as a stack of Swiss cheese slices. Each slice is a **defense layer**:

1. **Organizational Layer:** Safety policies, regulations, training programs
2. **Supervision Layer:** Audits, inspections, management oversight
3. **Preconditions Layer:** Worker fitness, equipment condition, environmental factors
4. **Actions Layer:** The sharp end - what operators actually do

Each slice has **holes** - weaknesses or failures in that layer:
- A policy that's unclear
- An inspection that was skipped
- A fatigued worker
- A distracted moment

**Most of the time, the holes don't line up.** One layer catches what another missed.

**But sometimes...** all the holes align. The hazard passes straight through. **Accident.**`
      },

      cheeseVisual: {
        type: 'interactive-diagram',
        title: 'Swiss Cheese Model Visualization',
        description: 'See how defenses can fail',
        diagramUrl: '/images/swiss-cheese.svg', // Placeholder
        hotspots: [
          {
            id: 'org-layer',
            label: 'Organizational Influences',
            description: 'Policies, budgets, safety culture, resource allocation'
          },
          {
            id: 'supervision-layer',
            label: 'Unsafe Supervision',
            description: 'Inadequate oversight, failure to correct known problems'
          },
          {
            id: 'precondition-layer',
            label: 'Preconditions for Unsafe Acts',
            description: 'Fatigue, time pressure, poor equipment, inadequate training'
          },
          {
            id: 'actions-layer',
            label: 'Unsafe Acts',
            description: 'Errors and violations by frontline workers'
          }
        ]
      },

      keyInsights: {
        type: 'text',
        body: `### Key Insights from the Swiss Cheese Model

**1. Accidents are rarely caused by a single error**
   - They result from a chain of failures across multiple layers
   - Remove any one failure, and the accident might not happen

**2. Focus on systems, not just individuals**
   - Blaming the operator ignores the organizational holes that allowed the error
   - Why was the operator fatigued? Why was the equipment poorly maintained? Why was the procedure unclear?

**3. Active failures vs. latent conditions**
   - **Active failures:** The immediate trigger (operator error, equipment failure)
   - **Latent conditions:** Underlying weaknesses that have been there for a while (poor training, under-resourcing, production pressure)

   Latent conditions are the hidden holes waiting to align.

**4. You can't eliminate all holes**
   - Humans will always make errors
   - Equipment will occasionally fail
   - But you can add more layers, shrink the holes, and prevent alignment`
      },

      miningCaseStudy: {
        type: 'case-study',
        title: 'Mining Incident: Swiss Cheese in Action',
        scenario: `A light vehicle collided with a haul truck at an intersection, resulting in serious injury.`,
        layers: [
          {
            layer: 'Organizational',
            hole: 'Intersection had been identified as high-risk in audit 6 months prior, but upgrade was delayed due to budget constraints'
          },
          {
            layer: 'Supervision',
            hole: 'Site manager aware of near-misses at this location but did not implement interim controls (e.g., speed limit, stop signs)'
          },
          {
            layer: 'Preconditions',
            hole: 'Light vehicle driver on 11th hour of shift, fatigued. Haul truck had non-functioning reversing camera (maintenance backlog)'
          },
          {
            layer: 'Actions',
            hole: 'Light vehicle driver did not come to complete stop. Haul truck operator did not see light vehicle due to blind spot.'
          }
        ],
        outcome: 'All four holes aligned. The hazard (collision risk) passed through every layer.',
        prevention: 'Fixing ANY of these holes could have prevented the accident: budget for intersection upgrade, interim controls, managing fatigue, fixing camera, better stop discipline.'
      },

      justCulture: {
        type: 'text',
        body: `### Just Culture

The Swiss Cheese Model leads to the concept of **Just Culture**:

- **Errors:** System response is to learn and improve defenses
- **At-risk behavior:** System response is to coach and remove obstacles
- **Reckless behavior:** System response is accountability

**Not a blame-free culture.** A **learning culture** that distinguishes between:
- Human error (deserves compassion and system redesign)
- Intentional rule violations (deserves accountability)

Most incidents fall into the first category.`
      }
    }
  },

  // ============================
  // SECTION 1E: Aviation to Mining
  // ============================
  {
    orderIndex: 5,
    title: 'From Aviation to Mining',
    subtitle: 'How CRM Came to Mining',
    sectionType: 'MIXED',
    estimatedMinutes: 8,
    content: {
      aviationHistory: {
        type: 'text',
        body: `### Aviation's Human Factors Journey

**1950s-60s:** "Pilot error" was the default explanation for crashes. The solution? Better selection, more training, stricter discipline.

**1970s:** Despite improvements in technology and training, accident rates plateaued. Investigations like Tenerife (1977) revealed the real problem: **human factors** like communication, decision-making, and team coordination.

**1979:** NASA workshop coins the term **Crew Resource Management (CRM)** - using all available resources (people, information, equipment) to achieve safe and efficient flight.

**1980s-90s:** CRM becomes mandatory training for all commercial pilots worldwide.

**Result:** Aviation becomes the safest form of transportation. Fatal accident rate drops by 80% over 30 years.`
      },

      parallels: {
        type: 'comparison-table',
        title: 'Aviation and Mining: Striking Parallels',
        rows: [
          {
            characteristic: 'Risk Profile',
            aviation: 'High-consequence, low-frequency events',
            mining: 'High-consequence, low-frequency events'
          },
          {
            characteristic: 'Complexity',
            aviation: 'Multiple interacting systems, people, and processes',
            mining: 'Multiple interacting systems, people, and processes'
          },
          {
            characteristic: 'Teamwork',
            aviation: 'Crew must coordinate seamlessly',
            mining: 'Crew must coordinate seamlessly'
          },
          {
            characteristic: 'Hierarchy',
            aviation: 'Captain has authority (but CRM encourages speaking up)',
            mining: 'Supervisor has authority (but culture often discourages speaking up)'
          },
          {
            characteristic: 'Time Pressure',
            aviation: 'Schedules, fuel, weather',
            mining: 'Production targets, shift handovers'
          },
          {
            characteristic: 'Fatigue Risk',
            aviation: 'Long flights, irregular schedules, time zones',
            mining: 'Long shifts, FIFO, 24/7 operations'
          },
          {
            characteristic: 'Regulatory Environment',
            aviation: 'Highly regulated (FAA, CASA, EASA)',
            mining: 'Highly regulated (DMIRS, state regulators)'
          }
        ]
      },

      whyMiningNeeds: {
        type: 'text',
        body: `### Why Mining Needs CRM

Mining has learned from aviation in many ways (safety management systems, risk assessments, incident investigation). But **Human Factors and CRM principles** have been slower to transfer.

**Why?**
- Mining culture has traditionally been more hierarchical
- "Tough it out" mentality can clash with admitting fatigue or asking for help
- Production pressures can override safety concerns
- Less emphasis on non-technical skills (communication, teamwork) compared to technical competence

**But the parallels are undeniable.** If CRM transformed aviation safety, it can do the same for mining.`
      },

      translationTable: {
        type: 'comparison-table',
        title: 'Translating Aviation CRM to Mining',
        rows: [
          {
            aviation: 'Flight crew',
            mining: 'Shift crew / work team'
          },
          {
            aviation: 'Captain',
            mining: 'Supervisor / Shift boss'
          },
          {
            aviation: 'First Officer / Co-pilot',
            mining: 'Leading hand / Senior operator'
          },
          {
            aviation: 'Cabin crew',
            mining: 'Support crew (maintenance, services)'
          },
          {
            aviation: 'Air Traffic Control',
            mining: 'Dispatch / Mine control'
          },
          {
            aviation: 'Pre-flight briefing',
            mining: 'Pre-start / Toolbox talk'
          },
          {
            aviation: 'Cockpit Resource Management',
            mining: 'Crew Resource Management (same acronym!)'
          },
          {
            aviation: 'Standard Operating Procedures (SOPs)',
            mining: 'Safe Work Procedures / Task instructions'
          },
          {
            aviation: 'Checklists',
            mining: 'Pre-start checklists / Take 5'
          },
          {
            aviation: 'Sterile cockpit (no non-essential talk during critical phases)',
            mining: 'Critical task focus (e.g., during blasting, high-risk lifts)'
          }
        ]
      },

      adoptionChallenges: {
        type: 'text',
        body: `### Challenges in Adopting CRM in Mining

**1. "We're not pilots"**
   - True, but the human factors are the same
   - CRM isn't about flying planes; it's about managing human performance in high-risk environments

**2. "Production comes first"**
   - Aviation learned this lesson: schedule pressure contributed to many accidents
   - **Safety is production** - accidents halt production far longer than safety pauses

**3. "Our people are tough, they don't need to talk about feelings"**
   - CRM isn't therapy. It's about **effective communication** and **team coordination**
   - Asking "Are you too fatigued to operate safely?" is a performance question, not a personal one

**4. "We already have safety systems"**
   - CRM doesn't replace safety systems; it enhances them by addressing the human element
   - Your safety systems are only as good as the people implementing them`
      },

      successStories: {
        type: 'text',
        body: `### Mining Sites That Have Embraced CRM

Progressive mining operations worldwide have adopted CRM principles:

- **Rio Tinto** (Australia): Integrated HF training across operations, focusing on fatigue management and decision-making
- **Barrick Gold** (Global): CRM-based leadership development for supervisors
- **Anglo American** (South Africa): Team communication and assertiveness training following a serious incident

**Common outcomes:**
- Reduction in serious injury rates
- Improved incident reporting (people speak up more)
- Better team coordination during emergencies
- Cultural shift from "blame and shame" to "learn and improve"`
      }
    }
  },

  // ============================
  // SECTION 1F: Introduction to CRM
  // ============================
  {
    orderIndex: 6,
    title: 'Introduction to CRM',
    subtitle: 'The 6 Core Competencies',
    sectionType: 'MIXED',
    estimatedMinutes: 10,
    content: {
      crmDefinition: {
        type: 'text',
        body: `### What is Crew Resource Management?

**CRM is the effective use of all available resources - people, information, and equipment - to achieve safe and efficient operations.**

It's a set of **non-technical skills** (sometimes called "soft skills," though there's nothing soft about preventing fatalities) that complement technical competence.

**CRM recognizes:**
- Technical skills alone are not enough
- Most incidents involve breakdowns in communication, decision-making, or teamwork
- These skills can be trained, practiced, and improved`
      },

      sixCompetencies: {
        type: 'text',
        body: `### The 6 Core CRM Competencies

Based on aviation CRM and adapted for mining, the core competencies are:

1. **Communication**
2. **Situational Awareness**
3. **Decision Making**
4. **Teamwork**
5. **Leadership / Followership**
6. **Stress & Fatigue Management**

Let's explore each one.`
      },

      competencyCards: {
        type: 'expandable-cards',
        cards: [
          {
            title: '1. Communication',
            icon: '💬',
            summary: 'Clear, concise, and complete exchange of information',
            expandedContent: `**What it is:**
- Sharing critical information clearly and confirming understanding
- Active listening (not just hearing, but processing and clarifying)
- Closed-loop communication ("Roger, I will shut down pump 3 in 5 minutes")
- Speaking up when something doesn't seem right

**Why it matters:**
- Most incidents involve communication breakdown somewhere in the chain
- Assumptions kill ("I thought you knew..." / "I assumed you would...")
- In high-noise, high-stress environments, clarity is everything

**In practice:**
- Use standard terminology and phonetic alphabet when needed
- Repeat back critical instructions
- Ask questions if unclear
- Don't assume - verify

**Mining example:**
Supervisor: "Move truck to Bay 5."
Operator: "Copy, moving haul truck 402 to Bay 5 for maintenance. ETA 10 minutes."
Supervisor: "Correct."`
          },
          {
            title: '2. Situational Awareness',
            icon: '🔍',
            summary: 'Knowing what\'s going on around you',
            expandedContent: `**What it is:**
- Perception: What's happening? (noticing cues in environment)
- Comprehension: What does it mean? (understanding significance)
- Projection: What will happen next? (anticipating future state)

**Why it matters:**
- You can't respond to hazards you haven't noticed
- "I didn't see it" is often the root cause of incidents
- Maintaining the "big picture" prevents tunnel vision

**Threats to SA:**
- Distraction, fatigue, complacency
- Task fixation (focus on one thing, miss everything else)
- Information overload

**In practice:**
- Regularly scan your environment (not just what's in front of you)
- Share your mental model with your team ("I'm seeing X, which means Y")
- Speak up if you've lost SA: "I'm unsure of the truck's position, can someone confirm?"

**Mining example:**
Operator notices dust cloud in distance, recognizes it as blast zone becoming active earlier than scheduled, stops vehicle and radios team to confirm before proceeding.`
          },
          {
            title: '3. Decision Making',
            icon: '🧠',
            summary: 'Choosing the best course of action, especially under pressure',
            expandedContent: `**What it is:**
- Identifying the problem accurately
- Considering options and consequences
- Making timely decisions (indecision is also a decision)
- Recognizing when to escalate vs. when to act

**Why it matters:**
- High-risk environments require decisions with incomplete information
- Time pressure can lead to poor choices (e.g., "I'll skip this step to save time")
- Cognitive biases can cloud judgment (e.g., confirmation bias, recency bias)

**Decision-making models:**
- **FORDEC** (aviation): Facts, Options, Risks & Benefits, Decision, Execution, Check
- **STOP** (mining): Stop, Think, Observe, Plan

**In practice:**
- Don't rush critical decisions (unless it's an emergency)
- Consult others when possible (two heads better than one)
- Recognize your own biases (am I choosing this because it's easy, not because it's right?)

**Mining example:**
Equipment shows minor fault light. Operator considers:
- Continue and report at end of shift? (Risk: fault worsens, breakdown, injury)
- Stop and investigate now? (Risk: production delay, but safe)
Decision: Stop, investigate. Finds hydraulic leak that could have caused brake failure.`
          },
          {
            title: '4. Teamwork',
            icon: '🤝',
            summary: 'Working together effectively toward common goals',
            expandedContent: `**What it is:**
- Coordination: Who does what, when?
- Cooperation: Helping each other, sharing workload
- Mutual support: Watching out for each other's safety and performance
- Conflict resolution: Handling disagreements constructively

**Why it matters:**
- Mining is never a solo activity - everyone depends on others
- Effective teams catch each other's errors before they become incidents
- Poor teamwork creates gaps where hazards slip through

**Barriers to teamwork:**
- Silos ("That's not my job")
- Personality clashes
- Cultural or language differences
- Lack of trust

**In practice:**
- Offer help before being asked
- Accept help without ego
- Give and receive feedback constructively
- Acknowledge others' contributions

**Mining example:**
During shift change, outgoing operator briefs incoming operator on equipment quirk ("Brake pedal feels soft, I've logged it for maintenance"). Incoming operator thanks them and stays alert. Teamwork prevented a potential brake failure incident.`
          },
          {
            title: '5. Leadership / Followership',
            icon: '👔',
            summary: 'Leading effectively and following conscientiously',
            expandedContent: `**What it is:**

**Leadership:**
- Setting clear expectations and priorities (safety first, not just words)
- Empowering team members to speak up
- Modeling good HF practices (if you cut corners, they will too)
- Managing workload and resources

**Followership:**
- Understanding your role and responsibilities
- Supporting leaders with information and feedback
- Speaking up when necessary (assertiveness)
- Taking initiative when appropriate

**Why it matters:**
- Authority gradient: junior workers often reluctant to question senior workers or supervisors
- Effective leaders create psychological safety (people feel safe to speak up)
- Effective followers provide the information leaders need to make good decisions

**In practice (Leaders):**
- Explicitly invite input: "What am I missing? Does anyone see a problem with this plan?"
- Thank people who speak up, even if you disagree
- Admit when you don't know something

**In practice (Followers):**
- Use assertive language: "I'm concerned that..." / "I recommend we..."
- Provide facts, not just feelings: "I've noticed X, which could lead to Y"
- Escalate if ignored: "I need you to stop and listen, this is a safety issue"

**Mining example:**
Junior operator notices supervisor about to enter exclusion zone during active blast. Uses assertiveness: "Stop! We're inside the exclusion zone, we need to move back now." Supervisor thanks them - good leadership receives input without ego.`
          },
          {
            title: '6. Stress & Fatigue Management',
            icon: '😴',
            summary: 'Recognizing and managing personal limitations',
            expandedContent: `**What it is:**

**Stress Management:**
- Recognizing when you're under excessive stress (time pressure, personal issues, workload)
- Using techniques to maintain performance (prioritization, delegation, breaks)
- Knowing when stress is impairing your judgment

**Fatigue Management:**
- Recognizing signs of fatigue in yourself and others
- Understanding circadian rhythms and sleep science
- Taking action before fatigue causes errors (rest, rotate tasks, speak up)

**Why it matters:**
- Fatigue and stress are #1 and #2 in the Dirty Dozen for a reason
- Both impair all other CRM competencies (communication, SA, decision-making)
- Mining's shift patterns and FIFO lifestyle create high fatigue risk

**Warning signs:**
- Stress: irritability, tunnel vision, rushing, poor decisions
- Fatigue: micro-sleeps, slower reactions, forgetting steps, reduced vigilance

**In practice:**
- **Self-check** before high-risk tasks: "Am I fit to do this safely right now?"
- **Team check:** "You seem off today, are you okay?"
- **Speak up:** "I'm too tired to do this safely, I need a break / someone to double-check me"
- **Mitigate:** Rotate tasks, take breaks, delay non-urgent work, ask for support

**Mining example:**
Operator on 11th hour of shift, feeling drowsy, about to operate loader near personnel. Self-assessment: "I'm not safe to do this." Tells supervisor, takes 15-minute break and switches to lower-risk task. Potentially prevented a fatality.`
          }
        ]
      },

      crmInAction: {
        type: 'text',
        body: `### CRM in Action: Putting It All Together

**Scenario:** Underground mining, ventilation fan failure detected

**Without CRM:**
- Supervisor makes quick decision alone to continue operations ("We'll fix it at end of shift")
- Crew not informed, continue working in deteriorating air quality
- Junior worker feels unwell but doesn't speak up (authority gradient)
- Incident: Worker collapses, emergency evacuation required

**With CRM:**
- **Situational Awareness:** Operator notices fan failure alarm, reports immediately
- **Communication:** Supervisor briefs crew clearly: "Fan down, air quality will deteriorate, we're evacuating"
- **Decision Making:** Supervisor uses STOP: Stop work, Think about consequences, Observe gas readings, Plan evacuation
- **Leadership:** Supervisor explicitly asks: "Does everyone understand? Any concerns?"
- **Followership:** Junior worker speaks up: "I'm already feeling lightheaded"
- **Teamwork:** Crew coordinates orderly evacuation, accounts for everyone
- **Stress Management:** Supervisor stays calm, doesn't rush, follows procedure

**Result:** No injuries. Ventilation repaired. Operations resume safely.`
      },

      yourCommitment: {
        type: 'text',
        body: `### Your CRM Commitment

CRM isn't just for supervisors or pilots. **Every person** in a high-risk workplace has a role:

**I commit to:**
- Communicate clearly and listen actively
- Maintain awareness of my surroundings and situation
- Make thoughtful decisions, especially under pressure
- Work as a team player, supporting others and accepting support
- Lead when appropriate and follow conscientiously
- Manage my stress and fatigue, and speak up when I'm not fit

**The 6 competencies are not separate skills - they work together.** You can't have good situational awareness if you're too fatigued. You can't make good decisions without clear communication.

**CRM is a mindset: "I will use every resource available to ensure we all go home safe."**`
      },

      nextSteps: {
        type: 'text',
        body: `### What's Next?

You've now learned:
- **WHY** Human Factors matter (Tenerife, statistics)
- **WHAT** Human Factors are (SHELL Model)
- **The 12 Dirty Dozen** error precursors
- **How accidents happen** (Swiss Cheese Model)
- **How aviation CRM applies to mining**
- **The 6 CRM competencies**

**Next, you'll put this into practice:**
1. **Practice Scenario:** Apply your new HF knowledge in realistic mining situations
2. **Knowledge Check:** Test your understanding of Module 1 concepts

Let's see how you do!`
      }
    }
  }
]
