import Link from 'next/link';
import { Plane, User, Network, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b1329]/90 backdrop-blur-md text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Skyward AirLink Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2.5 rounded-2xl bg-blue-600/30 text-blue-400 border border-blue-400/30 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white leading-none">
              Skyward
            </span>
            <span className="text-[10px] text-blue-300 font-bold tracking-widest uppercase mt-0.5">
              AirLink Network
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-200">
          <Link href="/" className="hover:text-white transition-colors">
            Book
          </Link>
          <Link href="/my-bookings" className="hover:text-white transition-colors">
            My Bookings
          </Link>
          <Link href="/flights" className="hover:text-white transition-colors">
            Destinations
          </Link>
          <Link href="/admin" className="flex items-center gap-1.5 text-amber-300 bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/30 text-xs font-bold hover:bg-amber-400/20 transition-all">
            <ShieldCheck className="w-3.5 h-3.5" /> Admin Hub
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono">
            <Network className="w-3.5 h-3.5 text-emerald-400" /> MySQL + Neo4j Connected
          </div>

          <Link
            href="/login"
            className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-full border border-white/20 transition-all"
          >
            <User className="w-4 h-4" /> Log in / Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}