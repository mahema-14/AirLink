'use client';

import { useState } from 'react';
import { Armchair } from 'lucide-react';

interface SeatMapProps {
  occupiedSeats?: string[];
  onSelectSeat?: (seat: string) => void;
}

export default function SeatMap({ occupiedSeats = ['1A', '2C', '3D'], onSelectSeat }: SeatMapProps) {
  const rows = ['1', '2', '3', '4', '5', '6'];
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const handleSeatClick = (seat: string) => {
    if (occupiedSeats.includes(seat)) return;
    setSelectedSeat(seat);
    if (onSelectSeat) onSelectSeat(seat);
  };

  return (
    <div className="sky-floating-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Armchair className="w-5 h-5 text-blue-600" /> Airbus A320 Cabin Layout
        </h4>
        <div className="flex gap-4 text-xs font-bold">
          <span className="flex items-center gap-1 text-slate-600"><span className="w-3 h-3 bg-white border border-slate-400 rounded" /> Available</span>
          <span className="flex items-center gap-1 text-emerald-700"><span className="w-3 h-3 bg-blue-600 rounded" /> Selected</span>
          <span className="flex items-center gap-1 text-slate-400"><span className="w-3 h-3 bg-slate-300 rounded" /> Reserved</span>
        </div>
      </div>

      <div className="sky-seat-grid">
        {rows.map((row) =>
          cols.map((col) => {
            const seatId = `${row}${col}`;
            const isOccupied = occupiedSeats.includes(seatId);
            const isSelected = selectedSeat === seatId;

            let btnClass = 'sky-seat-item seat-open';
            if (isOccupied) btnClass = 'sky-seat-item seat-taken';
            if (isSelected) btnClass = 'sky-seat-item seat-chosen';

            return (
              <button
                key={seatId}
                disabled={isOccupied}
                onClick={() => handleSeatClick(seatId)}
                className={btnClass}
              >
                {seatId}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}