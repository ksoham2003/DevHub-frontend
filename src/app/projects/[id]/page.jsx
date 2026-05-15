'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useProject } from '@/hooks/useProjects';
import { toggleProjectLike, deleteProject } from '@/lib/api';
import CommentSection from '@/components/features/CommentSection';
import TerminalBox from '@/components/ui/TerminalBox';
import toast from 'react-hot-toast';

export default function ProjectDetailPage() {
  const { id }     = useParams();
  const { user }   = useAuth();
  const router     = useRouter();
  const { project, loading, liked, setLiked, likesCount, setLikesCount, load } = useProject(id);

  useEffect(() => { load(user?._id); }, [id, user?._id]);

  const handleLike = async () => {
    if (!user) { toast.error('ERR: Login required'); return; }
    try {
      const res = await toggleProjectLike(id);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch { toast.error('ERR: Failed'); }
  };

  const handleDelete = async () => {
    if (!confirm('$ rm -rf project? This is irreversible.')) return;
    try {
      await deleteProject(id);
      toast.success('Project removed');
      router.push('/projects');
    } catch { toast.error('ERR: Failed to delete'); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-sm text-[#003d10] cursor-blink">loading project</span>
    </div>
  );
  if (!project) return null;

  const isOwner = user?._id === project.author?._id;

  return (
    <div className="pb-12 px-6">
      <div className="max-w-4xl mx-auto fade-in">
        <div className="py-4 text-sm text-[#005a14]">
          <button onClick={() => router.back()} className="hover:text-[#00ff41] transition-colors">
            <span className="text-[#00ff41]">root@devhub</span>:~$ cd ..
          </button>
        </div>

        <TerminalBox title={`cat /projects/${project.title?.toLowerCase().replace(/\s+/g, '-')}`}>
          <div className="p-10">
            <h1 className="text-2xl font-bold text-[#00ff41] mb-3">{project.title}</h1>
            <Link href={`/profile/${project.author?.username}`} className="text-sm text-[#005a14] hover:text-[#00ff41] transition-colors">
              author: {project.author?.username || project.author?.name}@devhub
            </Link>

            <div className="flex flex-wrap items-center gap-3 mt-5 text-sm">
              <button
                onClick={handleLike}
                className={`px-4 py-2 border transition-all ${liked ? 'border-[#ff0040] text-[#ff0040]' : 'border-[#003d10] text-[#005a14] hover:border-[#00ff41] hover:text-[#00ff41]'}`}
              >
                [{liked ? '♥' : '♡'} {likesCount}]
              </button>
              {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="px-4 py-2 border border-[#003d10] text-[#005a14] hover:border-[#00ff41] hover:text-[#00ff41] transition-all">[github]</a>}
              {project.liveUrl   && <a href={project.liveUrl}   target="_blank" rel="noreferrer" className="px-4 py-2 border border-[#003d10] text-[#005a14] hover:border-[#00ff41] hover:text-[#00ff41] transition-all">[live-demo]</a>}
            </div>

            {isOwner && (
              <div className="flex gap-3 mt-4 text-sm">
                <Link href={`/projects/${id}/edit`} className="px-3 py-1.5 border border-[#003d10] text-[#005a14] hover:border-[#00ff41] hover:text-[#00ff41] transition-all">[edit]</Link>
                <button onClick={handleDelete} className="px-3 py-1.5 border border-[#003d10] text-[#005a14] hover:border-[#ff0040] hover:text-[#ff0040] transition-all">[rm -rf]</button>
              </div>
            )}

            {project.techStack?.length > 0 && (
              <div className="mt-6 text-sm">
                <span className="text-[#005a14]">STACK: </span>
                <span className="text-[#00cc33]">{project.techStack.join(' | ')}</span>
              </div>
            )}

            <div className="mt-6 border-t border-[#003d10] pt-6">
              <div className="text-sm text-[#005a14] mb-3">{'/* DESCRIPTION */'}</div>
              <p className="text-sm text-[#00cc33] leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </div>
          </div>
        </TerminalBox>

        <CommentSection targetType="project" targetId={id} />
      </div>
    </div>
  );
}
