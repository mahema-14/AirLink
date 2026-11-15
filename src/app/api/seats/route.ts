import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flightId = searchParams.get('flightId');

  if (!flightId) {
    return NextResponse.json({ error: 'Flight ID parameter is required' }, { status: 400 });
  }

  try {
    const sql = `
      SELECT s.seat_id, s.aircraft_id, s.seat_number, s.seat_class,
             CASE WHEN sr.reservation_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_occupied
      FROM seats s
      JOIN flights f ON s.aircraft_id = f.aircraft_id
      LEFT JOIN seat_reservations sr ON s.seat_id = sr.seat_id AND sr.flight_id = f.flight_id
      WHERE f.flight_id = ?
      ORDER BY s.seat_number ASC
    `;

    const [seats]: any = await pool.query(sql, [flightId]);
    return NextResponse.json({ seats });
  } catch (error: any) {
    console.error('API /api/seats Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch seats' }, { status: 500 });
  }
}