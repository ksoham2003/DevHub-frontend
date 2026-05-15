'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createBlog, updateBlog } from '@/lib/api';
import Markdown from 'react-markdown';
import toast from 'react-hot-toast';
import TerminalBox from '@/components/ui/TerminalBox';
import TagInput from '@/components/ui/TagInput';

const CATEGORIES = ['Tutorial','Guide','Opinion','News','Project Update','Career','Other'];

// Shared blog form — works for both /blogs/new and /blogs/[slug]/edit
// When used as edit: pass editId prop (the blog _id)
export function BlogFormView({ editId }) {
  const router    = useRouter();
  const { user }  = useAuth();
  const isEdit    = !!editId;
  const [loading,  setLoading] = useState(false);
  const [preview,  setPreview] = useState(false);
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', coverImage: '', tags: [], category: 'Other', published: true,
  });

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    // If editing, load existing blog data
    if (isEdit) {
      import('@/lib/api').then(({ default: API }) =>
        API.get(`/blogs/edit/${editId}`)
          .then((res) => {
            const b = res.data.blog;
            if (b) setForm({ title: b.title, content: b.content, excerpt: b.excerpt || '', coverImage: b.coverImage || '', tags: b.tags || [], category: b.category || 'Other', published: b.published ?? true });
          })
          .catch(() => {})
      );
    }
  }, [user, editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateBlog(editId, form);
        toast.success('Blog updated');
        router.push('/blogs');
      } else {
        const res = await createBlog(form);
        toast.success('Blog published');
        router.push(`/blogs/${res.data.blog.slug}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'ERR: Failed');
    } finally {
      setLoading(false);
    }
  };

  const addTag    = (t) => setForm({ ...form, tags: [...form.tags, t] });
  const removeTag = (t) => setForm({ ...form, tags: form.tags.filter((x) => x !== t) });

  return (
    <div className="pb-12 px-6">
      <div className="max-w-4xl mx-auto fade-in">
        <div className="py-4 text-sm text-[#005a14]">
          <button onClick={() => router.back()} className="hover:text-[#00ff41]">
            <span className="text-[#00ff41]">root@devhub</span>:~$ cd ..
          </button>
        </div>

        <div className="border border-[#003d10]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#003d10] text-xs text-[#005a14]">
            <div className="flex items-center gap-2">
              <span className="text-[#003d10]">●</span>
              <span>{isEdit ? 'vim blog --edit' : 'vim blog.md --new'}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreview(!preview)}
                className={`px-3 py-1 border transition-all text-sm ${preview ? 'border-[#00ff41] text-[#00ff41]' : 'border-[#003d10] text-[#005a14] hover:border-[#00ff41] hover:text-[#00ff41]'}`}
              >
                [{preview ? ':wq' : ':preview'}]
              </button>
              <span className="text-[#003d10]">[─][□][×]</span>
            </div>
          </div>

          <div className="p-10">
            {preview ? (
              <div className="fade-in">
                <div className="text-sm text-[#005a14] mb-4">$ cat blog.md | render</div>
                <h1 className="text-2xl font-bold text-[#00ff41] mb-6">{form.title || 'Untitled'}</h1>
                <div className="markdown-content"><Markdown>{form.content}</Markdown></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-[#005a14] mb-2">{'>'} TITLE:</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="blog-title" className="w-full !text-lg !font-bold" />
                </div>
                <div>
                  <label className="block text-sm text-[#005a14] mb-2">{'>'} CONTENT (markdown):</label>
                  <textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={16} placeholder="write in markdown..." className="w-full resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-[#005a14] mb-2">{'>'} EXCERPT:</label>
                  <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="brief summary" className="w-full resize-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#005a14] mb-2">{'>'} CATEGORY:</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#005a14] mb-2">{'>'} COVER_IMAGE:</label>
                    <input type="url" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." className="w-full" />
                  </div>
                </div>

                <TagInput label="TAGS" tags={form.tags} onAdd={addTag} onRemove={removeTag} placeholder="e.g. JavaScript" />

                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} id="pub" />
                  <label htmlFor="pub" className="text-sm text-[#005a14] cursor-pointer">publish immediately</label>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3 border border-[#00ff41] text-[#00ff41] text-sm font-bold hover:bg-[#00ff41] hover:text-black transition-all disabled:opacity-30">
                  {loading ? '> SAVING...' : isEdit ? '> :wq (save & quit)' : form.published ? '> PUBLISH' : '> SAVE DRAFT'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// /blogs/new
export default function BlogNewPage() {
  return <BlogFormView editId={null} />;
}
