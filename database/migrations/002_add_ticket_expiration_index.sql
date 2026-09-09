-- Giup job cap nhat ve het han nhanh hon ma khong can them cot moi.
ALTER TABLE tickets
  ADD INDEX idx_tickets_status_valid_until (status, valid_until);