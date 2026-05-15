'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/lib/api';
import toast from 'react-hot-toast';
import TerminalBox from '@/components/ui/TerminalBox';
import TagInput from '@/components/ui/TagInput';
export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const router               = useRouter();
  const [loading, setLoading]= useState(false);
  const [form, setForm]      = useState({
    name: '', bio: '', title: '', location: '',
    avatar: '', banner: '', skills: [],
    socialLinks: { github: '', linkedin: '', twitter: '', website: '' },
  });
  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    setForm({
      name: user.name || '', bio: user.bio || '', title: user.title || '', location: user.location || '',
      avatar: user.avatar || '', banner: user.banner || '', skills: user.skills || [],
      socialLinks: {
        github:   user.socialLinks?.github   || '',
        linkedin: user.socialLinks?.linkedin || '',
        twitter:  user.socialLinks?.twitter  || '',
        website:  user.socialLinks?.website  || '',
      },
    });
  }, [user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(form);
      updateUser(res.data.user);
      toast.success('Profile updated');
      router.push(`/profile/${res.data.user.username}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'ERR: Failed');
    } finally {
      setLoading(false);
    }
  };
  const addSkill    = (s) => setForm({ ...form, skills: [...form.skills, s] });
  const removeSkill = (s) => setForm({ ...form, skills: form.skills.filter((x) => x !== s) });
  if (!user) return null;
  return (
    <div className="pb-12 px-6">
      <div className="max-w-3xl mx-auto fade-in">
        <div className="py-4 text-sm text-[#005a14]">
          <button onClick={() => router.back()} className="hover:text-[#00ff41]">
            <span className="text-[#00ff41]">root@devhub</span>:~$ cd ..
          </button>
        </div>
        <TerminalBox title={`usermod ${user.username} --edit-profile`}>
          <div className="p-10">
            <h1 className="text-xl font-bold text-[#00ff41] mb-6">{'>'} EDIT PROFILE</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#005a14] mb-2">{'>'} NAME:</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm text-[#005a14] mb-2">{'>'} TITLE:</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Full Stack Developer" className="w-full" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#005a14] mb-2">{'>'} BIO:</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="tell us about yourself..." className="w-full resize-none" />
              </div>
              <div>
                <label className="block text-sm text-[#005a14] mb-2">{'>'} LOCATION:</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" className="w-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#005a14] mb-2">{'>'} AVATAR_URL:</label>
                  <input type="url" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm text-[#005a14] mb-2">{'>'} BANNER_URL:</label>
                  <input type="url" value={form.banner} onChange={(e) => setForm({ ...form, banner: e.target.value })} className="w-full" />
                </div>
              </div>
              <TagInput label="SKILLS" tags={form.skills} onAdd={addSkill} onRemove={removeSkill} placeholder="e.g. React" />
              <div className="border-t border-[#003d10] pt-5">
                <div className="text-sm text-[#005a14] mb-4">{'/* SOCIAL LINKS */'}</div>
                <div className="space-y-4">
                  {['github','linkedin','twitter','website'].map((key) => (
                    <div key={key}>
                      <label className="block text-xs text-[#003d10] mb-1">{'>'} {key.toUpperCase()}:</label>
                      <input type="url" value={form.socialLinks[key]}
                        onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: e.target.value } })}
                        placeholder={`https://${key}.com/...`} className="w-full" />
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 border border-[#00ff41] text-[#00ff41] text-sm font-bold hover:bg-[#00ff41] hover:text-black transition-all disabled:opacity-30">
                {loading ? '> SAVING...' : '> WRITE --save'}
              </button>
            </form>
          </div>
        </TerminalBox>
      </div>
    </div>
  );
}
