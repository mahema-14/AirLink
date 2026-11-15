import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get('bookingId');

  try {
    let sql = 'SELECT * FROM payments';
    const params: any[] = [];

    if (bookingId) {
      sql += ' WHERE booking_id = ?';
      params.push(bookingId);
    }

    const [payments]: any = await pool.query(sql, params);
    return NextResponse.json({ payments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}