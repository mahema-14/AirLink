import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    const [airports]: any = await pool.query('SELECT * FROM airports ORDER BY city ASC');
    return NextResponse.json({ airports });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}