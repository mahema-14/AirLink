-- =========================================================
-- AIRLINK - 03: CONSTRAINTS
-- Database: MySQL 8.0.16+
-- =========================================================

USE airlink;


-- =========================================================
-- 1. USERS TABLE
-- =========================================================

ALTER TABLE users
ADD CONSTRAINT uq_users_email
UNIQUE (email),

ADD CONSTRAINT chk_users_role
CHECK (role IN ('ADMIN', 'PASSENGER'));


-- =========================================================
-- 2. AIRPORTS TABLE
-- =========================================================

ALTER TABLE airports
ADD CONSTRAINT uq_airports_code
UNIQUE (airport_code);


-- =========================================================
-- 3. AIRCRAFT TABLE
-- =========================================================

ALTER TABLE aircraft
ADD CONSTRAINT chk_aircraft_total_seats
CHECK (total_seats > 0);


-- =========================================================
-- 4. PASSENGERS TABLE
-- =========================================================

ALTER TABLE passengers
ADD CONSTRAINT uq_passengers_email
UNIQUE (email),

ADD CONSTRAINT uq_passengers_passport
UNIQUE (passport_number);


-- =========================================================
-- 5. SEATS TABLE
-- =========================================================

ALTER TABLE seats
ADD CONSTRAINT uq_aircraft_seat
UNIQUE (aircraft_id, seat_number),

ADD CONSTRAINT chk_seat_class
CHECK (seat_class IN ('ECONOMY', 'BUSINESS', 'FIRST'));


-- =========================================================
-- 6. FLIGHTS TABLE
-- FIX: Recreate airport foreign keys without ON UPDATE CASCADE
-- =========================================================

ALTER TABLE flights
DROP FOREIGN KEY fk_flights_source,
DROP FOREIGN KEY fk_flights_destination;

ALTER TABLE flights
ADD CONSTRAINT fk_flights_source
FOREIGN KEY (source_airport_id)
REFERENCES airports(airport_id)
ON UPDATE RESTRICT ON DELETE RESTRICT,

ADD CONSTRAINT fk_flights_destination
FOREIGN KEY (destination_airport_id)
REFERENCES airports(airport_id)
ON UPDATE RESTRICT ON DELETE RESTRICT;


-- Flight constraints

ALTER TABLE flights
ADD CONSTRAINT uq_flight_instance
UNIQUE (flight_number, departure_time),

ADD CONSTRAINT chk_flight_route
CHECK (source_airport_id <> destination_airport_id),

ADD CONSTRAINT chk_flight_times
CHECK (arrival_time > departure_time),

ADD CONSTRAINT chk_flight_fare
CHECK (base_fare > 0),

ADD CONSTRAINT chk_flight_status
CHECK (flight_status IN (
    'SCHEDULED',
    'DELAYED',
    'CANCELLED',
    'COMPLETED'
));


-- =========================================================
-- 7. BOOKINGS TABLE
-- =========================================================

ALTER TABLE bookings
ADD CONSTRAINT uq_booking_reference
UNIQUE (booking_reference),

ADD CONSTRAINT chk_booking_amount
CHECK (total_amount >= 0),

ADD CONSTRAINT chk_booking_status
CHECK (booking_status IN (
    'PENDING',
    'CONFIRMED',
    'CANCELLED'
));


-- =========================================================
-- 8. TICKETS TABLE
-- =========================================================

ALTER TABLE tickets
ADD CONSTRAINT uq_ticket_number
UNIQUE (ticket_number),

ADD CONSTRAINT uq_ticket_booking
UNIQUE (booking_id),

ADD CONSTRAINT chk_ticket_status
CHECK (ticket_status IN ('VALID', 'CANCELLED'));


-- =========================================================
-- 9. SEAT RESERVATIONS TABLE
-- =========================================================

ALTER TABLE seat_reservations
ADD CONSTRAINT uq_active_booking_seat
UNIQUE (booking_id),

ADD CONSTRAINT uq_active_flight_seat
UNIQUE (flight_id, seat_id);


-- =========================================================
-- 10. PAYMENTS TABLE
-- =========================================================

ALTER TABLE payments
ADD CONSTRAINT chk_payment_amount
CHECK (amount > 0),

ADD CONSTRAINT chk_payment_method
CHECK (payment_method IN (
    'UPI',
    'CARD',
    'NET_BANKING',
    'CASH'
)),

ADD CONSTRAINT chk_payment_status
CHECK (payment_status IN (
    'PENDING',
    'SUCCESSFUL',
    'FAILED',
    'REFUNDED'
)),

ADD CONSTRAINT uq_payment_transaction
UNIQUE (transaction_reference);


-- =========================================================
-- 11. VERIFY CONSTRAINTS
-- =========================================================

SHOW CREATE TABLE users;
SHOW CREATE TABLE airports;
SHOW CREATE TABLE aircraft;
SHOW CREATE TABLE passengers;
SHOW CREATE TABLE seats;
SHOW CREATE TABLE flights;
SHOW CREATE TABLE bookings;
SHOW CREATE TABLE tickets;
SHOW CREATE TABLE seat_reservations;
SHOW CREATE TABLE payments;


-- Display all constraints in the AirLink database

SELECT
    TABLE_NAME,
    CONSTRAINT_NAME,
    CONSTRAINT_TYPE
FROM information_schema.TABLE_CONSTRAINTS
WHERE TABLE_SCHEMA = 'airlink'
ORDER BY TABLE_NAME, CONSTRAINT_TYPE;