export const module1Quiz = {
  title: 'Module 1: Foundations of HF & Safety Culture - Knowledge Check',
  description: 'Test your understanding of Human Factors principles, the Dirty Dozen, SHELL Model, Swiss Cheese Model, and CRM competencies',
  passingScore: 70,
  timeLimit: null, // No time limit for this quiz

  questions: [
    // Section 1A: WHY Human Factors?
    {
      id: 'q1',
      section: '1A',
      question: 'What was the primary cause of the Tenerife disaster in 1977?',
      type: 'multiple-choice',
      options: [
        { value: 'a', label: 'Mechanical failure of the aircraft' },
        { value: 'b', label: 'Extreme weather conditions' },
        { value: 'c', label: 'Human factors (communication breakdown, authority gradient, stress)' },
        { value: 'd', label: 'Pilot incompetence and lack of training' }
      ],
      correctAnswer: 'c',
      explanation: `The Tenerife disaster was caused by **human factors**: miscommunication between crew and ATC, authority gradient (co-pilot reluctant to challenge captain), stress from delays, and loss of situational awareness. Both aircraft were mechanically sound and the pilots were highly experienced.`,
      points: 1
    },

    {
      id: 'q2',
      section: '1A',
      question: 'Approximately what percentage of mining incidents involve human error as a contributing factor?',
      type: 'multiple-choice',
      options: [
        { value: 'a', label: '30%' },
        { value: 'b', label: '50%' },
        { value: 'c', label: '70%' },
        { value: 'd', label: '90%' }
      ],
      correctAnswer: 'c',
      explanation: `Approximately **70% of mining incidents** involve human error as a contributing factor, similar to the 80% figure in aviation. This doesn't mean humans are the "root cause" - it means human performance is influenced by system design, procedures, environment, and organizational factors.`,
      points: 1
    },

    // Section 1B: WHAT is Human Factors?
    {
      id: 'q3',
      section: '1B',
      question: 'In the SHELL Model, what does the "L" in the center represent?',
      type: 'multiple-choice',
      options: [
        { value: 'a', label: 'Leadership' },
        { value: 'b', label: 'Liveware (the human at the center)' },
        { value: 'c', label: 'Logistics' },
        { value: 'd', label: 'Learning' }
      ],
      correctAnswer: 'b',
      explanation: `The "L" at the center of the SHELL Model represents **Liveware** - the human operator. This person interacts with four interfaces: Software (procedures), Hardware (equipment), Environment (physical conditions), and Liveware (other people). Errors occur when these interfaces don't fit well together.`,
      points: 1
    },

    {
      id: 'q4',
      section: '1B',
      question: 'A pre-start checklist is written in highly technical language that operators struggle to understand. This is an example of which SHELL mismatch?',
      type: 'multiple-choice',
      options: [
        { value: 'a', label: 'Software-Liveware mismatch' },
        { value: 'b', label: 'Hardware-Liveware mismatch' },
        { value: 'c', label: 'Environment-Liveware mismatch' },
        { value: 'd', label: 'Liveware-Liveware mismatch' }
      ],
      correctAnswer: 'a',
      explanation: `This is a **Software-Liveware mismatch**. In the SHELL Model, "Software" includes procedures, checklists, and manuals. When these are written in language that doesn't match the user's understanding, errors become more likely. The system (checklist) doesn't fit the human (operator).`,
      points: 1
    },

    // Section 1C: The 12 Dirty Dozen
    {
      id: 'q5',
      section: '1C',
      question: 'Which of the following is NOT one of the Dirty Dozen error precursors?',
      type: 'multiple-choice',
      options: [
        { value: 'a', label: 'Fatigue' },
        { value: 'b', label: 'Complacency' },
        { value: 'c', label: 'Incompetence' },
        { value: 'd', label: 'Distraction' }
      ],
      correctAnswer: 'c',
      explanation: `**Incompetence** is NOT one of the Dirty Dozen. The Dirty Dozen are normal human states that increase error likelihood (fatigue, stress, complacency, distraction, lack of knowledge, lack of awareness, lack of communication, lack of teamwork, lack of assertiveness, lack of resources, pressure, norms). They are not character flaws or permanent traits.`,
      points: 1
    },

    {
      id: 'q6',
      section: '1C',
      question: 'An experienced operator skips pre-start checks, thinking "I\'ve done this a thousand times." Which Dirty Dozen condition is this?',
      type: 'multiple-choice',
      options: [
        { value: 'a', label: 'Fatigue' },
        { value: 'b', label: 'Complacency' },
        { value: 'c', label: 'Lack of Knowledge' },
        { value: 'd', label: 'Pressure' }
      ],
      correctAnswer: 'b',
      explanation: `This is **Complacency** - overconfidence from routine leading to reduced vigilance. Experience can be a double-edged sword: it builds competence, but can also lead to skipping steps or reduced attention to detail. Complacency is one of the most common contributors to incidents involving experienced workers.`,
      points: 1
    },

    {
      id: 'q7',
      section: '1C',
      question: 'True or False: If you identify a Dirty Dozen condition in yourself (e.g., fatigue, distraction), you should stop the high-risk task and speak up.',
      type: 'true-false',
      options: [
        { value: 'true', label: 'True' },
        { value: 'false', label: 'False' }
      ],
      correctAnswer: 'true',
      explanation: `**True.** The whole point of learning the Dirty Dozen is **self-awareness and mitigation**. If you recognize you're fatigued, distracted, or under pressure, stop the high-risk task, speak up to your supervisor or team, and take corrective action (rest, ask for help, double-check your work). This is not a sign of weakness - it's evidence-based safety.`,
      points: 1
    },

    // Section 1D: Swiss Cheese Model
    {
      id: 'q8',
      section: '1D',
      question: 'According to the Swiss Cheese Model, accidents occur when:',
      type: 'multiple-choice',
      options: [
        { value: 'a', label: 'A single catastrophic error is made' },
        { value: 'b', label: 'Multiple layers of defense fail and the "holes" align' },
        { value: 'c', label: 'Equipment is poorly maintained' },
        { value: 'd', label: 'Workers violate safety rules intentionally' }
      ],
      correctAnswer: 'b',
      explanation: `According to the Swiss Cheese Model, accidents happen when **multiple layers of defense fail and the "holes" align**. Each layer (organizational, supervision, preconditions, actions) has weaknesses (holes). Most of the time, one layer catches what another missed. But when holes align across all layers, the hazard passes through and an accident occurs.`,
      points: 1
    },

    {
      id: 'q9',
      section: '1D',
      question: 'True or False: The Swiss Cheese Model suggests we should focus on blaming the individual who made the final error.',
      type: 'true-false',
      options: [
        { value: 'true', label: 'True' },
        { value: 'false', label: 'False' }
      ],
      correctAnswer: 'false',
      explanation: `**False.** The Swiss Cheese Model emphasizes **systems thinking**, not individual blame. The final error (active failure) is usually just the last hole to align. We must also examine the latent conditions (organizational weaknesses, poor supervision, inadequate resources) that created the conditions for error. Blaming the individual ignores the upstream holes that allowed the accident to happen.`,
      points: 1
    },

    // Section 1E: Aviation to Mining
    {
      id: 'q10',
      section: '1E',
      question: 'Which of the following is a key parallel between aviation and mining that makes CRM applicable to both?',
      type: 'multiple-choice',
      options: [
        { value: 'a', label: 'Both involve flying' },
        { value: 'b', label: 'High-consequence environments requiring teamwork and coordination under pressure' },
        { value: 'c', label: 'Both use the same equipment' },
        { value: 'd', label: 'Both industries have no hierarchy' }
      ],
      correctAnswer: 'b',
      explanation: `The key parallel is that both are **high-consequence environments requiring teamwork and coordination under pressure**. Both have complex systems, hierarchical structures, time pressure, fatigue risks, and the potential for catastrophic accidents from human error. These similarities make CRM principles (originally from aviation) highly relevant to mining.`,
      points: 1
    },

    // Section 1F: Introduction to CRM
    {
      id: 'q11',
      section: '1F',
      question: 'Which CRM competency involves clearly sharing information and confirming understanding using closed-loop communication?',
      type: 'multiple-choice',
      options: [
        { value: 'a', label: 'Situational Awareness' },
        { value: 'b', label: 'Communication' },
        { value: 'c', label: 'Decision Making' },
        { value: 'd', label: 'Teamwork' }
      ],
      correctAnswer: 'b',
      explanation: `This describes **Communication** (CRM Competency #1). Effective communication includes: sharing critical information clearly, active listening, closed-loop communication (e.g., "Copy, I will shut down pump 3 in 5 minutes"), and speaking up when something seems wrong. Most incidents involve communication breakdown somewhere in the chain.`,
      points: 1
    },

    {
      id: 'q12',
      section: '1F',
      question: 'A junior worker notices a safety hazard but hesitates to tell the supervisor because "they might think I\'m questioning their judgment." Which CRM competency is lacking?',
      type: 'multiple-choice',
      options: [
        { value: 'a', label: 'Communication' },
        { value: 'b', label: 'Teamwork' },
        { value: 'c', label: 'Leadership / Followership (Assertiveness)' },
        { value: 'd', label: 'Stress Management' }
      ],
      correctAnswer: 'c',
      explanation: `This is a lack of **Assertiveness** (part of CRM Competency #5: Leadership/Followership). Authority gradient - the reluctance to speak up to someone senior or more experienced - is a major human factors issue. Effective CRM training teaches workers to use assertive language ("I\'m concerned that..." / "Stop!") and teaches leaders to create psychological safety where people feel safe to speak up.`,
      points: 1
    }
  ],

  // Section metadata for reporting
  sections: {
    '1A': 'WHY Human Factors?',
    '1B': 'WHAT is Human Factors? (SHELL Model)',
    '1C': 'The 12 Dirty Dozen',
    '1D': 'Swiss Cheese Model',
    '1E': 'Aviation to Mining',
    '1F': 'Introduction to CRM'
  },

  // Feedback messages
  passFeedback: {
    title: 'Congratulations! You\'ve passed the Module 1 Knowledge Check',
    message: `You've demonstrated a solid understanding of Human Factors foundations.

**You've learned:**
- Why Human Factors matter (Tenerife, statistics)
- What Human Factors are (SHELL Model)
- The 12 Dirty Dozen error precursors
- How accidents happen (Swiss Cheese Model)
- How aviation CRM applies to mining
- The 6 core CRM competencies

**Next steps:**
Continue to Module 2 to deepen your understanding and apply these principles in more complex scenarios.

**Remember:** Human Factors knowledge is only valuable if you apply it. Use the Dirty Dozen, SHELL Model, and CRM competencies in your daily work.`
  },

  failFeedback: {
    title: 'Keep Learning - Review and Retake',
    message: `You haven't quite reached the passing score of 70% yet, but that's okay - Human Factors is a complex subject.

**What to do:**
1. Review the Module 1 content sections, especially the areas where you missed questions
2. Go through the practice scenario again and think about the HF principles at play
3. Retake this quiz when you're ready

**Key concepts to review:**
- The SHELL Model and how humans interface with systems
- The 12 Dirty Dozen and how to recognize them
- The Swiss Cheese Model and systems thinking
- The 6 CRM competencies

**Remember:** Learning Human Factors isn't just about passing a quiz - it's about developing a mindset that will keep you and your team safe for your entire career. Take your time and master these concepts.`
  }
}
