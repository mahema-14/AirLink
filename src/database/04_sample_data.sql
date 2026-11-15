-- =========================================================
-- AIRLINK - 04: SAMPLE DATA (EXPANDED DATASET)
-- MySQL 8.0.16+
--
-- Includes:
--   5 airports
--   3 aircraft
--   90 seats
--   10 flights
--   1 admin + 15 passenger user accounts
--   15 passenger records
--   20 bookings, tickets, seat reservations and payments
--
-- IMPORTANT:
-- Run this file ONCE, after 01, 02 and 03.
-- The flight IDs, flight numbers and airport codes must match
-- Member 2's Neo4j dataset.
-- Password hashes below are DEMO PLACEHOLDERS, not real hashes.
-- =========================================================

USE airlink;

-- ---------------------------------------------------------
-- 1. USERS: 1 ADMIN + 15 PASSENGER ACCOUNTS
-- ---------------------------------------------------------

INSERT INTO users
(user_id, full_name, email, password_hash, role)
VALUES
(1,  'AirLink Administrator', 'admin@airlink.demo', '$2b$demo_placeholder_admin', 'ADMIN'),
(2,  'Aarav Sharma',   'aarav@example.com',   '$2b$demo_placeholder_02', 'PASSENGER'),
(3,  'Diya Rao',       'diya@example.com',    '$2b$demo_placeholder_03', 'PASSENGER'),
(4,  'Kabir Mehta',    'kabir@example.com',   '$2b$demo_placeholder_04', 'PASSENGER'),
(5,  'Ananya Iyer',    'ananya@example.com',  '$2b$demo_placeholder_05', 'PASSENGER'),
(6,  'Rohan Das',      'rohan@example.com',   '$2b$demo_placeholder_06', 'PASSENGER'),
(7,  'Meera Nair',     'meera@example.com',   '$2b$demo_placeholder_07', 'PASSENGER'),
(8,  'Arjun Reddy',    'arjun@example.com',   '$2b$demo_placeholder_08', 'PASSENGER'),
(9,  'Ishita Kapoor',  'ishita@example.com',  '$2b$demo_placeholder_09', 'PASSENGER'),
(10, 'Vivaan Shah',    'vivaan@example.com',  '$2b$demo_placeholder_10', 'PASSENGER'),
(11, 'Sana Khan',      'sana@example.com',    '$2b$demo_placeholder_11', 'PASSENGER'),
(12, 'Aditya Menon',   'aditya@example.com',  '$2b$demo_placeholder_12', 'PASSENGER'),
(13, 'Kavya Joshi',    'kavya@example.com',   '$2b$demo_placeholder_13', 'PASSENGER'),
(14, 'Neil Fernandes', 'neil@example.com',    '$2b$demo_placeholder_14', 'PASSENGER'),
(15, 'Tara Sinha',     'tara@example.com',    '$2b$demo_placeholder_15', 'PASSENGER'),
(16, 'Dev Malhotra',   'dev@example.com',     '$2b$demo_placeholder_16', 'PASSENGER');

-- ---------------------------------------------------------
-- 2. AIRPORTS
-- These airport codes are shared with Neo4j.
-- ---------------------------------------------------------

INSERT INTO airports
(airport_id, airport_code, airport_name, city, country)
VALUES
(1, 'BLR', 'Kempegowda International Airport', 'Bengaluru', 'India'),
(2, 'DEL', 'Indira Gandhi International Airport', 'Delhi', 'India'),
(3, 'BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai', 'India'),
(4, 'HYD', 'Rajiv Gandhi International Airport', 'Hyderabad', 'India'),
(5, 'MAA', 'Chennai International Airport', 'Chennai', 'India');

-- ---------------------------------------------------------
-- 3. AIRCRAFT
-- ---------------------------------------------------------

INSERT INTO aircraft
(aircraft_id, aircraft_model, manufacturer, total_seats)
VALUES
(1, 'A320', 'Airbus', 30),
(2, 'B737-800', 'Boeing', 30),
(3, 'A321', 'Airbus', 30);

-- ---------------------------------------------------------
-- 4. PASSENGERS: 15 PASSENGER RECORDS
-- ---------------------------------------------------------

INSERT INTO passengers
(passenger_id, user_id, full_name, email, phone, passport_number)
VALUES
(1,  2,  'Aarav Sharma',   'aarav@example.com',   '9876500001', 'P1000001'),
(2,  3,  'Diya Rao',       'diya@example.com',    '9876500002', 'P1000002'),
(3,  4,  'Kabir Mehta',    'kabir@example.com',   '9876500003', 'P1000003'),
(4,  5,  'Ananya Iyer',    'ananya@example.com',  '9876500004', 'P1000004'),
(5,  6,  'Rohan Das',      'rohan@example.com',   '9876500005', 'P1000005'),
(6,  7,  'Meera Nair',     'meera@example.com',   '9876500006', 'P1000006'),
(7,  8,  'Arjun Reddy',    'arjun@example.com',   '9876500007', 'P1000007'),
(8,  9,  'Ishita Kapoor',  'ishita@example.com',  '9876500008', 'P1000008'),
(9,  10, 'Vivaan Shah',    'vivaan@example.com',  '9876500009', 'P1000009'),
(10, 11, 'Sana Khan',      'sana@example.com',    '9876500010', 'P1000010'),
(11, 12, 'Aditya Menon',   'aditya@example.com',  '9876500011', 'P1000011'),
(12, 13, 'Kavya Joshi',    'kavya@example.com',   '9876500012', 'P1000012'),
(13, 14, 'Neil Fernandes', 'neil@example.com',    '9876500013', 'P1000013'),
(14, 15, 'Tara Sinha',     'tara@example.com',    '9876500014', 'P1000014'),
(15, 16, 'Dev Malhotra',   'dev@example.com',     '9876500015', 'P1000015');

-- ---------------------------------------------------------
-- 5. SEATS: 30 SEATS PER AIRCRAFT
-- IDs are explicitly assigned for predictable references:
-- Aircraft 1 = seat IDs 1-30
-- Aircraft 2 = seat IDs 31-60
-- Aircraft 3 = seat IDs 61-90
-- Rows 1-5, seats A-F. Row 1 is Business; rows 2-5 Economy.
-- ---------------------------------------------------------

INSERT INTO seats (seat_id, aircraft_id, seat_number, seat_class)
SELECT
    (a.aircraft_id - 1) * 30 + (r.row_no - 1) * 6 + c.col_no,
    a.aircraft_id,
    CONCAT(r.row_no, c.seat_letter),
    CASE WHEN r.row_no = 1 THEN 'BUSINESS' ELSE 'ECONOMY' END
FROM aircraft a
CROSS JOIN (
    SELECT 1 AS row_no UNION ALL SELECT 2 UNION ALL SELECT 3
    UNION ALL SELECT 4 UNION ALL SELECT 5
) AS r
CROSS JOIN (
    SELECT 1 AS col_no, 'A' AS seat_letter
    UNION ALL SELECT 2, 'B'
    UNION ALL SELECT 3, 'C'
    UNION ALL SELECT 4, 'D'
    UNION ALL SELECT 5, 'E'
    UNION ALL SELECT 6, 'F'
) AS c
ORDER BY a.aircraft_id, r.row_no, c.col_no;

-- ---------------------------------------------------------
-- 6. FLIGHTS: SAME IDs / ROUTES AS MEMBER 2'S NEO4J DATA
-- These are illustrative project schedules, not live flights.
-- ---------------------------------------------------------

INSERT INTO flights
(flight_id, flight_number, aircraft_id, source_airport_id,
 destination_airport_id, departure_time, arrival_time,
 base_fare, flight_status)
VALUES
(101, 'AI101', 1, 1, 3, '2026-11-10 08:00:00', '2026-11-10 10:30:00', 4500.00, 'SCHEDULED'),
(102, 'AI102', 2, 3, 2, '2026-11-10 12:00:00', '2026-11-10 14:00:00', 5200.00, 'SCHEDULED'),
(103, 'AI103', 3, 1, 4, '2026-11-10 07:30:00', '2026-11-10 09:00:00', 3500.00, 'SCHEDULED'),
(104, 'AI104', 1, 4, 2, '2026-11-10 11:00:00', '2026-11-10 13:30:00', 4800.00, 'SCHEDULED'),
(105, 'AI105', 2, 1, 5, '2026-11-10 06:30:00', '2026-11-10 08:00:00', 3200.00, 'SCHEDULED'),
(106, 'AI106', 3, 5, 2, '2026-11-10 10:00:00', '2026-11-10 12:30:00', 4700.00, 'SCHEDULED'),
(107, 'AI107', 1, 1, 2, '2026-11-10 15:00:00', '2026-11-10 17:45:00', 6000.00, 'SCHEDULED'),
(108, 'AI108', 2, 2, 3, '2026-11-11 08:00:00', '2026-11-11 10:00:00', 5100.00, 'SCHEDULED'),
(109, 'AI109', 3, 3, 4, '2026-11-11 12:00:00', '2026-11-11 13:30:00', 3400.00, 'SCHEDULED'),
(110, 'AI110', 1, 4, 5, '2026-11-11 16:00:00', '2026-11-11 17:30:00', 3000.00, 'SCHEDULED');

-- ---------------------------------------------------------
-- 7. BOOKINGS: 20 BOOKINGS ACROSS 15 PASSENGERS
-- A passenger can make multiple bookings.
-- ---------------------------------------------------------

INSERT INTO bookings
(booking_id, booking_reference, passenger_id, flight_id,
 booking_date, total_amount, booking_status)
VALUES
(1,  'AL-DEMO-0001',  1, 101, '2026-11-01 10:00:00', 4500.00, 'CONFIRMED'),
(2,  'AL-DEMO-0002',  2, 101, '2026-11-01 11:00:00', 4500.00, 'CONFIRMED'),
(3,  'AL-DEMO-0003',  3, 101, '2026-11-01 12:00:00', 4500.00, 'CONFIRMED'),
(4,  'AL-DEMO-0004',  4, 102, '2026-11-02 09:00:00', 5200.00, 'CONFIRMED'),
(5,  'AL-DEMO-0005',  5, 102, '2026-11-02 10:00:00', 5200.00, 'CONFIRMED'),
(6,  'AL-DEMO-0006',  6, 103, '2026-11-02 12:00:00', 3500.00, 'CONFIRMED'),
(7,  'AL-DEMO-0007',  7, 103, '2026-11-02 13:00:00', 3500.00, 'CONFIRMED'),
(8,  'AL-DEMO-0008',  8, 104, '2026-11-03 09:00:00', 4800.00, 'CONFIRMED'),
(9,  'AL-DEMO-0009',  9, 104, '2026-11-03 10:00:00', 4800.00, 'CONFIRMED'),
(10, 'AL-DEMO-0010', 10, 105, '2026-11-03 11:00:00', 3200.00, 'CONFIRMED'),
(11, 'AL-DEMO-0011', 11, 105, '2026-11-03 12:00:00', 3200.00, 'CONFIRMED'),
(12, 'AL-DEMO-0012', 12, 106, '2026-11-04 09:00:00', 4700.00, 'CONFIRMED'),
(13, 'AL-DEMO-0013', 13, 106, '2026-11-04 10:00:00', 4700.00, 'CONFIRMED'),
(14, 'AL-DEMO-0014', 14, 107, '2026-11-04 11:00:00', 6000.00, 'CONFIRMED'),
(15, 'AL-DEMO-0015', 15, 107, '2026-11-04 12:00:00', 6000.00, 'CONFIRMED'),
(16, 'AL-DEMO-0016',  1, 108, '2026-11-05 09:00:00', 5100.00, 'CONFIRMED'),
(17, 'AL-DEMO-0017',  2, 109, '2026-11-05 10:00:00', 3400.00, 'CONFIRMED'),
(18, 'AL-DEMO-0018',  3, 110, '2026-11-05 11:00:00', 3000.00, 'CONFIRMED'),
(19, 'AL-DEMO-0019',  4, 110, '2026-11-05 12:00:00', 3000.00, 'CONFIRMED'),
(20, 'AL-DEMO-0020',  5, 110, '2026-11-05 13:00:00', 3000.00, 'CONFIRMED');

-- ---------------------------------------------------------
-- 8. TICKETS: ONE TICKET PER BOOKING
-- ---------------------------------------------------------

INSERT INTO tickets (booking_id, ticket_number, ticket_status)
VALUES
(1, 'TKT-AL-0001', 'VALID'),
(2, 'TKT-AL-0002', 'VALID'),
(3, 'TKT-AL-0003', 'VALID'),
(4, 'TKT-AL-0004', 'VALID'),
(5, 'TKT-AL-0005', 'VALID'),
(6, 'TKT-AL-0006', 'VALID'),
(7, 'TKT-AL-0007', 'VALID'),
(8, 'TKT-AL-0008', 'VALID'),
(9, 'TKT-AL-0009', 'VALID'),
(10, 'TKT-AL-0010', 'VALID'),
(11, 'TKT-AL-0011', 'VALID'),
(12, 'TKT-AL-0012', 'VALID'),
(13, 'TKT-AL-0013', 'VALID'),
(14, 'TKT-AL-0014', 'VALID'),
(15, 'TKT-AL-0015', 'VALID'),
(16, 'TKT-AL-0016', 'VALID'),
(17, 'TKT-AL-0017', 'VALID'),
(18, 'TKT-AL-0018', 'VALID'),
(19, 'TKT-AL-0019', 'VALID'),
(20, 'TKT-AL-0020', 'VALID');

-- ---------------------------------------------------------
-- 9. ACTIVE SEAT RESERVATIONS
-- Each flight has a different seat allocation.
-- Seat IDs must belong to the aircraft assigned to that flight.
-- ---------------------------------------------------------

INSERT INTO seat_reservations (booking_id, flight_id, seat_id)
VALUES
(1, 101, 2),  (2, 101, 3),  (3, 101, 4),
(4, 102, 32), (5, 102, 33),
(6, 103, 62), (7, 103, 63),
(8, 104, 2),  (9, 104, 3),
(10, 105, 32), (11, 105, 33),
(12, 106, 62), (13, 106, 63),
(14, 107, 4), (15, 107, 5),
(16, 108, 34),
(17, 109, 64),
(18, 110, 6), (19, 110, 7), (20, 110, 8);

-- ---------------------------------------------------------
-- 10. PAYMENT RECORDS
-- Demo transactions only. No real payment credentials stored.
-- ---------------------------------------------------------

INSERT INTO payments
(booking_id, amount, payment_method, payment_status, transaction_reference)
VALUES
(1, 4500.00, 'UPI', 'SUCCESSFUL', 'PAY-AL-0001'),
(2, 4500.00, 'CARD', 'SUCCESSFUL', 'PAY-AL-0002'),
(3, 4500.00, 'UPI', 'SUCCESSFUL', 'PAY-AL-0003'),
(4, 5200.00, 'UPI', 'SUCCESSFUL', 'PAY-AL-0004'),
(5, 5200.00, 'CARD', 'SUCCESSFUL', 'PAY-AL-0005'),
(6, 3500.00, 'NET_BANKING', 'SUCCESSFUL', 'PAY-AL-0006'),
(7, 3500.00, 'UPI', 'SUCCESSFUL', 'PAY-AL-0007'),
(8, 4800.00, 'CARD', 'SUCCESSFUL', 'PAY-AL-0008'),
(9, 4800.00, 'UPI', 'SUCCESSFUL', 'PAY-AL-0009'),
(10, 3200.00, 'UPI', 'SUCCESSFUL', 'PAY-AL-0010'),
(11, 3200.00, 'CARD', 'SUCCESSFUL', 'PAY-AL-0011'),
(12, 4700.00, 'NET_BANKING', 'SUCCESSFUL', 'PAY-AL-0012'),
(13, 4700.00, 'UPI', 'SUCCESSFUL', 'PAY-AL-0013'),
(14, 6000.00, 'CARD', 'SUCCESSFUL', 'PAY-AL-0014'),
(15, 6000.00, 'UPI', 'SUCCESSFUL', 'PAY-AL-0015'),
(16, 5100.00, 'UPI', 'SUCCESSFUL', 'PAY-AL-0016'),
(17, 3400.00, 'CARD', 'SUCCESSFUL', 'PAY-AL-0017'),
(18, 3000.00, 'UPI', 'SUCCESSFUL', 'PAY-AL-0018'),
(19, 3000.00, 'NET_BANKING', 'SUCCESSFUL', 'PAY-AL-0019'),
(20, 3000.00, 'UPI', 'SUCCESSFUL', 'PAY-AL-0020');

-- ---------------------------------------------------------
-- 11. VERIFY SAMPLE DATA COUNTS
-- ---------------------------------------------------------

SELECT 'users' AS table_name, COUNT(*) AS total_records FROM users
UNION ALL
SELECT 'airports', COUNT(*) FROM airports
UNION ALL
SELECT 'aircraft', COUNT(*) FROM aircraft
UNION ALL
SELECT 'passengers', COUNT(*) FROM passengers
UNION ALL
SELECT 'seats', COUNT(*) FROM seats
UNION ALL
SELECT 'flights', COUNT(*) FROM flights
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'tickets', COUNT(*) FROM tickets
UNION ALL
SELECT 'seat_reservations', COUNT(*) FROM seat_reservations
UNION ALL
SELECT 'payments', COUNT(*) FROM payments;

-- Show passenger list.
SELECT passenger_id, full_name, email
FROM passengers
ORDER BY passenger_id;

-- Show flight routes using airport codes.
SELECT
    f.flight_id,
    f.flight_number,
    src.airport_code AS source,
    dest.airport_code AS destination,
    f.departure_time,
    f.arrival_time
FROM flights f
JOIN airports src ON f.source_airport_id = src.airport_id
JOIN airports dest ON f.destination_airport_id = dest.airport_id
ORDER BY f.flight_id;