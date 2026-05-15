'use client';
import { useDevelopers } from '@/hooks/useDevelopers';
import DeveloperCard from '@/components/cards/DeveloperCard';
import LoadingGrid from '@/components/ui/LoadingGrid';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import TerminalPrompt from '@/components/ui/TerminalPrompt';
import FilterChips from '@/components/ui/FilterChips';
const SKILLS = ['React','Node.js','Python','TypeScript','Next.js','MongoDB','PostgreSQL','Vue.js','Angular','Django','Go','Rust','Docker','AWS'];
export default function DevelopersPage() {
  const { devs, pagination, loading, page, setPage, skillFilter, toggleSkill } = useDevelopers();
  return (
    <div className="pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="py-6">
          <TerminalPrompt command="who --list" />
          <h1 className="text-2xl font-bold text-[#00ff41]">/developers</h1>
        </div>
        <div className="mb-8">
          <FilterChips options={SKILLS} active={skillFilter} onToggle={toggleSkill} />
        </div>
        {loading ? (
          <LoadingGrid count={12} cols={6} height="h-44" />
        ) : devs.length === 0 ? (
          <EmptyState command="$ who --list" message="0 users found." />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {devs.map((d) => <DeveloperCard key={d._id} user={d} />)}
            </div>
            <Pagination page={page} pages={pagination.pages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
