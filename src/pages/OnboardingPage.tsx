import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Target,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { UserPreferences } from '../types/userData';
import { ScheduleEngine, WorkloadAnalysis } from '../services/scheduleEngine';
import { repository } from '../services/repository';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Wizard state
  const [goal, setGoal] = useState<UserPreferences['goal']>('campus-placements');
  const [level, setLevel] = useState<UserPreferences['level']>('comfortable-easy');
  const [planWeeks, setPlanWeeks] = useState(12);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState(
    new Date(Date.now() + 84 * 86400000).toISOString().split('T')[0]
  );
  const [activeDays, setActiveDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [hoursPerDay, setHoursPerDay] = useState<Record<string, number>>({
    Mon: 2,
    Tue: 2,
    Wed: 2,
    Thu: 2,
    Fri: 2,
    Sat: 3,
    Sun: 0,
  });
  const [learningPriorities, setLearningPriorities] = useState<UserPreferences['learningPriorities']>('core-first');
  const [preferredLanguage, setPreferredLanguage] = useState<'Java' | 'C++' | 'Python'>('Java');
  const [isGenerating, setIsGenerating] = useState(false);

  // Update target date when plan weeks change
  const handleWeeksChange = (weeks: number) => {
    setPlanWeeks(weeks);
    const start = new Date(startDate);
    const target = new Date(start.getTime() + weeks * 7 * 86400000);
    setTargetDate(target.toISOString().split('T')[0]);
  };

  const toggleDay = (day: string) => {
    if (activeDays.includes(day)) {
      if (activeDays.length > 1) {
        setActiveDays(activeDays.filter((d) => d !== day));
      }
    } else {
      setActiveDays([...activeDays, day]);
    }
  };

  const handleHoursChange = (day: string, hours: number) => {
    setHoursPerDay({ ...hoursPerDay, [day]: Math.max(0, Math.min(12, hours)) });
  };

  // Workload analysis
  const workload: WorkloadAnalysis = ScheduleEngine.analyzeWorkload({
    startDate,
    targetDate,
    planDurationWeeks: planWeeks,
    activeDays,
    hoursPerDay,
    priorityMode: learningPriorities,
  });

  const handleFinish = async () => {
    setIsGenerating(true);
    try {
      const calculatedWeeklyHours = Object.entries(hoursPerDay)
        .filter(([day]) => activeDays.includes(day))
        .reduce((sum, [, h]) => sum + h, 0);

      const prefs: UserPreferences = {
        id: 'current-user-prefs',
        goal,
        level,
        weeklyHours: calculatedWeeklyHours,
        startDate,
        targetDate,
        planDurationWeeks: planWeeks,
        activeDays,
        hoursPerDay,
        learningPriorities,
        reviewIntervals: [1, 7, 21],
        preferredLanguage,
        theme: 'light',
        isOnboarded: true,
      };

      await repository.savePreferences(prefs);

      // Generate initial study tasks
      const generatedTasks = ScheduleEngine.generateSchedule({
        startDate,
        targetDate,
        planDurationWeeks: planWeeks,
        activeDays,
        hoursPerDay,
        priorityMode: learningPriorities,
      });

      await repository.saveTimelineTasks(generatedTasks);

      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving onboarding plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDFC] py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl">
        {/* Progress Bar Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-[#7E6C7C] mb-2">
            <span>Step {step} of 4</span>
            <span>
              {step === 1 && 'Preparation Goal'}
              {step === 2 && 'Current Experience Level'}
              {step === 3 && 'Schedule & Availability'}
              {step === 4 && 'Workload & Plan Review'}
            </span>
          </div>
          <div className="w-full bg-[#FAF7F6] border border-[#F0EAE8] rounded-full h-2 overflow-hidden flex">
            <div
              className="bg-[#1D1A39] transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: GOAL */}
        {step === 1 && (
          <Card className="animate-in fade-in duration-200">
            <CardHeader>
              <CardTitle>What is your primary preparation goal?</CardTitle>
              <CardDescription>
                We'll tailor your roadmap priorities and assessment schedules accordingly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {[
                { id: 'campus-placements', title: 'Campus Placements & On-Campus Drives', desc: 'Core DSA foundations, high-yield patterns, and speed assessments.' },
                { id: 'internships', title: 'Summer Internship Assessments', desc: 'Arrays, two pointers, trees, graphs, and common online assessment (OA) questions.' },
                { id: 'general-sde', title: 'General SDE Technical Interviews', desc: 'End-to-end curriculum including advanced topics and mock interview rounds.' },
                { id: 'foundations', title: 'Build Rock-Solid DSA Foundations', desc: 'Steady paced, concept-first study focusing on deep algorithmic intuition.' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setGoal(opt.id as any)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    goal === opt.id
                      ? 'border-[#451952] bg-[#451952]/5 ring-1 ring-[#451952]'
                      : 'border-[#F0EAE8] bg-white hover:border-[#E2D6D4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-semibold text-sm text-[#1D1A39]">{opt.title}</h4>
                    {goal === opt.id && <CheckCircle className="w-4 h-4 text-[#451952]" />}
                  </div>
                  <p className="text-xs text-[#7E6C7C] mt-1">{opt.desc}</p>
                </div>
              ))}

              <div className="pt-3 border-t border-[#F0EAE8]">
                <label className="block text-xs font-semibold text-[#1D1A39] mb-1.5">
                  Primary Programming Language Track
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Java', 'C++', 'Python'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setPreferredLanguage(lang)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        preferredLanguage === lang
                          ? 'border-[#451952] bg-[#FAF7F6] text-[#451952] ring-2 ring-[#451952]/20 shadow-xs'
                          : 'border-[#E2D6D4] bg-white text-[#574459] hover:bg-[#FAF7F6]'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" onClick={() => setStep(2)} icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                  Next: Current Level
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: LEVEL */}
        {step === 2 && (
          <Card className="animate-in fade-in duration-200">
            <CardHeader>
              <CardTitle>Where are you starting from?</CardTitle>
              <CardDescription>
                Be completely honest. The k-th attempt starts wherever you currently stand.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {[
                { id: 'beginner', title: 'Beginner / First-time Learner', desc: 'Starting from variables, basic loops, and Java syntax foundations.' },
                { id: 'java-foundations', title: 'Java Foundations Completed', desc: 'Familiar with classes, methods, and ArrayLists; new to complex algorithmic patterns.' },
                { id: 'comfortable-easy', title: 'Comfortable with Easy Problems', desc: 'Can solve Two Sum and basic string problems; struggle when approaching medium DP or graphs.' },
                { id: 'solving-medium', title: 'Solving Some Medium Problems', desc: 'Can tackle standard array and tree problems; preparing for timed interview pressure and retention.' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setLevel(opt.id as any)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    level === opt.id
                      ? 'border-[#451952] bg-[#451952]/5 ring-1 ring-[#451952]'
                      : 'border-[#F0EAE8] bg-white hover:border-[#E2D6D4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-semibold text-sm text-[#1D1A39]">{opt.title}</h4>
                    {level === opt.id && <CheckCircle className="w-4 h-4 text-[#451952]" />}
                  </div>
                  <p className="text-xs text-[#7E6C7C] mt-1">{opt.desc}</p>
                </div>
              ))}

              <div className="pt-4 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)} icon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button variant="primary" onClick={() => setStep(3)} icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                  Next: Study Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: SCHEDULE */}
        {step === 3 && (
          <Card className="animate-in fade-in duration-200">
            <CardHeader>
              <CardTitle>Configure your realistic study timeline</CardTitle>
              <CardDescription>
                We build around your available days and include buffer sessions to prevent calendar collapse.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              {/* Plan Presets */}
              <div>
                <label className="block text-xs font-semibold text-[#1D1A39] mb-2">Duration Preset</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { weeks: 12, label: '12 Weeks (Intensive)' },
                    { weeks: 24, label: '24 Weeks (Comprehensive)' },
                    { weeks: 16, label: '16 Weeks (Balanced)' },
                  ].map((p) => (
                    <button
                      key={p.weeks}
                      type="button"
                      onClick={() => handleWeeksChange(p.weeks)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                        planWeeks === p.weeks
                          ? 'border-[#1D1A39] bg-[#1D1A39] text-white shadow-xs'
                          : 'border-[#E2D6D4] bg-[#FFFDFC] text-[#574459] hover:bg-[#FAF7F6]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start and Target Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1D1A39] mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1A39] mb-1">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Active Days Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#1D1A39] mb-2">Active Study Days</label>
                <div className="grid grid-cols-7 gap-1.5">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                    const isActive = activeDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all flex flex-col items-center gap-1 ${
                          isActive
                            ? 'border-[#451952] bg-[#451952] text-white'
                            : 'border-[#F0EAE8] bg-[#FAF7F6] text-[#7E6C7C]'
                        }`}
                      >
                        <span>{day}</span>
                        <span className="text-[10px] font-mono opacity-80">
                          {isActive ? `${hoursPerDay[day] || 2}h` : 'Off'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Learning Priority Mode */}
              <div>
                <label className="block text-xs font-semibold text-[#1D1A39] mb-2">Curriculum Sequencing</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div
                    onClick={() => setLearningPriorities('core-first')}
                    className={`p-3 rounded-xl border cursor-pointer ${
                      learningPriorities === 'core-first'
                        ? 'border-[#451952] bg-[#451952]/5'
                        : 'border-[#F0EAE8] bg-white'
                    }`}
                  >
                    <span className="font-semibold text-[#1D1A39] block">Core Topics First (Recommended)</span>
                    <span className="text-[#7E6C7C] text-[11px] mt-0.5 block">
                      Prioritizes high-frequency interview modules before optional stretch algorithms.
                    </span>
                  </div>
                  <div
                    onClick={() => setLearningPriorities('all')}
                    className={`p-3 rounded-xl border cursor-pointer ${
                      learningPriorities === 'all'
                        ? 'border-[#451952] bg-[#451952]/5'
                        : 'border-[#F0EAE8] bg-white'
                    }`}
                  >
                    <span className="font-semibold text-[#1D1A39] block">Sequential (Modules 1 to 16)</span>
                    <span className="text-[#7E6C7C] text-[11px] mt-0.5 block">
                      Follows the standard textbook order from foundations to advanced algorithms.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)} icon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button variant="primary" onClick={() => setStep(4)} icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                  Next: Workload Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: WORKLOAD & CONFIRMATION */}
        {step === 4 && (
          <Card className="animate-in fade-in duration-200">
            <CardHeader>
              <CardTitle>Workload Feasibility &amp; Schedule Proposal</CardTitle>
              <CardDescription>
                Transparent analysis of required vs available study hours before generating tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Feasibility Alert */}
              <div
                className={`p-4 rounded-xl border ${
                  workload.isFeasible
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm">
                  {workload.isFeasible ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                  <span>
                    {workload.isFeasible
                      ? 'Plan is realistic and achievable!'
                      : 'Schedule is tightly packed'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-black/10 text-xs">
                  <div>
                    <span className="opacity-75 block">Estimated Prep Workload</span>
                    <span className="font-mono font-bold text-sm">~{workload.totalEstimatedHours} hours</span>
                  </div>
                  <div>
                    <span className="opacity-75 block">Total Available Hours</span>
                    <span className="font-mono font-bold text-sm">~{workload.totalAvailableHours} hours</span>
                  </div>
                </div>
                {workload.warningMessage && (
                  <p className="text-xs mt-2 font-medium text-amber-800">{workload.warningMessage}</p>
                )}
              </div>

              {/* Recommendations list */}
              <div className="p-3.5 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC]">
                <span className="text-xs font-bold text-[#1D1A39] block mb-1.5">Recommendations:</span>
                <ul className="text-xs text-[#574459] space-y-1 list-disc list-inside">
                  {workload.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Schedule Summary Highlights */}
              <div className="p-3.5 rounded-xl border border-[#F0EAE8] bg-[#FAF7F6] text-xs text-[#574459] space-y-1">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium text-[#1D1A39]">{planWeeks} Weeks ({startDate} to {targetDate})</span>
                </div>
                <div className="flex justify-between">
                  <span>Priority Sequence:</span>
                  <span className="font-medium text-[#1D1A39] capitalize">{learningPriorities.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Days / Week:</span>
                  <span className="font-medium text-[#1D1A39]">{activeDays.join(', ')}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(3)} icon={<ArrowLeft className="w-4 h-4" />}>
                  Edit Schedule
                </Button>
                <Button
                  variant="primary"
                  isLoading={isGenerating}
                  onClick={handleFinish}
                  icon={<Sparkles className="w-4 h-4 text-[#F39F5A]" />}
                  iconPosition="right"
                >
                  Generate My Study Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
