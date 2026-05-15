'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { toggleFollow } from '@/lib/api';
import ProjectCard from '@/components/cards/ProjectCard';
import BlogCard from '@/components/cards/BlogCard';
import TerminalBox from '@/components/ui/TerminalBox';
import toast from 'react-hot-toast';
export default function ProfilePage() {
  const { username }                 = useParams();
  const { user: currentUser }        = useAuth();
  const { profile, projects, blogs, isFollowing, updateFollowCount, loading } = useProfile(username);
  const [tab, setTab]                = useState('projects');
  const isOwner = currentUser?.username === username;
  const handleFollow = async () => {
    if (!currentUser) { toast.error('ERR: Login required'); return; }
    try {
      const res = await toggleFollow(profile._id);
      updateFollowCount(res.data.isFollowing);
      toast.success(res.data.message);
    } catch { toast.error('ERR: Failed'); }
  };
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-sm text-[#003d10] cursor-blink">loading profile</span>
    </div>
  );
  if (!profile) return (
    <div className="min-h-screen text-center py-20 text-sm text-[#003d10]">ERR: User not found</div>
  );
  const socials = [
    { key: 'github',   url: profile.socialLinks?.github   },
    { key: 'linkedin', url: profile.socialLinks?.linkedin },
    { key: 'twitter',  url: profile.socialLinks?.twitter  },
    { key: 'website',  url: profile.socialLinks?.website  },
  ].filter((l) => l.url);
  return (
    <div className="pb-12 px-6 fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="mt-6">
          <TerminalBox title={`finger ${username}@devhub`}>
            <div className="p-10">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="shrink-0">
                  {profile.avatar
                    ? <img src={profile.avatar} alt="" className="w-24 h-24 object-cover border border-[#003d10]" />
                    : <div className="w-24 h-24 border border-[#003d10] flex items-center justify-center text-3xl text-[#005a14] font-bold">[{profile.name?.charAt(0) || '?'}]</div>
                  }
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-[#00ff41]">{profile.name}</h1>
                  <p className="text-sm text-[#003d10]">@{profile.username}</p>
                  {profile.title && <p className="text-sm text-[#005a14] mt-2">{profile.title}</p>}
                  {profile.bio   && <p className="text-sm text-[#00cc33] mt-2 leading-relaxed">{profile.bio}</p>}
                </div>
                <div className="shrink-0">
                  {isOwner
                    ? <Link href="/settings" className="px-4 py-2 border border-[#003d10] text-sm text-[#005a14] hover:border-[#00ff41] hover:text-[#00ff41] transition-all">[edit]</Link>
                    : <button onClick={handleFollow} className={`px-4 py-2 border text-sm transition-all ${isFollowing ? 'border-[#00ff41] text-[#00ff41] hover:border-[#ff0040] hover:text-[#ff0040]' : 'border-[#003d10] text-[#005a14] hover:border-[#00ff41] hover:text-[#00ff41]'}`}>
                        [{isFollowing ? 'unfollow' : 'follow'}]
                      </button>
                  }
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-6 text-sm text-[#005a14]">
                {profile.location && <span>location: {profile.location}</span>}
                <span>followers: <span className="text-[#00ff41]">{profile.followersCount || 0}</span></span>
                <span>following: <span className="text-[#00ff41]">{profile.followingCount || 0}</span></span>
              </div>
              {socials.length > 0 && (
                <div className="flex gap-3 mt-4">
                  {socials.map((l) => (
                    <a key={l.key} href={l.url} target="_blank" rel="noreferrer"
                      className="px-3 py-1 border border-[#003d10] text-sm text-[#005a14] hover:border-[#00ff41] hover:text-[#00ff41] transition-all">
                      [{l.key}]
                    </a>
                  ))}
                </div>
              )}
              {profile.skills?.length > 0 && (
                <div className="mt-4 text-sm">
                  <span className="text-[#005a14]">SKILLS: </span>
                  <span className="text-[#00cc33]">{profile.skills.join(' | ')}</span>
                </div>
              )}
            </div>
          </TerminalBox>
        </div>
        <div className="flex gap-0 mt-8 border-b border-[#003d10]">
          {[
            { key: 'projects', label: `ls projects (${projects.length})` },
            { key: 'blogs',    label: `ls blogs (${blogs.length})`    },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm border-b-2 transition-all ${tab === t.key ? 'text-[#00ff41] border-[#00ff41]' : 'text-[#005a14] border-transparent hover:text-[#00ff41]'}`}>
              $ {t.label}
            </button>
          ))}
        </div>
        <div className="mt-6">
          {tab === 'projects' && (
            projects.length === 0
              ? <p className="text-center py-16 text-sm text-[#003d10]">{'// no projects found'}</p>
              : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{projects.map((p) => <ProjectCard key={p._id} project={p} />)}</div>
          )}
          {tab === 'blogs' && (
            blogs.length === 0
              ? <p className="text-center py-16 text-sm text-[#003d10]">{'// no blog posts found'}</p>
              : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{blogs.map((b) => <BlogCard key={b._id} blog={b} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
