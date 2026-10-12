import React, { useState } from 'react';
import {
  BookMarked,
  Search,
  ExternalLink,
  Filter,
  CheckCircle,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { curriculumModules } from '../data/curriculumData';
import { ResourceItem } from '../types/curriculum';

export const ResourcesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('ALL');
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kthtry_saved_resources');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Extract all resources from modules + add official company guidance resources
  const officialGuides: ResourceItem[] = [
    {
      id: 'res-msft-guide',
      title: 'Microsoft Technical Interviewing: Official Preparation Guide',
      provider: 'Microsoft Careers',
      url: 'https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing',
      type: 'documentation',
      access: 'free',
      order: 1,
      verified: true,
      notes: 'Clarify ambiguity, think aloud, discuss trade-offs and alternative approaches.',
    },
    {
      id: 'res-amazon-sde',
      title: 'Amazon Software Development Interview Topics & Leadership Principles',
      provider: 'Amazon Jobs',
      url: 'https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics',
      type: 'documentation',
      access: 'free',
      order: 2,
      verified: true,
      notes: 'Focus on clean code, edge cases, space/time complexity, and customer obsession.',
    },
    {
      id: 'res-codechef-roadmap',
      title: 'CodeChef DSA & Problem Solving Roadmaps',
      provider: 'CodeChef',
      url: 'https://www.codechef.com/roadmaps',
      type: 'roadmap',
      access: 'free',
      order: 3,
      verified: true,
    },
    {
      id: 'res-opendsa',
      title: 'OpenDSA Server e-Textbook Interactive Data Structures',
      provider: 'OpenDSA',
      url: 'https://opendsa-server.cs.vt.edu/',
      type: 'interactive',
      access: 'free',
      order: 4,
      verified: true,
    },
  ];

  const allResources: ResourceItem[] = [
    ...officialGuides,
    ...curriculumModules.flatMap((m) => m.resources),
  ];

  const providers = ['ALL', ...Array.from(new Set(allResources.map((r) => r.provider)))];

  const filteredResources = allResources.filter((r) => {
    if (selectedProvider !== 'ALL' && r.provider !== selectedProvider) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.provider.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const toggleBookmark = (id: string) => {
    setSavedResourceIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('kthtry_saved_resources', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="pb-4 border-b border-[#F0EAE8]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#AE445A] mb-1">
          <span>Curated Knowledge Base</span>
          <span>·</span>
          <span>Reputable &amp; Verified Only</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1D1A39]">
          Learning Resource Library
        </h1>
        <p className="text-xs sm:text-sm text-[#7E6C7C] mt-1 max-w-3xl">
          Direct, verified reference starting points from Striver A2Z, LeetCode, VisuAlgo, Oracle Java documentation, and official Microsoft &amp; Amazon technical interview guides.
        </p>
      </div>

      {/* SEARCH & PROVIDER FILTERS */}
      <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#F0EAE8] flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#7E6C7C] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search guides, providers, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E2D6D4] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#1D1A39] focus:outline-none focus:ring-2 focus:ring-[#451952]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
          <span className="text-[#7E6C7C] mr-1">Provider:</span>
          {providers.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedProvider(p)}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedProvider === p
                  ? 'bg-[#1D1A39] text-white'
                  : 'bg-[#FAF7F6] border border-[#E2D6D4] text-[#574459] hover:bg-[#F3ECE9]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* RESOURCE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((res) => {
          const isBookmarked = savedResourceIds.includes(res.id);

          return (
            <Card key={res.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#AE445A]">{res.provider}</span>
                  <div className="flex items-center gap-2">
                    {res.verified && (
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                    <button
                      onClick={() => toggleBookmark(res.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        isBookmarked ? 'text-[#F39F5A]' : 'text-[#A89CA8] hover:text-[#1D1A39]'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <h3 className="font-display font-bold text-base text-[#1D1A39] mb-1.5">
                  {res.title}
                </h3>

                {res.notes && (
                  <p className="text-xs text-[#574459] bg-[#FAF7F6] p-2.5 rounded-xl border border-[#F0EAE8] mb-3">
                    {res.notes}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-[#7E6C7C]">
                  <span className="capitalize">{res.type}</span>
                  <span>·</span>
                  <span className="capitalize">{res.access.replace('-', ' ')}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#F0EAE8] flex items-center justify-between">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#451952] hover:underline"
                >
                  <span>Open Official Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
