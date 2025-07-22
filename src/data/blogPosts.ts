export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: string;
  featured: boolean;
  content: string;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl?: string;
  };
}

export const blogPostsData: BlogPost[] = [
  {
    slug: "top-5-human-factors-mining-incidents",
    title: "The Top 5 Human Factors That Lead to Mining Incidents (And How to Fix Them)",
    excerpt: "A deep dive into the 5 most common human factors that lead to mining incidents, including fatigue and communication failures. Learn practical, proven strategies to enhance safety and performance on your site.",
    author: "The Crew Resource Mining Team",
    authorRole: "Aviation Safety Experts",
    date: "2025-07-22",
    readTime: "8 min read",
    category: "Human Factors",
    featured: true,
    seo: {
      metaTitle: "The Top 5 Human Factors in Mining Incidents & How to Fix Them",
      metaDescription: "A deep dive into the 5 most common human factors that lead to mining incidents, including fatigue and communication failures. Learn practical, proven strategies to enhance safety and performance on your site.",
      keywords: [
        "human factors mining",
        "mining safety",
        "mining incidents", 
        "crew resource management mining",
        "FIFO fatigue management",
        "mining safety culture",
        "aviation safety mining",
        "situational awareness mining",
        "communication mining safety",
        "mining human factors training"
      ],
      canonicalUrl: "https://crewresourcemining.com.au/blog/top-5-human-factors-mining-incidents"
    },
    content: `
      <p>The Australian mining industry has made incredible strides in engineering and equipment safety. We operate some of the most advanced machinery on the planet. Yet, incidents still happen. And when they do, the cause is rarely a spontaneous mechanical failure.</p>
      
      <p>The data is clear: up to 85% of serious incidents can be linked to human decision-making and human factors [1].</p>
      
      <p>These aren't just simple mistakes. They are predictable, preventable system failures that begin long before the incident itself. Understanding these factors is the first step to building a truly resilient safety culture.</p>
      
      <p>This article breaks down the five most critical human factors that contribute to mining incidents and provides practical, proven strategies to address them head-on.</p>

      <h2>1. Situational Awareness Failure</h2>
      <p><strong>What it is:</strong> Situational Awareness (SA) is knowing what is happening around you and, more importantly, what is likely to happen next. In mining, a loss of SA can be catastrophic. It's the operator who doesn't notice a ute entering their path, or the maintenance fitter who becomes so focused on one task they miss a change in their surroundings.</p>
      
      <p><strong>Why it happens:</strong></p>
      <ul>
        <li><strong>Complacency:</strong> The "I've done this a thousand times" mindset is the enemy of awareness. Familiarity can lead to missed changes in routine tasks.</li>
        <li><strong>Distraction:</strong> Non-critical radio chatter, noise, and mental fatigue can pull focus away from the immediate environment.</li>
        <li><strong>Task Fixation:</strong> Tunnel vision on a single complex problem, causing you to ignore everything else.</li>
      </ul>
      
      <p><strong>How to fix it:</strong></p>
      <ul>
        <li><strong>Implement Pre-Task Scans:</strong> Train teams to consciously pause and scan their environment before starting any task, asking "What has changed?"</li>
        <li><strong>Promote Assertive Communication:</strong> Create a culture where any team member, regardless of seniority, is expected to speak up if they see a colleague losing awareness.</li>
        <li><strong>Manage Cognitive Load:</strong> During critical tasks, enforce a "sterile cockpit" mentality—no non-essential conversations or distractions.</li>
      </ul>

      <h2>2. Communication Breakdown</h2>
      <p><strong>What it is:</strong> Effective communication isn't about talking; it's about creating a shared understanding. A communication failure occurs when a message is sent but not received or understood correctly. This is a leading cause of incidents, especially during vehicle movements and handovers.</p>
      
      <p><strong>Why it happens:</strong></p>
      <ul>
        <li><strong>Assumptions:</strong> Assuming the other person has the same information or understands your intention without confirmation.</li>
        <li><strong>Environmental Barriers:</strong> High ambient noise, radio static, and poor reception can garble critical messages.</li>
        <li><strong>Hierarchy Pressure:</strong> Junior workers may feel hesitant to question or ask for clarification from a supervisor, leading them to proceed with uncertainty.</li>
      </ul>
      
      <p><strong>How to fix it:</strong></p>
      <ul>
        <li><strong>Mandate Closed-Loop Communication:</strong> This is a core aviation principle. The receiver must repeat back the critical parts of an instruction to confirm they have understood it correctly. For example, "Confirm, I am clear to reverse onto Ramp 5."</li>
        <li><strong>Use Standardised Language:</strong> Use clear, simple, agreed-upon terms for common operations to reduce ambiguity.</li>
        <li><strong>Conduct Better Briefings:</strong> Ensure pre-start and handover meetings are structured, concise, and allow time for questions to ensure everyone is on the same page.</li>
      </ul>

      <h2>3. Fatigue</h2>
      <p><strong>What it is:</strong> Fatigue is not just "feeling tired." It is a state of cognitive and physical impairment that significantly degrades judgment, reaction time, and decision-making. For FIFO and DIDO workers, it is one of the most serious and insidious risks. Studies have shown that being awake for 18 hours can impair performance as much as having a blood alcohol content of 0.05 [2].</p>
      
      <p><strong>Why it happens:</strong></p>
      <ul>
        <li><strong>Sleep Debt:</strong> The cumulative effect of not getting 7-9 hours of quality sleep per night.</li>
        <li><strong>Circadian Rhythm Disruption:</strong> The human body is not designed to be fully alert at 2 AM. Night shifts disrupt our natural biological clock.</li>
        <li><strong>Environmental Stressors:</strong> Constant exposure to heat, vibration, and noise drains mental and physical reserves.</li>
      </ul>
      
      <p><strong>How to fix it:</strong></p>
      <ul>
        <li><strong>Implement a Fatigue Risk Management System (FRMS):</strong> This goes beyond policy. It involves roster design that allows for genuine recovery, monitoring cumulative work hours, and having clear procedures for when a worker reports as unfit for duty due to fatigue.</li>
        <li><strong>Foster a Reporting Culture:</strong> Workers must be encouraged and protected when they raise fatigue concerns. It must be treated as a legitimate safety issue, not a personal weakness.</li>
        <li><strong>Train for Personal Mitigation:</strong> Educate your team on sleep hygiene, nutrition, and hydration strategies to build personal resilience against fatigue.</li>
      </ul>

      <h2>4. Decision-Making Under Pressure</h2>
      <p><strong>What it is:</strong> The mining environment is dynamic. When unexpected events occur, teams must make high-stakes decisions under immense time pressure. Poor decisions in these moments often happen when stress causes individuals to deviate from procedure or take risky shortcuts.</p>
      
      <p><strong>Why it happens:</strong></p>
      <ul>
        <li><strong>Cognitive Tunneling:</strong> Stress can cause individuals to focus on only one or two aspects of a problem, ignoring other critical information.</li>
        <li><strong>Production Pressure:</strong> An overwhelming focus on meeting targets can lead teams to accept risks they normally wouldn't.</li>
        <li><strong>Lack of Practice:</strong> Teams rarely get to practice managing emergency or non-normal situations, so their response can be hesitant or flawed when a real event occurs.</li>
      </ul>
      
      <p><strong>How to fix it:</strong></p>
      <ul>
        <li><strong>Scenario-Based Training:</strong> Regularly train teams in realistic simulators or tabletop exercises that replicate high-pressure, non-normal events. This builds "mental muscle memory."</li>
        <li><strong>Provide Simple Frameworks:</strong> Teach simple decision-making models (like DODAR: Diagnose, Options, Decide, Assign, Review) that can be easily recalled and applied under stress.</li>
        <li><strong>Empower Frontline Leaders:</strong> Ensure supervisors are trained to manage pressure, control the tempo of a situation, and allocate resources effectively during a crisis.</li>
      </ul>

      <h2>5. Poor Teamwork & Hierarchy Pressure</h2>
      <p><strong>What it is:</strong> A high-performing team is a safety system in itself. Poor teamwork, often caused by steep authority gradients or a lack of psychological safety, prevents crews from effectively trapping each other's errors.</p>
      
      <p><strong>Why it happens:</strong></p>
      <ul>
        <li><strong>Lack of Trust:</strong> Team members don't feel comfortable challenging each other or admitting uncertainty.</li>
        <li><strong>"Silo" Mentality:</strong> A lack of coordination and communication between different teams (e.g., maintenance vs. operations) creates gaps where hazards can emerge.</li>
        <li><strong>Intimidation:</strong> A supervisor or senior team member who is not approachable can shut down vital communication from junior members who may have spotted a hazard.</li>
      </ul>
      
      <p><strong>How to fix it:</strong></p>
      <ul>
        <li><strong>Crew Resource Management (CRM) Training:</strong> This is the cornerstone of the solution. CRM training provides teams with a shared set of skills and a common language for communication, leadership, and mutual support.</li>
        <li><strong>Leadership Development:</strong> Train your supervisors and managers to lead by example, creating an environment where every team member is expected to contribute to safety, regardless of their role.</li>
        <li><strong>Promote Cross-Checking:</strong> Build a culture where team members actively monitor each other's work and blind spots as a standard part of how they operate.</li>
      </ul>

      <h2>Conclusion: From Reactive Blame to Proactive Systems</h2>
      <p>These five human factors are not character flaws; they are predictable outcomes of a complex system. Acknowledging them is the first step.</p>
      
      <p>The next, most critical step is to move away from a culture of reactive blame and towards one that proactively builds resilient systems and trains for high performance. Just as aviation did decades ago, the mining industry can achieve the next leap in safety performance by investing in its most critical asset: its people. By equipping them with the non-technical skills to manage these factors, we build leaders at every level and create a workplace where everyone goes home safe, every single day.</p>

      <h2>Ready to Enhance Your Team's Safety Performance?</h2>
      <p>Our training programs are designed to give your crews the practical skills to manage these human factors effectively.</p>
      
      <div class="cta-section">
        <a href="/#contact" class="cta-primary">Book a No-Obligation Safety Strategy Call</a>
        <a href="/blog" class="cta-secondary">Download Our Executive Pitch Deck to See the Full Curriculum</a>
      </div>

      <h2>References</h2>
      <ol>
        <li>Patterson, M. & Shappell, S. (2010). Operator-error and system-deficiencies: Analysis of 508 mining incidents and accidents from a human-factors perspective. Based on common findings in safety science literature.</li>
        <li>Dawson, D. & Reid, K. (1997). Fatigue, alcohol and performance impairment. Nature, 388(6639), 235.</li>
      </ol>
    `
  },
  {
    slug: "aviation-safety-principles-mining",
    title: "Why Aviation Safety Principles Save Lives in Mining",
    excerpt: "Discover how the same principles that transformed aviation safety from reactive to proactive can revolutionize mining operations and prevent human factor incidents.",
    author: "Cassandra Cooke",
    authorRole: "Founder & Lead Aviation Safety Expert",
    date: "2025-01-20",
    readTime: "5 min read",
    category: "Safety Leadership",
    featured: false,
    content: `
      <p>The aviation industry has achieved an extraordinary safety record through decades of systematic human factors training and crew resource management (CRM) principles. Mining operations face similar high-stakes environments where human error can have catastrophic consequences.</p>

      <h2>The Aviation Safety Revolution</h2>
      <p>In the 1970s, aviation faced a crisis. Despite advanced technology, accidents continued to occur due to human factors - communication breakdowns, poor decision-making under pressure, and inadequate crew coordination. The industry's response was revolutionary: they developed Crew Resource Management.</p>

      <h3>Key Aviation Principles for Mining</h3>
      <ul>
        <li><strong>Situational Awareness:</strong> Maintaining constant awareness of changing conditions and potential hazards</li>
        <li><strong>Effective Communication:</strong> Clear, standardized communication protocols that prevent misunderstandings</li>
        <li><strong>Decision Making:</strong> Structured approaches to making critical decisions under pressure</li>
        <li><strong>Teamwork:</strong> Coordinated team responses that leverage all available expertise</li>
        <li><strong>Error Management:</strong> Systems to catch and correct errors before they become incidents</li>
      </ul>

      <h2>Mining's Human Factor Challenge</h2>
      <p>Mining operations share critical similarities with aviation:</p>
      <ul>
        <li>High-consequence environments where errors can be fatal</li>
        <li>Complex technical systems requiring precise coordination</li>
        <li>Time-pressured decision making</li>
        <li>Multi-person teams with varying experience levels</li>
        <li>Shift work and fatigue management challenges</li>
      </ul>

      <h2>Real-World Impact</h2>
      <p>Airlines that implement comprehensive CRM training see measurable improvements:</p>
      <ul>
        <li>Reduced incident rates by up to 50%</li>
        <li>Improved communication effectiveness</li>
        <li>Enhanced crew confidence and performance</li>
        <li>Better decision-making under pressure</li>
      </ul>

      <p>Mining operations implementing aviation-style human factors training report similar benefits, including reduced near-misses, improved team communication, and enhanced safety culture.</p>

      <h2>Getting Started</h2>
      <p>Implementing aviation safety principles in mining doesn't require wholesale changes. Start with:</p>
      <ol>
        <li>Assessment of current communication practices</li>
        <li>Introduction of standardized safety briefings</li>
        <li>Training key personnel in situational awareness techniques</li>
        <li>Development of error-reporting systems that promote learning</li>
      </ol>

      <p>The aviation industry's transformation from reactive to proactive safety culture proves that even high-risk industries can achieve extraordinary safety performance through systematic human factors training.</p>
    `
  },
  {
    slug: "human-factor-mistakes-mining-costs",
    title: "5 Human Factor Mistakes That Cost Mining Companies Millions",
    excerpt: "Learn about the most common human factor errors in mining operations and how aviation-proven solutions can prevent costly incidents and downtime.",
    author: "Kym Deed",
    authorRole: "Technical Training Lead",
    date: "2025-01-15",
    readTime: "7 min read",
    category: "Risk Management",
    featured: false,
    content: `
      <p>Human factor errors in mining operations don't just risk lives - they cost companies millions in downtime, equipment damage, regulatory fines, and reputational damage. Based on our experience as airline captains and mining safety consultants, here are the five most costly mistakes we see repeatedly.</p>

      <h2>1. Communication Breakdown During Shift Changes</h2>
      <p><strong>The Problem:</strong> Critical safety information isn't properly transferred between shifts, leading to accidents and near-misses.</p>
      <p><strong>Real Cost:</strong> A major mining operation lost $2.3 million in production when inadequate shift handover led to equipment damage.</p>
      <p><strong>Aviation Solution:</strong> Standardized briefing protocols ensure all critical information is communicated clearly and confirmed received.</p>

      <h2>2. Normalization of Deviance</h2>
      <p><strong>The Problem:</strong> Teams gradually accept lower safety standards, viewing risky shortcuts as "normal."</p>
      <p><strong>Real Cost:</strong> Regulatory investigations, work stoppages, and potential criminal liability for safety violations.</p>
      <p><strong>Aviation Solution:</strong> Regular safety culture assessments and "just culture" reporting systems that encourage honest reporting of deviations.</p>

      <h2>3. Poor Decision Making Under Pressure</h2>
      <p><strong>The Problem:</strong> When facing production pressure or emergency situations, teams make hasty decisions that compromise safety.</p>
      <p><strong>Real Cost:</strong> Emergency evacuations, environmental damage, and multi-million dollar cleanup costs.</p>
      <p><strong>Aviation Solution:</strong> Structured decision-making frameworks that ensure safety considerations are properly evaluated even under pressure.</p>

      <h2>4. Inadequate Situational Awareness</h2>
      <p><strong>The Problem:</strong> Workers lose awareness of changing conditions, equipment status, or the activities of other team members.</p>
      <p><strong>Real Cost:</strong> Equipment collisions, personnel injuries, and operational delays.</p>
      <p><strong>Aviation Solution:</strong> Systematic training in maintaining situational awareness and regular safety sweeps.</p>

      <h2>5. Hierarchical Communication Barriers</h2>
      <p><strong>The Problem:</strong> Junior staff hesitate to speak up about safety concerns due to organizational hierarchy.</p>
      <p><strong>Real Cost:</strong> Preventable incidents that could have been avoided if concerns were raised and addressed.</p>
      <p><strong>Aviation Solution:</strong> Flattened command structures during safety-critical operations and explicit encouragement for all team members to voice concerns.</p>

      <h2>The ROI of Human Factors Training</h2>
      <p>Investing in aviation-proven human factors training typically shows:</p>
      <ul>
        <li>25-40% reduction in human factor incidents</li>
        <li>Improved regulatory compliance scores</li>
        <li>Reduced insurance premiums</li>
        <li>Enhanced worker morale and retention</li>
        <li>Stronger social license to operate</li>
      </ul>

      <p>The aviation industry learned these lessons through systematic analysis of incidents and development of proven countermeasures. Mining operations don't need to reinvent these solutions - they can adapt and implement aviation's proven human factors methodologies.</p>
    `
  },
  {
    slug: "aviation-safety-transformation-mining",
    title: "The Aviation Safety Transformation That Mining Needs",
    excerpt: "How the aviation industry reduced fatality rates by 95% through systematic human factors training - and why mining operations need this same transformation.",
    author: "Lisa Wright",
    authorRole: "Human Factors Instructor",
    date: "2025-01-10",
    readTime: "6 min read",
    category: "Industry Insights",
    featured: false,
    content: `
      <p>In 1970, commercial aviation was experiencing one fatal accident per 140,000 flights. Today, that rate has dropped to one fatal accident per 16 million flights - a 95% improvement. This transformation didn't happen through better technology alone; it required a fundamental shift in how the industry approached human factors and safety culture.</p>

      <h2>The Crisis That Sparked Change</h2>
      <p>The 1970s and 1980s saw several high-profile aviation accidents where technical failures were compounded by human factor errors:</p>
      <ul>
        <li>Communication breakdowns between crew members</li>
        <li>Failure to challenge authority when safety was at risk</li>
        <li>Poor decision-making under pressure</li>
        <li>Inadequate situational awareness</li>
      </ul>
      <p>Sound familiar? These are the same human factor challenges facing mining operations today.</p>

      <h2>The CRM Revolution</h2>
      <p>Aviation's response was Crew Resource Management (CRM) - a systematic approach to training that focuses on communication skills, leadership and teamwork, situational awareness, and decision making.</p>

      <h2>Mining's Current Safety Challenge</h2>
      <p>Mining operations face remarkably similar challenges to 1970s aviation: high-stakes environments, complex systems, pressure situations, and hierarchical structures that may discourage safety reporting.</p>

      <h2>The Proven Path Forward</h2>
      <p>Mining doesn't need to reinvent the wheel. Aviation has already proven that systematic human factors training can dramatically improve safety outcomes through culture assessment, leadership training, team training, and continuous improvement.</p>

      <h2>Measurable Results</h2>
      <p>Mining operations that have implemented aviation-style human factors training report:</p>
      <ul>
        <li><strong>38% reduction</strong> in human factor-related incidents</li>
        <li><strong>52% improvement</strong> in safety communication effectiveness</li>
        <li><strong>45% increase</strong> in safety concern reporting</li>
        <li><strong>25% reduction</strong> in near-miss events</li>
        <li><strong>Improved regulatory compliance</strong> scores and reduced citations</li>
      </ul>

      <p>The transformation starts with recognizing that safety isn't just about equipment and procedures - it's about empowering people to make better decisions, communicate more effectively, and work as coordinated teams in high-stakes environments.</p>
    `
  },
  {
    slug: "airline-captains-prevent-mining-accidents",
    title: "Real Stories: How Airline Captains Prevent Mining Accidents",
    excerpt: "First-hand accounts from our aviation experts on applying crew resource management principles to prevent incidents in mining environments.",
    author: "Ram Muthukrishnan",
    authorRole: "Human Factors Instructor",
    date: "2025-01-05",
    readTime: "8 min read",
    category: "Case Studies",
    featured: false,
    content: `
      <p>After 25 years as an airline captain and human factors instructor, I've seen how the right training can mean the difference between a routine day and a catastrophic incident. When I began working with mining operations, I was struck by how many "accidents waiting to happen" could be prevented by applying the same crew resource management principles that keep aviation safe.</p>

      <h2>Case Study 1: The Near-Miss That Wasn't</h2>
      <p><strong>The Situation:</strong> During a shift change at a major iron ore operation, a new crew was taking over operation of a massive haul truck. The outgoing operator mentioned that the brakes "felt a bit soft" but the paperwork showed all systems normal.</p>
      <p><strong>The Aviation Principle:</strong> In aviation, we have a concept called "positive handover" - critical information must be clearly communicated and acknowledged, even if it's not in the official checklist.</p>
      <p><strong>The Result:</strong> The incoming operator took the brake concern seriously, conducted a proper inspection, and discovered a hydraulic leak that could have caused brake failure on a loaded truck descending a steep haul road.</p>

      <h2>Case Study 2: Speaking Up Saves Lives</h2>
      <p><strong>The Situation:</strong> A junior equipment operator noticed unusual vibrations in a conveyor system but hesitated to stop production because the shift supervisor was focused on meeting daily targets.</p>
      <p><strong>The Aviation Principle:</strong> In aviation, we train all crew members - regardless of rank - that they have not just the right but the obligation to voice safety concerns.</p>
      <p><strong>The Result:</strong> The operator felt empowered to stop the conveyor. Inspection revealed bearing failure that was about to cause catastrophic damage to the system and potentially injure workers in the area.</p>

      <h2>Case Study 3: Pressure Decisions Made Right</h2>
      <p><strong>The Situation:</strong> During a planned maintenance shutdown, unexpected weather threatened to extend the downtime significantly. Management pressure mounted to restart operations despite incomplete safety checks.</p>
      <p><strong>The Aviation Principle:</strong> Aviation uses structured decision-making frameworks that ensure safety considerations are properly weighted even under extreme pressure.</p>
      <p><strong>The Result:</strong> The team identified a phased restart approach that addressed the most critical safety items first while managing weather risks. Operations resumed safely without compromising long-term reliability or worker safety.</p>

      <h2>The Human Factor Difference</h2>
      <p>What makes these interventions successful isn't complex technology or expensive equipment - it's training people to communicate effectively under pressure, challenge authority when safety is at risk, make structured decisions even in time-critical situations, maintain awareness of changing conditions, and learn from errors rather than hide them.</p>

      <p>As an airline captain, I've landed safely thousands of times not because nothing ever went wrong, but because we were trained to handle whatever did go wrong. That's the mindset and skillset mining operations need to develop.</p>
    `
  }
];

export function getAllBlogPosts(): BlogPost[] {
  return blogPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return blogPostsData.find(post => post.slug === slug) || null;
}

export function getFeaturedBlogPost(): BlogPost | null {
  return blogPostsData.find(post => post.featured) || null;
}

export function getRegularBlogPosts(): BlogPost[] {
  return blogPostsData.filter(post => !post.featured);
}