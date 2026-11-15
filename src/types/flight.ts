export interface Airport {
  airport_id: number;
  airport_code: string;
  airport_name: string;
  city: string;
  country: string;
}

export interface Flight {
  flight_id: number;
  flight_number: string;
  aircraft_id: number;
  source_airport_id: number;
  destination_airport_id: number;
  departure_time: string;
  arrival_time: string;
  base_fare: number;
  flight_status: 'SCHEDULED' | 'BOARDING' | 'DEPARTED' | 'CANCELLED';
  origin_code?: string;
  origin_city?: string;
  dest_code?: string;
  dest_city?: string;
}