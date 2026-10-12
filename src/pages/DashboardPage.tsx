import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  RotateCcw,
  Target,
  BookOpen,
  Calendar,
  AlertCircle,
  TrendingUp,
  BarChart2,
  Code2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar, MultiProgressBar } from '../components/ui/ProgressBar';
import { repository } from '../services/repository';
import { curriculumModules } from '../data/curriculumData';
import {
  UserPreferences,
  TopicProgress,
  ProblemProgress,
  ProblemAttempt,
  TimelineTask,
  RevisionTask,
} from '../types/userData';

export const DashboardPage: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [topicProgress, setTopicProgress] = useState<Record<string, TopicProgress>>({});
  const [problemProgress, setProblemProgress] = useState<Record<string, ProblemProgress>>({});
  const [attempts, setAttempts] = useState<ProblemAttempt[]>([]);
  const [timelineTasks, setTimelineTasks] = useState<TimelineTask[]>([]);
  const [revisionTasks, setRevisionTasks] = useState<RevisionTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prefs, tProg, pProg, atts, tTasks, rTasks] = await Promise.all([
        repository.getPreferences(),
        repository.getAllTopicProgress(),
        repository.getAllProblemProgress(),
        repository.getAllAttempts(),
        repository.getTimelineTasks(),
        repository.getRevisionTasks(),
      ]);

      setPreferences(prefs);
      setTopicProgress(tProg);
      setProblemProgress(pProg);
      setAttempts(atts);
      setTimelineTasks(tTasks);
      setRevisionTasks(rTasks);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Today's scheduled tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = timelineTasks.filter((t) => t.scheduledDate === todayStr);

  // Next recommended task
  const nextPendingTask = timelineTasks.find((t) => t.status === 'pending');

  // Revisions due
  const dueRevisions = revisionTasks.filter((r) => r.status === 'due' && r.dueDate <= todayStr);

  // Status counts
  const problemsList = Object.values(problemProgress);
  const countIndependent = problemsList.filter((p) => p.status === 'GREEN').length;
  const countAssisted = problemsList.filter((p) => p.status === 'YELLOW').length;
  const countNeedsWork = problemsList.filter((p) => p.status === 'RED').length;
  const countUntested = problemsList.filter((p) => p.status === 'GREY').length;

  // Total topics completed
  const completedTopicsCount = Object.values(topicProgress).filter((t) => t.isCompleted).length;
  const coreModules = curriculumModules.filter((m) => m.priority === 'CORE');
  const completedCoreCount = coreModules.filter((m) => topicProgress[m.id]?.isCompleted).length;

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await repository.updateTimelineTask(taskId, { status: nextStatus as any });
    setTimelineTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus as any } : t))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* GREETING & NEXT RECOMMENDED TASK HERO */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1D1A39] via-[#451952] to-[#662549] text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#F39F5A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-[#E8BCB9] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F39F5A]" />
            <span>Target: {preferences?.goal.replace('-', ' ') || 'Campus Placements'}</span>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
            Welcome to your preparation workspace.
          </h1>

          <p className="text-white/80 text-sm mt-2 leading-relaxed">
            {nextPendingTask
              ? `Next focus: ${nextPendingTask.title}. Solve independently before checking hints.`
              : 'You have no pending tasks today. Ready for a revision set or mock interview?'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {nextPendingTask && (
              <Button
                variant="sunset"
                size="sm"
                onClick={() => handleToggleTask(nextPendingTask.id, nextPendingTask.status)}
                icon={<CheckCircle2 className="w-4 h-4 text-[#1D1A39]" />}
              >
                Mark Task Completed
              </Button>
            )}
            <Link to="/roadmap">
              <Button variant="secondary" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Browse Roadmap
              </Button>
            </Link>
            <Link to="/practice">
              <Button variant="secondary" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Log New Attempt
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* METRIC SCORECARD ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Core Topics Coverage */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7E6C7C]">Core Topics Mastered</span>
            <Badge priority="CORE" size="xs" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display font-extrabold text-2xl text-[#1D1A39]">
              {completedCoreCount} / {coreModules.length}
            </span>
            <span className="text-xs text-[#7E6C7C]">
              ({Math.round((completedCoreCount / coreModules.length) * 100)}%)
            </span>
          </div>
          <ProgressBar value={completedCoreCount} max={coreModules.length} color="bg-[#451952]" className="mt-3" />
        </Card>

        {/* Independent Solves */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7E6C7C]">Independent Solves</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display font-extrabold text-2xl text-emerald-700">
              {countIndependent}
            </span>
            <span className="text-xs text-[#7E6C7C]">
              of {Math.max(1, countIndependent + countAssisted + countNeedsWork)} attempted
            </span>
          </div>
          <p className="text-[11px] text-[#7E6C7C] mt-2">Green status · Reproducible without hints</p>
        </Card>

        {/* Due Revisions */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7E6C7C]">Revisions Due Today</span>
            <RotateCcw className="w-3.5 h-3.5 text-[#AE445A]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display font-extrabold text-2xl text-[#AE445A]">
              {dueRevisions.length}
            </span>
            <span className="text-xs text-[#7E6C7C]">problems scheduled</span>
          </div>
          <div className="mt-3">
            <Link to="/revision" className="text-xs font-semibold text-[#451952] hover:underline flex items-center gap-1">
              <span>Start revision queue</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>

        {/* Total Attempts Recorded */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7E6C7C]">Recorded Attempts</span>
            <Code2 className="w-3.5 h-3.5 text-[#1D1A39]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display font-extrabold text-2xl text-[#1D1A39]">
              {attempts.length}
            </span>
            <span className="text-xs text-[#7E6C7C]">practice logs</span>
          </div>
          <p className="text-[11px] text-[#7E6C7C] mt-2">Full attempt history preserved</p>
        </Card>
      </div>

      {/* TWO-COLUMN LAYOUT: SCHEDULE & PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMN 1 & 2: TODAY'S SCHEDULE & RECENT ATTEMPTS */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Today's Study Schedule</CardTitle>
                <CardDescription>
                  {todayTasks.length > 0
                    ? `${todayTasks.length} task(s) scheduled for today (${todayStr})`
                    : 'No specific tasks assigned for today. Pick from your timeline.'}
                </CardDescription>
              </div>
              <Link to="/timeline">
                <Button variant="outline" size="xs">
                  Full Timeline
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              {todayTasks.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-[#FAF7F6] border border-[#F0EAE8]">
                  <Calendar className="w-8 h-8 text-[#AE445A] mx-auto mb-2 opacity-60" />
                  <p className="text-sm font-semibold text-[#1D1A39]">No tasks scheduled for today</p>
                  <p className="text-xs text-[#7E6C7C] mt-1">
                    Check your weekly calendar or start a practice problem from the roadmap.
                  </p>
                  <Link to="/timeline" className="inline-block mt-3">
                    <Button variant="secondary" size="xs">
                      View Timeline Calendar
                    </Button>
                  </Link>
                </div>
              ) : (
                todayTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      t.status === 'completed'
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        : 'bg-white border-[#F0EAE8] hover:border-[#E2D6D4]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={t.status === 'completed'}
                        onChange={() => handleToggleTask(t.id, t.status)}
                        className="w-4 h-4 rounded text-[#451952] focus:ring-[#451952] cursor-pointer"
                      />
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            t.status === 'completed' ? 'line-through opacity-75' : 'text-[#1D1A39]'
                          }`}
                        >
                          {t.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#7E6C7C] mt-0.5">
                          <span className="capitalize">{t.taskType}</span>
                          <span>·</span>
                          <span>{t.durationMinutes} mins</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="tag" size="xs">
                      {t.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Problem Attempts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Recent Practice Attempts</CardTitle>
                <CardDescription>Logged practice and revision history</CardDescription>
              </div>
              <Link to="/practice">
                <Button variant="outline" size="xs">
                  All Problems
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              {attempts.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-[#FAF7F6] border border-[#F0EAE8]">
                  <Code2 className="w-8 h-8 text-[#451952] mx-auto mb-2 opacity-60" />
                  <p className="text-sm font-semibold text-[#1D1A39]">No attempts recorded yet</p>
                  <p className="text-xs text-[#7E6C7C] mt-1">
                    When you solve a problem, log your attempt to track whether you needed hints or editorials.
                  </p>
                  <Link to="/practice" className="inline-block mt-3">
                    <Button variant="secondary" size="xs">
                      Log First Attempt
                    </Button>
                  </Link>
                </div>
              ) : (
                attempts.slice(0, 5).map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#1D1A39]">{att.problemId}</p>
                      <p className="text-[11px] text-[#7E6C7C] mt-0.5">
                        {att.timeSpentMinutes} mins · {att.hintsUsed ? 'Hints used' : 'No hints'} ·{' '}
                        {new Date(att.attemptedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge status={att.attemptStatus} size="xs" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* COLUMN 3: MASTERY STATUSES & QUICK ACTIONS */}
        <div className="space-y-6">
          {/* Attempt Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Mastery Distribution</CardTitle>
              <CardDescription>Problem status breakdown</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <MultiProgressBar
                independent={countIndependent}
                assisted={countAssisted}
                needsWork={countNeedsWork}
                untested={countUntested}
                showLabels={true}
                size="md"
              />

              <div className="mt-4 pt-4 border-t border-[#F0EAE8] space-y-2 text-xs">
                <div className="flex justify-between text-[#574459]">
                  <span>Total Problems Tracked:</span>
                  <span className="font-mono font-bold text-[#1D1A39]">{problemsList.length}</span>
                </div>
                <div className="flex justify-between text-[#574459]">
                  <span>Independent Ratio:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {problemsList.length > 0
                      ? `${Math.round((countIndependent / problemsList.length) * 100)}%`
                      : '0%'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tool Links */}
          <Card>
            <CardHeader>
              <CardTitle>Preparation Modules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <Link
                to="/placement"
                className="p-3 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC] hover:border-[#E2D6D4] flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#451952]" />
                  <span className="text-xs font-semibold text-[#1D1A39]">CS Fundamentals Checklists</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#7E6C7C] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/mock-interview"
                className="p-3 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC] hover:border-[#E2D6D4] flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Code2 className="w-4 h-4 text-[#AE445A]" />
                  <span className="text-xs font-semibold text-[#1D1A39]">45-min Mock Interview</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#7E6C7C] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/analytics"
                className="p-3 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC] hover:border-[#E2D6D4] flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <BarChart2 className="w-4 h-4 text-[#F39F5A]" />
                  <span className="text-xs font-semibold text-[#1D1A39]">Readiness Scorecard</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#7E6C7C] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
