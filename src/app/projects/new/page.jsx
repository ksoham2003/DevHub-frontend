'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createProject, updateProject, getProject } from '@/lib/api';
import toast from 'react-hot-toast';
import TerminalBox from '@/components/ui/TerminalBox';
import TagInput from '@/components/ui/TagInput';

// Shared component — editId=null for new, editId=string for edit
export function ProjectFormView({ editId }) {
  const router  = useRouter();
  const { user }= useAuth();
  const isEdit  = !!editId;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', techStack: [], githubUrl: '', liveUrl: '', thumbnail: '',
  });

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (isEdit) {
      getProject(editId)
        .then((res) => {
          const p = res.data.project;
          setForm({ title: p.title, description: p.description, techStack: p.techStack || [], githubUrl: p.githubUrl || '', liveUrl: p.liveUrl || '', thumbnail: p.thumbnail || '' });
        })
        .catch(() => router.push('/projects'));
    }
  }, [editId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateProject(editId, form);
        toast.success('Project updated');
        router.push(`/projects/${editId}`);
      } else {
        const res = await createProject(form);
        toast.success('Project created');
        router.push(`/projects/${res.data.project._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'ERR: Failed');
    } finally {
      setLoading(false);
    }
  };

  const addTech    = (t) => setForm({ ...form, techStack: [...form.techStack, t] });
  const removeTech = (t) => setForm({ ...form, techStack: form.techStack.filter((x) => x !== t) });

  return (
    <div className="pb-12 px-6">
      <div className="max-w-3xl mx-auto fade-in">
        <div className="py-4 text-sm text-[#005a14]">
          <button onClick={() => router.back()} className="hover:text-[#00ff41]">
            <span className="text-[#00ff41]">root@devhub</span>:~$ cd ..
          </button>
        </div>

        <TerminalBox title={isEdit ? 'vim project --edit' : 'mkdir project --new'}>
          <div className="p-10">
            <h1 className="text-xl font-bold text-[#00ff41] mb-6">{isEdit ? '> EDIT PROJECT' : '> NEW PROJECT'}</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-[#005a14] mb-2">{'>'} TITLE:</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="project-name" className="w-full" />
              </div>
              <div>
                <label className="block text-sm text-[#005a14] mb-2">{'>'} DESCRIPTION:</label>
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} placeholder="describe your project..." className="w-full resize-none" />
              </div>

              <TagInput label="TECH_STACK" tags={form.techStack} onAdd={addTech} onRemove={removeTech} placeholder="e.g. React" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#005a14] mb-2">{'>'} GITHUB_URL:</label>
                  <input type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." className="w-full" />
                </div>
                <div>
                  <label className="block text-sm text-[#005a14] mb-2">{'>'} LIVE_URL:</label>
                  <input type="url" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://..." className="w-full" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#005a14] mb-2">{'>'} THUMBNAIL_URL:</label>
                <input type="url" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://..." className="w-full" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 border border-[#00ff41] text-[#00ff41] text-sm font-bold hover:bg-[#00ff41] hover:text-black transition-all disabled:opacity-30">
                {loading ? '> SAVING...' : isEdit ? '> WRITE --save' : '> MKDIR --create'}
              </button>
            </form>
          </div>
        </TerminalBox>
      </div>
    </div>
  );
}

// /projects/new
export default function ProjectNewPage() {
  return <ProjectFormView editId={null} />;
}
