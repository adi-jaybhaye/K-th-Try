import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
  Code,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, PriorityLevel } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { curriculumModules } from '../data/curriculumData';
import { javaEssentialsData } from '../data/javaEssentialsData';
import { repository } from '../services/repository';
import { TopicProgress } from '../types/userData';

export const RoadmapPage: React.FC = () => {
  const [filterPriority, setFilterPriority] = useState<PriorityLevel | 'ALL'>('ALL');
  const [topicProgress, setTopicProgress] = useState<Record<string, TopicProgress>>({});
  const [activeTab, setActiveTab] = useState<'modules' | 'java-essentials'>('modules');

  useEffect(() => {
    repository.getAllTopicProgress().then(setTopicProgress);
  }, []);

  const filteredModules = curriculumModules.filter((m) => {
    if (filterPriority === 'ALL') return true;
    return m.priority === filterPriority;
  });

  const totalModules = curriculumModules.length;
  const completedCount = Object.values(topicProgress).filter((t) => t.isCompleted).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#F0EAE8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#AE445A] mb-1">
            <span>Structured DSA Syllabus</span>
            <span>·</span>
            <span>All 16 Modules</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1D1A39]">
            Complete Algorithm Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-[#574459] mt-1 max-w-2xl">
            From asymptotic complexity to advanced graph cuts. Each module includes written lessons, Java implementation templates, verified reference resources, and practice problems.
          </p>
        </div>

        {/* Overall Completion Indicator */}
        <div className="bg-[#FFFDFC] border border-[#E2D6D4] p-3.5 rounded-2xl shrink-0 w-full md:w-64">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#1D1A39]">Curriculum Progress</span>
            <span className="font-mono font-bold text-[#451952]">
              {completedCount}/{totalModules} Mastered
            </span>
          </div>
          <ProgressBar value={completedCount} max={totalModules} color="bg-[#451952]" size="sm" />
        </div>
      </div>

      {/* VIEW TABS: 16 MODULES VS JAVA ESSENTIALS */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 p-1 bg-[#FAF7F6] border border-[#F0EAE8] rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'modules'
                ? 'bg-white text-[#1D1A39] shadow-xs'
                : 'text-[#7E6C7C] hover:text-[#1D1A39]'
            }`}
          >
            DSA Curriculum (16 Modules)
          </button>
          <button
            onClick={() => setActiveTab('java-essentials')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'java-essentials'
                ? 'bg-white text-[#1D1A39] shadow-xs'
                : 'text-[#7E6C7C] hover:text-[#1D1A39]'
            }`}
          >
            Java Essentials Track ({javaEssentialsData.length} Guides)
          </button>
        </div>

        {/* Priority Filter (Only on modules view) */}
        {activeTab === 'modules' && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#7E6C7C] font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Priority:
            </span>
            {(['ALL', 'CORE', 'HIGH VALUE', 'STRETCH'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  filterPriority === p
                    ? 'bg-[#1D1A39] text-white shadow-xs'
                    : 'bg-[#FAF7F6] border border-[#E2D6D4] text-[#574459] hover:bg-[#F3ECE9]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MODULES LIST VIEW */}
      {activeTab === 'modules' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModules.map((mod) => {
            const isCompleted = topicProgress[mod.id]?.isCompleted || false;

            return (
              <Card
                key={mod.id}
                className={`flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden ${
                  isCompleted ? 'border-emerald-300 bg-emerald-50/20' : 'bg-white'
                }`}
              >
                {isCompleted && (
                  <div className="absolute top-3 right-3 text-emerald-600 flex items-center gap-1 text-[11px] font-semibold bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Mastered
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-[#AE445A]">
                      Module {mod.moduleNumber}
                    </span>
                    <Badge priority={mod.priority} size="xs" />
                  </div>
                  <CardTitle className="text-lg">
                    <Link to={`/roadmap/${mod.slug}`} className="hover:text-[#451952] transition-colors">
                      {mod.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {mod.subtitle}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="p-2.5 rounded-xl bg-[#FAF7F6] border border-[#F0EAE8] text-xs text-[#574459] space-y-1">
                    <div className="flex justify-between">
                      <span>Subtopics:</span>
                      <span className="font-semibold text-[#1D1A39]">{mod.subtopics.length} Sections</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Practice Problems:</span>
                      <span className="font-semibold text-[#1D1A39]">{mod.practiceProblems.length} Curated</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Hours:</span>
                      <span className="font-semibold text-[#1D1A39]">~{mod.estimatedHours} hrs</span>
                    </div>
                  </div>

                  {/* Prerequisites indicator if any */}
                  {mod.prerequisites.length > 0 && (
                    <div className="text-[11px] text-[#7E6C7C]">
                      <span className="font-semibold text-[#574459]">Requires: </span>
                      {mod.prerequisites.map((p) => p.replace('m', 'M')).join(', ')}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <Link to={`/roadmap/${mod.slug}`} className="w-full">
                      <Button variant="secondary" size="sm" className="w-full justify-between" icon={<ChevronRight className="w-4 h-4 text-[#7E6C7C]" />} iconPosition="right">
                        <span>Open Study Guide</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* JAVA ESSENTIALS TRACK VIEW */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#F0EAE8]">
            <h3 className="font-display font-bold text-base text-[#1D1A39]">
              Java Implementation Mechanics for Technical Interviews
            </h3>
            <p className="text-xs text-[#7E6C7C] mt-1">
              Avoid silent integer overflows, String object garbage thrashing, legacy Stack synchronization overhead, and comparator subtraction bugs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {javaEssentialsData.map((item) => (
              <Card key={item.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#AE445A]">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-base text-[#1D1A39] mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#574459] mb-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 mb-3">
                    {item.keyRules.slice(0, 3).map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#1D1A39]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#451952] shrink-0 mt-1.5" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>

                  {/* Code snippet */}
                  <div className="rounded-xl bg-[#1D1A39] text-[#FFFDFC] p-3 font-mono text-[11px] overflow-x-auto">
                    <pre>{item.codeExample}</pre>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EAE8] text-[11px] text-[#7E6C7C]">
                  <strong className="text-[#AE445A]">Interview Tip: </strong>
                  <span>{item.interviewTip}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
