'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/lib/api';
import toast from 'react-hot-toast';
import TerminalBox from '@/components/ui/TerminalBox';
export default function LoginPage() {
  const { login }  = useAuth();
  const router     = useRouter();
  const [form,    setForm]   = useState({ email: '', password: '' });
  const [showPw,  setShowPw] = useState(false);
  const [loading, setLoading]= useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      toast.success('Session established');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'ERR: Authentication failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg fade-in">
        <TerminalBox title="ssh login@devhub — 80×24">
          <div className="p-10">
            <div className="text-sm text-[#005a14] mb-1">Last login: {new Date().toDateString()}</div>
            <div className="text-sm text-[#005a14] mb-6">
              <span className="text-[#00ff41]">devhub</span>:<span className="text-[#005a14]">~$ </span>ssh authenticate
            </div>
            <h1 className="text-xl font-bold text-[#00ff41] mb-6">AUTHENTICATION REQUIRED</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-[#005a14] mb-2"><span className="text-[#003d10]">{'>'}</span> EMAIL:</label>
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="user@domain.com" className="w-full" />
              </div>
              <div>
                <label className="block text-sm text-[#005a14] mb-2"><span className="text-[#003d10]">{'>'}</span> PASSWORD:</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} required value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••" className="w-full !pr-20" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#003d10] hover:text-[#00ff41] transition-colors">
                    [{showPw ? 'hide' : 'show'}]
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 border border-[#00ff41] text-[#00ff41] text-sm font-bold hover:bg-[#00ff41] hover:text-black transition-all disabled:opacity-30">
                {loading ? '> AUTHENTICATING...' : '> SSH LOGIN'}
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-[#003d10]">
              No account? <Link href="/register" className="text-[#005a14] hover:text-[#00ff41] transition-colors underline">useradd --register</Link>
            </div>
          </div>
        </TerminalBox>
      </div>
    </div>
  );
}
