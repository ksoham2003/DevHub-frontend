'use client';

/**
 * FilterChips — a row of toggleable filter buttons
 * Props: options (string[]), active (string[]), onToggle, single (bool — single select mode)
 */
export default function FilterChips({ options, active = [], onToggle, single = false }) {
  const isActive = (opt) =>
    single ? active === opt : active.includes(opt);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onToggle(opt)}
          className={`px-3 py-1.5 text-sm border transition-all ${
            isActive(opt)
              ? 'border-[#00ff41] text-[#00ff41] bg-[#003d10]/20'
              : 'border-[#003d10] text-[#005a14] hover:border-[#00ff41] hover:text-[#00ff41]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
