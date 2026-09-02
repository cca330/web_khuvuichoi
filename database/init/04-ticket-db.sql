-- Co so du lieu cua ticket-service
USE ticket_db;

CREATE TABLE `gate_tickets` (
	`id` int NOT NULL AUTO_INCREMENT,
	`name` varchar(100) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`description` text,
	`status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
	`type` enum('CHILD','ADULT','ALL') NOT NULL DEFAULT 'ALL',
	`admits_adult` int NOT NULL DEFAULT 0,
	`admits_child` int NOT NULL DEFAULT 0,
	`is_combo` tinyint(1) NOT NULL DEFAULT 0,
	`valid_from_time` time NOT NULL DEFAULT '00:00:00',
	`valid_until_time` time NOT NULL DEFAULT '23:59:59',
	PRIMARY KEY (`id`),
	CONSTRAINT `chk_gate_admits` CHECK (`admits_adult` + `admits_child` >= 1),
	CONSTRAINT `chk_gate_valid_time` CHECK (`valid_until_time` >= `valid_from_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `gate_tickets` (`id`, `name`, `price`, `description`, `status`, `type`, `admits_adult`, `admits_child`, `is_combo`, `valid_from_time`, `valid_until_time`) VALUES
(1, 'Ve nguoi lon', 40000.00, 'Danh cho nguoi lon', 'ACTIVE', 'ADULT', 1, 0, 0, '00:00:00', '23:59:59'),
(2, 'Ve tre em', 20000.00, 'Danh cho tre em', 'ACTIVE', 'CHILD', 0, 1, 0, '00:00:00', '23:59:59'),
(3, 'Combo gia dinh', 100000.00, '2 nguoi lon va 2 tre em, dung chung 1 ma QR', 'ACTIVE', 'ALL', 2, 2, 1, '00:00:00', '23:59:59'),
(4, 'Combo VIP', 150000.00, '2 nguoi lon, uu tien vao cong, dung chung 1 ma QR', 'ACTIVE', 'ADULT', 2, 0, 1, '00:00:00', '23:59:59'),
(5, 'Ve buoi toi', 30000.00, 'Ap dung sau 18 gio', 'ACTIVE', 'ALL', 1, 0, 0, '18:00:00', '23:59:59');

CREATE TABLE `orders` (
	`id` int NOT NULL AUTO_INCREMENT,
	`user_id` int NOT NULL,
	`status` enum('PENDING','PAID','FAILED') DEFAULT 'PENDING',
	`total_price` decimal(10,2) DEFAULT NULL,
	`booking_date` date DEFAULT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`paid_at` datetime DEFAULT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `orders` (`id`, `user_id`, `status`, `total_price`, `created_at`, `paid_at`) VALUES
(1, 2, 'PAID', 100000.00, '2026-07-08 08:00:00', '2026-07-08 08:00:30'),
(2, 3, 'PAID', 100000.00, '2026-07-08 08:10:00', '2026-07-08 08:10:20'),
(3, 4, 'PENDING', 150000.00, '2026-07-08 09:00:00', NULL),
(4, 5, 'FAILED', 40000.00, '2026-07-08 09:05:00', NULL),
(5, 7, 'PENDING', 0.00, '2026-07-08 09:10:00', NULL);

CREATE TABLE `order_items` (
	`id` int NOT NULL AUTO_INCREMENT,
	`order_id` int NOT NULL,
	`gate_ticket_id` int NOT NULL,
	`quantity` int NOT NULL CHECK (`quantity` >= 1),
	`price` decimal(10,2) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `idx_order_items_order` (`order_id`),
	KEY `idx_order_items_ticket` (`gate_ticket_id`),
	CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_order_items_gate_ticket` FOREIGN KEY (`gate_ticket_id`) REFERENCES `gate_tickets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `order_items` (`id`, `order_id`, `gate_ticket_id`, `quantity`, `price`) VALUES
(1, 1, 3, 1, 100000.00), (2, 2, 1, 2, 40000.00), (3, 2, 2, 1, 20000.00),
(4, 3, 4, 1, 150000.00), (5, 4, 1, 1, 40000.00);

CREATE TABLE `tickets` (
	`id` int NOT NULL AUTO_INCREMENT,
	`order_item_id` int NOT NULL,
	`gate_ticket_id` int NOT NULL,
	`ticket_code` varchar(100) NOT NULL,
	`admits_adult` int NOT NULL DEFAULT 0,
	`admits_child` int NOT NULL DEFAULT 0,
	`valid_date` date NOT NULL,
	`valid_from` datetime NOT NULL,
	`valid_until` datetime NOT NULL,
	`status` enum('ACTIVE','EXPIRED','CANCELLED') DEFAULT 'ACTIVE',
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`), UNIQUE KEY `ticket_code` (`ticket_code`),
	CONSTRAINT `fk_tickets_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_tickets_gate_ticket` FOREIGN KEY (`gate_ticket_id`) REFERENCES `gate_tickets` (`id`),
	CONSTRAINT `chk_tickets_admits` CHECK (`admits_adult` + `admits_child` >= 1),
	CONSTRAINT `chk_ticket_valid_period` CHECK (`valid_until` >= `valid_from`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `tickets` (`id`, `order_item_id`, `gate_ticket_id`, `ticket_code`, `admits_adult`, `admits_child`, `valid_date`, `valid_from`, `valid_until`, `status`, `created_at`) VALUES
(1, 1, 3, 'QR-20260708-0001', 2, 2, '2026-07-08', '2026-07-08 00:00:00', '2026-07-08 23:59:59', 'ACTIVE', '2026-07-08 08:00:30'),
(2, 2, 1, 'QR-20260708-0002', 1, 0, '2026-07-08', '2026-07-08 00:00:00', '2026-07-08 23:59:59', 'ACTIVE', '2026-07-08 08:10:20'),
(3, 2, 1, 'QR-20260708-0003', 1, 0, '2026-07-08', '2026-07-08 00:00:00', '2026-07-08 23:59:59', 'ACTIVE', '2026-07-08 08:10:20'),
(4, 3, 2, 'QR-20260708-0004', 0, 1, '2026-07-08', '2026-07-08 00:00:00', '2026-07-08 23:59:59', 'ACTIVE', '2026-07-08 08:10:20');

CREATE TABLE `ticket_scans` (
	`id` int NOT NULL AUTO_INCREMENT,
	`ticket_id` int NOT NULL,
	`scan_type` enum('IN','OUT') NOT NULL,
	`scanned_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`gate_name` varchar(100),
	`staff_id` int DEFAULT NULL,
	PRIMARY KEY (`id`),
	CONSTRAINT `fk_scans_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `ticket_scans` (`id`, `ticket_id`, `scan_type`, `scanned_at`, `gate_name`, `staff_id`) VALUES
(1, 1, 'IN', '2026-07-08 09:00:00', 'Cong chinh', 1),
(2, 1, 'OUT', '2026-07-08 12:00:00', 'Cong chinh', 1),
(3, 1, 'IN', '2026-07-08 13:30:00', 'Cong chinh', 1),
(4, 2, 'IN', '2026-07-08 09:15:00', 'Cong chinh', 1),
(5, 3, 'IN', '2026-07-08 09:15:00', 'Cong chinh', 1);

-- Hai cot ID nay la tham chieu logic den promotion_db va user_db, khong tao FK cheo service.
CREATE TABLE `promotion_order` (
	`id` int NOT NULL AUTO_INCREMENT,
	`promotion_id` int NOT NULL,
	`order_id` int NOT NULL,
	`discount_amount` decimal(10,2) DEFAULT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`), UNIQUE KEY `uq_po_order` (`order_id`),
	CONSTRAINT `fk_po_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `promotion_order` (`id`, `promotion_id`, `order_id`, `discount_amount`, `created_at`) VALUES
(1, 3, 1, 25000.00, '2026-07-08 08:00:15');
