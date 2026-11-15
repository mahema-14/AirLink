import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function POST(request: Request) {
  try {
    const { fullName, email, password, role } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const [existing]: any = await pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 400 });
    }

    const passwordHash = `hashed_${password}`;
    const userRole = role || 'PASSENGER';

    const [result]: any = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [fullName, email, passwordHash, userRole]
    );

    return NextResponse.json({
      success: true,
      userId: result.insertId,
      message: 'User registered successfully.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}