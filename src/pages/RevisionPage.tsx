import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, ProblemStatus } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { repository } from '../services/repository';
import { curriculumModules } from '../data/curriculumData';
import { PracticeProblem } from '../types/curriculum';
import { RevisionTask, ProblemProgress } from '../types/userData';

export const RevisionPage: React.FC = () => {
  const [revisionTasks, setRevisionTasks] = useState<RevisionTask[]>([]);
  const [problemProgress, setProblemProgress] = useState<Record<string, ProblemProgress>>({});
  const [activeFilter, setActiveFilter] = useState<'due' | 'overdue' | 'red' | 'yellow' | 'green-retention'>('due');

  // Active Review Session State
  const [activeReviewTask, setActiveReviewTask] = useState<RevisionTask | null>(null);
  const [isAttemptSubmitted, setIsAttemptSubmitted] = useState(false);
  const [newStatus, setNewStatus] = useState<ProblemStatus>('GREEN');
  const [reviewNotes, setReviewNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const loadData = async () => {
    const [revs, pProg] = await Promise.all([
      repository.getRevisionTasks(),
      repository.getAllProblemProgress(),
    ]);
    setRevisionTasks(revs);
    setProblemProgress(pProg);
  };

  useEffect(() => {
    loadData();
  }, []);

  const allProblems = curriculumModules.flatMap((m) => m.practiceProblems);

  // Group revisions
  const dueTodayTasks = revisionTasks.filter((r) => r.status === 'due' && r.dueDate === todayStr);
  const overdueTasks = revisionTasks.filter((r) => r.status === 'due' && r.dueDate < todayStr);

  const redProblems = Object.values(problemProgress).filter((p) => p.status === 'RED');
  const yellowProblems = Object.values(problemProgress).filter((p) => p.status === 'YELLOW');
  const greenRetention = Object.values(problemProgress).filter((p) => p.status === 'GREEN' && p.reviewCount >= 1);

  const startReviewSession = (task: RevisionTask) => {
    setActiveReviewTask(task);
    setIsAttemptSubmitted(false);
    setNewStatus('GREEN');
    setReviewNotes('');
  };

  const handleCompleteReview = async () => {
    if (!activeReviewTask) return;

    await repository.completeRevision(activeReviewTask.id);

    // Record new attempt and automatically calculate next spaced interval (1d -> 7d -> 21d)
    await repository.recordAttempt({
      problemId: activeReviewTask.problemId,
      attemptStatus: newStatus,
      timeSpentMinutes: 20,
      hintsUsed: newStatus !== 'GREEN',
      editorialUsed: false,
      approachNotes: reviewNotes || 'Completed during spaced revision',
    });

    await loadData();
    setActiveReviewTask(null);
  };

  const handlePostponeReview = async (taskId: string) => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const task = revisionTasks.find((t) => t.id === taskId);
    if (!task) return;

    await repository.scheduleRevision(task.problemId, tomorrow, 1);
    await repository.completeRevision(taskId); // mark original as resolved
    await loadData();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="pb-4 border-b border-[#F0EAE8]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#AE445A] mb-1">
          <span>Active Recall Engine</span>
          <span>·</span>
          <span>1, 7 &amp; 21 Day Spaced Intervals</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1D1A39]">
          Revision Centre
        </h1>
        <p className="text-xs sm:text-sm text-[#7E6C7C] mt-1">
          Notes and solutions remain hidden until you attempt the problem. Viewing a solution is not retention.
        </p>
      </div>

      {/* REVISION METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card
          onClick={() => setActiveFilter('due')}
          className={`p-4 cursor-pointer transition-all ${
            activeFilter === 'due' ? 'border-[#451952] bg-[#451952]/5 ring-1 ring-[#451952]' : ''
          }`}
        >
          <span className="text-[11px] font-semibold text-[#7E6C7C]">Due Today</span>
          <p className="font-display font-extrabold text-2xl text-[#1D1A39] mt-1">{dueTodayTasks.length}</p>
        </Card>

        <Card
          onClick={() => setActiveFilter('overdue')}
          className={`p-4 cursor-pointer transition-all ${
            activeFilter === 'overdue' ? 'border-[#451952] bg-[#451952]/5 ring-1 ring-[#451952]' : ''
          }`}
        >
          <span className="text-[11px] font-semibold text-rose-700">Overdue</span>
          <p className="font-display font-extrabold text-2xl text-rose-600 mt-1">{overdueTasks.length}</p>
        </Card>

        <Card
          onClick={() => setActiveFilter('red')}
          className={`p-4 cursor-pointer transition-all ${
            activeFilter === 'red' ? 'border-[#451952] bg-[#451952]/5 ring-1 ring-[#451952]' : ''
          }`}
        >
          <span className="text-[11px] font-semibold text-rose-700">Needs Work (Red)</span>
          <p className="font-display font-extrabold text-2xl text-[#1D1A39] mt-1">{redProblems.length}</p>
        </Card>

        <Card
          onClick={() => setActiveFilter('yellow')}
          className={`p-4 cursor-pointer transition-all ${
            activeFilter === 'yellow' ? 'border-[#451952] bg-[#451952]/5 ring-1 ring-[#451952]' : ''
          }`}
        >
          <span className="text-[11px] font-semibold text-amber-700">Assisted (Yellow)</span>
          <p className="font-display font-extrabold text-2xl text-[#1D1A39] mt-1">{yellowProblems.length}</p>
        </Card>
      </div>

      {/* REVISION QUEUE LIST */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {activeFilter === 'due' && `Problems Due for Revision Today (${dueTodayTasks.length})`}
              {activeFilter === 'overdue' && `Overdue Problems (${overdueTasks.length})`}
              {activeFilter === 'red' && `Problems Marked Needs Work (${redProblems.length})`}
              {activeFilter === 'yellow' && `Assisted Problems Requiring Independent Re-solve (${yellowProblems.length})`}
            </CardTitle>
          </div>
          <CardDescription>
            Click "Start Blind Revision" to practice before viewing prior approach notes.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {activeFilter === 'due' && dueTodayTasks.length === 0 && (
            <div className="p-8 text-center text-[#7E6C7C]">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#1D1A39]">Your revision queue is clear for today!</p>
              <p className="text-xs mt-1">Check back tomorrow or practice assisted problems.</p>
            </div>
          )}

          {activeFilter === 'due' &&
            dueTodayTasks.map((task) => {
              const prob = allProblems.find((p) => p.id === task.problemId);
              return (
                <div
                  key={task.id}
                  className="p-4 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-bold text-[#1D1A39]">
                      {prob?.title || task.problemId}
                    </h4>
                    <p className="text-xs text-[#7E6C7C] mt-0.5">
                      Interval: {task.intervalDays} day(s) · Scheduled: {task.dueDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handlePostponeReview(task.id)}
                    >
                      Postpone +1 Day
                    </Button>
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => startReviewSession(task)}
                      icon={<RotateCcw className="w-3.5 h-3.5" />}
                    >
                      Start Blind Revision
                    </Button>
                  </div>
                </div>
              );
            })}

          {activeFilter === 'overdue' &&
            overdueTasks.map((task) => {
              const prob = allProblems.find((p) => p.id === task.problemId);
              return (
                <div
                  key={task.id}
                  className="p-4 rounded-xl border border-rose-200 bg-rose-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-bold text-rose-950">
                      {prob?.title || task.problemId}
                    </h4>
                    <p className="text-xs text-rose-800 mt-0.5">
                      Overdue since {task.dueDate}
                    </p>
                  </div>
                  <Button
                    variant="berry"
                    size="xs"
                    onClick={() => startReviewSession(task)}
                  >
                    Solve Now
                  </Button>
                </div>
              );
            })}

          {activeFilter === 'red' &&
            redProblems.map((p) => {
              const prob = allProblems.find((item) => item.id === p.problemId);
              return (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl border border-[#F0EAE8] bg-white flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-[#1D1A39]">{prob?.title || p.problemId}</h4>
                    <p className="text-xs text-rose-600 font-medium mt-0.5">Needs independent reproduction</p>
                  </div>
                  <Badge status="RED" size="xs" />
                </div>
              );
            })}

          {activeFilter === 'yellow' &&
            yellowProblems.map((p) => {
              const prob = allProblems.find((item) => item.id === p.problemId);
              return (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl border border-[#F0EAE8] bg-white flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-[#1D1A39]">{prob?.title || p.problemId}</h4>
                    <p className="text-xs text-amber-700 font-medium mt-0.5">Assisted solve · Needs clean solve</p>
                  </div>
                  <Badge status="YELLOW" size="xs" />
                </div>
              );
            })}
        </CardContent>
      </Card>

      {/* ACTIVE BLIND REVISION SESSION MODAL */}
      <Modal
        isOpen={Boolean(activeReviewTask)}
        onClose={() => setActiveReviewTask(null)}
        title="Active Recall Revision Session"
        description="Solve the problem first. Only check past notes after testing yourself."
        size="lg"
      >
        {activeReviewTask && (
          <div className="space-y-5">
            {/* Problem Details */}
            <div className="p-4 rounded-xl bg-[#FAF7F6] border border-[#F0EAE8]">
              <span className="text-[11px] font-bold uppercase text-[#AE445A]">Target Problem</span>
              <h3 className="font-display font-bold text-base text-[#1D1A39] mt-1">
                {allProblems.find((p) => p.id === activeReviewTask.problemId)?.title || activeReviewTask.problemId}
              </h3>
              <p className="text-xs text-[#7E6C7C] mt-1">
                Open the external platform or code in your local editor. Avoid checking the editorial.
              </p>
            </div>

            {/* Hidden / Revealed Notes Toggle */}
            <div className="p-4 rounded-xl border border-[#E2D6D4] bg-[#FFFDFC]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1D1A39]">Previous Notes &amp; Approach</span>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setIsAttemptSubmitted(!isAttemptSubmitted)}
                  icon={isAttemptSubmitted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                >
                  {isAttemptSubmitted ? 'Hide Notes' : 'Reveal Notes (After Attempt)'}
                </Button>
              </div>

              {isAttemptSubmitted ? (
                <p className="text-xs text-[#1D1A39] bg-white p-3 rounded-lg border border-[#F0EAE8]">
                  {problemProgress[activeReviewTask.problemId]?.notes || 'No notes were recorded for this problem yet.'}
                </p>
              ) : (
                <div className="py-6 text-center text-xs text-[#7E6C7C] bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <EyeOff className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                  <span>Notes hidden to stimulate active neurological recall.</span>
                </div>
              )}
            </div>

            {/* Revision Result Assessment */}
            <div>
              <label className="block text-xs font-semibold text-[#1D1A39] mb-1.5">
                How did this re-solve go?
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div
                  onClick={() => setNewStatus('GREEN')}
                  className={`p-3 rounded-xl border cursor-pointer ${
                    newStatus === 'GREEN'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold'
                      : 'border-[#E2D6D4] bg-white'
                  }`}
                >
                  <span>Independent &amp; Retained (Green)</span>
                </div>
                <div
                  onClick={() => setNewStatus('YELLOW')}
                  className={`p-3 rounded-xl border cursor-pointer ${
                    newStatus === 'YELLOW'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold'
                      : 'border-[#E2D6D4] bg-white'
                  }`}
                >
                  <span>Needed Small Hint (Yellow)</span>
                </div>
                <div
                  onClick={() => setNewStatus('RED')}
                  className={`p-3 rounded-xl border cursor-pointer ${
                    newStatus === 'RED'
                      ? 'border-rose-500 bg-rose-50 text-rose-900 font-semibold'
                      : 'border-[#E2D6D4] bg-white'
                  }`}
                >
                  <span>Struggled / Needs Work (Red)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setActiveReviewTask(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCompleteReview}>
                Complete Review &amp; Schedule Next Interval
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
