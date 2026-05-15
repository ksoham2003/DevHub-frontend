'use client';
export default function LoadingGrid({ count = 6, cols = 3, height = 'h-52' }) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  }[cols] || 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
  return (
    <div className={`grid ${gridClass} gap-4`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={`border border-[#003d10] ${height} flex items-center justify-center`}>
          <span className="text-sm text-[#003d10] cursor-blink">loading</span>
        </div>
      ))}
    </div>
  );
}
