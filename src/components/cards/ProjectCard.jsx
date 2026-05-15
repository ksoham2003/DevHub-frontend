'use client';
import Link from 'next/link';
export default function ProjectCard({ project }) {
  const { _id, title, description, techStack, author, likesCount, commentsCount, githubUrl, liveUrl } = project;
  return (
    <div className="border border-[#003d10] hover:border-[#00ff41] transition-all fade-in bg-black p-6 group">
      <div className="flex items-center gap-2 mb-3 text-xs text-[#005a14] border-b border-[#003d10] pb-3">
        <span>┌──</span>
        <span className="text-[#003d10]">[</span>
        <span className="text-[#00ff41]">PROJECT</span>
        <span className="text-[#003d10]">]</span>
        <span className="flex-1 text-[#003d10] overflow-hidden whitespace-nowrap">{'─'.repeat(50)}</span>
      </div>
      <Link href={`/projects/${_id}`} className="block text-base font-bold text-[#00ff41] hover:text-[#33ff66] transition-colors mb-2 truncate">
        <span className="text-[#005a14]">$ </span>cat {title}
      </Link>
      <p className="text-sm text-[#00cc33] leading-relaxed line-clamp-2 mb-4 pl-4">{description}</p>
      {techStack?.length > 0 && (
        <div className="mb-4 text-sm">
          <span className="text-[#005a14]">STACK: </span>
          <span className="text-[#00cc33]">
            {techStack.slice(0, 4).join(' | ')}
            {techStack.length > 4 && <span className="text-[#005a14]"> +{techStack.length - 4}</span>}
          </span>
        </div>
      )}
      <div className="flex items-center gap-4 mb-3 text-sm">
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noreferrer" className="text-[#005a14] hover:text-[#00ff41] transition-colors">
            [github]
          </a>
        )}
        {liveUrl && (
          <a href={liveUrl} target="_blank" rel="noreferrer" className="text-[#005a14] hover:text-[#00ff41] transition-colors">
            [live]
          </a>
        )}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[#003d10] text-sm">
        <Link href={`/profile/${author?.username}`} className="text-[#005a14] hover:text-[#00ff41] transition-colors">
          {author?.username ? `${author.username}@devhub` : 'anonymous'}
        </Link>
        <div className="flex items-center gap-4 text-[#003d10]">
          <span>♥ {likesCount || 0}</span>
          <span>◆ {commentsCount || 0}</span>
        </div>
      </div>
    </div>
  );
}
