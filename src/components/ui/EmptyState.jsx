'use client';
export default function EmptyState({ command = '$ find . -type f', message = '0 results found.' }) {
  return (
    <div className="text-center py-20 border border-[#003d10]">
      <p className="text-sm text-[#005a14]">{command}</p>
      <p className="text-sm text-[#003d10] mt-3">{message}</p>
    </div>
  );
}
