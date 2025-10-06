# Crew Resource Mining LMS - Setup Guide

## 🎉 What We Built

A fully functional **Learning Management System (LMS)** for Crew Resource Management training in mining operations, featuring:

### ✅ Core Features Completed
- **12-Module Course Structure** - Full curriculum from your website
- **3 Interactive Scenarios** - Pre-scored decision-based training
  - Module 2: Night Shift Vibration (Situational Awareness)
  - Module 4: Pre-Start Shortcut (Decision Making)
  - Module 10: Emergency Radio Failure (Crisis Management)
- **Learner Dashboard** - Progress tracking, module unlocking, certificate status
- **Scenario Player** - Narrative → MCQ Decision → Feedback → Outcome flow
- **Compliance Tracking** - Certificate generation, expiry tracking, sequential module unlocking
- **Database** - Neon Postgres with Prisma ORM (all tables seeded)

### 🔧 Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Radix UI
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** Neon Postgres (Sydney region)
- **Email:** Resend (for notifications)

---

## 🚀 Current Status

### ✅ Working Now
1. **Homepage** - Your existing marketing site (`/`)
2. **LMS Dashboard** - Module list with progress (`/lms`)
3. **Scenario Player** - Interactive training (`/lms/scenarios/[id]`)
4. **Database** - Fully seeded with:
   - 1 Organization (Pilot Mine Operations)
   - 2 Users (Wayne Bowron, Admin)
   - 1 Course (12 modules)
   - 3 Scenarios (with pre-scored MCQ choices)
   - 1 Enrollment (Wayne → Course)

### 🎯 Test It Now
1. Visit: **http://localhost:3002/lms**
2. You'll see Wayne Bowron's dashboard
3. Click "Start" on Module 2, 4, or 10
4. Complete the scenario and see your score

---

## 📂 Project Structure

```
src/
├── app/
│   ├── lms/
│   │   ├── page.tsx                          # Dashboard
│   │   └── scenarios/[scenarioId]/page.tsx  # Scenario player
│   ├── api/
│   │   └── attempts/[attemptId]/
│       ├── decisions/route.ts            # Save decision API
│       └── complete/route.ts             # Complete attempt API
│   ├── page.tsx                              # Homepage (existing)
│   └── layout.tsx                            # Root layout
├── components/
│   ├── scenario/
│   │   ├── ScenarioPlayer.tsx                # Main player orchestrator
│   │   ├── NarrativeDisplay.tsx              # Story text
│   │   ├── DecisionMCQ.tsx                   # Multiple choice
│   │   └── OutcomeDisplay.tsx                # Results & feedback
│   └── ui/                                    # Shadcn components
├── lib/
│   └── db.ts                                  # Prisma client
└── prisma/
    ├── schema.prisma                          # Database schema
    └── seed.ts                                # Seed data (12 modules + 3 scenarios)
```

---

## 🗄️ Database Schema Highlights

### Key Tables
- **`orgs`** - Organizations with settings (gamification toggles, cert validity)
- **`users`** - Learners, supervisors, admins
- **`courses`** - CRM for Mining course
- **`modules`** - 12 modules (linked to scenarios)
- **`scenarios`** - Interactive training scenarios
- **`scenario_nodes`** - Narrative, decision, outcome nodes
- **`enrollments`** - User → Course with progress tracking
- **`module_attempts`** - Completion records per module
- **`attempts`** - Scenario attempt records
- **`decisions`** - Each MCQ choice with pre-defined scores
- **`certificates`** - Generated on course completion

---

## 🎮 How the System Works

### 1. Dashboard (`/lms`)
- Shows all 12 modules
- Sequential unlocking (complete Module 1 → unlock Module 2)
- Progress bar (0/12 → 12/12)
- Certificate status (expires in X days)

### 2. Scenario Player
**Flow:**
1. **Narrative** - Story context (time, weather, location, urgency)
2. **Decision (MCQ)** - 2-4 choices, each with:
   - Pre-defined score (0-100)
   - KPI scores (communication, situational_awareness, etc.)
   - Feedback text
   - Outcome description
3. **More Narrative/Decisions** - Chain through 3-5 nodes
4. **Outcome** - Final score, KPI breakdown, key lessons

**Scoring:**
- Each choice has a fixed score (NO AI, all pre-defined)
- Total score = average of all decision scores
- Pass if ≥ 70%
- KPI scores calculated per decision

### 3. Completion Flow
- Complete scenario → Save to `attempts` table
- If linked to module → Create `module_attempt`
- If passed → Unlock next module
- If all 12 modules passed → Generate certificate

---

## 🎨 Adding New Scenarios

Scenarios are defined in `prisma/seed.ts`. Here's the structure:

```typescript
{
  slug: 'my-scenario',
  title: 'My Scenario Title',
  moduleNumber: 3,  // Links to Module 3
  kpiFocus: ['communication', 'leadership'],
  estimatedMinutes: 10,

  nodes: [
    {
      nodeKey: 'n1',
      nodeType: 'NARRATIVE',
      body: {
        text: 'Story text here...',
        atmosphere: { time: '14:00', weather: 'Clear', location: 'North Pit' },
        next: 'd1'
      }
    },
    {
      nodeKey: 'd1',
      nodeType: 'DECISION',
      body: {
        question: 'What do you do?',
        kpiFocus: ['communication'],
        choices: [
          {
            id: 'a',
            text: 'Option A',
            icon: '⚠️',
            score: 50,
            kpiScores: { communication: 60, leadership: 40 },
            feedback: 'This choice is risky because...',
            outcome: 'The team becomes confused.',
            nextNode: 'o_failure'
          },
          {
            id: 'b',
            text: 'Option B',
            icon: '✅',
            score: 95,
            kpiScores: { communication: 100, leadership: 90 },
            feedback: 'Excellent! You demonstrated...',
            outcome: 'The team responds effectively.',
            nextNode: 'o_success'
          }
        ]
      }
    },
    {
      nodeKey: 'o_success',
      nodeType: 'OUTCOME',
      body: {
        title: 'Great Decision Making',
        summary: 'You successfully managed the situation.',
        kpiResults: { communication: 'Excellent', leadership: 'Strong' },
        lessons: [
          'Clear communication prevents confusion',
          'Early intervention stops escalation'
        ]
      }
    }
  ]
}
```

---

## 🔐 Authentication (Next Steps)

Currently using hardcoded user (`wayne@pilotmine.com.au`). To add NextAuth:

1. Install: `npm install next-auth @auth/prisma-adapter`
2. Create `/api/auth/[...nextauth]/route.ts`
3. Use email magic links (Resend integration)
4. Update dashboard to use `await auth()` instead of hardcoded email

---

## 📜 Certificate System

When a user completes all 12 modules:
1. Auto-generates certificate with serial `CRM-2025-XXXXXX`
2. Expiry date = issue date + `certValidityMonths` (12 months default)
3. QR code with verification code
4. Public verification page (TODO): `/certificates/[serial]`

---

## 🎛️ Org Settings (Gamification Toggle)

In `org_settings` table:
```typescript
{
  requireSequential: true,       // Enforce module order
  certValidityMonths: 12,        // 6 or 12
  reminderDaysBefore: [30,14,7], // Email reminders

  // Gamification (all OFF by default)
  gamificationEnabled: false,
  leaderboardEnabled: false,
  badgesEnabled: false,
  teamChallengesEnabled: false
}
```

To enable gamification:
1. Set flags to `true` in database
2. Add XP/badges components (conditionally rendered)
3. Build leaderboard page

---

## 🚀 Next Steps

### Priority 1 (MVP Polish)
- [ ] Certificate verification page (`/certificates/[serial]`)
- [ ] Email reminders (Resend integration for expiry alerts)
- [ ] Admin dashboard (`/admin`) - compliance overview
- [ ] NextAuth integration

### Priority 2 (Enhance UX)
- [ ] Add remaining 9 scenarios (Modules 1, 3, 5-9, 11-12)
- [ ] Mobile PWA configuration
- [ ] Offline mode support
- [ ] Animated progress indicators

### Priority 3 (Optional Features)
- [ ] Gamification UI (XP bars, badges, leaderboards)
- [ ] Team challenges
- [ ] Analytics dashboard (completion rates, KPI trends)
- [ ] SCORM export

---

## 📊 Database Commands

```bash
# Push schema changes
npm run db:push

# Seed database (safe to run multiple times)
npm run db:seed

# Open Prisma Studio (visual DB editor)
npm run db:studio

# Generate Prisma client (after schema changes)
npm run prisma:generate
```

---

## 🐛 Troubleshooting

### "User not found" error
- Seed script may not have run
- Run: `npm run db:seed`

### Modules not showing
- Check enrollment exists for Wayne Bowron
- Check module-scenario links in seed script

### Scenario not loading
- Check `scenarios` table has data
- Verify `scenario_nodes` exist
- Check `scenarioId` in URL

---

## 🎯 Current Limitations

1. **No authentication** - Using hardcoded user
2. **3 scenarios only** - Need 9 more for full course
3. **No email notifications** - Resend configured but not wired up
4. **No admin UI** - Can use Prisma Studio for now
5. **No certificate PDF** - Serial/verification code exist, need PDF generation
6. **No gamification UI** - Backend ready, frontend needs build

---

## ✨ What Makes This Special

1. **No AI Dependencies** - All scoring pre-defined, faster & cheaper
2. **Production-Ready Schema** - Handles multi-tenancy, compliance, gamification
3. **Scalable** - Org settings allow per-tenant configuration
4. **Mobile-Friendly** - Responsive design, touch-optimized
5. **Modular** - Easy to add scenarios, modules, features

---

## 🎓 Sample Data

**User:** wayne@pilotmine.com.au (Wayne Bowron)
**Org:** Pilot Mine Operations
**Enrollment:** CRM for Mining course
**Status:** 0/12 modules completed (ready to start)

**Scenarios:**
- `/lms/scenarios/[id]?moduleId=...` (get IDs from database)

---

## 📞 Need Help?

Check Prisma Studio for data: `npm run db:studio`
Visit: http://localhost:5555
