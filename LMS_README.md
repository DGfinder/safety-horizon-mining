# Safety Horizon Mining - LMS Implementation

## Overview

A comprehensive Learning Management System (LMS) for crew resource management training in mining operations. Built with Next.js 14, TypeScript, Prisma, and NextAuth for enterprise-grade security and scalability.

## Features Implemented

### 🔐 Phase 1: Security & Authentication
- **NextAuth.js v5** integration with Prisma adapter
- **JWT-based sessions** with custom callbacks for role/org data
- **Bcrypt password hashing** for credential security
- **Professional login page** matching brand aesthetic (Navy #192135 + Orange #EC5C29)
- **Route protection middleware** securing `/lms/*` and `/api/attempts/*`
- **Session management** with logout functionality

### 🧭 Phase 2: Navigation Integration
- **LMS Portal link** added to main navigation (desktop + mobile)
- **Hero section CTA** updated to link to LMS
- **LMS Access card** on homepage with:
  - Feature highlights (Real-World Scenarios, Track Progress, Earn Certificates)
  - Stats display (12+ Scenarios, 500+ Learners, 95% Pass Rate)
  - Professional design with brand colors

### 📊 Phase 3: Data Visualizations
Comprehensive visualization components for training insights:

#### **PerformanceDashboard** (`src/components/visualizations/PerformanceDashboard.tsx`)
- Line chart showing score progression
- Bar chart for module-by-module performance
- Average score calculation and display
- Built with Recharts

#### **SafetyMetrics** (`src/components/visualizations/SafetyMetrics.tsx`)
- 4 circular gauge metrics:
  - Training Completion
  - Safety Compliance
  - Risk Awareness
  - Certification Status
- Color-coded performance indicators (green/amber/red)
- Responsive grid layout

#### **TrainingJourney** (`src/components/visualizations/TrainingJourney.tsx`)
- Visual progress map of all modules
- Status indicators (Completed, Current, Next, Locked)
- Progress bar with percentage
- Journey completion celebration

#### **KPIRadar** (`src/components/visualizations/KPIRadar.tsx`)
- Radar chart showing 6 key competencies:
  - Decision Making
  - Risk Assessment
  - Communication
  - Situational Awareness
  - Team Resource Management
  - Training Progress
- Performance insights and recommendations
- Skill breakdown with progress bars

### 🎯 Phase 4: Scenario Enhancements

#### **ScenarioCompletion** (`src/components/scenario/ScenarioCompletion.tsx`)
- Professional completion summary page
- Score display with pass/fail status
- Performance metrics (Accuracy, Correct Decisions, Status)
- Key learnings and takeaways
- Next steps navigation

#### **DecisionFeedback** (`src/components/scenario/DecisionFeedback.tsx`)
- Enhanced feedback with animations
- Color-coded correct/incorrect indicators
- Detailed explanations
- Safety insights and tips
- Smooth fade-in animations

### 🛡️ Phase 5: Polish & Error Handling

#### **Loading States**
- `DashboardSkeleton` for LMS dashboard
- `LoadingSpinner` reusable component (sm, default, lg sizes)
- `LoadingPage` for full-page loading
- Route-specific loading pages (`/lms/loading.tsx`, `/login/loading.tsx`)

#### **Error Handling**
- LMS error boundary (`/lms/error.tsx`)
- 404 Not Found page with navigation
- User-friendly error messages
- Reset functionality

## Technical Stack

### Core
- **Next.js 14.2.18** - React framework with App Router
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database

### Authentication
- **NextAuth.js v5** - Authentication framework
- **@auth/prisma-adapter** - Prisma integration
- **bcryptjs** - Password hashing

### UI/Styling
- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Headless UI components
- **Lucide Icons** - Icon library
- **Recharts** - Data visualization

### Data Visualization
- **Recharts** - Charts (Line, Bar, Radar)
- **Custom SVG gauges** - Circular progress indicators

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/[...nextauth]/     # NextAuth API routes
│   ├── lms/
│   │   ├── scenarios/[scenarioId]/ # Scenario player
│   │   ├── page.tsx                # Dashboard with visualizations
│   │   ├── loading.tsx             # Loading state
│   │   └── error.tsx               # Error boundary
│   ├── login/
│   │   ├── page.tsx                # Login page
│   │   └── loading.tsx             # Login loading
│   └── not-found.tsx               # 404 page
├── components/
│   ├── lms/
│   │   ├── LMSLayout.tsx           # Main LMS layout
│   │   ├── LMSSidebar.tsx          # Navigation sidebar with logout
│   │   ├── CircularProgress.tsx    # Progress indicator
│   │   └── ModuleTree.tsx          # Module navigation
│   ├── scenario/
│   │   ├── ScenarioCompletion.tsx  # Completion summary
│   │   ├── DecisionFeedback.tsx    # Enhanced feedback
│   │   └── [existing components]
│   ├── visualizations/
│   │   ├── PerformanceDashboard.tsx
│   │   ├── SafetyMetrics.tsx
│   │   ├── TrainingJourney.tsx
│   │   └── KPIRadar.tsx
│   ├── ui/
│   │   └── loading.tsx             # Loading components
│   └── LMSAccess.tsx               # Homepage LMS card
├── auth.ts                         # NextAuth configuration
├── types/
│   └── next-auth.d.ts             # NextAuth type extensions
└── middleware.ts                   # Route protection
```

## Authentication Flow

1. **Unauthenticated users** accessing `/lms` → redirected to `/login`
2. **Login page** validates credentials via NextAuth
3. **Successful login** → JWT token created with user data
4. **Session data** includes: `id`, `email`, `name`, `role`, `orgId`
5. **Protected routes** check session via middleware
6. **Logout** → Session cleared, redirect to homepage

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generated-secret>
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
npx prisma generate
npx prisma db push
```

### 3. Generate Auth Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Add to `.env.local` as `NEXTAUTH_SECRET`

### 4. Run Development Server
```bash
npm run dev
```

Visit:
- Homepage: http://localhost:3000
- Login: http://localhost:3000/login
- LMS Dashboard: http://localhost:3000/lms

## Default Credentials

**Demo User:**
- Email: `wayne@pilotmine.com.au`
- Password: `demo123`

## Key Features by Route

### `/` (Homepage)
- Navigation with LMS Portal link
- Hero section with "Access LMS Portal" CTA
- LMS Access card with features and stats

### `/login`
- Professional login page
- Error handling with clear messages
- Demo credentials displayed
- Brand-consistent design

### `/lms` (Dashboard)
- Welcome header with personalization
- Certification status card
- Course progress overview
- 4 Safety Metrics gauges
- Training Journey visual map
- KPI Radar competency chart
- Performance Dashboard (line/bar charts)
- Module list with status indicators

### `/lms/scenarios/[scenarioId]`
- Interactive scenario player
- Decision-based learning
- Real-time feedback
- Impact analysis visualizations

## Design System

### Brand Colors
- **Primary Navy:** `#192135`
- **Safety Orange:** `#EC5C29`
- **White:** `#FFFFFF`

### Typography
- **Headings:** Inter
- **Body:** Work Sans

### Component Patterns
- Cards with subtle shadows
- Rounded corners (8px)
- Hover states with smooth transitions
- Responsive grid layouts
- Mobile-first design

## Performance Optimizations

1. **Loading States** - Skeleton loaders prevent layout shift
2. **Error Boundaries** - Graceful error handling
3. **Code Splitting** - Dynamic imports for visualizations
4. **Optimistic UI** - Immediate feedback on actions
5. **Responsive Images** - Proper image optimization

## Security Considerations

✅ **Implemented:**
- Password hashing with bcrypt
- JWT-based sessions
- Route-level protection via middleware
- CSRF protection (NextAuth default)
- Session expiration handling

⚠️ **Production Recommendations:**
- Enable HTTPS in production
- Use secure session cookies
- Implement rate limiting on auth endpoints
- Add 2FA for admin accounts
- Regular security audits

## Testing Checklist

- [x] Authentication flow (login/logout)
- [x] Protected route access
- [x] Dashboard visualizations render correctly
- [x] Responsive design (mobile/tablet/desktop)
- [x] Error states display properly
- [x] Loading states prevent layout shift
- [x] Navigation between routes works
- [x] Session persistence across page refreshes

## Future Enhancements

### Suggested Improvements
1. **Email verification** - Verify user emails before access
2. **Password reset** - Forgot password flow
3. **OAuth providers** - Google, Microsoft SSO
4. **Real-time progress** - WebSocket updates
5. **Certificate downloads** - PDF generation
6. **Admin dashboard** - User management
7. **Analytics** - Detailed usage metrics
8. **Notifications** - Email/push notifications

### Scalability Considerations
- Database indexing for performance
- Redis caching for sessions
- CDN for static assets
- Horizontal scaling with load balancers

## Troubleshooting

### Issue: Login not working
**Solution:** Ensure `NEXTAUTH_SECRET` is set in `.env.local`

### Issue: Visualizations not loading
**Solution:** Check that Recharts is installed: `npm install recharts`

### Issue: Session expires immediately
**Solution:** Verify JWT callback in `auth.ts` is properly configured

### Issue: 404 on protected routes
**Solution:** Clear `.next` cache: `rm -rf .next && npm run dev`

## Support

For issues or questions:
1. Check the troubleshooting guide above
2. Review error logs in dev console
3. Verify environment variables are set
4. Ensure database migrations are up to date

## License

© 2024 Safety Horizon Mining. All rights reserved.
