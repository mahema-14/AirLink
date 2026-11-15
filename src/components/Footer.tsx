import Link from 'next/link';
import { Plane, Database, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b1329] text-slate-400 text-xs mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-lg">
              <Plane className="w-5 h-5 text-blue-400 -rotate-45" /> Skyward AirLink
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              DBMS Level 3 project demonstrating hybrid MySQL relational transaction modeling and Neo4j graph path algorithms.
            </p>
          </div>

          <div>
            <span className="font-bold text-white text-sm block mb-3">Database Stack</span>
            <ul className="space-y-2 font-mono text-[11px] text-slate-400">
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-blue-400" /> MySQL 8.0 InnoDB
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Neo4j Bolt Graph DB
              </li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-white text-sm block mb-3">System Views</span>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/" className="hover:text-white">Flight Booking</Link></li>
              <li><Link href="/my-bookings" className="hover:text-white">Passenger Tickets</Link></li>
              <li><Link href="/admin" className="hover:text-white">Admin Operations Hub</Link></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-white text-sm block mb-3">Project Specs</span>
            <p className="text-slate-500 text-xs">
              Next.js 15 App Router | TailWind CSS | Node MySQL2 | Neo4j Cypher Driver
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-slate-500">
          <p>© 2026 Skyward AirLink. DBMS Level 3 Mini Project.</p>
          <div className="flex gap-4 font-mono text-[11px] mt-2 sm:mt-0">
            <span>MySQL Pool: Active</span>
            <span>•</span>
            <span>Neo4j: Connected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}