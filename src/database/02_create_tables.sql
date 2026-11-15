-- =========================================================
-- AIRLINK - 02: CREATE TABLES
-- Run after 01_create_database.sql.
-- =========================================================

USE airlink;

-- 1. Application accounts. Passwords must be securely hashed
-- by the application; never store plaintext passwords.
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'PASSENGER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Airports. airport_code is the shared identifier used by Neo4j.
CREATE TABLE IF NOT EXISTS airports (
    airport_id INT AUTO_INCREMENT PRIMARY KEY,
    airport_code CHAR(3) NOT NULL,
    airport_name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- 3. Aircraft.
CREATE TABLE IF NOT EXISTS aircraft (
    aircraft_id INT AUTO_INCREMENT PRIMARY KEY,
    aircraft_model VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    total_seats INT NOT NULL
) ENGINE=InnoDB;

-- 4. Passengers. A passenger may optionally be linked to an app user.
CREATE TABLE IF NOT EXISTS passengers (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    passport_number VARCHAR(30),
    CONSTRAINT fk_passengers_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Seats belong to an aircraft, not permanently to a flight.
CREATE TABLE IF NOT EXISTS seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    aircraft_id INT NOT NULL,
    seat_number VARCHAR(5) NOT NULL,
    seat_class VARCHAR(20) NOT NULL,
    CONSTRAINT fk_seats_aircraft
        FOREIGN KEY (aircraft_id) REFERENCES aircraft(aircraft_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 6. Each row represents one scheduled flight instance.
-- flight_id is the shared identifier used in Neo4j relationships.
CREATE TABLE IF NOT EXISTS flights (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(15) NOT NULL,
    aircraft_id INT NOT NULL,
    source_airport_id INT NOT NULL,
    destination_airport_id INT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    base_fare DECIMAL(10,2) NOT NULL,
    flight_status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    CONSTRAINT fk_flights_aircraft
        FOREIGN KEY (aircraft_id) REFERENCES aircraft(aircraft_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_flights_source
        FOREIGN KEY (source_airport_id) REFERENCES airports(airport_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_flights_destination
        FOREIGN KEY (destination_airport_id) REFERENCES airports(airport_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 7. One passenger per booking in this project version.
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(36) NOT NULL,
    passenger_id INT NOT NULL,
    flight_id INT NOT NULL,
    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    CONSTRAINT fk_bookings_passenger
        FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_flight
        FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 8. Ticket issued for a booking.
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    ticket_number VARCHAR(36) NOT NULL,
    issue_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ticket_status VARCHAR(20) NOT NULL DEFAULT 'VALID',
    CONSTRAINT fk_tickets_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 9. Contains ACTIVE seat allocations only.
-- On cancellation the active allocation is deleted, while booking,
-- ticket and audit history remain preserved.
CREATE TABLE IF NOT EXISTS seat_reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    flight_id INT NOT NULL,
    seat_id INT NOT NULL,
    reserved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservations_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_reservations_flight
        FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_reservations_seat
        FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 10. Payment attempts and refunds are retained as records.
-- No card number, CVV or banking password is stored.
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    transaction_reference VARCHAR(60),
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 11. Supporting audit table populated by a trigger.
CREATE TABLE IF NOT EXISTS booking_audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    remarks VARCHAR(255),
    CONSTRAINT fk_booking_audit_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

SHOW TABLES;