import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Sparkles,
  PieChart as PieIcon,
  Clock,
  Target,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { ProgressBar, MultiProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { repository } from '../services/repository';
import { curriculumModules } from '../data/curriculumData';
import {
  TopicProgress,
  ProblemProgress,
  ProblemAttempt,
  TimelineTask,
  MockInterviewRecord,
  PlacementChecklistItem,
} from '../types/userData';

export const AnalyticsPage: React.FC = () => {
  const [topicProgress, setTopicProgress] = useState<Record<string, TopicProgress>>({});
  const [problemProgress, setProblemProgress] = useState<Record<string, ProblemProgress>>({});
  const [attempts, setAttempts] = useState<ProblemAttempt[]>([]);
  const [tasks, setTasks] = useState<TimelineTask[]>([]);
  const [mockInterviews, setMockInterviews] = useState<MockInterviewRecord[]>([]);
  const [placementTasks, setPlacementTasks] = useState<PlacementChecklistItem[]>([]);

  useEffect(() => {
    Promise.all([
      repository.getAllTopicProgress(),
      repository.getAllProblemProgress(),
      repository.getAllAttempts(),
      repository.getTimelineTasks(),
      repository.getMockInterviews(),
      repository.getPlacementTasks(),
    ]).then(([tProg, pProg, atts, tTasks, mocks, pTasks]) => {
      setTopicProgress(tProg);
      setProblemProgress(pProg);
      setAttempts(atts);
      setTasks(tTasks);
      setMockInterviews(mocks);
      setPlacementTasks(pTasks);
    });
  }, []);

  // Priority Group breakdown
  const coreModules = curriculumModules.filter((m) => m.priority === 'CORE');
  const highValModules = curriculumModules.filter((m) => m.priority === 'HIGH VALUE');
  const stretchModules = curriculumModules.filter((m) => m.priority === 'STRETCH');

  const coreCompleted = coreModules.filter((m) => topicProgress[m.id]?.isCompleted).length;
  const highValCompleted = highValModules.filter((m) => topicProgress[m.id]?.isCompleted).length;
  const stretchCompleted = stretchModules.filter((m) => topicProgress[m.id]?.isCompleted).length;

  // Status breakdown
  const problems = Object.values(problemProgress);
  const independentCount = problems.filter((p) => p.status === 'GREEN').length;
  const assistedCount = problems.filter((p) => p.status === 'YELLOW').length;
  const needsWorkCount = problems.filter((p) => p.status === 'RED').length;
  const untestedCount = problems.filter((p) => p.status === 'GREY').length;

  const totalAttempted = independentCount + assistedCount + needsWorkCount;
  const independentRatio = totalAttempted > 0 ? Math.round((independentCount / totalAttempted) * 100) : 0;

  // Re-solves & retention
  const retentionReSolves = problems.filter((p) => p.reviewCount >= 2 && p.status === 'GREEN').length;

  // Tasks planned vs completed
  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const totalTasksCount = tasks.length;
  const planAdherence = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Successful mocks
  const passingMocks = mockInterviews.filter((m) => m.outcome === 'Strong Hire' || m.outcome === 'Hire').length;

  // CS Fundamentals completion
  const completedCS = placementTasks.filter((p) => p.isCompleted).length;

  // Chart Data: Mastery Distribution
  const statusPieData = [
    { name: 'Independent (Green)', value: independentCount || 1, color: '#10B981' },
    { name: 'Assisted (Yellow)', value: assistedCount || 0, color: '#F59E0B' },
    { name: 'Needs Work (Red)', value: needsWorkCount || 0, color: '#EF4444' },
  ];

  // Chart Data: Priority Group Progress
  const priorityBarData = [
    { name: 'CORE (11)', completed: coreCompleted, total: coreModules.length },
    { name: 'HIGH VALUE (3)', completed: highValCompleted, total: highValModules.length },
    { name: 'STRETCH (2)', completed: stretchCompleted, total: stretchModules.length },
  ];

  // Evidence-based Readiness Criteria
  const readinessChecklist = [
    {
      title: 'Foundational Core Topics Mastered',
      met: coreCompleted >= 6,
      current: `${coreCompleted}/${coreModules.length} Core Modules`,
      target: 'At least 6 Core Modules',
    },
    {
      title: 'Independent Problem-Solving Ratio',
      met: independentRatio >= 50 && totalAttempted >= 5,
      current: `${independentRatio}% Independent (${independentCount} solves)`,
      target: '>= 50% without hints or editorials',
    },
    {
      title: 'Multi-Interval Spaced Retention',
      met: retentionReSolves >= 2,
      current: `${retentionReSolves} problems re-solved successfully`,
      target: 'At least 2 retained on 7/21-day reviews',
    },
    {
      title: 'Timed Mock Interview Clearances',
      met: passingMocks >= 1,
      current: `${passingMocks} Hire verdicts`,
      target: 'At least 1 graded Hire / Strong Hire',
    },
    {
      title: 'Core Computer Science Fundamentals',
      met: completedCS >= 8,
      current: `${completedCS}/${placementTasks.length || 22} Checklist items`,
      target: 'At least 8 items in OOP, DBMS, OS & Networks',
    },
  ];

  const metCount = readinessChecklist.filter((c) => c.met).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="pb-4 border-b border-[#F0EAE8]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#AE445A] mb-1">
          <span>Evidence-Based Metrics</span>
          <span>·</span>
          <span>Calculated from Real Data</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1D1A39]">
          Analytics &amp; Readiness Scorecard
        </h1>
        <p className="text-xs sm:text-sm text-[#7E6C7C] mt-1 max-w-3xl">
          Transparent metrics derived strictly from your practice logs and spaced revisions. No fabricated company guarantees.
        </p>
      </div>

      {/* TOP SUMMARY METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-[11px] font-semibold text-[#7E6C7C]">Independent Ratio</span>
          <p className="font-display font-extrabold text-2xl text-emerald-700 mt-1">{independentRatio}%</p>
          <span className="text-[10px] text-[#7E6C7C] mt-1 block">{independentCount} of {totalAttempted} solves</span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-semibold text-[#7E6C7C]">Schedule Adherence</span>
          <p className="font-display font-extrabold text-2xl text-[#1D1A39] mt-1">{planAdherence}%</p>
          <span className="text-[10px] text-[#7E6C7C] mt-1 block">{completedTasksCount} of {totalTasksCount} tasks</span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-semibold text-[#7E6C7C]">Retained Re-solves</span>
          <p className="font-display font-extrabold text-2xl text-[#451952] mt-1">{retentionReSolves}</p>
          <span className="text-[10px] text-[#7E6C7C] mt-1 block">Retained at 7/21 days</span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-semibold text-[#7E6C7C]">Mock Clearances</span>
          <p className="font-display font-extrabold text-2xl text-[#AE445A] mt-1">{passingMocks}</p>
          <span className="text-[10px] text-[#7E6C7C] mt-1 block">Hire / Strong Hire</span>
        </Card>
      </div>

      {/* READINESS CHECKLIST */}
      <Card className="p-6 border-[#EADBDA] bg-[#FFFDFC]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0EAE8] gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#F39F5A]" />
              <span>Evidence-Based Interview Readiness Scorecard</span>
            </CardTitle>
            <CardDescription>
              Objective standards required for technical interview competence.
            </CardDescription>
          </div>
          <div className="font-mono font-bold text-xs bg-white border border-[#E2D6D4] px-3 py-1.5 rounded-xl text-[#451952]">
            {metCount} of {readinessChecklist.length} Milestones Satisfied
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {readinessChecklist.map((crit, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                crit.met
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-[#F0EAE8] bg-white'
              }`}
            >
              <CheckCircle2
                className={`w-5 h-5 mt-0.5 shrink-0 ${
                  crit.met ? 'text-emerald-600' : 'text-[#C8B6B4]'
                }`}
              />
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#1D1A39]">{crit.title}</h4>
                  <Badge variant="tag" size="xs">
                    {crit.met ? 'Satisfied' : 'In Progress'}
                  </Badge>
                </div>
                <div className="flex justify-between text-[#574459] mt-1.5 text-[11px]">
                  <span>Current: <strong>{crit.current}</strong></span>
                  <span className="text-[#7E6C7C]">Target: {crit.target}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Priority Module Progress */}
        <Card className="p-6">
          <CardTitle className="text-base mb-1">Curriculum by Priority Group</CardTitle>
          <CardDescription className="mb-4">
            Progress in foundational CORE modules vs High Value extensions
          </CardDescription>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#574459' }} />
                <YAxis tick={{ fontSize: 11, fill: '#574459' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1D1A39',
                    borderRadius: '8px',
                    color: '#FFFDFC',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="completed" fill="#451952" radius={[6, 6, 0, 0]} name="Completed" />
                <Bar dataKey="total" fill="#E2D6D4" radius={[6, 6, 0, 0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Practice Mastery Breakdown */}
        <Card className="p-6">
          <CardTitle className="text-base mb-1">Attempt Outcome Distribution</CardTitle>
          <CardDescription className="mb-4">
            Independent solutions vs assisted editorial solutions
          </CardDescription>
          <div className="h-64 w-full flex items-center justify-center">
            {totalAttempted > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1D1A39',
                      borderRadius: '8px',
                      color: '#FFFDFC',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-[#7E6C7C]">
                <BarChart3 className="w-8 h-8 text-[#AE445A] mx-auto mb-2 opacity-50" />
                <span>Log your first problem attempts to generate your mastery distribution chart.</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
