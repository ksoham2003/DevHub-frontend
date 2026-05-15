'use client';
export default function TerminalBox({ title, children, className = '' }) {
  return (
    <div className={`border border-[#003d10] hover:border-[#00ff41] transition-all ${className}`}
      style={{ boxShadow: '0 0 20px rgba(0,255,65,0.05)' }}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#003d10] text-xs text-[#005a14]">
        <span className="text-[#003d10]">●</span>
        <span>{title}</span>
        <span className="flex-1" />
        <span className="text-[#003d10]">[─][□][×]</span>
      </div>
      {children}
    </div>
  );
}
