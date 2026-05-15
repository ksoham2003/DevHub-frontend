'use client';
import Link from 'next/link';
function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60)     return 'now';
  if (s < 3600)   return `${Math.floor(s / 60)}m`;
  if (s < 86400)  return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
export default function BlogCard({ blog }) {
  const { title, slug, excerpt, tags, author, likesCount, views, commentsCount, createdAt, category } = blog;
  return (
    <div className="border border-[#003d10] hover:border-[#00ff41] transition-all fade-in bg-black p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-3 text-xs text-[#005a14] border-b border-[#003d10] pb-3">
        <span>┌──</span>
        <span className="text-[#003d10]">[</span>
        <span className="text-[#00ff41]">{category || 'BLOG'}</span>
        <span className="text-[#003d10]">]</span>
        <span className="flex-1" />
        <span className="text-[#003d10]">{timeAgo(createdAt)}</span>
      </div>
      <Link href={`/blogs/${slug}`} className="block text-base font-bold text-[#00ff41] hover:text-[#33ff66] transition-colors mb-2 line-clamp-2">
        <span className="text-[#005a14]">$ </span>less {title}
      </Link>
      <p className="text-sm text-[#00cc33] leading-relaxed line-clamp-2 flex-1 mb-4 pl-4">{excerpt}</p>
      {tags?.length > 0 && (
        <div className="mb-4 text-sm">
          <span className="text-[#005a14]">TAGS: </span>
          <span className="text-[#00cc33]">{tags.slice(0, 3).join(' | ')}</span>
        </div>
      )}
      <div className="flex items-center justify-between pt-3 border-t border-[#003d10] text-sm">
        <Link href={`/profile/${author?.username}`} className="text-[#005a14] hover:text-[#00ff41] transition-colors">
          {author?.username ? `${author.username}@devhub` : 'anonymous'}
        </Link>
        <div className="flex items-center gap-4 text-[#003d10]">
          <span>♥ {likesCount || 0}</span>
          <span>◉ {views || 0}</span>
          <span>◆ {commentsCount || 0}</span>
        </div>
      </div>
    </div>
  );
}
