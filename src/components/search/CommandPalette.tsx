import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, CheckCircle, Code, ExternalLink, X, ArrowRight } from 'lucide-react';
import { curriculumModules } from '../../data/curriculumData';
import { javaEssentialsData } from '../../data/javaEssentialsData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // open triggered from parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Filter modules
  const matchingModules = curriculumModules.filter(
    (m) =>
      m.title.toLowerCase().includes(trimmed) ||
      m.subtitle.toLowerCase().includes(trimmed) ||
      m.slug.toLowerCase().includes(trimmed)
  );

  // Filter subtopics
  const matchingSubtopics = curriculumModules.flatMap((m) =>
    m.subtopics
      .filter((s) => s.title.toLowerCase().includes(trimmed) || s.description.toLowerCase().includes(trimmed))
      .map((s) => ({ ...s, moduleSlug: m.slug, moduleTitle: m.title }))
  );

  // Filter problems
  const matchingProblems = curriculumModules.flatMap((m) =>
    m.practiceProblems
      .filter((p) => p.title.toLowerCase().includes(trimmed) || p.pattern.toLowerCase().includes(trimmed))
      .map((p) => ({ ...p, moduleSlug: m.slug, moduleTitle: m.title }))
  );

  // Filter Java essentials
  const matchingJava = javaEssentialsData.filter(
    (j) => j.title.toLowerCase().includes(trimmed) || j.category.toLowerCase().includes(trimmed)
  );

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-[#1D1A39]/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl border border-[#F0EAE8] shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#F0EAE8] bg-[#FFFDFC]">
          <Search className="w-5 h-5 text-[#AE445A] shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, problems, patterns, or Java essentials... (Esc to exit)"
            className="w-full bg-transparent text-[#1D1A39] placeholder:text-[#A89CA8] text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#7E6C7C] hover:bg-[#FAF7F6] text-xs font-mono border border-[#E2D6D4] px-1.5 ml-2"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4 grow">
          {trimmed.length === 0 ? (
            <div className="p-4 text-xs text-[#7E6C7C]">
              <p className="font-semibold text-[#1D1A39] mb-2">Quick Navigation</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelect('/roadmap')}
                  className="p-2.5 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC] text-left hover:border-[#E2D6D4] flex items-center justify-between"
                >
                  <span className="font-medium text-[#1D1A39]">Complete Roadmap</span>
                  <ArrowRight className="w-4 h-4 text-[#7E6C7C]" />
                </button>
                <button
                  onClick={() => handleSelect('/practice')}
                  className="p-2.5 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC] text-left hover:border-[#E2D6D4] flex items-center justify-between"
                >
                  <span className="font-medium text-[#1D1A39]">Practice Tracker</span>
                  <ArrowRight className="w-4 h-4 text-[#7E6C7C]" />
                </button>
                <button
                  onClick={() => handleSelect('/timeline')}
                  className="p-2.5 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC] text-left hover:border-[#E2D6D4] flex items-center justify-between"
                >
                  <span className="font-medium text-[#1D1A39]">My Timeline</span>
                  <ArrowRight className="w-4 h-4 text-[#7E6C7C]" />
                </button>
                <button
                  onClick={() => handleSelect('/revision')}
                  className="p-2.5 rounded-xl border border-[#F0EAE8] bg-[#FFFDFC] text-left hover:border-[#E2D6D4] flex items-center justify-between"
                >
                  <span className="font-medium text-[#1D1A39]">Revision Centre</span>
                  <ArrowRight className="w-4 h-4 text-[#7E6C7C]" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Modules Matches */}
              {matchingModules.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#AE445A] px-2 mb-1.5">
                    Curriculum Modules ({matchingModules.length})
                  </p>
                  <div className="space-y-1">
                    {matchingModules.slice(0, 4).map((mod) => (
                      <div
                        key={mod.id}
                        onClick={() => handleSelect(`/roadmap/${mod.slug}`)}
                        className="p-2.5 rounded-xl hover:bg-[#FAF7F6] cursor-pointer flex items-center justify-between border border-transparent hover:border-[#F0EAE8] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-[#451952] shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-[#1D1A39]">
                              Module {mod.moduleNumber}: {mod.title}
                            </p>
                            <p className="text-xs text-[#7E6C7C] line-clamp-1">{mod.subtitle}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-[#451952]/10 text-[#451952]">
                          {mod.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Practice Problems Matches */}
              {matchingProblems.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#AE445A] px-2 mb-1.5">
                    Practice Problems ({matchingProblems.length})
                  </p>
                  <div className="space-y-1">
                    {matchingProblems.slice(0, 5).map((prob) => (
                      <div
                        key={prob.id}
                        onClick={() => handleSelect(`/roadmap/${prob.moduleSlug}`)}
                        className="p-2.5 rounded-xl hover:bg-[#FAF7F6] cursor-pointer flex items-center justify-between border border-transparent hover:border-[#F0EAE8] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Code className="w-4 h-4 text-[#1D1A39] shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-[#1D1A39]">{prob.title}</p>
                            <p className="text-xs text-[#7E6C7C]">
                              {prob.platform} · Pattern: {prob.pattern} · In: {prob.moduleTitle}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            prob.difficulty === 'Easy'
                              ? 'bg-emerald-50 text-emerald-800'
                              : prob.difficulty === 'Medium'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-rose-50 text-rose-800'
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtopic Matches */}
              {matchingSubtopics.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#AE445A] px-2 mb-1.5">
                    Subtopics &amp; Checklists ({matchingSubtopics.length})
                  </p>
                  <div className="space-y-1">
                    {matchingSubtopics.slice(0, 4).map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => handleSelect(`/roadmap/${sub.moduleSlug}`)}
                        className="p-2.5 rounded-xl hover:bg-[#FAF7F6] cursor-pointer flex items-center justify-between border border-transparent hover:border-[#F0EAE8] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-[#1D1A39]">{sub.title}</p>
                            <p className="text-xs text-[#7E6C7C]">{sub.moduleTitle}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingModules.length === 0 && matchingProblems.length === 0 && matchingSubtopics.length === 0 && (
                <div className="p-8 text-center text-[#7E6C7C]">
                  <p className="text-sm font-medium text-[#1D1A39]">No results found for "{query}"</p>
                  <p className="text-xs mt-1">Try searching by topic, platform, or algorithmic technique.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
