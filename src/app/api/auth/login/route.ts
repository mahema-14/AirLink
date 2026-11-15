import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const [users]: any = await pool.query(
      'SELECT user_id, full_name, email, role, password_hash FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const user = users[0];
    if (user.password_hash !== `hashed_${password}` && user.password_hash !== password) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        userId: user.user_id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}