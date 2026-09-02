ALTER TABLE orders
  ADD COLUMN booking_date DATE NULL;

ALTER TABLE gate_tickets
  ADD COLUMN valid_from_time TIME NOT NULL DEFAULT '00:00:00',
  ADD COLUMN valid_until_time TIME NOT NULL DEFAULT '23:59:59';

ALTER TABLE tickets
  ADD COLUMN valid_from DATETIME NULL,
  ADD COLUMN valid_until DATETIME NULL;

UPDATE tickets
SET
  valid_from = CONCAT(valid_date, ' 00:00:00'),
  valid_until = CONCAT(valid_date, ' 23:59:59')
WHERE valid_from IS NULL;

ALTER TABLE tickets
  MODIFY valid_from DATETIME NOT NULL,
  MODIFY valid_until DATETIME NOT NULL; 