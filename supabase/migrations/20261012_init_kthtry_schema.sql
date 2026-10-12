-- ====================================================================
-- KthTry — Database Schema Migration
-- Product: KthTry ("Just one more problem.")
-- Platform: Supabase PostgreSQL with Row Level Security (RLS)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SHARED CATALOGUE TABLES (Public Read, Protected Write)
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.topics (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    module_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('CORE', 'HIGH VALUE', 'STRETCH')),
    estimated_hours INTEGER NOT NULL DEFAULT 12,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subtopics (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.topic_prerequisites (
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    prerequisite_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    PRIMARY KEY (topic_id, prerequisite_id)
);

CREATE TABLE IF NOT EXISTS public.resources (
    id TEXT PRIMARY KEY,
    topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    url TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('article', 'video', 'interactive', 'roadmap', 'documentation')),
    access_type TEXT NOT NULL CHECK (access_type IN ('free', 'free-account', 'partially-free', 'paid-reference')),
    is_verified BOOLEAN NOT NULL DEFAULT true,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.problems (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    subtopic_id TEXT REFERENCES public.subtopics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    pattern TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Shared Catalogue
CREATE INDEX IF NOT EXISTS idx_subtopics_topic ON public.subtopics(topic_id);
CREATE INDEX IF NOT EXISTS idx_resources_topic ON public.resources(topic_id);
CREATE INDEX IF NOT EXISTS idx_problems_topic ON public.problems(topic_id);
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON public.problems(difficulty);

-- 3. USER PRIVATE TABLES (Protected by RLS)
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    goal TEXT NOT NULL DEFAULT 'campus-placements',
    level TEXT NOT NULL DEFAULT 'comfortable-easy',
    weekly_hours INTEGER NOT NULL DEFAULT 15,
    preferred_language TEXT NOT NULL DEFAULT 'Java',
    theme TEXT NOT NULL DEFAULT 'light',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_topic_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    mastery_percentage INTEGER NOT NULL DEFAULT 0,
    last_studied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, topic_id)
);

CREATE TABLE IF NOT EXISTS public.user_subtopic_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subtopic_id TEXT NOT NULL REFERENCES public.subtopics(id) ON DELETE CASCADE,
    checklist_completed JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, subtopic_id)
);

CREATE TABLE IF NOT EXISTS public.user_problem_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('GREEN', 'YELLOW', 'RED', 'GREY')),
    notes TEXT,
    next_review_date DATE,
    review_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);

CREATE TABLE IF NOT EXISTS public.problem_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
    attempt_status TEXT NOT NULL CHECK (attempt_status IN ('GREEN', 'YELLOW', 'RED', 'GREY')),
    time_spent_minutes INTEGER NOT NULL DEFAULT 20,
    hints_used BOOLEAN NOT NULL DEFAULT FALSE,
    editorial_used BOOLEAN NOT NULL DEFAULT FALSE,
    approach_notes TEXT,
    mistakes_encountered TEXT,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.study_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    plan_duration_weeks INTEGER NOT NULL DEFAULT 12,
    start_date DATE NOT NULL,
    target_date DATE NOT NULL,
    active_days JSONB NOT NULL DEFAULT '["Mon","Tue","Wed","Thu","Fri","Sat"]'::jsonb,
    hours_per_day JSONB NOT NULL DEFAULT '{"Mon":2,"Tue":2,"Wed":2,"Thu":2,"Fri":2,"Sat":3,"Sun":0}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.timeline_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    study_plan_id UUID REFERENCES public.study_plans(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
    scheduled_date DATE NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    task_type TEXT NOT NULL CHECK (task_type IN ('lesson', 'practice', 'revision', 'mock', 'buffer', 'milestone')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped', 'rescheduled')),
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.revision_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    interval_days INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'due' CHECK (status IN ('due', 'completed', 'postponed')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mock_interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    outcome TEXT NOT NULL CHECK (outcome IN ('Strong Hire', 'Hire', 'Leaning Hire', 'Leaning No Hire', 'No Hire')),
    problem_title TEXT NOT NULL,
    code_content TEXT,
    feedback_notes TEXT,
    communication_score INTEGER CHECK (communication_score BETWEEN 1 AND 5),
    problem_solving_score INTEGER CHECK (problem_solving_score BETWEEN 1 AND 5),
    code_quality_score INTEGER CHECK (code_quality_score BETWEEN 1 AND 5),
    conducted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.placement_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('oop', 'dbms', 'os', 'cn', 'aptitude', 'behavioral', 'resume')),
    task_name TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Table Indexes
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_user ON public.user_topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_problem_progress_user ON public.user_problem_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_problem_attempts_user ON public.problem_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_timeline_tasks_user_date ON public.timeline_tasks(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_revision_tasks_user_due ON public.revision_tasks(user_id, due_date);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------

-- Shared catalogue: Public read, No client write
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to topics" ON public.topics
    FOR SELECT USING (true);

ALTER TABLE public.subtopics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to subtopics" ON public.subtopics
    FOR SELECT USING (true);

ALTER TABLE public.topic_prerequisites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to topic_prerequisites" ON public.topic_prerequisites
    FOR SELECT USING (true);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to resources" ON public.resources
    FOR SELECT USING (true);

ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to problems" ON public.problems
    FOR SELECT USING (true);

-- User Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User Preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User Topic Progress
ALTER TABLE public.user_topic_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own topic progress" ON public.user_topic_progress
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User Subtopic Progress
ALTER TABLE public.user_subtopic_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own subtopic progress" ON public.user_subtopic_progress
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User Problem Progress
ALTER TABLE public.user_problem_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own problem progress" ON public.user_problem_progress
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Problem Attempts
ALTER TABLE public.problem_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own attempts" ON public.problem_attempts
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Study Plans & Tasks
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own study plans" ON public.study_plans
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.timeline_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own timeline tasks" ON public.timeline_tasks
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.revision_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own revision tasks" ON public.revision_tasks
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own mock interviews" ON public.mock_interviews
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.placement_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own placement tasks" ON public.placement_tasks
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
