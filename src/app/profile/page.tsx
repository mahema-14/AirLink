'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, ShieldCheck, Ticket } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setUser({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        role: 'PASSENGER',
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 w-full flex-grow py-12 space-y-6">
        <div className="sky-floating-card p-8 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center text-2xl font-black">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{user?.fullName}</h1>
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" /> {user?.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-semibold">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-black uppercase">Role Permission</span>
              <span className="text-blue-700 font-bold flex items-center gap-1.5 mt-1">
                <ShieldCheck className="w-4 h-4 text-amber-500" /> {user?.role || 'PASSENGER'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-black uppercase">Membership Tier</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 mt-1">
                <Ticket className="w-4 h-4 text-emerald-600" /> Skyward Club Member
              </span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}