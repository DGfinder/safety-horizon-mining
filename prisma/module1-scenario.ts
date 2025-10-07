export const module1ScenarioMeta = {
  slug: 'your-first-hf-decision',
  title: 'Your First HF Decision: Applying Module 1 Foundations',
  moduleNumber: 1,
  version: 1,
  status: 'PUBLISHED',
  estimatedMinutes: 18,
  difficulty: 'BEGINNER',
  kpiFocus: ['decision_making', 'communication', 'situational_awareness', 'assertiveness', 'leadership'],
}

export const module1ScenarioNodes = [
  // ====================
  // INTRO
  // ====================
  {
    nodeKey: 'n_intro',
    nodeType: 'NARRATIVE',
    body: {
      title: 'Your First HF Decision',
      text: `**06:00 AM. Your first shift as a crew supervisor.**

You've been promoted based on your technical skills and experience. Today you'll face three situations that will test your understanding of Human Factors.

There are no "trick questions" here - just realistic scenarios where the Dirty Dozen, SHELL Model, and CRM competencies come into play.

**Your choices matter.** Each decision will impact safety, production, and team morale.

Ready? Let's begin.`,
      imageUrl: '/images/scenarios/sunrise-mine.jpg',
      choices: [
        {
          label: 'Start Shift',
          nextNodeKey: 's1_setup'
        }
      ]
    }
  },

  // ====================
  // SITUATION 1: FATIGUE (Dirty Dozen #1, Decision Making)
  // ====================
  {
    nodeKey: 's1_setup',
    nodeType: 'DECISION',
    body: {
      title: 'Situation 1: The Fatigued Operator',
      text: `**06:15 AM - Pre-start Meeting**

You're conducting the shift briefing when Marcus, one of your most experienced haul truck operators, arrives looking rough.

He slumps into his chair, eyes bloodshot. During the safety share, you notice him struggling to stay awake.

After the meeting, you pull him aside.

**You:** "Marcus, you okay? You look exhausted."

**Marcus:** "Yeah mate, didn't sleep well. Only got about 3 hours. But I'll be right, just need some coffee. Besides, we're already short-staffed today and you know I never miss a shift."

You check the roster. He's right - you're down two operators due to illness. Marcus is scheduled to operate the 400-ton haul truck on the main haulage route, a high-traffic area.`,
      imageUrl: '/images/scenarios/fatigued-worker.jpg',
      choices: [
        {
          label: 'Let Marcus operate - he\'s experienced and you need the coverage',
          nextNodeKey: 's1_choice_a_feedback',
          kpiImpact: {
            decision_making: -15,
            leadership: -10,
            safety_culture: -20
          }
        },
        {
          label: 'Assign Marcus to a lower-risk task (e.g., workshop support, equipment checks)',
          nextNodeKey: 's1_choice_b_feedback',
          kpiImpact: {
            decision_making: 10,
            leadership: 10,
            safety_culture: 5
          }
        },
        {
          label: 'Send Marcus home and redistribute workload among other operators',
          nextNodeKey: 's1_choice_c_feedback',
          kpiImpact: {
            decision_making: 15,
            leadership: 15,
            safety_culture: 20,
            production_efficiency: -5
          }
        }
      ]
    }
  },

  {
    nodeKey: 's1_choice_a_feedback',
    nodeType: 'OUTCOME',
    body: {
      choiceLabel: 'Let Marcus operate',
      outcome: 'Poor Decision',
      tone: 'negative',
      text: `**Result: Near-Miss Incident**

Two hours into the shift, Marcus has a micro-sleep while driving and drifts across the centerline. He narrowly misses an oncoming light vehicle. The incident is reported.

**What went wrong:**

**Dirty Dozen #1 - Fatigue:** Marcus showed clear signs (bloodshot eyes, struggling to stay awake, self-reported 3 hours sleep). Fatigue impairs reaction time, decision-making, and vigilance - critical for operating heavy equipment.

**Decision Making:** You prioritized short-term production needs over safety. The "experienced operator" logic is a common cognitive bias - experience doesn't overcome physiological impairment.

**Leadership:** By allowing Marcus to work in an unfit state, you signaled that production matters more than safety, undermining the safety culture you're supposed to uphold.

**Better approach:** CRM competency #6 (Stress & Fatigue Management) requires recognizing when someone is not fit for duty. An experienced leader protects their team from themselves when necessary.

**Score: -15 Decision Making, -10 Leadership, -20 Safety Culture**`,
      imageUrl: '/images/scenarios/near-miss.jpg',
      nextNodeKey: 's2_setup'
    }
  },

  {
    nodeKey: 's1_choice_b_feedback',
    nodeType: 'OUTCOME',
    body: {
      choiceLabel: 'Assign Marcus to lower-risk task',
      outcome: 'Acceptable Decision',
      tone: 'neutral',
      text: `**Result: Shift Continues Safely, But...**

You reassign Marcus to workshop support - checking equipment, updating logbooks, assisting mechanics. He's grateful and works the shift without incident.

However, the haul truck shortage creates bottlenecks. Other operators have to work harder to compensate, and production is slightly behind target.

**What went right:**

**Dirty Dozen #1 - Fatigue:** You recognized the fatigue risk and took action to mitigate it by moving Marcus to a lower-consequence role.

**Decision Making:** You balanced safety and operational needs - not perfect, but reasonable.

**What could be better:**

While safer than letting him drive, having a severely fatigued person on-site still carries risks. Even in the workshop, fatigue can lead to errors (e.g., incorrect logbook entries, missing maintenance issues).

**Best practice (CRM):** When someone reports 3 hours of sleep, the gold standard is to send them home. Fatigue doesn't just impair high-risk tasks - it impairs all cognitive function.

**Score: +10 Decision Making, +10 Leadership, +5 Safety Culture**`,
      imageUrl: '/images/scenarios/workshop.jpg',
      nextNodeKey: 's2_setup'
    }
  },

  {
    nodeKey: 's1_choice_c_feedback',
    nodeType: 'OUTCOME',
    body: {
      choiceLabel: 'Send Marcus home',
      outcome: 'Excellent Decision',
      tone: 'positive',
      text: `**Result: Short-Term Pain, Long-Term Gain**

**You:** "Marcus, I appreciate your commitment, but 3 hours of sleep isn't safe for you or the team. I need you to go home, get proper rest, and come back tomorrow."

**Marcus:** (initially resistant) "But we're short-staffed..."

**You:** "We'll manage. I'd rather be down one operator than risk an incident. Your safety is more important than today's production target."

Marcus goes home. You redistribute the workload - it's tight, but the crew steps up. Production is slightly behind, but no incidents occur.

Later, the Site Manager commends you for the decision. Marcus returns the next day well-rested and thanks you.

**What went right:**

**CRM Competency #6 - Stress & Fatigue Management:** You correctly identified that Marcus was not fit for duty and took decisive action.

**Decision Making:** You prioritized long-term safety over short-term production pressure. This is evidence-based leadership.

**Leadership:** You set a clear standard: "We don't work when we're not fit." This builds a culture where people feel safe to speak up about fatigue.

**Swiss Cheese Model:** You closed a hole (fatigued operator) before it could align with other failures.

**Score: +15 Decision Making, +15 Leadership, +20 Safety Culture, -5 Production (acceptable trade-off)**`,
      imageUrl: '/images/scenarios/thumbs-up.jpg',
      nextNodeKey: 's2_setup'
    }
  },

  // ====================
  // SITUATION 2: COMMUNICATION / SITUATIONAL AWARENESS (SHELL Model, CRM Competencies 1 & 2)
  // ====================
  {
    nodeKey: 's2_setup',
    nodeType: 'DECISION',
    body: {
      title: 'Situation 2: The Dust Storm',
      text: `**10:30 AM - Pit Operations**

You're coordinating a complex operation: two excavators loading four haul trucks in a confined area. Radios are crackling with activity.

Suddenly, a dust storm rolls in. Visibility drops to less than 50 meters.

**Radio traffic:**

**Excavator 1 (Jess):** "Dispatch, Excavator 1, visibility is getting bad, I'm slowing down."

**Your radio:** "Copy Excavator 1, all units reduce speed and switch on beacons."

**Haul Truck 3 (Ahmed):** [Static] "...moving to... [static] ...zone B..."

You didn't catch that clearly. Ahmed is new to the site and still learning the radio protocols.

At the same time, Truck 4 (Sarah) radios: "I'm heading to dump zone B now."

You realize both trucks might be converging on the same tight area in low visibility.`,
      imageUrl: '/images/scenarios/dust-storm.jpg',
      choices: [
        {
          label: 'Continue operations - the operators are experienced and will see each other',
          nextNodeKey: 's2_choice_a_feedback',
          kpiImpact: {
            situational_awareness: -20,
            communication: -15,
            decision_making: -10
          }
        },
        {
          label: 'Call Ahmed again to confirm his location and intentions',
          nextNodeKey: 's2_choice_b_feedback',
          kpiImpact: {
            communication: 15,
            situational_awareness: 10
          }
        },
        {
          label: 'Stop all mobile equipment movement until visibility improves and all positions are confirmed',
          nextNodeKey: 's2_choice_c_feedback',
          kpiImpact: {
            situational_awareness: 20,
            communication: 15,
            leadership: 15,
            production_efficiency: -10
          }
        }
      ]
    }
  },

  {
    nodeKey: 's2_choice_a_feedback',
    nodeType: 'OUTCOME',
    body: {
      choiceLabel: 'Continue operations',
      outcome: 'Poor Decision',
      tone: 'negative',
      text: `**Result: Near-Collision**

Truck 3 and Truck 4 almost collide in dump zone B. Both operators slam on brakes. No contact, but it's close enough to trigger an automatic incident report.

Investigation finds that Ahmed thought he was going to zone C but misread the sign in the dust.

**What went wrong:**

**SHELL Model - Liveware-Environment Mismatch:** Dust (environment) degraded visibility, making it unsafe to continue at normal pace. You didn't account for this mismatch.

**SHELL Model - Liveware-Liveware Mismatch:** Ahmed's unclear radio call indicated a communication problem between team members. You didn't address it.

**CRM Competency #2 - Situational Awareness:** You lost SA when you didn't confirm Ahmed's position. "Where is everyone and what are they doing?" is the fundamental SA question.

**CRM Competency #1 - Communication:** You didn't use closed-loop communication. When a radio call is unclear, you MUST verify.

**Dirty Dozen #6 - Lack of Awareness:** You assumed everyone had SA. Assumptions kill.

**Score: -20 Situational Awareness, -15 Communication, -10 Decision Making**`,
      imageUrl: '/images/scenarios/near-collision.jpg',
      nextNodeKey: 's3_setup'
    }
  },

  {
    nodeKey: 's2_choice_b_feedback',
    nodeType: 'OUTCOME',
    body: {
      choiceLabel: 'Confirm Ahmed\'s location',
      outcome: 'Good Decision',
      tone: 'positive',
      text: `**Result: Conflict Avoided**

**You:** "Truck 3, this is Supervisor, I didn't copy your last message. Confirm your current location and destination, over."

**Ahmed:** "Uh, Supervisor, Truck 3 is... wait, I think I'm near zone C. Hard to see the signs in this dust."

**You:** "Copy Truck 3, hold your position. Truck 4, you're clear to zone B. Truck 3, once Truck 4 is clear, proceed to zone C with caution."

Crisis averted. Both trucks complete their tasks safely.

**What went right:**

**CRM Competency #1 - Communication:** You used closed-loop communication - when you didn't understand, you asked for clarification.

**CRM Competency #2 - Situational Awareness:** You recognized that your mental model was incomplete (Where is Ahmed?) and took action to restore SA.

**SHELL Model - Liveware-Environment:** You adapted to the degraded environment by slowing the operation and adding communication.

**What could be even better:**

Stopping all movement until visibility improves is the gold standard in these conditions. You managed the risk, but didn't eliminate it.

**Score: +15 Communication, +10 Situational Awareness**`,
      imageUrl: '/images/scenarios/radio-clear.jpg',
      nextNodeKey: 's3_setup'
    }
  },

  {
    nodeKey: 's2_choice_c_feedback',
    nodeType: 'OUTCOME',
    body: {
      choiceLabel: 'Stop all mobile equipment',
      outcome: 'Excellent Decision',
      tone: 'positive',
      text: `**Result: Safe, Controlled Stop**

**You:** "All mobile equipment, Supervisor. STOP movement. Visibility is below safe limits. Hold your current positions, switch on all beacons, and report locations one by one."

You systematically confirm each vehicle's location, build a mental map, and ensure safe spacing.

15 minutes later, the dust clears. You resume operations with full situational awareness.

**What went right:**

**CRM Competency #2 - Situational Awareness:** You recognized that you'd lost SA (unclear where Ahmed was) and took decisive action to restore it.

**CRM Competency #1 - Communication:** You used clear, assertive language ("STOP movement") and structured communication (one by one reports) to rebuild the shared mental model.

**Decision Making:** You prioritized safety over production. The 15-minute delay is negligible compared to the cost of a collision.

**Leadership:** Stopping operations in low visibility sets a clear standard: "We don't take risks we can't see."

**SHELL Model - Environment-Liveware:** You recognized the environment had degraded beyond safe operating limits and adapted the system (stopped movement) to match human limitations (vision).

**Score: +20 Situational Awareness, +15 Communication, +15 Leadership, -10 Production (acceptable trade-off)**`,
      imageUrl: '/images/scenarios/safe-stop.jpg',
      nextNodeKey: 's3_setup'
    }
  },

  // ====================
  // SITUATION 3: AUTHORITY GRADIENT / ASSERTIVENESS (CRM Competency #5, Just Culture)
  // ====================
  {
    nodeKey: 's3_setup',
    nodeType: 'DECISION',
    body: {
      title: 'Situation 3: The Authority Gradient',
      text: `**14:00 PM - Afternoon Rounds**

You're inspecting the blast area perimeter with your team when the Site Manager, David, arrives in his light vehicle.

David is well-liked but known for being hands-on and occasionally impatient. He parks and walks toward the blast zone to check the setup.

You notice two things:

1. The blast crew is still installing primers (blast scheduled for 15:00, one hour away)
2. David is about to cross the exclusion zone boundary - marked by flagging tape and signs

As a new supervisor, you're aware of the authority gradient. David is senior, experienced, and technically your boss's boss.

But the exclusion zone is non-negotiable: **No entry during blast prep without blast crew approval and PPE.**

David doesn't appear to have signed in with the blast crew or be wearing a two-way radio.`,
      imageUrl: '/images/scenarios/blast-zone.jpg',
      choices: [
        {
          label: 'Say nothing - David is experienced, he knows what he\'s doing',
          nextNodeKey: 's3_choice_a_feedback',
          kpiImpact: {
            assertiveness: -20,
            leadership: -15,
            safety_culture: -20
          }
        },
        {
          label: 'Mention it casually: "Hey David, just so you know, that\'s the exclusion zone"',
          nextNodeKey: 's3_choice_b_feedback',
          kpiImpact: {
            assertiveness: 5,
            communication: 5
          }
        },
        {
          label: 'Use assertive communication: "Stop! That\'s the blast exclusion zone. You need to check in with the shot firer before entering."',
          nextNodeKey: 's3_choice_c_feedback',
          kpiImpact: {
            assertiveness: 20,
            leadership: 20,
            safety_culture: 20
          }
        }
      ]
    }
  },

  {
    nodeKey: 's3_choice_a_feedback',
    nodeType: 'OUTCOME',
    body: {
      choiceLabel: 'Say nothing',
      outcome: 'Poor Decision',
      tone: 'negative',
      text: `**Result: Breach of Protocol**

David crosses into the exclusion zone. The blast crew sees him and has to stop work to ensure he's clear. This delays the blast by 20 minutes.

Worse, a junior operator on your crew witnesses this and later comments: "I guess the rules don't apply to managers."

**What went wrong:**

**Dirty Dozen #9 - Lack of Assertiveness:** You failed to speak up when you saw a safety violation, even though you knew it was wrong.

**Authority Gradient:** You let David's seniority override the safety rule. This is exactly how the Tenerife disaster happened - co-pilot didn't challenge the captain.

**CRM Competency #5 - Followership:** Good followers provide leaders with critical information, even when it's uncomfortable. Silence is complicity.

**Safety Culture:** By not speaking up, you signaled that hierarchy matters more than safety. This erodes trust and encourages others to stay silent.

**Just Culture:** Speaking up about unsafe acts (even by managers) is not insubordination - it's your duty.

**Score: -20 Assertiveness, -15 Leadership, -20 Safety Culture**`,
      imageUrl: '/images/scenarios/silent-witness.jpg',
      nextNodeKey: 's_final_debrief'
    }
  },

  {
    nodeKey: 's3_choice_b_feedback',
    nodeType: 'OUTCOME',
    body: {
      choiceLabel: 'Casual mention',
      outcome: 'Marginal Decision',
      tone: 'neutral',
      text: `**Result: Ambiguous Outcome**

**You:** "Hey David, just so you know, that's the exclusion zone."

**David:** (pauses) "Oh right, thanks." (stops and waves to the blast crew)

David checks in with the shot firer, gets the all-clear, and proceeds safely.

**What went right:**

You did speak up, and the outcome was positive.

**What could be better:**

Your language was **passive, not assertive.** "Just so you know" implies the information is optional, not a safety-critical intervention.

**CRM uses assertive language:**
- "Stop."
- "That's the exclusion zone."
- "You need to check in with the shot firer."

**Why it matters:** In a more distracting or time-pressured situation, David might have waved you off or misunderstood your casual tone. Assertive language removes ambiguity.

**Authority gradient countermeasures (aviation CRM):**
- Use the person's name: "David, stop."
- State the concern clearly: "That's the blast exclusion zone."
- State the required action: "You need to check in with the shot firer first."

**Score: +5 Assertiveness, +5 Communication (you spoke up, but delivery could be stronger)**`,
      imageUrl: '/images/scenarios/casual-warning.jpg',
      nextNodeKey: 's_final_debrief'
    }
  },

  {
    nodeKey: 's3_choice_c_feedback',
    nodeType: 'OUTCOME',
    body: {
      choiceLabel: 'Assertive communication',
      outcome: 'Excellent Decision',
      tone: 'positive',
      text: `**Result: Safety Protocol Maintained**

**You:** (stepping forward, raising your hand) "Stop! That's the blast exclusion zone. You need to check in with the shot firer before entering."

David stops immediately, looks at the flagging tape, and nods.

**David:** "You're absolutely right. Thanks for catching that - I was focused on the setup and didn't see the boundary. Let me check in with the crew."

David walks over to the shot firer, signs in, gets briefed, and proceeds safely.

Later, David pulls you aside: "Good work today. That's exactly the kind of safety leadership I want to see. Never hesitate to speak up, no matter who it is."

**What went right:**

**CRM Competency #5 - Assertiveness:** You used clear, direct language with no ambiguity. "Stop!" is an unequivocal command.

**Authority Gradient Countermeasure:** You overcame the natural reluctance to challenge a senior person because you put safety first.

**Leadership:** By holding David to the same standard as everyone else, you demonstrated that rules apply equally. This builds trust and credibility.

**Safety Culture:** Your assertiveness sets an example for your team. If the supervisor can challenge the Site Manager, they can challenge anyone.

**Just Culture:** David's positive response shows that good leaders welcome safety interventions. This reinforces that speaking up is not only accepted, it's expected.

**Tenerife Lesson:** If the KLM co-pilot had used this level of assertiveness ("Stop! We don't have clearance!"), 583 people might have lived.

**Score: +20 Assertiveness, +20 Leadership, +20 Safety Culture**`,
      imageUrl: '/images/scenarios/assertive-stop.jpg',
      nextNodeKey: 's_final_debrief'
    }
  },

  // ====================
  // FINAL DEBRIEF & SCORING
  // ====================
  {
    nodeKey: 's_final_debrief',
    nodeType: 'OUTCOME',
    body: {
      title: 'End of Shift - Debrief',
      text: `**16:00 - Shift Handover**

Your first shift as supervisor is complete. Let's debrief your Human Factors performance.

**The Three Situations:**

1. **Fatigue (Dirty Dozen #1):** Did you recognize the risk and take appropriate action?
2. **Dust Storm (SHELL Model, Situational Awareness, Communication):** Did you maintain awareness and communicate effectively in degraded conditions?
3. **Authority Gradient (Assertiveness, Leadership):** Did you speak up when you saw a safety violation, even when it was a senior manager?

**Your results are calculated based on your choices.**

**Key Takeaways:**

- **Human Factors are not abstract concepts** - they show up in everyday decisions
- **The Dirty Dozen, SHELL Model, and CRM competencies are practical tools** - use them to analyze situations and guide your actions
- **Speaking up is hard, but essential** - authority gradients kill people
- **Safety and production are not enemies** - short-term delays prevent long-term disasters

**Remember:** In aviation, CRM reduced fatal accidents by 80%. In mining, it can do the same - but only if we apply it.

**Well done for completing this scenario. Continue to the Knowledge Check quiz to test your understanding of Module 1 concepts.**`,
      imageUrl: '/images/scenarios/sunset-shift-end.jpg'
    }
  }
]
