'use client';
export default function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;
  return (
    <div className="flex justify-center gap-2 mt-10">
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`w-10 h-10 text-sm border transition-all ${
            page === i + 1
              ? 'border-[#00ff41] text-[#00ff41] bg-[#003d10]/20'
              : 'border-[#003d10] text-[#005a14] hover:border-[#00ff41] hover:text-[#00ff41]'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
