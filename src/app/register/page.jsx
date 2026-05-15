'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { registerUser } from '@/lib/api';
import toast from 'react-hot-toast';
import TerminalBox from '@/components/ui/TerminalBox';

const FIELDS = [
  { name: 'name',     label: 'FULL_NAME', type: 'text',  placeholder: 'John Doe'        },
  { name: 'username', label: 'USERNAME',  type: 'text',  placeholder: 'johndoe'         },
  { name: 'email',    label: 'EMAIL',     type: 'email', placeholder: 'user@domain.com' },
];

export default function RegisterPage() {
  const { login }  = useAuth();
  const router     = useRouter();
  const [form,    setForm]    = useState({ name: '', username: '', email: '', password: '' });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('ERR: Password must be >= 6 chars'); return; }
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data.token, res.data.user);
      toast.success('User created. Welcome to DevHub');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'ERR: Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-lg fade-in">
        <TerminalBox title="useradd — new user registration">
          <div className="p-10">
            <div className="text-sm text-[#005a14] mb-6">
              <span className="text-[#00ff41]">devhub</span>:<span className="text-[#005a14]">~$ </span>sudo useradd --interactive
            </div>
            <h1 className="text-xl font-bold text-[#00ff41] mb-6">CREATE NEW ACCOUNT</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {FIELDS.map((f) => (
                <div key={f.name}>
                  <label className="block text-sm text-[#005a14] mb-2"><span className="text-[#003d10]">{'>'}</span> {f.label}:</label>
                  <input type={f.type} required value={form[f.name]}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    placeholder={f.placeholder} className="w-full" />
                </div>
              ))}
              <div>
                <label className="block text-sm text-[#005a14] mb-2"><span className="text-[#003d10]">{'>'}</span> PASSWORD:</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} required value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="min 6 characters" className="w-full !pr-20" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#003d10] hover:text-[#00ff41] transition-colors">
                    [{showPw ? 'hide' : 'show'}]
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 border border-[#00ff41] text-[#00ff41] text-sm font-bold hover:bg-[#00ff41] hover:text-black transition-all disabled:opacity-30">
                {loading ? '> CREATING USER...' : '> USERADD --CREATE'}
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-[#003d10]">
              Already registered? <Link href="/login" className="text-[#005a14] hover:text-[#00ff41] transition-colors underline">ssh login</Link>
            </div>
          </div>
        </TerminalBox>
      </div>
    </div>
  );
}
