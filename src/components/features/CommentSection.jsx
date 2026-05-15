'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createComment, deleteComment } from '@/lib/api';
import { useComments } from '@/hooks/useComments';
import toast from 'react-hot-toast';
function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60)    return 'now';
  if (s < 3600)  return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}
export default function CommentSection({ targetType, targetId }) {
  const { user } = useAuth();
  const { comments, loading, addComment, removeComment } = useComments(targetType, targetId);
  const [content, setContent] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const res = await createComment({ targetType, targetId, content: content.trim() });
      addComment(res.data.comment);
      setContent('');
      toast.success('Comment logged');
    } catch (err) {
      toast.error(err.response?.data?.message || 'ERR: Failed');
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteComment(id);
      removeComment(id);
      toast.success('Comment removed');
    } catch {
      toast.error('ERR: Failed');
    }
  };
  return (
    <div className="mt-10">
      <div className="text-sm text-[#005a14] mb-5 border-b border-[#003d10] pb-3">
        <span className="text-[#00ff41]">{'/* COMMENTS ('}{comments.length}{') */'}</span>
      </div>
      {user && (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="border border-[#003d10] focus-within:border-[#00ff41] transition-all">
            <div className="text-xs text-[#003d10] px-4 py-2 border-b border-[#003d10]">
              {user.username}@devhub:~$ write comment
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="> type your comment here..."
              rows={3}
              className="w-full !border-none resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={!content.trim()}
            className="mt-3 px-5 py-2 border border-[#003d10] text-sm text-[#00ff41] hover:border-[#00ff41] hover:bg-[#003d10]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            [SUBMIT]
          </button>
        </form>
      )}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-[#003d10] p-4">
              <span className="text-sm text-[#003d10] cursor-blink">loading</span>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#003d10]">
          {'// no comments found. be the first to write one.'}
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c._id} className="border border-[#003d10] hover:border-[#005a14] p-4 fade-in transition-all">
              <div className="flex items-start justify-between">
                <div className="text-sm">
                  <span className="text-[#00ff41] font-bold">{c.author?.username || c.author?.name}</span>
                  <span className="text-[#003d10] ml-3">{timeAgo(c.createdAt)} ago</span>
                </div>
                {user && user._id === c.author?._id && (
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-sm text-[#003d10] hover:text-[#ff0040] transition-colors"
                  >
                    [rm]
                  </button>
                )}
              </div>
              <p className="text-sm text-[#00cc33] mt-2 leading-relaxed">
                <span className="text-[#005a14]">{'> '}</span>{c.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
