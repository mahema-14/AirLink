'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FlightSearch from '@/components/FlightSearch';
import FlightCard from '@/components/FlightCard';
import Footer from '@/components/Footer';
import { Plane, ArrowRight, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [flights, setFlights] = useState<any[]>([]);
  const [graphPaths, setGraphPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'sql' | 'graph'>('sql');
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialFlights();
  }, []);

  const fetchInitialFlights = async () => {
    try {
      const res = await fetch('/api/flights');
      const data = await res.json();
      if (data.flights) setFlights(data.flights);
    } catch (err) {
      console.error('Failed to fetch initial flights:', err);
    }
  };

  const handleSearch = async ({ origin, destination, mode }: { origin: string; destination: string; mode: string }) => {
    setLoading(true);
    setError('');
    setSearched(true);
    setSearchMode(mode as 'sql' | 'graph');

    try {
      const res = await fetch(`/api/flights?origin=${origin}&destination=${destination}&mode=${mode}`);
      const data = await res.json();

      if (res.ok) {
        if (mode === 'graph') {
          setGraphPaths(data.paths || []);
          setFlights([]);
        } else {
          setFlights(data.flights || []);
          setGraphPaths([]);
        }
      } else {
        setError(data.error || 'Query execution error.');
      }
    } catch {
      setError('Connection failure communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      <Navbar />

      <section className="relative sky-hero-bg text-white pt-16 pb-36 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-2xl text-left">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Fly Beyond Expectations
            </h1>
            <p className="text-blue-100 text-base md:text-lg font-medium leading-relaxed max-w-xl">
              Experience comfort, world-class service, and destinations like never before. Powered by relational SQL and Neo4j graph intelligence.
            </p>
            <div className="pt-2">
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-6 py-3 rounded-full text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30">
                Explore Destinations <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="hidden md:block w-96 h-64 relative opacity-90">
            <Plane className="w-full h-full text-white/20 -rotate-12" />
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 w-full flex-grow -mt-24 pb-20 relative z-30">
        <FlightSearch onSearch={handleSearch} />

        <div className="mt-16 mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Plane className="w-6 h-6 text-blue-600" />
            {searched ? 'Search Results' : 'Available Direct Schedules'}
          </h2>
          {searchMode === 'graph' && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300">
              Neo4j Cypher Traversal Active
            </span>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-semibold text-sm">Executing queries against AirLink backend...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 mb-6 font-medium text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" /> {error}
          </div>
        )}

        {!loading && searchMode === 'graph' && searched && (
          <div className="space-y-4">
            {graphPaths.length === 0 ? (
              <div className="sky-floating-card p-12 text-center text-slate-500 font-medium">
                No Neo4j graph paths found connecting the selected airports.
              </div>
            ) : (
              graphPaths.map((pathItem, idx) => (
                <div key={idx} className="sky-floating-card p-6 border-blue-200 bg-blue-50/40 space-y-2">
                  <span className="font-extrabold text-blue-800 text-sm block">
                    Graph Route Choice #{idx + 1}
                  </span>
                  <pre className="bg-[#0f172a] text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto">
                    {JSON.stringify(pathItem, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        )}

        {!loading && (searchMode === 'sql' || !searched) && (
          <div className="space-y-4">
            {flights.length === 0 ? (
              <div className="sky-floating-card p-12 text-center text-slate-500 font-semibold">
                No scheduled flights match your search query. Try DEL → BOM or BLR → MAA.
              </div>
            ) : (
              flights.map((flight) => (
                <FlightCard key={flight.flight_id} flight={flight} />
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}