-- =========================================================
-- AIRLINK - 06: TRANSACTION DEMONSTRATION
-- Run after sample data exists.
-- This file demonstrates COMMIT, ROLLBACK and SAVEPOINT.
-- =========================================================

USE airlink;

-- DEMO A: ROLLBACK.
-- The flight status change is undone.
START TRANSACTION;

UPDATE flights
SET flight_status = 'DELAYED'
WHERE flight_id = 110;

SELECT flight_id, flight_status
FROM flights
WHERE flight_id = 110;

ROLLBACK;

-- Verify that the original status is restored.
SELECT flight_id, flight_status
FROM flights
WHERE flight_id = 110;

-- DEMO B: SAVEPOINT.
-- Insert a temporary payment attempt, then roll back to savepoint.
START TRANSACTION;

INSERT INTO payments
(booking_id, amount, payment_method, payment_status, transaction_reference)
VALUES
(1, 100.00, 'UPI', 'PENDING', 'PAY-DEMO-SAVEPOINT');

SAVEPOINT after_demo_payment;

-- This update is deliberately undone.
UPDATE payments
SET payment_status = 'FAILED'
WHERE transaction_reference = 'PAY-DEMO-SAVEPOINT';

ROLLBACK TO SAVEPOINT after_demo_payment;

-- The payment remains PENDING at this point.
SELECT *
FROM payments
WHERE transaction_reference = 'PAY-DEMO-SAVEPOINT';

-- Remove the temporary demo row and commit the cleanup.
DELETE FROM payments
WHERE transaction_reference = 'PAY-DEMO-SAVEPOINT';

COMMIT;

-- DEMO C: COMMIT a harmless update.
START TRANSACTION;

UPDATE flights
SET base_fare = base_fare
WHERE flight_id = 101;

COMMIT;