'use client';

import Link from 'next/link';
import { Plane, Clock } from 'lucide-react';

export interface FlightCardProps {
  flight: {
    flight_id: number;
    flight_number: string;
    origin_code: string;
    origin_city?: string;
    dest_code: string;
    dest_city?: string;
    departure_time: string;
    arrival_time: string;
    base_fare: number;
    flight_status: string;
  };
}

export default function FlightCard({ flight }: FlightCardProps) {
  return (
    <div className="sky-floating-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-500/40 transition-all">
      {/* Airline Branding */}
      <div className="flex items-center gap-4 min-w-[180px]">
        <div className="w-12 h-12 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center font-black text-lg shadow-sm">
          SA
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 text-base">{flight.flight_number}</span>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {flight.flight_status}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500">Skyward AirLink A320</span>
        </div>
      </div>

      {/* Flight Timing & Timeline */}
      <div className="flex items-center justify-between flex-grow max-w-md w-full">
        <div className="text-left">
          <p className="text-2xl font-black text-slate-900">{flight.origin_code}</p>
          <p className="text-xs font-semibold text-slate-500">{flight.origin_city || 'Origin'}</p>
          <p className="text-xs font-bold text-blue-600 mt-1">10:00 AM</p>
        </div>

        <div className="flex flex-col items-center px-4">
          <span className="text-[11px] font-extrabold text-slate-400 mb-1">2h 15m</span>
          <div className="flex items-center gap-2 w-28">
            <div className="h-[2px] bg-slate-200 flex-grow" />
            <Plane className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div className="h-[2px] bg-slate-200 flex-grow" />
          </div>
          <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider mt-1">Non-Stop</span>
        </div>

        <div className="text-right">
          <p className="text-2xl font-black text-slate-900">{flight.dest_code}</p>
          <p className="text-xs font-semibold text-slate-500">{flight.dest_city || 'Destination'}</p>
          <p className="text-xs font-bold text-blue-600 mt-1">12:15 PM</p>
        </div>
      </div>

      {/* Price & Action Button */}
      <div className="flex flex-col items-end min-w-[160px] pt-4 md:pt-0 border-t md:border-t-0 border-slate-200 w-full md:w-auto">
        <span className="text-xs font-semibold text-slate-400">Standard Economy</span>
        <span className="text-3xl font-black text-slate-900">${flight.base_fare}</span>
        <Link
          href={`/booking?flightId=${flight.flight_id}`}
          className="mt-2 w-full md:w-auto sky-[#0f172a]-btn font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider text-center"
        >
          Select Flight
        </Link>
      </div>
    </div>
  );
}