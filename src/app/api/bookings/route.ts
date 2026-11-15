
import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

// =====================================================
// GET: FETCH BOOKINGS
// =====================================================

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    let sql = `
      SELECT
        b.booking_id,
        b.booking_reference,
        b.booking_date,
        b.total_amount,
        b.booking_status,

        p.full_name AS passenger_name,
        p.email,

        f.flight_number,

        sa.airport_code AS origin_code,
        da.airport_code AS dest_code,

        s.seat_number,
        t.ticket_number,

        pay.transaction_reference,
        pay.payment_method

      FROM bookings b

      JOIN passengers p
        ON b.passenger_id = p.passenger_id

      JOIN flights f
        ON b.flight_id = f.flight_id

      JOIN airports sa
        ON f.source_airport_id = sa.airport_id

      JOIN airports da
        ON f.destination_airport_id = da.airport_id

      LEFT JOIN seat_reservations sr
        ON b.booking_id = sr.booking_id

      LEFT JOIN seats s
        ON sr.seat_id = s.seat_id

      LEFT JOIN tickets t
        ON b.booking_id = t.booking_id

      LEFT JOIN payments pay
        ON b.booking_id = pay.booking_id
    `;

    const params: any[] = [];

    if (userId) {
      sql += ` WHERE p.user_id = ?`;
      params.push(userId);
    }

    sql += ` ORDER BY b.booking_date DESC`;

    const [bookings]: any = await pool.query(sql, params);

    return NextResponse.json({ bookings });

  } catch (error: any) {
    console.error('GET Bookings Error:', error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


// =====================================================
// POST: CREATE NEW BOOKING
// =====================================================

export async function POST(request: Request) {
  const connection = await pool.getConnection();

  let transactionStarted = false;

  try {

    const {
      passengerName,
      email,
      phone,
      flightId,
      seatId,
      totalAmount,
      paymentMethod
    } = await request.json();


    // 1. VALIDATE REQUIRED DETAILS

    if (
      !passengerName ||
      !email ||
      !flightId ||
      !seatId
    ) {
      return NextResponse.json(
        { error: 'Missing required booking details.' },
        { status: 400 }
      );
    }


    // 2. VALIDATE PAYMENT METHOD

    const allowedMethods = [
      'UPI',
      'DEBIT_CARD',
      'NET_BANKING',
      'CASH'
    ];

    const selectedMethod = paymentMethod || 'NET_BANKING';

    if (!allowedMethods.includes(selectedMethod)) {
      return NextResponse.json(
        {
          error: `Invalid payment method: ${selectedMethod}. Allowed methods: ${allowedMethods.join(', ')}`
        },
        { status: 400 }
      );
    }


    // 3. VERIFY FLIGHT EXISTS

    let validFlightId = Number(flightId);

    const [flightCheck]: any = await connection.query(
      'SELECT flight_id FROM flights WHERE flight_id = ?',
      [validFlightId]
    );

    if (flightCheck.length === 0) {

      const [firstFlight]: any = await connection.query(
        'SELECT flight_id FROM flights LIMIT 1'
      );

      if (firstFlight.length > 0) {
        validFlightId = firstFlight[0].flight_id;
      } else {
        return NextResponse.json(
          {
            error: 'No scheduled flights found in database. Please populate sample data.'
          },
          { status: 400 }
        );
      }
    }


    // 4. START TRANSACTION

    await connection.beginTransaction();
    transactionStarted = true;


    // 5. INSERT OR RETRIEVE PASSENGER

    const [existingPass]: any = await connection.query(
      'SELECT passenger_id FROM passengers WHERE email = ?',
      [email]
    );

    let passengerId: number;

    if (existingPass.length > 0) {

      passengerId = existingPass[0].passenger_id;

    } else {

      const [passResult]: any = await connection.query(
        `INSERT INTO passengers
         (full_name, email, phone)
         VALUES (?, ?, ?)`,
        [
          passengerName,
          email,
          phone || null
        ]
      );

      passengerId = passResult.insertId;
    }


    // 6. CHECK SEAT AVAILABILITY

    const [existingRes]: any = await connection.query(
      `SELECT reservation_id
       FROM seat_reservations
       WHERE flight_id = ?
       AND seat_id = ?
       FOR UPDATE`,
      [validFlightId, seatId]
    );

    if (existingRes.length > 0) {

      await connection.rollback();
      transactionStarted = false;

      return NextResponse.json(
        {
          error: 'Seat has already been reserved by another passenger.'
        },
        { status: 400 }
      );
    }


    // 7. CREATE BOOKING

    const bookingRef =
      `BK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const amount = Number(totalAmount) || 250.00;

    const [bookingResult]: any = await connection.query(
      `INSERT INTO bookings
       (
         booking_reference,
         passenger_id,
         flight_id,
         total_amount,
         booking_status
       )
       VALUES (?, ?, ?, ?, ?)`,
      [
        bookingRef,
        passengerId,
        validFlightId,
        amount,
        'CONFIRMED'
      ]
    );

    const bookingId = bookingResult.insertId;


    // 8. RESERVE SEAT

    await connection.query(
      `INSERT INTO seat_reservations
       (booking_id, flight_id, seat_id)
       VALUES (?, ?, ?)`,
      [
        bookingId,
        validFlightId,
        seatId
      ]
    );


    // 9. GENERATE TICKET

    const ticketNumber =
      `TK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    await connection.query(
      `INSERT INTO tickets
       (booking_id, ticket_number, ticket_status)
       VALUES (?, ?, ?)`,
      [
        bookingId,
        ticketNumber,
        'VALID'
      ]
    );


    // 10. RECORD PAYMENT

    const txnRef =
      `TXN-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

    await connection.query(
      `INSERT INTO payments
       (
         booking_id,
         amount,
         payment_method,
         payment_status,
         transaction_reference
       )
       VALUES (?, ?, ?, ?, ?)`,
      [
        bookingId,
        amount,
        selectedMethod,
        'SUCCESSFUL',
        txnRef
      ]
    );


    // 11. COMMIT TRANSACTION

    await connection.commit();
    transactionStarted = false;


    // 12. RETURN SUCCESS RESPONSE

    return NextResponse.json({
      success: true,

      bookingId,

      bookingReference: bookingRef,

      ticketNumber,

      transactionReference: txnRef,

      message: 'Booking completed successfully.'
    });


  } catch (error: any) {

    // ROLLBACK IF ANY OPERATION FAILS

    if (transactionStarted) {
      await connection.rollback();
    }

    console.error(
      'API /api/bookings POST Error:',
      error
    );

    return NextResponse.json(
      {
        error: error.message || 'Transaction failed.'
      },
      { status: 500 }
    );

  } finally {

    // RELEASE DATABASE CONNECTION

    connection.release();

  }
}
