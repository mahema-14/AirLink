'use client';

import { useState } from 'react';
import { Search, MapPin, ArrowRightLeft, Sparkles, Calendar, Users, Plane, Hotel, Car, Tag } from 'lucide-react';

export default function FlightSearch({ onSearch }: { onSearch?: (data: any) => void }) {
  const [origin, setOrigin] = useState('DEL');
  const [destination, setDestination] = useState('BOM');
  const [mode, setMode] = useState<'sql' | 'graph'>('sql');
  const [activeTab, setActiveTab] = useState('flights');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch({ origin, destination, mode });
  };

  const swapCities = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  return (
    <div className="sky-floating-card p-6 md:p-8 max-w-6xl mx-auto relative z-30 shadow-2xl">
      {/* Top Category Tabs & Database Engine Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab('flights')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'flights' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plane className="w-4 h-4" /> Flights
          </button>
          <button
            onClick={() => setActiveTab('hotels')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'hotels' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Hotel className="w-4 h-4" /> Hotels
          </button>
          <button
            onClick={() => setActiveTab('cars')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'cars' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Car className="w-4 h-4" /> Cars
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'deals' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" /> Deals
          </button>
        </div>

        {/* Database Hybrid Switch */}
        <div className="flex bg-slate-100 p-1.5 rounded-full border border-slate-200">
          <button
            type="button"
            onClick={() => setMode('sql')}
            className={`px-4 py-1.5 text-xs font-extrabold rounded-full transition-all ${
              mode === 'sql' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Direct SQL
          </button>
          <button
            type="button"
            onClick={() => setMode('graph')}
            className={`px-4 py-1.5 text-xs font-extrabold rounded-full transition-all flex items-center gap-1.5 ${
              mode === 'graph' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Neo4j Graph
          </button>
        </div>
      </div>

      {/* Trip Mode Radios */}
      <div className="flex items-center justify-end gap-6 pt-4 pb-4 text-xs font-bold text-slate-600">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="trip" defaultChecked className="accent-blue-600 w-4 h-4" /> Round trip
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="trip" className="accent-blue-600 w-4 h-4" /> One way
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="trip" className="accent-blue-600 w-4 h-4" /> Multi-city
        </label>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* From */}
        <div className="md:col-span-3 sky-input-group">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">From</span>
          <div className="flex items-center gap-2 mt-0.5">
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value.toUpperCase())}
              placeholder="Origin Code (DEL)"
              className="w-full bg-transparent font-extrabold text-slate-900 text-sm uppercase outline-none"
            />
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center">
          <button
            type="button"
            onClick={swapCities}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 transition-all shadow-sm"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* To */}
        <div className="md:col-span-3 sky-input-group">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">To</span>
          <div className="flex items-center gap-2 mt-0.5">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
              placeholder="Destination Code (BOM)"
              className="w-full bg-transparent font-extrabold text-slate-900 text-sm uppercase outline-none"
            />
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </div>
        </div>

        {/* Date Selector */}
        <div className="md:col-span-2 sky-input-group">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Depart</span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-xs font-bold text-slate-900">Nov 12, 2026</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Search CTA */}
        <div className="md:col-span-3">
          <button
            type="submit"
            className="w-full sky-[#0f172a]-btn font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
          >
            <Search className="w-4 h-4" /> Search Flights
          </button>
        </div>
      </form>
    </div>
  );
}