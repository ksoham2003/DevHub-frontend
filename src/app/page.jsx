'use client';
import Link from 'next/link';
import { useTrending } from '@/hooks/useTrending';
import ProjectCard from '@/components/cards/ProjectCard';
import BlogCard from '@/components/cards/BlogCard';
import DeveloperCard from '@/components/cards/DeveloperCard';
const ASCII_LOGO = `
 ██████╗ ███████╗██╗   ██╗██╗  ██╗██╗   ██╗██████╗ 
 ██╔══██╗██╔════╝██║   ██║██║  ██║██║   ██║██╔══██╗
 ██║  ██║█████╗  ██║   ██║███████║██║   ██║██████╔╝
 ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══██║██║   ██║██╔══██╗
 ██████╔╝███████╗ ╚████╔╝ ██║  ██║╚██████╔╝██████╔╝
 ╚═════╝ ╚══════╝  ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚═════╝`;
export default function HomePage() {
  const { trending, loading } = useTrending();
  return (
    <div className="pb-12 px-6">
      <section className="py-10 max-w-6xl mx-auto">
        <pre className="text-[#00ff41] text-xs sm:text-sm leading-tight font-bold whitespace-pre overflow-x-auto mb-6">
          {ASCII_LOGO}
        </pre>
        <div className="text-sm mb-2">
          <span className="text-[#00ff41]">root@devhub</span>
          <span className="text-[#005a14]">:~$ </span>
          <span className="text-[#00cc33]">cat /etc/motd</span>
        </div>
        <div className="pl-4 mb-6 text-[#00cc33] space-y-1">
          <p>Welcome to <span className="text-[#00ff41] font-bold">DevHub Terminal</span> — The Developer Community Platform</p>
          <p className="text-[#005a14]">────────────────────────────────────────────────────────</p>
          <p>BUILD.   Share your projects with tech stack tags, GitHub links, and live demos.</p>
          <p>SHARE.   Publish technical articles with full markdown support.</p>
          <p>CONNECT. Network with developers, follow, and build your community.</p>
        </div>
        <div className="mb-6">
          <div className="text-sm mb-3">
            <span className="text-[#00ff41]">root@devhub</span>
            <span className="text-[#005a14]">:~$ </span>
            <span className="text-[#00cc33]">./start.sh</span>
          </div>
          <div className="flex flex-wrap gap-4 pl-4">
            <Link href="/register" className="px-6 py-2.5 border border-[#00ff41] text-[#00ff41] text-sm font-bold hover:bg-[#00ff41] hover:text-black transition-all">
              {'>'} useradd --register
            </Link>
            <Link href="/projects" className="px-6 py-2.5 border border-[#003d10] text-[#005a14] text-sm hover:border-[#00ff41] hover:text-[#00ff41] transition-all">
              {'>'} ls /projects
            </Link>
          </div>
        </div>
        <div className="border border-[#003d10] flex divide-x divide-[#003d10] text-center max-w-lg">
          {[
            { val: trending.projects?.length || '0',   label: 'PROJECTS'  },
            { val: trending.blogs?.length    || '0',   label: 'ARTICLES'  },
            { val: trending.developers?.length || '0', label: 'USERS'     },
          ].map((s, i) => (
            <div key={i} className="flex-1 py-4">
              <div className="text-2xl font-bold text-[#00ff41]">{s.val}</div>
              <div className="text-xs text-[#005a14] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto mb-12">
        <div className="text-sm text-[#005a14] mb-4">
          <span className="text-[#00ff41]">root@devhub</span>:~$ cat /etc/features.conf
        </div>
        <div className="border border-[#003d10] divide-y divide-[#003d10]">
          {[
            { cmd: 'project.showcase', desc: 'Share projects with tech stack tags, GitHub links, and live demos.' },
            { cmd: 'blog.publish',     desc: 'Publish technical articles with full markdown support and syntax highlighting.' },
            { cmd: 'dev.network',      desc: 'Connect with developers, follow profiles, and build your community.' },
          ].map((f, i) => (
            <div key={i} className="px-5 py-4 hover:bg-[#003d10]/10 transition-all">
              <span className="text-sm text-[#00ff41] font-bold">{f.cmd}</span>
              <span className="text-[#003d10] mx-3">─</span>
              <span className="text-sm text-[#00cc33]">{f.desc}</span>
            </div>
          ))}
        </div>
      </section>
      {!loading && trending.projects?.length > 0 && (
        <section className="max-w-6xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-[#005a14]">
              <span className="text-[#00ff41]">root@devhub</span>:~$ ls /trending/projects --sort=popular
            </div>
            <Link href="/projects" className="text-sm text-[#003d10] hover:text-[#00ff41] transition-colors">[view all]</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {trending.projects.slice(0, 3).map((p) => <ProjectCard key={p._id} project={p} />)}
          </div>
        </section>
      )}
      {!loading && trending.blogs?.length > 0 && (
        <section className="max-w-6xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-[#005a14]">
              <span className="text-[#00ff41]">root@devhub</span>:~$ ls /trending/articles --sort=latest
            </div>
            <Link href="/blogs" className="text-sm text-[#003d10] hover:text-[#00ff41] transition-colors">[view all]</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {trending.blogs.slice(0, 3).map((b) => <BlogCard key={b._id} blog={b} />)}
          </div>
        </section>
      )}
      {!loading && trending.developers?.length > 0 && (
        <section className="max-w-6xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-[#005a14]">
              <span className="text-[#00ff41]">root@devhub</span>:~$ who --top
            </div>
            <Link href="/developers" className="text-sm text-[#003d10] hover:text-[#00ff41] transition-colors">[view all]</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {trending.developers.slice(0, 6).map((d) => <DeveloperCard key={d._id} user={d} />)}
          </div>
        </section>
      )}
      <section className="max-w-6xl mx-auto mb-12">
        <div className="border border-[#00ff41] p-10 text-center" style={{ boxShadow: '0 0 20px rgba(0,255,65,0.08)' }}>
          <p className="text-lg font-bold text-[#00ff41] mb-3">Ready to deploy your portfolio?</p>
          <p className="text-sm text-[#00cc33] mb-6">Join the DevHub terminal and connect with developers worldwide.</p>
          <Link href="/register" className="inline-block px-8 py-3 border border-[#00ff41] text-[#00ff41] text-sm font-bold hover:bg-[#00ff41] hover:text-black transition-all">
            $ sudo useradd --create-home you
          </Link>
        </div>
      </section>
      <div className="text-center text-sm text-[#003d10] pb-8">
        <span className="cursor-blink">DevHub Terminal v2.0.0 — Next.js Edition</span>
      </div>
    </div>
  );
}
