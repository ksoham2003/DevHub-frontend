'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import ProjectCard from '@/components/cards/ProjectCard';
import BlogCard from '@/components/cards/BlogCard';
import DeveloperCard from '@/components/cards/DeveloperCard';
import TerminalPrompt from '@/components/ui/TerminalPrompt';
import LoadingGrid from '@/components/ui/LoadingGrid';

function SearchContent() {
  const searchParams         = useSearchParams();
  const router               = useRouter();
  const { results, loading, type, setType, total, doSearch } = useSearch();
  const [query, setQuery]    = useState(searchParams.get('q') || '');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) { setQuery(q); doSearch(q, type); }
  }, [searchParams, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const q = searchParams.get('q');

  return (
    <div className="pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="py-6">
          <TerminalPrompt command={`grep -r '${q || '...'}' --recursive`} />
          <h1 className="text-2xl font-bold text-[#00ff41] mb-5">/search</h1>

          <form onSubmit={handleSubmit}>
            <div className="relative max-w-2xl">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#005a14] text-sm font-bold">$</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full !pl-8"
                placeholder="grep -r 'search query'..."
              />
            </div>
          </form>
        </div>

        {/* Type filter */}
        <div className="flex gap-2 mb-8">
          {['all','projects','blogs','users'].map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`px-4 py-2 text-sm border transition-all ${type === t ? 'border-[#00ff41] text-[#00ff41] bg-[#003d10]/20' : 'border-[#003d10] text-[#005a14] hover:border-[#00ff41] hover:text-[#00ff41]'}`}>
              --type={t}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingGrid count={6} cols={3} height="h-36" />
        ) : q && total === 0 ? (
          <div className="text-center py-20 border border-[#003d10]">
            <p className="text-sm text-[#005a14]">$ grep -r &apos;{q}&apos;</p>
            <p className="text-sm text-[#003d10] mt-3">0 matches found.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {results.users?.length > 0 && (type === 'all' || type === 'users') && (
              <section>
                <div className="text-sm text-[#005a14] mb-4">{'/* DEVELOPERS ('}{results.usersTotal}{') */'}</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {results.users.map((u) => <DeveloperCard key={u._id} user={u} />)}
                </div>
              </section>
            )}
            {results.projects?.length > 0 && (type === 'all' || type === 'projects') && (
              <section>
                <div className="text-sm text-[#005a14] mb-4">{'/* PROJECTS ('}{results.projectsTotal}{') */'}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {results.projects.map((p) => <ProjectCard key={p._id} project={p} />)}
                </div>
              </section>
            )}
            {results.blogs?.length > 0 && (type === 'all' || type === 'blogs') && (
              <section>
                <div className="text-sm text-[#005a14] mb-4">{'/* ARTICLES ('}{results.blogsTotal}{') */'}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {results.blogs.map((b) => <BlogCard key={b._id} blog={b} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-sm text-[#003d10] cursor-blink">loading search</span>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
