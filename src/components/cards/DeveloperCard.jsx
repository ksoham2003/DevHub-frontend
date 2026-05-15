'use client';
import Link from 'next/link';
export default function DeveloperCard({ user: dev }) {
  return (
    <div className="border border-[#003d10] hover:border-[#00ff41] transition-all fade-in bg-black p-6">
      <Link href={`/profile/${dev.username}`} className="block group">
        <div className="text-center mb-3">
          {dev.avatar ? (
            <img src={dev.avatar} alt="" className="w-14 h-14 mx-auto object-cover border border-[#003d10] group-hover:border-[#00ff41]" />
          ) : (
            <div className="w-14 h-14 mx-auto border border-[#003d10] group-hover:border-[#00ff41] flex items-center justify-center text-xl text-[#005a14] group-hover:text-[#00ff41] font-bold transition-colors">
              [{dev.name?.charAt(0) || '?'}]
            </div>
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-[#00ff41] group-hover:text-[#33ff66] transition-colors truncate">{dev.name}</p>
          <p className="text-xs text-[#003d10]">@{dev.username}</p>
        </div>
      </Link>
      {dev.title && <p className="text-xs text-[#005a14] mt-2 text-center truncate">{dev.title}</p>}
      {dev.skills?.length > 0 && (
        <div className="text-center mt-2 text-xs text-[#003d10]">
          {dev.skills.slice(0, 3).join(' · ')}
        </div>
      )}
      <div className="text-center mt-3 text-xs text-[#003d10] border-t border-[#003d10] pt-3">
        {dev.followersCount || 0} followers
      </div>
    </div>
  );
}
