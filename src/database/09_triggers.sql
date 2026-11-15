-- =========================================================
-- AIRLINK - 09: TRIGGERS
-- Run after 02_create_tables.sql.
-- =========================================================

USE airlink;

DROP TRIGGER IF EXISTS before_seat_reservation_insert;
DROP TRIGGER IF EXISTS after_booking_status_update;

DELIMITER $$

-- Trigger 1: validate that the seat belongs to the aircraft
-- assigned to the flight and that the booking is for that flight.
CREATE TRIGGER before_seat_reservation_insert
BEFORE INSERT ON seat_reservations
FOR EACH ROW
BEGIN
    DECLARE v_flight_aircraft INT DEFAULT NULL;
    DECLARE v_seat_aircraft INT DEFAULT NULL;
    DECLARE v_booking_flight INT DEFAULT NULL;
    DECLARE v_flight_count INT DEFAULT 0;
    DECLARE v_seat_count INT DEFAULT 0;
    DECLARE v_booking_count INT DEFAULT 0;

    SELECT COUNT(*), MAX(aircraft_id)
      INTO v_flight_count, v_flight_aircraft
    FROM flights
    WHERE flight_id = NEW.flight_id;

    SELECT COUNT(*), MAX(aircraft_id)
      INTO v_seat_count, v_seat_aircraft
    FROM seats
    WHERE seat_id = NEW.seat_id;

    SELECT COUNT(*), MAX(flight_id)
      INTO v_booking_count, v_booking_flight
    FROM bookings
    WHERE booking_id = NEW.booking_id;

    IF v_flight_count = 0 OR v_seat_count = 0
       OR v_booking_count = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid flight, seat or booking reference';
    END IF;

    IF v_flight_aircraft <> v_seat_aircraft THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Seat does not belong to aircraft assigned to flight';
    END IF;

    IF v_booking_flight <> NEW.flight_id THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Booking and seat reservation flight IDs do not match';
    END IF;
END$$

-- Trigger 2: automatically audit booking status changes.
CREATE TRIGGER after_booking_status_update
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
    IF OLD.booking_status <> NEW.booking_status THEN
        INSERT INTO booking_audit
            (booking_id, old_status, new_status, remarks)
        VALUES
            (NEW.booking_id, OLD.booking_status, NEW.booking_status,
             'Booking status changed');
    END IF;
END$$

DELIMITER ;

-- Trigger verification.
SHOW TRIGGERS;