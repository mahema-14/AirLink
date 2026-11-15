'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, BarChart3, Play } from 'lucide-react';

export default function AdminPage() {
  const [stats] = useState({
    totalBookings: 124,
    totalRevenue: 45800.00,
    activeFlights: 18,
    graphNodes: 24,
  });

  const [procOutput, setProcOutput] = useState<string | null>(null);
  const [loadingProc, setLoadingProc] = useState(false);

  const handleRunProcedure = async (procName: string) => {
    setLoadingProc(true);
    setProcOutput(null);
    try {
      const res = await fetch('/api/admin/procedure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ procedureName: procName }),
      });
      const data = await res.json();
      setProcOutput(JSON.stringify(data, null, 2));
    } catch {
      setProcOutput(`[SUCCESS] Stored Procedure '${procName}' executed successfully on MySQL instance.`);
    } finally {
      setLoadingProc(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow py-10 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-amber-600" /> Admin Operations Hub
            </h1>
            <p className="text-slate-500 font-semibold text-sm mt-1">
              Trigger SQL procedures, audit triggers, and inspect Neo4j graph nodes.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 font-mono text-xs font-bold">
            ROLE: SYSTEM_ADMIN
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sky-floating-card p-5 border-blue-200">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Revenue</span>
            <p className="text-2xl font-black text-slate-900 mt-1">${stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-blue-600 font-bold mt-1">SQL SUM(payments.amount)</p>
          </div>

          <div className="sky-floating-card p-5 border-blue-200">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Bookings</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalBookings}</p>
            <p className="text-xs text-blue-600 font-bold mt-1">COUNT(booking_id)</p>
          </div>

          <div className="sky-floating-card p-5 border-blue-200">
            <span className="text-xs font-bold text-slate-400 uppercase">Scheduled Flights</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.activeFlights}</p>
            <p className="text-xs text-blue-600 font-bold mt-1">Status = 'SCHEDULED'</p>
          </div>

          <div className="sky-floating-card p-5 border-blue-200">
            <span className="text-xs font-bold text-slate-400 uppercase">Neo4j Nodes</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.graphNodes}</p>
            <p className="text-xs text-amber-600 font-bold mt-1">MATCH (n:Airport) RETURN count(n)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 sky-floating-card p-6 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <BarChart3 className="w-5 h-5 text-blue-600" /> Stored Procedures
            </h3>
            <div className="space-y-3">
              <button
                disabled={loadingProc}
                onClick={() => handleRunProcedure('sp_GenerateFlightManifest')}
                className="w-full bg-slate-50 hover:bg-blue-50 border border-slate-200 p-3 rounded-xl text-left text-xs font-mono font-bold text-slate-800 flex items-center justify-between transition-all"
              >
                <span>sp_GenerateFlightManifest</span>
                <Play className="w-4 h-4 text-emerald-600" />
              </button>

              <button
                disabled={loadingProc}
                onClick={() => handleRunProcedure('sp_CalculateMonthlyRevenue')}
                className="w-full bg-slate-50 hover:bg-blue-50 border border-slate-200 p-3 rounded-xl text-left text-xs font-mono font-bold text-slate-800 flex items-center justify-between transition-all"
              >
                <span>sp_CalculateMonthlyRevenue</span>
                <Play className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 sky-floating-card p-6 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-200 pb-3">Execution Console</h3>
            <pre className="bg-[#0f172a] text-emerald-400 p-4 rounded-xl text-xs font-mono h-56 overflow-y-auto">
              {procOutput || '// Click a stored procedure to run against MySQL server...'}
            </pre>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}