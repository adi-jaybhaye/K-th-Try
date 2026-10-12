import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  ExternalLink,
  Filter,
  Eye,
  EyeOff,
  History,
  Clock,
  Search,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, ProblemStatus, DifficultyLevel } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { curriculumModules } from '../data/curriculumData';
import { repository } from '../services/repository';
import { PracticeProblem } from '../types/curriculum';
import { ProblemProgress, ProblemAttempt } from '../types/userData';
import { useLanguage, SupportedLanguage } from '../services/LanguageContext';

export const PracticePage: React.FC = () => {
  const [problemProgress, setProblemProgress] = useState<Record<string, ProblemProgress>>({});
  const [attempts, setAttempts] = useState<ProblemAttempt[]>([]);
  const [filterStatus, setFilterStatus] = useState<ProblemStatus | 'ALL'>('ALL');
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBlindMode, setIsBlindMode] = useState(false); // Hides topic labels for pattern testing!

  const { activeLanguage } = useLanguage();
  const [attemptLanguage, setAttemptLanguage] = useState<SupportedLanguage>('Java');

  // Attempt Logger Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<PracticeProblem | null>(null);
  const [attemptStatus, setAttemptStatus] = useState<ProblemStatus>('GREEN');
  const [timeSpent, setTimeSpent] = useState(25);
  const [hintsUsed, setHintsUsed] = useState(false);
  const [editorialUsed, setEditorialUsed] = useState(false);
  const [approachNotes, setApproachNotes] = useState('');
  const [mistakesEncountered, setMistakesEncountered] = useState('');

  // History Drawer / Modal State
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyProblemId, setHistoryProblemId] = useState<string | null>(null);

  // Add Custom Problem Modal State
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customPlatform, setCustomPlatform] = useState<PracticeProblem['platform']>('LeetCode');
  const [customDifficulty, setCustomDifficulty] = useState<DifficultyLevel>('Medium');
  const [customPattern, setCustomPattern] = useState('');
  const [customTopicId, setCustomTopicId] = useState('m3-arrays-prefix-hashing');
  const [customProblems, setCustomProblems] = useState<PracticeProblem[]>([]);

  const loadData = async () => {
    const [pProg, atts] = await Promise.all([
      repository.getAllProblemProgress(),
      repository.getAllAttempts(),
    ]);
    setProblemProgress(pProg);
    setAttempts(atts);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Aggregate all built-in problems + custom added ones
  const allProblems: PracticeProblem[] = [
    ...curriculumModules.flatMap((m) => m.practiceProblems),
    ...customProblems,
  ];

  // Filter problems
  const filteredProblems = allProblems.filter((p) => {
    const status = problemProgress[p.id]?.status || 'GREY';
    if (filterStatus !== 'ALL' && status !== filterStatus) return false;
    if (filterDifficulty !== 'ALL' && p.difficulty !== filterDifficulty) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.pattern.toLowerCase().includes(q) ||
        p.platform.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenLogModal = (problem: PracticeProblem) => {
    setSelectedProblem(problem);
    setAttemptLanguage(activeLanguage);
    setAttemptStatus('GREEN');
    setTimeSpent(20);
    setHintsUsed(false);
    setEditorialUsed(false);
    setApproachNotes('');
    setMistakesEncountered('');
    setIsLogModalOpen(true);
  };

  const handleSaveAttempt = async () => {
    if (!selectedProblem) return;

    await repository.recordAttempt({
      problemId: selectedProblem.id,
      attemptStatus,
      timeSpentMinutes: timeSpent,
      hintsUsed,
      editorialUsed,
      approachNotes,
      mistakesEncountered,
      language: attemptLanguage,
    });

    await loadData();
    setIsLogModalOpen(false);
    setSelectedProblem(null);
  };

  const handleAddCustomProblem = () => {
    if (!customTitle.trim()) return;
    const newProb: PracticeProblem = {
      id: 'prob_custom_' + Date.now(),
      title: customTitle.trim(),
      url: customUrl.trim() || 'https://leetcode.com',
      platform: customPlatform,
      difficulty: customDifficulty,
      pattern: customPattern.trim() || 'Custom',
      topicId: customTopicId,
      order: 999,
    };
    setCustomProblems((prev) => [...prev, newProb]);
    setIsAddCustomOpen(false);
    setCustomTitle('');
    setCustomUrl('');
  };

  const getProblemAttempts = (probId: string) => attempts.filter((a) => a.problemId === probId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EAE8]">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1D1A39]">
            Problem Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#7E6C7C] mt-1">
            Track actual practice attempts, time spent, hints used, and retention history.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBlindMode(!isBlindMode)}
            icon={isBlindMode ? <Eye className="w-4 h-4 text-[#451952]" /> : <EyeOff className="w-4 h-4" />}
          >
            {isBlindMode ? 'Show Topic Labels' : 'Blind / Unlabeled Mode'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddCustomOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Problem
          </Button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#F0EAE8] flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#7E6C7C] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search problems, patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E2D6D4] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#1D1A39] focus:outline-none focus:ring-2 focus:ring-[#451952]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[#7E6C7C] mr-1">Status:</span>
          {(['ALL', 'GREEN', 'YELLOW', 'RED', 'GREY'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-[#1D1A39] text-white'
                  : 'bg-[#FAF7F6] border border-[#E2D6D4] text-[#574459] hover:bg-[#F3ECE9]'
              }`}
            >
              {st === 'ALL' ? 'All' : st === 'GREEN' ? 'Independent' : st === 'YELLOW' ? 'Assisted' : st === 'RED' ? 'Needs Work' : 'Untested'}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[#7E6C7C] mr-1">Difficulty:</span>
          {(['ALL', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterDifficulty === diff
                  ? 'bg-[#451952] text-white'
                  : 'bg-[#FAF7F6] border border-[#E2D6D4] text-[#574459] hover:bg-[#F3ECE9]'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* PROBLEMS TABLE / LIST */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F6] border-b border-[#F0EAE8] text-[#574459] uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Problem</th>
                {!isBlindMode && <th className="py-3 px-4">Topic / Pattern</th>}
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Attempts</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE8]">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#7E6C7C]">
                    No problems match your current filters.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob) => {
                  const currentStatus = problemProgress[prob.id]?.status || 'GREY';
                  const probAttempts = getProblemAttempts(prob.id);

                  return (
                    <tr key={prob.id} className="hover:bg-[#FFFDFC] transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#1D1A39]">
                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#451952] hover:underline flex items-center gap-1.5"
                        >
                          <span>{prob.title}</span>
                          <ExternalLink className="w-3 h-3 text-[#7E6C7C]" />
                        </a>
                      </td>

                      {!isBlindMode && (
                        <td className="py-3 px-4 text-[#574459]">
                          <span className="font-medium text-[#1D1A39]">{prob.pattern}</span>
                          <span className="text-[10px] text-[#7E6C7C] block truncate max-w-44">
                            {prob.topicId.replace('m', 'Module ')}
                          </span>
                        </td>
                      )}

                      <td className="py-3 px-4 text-[#574459]">{prob.platform}</td>

                      <td className="py-3 px-4">
                        <Badge difficulty={prob.difficulty} size="xs" />
                      </td>

                      <td className="py-3 px-4">
                        <Badge status={currentStatus} size="xs" />
                      </td>

                      <td className="py-3 px-4 font-mono">
                        {probAttempts.length > 0 ? (
                          <button
                            onClick={() => {
                              setHistoryProblemId(prob.id);
                              setIsHistoryModalOpen(true);
                            }}
                            className="text-[#451952] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <History className="w-3 h-3" />
                            <span>{probAttempts.length} log(s)</span>
                          </button>
                        ) : (
                          <span className="text-[#A89CA8]">0</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => handleOpenLogModal(prob)}
                        >
                          Record Attempt
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* RECORD ATTEMPT MODAL */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Record Practice Attempt"
        description={selectedProblem ? `Log your attempt for ${selectedProblem.title}` : ''}
      >
        {selectedProblem && (
          <div className="space-y-4">
            {/* Status Select */}
            <div>
              <label className="block text-xs font-semibold text-[#1D1A39] mb-1.5">
                Outcome Status
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'GREEN', title: 'Independent (Green)', desc: 'Solved alone, can explain & reproduce without hints.' },
                  { id: 'YELLOW', title: 'Assisted (Yellow)', desc: 'Used hints or understood from editorial; needs re-solve.' },
                  { id: 'RED', title: 'Needs Work (Red)', desc: 'Implementation was incorrect or incomplete.' },
                  { id: 'GREY', title: 'Transfer Untested (Grey)', desc: 'Familiar with code but untested on variants.' },
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setAttemptStatus(s.id as ProblemStatus)}
                    className={`p-2.5 rounded-xl border cursor-pointer ${
                      attemptStatus === s.id
                        ? 'border-[#451952] bg-[#451952]/5 ring-1 ring-[#451952]'
                        : 'border-[#E2D6D4] bg-white'
                    }`}
                  >
                    <span className="font-semibold text-[#1D1A39] block">{s.title}</span>
                    <span className="text-[10px] text-[#7E6C7C] mt-0.5 block">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Implementation Language */}
            <div>
              <label className="block text-xs font-semibold text-[#1D1A39] mb-1.5">
                Implementation Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Java', 'C++', 'Python'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setAttemptLanguage(lang)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      attemptLanguage === lang
                        ? 'border-[#451952] bg-[#FAF7F6] text-[#451952] ring-2 ring-[#451952]/20 shadow-xs'
                        : 'border-[#E2D6D4] bg-[#FFFDFC] text-[#574459] hover:bg-[#FAF7F6]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Spent & Assistance */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1D1A39] mb-1">
                  Time Spent (Minutes)
                </label>
                <input
                  type="number"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(Number(e.target.value))}
                  className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3.5 py-2 text-sm font-mono focus:ring-2 focus:ring-[#451952]"
                />
              </div>

              <div className="flex flex-col justify-end space-y-2 pb-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hintsUsed}
                    onChange={(e) => setHintsUsed(e.target.checked)}
                    className="w-4 h-4 rounded text-[#451952]"
                  />
                  <span>Hints Used</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editorialUsed}
                    onChange={(e) => setEditorialUsed(e.target.checked)}
                    className="w-4 h-4 rounded text-[#451952]"
                  />
                  <span>Editorial / Video Looked Up</span>
                </label>
              </div>
            </div>

            {/* Personal Approach */}
            <div>
              <label className="block text-xs font-semibold text-[#1D1A39] mb-1">
                Your Approach / Mental Model
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Used monotonic stack with index tracking to compute distance to next greater element in O(N)..."
                value={approachNotes}
                onChange={(e) => setApproachNotes(e.target.value)}
                className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#451952]"
              />
            </div>

            {/* Mistakes Encountered */}
            <div>
              <label className="block text-xs font-semibold text-[#1D1A39] mb-1">
                Mistakes or Edge Cases Encountered
              </label>
              <input
                type="text"
                placeholder="e.g. Integer overflow on mid calculation; forgot empty array edge case"
                value={mistakesEncountered}
                onChange={(e) => setMistakesEncountered(e.target.value)}
                className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#451952]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsLogModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveAttempt}>
                Save Attempt &amp; Update Next Review
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ATTEMPT HISTORY MODAL */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title="Attempt History"
        description="Detailed record of past attempts for this problem"
      >
        <div className="space-y-3">
          {historyProblemId && getProblemAttempts(historyProblemId).map((att) => (
            <div key={att.id} className="p-3 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge status={att.attemptStatus} size="xs" />
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FAF7F6] text-[#451952] border border-[#E2D6D4]">
                    {att.language || 'Java'}
                  </span>
                </div>
                <span className="font-mono text-[#7E6C7C]">
                  {new Date(att.attemptedAt).toLocaleString()}
                </span>
              </div>
              <p className="text-[#574459]">
                Duration: <strong className="text-[#1D1A39]">{att.timeSpentMinutes} mins</strong> ·{' '}
                {att.hintsUsed ? 'Used hints' : 'No hints'} ·{' '}
                {att.editorialUsed ? 'Editorial consulted' : 'No editorial'}
              </p>
              {att.approachNotes && (
                <p className="text-[#1D1A39] bg-white p-2 rounded-lg border border-[#F0EAE8]">
                  <strong>Approach:</strong> {att.approachNotes}
                </p>
              )}
              {att.mistakesEncountered && (
                <p className="text-rose-700 bg-rose-50/50 p-2 rounded-lg border border-rose-200">
                  <strong>Mistake:</strong> {att.mistakesEncountered}
                </p>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {/* ADD CUSTOM PROBLEM MODAL */}
      <Modal
        isOpen={isAddCustomOpen}
        onClose={() => setIsAddCustomOpen(false)}
        title="Add Problem to Tracker"
        description="Add an external coding platform problem to track."
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#1D1A39] mb-1">Problem Title</label>
            <input
              type="text"
              placeholder="e.g. Trapping Rain Water"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-[#451952]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1A39] mb-1">Problem URL</label>
            <input
              type="url"
              placeholder="https://leetcode.com/problems/..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3.5 py-2 text-sm font-mono focus:ring-2 focus:ring-[#451952]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1D1A39] mb-1">Platform</label>
              <select
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value as any)}
                className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-[#451952]"
              >
                <option value="LeetCode">LeetCode</option>
                <option value="CodeChef">CodeChef</option>
                <option value="GeeksforGeeks">GeeksforGeeks</option>
                <option value="HackerRank">HackerRank</option>
                <option value="Striver">Striver</option>
                <option value="Custom">Custom / OA</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1A39] mb-1">Difficulty</label>
              <select
                value={customDifficulty}
                onChange={(e) => setCustomDifficulty(e.target.value as any)}
                className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-[#451952]"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1A39] mb-1">Algorithmic Pattern</label>
            <input
              type="text"
              placeholder="e.g. Two Pointers / Monotonic Stack"
              value={customPattern}
              onChange={(e) => setCustomPattern(e.target.value)}
              className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-[#451952]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsAddCustomOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddCustomProblem}>
              Add Problem
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
