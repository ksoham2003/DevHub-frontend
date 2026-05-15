'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { useAuth } from '@/context/AuthContext';
import { useBlog } from '@/hooks/useBlogs';
import { toggleBlogLike, deleteBlog } from '@/lib/api';
import CommentSection from '@/components/features/CommentSection';
import TerminalBox from '@/components/ui/TerminalBox';
import toast from 'react-hot-toast';
export default function BlogDetailPage() {
  const { slug }   = useParams();
  const { user }   = useAuth();
  const router     = useRouter();
  const { blog, loading, liked, setLiked, likesCount, setLikesCount, load } = useBlog(slug);
  useEffect(() => { load(user?._id); }, [slug, user?._id]);
  const handleLike = async () => {
    if (!user) { toast.error('ERR: Login required'); return; }
    try {
      const res = await toggleBlogLike(blog._id);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch { toast.error('ERR: Failed'); }
  };
  const handleDelete = async () => {
    if (!confirm('$ rm blog? Irreversible.')) return;
    try {
      await deleteBlog(blog._id);
      toast.success('Blog removed');
      router.push('/blogs');
    } catch { toast.error('ERR: Failed'); }
  };
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-sm text-[#003d10] cursor-blink">loading article</span>
    </div>
  );
  if (!blog) return null;
  const isOwner = user?._id === blog.author?._id;
  const dateStr = new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="pb-12 px-6">
      <div className="max-w-4xl mx-auto fade-in">
        <div className="py-4 text-sm text-[#005a14]">
          <button onClick={() => router.back()} className="hover:text-[#00ff41]">
            <span className="text-[#00ff41]">root@devhub</span>:~$ cd ..
          </button>
        </div>
        <TerminalBox title={`less /blogs/${slug}`}>
          <div className="p-10">
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-[#005a14]">
              {blog.category && <span className="border border-[#003d10] px-3 py-1">{blog.category}</span>}
              <span>{dateStr}</span>
              <span>views: {blog.views}</span>
            </div>
            <h1 className="text-2xl font-bold text-[#00ff41] mb-4">{blog.title}</h1>
            <Link href={`/profile/${blog.author?.username}`} className="text-sm text-[#005a14] hover:text-[#00ff41]">
              author: {blog.author?.username}@devhub
            </Link>
            {blog.tags?.length > 0 && (
              <div className="mt-4 text-sm">
                <span className="text-[#005a14]">TAGS: </span>
                <span className="text-[#00cc33]">{blog.tags.join(' | ')}</span>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-5 text-sm">
              <button onClick={handleLike} className={`px-4 py-2 border transition-all ${liked ? 'border-[#ff0040] text-[#ff0040]' : 'border-[#003d10] text-[#005a14] hover:border-[#00ff41] hover:text-[#00ff41]'}`}>
                [{liked ? '♥' : '♡'} {likesCount}]
              </button>
              {isOwner && (
                <>
                  <Link href={`/blogs/${blog._id}/edit`} className="px-4 py-2 border border-[#003d10] text-[#005a14] hover:border-[#00ff41] hover:text-[#00ff41] transition-all">[edit]</Link>
                  <button onClick={handleDelete} className="px-4 py-2 border border-[#003d10] text-[#005a14] hover:border-[#ff0040] hover:text-[#ff0040] transition-all">[rm]</button>
                </>
              )}
            </div>
            <div className="mt-8 border-t border-[#003d10] pt-8">
              <article className="markdown-content">
                <Markdown>{blog.content}</Markdown>
              </article>
            </div>
          </div>
        </TerminalBox>
        <CommentSection targetType="blog" targetId={blog._id} />
      </div>
    </div>
  );
}
