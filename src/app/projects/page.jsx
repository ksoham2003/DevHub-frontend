'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProjects } from '@/hooks/useProjects';
import ProjectCard from '@/components/cards/ProjectCard';
import LoadingGrid from '@/components/ui/LoadingGrid';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import TerminalPrompt from '@/components/ui/TerminalPrompt';
import FilterChips from '@/components/ui/FilterChips';

const TECH_OPTIONS = ['React','Node.js','Python','TypeScript','Next.js','MongoDB','PostgreSQL','TailwindCSS','Express','Vue.js','Angular','Django','Flask','Go','Rust','Docker'];

export default function ProjectsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const {
    projects, pagination, loading,
    page, setPage,
    sort, changeSort,
    techFilter, toggleTech, clearTech,
  } = useProjects();

  return (
    <div className="pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="py-6">
          <TerminalPrompt command={`ls /projects ${sort === 'popular' ? '--sort=popular' : '--sort=latest'}`} />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-[#00ff41]">/projects</h1>
            <div className="flex items-center gap-3 text-sm">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border transition-all ${showFilters ? 'border-[#00ff41] text-[#00ff41]' : 'border-[#003d10] text-[#005a14] hover:border-[#00ff41] hover:text-[#00ff41]'}`}
              >
                [filter] {techFilter.length > 0 && `(${techFilter.length})`}
              </button>
              <select value={sort} onChange={(e) => changeSort(e.target.value)} className="!px-4 !py-2 !text-sm">
                <option value="latest">--sort=latest</option>
                <option value="popular">--sort=popular</option>
              </select>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="border border-[#003d10] p-5 mb-6 fade-in">
            <p className="text-sm text-[#005a14] mb-3">$ grep --tech-stack:</p>
            <FilterChips options={TECH_OPTIONS} active={techFilter} onToggle={toggleTech} />
            {techFilter.length > 0 && (
              <button onClick={clearTech} className="text-sm text-[#ff0040] mt-3 hover:underline">[clear all]</button>
            )}
          </div>
        )}

        {loading ? (
          <LoadingGrid count={6} cols={3} height="h-52" />
        ) : projects.length === 0 ? (
          <EmptyState command="$ find /projects -type f" message="0 results found. Try adjusting filters or be the first to share." />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
            </div>
            <Pagination page={page} pages={pagination.pages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
