'use client';
import { useBlogs } from '@/hooks/useBlogs';
import BlogCard from '@/components/cards/BlogCard';
import LoadingGrid from '@/components/ui/LoadingGrid';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import TerminalPrompt from '@/components/ui/TerminalPrompt';
import FilterChips from '@/components/ui/FilterChips';
const CATEGORIES = ['All','Tutorial','Guide','Opinion','News','Project Update','Career','Other'];
export default function BlogsPage() {
  const { blogs, pagination, loading, page, setPage, sort, changeSort, category, changeCategory } = useBlogs();
  return (
    <div className="pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="py-6">
          <TerminalPrompt command={`ls /blogs --category=${category.toLowerCase()}`} />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-[#00ff41]">/blogs</h1>
            <select value={sort} onChange={(e) => changeSort(e.target.value)} className="!px-4 !py-2 !text-sm">
              <option value="latest">--sort=latest</option>
              <option value="popular">--sort=popular</option>
            </select>
          </div>
        </div>
        <div className="mb-8">
          <FilterChips
            options={CATEGORIES}
            active={category}
            onToggle={changeCategory}
            single
          />
        </div>
        {loading ? (
          <LoadingGrid count={6} cols={3} height="h-48" />
        ) : blogs.length === 0 ? (
          <EmptyState command="$ find /blogs -type f" message="0 results found." />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {blogs.map((b) => <BlogCard key={b._id} blog={b} />)}
            </div>
            <Pagination page={page} pages={pagination.pages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
