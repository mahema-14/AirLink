
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SeatMap from '@/components/SeatMap';
import Footer from '@/components/Footer';
import {
  CheckCircle2,
  AlertCircle,
  Ticket,
  CreditCard,
  User,
  Mail,
  Phone,
  Plane,
  Armchair
} from 'lucide-react';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const flightId = searchParams.get('flightId') || '1';

  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<any>(null);

  const [passengerName, setPassengerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Payment method must match MySQL CHECK constraint
  const [paymentMethod, setPaymentMethod] = useState('NET_BANKING');

  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [error, setError] = useState('');

  // Fetch available seats
  useEffect(() => {
    fetchSeats();
  }, [flightId]);

  const fetchSeats = async () => {
    try {
      const res = await fetch(`/api/seats?flightId=${flightId}`);
      const data = await res.json();

      if (data.seats) {
        setSeats(data.seats);
      }
    } catch (err) {
      console.error('Error fetching seats:', err);
    }
  };

  // Handle seat selection
  const handleSeatSelect = (seatNumber: string) => {
    const seatObj = seats.find(
      (s) => s.seat_number === seatNumber
    );

    setSelectedSeat(
      seatObj || {
        seat_id: 1,
        seat_number: seatNumber
      }
    );
  };

  // Submit booking
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSeat) {
      setError('Please select an available seat from the cabin layout.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          passengerName,
          email,
          phone,
          flightId: parseInt(flightId, 10),
          seatId: selectedSeat.seat_id,
          totalAmount: 250.00,
          paymentMethod
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBookingSuccess(data);
      } else {
        setError(data.error || 'Failed to complete transaction.');
      }

    } catch (err) {
      console.error('Booking error:', err);
      setError('An error occurred while executing the transaction.');
    } finally {
      setLoading(false);
    }
  };

  const occupiedSeatNumbers = seats
    .filter((s) => s.is_occupied)
    .map((s) => s.seat_number);

  return (
    <main className="max-w-6xl mx-auto px-4 w-full flex-grow py-10 space-y-8">

      {/* Page Heading */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Plane className="w-7 h-7 text-blue-600" />
          Complete Flight Reservation
        </h1>

        <p className="text-slate-500 font-semibold text-sm mt-1">
          Choose your seat and enter passenger details to process your ticket.
        </p>
      </div>

      {bookingSuccess ? (

        /* BOOKING SUCCESS */

        <div className="sky-floating-card p-8 border-emerald-300 bg-emerald-50 max-w-2xl mx-auto text-center space-y-6">

          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Booking Confirmed!
            </h2>

            <p className="text-slate-600 font-medium text-sm mt-1">
              Transactional record stored across MySQL relational tables.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 text-left space-y-3 font-mono text-sm shadow-sm">

            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">PNR Reference:</span>
              <span className="text-blue-700 font-bold">
                {bookingSuccess.bookingReference}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Ticket Number:</span>
              <span className="text-emerald-700 font-bold">
                {bookingSuccess.ticketNumber}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Transaction Ref:</span>
              <span className="text-slate-800">
                {bookingSuccess.transactionReference}
              </span>
            </div>

          </div>

          <button
            onClick={() => router.push('/my-bookings')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20"
          >
            View Issued Ticket
          </button>

        </div>

      ) : (

        /* BOOKING FORM */

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: SEAT MAP */}

          <div className="lg:col-span-7 space-y-4">

            <SeatMap
              occupiedSeats={occupiedSeatNumbers}
              onSelectSeat={handleSeatSelect}
            />

            {selectedSeat && (
              <div className="sky-floating-card p-4 flex items-center justify-between border-blue-200 bg-blue-50/50">

                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Armchair className="w-4 h-4 text-blue-600" />
                  Selected Seat Assignment:
                </span>

                <span className="font-mono text-lg font-black text-blue-700 bg-white px-3 py-1 rounded-lg border border-blue-300">
                  Seat {selectedSeat.seat_number}
                </span>

              </div>
            )}

          </div>

          {/* RIGHT: PASSENGER DETAILS */}

          <form
            onSubmit={handleSubmitBooking}
            className="lg:col-span-5 sky-floating-card p-6 space-y-5"
          >

            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <User className="w-5 h-5 text-blue-600" />
              Passenger Details
            </h3>

            {/* Error Message */}

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">

                <AlertCircle className="w-4 h-4 flex-shrink-0" />

                {error}

              </div>
            )}

            <div className="space-y-4">

              {/* FULL NAME */}

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />

                  <input
                    required
                    type="text"
                    placeholder="Jane Doe"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 text-sm font-semibold focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />

                  <input
                    required
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 text-sm font-semibold focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              {/* MOBILE PHONE */}

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Mobile Phone
                </label>

                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />

                  <input
                    required
                    type="tel"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 text-sm font-semibold focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              {/* PAYMENT GATEWAY */}

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Payment Gateway
                </label>

                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />

                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 text-sm font-semibold focus:bg-white focus:border-blue-600 outline-none"
                  >
                    <option value="NET_BANKING">
                      Net Banking
                    </option>

                    <option value="UPI">
                      UPI Payment (GPay/PhonePe)
                    </option>

                  </select>
                </div>
              </div>

            </div>

            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full sky-[#0f172a]-btn font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-4"
            >

              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Ticket className="w-4 h-4" />
                  Confirm & Issue Ticket
                </>
              )}

            </button>

          </form>

        </div>
      )}

    </main>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">

      <Navbar />

      <Suspense
        fallback={
          <div className="text-center py-20 text-slate-500 font-bold">
            Loading booking engine...
          </div>
        }
      >
        <BookingContent />
      </Suspense>

      <Footer />

    </div>
  );
}
