'use client';

import { Ticket, Plane, CreditCard, User } from 'lucide-react';

export interface BookingCardProps {
  booking: {
    booking_id: number;
    booking_reference: string;
    passenger_name?: string;
    email?: string;
    flight_number: string;
    origin_code: string;
    dest_code: string;
    departure_time?: string;
    seat_number: string;
    seat_class?: string;
    ticket_number: string;
    booking_status: string;
    total_amount: number;
    payment_method?: string;
    transaction_reference?: string;
  };
  onCancel?: (bookingId: number) => void;
}

export default function BookingCard({ booking, onCancel }: BookingCardProps) {
  const isConfirmed = booking.booking_status === 'CONFIRMED' || booking.booking_status === 'COMPLETED';

  return (
    <div className="sky-floating-card p-6 border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase block">PNR Reference</span>
            <span className="font-mono text-blue-700 font-bold text-base tracking-wide">
              {booking.booking_reference}
            </span>
          </div>
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full font-mono font-bold border ${
            isConfirmed
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-rose-100 text-rose-800 border-rose-300'
          }`}
        >
          {booking.booking_status}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <span className="text-[10px] text-slate-400 font-black uppercase block">Flight</span>
          <span className="font-mono text-slate-900 font-bold text-sm flex items-center gap-1.5 mt-0.5">
            <Plane className="w-3.5 h-3.5 text-blue-600" /> {booking.flight_number}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-black uppercase block">Route</span>
          <span className="text-slate-900 font-bold text-sm mt-0.5 block">
            {booking.origin_code} → {booking.dest_code}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-black uppercase block">Seat</span>
          <span className="font-mono text-emerald-700 font-bold text-sm mt-0.5 block">
            Seat {booking.seat_number}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-black uppercase block">Issued Ticket</span>
          <span className="font-mono text-slate-700 text-xs mt-0.5 block truncate">
            {booking.ticket_number}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 pt-1 gap-2">
        {booking.passenger_name && (
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Passenger: <strong className="text-slate-800">{booking.passenger_name}</strong></span>
          </div>
        )}

        <div className="flex items-center gap-3 font-mono">
          <span className="flex items-center gap-1 text-slate-700 font-bold">
            <CreditCard className="w-3.5 h-3.5 text-slate-400" /> ${booking.total_amount.toFixed(2)}
          </span>
          {booking.transaction_reference && (
            <span className="text-slate-400 text-[11px]">
              Txn: {booking.transaction_reference}
            </span>
          )}
        </div>
      </div>

      {onCancel && isConfirmed && (
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => onCancel(booking.booking_id)}
            className="text-xs text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-all font-bold"
          >
            Cancel Booking & Refund
          </button>
        </div>
      )}
    </div>
  );
}