export interface Passenger {
  passenger_id?: number;
  user_id?: number | null;
  full_name: string;
  email: string;
  phone?: string;
  passport_number?: string;
}