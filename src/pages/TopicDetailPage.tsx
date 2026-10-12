import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  ExternalLink,
  BookOpen,
  Code,
  AlertTriangle,
  Lightbulb,
  Layers,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { curriculumModules } from '../data/curriculumData';
import { repository } from '../services/repository';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { TopicProgress, SubtopicProgress } from '../types/userData';
import { useLanguage, SupportedLanguage } from '../services/LanguageContext';
import confetti from 'canvas-confetti';

export const TopicDetailPage: React.FC = () => {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const navigate = useNavigate();
  const { activeLanguage, setLanguage } = useLanguage();

  const moduleData = curriculumModules.find((m) => m.slug === topicSlug);

  const [activeTab, setActiveTab] = useState<'study' | 'subtopics' | 'practice' | 'resources' | 'notes'>('study');
  const [codeLang, setCodeLang] = useState<SupportedLanguage>(activeLanguage);
  const [topicProgress, setTopicProgress] = useState<TopicProgress | null>(null);
  const [subtopicProgress, setSubtopicProgress] = useState<Record<string, SubtopicProgress>>({});
  const [personalNotes, setPersonalNotes] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(() => {
    setCodeLang(activeLanguage);
  }, [activeLanguage]);

  useEffect(() => {
    if (!moduleData) return;

    // Load progress and notes
    repository.getAllTopicProgress().then((map) => {
      const p = map[moduleData.id];
      if (p) {
        setTopicProgress(p);
        setPersonalNotes(p.notes || '');
      }
    });

    repository.getAllSubtopicProgress().then(setSubtopicProgress);
  }, [moduleData]);

  if (!moduleData) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-[#1D1A39]">Module Not Found</h2>
        <p className="text-xs text-[#7E6C7C] mt-2">The requested curriculum section does not exist.</p>
        <Link to="/roadmap" className="inline-block mt-4">
          <Button variant="primary" size="sm">
            Back to Roadmap
          </Button>
        </Link>
      </div>
    );
  }

  const handleToggleChecklist = async (subtopicId: string, itemText: string) => {
    const current = subtopicProgress[subtopicId]?.checklistCompleted || [];
    const next = current.includes(itemText)
      ? current.filter((x) => x !== itemText)
      : [...current, itemText];

    const sub = moduleData.subtopics.find((s) => s.id === subtopicId);
    const isCompleted = sub ? next.length === sub.checklistItems.length : false;

    await repository.saveSubtopicProgress(subtopicId, next, isCompleted);
    setSubtopicProgress((prev) => ({
      ...prev,
      [subtopicId]: { id: subtopicId, subtopicId, checklistCompleted: next, isCompleted },
    }));
  };

  const handleToggleMastery = async () => {
    const nextState = !topicProgress?.isCompleted;
    const updated: TopicProgress = {
      id: moduleData.id,
      topicId: moduleData.id,
      isCompleted: nextState,
      masteryPercentage: nextState ? 100 : 50,
      notes: personalNotes,
    };

    await repository.saveTopicProgress(updated);
    setTopicProgress(updated);

    if (nextState) {
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      } catch {
        // ignore
      }
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    const updated: TopicProgress = {
      id: moduleData.id,
      topicId: moduleData.id,
      isCompleted: topicProgress?.isCompleted || false,
      masteryPercentage: topicProgress?.masteryPercentage || 0,
      notes: personalNotes,
    };
    await repository.saveTopicProgress(updated);
    setIsSavingNotes(false);
  };

  const currentLangNotes =
    codeLang === 'C++' && moduleData.cppImplementationNotes
      ? moduleData.cppImplementationNotes
      : codeLang === 'Python' && moduleData.pythonImplementationNotes
      ? moduleData.pythonImplementationNotes
      : moduleData.javaImplementationNotes;

  const handleCopyCode = () => {
    if (!currentLangNotes?.codeTemplate) return;
    navigator.clipboard.writeText(currentLangNotes.codeTemplate);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link to="/roadmap" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#574459] hover:text-[#1D1A39]">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Roadmap</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge priority={moduleData.priority} size="sm" />
          <Button
            variant={topicProgress?.isCompleted ? 'secondary' : 'aubergine'}
            size="sm"
            onClick={handleToggleMastery}
            icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
          >
            {topicProgress?.isCompleted ? 'Mastered' : 'Mark as Mastered'}
          </Button>
        </div>
      </div>

      {/* MODULE HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#F0EAE8] shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#AE445A] mb-1.5">
          <span>MODULE {moduleData.moduleNumber}</span>
          <span>·</span>
          <span>EST. {moduleData.estimatedHours} HOURS</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#1D1A39] tracking-tight">
          {moduleData.title}
        </h1>
        <p className="text-sm sm:text-base text-[#574459] mt-2 leading-relaxed">
          {moduleData.description}
        </p>

        {/* Prerequisites */}
        {moduleData.prerequisites.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#F0EAE8] flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#1D1A39]">Prerequisites:</span>
            {moduleData.prerequisites.map((pId) => {
              const pMod = curriculumModules.find((m) => m.id === pId);
              return pMod ? (
                <Link
                  key={pId}
                  to={`/roadmap/${pMod.slug}`}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF7F6] border border-[#E2D6D4] text-[#451952] font-semibold hover:bg-[#F3ECE9]"
                >
                  {pMod.title}
                </Link>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 border-b border-[#F0EAE8] pb-1 overflow-x-auto">
        {[
          { id: 'study', label: 'Study Guide & Theory', icon: BookOpen },
          { id: 'subtopics', label: `Checklists (${moduleData.subtopics.length})`, icon: CheckCircle },
          { id: 'practice', label: `Practice Problems (${moduleData.practiceProblems.length})`, icon: Code },
          { id: 'resources', label: `Curated References (${moduleData.resources.length})`, icon: ExternalLink },
          { id: 'notes', label: 'Personal Notes', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#1D1A39] text-white shadow-xs'
                  : 'text-[#574459] hover:bg-[#FAF7F6] hover:text-[#1D1A39]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: STUDY GUIDE & THEORY */}
      {activeTab === 'study' && (
        <div className="space-y-6">
          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F39F5A]" /> Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#1D1A39]">
                {moduleData.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#FAF7F6]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#451952] shrink-0 mt-1.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Pattern Clues & Practical Applications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#F39F5A]" /> Pattern-Recognition Clues
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2 text-xs text-[#574459]">
                {moduleData.patternClues.map((clue, i) => (
                  <p key={i} className="p-2.5 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC]">
                    {clue}
                  </p>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#451952]" /> Real-World Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2 text-xs text-[#574459]">
                {moduleData.practicalApplications.map((app, i) => (
                  <p key={i} className="p-2.5 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC]">
                    {app}
                  </p>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Complexity Analysis */}
          <Card className="bg-[#FAF7F6]">
            <CardHeader>
              <CardTitle className="text-base">Complexity &amp; Mathematical Intuition</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#E2D6D4]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#AE445A] block">
                  Time Complexity
                </span>
                <span className="font-semibold text-[#1D1A39] mt-1 block">
                  {moduleData.complexityNotes.time}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E2D6D4]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#451952] block">
                  Space Complexity
                </span>
                <span className="font-semibold text-[#1D1A39] mt-1 block">
                  {moduleData.complexityNotes.space}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E2D6D4]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F39F5A] block">
                  Core Intuition
                </span>
                <span className="font-semibold text-[#1D1A39] mt-1 block">
                  {moduleData.complexityNotes.intuition}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Language Implementation Guidance & Template */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#1D1A39]" /> {codeLang} Implementation Template
                </CardTitle>
                <CardDescription>
                  Idiomatic {codeLang} patterns, core data structures, and gotchas
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Switcher Pills */}
                <div className="inline-flex items-center gap-1 p-1 bg-[#FAF7F6] border border-[#E2D6D4] rounded-xl text-xs font-semibold">
                  {(['Java', 'C++', 'Python'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setCodeLang(lang);
                        setLanguage(lang);
                      }}
                      className={`px-2.5 py-1 rounded-lg transition-all text-xs font-bold ${
                        codeLang === lang
                          ? 'bg-[#1D1A39] text-white shadow-xs'
                          : 'text-[#574459] hover:text-[#1D1A39] hover:bg-[#F3ECE9]'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <Button variant="outline" size="xs" onClick={handleCopyCode} icon={<Copy className="w-3.5 h-3.5" />}>
                  {copiedCode ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="rounded-2xl bg-[#1D1A39] text-[#FFFDFC] p-4 font-mono text-xs overflow-x-auto border border-[#451952]">
                <pre>{currentLangNotes?.codeTemplate}</pre>
              </div>

              {currentLangNotes?.coreDataStructures && (
                <div className="p-3 rounded-xl border border-[#E2D6D4] bg-[#FAF7F6] text-xs">
                  <span className="font-bold text-[#1D1A39]">Core {codeLang} Structures: </span>
                  <span className="text-[#574459]">{currentLangNotes.coreDataStructures}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <span className="font-bold text-emerald-900 block mb-1">Recommended {codeLang} Tricks:</span>
                  <ul className="space-y-1 text-emerald-800 list-disc list-inside">
                    {currentLangNotes?.tricks.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50">
                  <span className="font-bold text-rose-900 block mb-1">Gotchas &amp; Pitfalls:</span>
                  <ul className="space-y-1 text-rose-800 list-disc list-inside">
                    {currentLangNotes?.gotchas.map((g, idx) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes and Boundary Cases */}
          <Card className="border-amber-200 bg-amber-50/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Common Mistakes &amp; Boundary Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 text-xs text-amber-950">
              <div>
                <span className="font-bold block mb-1">Mistakes to avoid:</span>
                <ul className="list-disc list-inside space-y-1">
                  {moduleData.commonMistakes.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-amber-200/60">
                <span className="font-bold block mb-1">Boundary Test Cases:</span>
                <p>{moduleData.boundaryCases.join(' · ')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: SUBTOPICS & CHECKLISTS */}
      {activeTab === 'subtopics' && (
        <div className="space-y-4">
          {moduleData.subtopics.map((sub) => {
            const completedItems = subtopicProgress[sub.id]?.checklistCompleted || [];
            const isCompleted = subtopicProgress[sub.id]?.isCompleted || false;

            return (
              <Card key={sub.id} className={isCompleted ? 'border-emerald-200 bg-emerald-50/20' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{sub.title}</CardTitle>
                    <span className="text-xs font-mono font-semibold text-[#7E6C7C]">
                      {completedItems.length}/{sub.checklistItems.length} Checked
                    </span>
                  </div>
                  <CardDescription>{sub.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {sub.checklistItems.map((item, idx) => {
                      const isChecked = completedItems.includes(item);
                      return (
                        <label
                          key={idx}
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC] hover:bg-white cursor-pointer transition-colors text-xs text-[#1D1A39]"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleChecklist(sub.id, item)}
                            className="w-4 h-4 rounded text-[#451952] focus:ring-[#451952]"
                          />
                          <span className={isChecked ? 'line-through text-[#7E6C7C]' : ''}>
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* TAB 3: PRACTICE PROBLEMS */}
      {activeTab === 'practice' && (
        <Card>
          <CardHeader>
            <CardTitle>Curated Practice Problems</CardTitle>
            <CardDescription>
              Solve each problem, then record your attempt to track whether you solved it independently or assisted.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-[#F0EAE8]">
              {moduleData.practiceProblems.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#1D1A39] hover:text-[#451952] hover:underline flex items-center gap-1.5"
                      >
                        <span>{p.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#7E6C7C]" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#7E6C7C] mt-0.5">
                      <span>{p.platform}</span>
                      <span>·</span>
                      <span>Pattern: {p.pattern}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge difficulty={p.difficulty} size="xs" />
                    <Link to="/practice">
                      <Button variant="secondary" size="xs">
                        Record Attempt
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: CURATED REFERENCES */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {moduleData.resources.map((res) => (
            <Card key={res.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#AE445A]">{res.provider}</span>
                  {res.verified && (
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      Verified
                    </span>
                  )}
                </div>
                <h4 className="font-display font-bold text-base text-[#1D1A39]">{res.title}</h4>
                <div className="flex items-center gap-2 text-xs text-[#7E6C7C] mt-2">
                  <span className="capitalize">{res.type}</span>
                  <span>·</span>
                  <span className="capitalize">{res.access.replace('-', ' ')}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0EAE8]">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#451952] hover:underline"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 5: PERSONAL NOTES */}
      {activeTab === 'notes' && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Notes &amp; Edge Cases for {moduleData.title}</CardTitle>
            <CardDescription>
              Your notes are private and automatically saved to your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <textarea
              rows={12}
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              placeholder="Write your mental models, code snippets, tricky test cases, or interview reminders here..."
              className="w-full bg-[#FFFDFC] text-[#1D1A39] border border-[#E2D6D4] rounded-2xl p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#451952]"
            />
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                isLoading={isSavingNotes}
                onClick={handleSaveNotes}
              >
                Save Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
