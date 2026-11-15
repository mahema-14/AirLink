'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FlightCard from '@/components/FlightCard';
import Footer from '@/components/Footer';
import { Plane } from 'lucide-react';

export default function FlightsPage() {
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/flights')
      .then((res) => res.json())
      .then((data) => {
        if (data.flights) setFlights(data.flights);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />
      <div className="sky-hero-bg text-white py-14 px-6 text-center">
        <h1 className="text-3xl font-black">All Scheduled Routes</h1>
        <p className="text-blue-100 text-sm mt-1">Explore direct flights across the Skyward network.</p>
      </div>

      <main className="max-w-6xl mx-auto px-4 w-full flex-grow py-10 space-y-6">
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-semibold">Loading flight database...</div>
        ) : (
          <div className="space-y-4">
            {flights.map((flight) => (
              <FlightCard key={flight.flight_id} flight={flight} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}