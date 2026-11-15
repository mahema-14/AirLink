-- =========================================================
-- AIRLINK - 07: VIEWS
-- Run after tables and sample data exist.
-- =========================================================

USE airlink;

CREATE OR REPLACE VIEW available_flights_view AS
SELECT
    f.flight_id,
    f.flight_number,
    src.airport_code AS source_code,
    src.city AS source_city,
    dest.airport_code AS destination_code,
    dest.city AS destination_city,
    f.departure_time,
    f.arrival_time,
    f.base_fare,
    f.flight_status,
    ac.total_seats,
    COALESCE(reserved.reserved_seats, 0) AS booked_seats,
    ac.total_seats - COALESCE(reserved.reserved_seats, 0) AS available_seats
FROM flights f
JOIN airports src ON f.source_airport_id = src.airport_id
JOIN airports dest ON f.destination_airport_id = dest.airport_id
JOIN aircraft ac ON f.aircraft_id = ac.aircraft_id
LEFT JOIN (
    SELECT flight_id, COUNT(*) AS reserved_seats
    FROM seat_reservations
    GROUP BY flight_id
) reserved ON reserved.flight_id = f.flight_id
WHERE f.flight_status IN ('SCHEDULED', 'DELAYED');

CREATE OR REPLACE VIEW booking_details_view AS
SELECT
    b.booking_id,
    b.booking_reference,
    p.passenger_id,
    p.full_name AS passenger_name,
    p.email AS passenger_email,
    f.flight_id,
    f.flight_number,
    src.airport_code AS source_code,
    dest.airport_code AS destination_code,
    b.booking_date,
    b.total_amount,
    b.booking_status,
    t.ticket_number,
    t.ticket_status
FROM bookings b
JOIN passengers p ON b.passenger_id = p.passenger_id
JOIN flights f ON b.flight_id = f.flight_id
JOIN airports src ON f.source_airport_id = src.airport_id
JOIN airports dest ON f.destination_airport_id = dest.airport_id
LEFT JOIN tickets t ON b.booking_id = t.booking_id;

CREATE OR REPLACE VIEW flight_occupancy_view AS
SELECT
    f.flight_id,
    f.flight_number,
    ac.total_seats,
    COUNT(sr.reservation_id) AS booked_seats,
    ac.total_seats - COUNT(sr.reservation_id) AS available_seats,
    ROUND(
        COUNT(sr.reservation_id) * 100.0 / ac.total_seats,
        2
    ) AS occupancy_percentage
FROM flights f
JOIN aircraft ac ON f.aircraft_id = ac.aircraft_id
LEFT JOIN seat_reservations sr ON f.flight_id = sr.flight_id
GROUP BY f.flight_id, f.flight_number, ac.total_seats;

CREATE OR REPLACE VIEW revenue_report_view AS
SELECT
    f.flight_id,
    f.flight_number,
    COUNT(DISTINCT CASE
        WHEN pay.payment_status = 'SUCCESSFUL' THEN pay.payment_id
    END) AS successful_payment_count,
    COALESCE(SUM(CASE
        WHEN pay.payment_status = 'SUCCESSFUL' THEN pay.amount
        WHEN pay.payment_status = 'REFUNDED' THEN -pay.amount
        ELSE 0
    END), 0) AS net_revenue
FROM flights f
LEFT JOIN bookings b ON f.flight_id = b.flight_id
LEFT JOIN payments pay ON b.booking_id = pay.booking_id
GROUP BY f.flight_id, f.flight_number;

-- Test the views.
SELECT * FROM available_flights_view;
SELECT * FROM booking_details_view;
SELECT * FROM flight_occupancy_view;
SELECT * FROM revenue_report_view;