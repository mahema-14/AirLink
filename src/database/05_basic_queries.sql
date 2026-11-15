-- =========================================================
-- AIRLINK - 05: BASIC DML AND JOIN QUERIES
-- Run after sample data has been inserted.
-- =========================================================

USE airlink;

-- 1. SELECT: list all flights with airport codes.
SELECT f.flight_id, f.flight_number,
       src.airport_code AS source,
       dest.airport_code AS destination,
       f.departure_time, f.arrival_time, f.base_fare,
       f.flight_status
FROM flights f
JOIN airports src ON f.source_airport_id = src.airport_id
JOIN airports dest ON f.destination_airport_id = dest.airport_id
ORDER BY f.departure_time;

-- 2. SELECT with WHERE: search direct flights by route and date.
SELECT f.flight_id, f.flight_number, f.departure_time,
       f.arrival_time, f.base_fare
FROM flights f
JOIN airports src ON f.source_airport_id = src.airport_id
JOIN airports dest ON f.destination_airport_id = dest.airport_id
WHERE src.airport_code = 'BLR'
  AND dest.airport_code = 'DEL'
  AND DATE(f.departure_time) = '2026-11-10'
  AND f.flight_status = 'SCHEDULED';

-- 3. JOIN: display passenger booking details.
SELECT b.booking_reference, p.full_name,
       f.flight_number, b.booking_date,
       b.total_amount, b.booking_status
FROM bookings b
JOIN passengers p ON b.passenger_id = p.passenger_id
JOIN flights f ON b.flight_id = f.flight_id
ORDER BY b.booking_date DESC;

-- 4. JOIN: display ticket and payment information.
SELECT b.booking_reference, t.ticket_number,
       pay.amount, pay.payment_method, pay.payment_status
FROM bookings b
LEFT JOIN tickets t ON b.booking_id = t.booking_id
LEFT JOIN payments pay ON b.booking_id = pay.booking_id
ORDER BY b.booking_id;

-- 5. NOT EXISTS: find available seats for flight 101.
SELECT s.seat_id, s.seat_number, s.seat_class
FROM flights f
JOIN seats s ON s.aircraft_id = f.aircraft_id
WHERE f.flight_id = 101
  AND NOT EXISTS (
      SELECT 1
      FROM seat_reservations sr
      WHERE sr.flight_id = f.flight_id
        AND sr.seat_id = s.seat_id
  )
ORDER BY s.seat_number;

-- 6. INSERT: add a demonstration airport.
-- Uncomment to execute; airport code must be unused.
-- INSERT INTO airports (airport_code, airport_name, city, country)
-- VALUES ('CCU', 'Netaji Subhas Chandra Bose International Airport',
--         'Kolkata', 'India');

-- 7. UPDATE: change a flight status.
-- Uncomment to execute, then inspect the result.
-- UPDATE flights
-- SET flight_status = 'DELAYED'
-- WHERE flight_id = 110;

-- 8. DELETE: delete an airport only if it is not referenced by flights.
-- This example is intentionally commented out.
-- DELETE FROM airports WHERE airport_code = 'CCU';