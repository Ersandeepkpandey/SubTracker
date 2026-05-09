# SubTrack — Product Requirements Document
### The Subscription Intelligence Platform
**Version:** 2.0 | **Date:** May 2026 | **Status:** Pre-development

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [What SubTrack Is Not](#2-what-subtrack-is-not)
3. [Target Audience](#3-target-audience)
4. [Business Model](#4-business-model)
5. [Core Features — MVP v1](#5-core-features--mvp-v1)
6. [Design Philosophy — Simplicity First](#6-design-philosophy--simplicity-first)
7. [Website Design Spec](#7-website-design-spec)
8. [Android App Design Spec](#8-android-app-design-spec)
9. [AI Insights & Assistant](#9-ai-insights--assistant)
10. [Reminder & Notification System](#10-reminder--notification-system)
11. [Tech Stack](#11-tech-stack)
12. [Database Schema](#12-database-schema)
13. [API Routes](#13-api-routes)
14. [Dashboard Structure](#14-dashboard-structure)
15. [Roadmap](#15-roadmap)
16. [Product Principles](#16-product-principles)
17. [Success Metrics](#17-success-metrics)

---

## 1. Product Vision

SubTrack is the command center for modern digital subscriptions.

It is not a budgeting app. It is not a banking tool. It is a focused, intelligent platform that helps you see every subscription you pay for, get warned before renewals happen, and make smarter decisions about what to keep and what to cut.

**Positioning:** Subscription Intelligence Platform

**The core promise:** You will never be surprised by a subscription charge again.

**Inspired by:** Linear (focus), Stripe (trust), Vercel (speed), Notion (clarity)

---

## 2. What SubTrack Is Not

| Not This | Instead This |
|---|---|
| Finance tracker | Subscription tracker |
| Banking app | Gmail-connected detector |
| Expense manager | Renewal reminder system |
| Enterprise tool | Personal intelligence layer |
| Feature-bloated dashboard | Minimal, fast, actionable UI |

---

## 3. Target Audience

| Segment | Pain Point | Example Subs They Manage |
|---|---|---|
| AI Power Users | Too many AI tool subscriptions | ChatGPT, Claude, Cursor, Midjourney |
| Developers | Cloud + SaaS bills scattered everywhere | AWS, GitHub, Vercel, Postman |
| Startup Founders | Company tools billed to personal cards | Notion, Figma, Slack, Linear |
| OTT Consumers | Multiple streaming platforms | Netflix, Hotstar, Prime, Spotify |
| Freelancers | Creative tools on multiple cycles | Adobe, Canva, Grammarly, Figma |
| SaaS Enthusiasts | Always trying new tools | Ahrefs, Loom, Descript, Superhuman |
| Everyday Users | Forgot what they even subscribed to | Everything above |

**Primary persona:** Rohan, 27, developer in Bangalore. Pays for 14 subscriptions across 3 cards. Forgets 4–5 renewals every quarter. Spends 20 minutes trying to find cancellation pages when he remembers.

---

## 4. Business Model

### Pricing

**No permanent free tier. No crippled features. No feature walls.**

SubTrack runs on a **14-day full-access free trial**, then a single paid plan.

| | Free Trial | Pro Plan |
|---|---|---|
| Duration | 14 days | Monthly / Yearly |
| Price | ₹0 | ₹299/month or ₹2,499/year |
| Gmail auto-detection | Yes | Yes |
| Manual entry | Yes | Yes |
| Renewal reminders | Yes — fully active | Yes |
| AI insights | Yes | Yes |
| Unlimited subscriptions | Yes | Yes |
| Card required to start | No | Yes |

### Why Full Trial, Not Freemium

Freemium for this product creates a broken experience. If a user connects Gmail, SubTrack finds 15 subscriptions, and then a renewal slips by unnotified because reminders are paywalled — they blame SubTrack, not the plan. That is a worse outcome than not having a free tier at all.

The trial must be fully functional. Every feature. Every notification. Zero restrictions.

### Trial Conversion Emails

| Day | Email |
|---|---|
| Day 1 | "SubTrack found X subscriptions. You're spending ₹Y/month." |
| Day 7 | "Your trial is halfway done. Here's what we've saved you from." |
| Day 12 | "2 days left. Renew for ₹299/month to keep your reminders active." |
| Day 14 | "Your trial ended. Your data is safe. Subscribe to stay protected." |

---

## 5. Core Features — MVP v1

### 5.1 Google Login

One-click sign in with Google. No separate email/password setup. No forms to fill. Users land on the dashboard immediately after login.

### 5.2 Gmail Auto-Detection

Connect Gmail with readonly OAuth access. SubTrack scans for:

- Invoices and receipts
- Subscription renewal confirmations
- Payment confirmations
- Trial ending notifications

**Supported services (auto-detected):**
AI tools · OTT platforms · SaaS products · Cloud services · Domain registrars · Hosting providers · Productivity tools

**Examples:** ChatGPT, Claude Pro, Netflix, Spotify, Hotstar, Adobe CC, AWS, Cursor, GitHub Copilot, Figma, Notion, Prime Video, Vercel, Postman

**Important:** Gmail access is readonly. SubTrack never reads email content — only headers, sender, and subject lines to detect subscription patterns.

### 5.3 Manual Subscription Entry

Users can add any subscription manually:

- Service name
- Amount and currency
- Billing cycle (monthly / yearly / weekly / custom)
- Renewal date
- Category (AI / OTT / SaaS / Cloud / Productivity / Other)
- Notes (optional)

### 5.4 Renewal Reminders

| Timing | Channel | Example |
|---|---|---|
| 3 days before | Email + Web push | "Netflix renews in 3 days. ₹799 will be charged." |
| 1 day before | Email + Web push | "Claude Pro renews tomorrow. ₹1,700 charge incoming." |
| Renewal day | Email | "Spotify renewed today. ₹119 charged." |

### 5.5 Dashboard

Single-screen overview showing:

- Total monthly spend
- Yearly projection
- Upcoming renewals (next 7 days)
- All active subscriptions
- Category spending breakdown
- AI spend tracking (separate because users want to see this specifically)

### 5.6 Cancellation Support

SubTrack does not cancel subscriptions automatically in MVP. Instead:

- One-tap link to official cancellation page for each service
- Step-by-step cancellation guidance for complex services (Adobe, Apple, etc.)
- "Mark as cancelled" to remove from tracking

---

## 6. Design Philosophy — Simplicity First

> **Design rule: If a 10-year-old cannot complete every action without reading instructions, the design has failed.**

This rule applies to both the website and the Android app. Every screen, every button, every flow must be obvious on first look.

### Core Design Principles

**1. One action per screen**
Never show two primary actions at the same time. Every screen has one clear next step.

**2. Big tap targets**
All buttons and interactive elements are at minimum 48px tall on mobile. No tiny links. No cramped menus.

**3. Words over icons alone**
Every icon has a label. No icon-only navigation except where the icon is universally understood (back arrow, close X).

**4. No modals for important actions**
Modals are disorienting. Important flows (add subscription, edit details) use full screens, not popups.

**5. Confirm before delete**
Every destructive action (delete subscription, cancel account) shows a clear confirmation with plain language: "Are you sure you want to remove Netflix? This cannot be undone."

**6. Error messages in human language**
No "Error 422". Instead: "We couldn't connect to Gmail. Check your internet and try again."

**7. Loading states always visible**
No blank screens. Every loading state shows a spinner or skeleton with a short message.

**8. Color used sparingly**
Color is only used to signal status: green for active, amber for renewing soon, red for overdue. Not for decoration.

---

## 7. Website Design Spec

### 7.1 Visual Style

| Property | Value |
|---|---|
| Theme | Light default, dark mode supported |
| Font | Clean sans-serif (e.g. Geist, DM Sans) |
| Primary color | Deep teal `#0D9E75` |
| Background | Off-white `#F9F9F8` |
| Surface | Pure white `#FFFFFF` |
| Text | Near-black `#1A1A1A` |
| Border radius | 12px for cards, 8px for inputs |
| Max content width | 1200px |
| Sidebar width | 240px |

### 7.2 Navigation Structure

```
Sidebar (desktop) / Bottom nav (mobile web)
├── Dashboard          (home icon + label)
├── Subscriptions      (list icon + label)
├── Calendar           (calendar icon + label)
├── Insights           (chart icon + label)
├── Notifications      (bell icon + label)
└── Settings           (gear icon + label)
```

### 7.3 Screen Specs

#### Landing Page (unauthenticated)

**Above the fold:**
- SubTrack logo top-left
- "Start Free Trial" button top-right (large, filled, teal)
- Hero headline: "Never miss a subscription renewal again."
- Subheadline: "Connect Gmail. See every subscription. Get reminded before you're charged."
- Single CTA button: "Start your 14-day free trial" — centered, large
- No pricing on hero. No feature list. Just the one action.

**Below the fold (scroll):**
- 3 feature highlights with icons and one-line descriptions
- Dashboard screenshot
- How it works (3 steps: Connect → Detect → Get reminded)
- Pricing card (simple, one plan)
- FAQ (5 questions max)
- Footer

**Design rule:** The landing page should have exactly one primary CTA above the fold. The word "free" must appear in the button.

#### Dashboard Screen

```
┌─────────────────────────────────────────────────┐
│  SubTrack                          Rohan ▾       │
├────────────┬────────────────────────────────────┤
│            │                                    │
│ Dashboard  │  Good morning, Rohan               │
│            │                                    │
│ Subscriptions│ ┌──────────┐ ┌──────────┐       │
│            │  │ Monthly   │ │ Yearly   │       │
│ Calendar   │  │ ₹8,200    │ │ ₹98,400  │       │
│            │  └──────────┘ └──────────┘       │
│ Insights   │                                    │
│            │  Renewing soon                     │
│ Notifications│ ┌─────────────────────────────┐ │
│            │  │ Netflix        3 days  ₹799  │ │
│ Settings   │  │ Claude Pro     5 days  ₹1700 │ │
│            │  │ Hotstar        8 days  ₹299  │ │
│            │  └─────────────────────────────┘ │
│            │                                    │
│            │  All subscriptions         + Add   │
│            │  [list of subscriptions]           │
└────────────┴────────────────────────────────────┘
```

**Rules:**
- Monthly spend is the largest number on screen
- "Renewing soon" section always visible if anything renews in 7 days
- "+ Add" button always visible in top-right of subscriptions list
- No charts on the main dashboard — just numbers and lists

#### Subscriptions Screen

- Search bar at top (always visible)
- Filter by category (horizontal pill row: All · AI · OTT · SaaS · Cloud · Other)
- Each subscription row shows: logo, name, amount, renewal date, status badge
- Tapping a row opens the detail screen (full screen, not modal)
- "+ Add subscription" — large floating button, bottom-right

#### Add Subscription Screen

Full-screen form. Fields in order:
1. Service name (text input with autocomplete for known services)
2. Amount (number input, currency selector beside it)
3. Billing cycle (segmented control: Monthly / Yearly / Other)
4. Renewal date (date picker — large, easy tap)
5. Category (horizontal scroll pills)
6. Notes (optional textarea, collapsed by default)

Bottom: large "Save Subscription" button. Always visible, not scrolled off.

#### Subscription Detail Screen

- Service logo / icon at top
- Name and category
- Amount + billing cycle
- Next renewal date (with days-remaining badge)
- Status toggle (Active / Paused)
- "Cancel this subscription" link → opens cancellation guide
- Edit button (top-right)
- Delete button (bottom, red text, not a filled button)

#### Calendar Screen

- Monthly calendar view
- Dates with renewals show colored dots
- Tapping a date shows subscriptions renewing that day
- Toggle: Month view / List view (simple toggle at top)

#### Insights Screen

- 3 insight cards always shown:
  - "You spend ₹X/month"
  - "Your most expensive category is Y"
  - "X subscriptions renew this month"
- AI-generated suggestion (if available): "You haven't opened Grammarly in 60 days. Consider cancelling."
- Category breakdown: horizontal bar chart (simple, labeled)
- Month-over-month trend: line chart (2 lines max)

#### Settings Screen

- Account section: name, email, profile photo
- Connected accounts: Gmail (connected / disconnect)
- Notification preferences: toggles for email / push, and which reminders (3-day / 1-day / renewal-day)
- Subscription plan: current plan, days remaining, upgrade/manage button
- Danger zone: Delete account (red text, requires confirmation)

### 7.4 Empty States

Every screen must have a thoughtful empty state — not a blank page.

| Screen | Empty State Message | CTA |
|---|---|---|
| Dashboard | "No subscriptions yet. Add one to get started." | + Add subscription |
| Subscriptions | "No subscriptions found. Add your first one." | + Add subscription |
| Calendar | "No renewals this month. Enjoy the quiet." | — |
| Insights | "Add a few subscriptions to see your spending insights." | + Add subscription |

---

## 8. Android App Design Spec

### 8.1 Visual Style

| Property | Value |
|---|---|
| Design system | Material Design 3 |
| Theme | Light default, dark mode supported |
| Primary color | Teal `#0D9E75` |
| Minimum touch target | 48dp (hard requirement) |
| Font | Roboto (system default) |
| Corner radius | 16dp for cards, 12dp for inputs |

### 8.2 Navigation

Bottom navigation bar — always visible.

```
[ Dashboard ]  [ Subscriptions ]  [ Add ]  [ Insights ]  [ Settings ]
  (home icon)    (list icon)      (+ FAB)  (chart icon)   (gear icon)
```

- "Add" is a Floating Action Button (FAB) elevated above the nav bar
- Labels always shown under icons
- Active tab highlighted in teal
- No hamburger menu. No hidden navigation.

### 8.3 Screen Specs

#### Splash Screen

- SubTrack logo centered on white background
- Fades to login screen after 1.5 seconds
- No animation other than the fade

#### Login Screen

```
┌─────────────────────────┐
│                         │
│      SubTrack logo      │
│                         │
│   "Track every          │
│    subscription.        │
│    Miss nothing."       │
│                         │
│  ┌─────────────────────┐│
│  │  🔵 Continue with   ││
│  │     Google          ││
│  └─────────────────────┘│
│                         │
│  By continuing, you     │
│  agree to our Terms     │
│                         │
└─────────────────────────┘
```

- One button only: "Continue with Google"
- Button is full width, 56dp tall, rounded corners
- No email/password option in MVP
- Terms link at bottom in small text

#### Onboarding (after first login — 3 screens max)

**Screen 1:** "We found 0 subscriptions. Connect Gmail to detect them automatically."
→ Button: "Connect Gmail" and "Skip for now"

**Screen 2 (if Gmail connected):** "Great! We found X subscriptions. Review them below."
→ Button: "Let's go"

**Screen 3:** "Get reminded before renewals. Turn on notifications."
→ Button: "Turn on notifications" and "Maybe later"

No more than 3 onboarding screens. Each screen has exactly one primary action.

#### Dashboard Screen

```
┌─────────────────────────┐
│ SubTrack         🔔 👤  │
├─────────────────────────┤
│  This month             │
│  ┌─────────┐ ┌────────┐ │
│  │ ₹8,200  │ │₹98,400 │ │
│  │ monthly │ │yearly  │ │
│  └─────────┘ └────────┘ │
├─────────────────────────┤
│  Renewing soon          │
│  ┌───────────────────┐  │
│  │ Netflix   3 days  │  │
│  │           ₹799    │  │
│  ├───────────────────┤  │
│  │ Claude    5 days  │  │
│  │           ₹1,700  │  │
│  └───────────────────┘  │
├─────────────────────────┤
│  All subscriptions  14  │
│  [scroll list]          │
│                         │
└────🏠──📋──➕──📊──⚙️───┘
```

- Monthly spend shown in the largest text on screen (32sp)
- "Renewing soon" card uses amber background when anything renews in 3 days
- Subscription rows are 72dp tall — easy to tap
- FAB (+) always in bottom center

#### Add Subscription Screen

Full screen. Step-by-step layout. Not a long scrolling form.

**Step 1 of 3 — What is it?**
- Large text field: "Service name"
- Below it: horizontal scroll row of common service logos (Netflix, Spotify, Claude, etc.) — tap to autofill
- Next button at bottom

**Step 2 of 3 — How much?**
- Amount field (number keyboard auto-opens)
- Currency picker (INR default)
- Billing cycle: 3 large chips — Monthly / Yearly / Other
- Next button at bottom

**Step 3 of 3 — When does it renew?**
- Date picker (full-screen calendar picker, not a small dropdown)
- Category picker (scrollable chips)
- "Save Subscription" button — full width, teal, 56dp tall

**Design rule:** Never show all fields at once on mobile. Break into steps. Each step fits one screen without scrolling.

#### Subscription Detail Screen

```
┌─────────────────────────┐
│ ← Back            Edit  │
├─────────────────────────┤
│                         │
│   [Service logo 64dp]   │
│   Netflix               │
│   OTT · Monthly         │
│                         │
├─────────────────────────┤
│  Amount        ₹799/mo  │
│  Next renewal  3 days   │
│  Status        Active ● │
├─────────────────────────┤
│  ┌─────────────────────┐│
│  │  Cancel subscription││
│  │  (opens guide)      ││
│  └─────────────────────┘│
│                         │
│  [ Remove from SubTrack ]│
│   (red text, bottom)    │
└─────────────────────────┘
```

- Back arrow always top-left
- Edit button always top-right
- "Cancel subscription" is a card with an arrow — not a destructive button
- "Remove from SubTrack" is plain red text at the bottom — requires confirmation tap

#### Subscription List Screen

- Search bar pinned at top
- Filter chips below search: All · AI · OTT · SaaS · Cloud · Other
- Each row: logo, name, renewal date, amount
- Swipe left on a row to reveal "Delete" action (red)
- FAB (+) bottom-right

#### Notifications Screen

Timeline layout:

```
Today
  Netflix renews tomorrow — ₹799          [View]

Yesterday
  Spotify renewed — ₹119 charged          [View]

3 days ago
  Adobe CC renewed — ₹4,230 charged       [View]
```

- Grouped by date
- Each item tappable to open subscription detail
- Empty state: "You're all caught up. No new alerts."

#### Settings Screen

Grouped list layout (standard Android settings pattern):

**Account**
- Name (display only)
- Email (display only)
- Sign out

**Connected accounts**
- Gmail (Connected · green dot / Not connected · tap to connect)

**Notifications**
- 3 days before renewal (toggle)
- 1 day before renewal (toggle)
- On renewal day (toggle)
- Email reminders (toggle)
- Push notifications (toggle)

**Subscription**
- Plan: Pro · 8 days remaining
- Manage plan (opens web browser)

**Support**
- Help & FAQ
- Contact support

**Danger zone**
- Delete account (red text)

### 8.4 Android-Specific Rules

- Respect system back button always
- Support Android dark mode — detect system preference automatically
- Haptic feedback on all primary button taps
- Pull-to-refresh on dashboard and subscription list
- Offline mode: show cached data with a "You're offline" banner — no crashes
- Never block the UI for more than 1 second without showing a loading indicator

---

## 9. AI Insights & Assistant

### 9.1 Insight Generation

AI insights are generated server-side using Gemini / Groq. They are not real-time — they refresh once daily or when the user manually syncs.

**Insight types:**

| Type | Example |
|---|---|
| Spend summary | "You spend ₹8,200/month — ₹98,400/year on subscriptions." |
| Category breakdown | "42% of your spend is on AI tools." |
| Unused detection | "You haven't used Canva Pro in 45 days. Consider cancelling." |
| Anomaly | "Your spending increased by ₹2,100 this month vs last." |
| Recommendation | "You could save ₹1,800/month by switching Adobe CC to a yearly plan." |

### 9.2 AI Assistant (Phase 3)

Text-based Q&A interface. Users can ask:

- "How much do I spend on subscriptions monthly?"
- "What renews this week?"
- "Which subscriptions are the most expensive?"
- "What should I cancel?"
- "How much do I spend on AI tools?"

**Implementation:** The AI assistant queries the user's subscription data from the database, formats it as context, and passes it to the LLM with a strict system prompt. It does not have access to any other user data.

---

## 10. Reminder & Notification System

### 10.1 Trigger Logic

Every night at 9:00 AM IST, a cron job runs:

1. Fetch all active subscriptions where `renewal_date` is in 1, 3, or 0 days from today
2. For each match, check if a notification for that `(subscription_id, reminder_days, renewal_date)` combination has already been sent
3. If not sent, send notification and mark as sent

This prevents duplicate notifications if the job runs multiple times.

### 10.2 Email Template Rules

- Subject line includes the service name and days remaining
- Body is plain text or minimal HTML — no heavy design
- Single CTA: "View in SubTrack"
- Unsubscribe link at bottom (legal requirement)
- Sent from: reminders@subtrack.app

### 10.3 Push Notification Rules

- Title: "Renewal alert"
- Body: "Netflix renews in 3 days — ₹799"
- Tap action: opens subscription detail screen
- Use Firebase Cloud Messaging for Android (Phase 3)
- Web push using Web Push API for web (MVP)

---

## 11. Tech Stack

### Frontend (Web)

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | TailwindCSS |
| Components | shadcn/ui |
| Auth | NextAuth.js with Google provider |
| State | Zustand or React Query |
| Charts | Recharts |

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| ORM | Prisma |
| Database | PostgreSQL |
| Job scheduler | node-cron |
| Email | Resend |
| Push (web) | Web Push API |

### Mobile (Phase 3)

| Layer | Technology |
|---|---|
| Framework | React Native (Expo) |
| Navigation | Expo Router |
| Push notifications | Firebase Cloud Messaging |

### AI Layer

| Provider | Use case |
|---|---|
| Gemini API | Primary AI insights |
| Groq | Fast inference fallback |
| OpenRouter | Model routing and fallback |

### Infrastructure

| Service | Use case |
|---|---|
| Vercel | Web frontend deployment |
| Railway / Render | Backend + cron jobs |
| Supabase | PostgreSQL hosting |
| Cloudflare | DNS + CDN |

---

## 12. Database Schema

### users

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| name | varchar(255) | From Google profile |
| email | varchar(255) | Unique |
| google_id | varchar(100) | OAuth sub claim |
| gmail_token | text | Encrypted refresh token |
| gmail_connected | boolean | Default false |
| trial_started_at | timestamp | Set on first login |
| trial_ends_at | timestamp | trial_started_at + 14 days |
| subscription_status | enum | trial / active / expired |
| stripe_customer_id | varchar(100) | Nullable |
| created_at | timestamp | Default now() |

### subscriptions

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| user_id | uuid (FK) | → users.id |
| service_name | varchar(255) | e.g. "Netflix" |
| service_logo_url | text | Nullable, auto-fetched |
| category | enum | ai / ott / saas / cloud / productivity / other |
| amount | decimal(10,2) | Billing amount |
| currency | char(3) | INR, USD, EUR, etc. |
| billing_cycle | enum | monthly / yearly / weekly / custom |
| renewal_date | date | Next billing date |
| source | enum | gmail / manual |
| cancel_url | text | Official cancel page URL |
| is_active | boolean | Default true |
| notes | text | Nullable |
| created_at | timestamp | Default now() |
| updated_at | timestamp | Auto-updated |

### notifications

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| user_id | uuid (FK) | → users.id |
| subscription_id | uuid (FK) | → subscriptions.id |
| reminder_days | int | 3, 1, or 0 |
| notification_type | enum | email / push |
| status | enum | pending / sent / failed |
| sent_at | timestamp | Null if not yet sent |
| renewal_date_ref | date | Which renewal this is for (prevents duplicates) |
| created_at | timestamp | Default now() |

### gmail_sync_logs

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| user_id | uuid (FK) | → users.id |
| synced_at | timestamp | When sync ran |
| emails_scanned | int | Count of emails checked |
| subscriptions_found | int | New detections in this sync |
| status | enum | success / failed |
| error_message | text | Nullable |

---

## 13. API Routes

### Auth

| Method | Route | Description |
|---|---|---|
| GET | /auth/google | Initiate Google OAuth |
| GET | /auth/google/callback | Handle OAuth callback |
| POST | /auth/logout | Clear session |
| GET | /auth/me | Get current user |

### Subscriptions

| Method | Route | Description |
|---|---|---|
| GET | /subscriptions | List all for user |
| POST | /subscriptions | Create manual subscription |
| GET | /subscriptions/:id | Get single subscription |
| PATCH | /subscriptions/:id | Update subscription |
| DELETE | /subscriptions/:id | Delete subscription |

### Gmail

| Method | Route | Description |
|---|---|---|
| POST | /gmail/connect | Connect Gmail (OAuth) |
| POST | /gmail/sync | Trigger manual sync |
| GET | /gmail/status | Check connection status |
| DELETE | /gmail/disconnect | Revoke access |

### Insights

| Method | Route | Description |
|---|---|---|
| GET | /insights/summary | Monthly/yearly totals |
| GET | /insights/categories | Spend by category |
| GET | /insights/suggestions | AI-generated recommendations |
| POST | /ai/ask | Ask the AI assistant a question |

### Notifications

| Method | Route | Description |
|---|---|---|
| GET | /notifications | List user notifications |
| PATCH | /notifications/preferences | Update reminder settings |
| GET | /notifications/upcoming | Renewals in next 7 days |

### Admin

| Method | Route | Description |
|---|---|---|
| GET | /admin/users | List all users |
| GET | /admin/analytics | Platform-level stats |
| GET | /admin/logs | Sync and error logs |

---

## 14. Dashboard Structure

### Web Routes

```
/                     → Landing page (unauthenticated)
/login                → Google login page
/dashboard            → Main dashboard
/subscriptions        → Full subscription list
/subscriptions/new    → Add subscription form
/subscriptions/:id    → Subscription detail
/calendar             → Renewal calendar
/insights             → Spending insights
/notifications        → Notification history
/settings             → Account settings

/admin                → Admin overview
/admin/users          → User management
/admin/analytics      → Platform analytics
/admin/logs           → System logs
```

### Android Screens

```
Splash
└── Login
    └── Onboarding (3 screens)
        └── Dashboard (home tab)
            ├── Subscription List (list tab)
            │   ├── Add Subscription (step 1–3)
            │   └── Subscription Detail
            │       └── Cancellation Guide
            ├── Add (FAB → Add Subscription)
            ├── Insights (insights tab)
            ├── Settings (settings tab)
            │   └── Notification Preferences
            └── Notifications (bell icon → screen)
```

---

## 15. Roadmap

### MVP v1 — Foundation (Now)

Core loop: detect → display → remind → act

- Google login
- Gmail readonly sync + auto-detection
- Manual subscription entry
- Dashboard (spend summary, upcoming renewals)
- Email renewal reminders (3 day, 1 day, renewal day)
- Web push notifications
- Cancellation links
- 14-day free trial
- Stripe payment integration

### Phase 2 — Intelligence Layer

Turning data into decisions

- AI-powered spending insights
- Unused subscription detection
- Month-over-month trend analysis
- Smart cancellation recommendations
- Category breakdown charts
- Annual spend projections

### Phase 3 — Mobile

Subscription intelligence in your pocket

- Android app (React Native / Expo)
- Firebase push notifications
- AI assistant (text Q&A)
- Biometric app lock

### Phase 4 — Teams

For families and small startups

- Invite team members
- Shared subscription tracking
- Split billing visibility
- Role-based access (owner / viewer)
- Team spending dashboard

### Phase 5 — Automation

The next level of intelligence

- Browser extension (detect subscriptions from checkout pages)
- Automatic usage tracking (passive)
- AI usage analytics (which AI tools you use most)
- Auto-cancellation (opt-in, explicit user authorization)

---

## 16. Product Principles

### 1. Subscription-first, not finance-first

SubTrack is not a banking app. Every feature must directly serve subscription awareness. No bank account linking. No transaction categorization beyond subscription-related charges. No complex financial tools.

### 2. Full trial, or nothing

A broken trial is worse than no trial. Every feature — reminders, Gmail sync, AI insights — must work completely during the 14-day trial. Degrading the trial to push upgrades destroys trust.

### 3. Privacy through minimalism

Gmail access is readonly. SubTrack reads only enough to detect subscriptions: sender, subject, and date. Email body content is never stored. Users can disconnect Gmail at any time and all synced data is deleted within 24 hours.

### 4. Simple enough for anyone

Every screen must pass the 10-year-old test. If a child cannot figure out what to do next without being told, the screen needs to be redesigned. No exceptions. This applies equally to the website and the Android app.

### 5. One primary action per screen

No screen should have two competing primary buttons. There is always one obvious next step. Secondary actions are visually subordinate.

### 6. AI as utility, not spectacle

AI features must answer real questions about real subscription data. The AI assistant is not a chatbot for conversation — it is a tool for answering "what do I spend, and what should I do about it?" If an AI feature cannot clearly answer that question, it does not ship.

### 7. Speed is a feature

Every page loads under 2 seconds on a standard mobile connection. Every user action gets an immediate visual response — even if the network call hasn't completed yet. Optimistic UI updates where appropriate.

### 8. Ship small, learn fast

MVP covers only the core loop. Complexity lives in later phases. No over-engineering v1. Every feature in MVP must be something users actively need on day one.

---

## 17. Success Metrics

### Trial Metrics

| Metric | Target |
|---|---|
| Trial-to-paid conversion rate | >30% |
| Day 14 retention | >60% |
| Gmail connection rate during trial | >70% |
| Subscriptions added per user (trial) | >8 |

### Engagement Metrics

| Metric | Target |
|---|---|
| DAU/MAU ratio | >40% |
| Push notification opt-in rate | >65% |
| Dashboard sessions per week | >3 per active user |
| Manual subscriptions added | >2 per user |

### Product Health Metrics

| Metric | Target |
|---|---|
| Gmail sync success rate | >98% |
| Reminder delivery rate (email) | >99% |
| App crash rate (Android) | <0.5% |
| Page load time (web) | <2s on 4G |
| Support ticket rate | <5% of active users/month |

---

*Document maintained by the SubTrack product team. Last updated: May 2026.*
