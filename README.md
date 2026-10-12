# KthTry — “Just one more problem.”

> A complete, polished, responsive DSA learning and placement-preparation workspace. Built for engineers who understand what learning difficult algorithms actually feels like.

---

## 1. Brand Identity & Design System

- **Brand Name**: KthTry (pronounced *“K-th try”*)
- **Tagline**: *Just one more problem.*
- **Wordmark**: `kth/try` (rendered with clean geometric sans-serif typography and an intentional mathematical slash separator)
- **Brand Story**: The hidden joke is that the $k$-th attempt may be the one where a difficult concept finally clicks. The letter $k$ connects naturally to mathematical notation (such as the $k$-th element in a sequence). It represents repeated attempts, pattern recognition, and persistence.
- **Brand Personality**: Minimal, nerdy, quietly funny, intelligent without pretension, calm, focused, and slightly playful.

### Mandatory Color Palette & Tokens

The application uses a **bright white default canvas** (`#FFFFFF`) with warm surfaces (`#FFFDFC`, `#FAF7F6`) and plum-tinted borders.

| Token | Hex Swatch | Role |
| :--- | :--- | :--- |
| **Deep Plum** | `#1D1A39` | Main text, primary actions, and strong contrast |
| **Aubergine** | `#451952` | Secondary brand color and selected active states |
| **Burgundy** | `#662549` | Secondary accents and restrained highlights |
| **Berry** | `#AE445A` | Attention states and selected progress indicators |
| **Sunset** | `#F39F5A` | Warm accent, milestones, and small highlights |
| **Blush** | `#E8BCB9` | Soft tinted surfaces, tags, and decorative accents |

---

## 2. Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Routing**: React Router DOM (`react-router-dom`)
- **Icons**: Lucide React (`lucide-react`)
- **Charts**: Recharts (`recharts`)
- **Date Operations**: Date-fns (`date-fns`)
- **Backend & Cloud Persistence**: Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **Local Persistence**: IndexedDB engine (`guestStorage.ts`) with zero external dependencies
- **Automated Testing**: Vitest (`vitest`)

### Dual-Mode Persistence Architecture

KthTry works **seamlessly out of the box** without requiring any cloud setup or credentials:
1. **Local Guest Mode (Default)**: Automatically backs all user progress, problem attempts, checklists, study plans, and custom tasks to browser **IndexedDB**. 100% private, zero setup, persists across browser reloads.
2. **Supabase Cloud Mode**: When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided in `.env.local`, the application seamlessly connects to Supabase PostgreSQL with user-level Row Level Security (RLS).
3. **Guest-to-Cloud Migration**: A 1-click migration service (`migrationService.ts`) allows users who start as guests to seamlessly merge their local study history into their authenticated Supabase account upon signup/login.
4. **Validated Backup & Restore**: Full JSON export and schema-validated JSON import (`backupService.ts`) enables complete data portability.

---

## 3. Complete 16-Module DSA Curriculum

KthTry contains real structured seed data for all 16 required preparation modules with learning objectives, complexity notes, Java implementation guides, common mistakes, boundary cases, verified reference links, and practice problems:

1. **Module 1 — Foundations and Complexity** `[CORE]`
2. **Module 2 — Mathematics, Number Theory & Bit Manipulation** `[HIGH VALUE]`
3. **Module 3 — Arrays, Prefix Sums & Hashing** `[CORE]`
4. **Module 4 — Two Pointers, Sliding Windows & Monotonic Structures** `[CORE]`
5. **Module 5 — Sorting and Binary Search** `[CORE]`
6. **Module 6 — Strings and String Algorithms** `[CORE]`
7. **Module 7 — Recursion, Divide & Conquer, Backtracking** `[CORE]`
8. **Module 8 — Linked Lists** `[CORE]`
9. **Module 9 — Stacks, Queues, Deques & Expressions** `[CORE]`
10. **Module 10 — Trees and Binary Search Trees** `[CORE]`
11. **Module 11 — Heaps and Priority Queues** `[CORE]`
12. **Module 12 — Greedy Algorithms & Interval Scheduling** `[CORE]`
13. **Module 13 — Graphs** `[CORE]`
14. **Module 14 — Dynamic Programming** `[CORE]`
15. **Module 15 — Tries, DSU and Range-Query Structures** `[HIGH VALUE]`
16. **Module 16 — Advanced Algorithms** `[STRETCH]`

### Java Essentials Track
Comprehensive guides on:
- Primitive Types, Bounds & Overflow Pitfalls
- String Immutability & StringBuilder Mechanics
- Collections Framework & Real Complexity Costs
- Comparators, PriorityQueue & Custom Objects
- Custom Objects in HashSets/HashMaps (`equals` & `hashCode`)
- Recursion Depth, Stack Overflow & Fast I/O

---

## 4. Key Application Features

- **Public Landing Page (`/`)**: Wordmark `kth/try`, tagline *"Just one more problem."*, interactive workspace preview, and 16-module curriculum overview.
- **Onboarding Wizard (`/onboarding`)**: 4-step personalized flow configuring preparation goals, experience level, weekly availability, and workload feasibility analysis.
- **Dashboard (`/dashboard`)**: Recommended next task, today's study schedule, mastery distribution, due revisions, and recent attempt logs.
- **Interactive Roadmap (`/roadmap`)**: Complete 16 modules with Core/High Value/Stretch priority filters, Java track toggle, and detailed topic pages with 5 sub-tabs (Study Guide, Checklists, Practice, Resources, Personal Notes).
- **Personal Timeline Planner (`/timeline`)**: Three functional views:
  - *Calendar View*: Interactive month view with day cells and reschedule modals
  - *Ordered Roadmap*: Sequential dependency-ordered task list
  - *Weekly Board*: Kanban lanes for pending lessons, practice/revisions, and completed tasks
- **Problem Tracker (`/practice`)**: 4-status mastery model:
  - **GREEN**: Independent (Solved independently, reproducible)
  - **YELLOW**: Assisted (Solved with hints/editorial, needs re-solve)
  - **RED**: Needs Work (Approach or code incorrect)
  - **GREY**: Untested (Familiar, but variant untested)
  - *Blind / Unlabeled Mode*: Hide topic labels to practice recognizing patterns without clues.
- **Revision Centre (`/revision`)**: Active recall engine where previous notes remain hidden until an attempt is completed. Spaced review intervals at 1, 7, and 21 days.
- **Placement Preparation (`/placement`)**: CS Fundamentals checklists (OOP, DBMS, OS, Networks, Aptitude, Behavioral STAR answers) and target role profiles (Product, Campus, Fintech, Enterprise).
- **Mock Interview Workspace (`/mock-interview`)**: 45-minute live timer, 6 guided stages, Java code editor scratchpad, rubric scoring, and interview history logging.
- **Analytics & Readiness Scorecard (`/analytics`)**: Evidence-based readiness checklist and Recharts visualizations.
- **Settings & Backup (`/settings`)**: Cloud vs Guest status, JSON backup export, validated JSON import, and safe reset.
- **Quick Command Palette (`Cmd+K` / `Ctrl+K`)**: Instant search across modules, problems, subtopics, and Java guides.

---

## 5. Local Setup & Running Instructions

### Prerequisites
- Node.js (v18+ or v22+)
- npm (v9+)

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite
npm run test

# 3. Build production bundle to verify correctness
npm run build

# 4. Start local development server
npm run dev
```

The app will be available at `http://localhost:5173/` (or `http://localhost:5174/`).

---

## 6. Supabase Cloud Configuration (Optional)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL Editor in Supabase Studio.
3. Run the schema migration from:
   `supabase/migrations/20261012_init_kthtry_schema.sql`
4. Run the seed data script from:
   `supabase/migrations/20261012_seed_curriculum.sql`
5. Copy your project URL and Anon Public Key into `.env.local`:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
6. Restart the dev server (`npm run dev`). KthTry will detect the cloud backend and switch from Guest Mode to Supabase Cloud Mode.

---

## 7. Verification Record of Checks Actually Run

- **TypeScript Compilation**: `tsc` passed with 0 errors (`TS5101` resolved with `ignoreDeprecations: 6.0` for TS 6).
- **Vite Production Build**: `vite build` completed successfully, producing clean CSS and JS bundles in `dist/`.
- **Automated Unit Tests**: Vitest test suite (`npm run test`) passed 12/12 tests across:
  - `src/tests/curriculum.test.ts` (16 modules, priorities, subtopic checklists, Java track)
  - `src/tests/scheduler.test.ts` (prerequisite topological sorting, workload analysis, buffer generation)
  - `src/tests/backup.test.ts` (JSON validation, corrupted payload rejection, valid schema acceptance)
- **Browser Subagent Live Verification**:
  - Landing page rendered with custom SVG brand icon, wordmark `kth/try`, tagline *"Just one more problem."*, and 6-color palette.
  - Onboarding 4-step wizard completed and generated real timeline tasks.
  - Dashboard verified with today's schedule, metric cards, and attempt logs.
  - Roadmap verified with 16 modules, CORE priority filter, Java essentials track, and Dynamic Programming detail tabs.
  - Timeline planner verified across Calendar, Ordered Roadmap, and Weekly Kanban views.
  - Problem tracker verified with Blind Mode toggle and attempt logging.
  - Revision centre verified with active recall session.
  - Placement prep verified with CS fundamentals checklist items.
  - Mock interview verified with live timer, stages guidance, and rubric scoring.
  - Analytics verified with readiness checklist and Recharts charts.
