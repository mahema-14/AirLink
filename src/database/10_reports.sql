-- =========================================================
-- AIRLINK - 10: REPORTS AND PROCEDURE TESTS
-- Run after files 04, 07, 08 and 09.
-- Some procedure tests create new records or cancel bookings.
-- Read the comments before executing those tests.
-- =========================================================

USE airlink;

-- 1. Flight occupancy report.
SELECT *
FROM flight_occupancy_view
ORDER BY occupancy_percentage DESC;

-- 2. Flights with occupancy greater than 5 percent.
-- Use 70 instead after more sample bookings are added.
SELECT *
FROM flight_occupancy_view
WHERE occupancy_percentage > 5
ORDER BY occupancy_percentage DESC;

-- 3. Net revenue per flight.
SELECT *
FROM revenue_report_view
ORDER BY net_revenue DESC;

-- 4. Total successful payment revenue (before refunds).
SELECT SUM(amount) AS successful_payment_total
FROM payments
WHERE payment_status = 'SUCCESSFUL';

-- 5. Net collected revenue after simulated refunds.
SELECT
    SUM(CASE
        WHEN payment_status = 'SUCCESSFUL' THEN amount
        WHEN payment_status = 'REFUNDED' THEN -amount
        ELSE 0
    END) AS net_revenue
FROM payments;

-- 6. Passengers with the most bookings.
SELECT
    p.passenger_id,
    p.full_name,
    COUNT(b.booking_id) AS total_bookings
FROM passengers p
LEFT JOIN bookings b ON p.passenger_id = b.passenger_id
GROUP BY p.passenger_id, p.full_name
ORDER BY total_bookings DESC;

-- 7. Flights with more than one booking.
SELECT
    f.flight_number,
    COUNT(b.booking_id) AS booking_count
FROM flights f
JOIN bookings b ON f.flight_id = b.flight_id
GROUP BY f.flight_id, f.flight_number
HAVING COUNT(b.booking_id) > 1
ORDER BY booking_count DESC;

-- 8. Monthly revenue (based on payment date).
SELECT
    YEAR(payment_date) AS revenue_year,
    MONTH(payment_date) AS revenue_month,
    SUM(CASE
        WHEN payment_status = 'SUCCESSFUL' THEN amount
        WHEN payment_status = 'REFUNDED' THEN -amount
        ELSE 0
    END) AS net_revenue
FROM payments
GROUP BY YEAR(payment_date), MONTH(payment_date)
ORDER BY revenue_year, revenue_month;

-- 9. Subquery: passengers who have made at least one confirmed booking.
SELECT passenger_id, full_name
FROM passengers
WHERE passenger_id IN (
    SELECT passenger_id
    FROM bookings
    WHERE booking_status = 'CONFIRMED'
);

-- 10. Stored procedure tests.
CALL SearchFlights('BLR', 'DEL', '2026-11-10');

CALL GetFlightOccupancy(101);

CALL GenerateRevenueReport('2026-11-01', '2026-11-30');

-- 11. BOOKING PROCEDURE TEST.
-- This creates a new booking, ticket, active seat reservation and payment.
-- Aircraft 1 seats have IDs 1-30. Seat 1E is ID 5 in the sample data.
-- Run only once unless you choose another available seat.
SET @new_booking_id = NULL;
SET @new_booking_reference = NULL;

CALL BookTicket(
    1,                 -- passenger_id
    101,               -- flight_id
    5,                 -- seat_id: aircraft 1, seat 1E
    'UPI',
    @new_booking_id,
    @new_booking_reference
);

SELECT @new_booking_id AS new_booking_id,
       @new_booking_reference AS new_booking_reference;

SELECT *
FROM booking_details_view
WHERE booking_id = @new_booking_id;

-- 12. CANCELLATION PROCEDURE TEST.
-- This cancels the booking just created above, releases its seat
-- and marks its successful payment as refunded.
-- Execute after the booking procedure test in the same session.
CALL CancelBooking(@new_booking_id);

SELECT * FROM bookings
WHERE booking_id = @new_booking_id;

SELECT * FROM seat_reservations
WHERE booking_id = @new_booking_id;

SELECT * FROM booking_audit
WHERE booking_id = @new_booking_id;

SELECT * FROM payments
WHERE booking_id = @new_booking_id;