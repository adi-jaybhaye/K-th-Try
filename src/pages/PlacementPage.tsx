import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  CheckCircle,
  BookOpen,
  Database,
  Cpu,
  Globe,
  Brain,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { repository } from '../services/repository';
import { PlacementChecklistItem } from '../types/userData';

export const PlacementPage: React.FC = () => {
  const [tasks, setTasks] = useState<PlacementChecklistItem[]>([]);
  const [activeTab, setActiveTab] = useState<'fundamentals' | 'tracks' | 'behavioral'>('fundamentals');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    repository.getPlacementTasks().then(setTasks);
  }, []);

  const handleToggle = async (taskId: string, current: boolean) => {
    await repository.togglePlacementTask(taskId, !current);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !current } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const categories = [
    { id: 'all', label: 'All Subjects', icon: BookOpen },
    { id: 'oop', label: 'OOP & Java', icon: Cpu },
    { id: 'dbms', label: 'DBMS & SQL', icon: Database },
    { id: 'os', label: 'Operating Systems', icon: Cpu },
    { id: 'cn', label: 'Computer Networks', icon: Globe },
    { id: 'aptitude', label: 'Aptitude & Math', icon: Brain },
    { id: 'behavioral', label: 'Behavioral & STAR', icon: MessageSquare },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#F0EAE8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#AE445A] mb-1">
            <span>Beyond DSA</span>
            <span>·</span>
            <span>Comprehensive Placement Readiness</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1D1A39]">
            Placement Preparation
          </h1>
          <p className="text-xs sm:text-sm text-[#7E6C7C] mt-1 max-w-2xl">
            Core computer science subjects, database internals, behavioral interview frameworks, and target role profiles.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-[#FFFDFC] border border-[#E2D6D4] p-3.5 rounded-2xl shrink-0 w-full sm:w-64">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#1D1A39]">Subject Readiness</span>
            <span className="font-mono font-bold text-[#451952]">{pct}% Completed</span>
          </div>
          <ProgressBar value={completedCount} max={totalCount} color="bg-[#451952]" size="sm" />
        </div>
      </div>

      {/* TOP LEVEL NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F6] border border-[#F0EAE8] rounded-xl text-xs font-semibold w-fit">
        <button
          onClick={() => setActiveTab('fundamentals')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'fundamentals' ? 'bg-white text-[#1D1A39] shadow-xs' : 'text-[#7E6C7C]'
          }`}
        >
          CS Fundamentals &amp; Core Subjects
        </button>
        <button
          onClick={() => setActiveTab('tracks')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'tracks' ? 'bg-white text-[#1D1A39] shadow-xs' : 'text-[#7E6C7C]'
          }`}
        >
          Target Role Preparation Profiles
        </button>
      </div>

      {activeTab === 'fundamentals' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === c.id
                      ? 'bg-[#1D1A39] text-white shadow-xs'
                      : 'bg-[#FAF7F6] border border-[#E2D6D4] text-[#574459] hover:bg-[#F3ECE9]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>

          {/* Checklist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((t) => (
              <label
                key={t.id}
                className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                  t.isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20 text-emerald-950'
                    : 'border-[#F0EAE8] bg-[#FFFDFC] hover:border-[#E2D6D4]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={t.isCompleted}
                  onChange={() => handleToggle(t.id, t.isCompleted)}
                  className="w-4 h-4 rounded text-[#451952] focus:ring-[#451952] mt-0.5 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#AE445A]">
                      {t.category.toUpperCase()}
                    </span>
                    {t.isCompleted && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Done
                      </span>
                    )}
                  </div>
                  <h4 className={`text-xs font-semibold ${t.isCompleted ? 'line-through text-[#7E6C7C]' : 'text-[#1D1A39]'}`}>
                    {t.taskName}
                  </h4>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* TRACKS / PROFILES */}
      {activeTab === 'tracks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Product / High-Growth Software Roles',
              subtitle: 'Focus: Clean Architecture, System Design basics, O(N) optimizations',
              topics: [
                'Solid grasp of Trees, Graphs (Dijkstra/DSU), and Dynamic Programming',
                'Deep understanding of HashMap bucket internals and Concurrency',
                'Ability to articulate trade-offs aloud and handle ambiguous edge-case requirements',
                'System design awareness: Caching (Redis), Load Balancing, and Database Indexing',
              ],
            },
            {
              title: 'General Campus Recruitment & On-Campus Drives',
              subtitle: 'Focus: Aptitude Speed, Core Java, Relational SQL, and Speed OA',
              topics: [
                'Arrays, Two Pointers, Strings, and Sliding Window mastery',
                'Speed in solving 2 medium problems within 45 minutes on HackerEarth/Mettl',
                'SQL Joins, Group By, Subqueries, and ACID properties',
                'Polished behavioral answers using the STAR method',
              ],
            },
            {
              title: 'Fintech & Banking Technology Systems',
              subtitle: 'Focus: Precision Arithmetic, Concurrency, Low-Latency principles',
              topics: [
                'Handling financial precision without float/double rounding errors (BigDecimal / long)',
                'Transaction Isolation Levels (Read Committed vs Serializable)',
                'Message Queues (Kafka) and idempotent operations',
                'Strong discrete math and modular arithmetic foundations',
              ],
            },
            {
              title: 'Enterprise Software & SaaS Consulting',
              subtitle: 'Focus: OOP Patterns, REST APIs, Security, and Code Maintainability',
              topics: [
                'Design Patterns: Factory, Singleton, Strategy, Observer',
                'HTTP Status Codes, REST idempotent methods (PUT vs POST vs PATCH)',
                'Unit Testing mindset (boundary coverage and mock dependencies)',
                'Database normalization and foreign key integrity',
              ],
            },
          ].map((track, i) => (
            <Card key={i} className="p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#AE445A] block mb-1">
                Preparation Profile
              </span>
              <h3 className="font-display font-bold text-lg text-[#1D1A39] mb-1">{track.title}</h3>
              <p className="text-xs text-[#7E6C7C] mb-4">{track.subtitle}</p>

              <div className="space-y-2 pt-2 border-t border-[#F0EAE8]">
                {track.topics.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#1D1A39]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#451952] shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
