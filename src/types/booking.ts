export interface Seat {
  seat_id: number;
  aircraft_id: number;
  seat_number: string;
  seat_class: 'ECONOMY' | 'BUSINESS' | 'FIRST';
  is_occupied?: boolean;
}

export interface Booking {
  booking_id: number;
  booking_reference: string;
  passenger_id: number;
  flight_id: number;
  booking_date: string;
  total_amount: number;
  booking_status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

export interface Ticket {
  ticket_id: number;
  booking_id: number;
  ticket_number: string;
  issue_date: string;
  ticket_status: 'VALID' | 'CANCELLED';
}

export interface Payment {
  payment_id: number;
  booking_id: number;
  amount: number;
  payment_method: string;
  payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transaction_reference: string;
  payment_date: string;
} 