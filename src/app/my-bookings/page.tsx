'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BookingCard from '@/components/BookingCard';
import Footer from '@/components/Footer';
import { Ticket } from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBookings([
      {
        booking_id: 1,
        booking_reference: 'BK-89A4B12C',
        ticket_number: 'TK-90218A94',
        passenger_name: 'Jane Doe',
        flight_number: 'AL-105',
        origin_code: 'BLR',
        dest_code: 'MAA',
        seat_number: '2A',
        seat_class: 'ECONOMY',
        booking_status: 'CONFIRMED',
        total_amount: 250.00,
        payment_method: 'CREDIT_CARD',
        transaction_reference: 'TXN-4A91B008C2',
      },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 w-full flex-grow py-10 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Ticket className="w-8 h-8 text-blue-600" /> My Flight Reservations
          </h1>
          <p className="text-slate-500 font-semibold text-sm mt-1">
            View issued tickets, seat assignments, and payment transaction details stored in MySQL.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-semibold text-sm">Fetching reservation records...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="sky-floating-card p-12 text-center text-slate-500 font-medium">
            No active flight bookings found for your account.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.booking_id} booking={booking} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}