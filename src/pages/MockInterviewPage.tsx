import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Clock,
  Sparkles,
  HelpCircle,
  FileCode,
  Award,
  History,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { repository } from '../services/repository';
import { MockInterviewRecord } from '../types/userData';
import { curriculumModules } from '../data/curriculumData';

const STAGES = [
  { id: 1, title: '1. Clarify Requirements & Constraints', time: '0:00 - 5:00', guide: 'Ask about input size, null values, negative numbers, duplicates, and expected return types.' },
  { id: 2, title: '2. Discuss Brute-Force Baseline', time: '5:00 - 10:00', guide: 'Articulate the naive O(N^2) or O(2^N) baseline and state its time/space bounds aloud.' },
  { id: 3, title: '3. Derive & Prove Optimised Approach', time: '10:00 - 20:00', guide: 'Explain the invariant (two pointers, monotonic deque, DP transition) before writing code.' },
  { id: 4, title: '4. Write Clean Java Solution', time: '20:00 - 35:00', guide: 'Code modularly. Use defensive checks (low + (high - low)/2) and meaningful variable names.' },
  { id: 5, title: '5. Dry-Run Normal & Edge Cases', time: '35:00 - 40:00', guide: 'Trace an example step-by-step. Test empty inputs, 1-element inputs, and extremes.' },
  { id: 6, title: '6. Self-Evaluation & Rubric Scoring', time: '40:00 - 45:00', guide: 'Reflect on communication, clean execution, and missed boundary traps.' },
];

export const MockInterviewPage: React.FC = () => {
  const [targetDuration, setTargetDuration] = useState(45); // in minutes
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  // Interview Session Data
  const [selectedTopic, setSelectedTopic] = useState('Graphs & Topological Sort');
  const [problemTitle, setProblemTitle] = useState('Course Schedule II (Order of Completion)');
  const [codeContent, setCodeContent] = useState(`class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        // Step 1: Build Adjacency list and compute in-degrees
        
        // Step 2: Push zero in-degree courses into BFS queue
        
        // Step 3: Process courses and record topological order
        
        return new int[0];
    }
}`);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [outcome, setOutcome] = useState<MockInterviewRecord['outcome']>('Hire');
  const [communicationScore, setCommunicationScore] = useState(4);
  const [problemSolvingScore, setProblemSolvingScore] = useState(4);
  const [codeQualityScore, setCodeQualityScore] = useState(4);

  // Past interviews history
  const [pastInterviews, setPastInterviews] = useState<MockInterviewRecord[]>([]);

  useEffect(() => {
    repository.getMockInterviews().then(setPastInterviews);
  }, []);

  // Timer logic
  useEffect(() => {
    let timer: any = null;
    if (isRunning && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsRemaining]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = (mins: number) => {
    setIsRunning(false);
    setTargetDuration(mins);
    setSecondsRemaining(mins * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleFinishInterview = async () => {
    const elapsedMinutes = Math.round((targetDuration * 60 - secondsRemaining) / 60) || targetDuration;
    const record = await repository.saveMockInterview({
      topic: selectedTopic,
      durationMinutes: elapsedMinutes,
      outcome,
      problemTitle,
      codeContent,
      feedbackNotes,
      communicationScore,
      problemSolvingScore,
      codeQualityScore,
    });

    setPastInterviews((prev) => [record, ...prev]);
    setIsRunning(false);
    alert('Mock interview record saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EAE8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#AE445A] mb-1">
            <span>Timed Assessment Environment</span>
            <span>·</span>
            <span>Real Interview Conditions</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1D1A39]">
            Mock Interview Simulation
          </h1>
          <p className="text-xs sm:text-sm text-[#7E6C7C] mt-1">
            Simulate 45-minute live technical interviews with stage-by-stage guidance and rubric grading.
          </p>
        </div>

        {/* Live Timer Controls */}
        <div className="flex items-center gap-3 bg-[#FFFDFC] border border-[#E2D6D4] px-4 py-2 rounded-2xl shadow-xs">
          <Clock className="w-5 h-5 text-[#451952]" />
          <span className="font-mono font-extrabold text-2xl text-[#1D1A39] tracking-wider">
            {formatTime(secondsRemaining)}
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            <Button
              variant={isRunning ? 'secondary' : 'primary'}
              size="xs"
              onClick={toggleTimer}
              icon={isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            >
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => resetTimer(targetDuration)}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* DURATION PRESET BAR */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#7E6C7C] font-medium mr-1">Session Duration:</span>
        {[30, 45, 60].map((mins) => (
          <button
            key={mins}
            onClick={() => resetTimer(mins)}
            className={`px-3 py-1 rounded-xl font-semibold transition-all ${
              targetDuration === mins
                ? 'bg-[#1D1A39] text-white shadow-xs'
                : 'bg-[#FAF7F6] border border-[#E2D6D4] text-[#574459] hover:bg-[#F3ECE9]'
            }`}
          >
            {mins} Minutes
          </button>
        ))}
      </div>

      {/* 2-COLUMN WORKSPACE: STAGES GUIDE & CODE SCRATCHPAD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMN 1: STAGES & RUBRIC EVALUATION */}
        <div className="space-y-6">
          {/* Guided Interview Stages */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F39F5A]" /> Interview Stages &amp; Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2.5">
              {STAGES.map((stg, i) => (
                <div
                  key={stg.id}
                  onClick={() => setCurrentStageIdx(i)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    currentStageIdx === i
                      ? 'border-[#451952] bg-[#451952]/5 ring-1 ring-[#451952]'
                      : 'border-[#F0EAE8] bg-[#FFFDFC] hover:border-[#E2D6D4]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1D1A39]">{stg.title}</span>
                    <span className="font-mono text-[10px] text-[#7E6C7C]">{stg.time}</span>
                  </div>
                  <p className="text-[11px] text-[#574459] mt-1 leading-relaxed">{stg.guide}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Outcome & Evaluation Scores */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-[#AE445A]" /> Rubric Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1D1A39] mb-1">Outcome Verdict</label>
                <select
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value as any)}
                  className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#451952]"
                >
                  <option value="Strong Hire">Strong Hire (Flawless communication &amp; code)</option>
                  <option value="Hire">Hire (Sound approach with minor hint)</option>
                  <option value="Leaning Hire">Leaning Hire (Working code, slow optimization)</option>
                  <option value="Leaning No Hire">Leaning No Hire (Missed major edge cases)</option>
                  <option value="No Hire">No Hire (Incomplete approach or syntax failure)</option>
                </select>
              </div>

              {/* Sliders */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between font-medium text-[#1D1A39] mb-1">
                    <span>Communication Score</span>
                    <span className="font-bold">{communicationScore} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={communicationScore}
                    onChange={(e) => setCommunicationScore(Number(e.target.value))}
                    className="w-full accent-[#451952]"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-medium text-[#1D1A39] mb-1">
                    <span>Problem Solving &amp; Invariants</span>
                    <span className="font-bold">{problemSolvingScore} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={problemSolvingScore}
                    onChange={(e) => setProblemSolvingScore(Number(e.target.value))}
                    className="w-full accent-[#451952]"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-medium text-[#1D1A39] mb-1">
                    <span>Code Quality &amp; Clean Syntax</span>
                    <span className="font-bold">{codeQualityScore} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={codeQualityScore}
                    onChange={(e) => setCodeQualityScore(Number(e.target.value))}
                    className="w-full accent-[#451952]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1D1A39] mb-1">
                  Feedback Notes &amp; Missed Traps
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Explained cycle detection well; initially missed disconnected graph component..."
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#451952]"
                />
              </div>

              <Button variant="primary" size="sm" className="w-full" onClick={handleFinishInterview}>
                Save Mock Session
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* COLUMN 2 & 3: CODE SCRATCHPAD & PAST HISTORY */}
        <div className="lg:col-span-2 space-y-6">
          {/* Code Scratchpad */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#1D1A39]" /> Java Implementation Scratchpad
                </CardTitle>
                <CardDescription>
                  Write clean, syntax-valid Java code as you explain your solution aloud.
                </CardDescription>
              </div>
              <Badge variant="tag" size="xs">
                Java 17+
              </Badge>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#1D1A39] mb-1">Problem Title</label>
                  <input
                    type="text"
                    value={problemTitle}
                    onChange={(e) => setProblemTitle(e.target.value)}
                    className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-[#451952]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1D1A39] mb-1">Topic</label>
                  <input
                    type="text"
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-[#451952]"
                  />
                </div>
              </div>

              <textarea
                rows={18}
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                className="w-full bg-[#1D1A39] text-[#FFFDFC] rounded-2xl p-4 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#F39F5A] border border-[#451952]"
                spellCheck={false}
              />
            </CardContent>
          </Card>

          {/* Past Mock Interview Logs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4 text-[#451952]" /> Past Mock Interview History
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2.5">
              {pastInterviews.length === 0 ? (
                <p className="text-xs text-[#7E6C7C] text-center py-6">
                  No mock interviews recorded yet. Complete your first 45-minute practice session above!
                </p>
              ) : (
                pastInterviews.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC] flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-[#1D1A39]">{m.problemTitle}</h4>
                      <p className="text-[#7E6C7C] mt-0.5">
                        Topic: {m.topic} · Duration: {m.durationMinutes} mins ·{' '}
                        {new Date(m.conductedAt).toLocaleDateString()}
                      </p>
                      {m.feedbackNotes && (
                        <p className="text-[#574459] mt-1 bg-white p-2 rounded-lg border border-[#F0EAE8]">
                          {m.feedbackNotes}
                        </p>
                      )}
                    </div>
                    <Badge variant="tag" size="xs" className="font-bold text-[#451952]">
                      {m.outcome}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
