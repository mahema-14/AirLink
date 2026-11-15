import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');

    return NextResponse.json({
      ok: true,
      message: 'Database connection is working.',
      result: rows,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Database connection failed.',
        error: error?.message || 'Unknown database error',
      },
      { status: 500 }
    );
  }
}
