import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckSquare,
  RotateCcw,
  Sparkles,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Layers,
  Clock,
  Compass,
} from 'lucide-react';
import { BrandLogo, BrandIcon } from '../components/brand/BrandLogo';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { curriculumModules } from '../data/curriculumData';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-[#1D1A39] flex flex-col selection:bg-[#E8BCB9] selection:text-[#1D1A39]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#F0EAE8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo variant="lockup" size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#574459]">
            <Link to="/roadmap" className="hover:text-[#1D1A39] transition-colors">
              Curriculum (16 Modules)
            </Link>
            <Link to="/resources" className="hover:text-[#1D1A39] transition-colors">
              Resource Library
            </Link>
            <Link to="/placement" className="hover:text-[#1D1A39] transition-colors">
              Placement Prep
            </Link>
            <Link to="/timeline" className="hover:text-[#1D1A39] transition-colors">
              Timeline Planner
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="secondary" size="sm">
                Open Workspace
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
                Build My Roadmap
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 pb-16 overflow-hidden bg-gradient-to-b from-[#FFFDFC] via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F6] border border-[#EADBDA] text-xs font-semibold text-[#662549] mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span className="w-2 h-2 rounded-full bg-[#F39F5A] animate-pulse" />
            <span>The k-th attempt is where it clicks</span>
            <span className="text-[#AE445A]">·</span>
            <span className="text-[#574459] font-normal">Java-first DSA Preparation</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#1D1A39] max-w-4xl mx-auto leading-[1.1]">
            DSA is hard enough.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#451952] via-[#662549] to-[#AE445A]">
              Keeping track shouldn't be.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-[#574459] max-w-2xl mx-auto leading-relaxed">
            Build your own roadmap, find the right resources, track every attempt, and turn repeated practice into real interview confidence.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-8" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                Build My Roadmap
              </Button>
            </Link>
            <Link to="/roadmap" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-6" icon={<BookOpen className="w-4 h-4 text-[#451952]" />}>
                Explore the Curriculum
              </Button>
            </Link>
          </div>

          <p className="mt-3 text-xs text-[#7E6C7C]">
            100% Free · No credit card · Persistent local guest mode or optional Supabase sync
          </p>

          {/* INTERACTIVE WORKSPACE PREVIEW MOCKUP */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-[#EADBDA] bg-[#FFFDFC] shadow-2xl overflow-hidden text-left p-4 sm:p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE8]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-300 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-300 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-300 inline-block" />
                </div>
                <span className="font-mono text-xs text-[#7E6C7C]">kthtry.app/workspace/module-14-dp</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span className="text-xs font-medium text-[#1D1A39]">Guest Workspace Active</span>
              </div>
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {/* Card 1: Today's Focus */}
              <div className="p-4 rounded-xl border border-[#F0EAE8] bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#AE445A] uppercase tracking-wider">Next Recommended Task</span>
                  <Badge priority="CORE" size="xs" />
                </div>
                <h4 className="font-display font-bold text-base text-[#1D1A39]">0/1 Knapsack &amp; Space Optimization</h4>
                <p className="text-xs text-[#7E6C7C] mt-1">Module 14 · Tabulation transition &amp; backwards rolling array</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-[#574459] font-medium">Est. 120 mins</span>
                  <Link to="/practice" className="text-[#451952] font-semibold hover:underline">
                    Start Attempt &rarr;
                  </Link>
                </div>
              </div>

              {/* Card 2: 4 Learning Statuses */}
              <div className="p-4 rounded-xl border border-[#F0EAE8] bg-white">
                <span className="text-[11px] font-bold text-[#451952] uppercase tracking-wider">Attempt Mastery Distribution</span>
                <div className="space-y-2 mt-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Independent (Green)
                    </span>
                    <span className="font-mono font-bold text-[#1D1A39]">42</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-amber-800">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> Assisted (Yellow)
                    </span>
                    <span className="font-mono font-bold text-[#1D1A39]">19</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-rose-800">
                      <span className="w-2 h-2 rounded-full bg-rose-400" /> Needs Work (Red)
                    </span>
                    <span className="font-mono font-bold text-[#1D1A39]">8</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Spaced Revision Queue */}
              <div className="p-4 rounded-xl border border-[#F0EAE8] bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#F39F5A] uppercase tracking-wider">Spaced Revision</span>
                  <span className="text-[10px] font-semibold bg-[#F39F5A]/20 text-[#8F470D] px-2 py-0.5 rounded-full">
                    3 Due Today
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <p className="font-medium text-[#1D1A39] line-clamp-1">· Course Schedule (Topological Sort)</p>
                  <p className="font-medium text-[#1D1A39] line-clamp-1">· Lowest Common Ancestor in Binary Tree</p>
                  <p className="font-medium text-[#1D1A39] line-clamp-1">· Subarray Sum Equals K (Prefix Hash)</p>
                </div>
                <div className="mt-3 text-right">
                  <Link to="/revision" className="text-xs text-[#AE445A] font-semibold hover:underline">
                    Open Revision &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE CONTINUOUS LEARNING LOOP SECTION */}
      <section className="py-20 bg-[#FAF7F6] border-y border-[#F0EAE8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#AE445A]">The KthTry Methodology</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1D1A39] mt-2">
              Learn → Understand → Attempt → Record → Revise → Test again → Improve.
            </h2>
            <p className="text-[#574459] mt-3 text-base">
              Rote memorization fails in technical interviews. KthTry creates deliberate, evidence-based retention through spaced recall and honest attempt grading.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#F0EAE8] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#451952]/10 text-[#451952] flex items-center justify-center font-display font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-display font-bold text-lg text-[#1D1A39]">Structured Written Lessons</h3>
              <p className="text-xs text-[#7E6C7C] mt-2 leading-relaxed">
                Step-by-step mathematical reasoning, invariant proofs, and Java idiomatic patterns before opening LeetCode.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#F0EAE8] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#662549]/10 text-[#662549] flex items-center justify-center font-display font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-display font-bold text-lg text-[#1D1A39]">Honest 4-Status Tracking</h3>
              <p className="text-xs text-[#7E6C7C] mt-2 leading-relaxed">
                Distinguish independent solves from assisted editorial solutions. Never fake competence with superficial checkboxes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#F0EAE8] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#AE445A]/10 text-[#AE445A] flex items-center justify-center font-display font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-display font-bold text-lg text-[#1D1A39]">Active Recall Revisions</h3>
              <p className="text-xs text-[#7E6C7C] mt-2 leading-relaxed">
                Spaced review queues test you before notes are revealed. Solve again at 1, 7, and 21 day intervals.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#F0EAE8] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F39F5A]/20 text-[#974C0C] flex items-center justify-center font-display font-bold text-lg mb-4">
                4
              </div>
              <h3 className="font-display font-bold text-lg text-[#1D1A39]">Timed Mock Assessments</h3>
              <p className="text-xs text-[#7E6C7C] mt-2 leading-relaxed">
                45-minute structured simulation: clarify requirements, analyze brute-force, optimize, code, and test edge cases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM HIGHLIGHTS (16 Modules) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#451952]">Exhaustive Placement Syllabus</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1D1A39] mt-2">
                16 Modules. Zero Placeholders.
              </h2>
              <p className="text-[#574459] text-sm mt-1">
                Every topic contains learning objectives, complexity notes, Java guides, curated links, and practice sets.
              </p>
            </div>
            <Link to="/roadmap" className="mt-4 md:mt-0">
              <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
                View Full Interactive Roadmap
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {curriculumModules.slice(0, 8).map((mod) => (
              <Link
                key={mod.id}
                to={`/roadmap/${mod.slug}`}
                className="group p-5 rounded-2xl border border-[#F0EAE8] bg-[#FFFDFC] hover:border-[#E2D6D4] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-[#7E6C7C]">M{mod.moduleNumber}</span>
                    <Badge priority={mod.priority} size="xs" />
                  </div>
                  <h3 className="font-display font-bold text-base text-[#1D1A39] group-hover:text-[#451952] transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-[#7E6C7C] mt-1.5 line-clamp-2">{mod.subtitle}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F0EAE8] flex items-center justify-between text-[11px] text-[#574459]">
                  <span>{mod.subtopics.length} Subtopics</span>
                  <span className="font-medium text-[#AE445A] group-hover:underline">Explore &rarr;</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/roadmap">
              <Button variant="secondary" size="md">
                + View Remaining 8 Modules (Heaps, Greedy, Graphs, DP, Tries, Advanced)
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-[#F0EAE8] bg-[#FFFDFC] py-12 text-sm text-[#7E6C7C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <BrandLogo variant="lockup" size="md" />
            <p className="text-xs text-[#7E6C7C] mt-2">
              A personal DSA learning and placement-preparation workspace. Built for engineers.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#574459]">
            <Link to="/roadmap" className="hover:text-[#1D1A39]">Curriculum</Link>
            <Link to="/timeline" className="hover:text-[#1D1A39]">Timeline</Link>
            <Link to="/practice" className="hover:text-[#1D1A39]">Practice Tracker</Link>
            <Link to="/revision" className="hover:text-[#1D1A39]">Revision Centre</Link>
            <Link to="/placement" className="hover:text-[#1D1A39]">Placement Prep</Link>
            <Link to="/settings" className="hover:text-[#1D1A39]">Data &amp; Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
