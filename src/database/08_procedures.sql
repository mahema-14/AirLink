-- =========================================================
-- AIRLINK - 08: STORED PROCEDURES
-- Run after tables and constraints exist.
-- Triggers are created in file 09; procedures can be created
-- before triggers, but call BookTicket only after file 09.
-- =========================================================

USE airlink;


DROP PROCEDURE IF EXISTS SearchFlights;
DROP PROCEDURE IF EXISTS BookTicket;
DROP PROCEDURE IF EXISTS CancelBooking;
DROP PROCEDURE IF EXISTS GetFlightOccupancy;
DROP PROCEDURE IF EXISTS GenerateRevenueReport;

DELIMITER $$

-- 1. Search direct flights by airport codes and travel date.
CREATE PROCEDURE SearchFlights(
    IN p_source_code CHAR(3),
    IN p_destination_code CHAR(3),
    IN p_travel_date DATE
)
BEGIN
    SELECT *
    FROM available_flights_view
    WHERE source_code = p_source_code
      AND destination_code = p_destination_code
      AND DATE(departure_time) = p_travel_date
      AND available_seats > 0
    ORDER BY departure_time;
END$$

-- 2. Book one passenger on one flight and allocate one seat.
-- This demonstration records a successful payment; it does not
-- connect to a real payment gateway.
CREATE PROCEDURE BookTicket(
    IN p_passenger_id INT,
    IN p_flight_id INT,
    IN p_seat_id INT,
    IN p_payment_method VARCHAR(30),
    OUT p_booking_id INT,
    OUT p_booking_reference VARCHAR(36)
)
BEGIN
    DECLARE v_flight_count INT DEFAULT 0;
    DECLARE v_aircraft_id INT DEFAULT NULL;
    DECLARE v_flight_status VARCHAR(20) DEFAULT NULL;
    DECLARE v_fare DECIMAL(10,2) DEFAULT NULL;
    DECLARE v_seat_aircraft_id INT DEFAULT NULL;
    DECLARE v_seat_count INT DEFAULT 0;
    DECLARE v_passenger_count INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET p_booking_id = NULL;
    SET p_booking_reference = NULL;

    START TRANSACTION;

    -- Lock the flight row so simultaneous bookings on this flight
    -- are serialized during this booking operation.
    SELECT COUNT(*)
      INTO v_flight_count
    FROM flights
    WHERE flight_id = p_flight_id;

    IF v_flight_count = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Flight does not exist';
    END IF;

    SELECT aircraft_id, flight_status, base_fare
      INTO v_aircraft_id, v_flight_status, v_fare
    FROM flights
    WHERE flight_id = p_flight_id
    FOR UPDATE;

    IF v_flight_status <> 'SCHEDULED' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Flight is not open for booking';
    END IF;

    SELECT COUNT(*)
      INTO v_passenger_count
    FROM passengers
    WHERE passenger_id = p_passenger_id;

    IF v_passenger_count = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Passenger does not exist';
    END IF;

    SELECT COUNT(*), MAX(aircraft_id)
      INTO v_seat_count, v_seat_aircraft_id
    FROM seats
    WHERE seat_id = p_seat_id;

    IF v_seat_count = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Seat does not exist';
    END IF;

    IF v_seat_aircraft_id <> v_aircraft_id THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Selected seat does not belong to this flight aircraft';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM seat_reservations
        WHERE flight_id = p_flight_id
          AND seat_id = p_seat_id
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Seat is already reserved for this flight';
    END IF;

    SET p_booking_reference = UUID();

    INSERT INTO bookings
        (booking_reference, passenger_id, flight_id,
         total_amount, booking_status)
    VALUES
        (p_booking_reference, p_passenger_id, p_flight_id,
         v_fare, 'CONFIRMED');

    SET p_booking_id = LAST_INSERT_ID();

    INSERT INTO seat_reservations (booking_id, flight_id, seat_id)
    VALUES (p_booking_id, p_flight_id, p_seat_id);

    INSERT INTO tickets (booking_id, ticket_number, ticket_status)
    VALUES (p_booking_id, UUID(), 'VALID');

    INSERT INTO payments
        (booking_id, amount, payment_method, payment_status, transaction_reference)
    VALUES
        (p_booking_id, v_fare, p_payment_method, 'SUCCESSFUL', UUID());

    COMMIT;
END$$

-- 3. Cancel a booking, cancel its ticket, release its active seat,
-- and mark successful payments as refunded for this simulation.
CREATE PROCEDURE CancelBooking(
    IN p_booking_id INT
)
BEGIN
    DECLARE v_booking_status VARCHAR(20) DEFAULT NULL;
    DECLARE v_booking_count INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT COUNT(*)
      INTO v_booking_count
    FROM bookings
    WHERE booking_id = p_booking_id;

    IF v_booking_count = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Booking does not exist';
    END IF;

    SELECT booking_status
      INTO v_booking_status
    FROM bookings
    WHERE booking_id = p_booking_id
    FOR UPDATE;

    IF v_booking_status = 'CANCELLED' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Booking is already cancelled';
    END IF;

    UPDATE bookings
    SET booking_status = 'CANCELLED'
    WHERE booking_id = p_booking_id;

    UPDATE tickets
    SET ticket_status = 'CANCELLED'
    WHERE booking_id = p_booking_id;

    DELETE FROM seat_reservations
    WHERE booking_id = p_booking_id;

    UPDATE payments
    SET payment_status = 'REFUNDED'
    WHERE booking_id = p_booking_id
      AND payment_status = 'SUCCESSFUL';

    COMMIT;
END$$

-- 4. Return occupancy details for one flight.
CREATE PROCEDURE GetFlightOccupancy(
    IN p_flight_id INT
)
BEGIN
    SELECT *
    FROM flight_occupancy_view
    WHERE flight_id = p_flight_id;
END$$

-- 5. Return revenue report for all flights or a selected date range.
CREATE PROCEDURE GenerateRevenueReport(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    IF p_start_date IS NULL OR p_end_date IS NULL
       OR p_end_date < p_start_date THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Provide a valid report date range';
    END IF;

    SELECT
        f.flight_id,
        f.flight_number,
        DATE(f.departure_time) AS travel_date,
        COALESCE(SUM(CASE
            WHEN pay.payment_status = 'SUCCESSFUL' THEN pay.amount
            WHEN pay.payment_status = 'REFUNDED' THEN -pay.amount
            ELSE 0
        END), 0) AS net_revenue
    FROM flights f
    LEFT JOIN bookings b ON f.flight_id = b.flight_id
    LEFT JOIN payments pay ON b.booking_id = pay.booking_id
    WHERE DATE(f.departure_time) BETWEEN p_start_date AND p_end_date
    GROUP BY f.flight_id, f.flight_number, DATE(f.departure_time)
    ORDER BY travel_date, f.flight_number;
END$$

DELIMITER ;

-- Procedure execution examples are in 10_reports.sql.