-- ====================================================================
-- KthTry — Schema Update: Preferences, Multi-Language DSA & Data Integrity
-- Product: KthTry ("Just one more problem.")
-- Forward-only migration preserving all existing records
-- ====================================================================

-- 1. EXTEND USER_PREFERENCES WITH SCHEDULE & CUSTOMIZATION FIELDS
ALTER TABLE public.user_preferences
    ADD COLUMN IF NOT EXISTS start_date DATE,
    ADD COLUMN IF NOT EXISTS target_date DATE,
    ADD COLUMN IF NOT EXISTS plan_duration_weeks INTEGER DEFAULT 12,
    ADD COLUMN IF NOT EXISTS active_days JSONB DEFAULT '["Mon","Tue","Wed","Thu","Fri","Sat"]'::jsonb,
    ADD COLUMN IF NOT EXISTS hours_per_day JSONB DEFAULT '{"Mon":2,"Tue":2,"Wed":2,"Thu":2,"Fri":2,"Sat":3,"Sun":0}'::jsonb,
    ADD COLUMN IF NOT EXISTS learning_priorities TEXT DEFAULT 'core-first',
    ADD COLUMN IF NOT EXISTS review_intervals JSONB DEFAULT '[1,7,21]'::jsonb,
    ADD COLUMN IF NOT EXISTS is_onboarded BOOLEAN DEFAULT false;

-- 2. EXPAND PLACEMENT_TASKS CATEGORIES TO INCLUDE 'tracks'
ALTER TABLE public.placement_tasks DROP CONSTRAINT IF EXISTS placement_tasks_category_check;
ALTER TABLE public.placement_tasks ADD CONSTRAINT placement_tasks_category_check
    CHECK (category IN ('oop', 'dbms', 'os', 'cn', 'aptitude', 'behavioral', 'resume', 'tracks'));

-- 3. ENHANCE PROBLEM_ATTEMPTS WITH LANGUAGE TRACKING & STABLE CLIENT DEDUPLICATION
ALTER TABLE public.problem_attempts
    ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'Java',
    ADD COLUMN IF NOT EXISTS client_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_problem_attempts_user_client_id
    ON public.problem_attempts(user_id, client_id)
    WHERE client_id IS NOT NULL;

-- 4. ENHANCE TIMELINE_TASKS WITH CLIENT ID FOR IDEMPOTENT UPSERT
ALTER TABLE public.timeline_tasks
    ADD COLUMN IF NOT EXISTS client_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_timeline_tasks_user_client_id
    ON public.timeline_tasks(user_id, client_id)
    WHERE client_id IS NOT NULL;

-- 5. RESOURCE CATALOG QUALITY & MULTI-LANGUAGE ATTRIBUTES
ALTER TABLE public.resources
    ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'all',
    ADD COLUMN IF NOT EXISTS spoken_language TEXT DEFAULT 'English',
    ADD COLUMN IF NOT EXISTS verified_date DATE,
    ADD COLUMN IF NOT EXISTS notes TEXT;

-- 6. DEDICATED LANGUAGE-SPECIFIC PROBLEM PROGRESS TABLE
-- Allows learners to track implementation progress independently across Java, C++, and Python
-- while keeping conceptual mastery in user_topic_progress.
CREATE TABLE IF NOT EXISTS public.user_problem_language_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
    language TEXT NOT NULL DEFAULT 'Java' CHECK (language IN ('Java', 'C++', 'Python')),
    status TEXT NOT NULL CHECK (status IN ('GREEN', 'YELLOW', 'RED', 'GREY')),
    notes TEXT,
    last_attempted_at TIMESTAMPTZ,
    review_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, problem_id, language)
);

CREATE INDEX IF NOT EXISTS idx_user_problem_lang_prog_user_lang
    ON public.user_problem_language_progress(user_id, language);

-- Enable RLS for user_problem_language_progress
ALTER TABLE public.user_problem_language_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own language problem progress"
    ON public.user_problem_language_progress
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
