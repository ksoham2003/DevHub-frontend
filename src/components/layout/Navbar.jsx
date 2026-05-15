'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
export default function Navbar() {
  const { user, logout } = useAuth();
  const router           = useRouter();
  const pathname         = usePathname();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };
  const navLinks = [
    { to: '/',          label: '~/'        },
    { to: '/projects',  label: '/projects' },
    { to: '/blogs',     label: '/blogs'    },
    { to: '/developers',label: '/devs'     },
  ];
  const isActive = (path) => pathname === path;
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-[#003d10]">
      <div className="w-full px-6 flex flex-col-reverse">
        <div className="flex items-center justify-between h-12">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-[#00ff41] font-bold text-sm tracking-wider">
              <span className="text-[#005a14]">┌─[</span>DevHub<span className="text-[#005a14]">]</span>
            </span>
            <span className="text-[#003d10] text-xs hidden sm:inline">v2.0.0</span>
          </Link>
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#005a14] text-sm font-bold">$</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="grep -r 'search'..."
                className="w-full !pl-8 !pr-4 !py-1.5 bg-black !text-sm"
              />
            </div>
          </form>
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className={`px-3 py-1.5 text-sm transition-all ${
                  isActive(link.to)
                    ? 'text-[#00ff41] bg-[#003d10]/30'
                    : 'text-[#005a14] hover:text-[#00ff41]'
                }`}
              >
                {isActive(link.to) && <span className="text-[#005a14]">{'> '}</span>}
                {link.label}
              </Link>
            ))}
            <span className="text-[#003d10] mx-2">│</span>
            {user ? (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="px-3 py-1 border border-[#003d10] text-[#00ff41] text-sm hover:border-[#00ff41] hover:bg-[#003d10]/20 transition-all"
                  >
                    + new
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 bottom-full mb-1 w-48 bg-black border border-[#00ff41] shadow-lg shadow-[#00ff41]/10 fade-in z-50">
                      <Link
                        href="/projects/new"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-[#005a14] hover:text-[#00ff41] hover:bg-[#003d10]/20 transition-all"
                      >
                        {'>'} mkdir project
                      </Link>
                      <div className="border-t border-[#003d10]" />
                      <Link
                        href="/blogs/new"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-[#005a14] hover:text-[#00ff41] hover:bg-[#003d10]/20 transition-all"
                      >
                        {'>'} touch blog.md
                      </Link>
                    </div>
                  )}
                </div>
                <Link
                  href={`/profile/${user.username}`}
                  className="text-sm text-[#005a14] hover:text-[#00ff41] transition-all px-2"
                >
                  {user.username}@devhub
                </Link>
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="px-2 py-1 text-sm text-[#003d10] hover:text-[#ff0040] transition-all"
                  title="Logout"
                >
                  [exit]
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login"    className="px-3 py-1 text-sm text-[#005a14] hover:text-[#00ff41] transition-all">ssh login</Link>
                <Link href="/register" className="px-3 py-1 border border-[#003d10] text-[#00ff41] text-sm hover:border-[#00ff41] hover:bg-[#003d10]/20 transition-all">useradd</Link>
              </div>
            )}
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[#00ff41] text-sm"
          >
            {mobileOpen ? '[^C]' : '[≡]'}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden pb-3 border-b border-[#003d10] pt-3 fade-in mb-2">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#005a14] text-sm">$</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="search..."
                  className="w-full !pl-8 !pr-4 !py-2 !text-sm"
                />
              </div>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 text-sm ${isActive(link.to) ? 'text-[#00ff41]' : 'text-[#005a14] hover:text-[#00ff41]'}`}
              >
                {'>'} {link.label}
              </Link>
            ))}
            <div className="border-t border-[#003d10] my-2" />
            {user ? (
              <>
                <Link href="/projects/new" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-[#005a14] hover:text-[#00ff41]">{'>'} mkdir project</Link>
                <Link href="/blogs/new"    onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-[#005a14] hover:text-[#00ff41]">{'>'} touch blog.md</Link>
                <Link href={`/profile/${user.username}`} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-[#005a14] hover:text-[#00ff41]">{'>'} whoami ({user.username})</Link>
                <button onClick={() => { logout(); router.push('/'); setMobileOpen(false); }} className="block px-3 py-2.5 text-sm text-[#ff0040] w-full text-left">{'>'} exit</button>
              </>
            ) : (
              <div className="flex gap-3 mt-2 px-3">
                <Link href="/login"    onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 border border-[#003d10] text-sm text-[#005a14] hover:text-[#00ff41] hover:border-[#00ff41]">login</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 border border-[#00ff41] text-sm text-[#00ff41]">register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
