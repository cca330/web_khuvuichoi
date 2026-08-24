-- Co so du lieu cua promotion-service
USE promotion_db;

CREATE TABLE `promotions` (
	`id` int NOT NULL AUTO_INCREMENT,
	`code` varchar(50) NOT NULL,
	`discount` int NOT NULL,
	`description` varchar(255),
	`start_date` date,
	`end_date` date,
	`status` enum('ACTIVE','EXPIRED') DEFAULT 'ACTIVE',
	PRIMARY KEY (`id`), UNIQUE KEY `code` (`code`),
	CONSTRAINT `chk_promo_dates` CHECK (`end_date` IS NULL OR `start_date` IS NULL OR `end_date` >= `start_date`),
	CONSTRAINT `chk_promo_discount` CHECK (`discount` BETWEEN 1 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `promotions` (`id`, `code`, `discount`, `description`, `start_date`, `end_date`, `status`) VALUES
(1, 'SALE10', 10, 'Giam 10 phan tram cho moi loai ve', '2025-01-01', '2025-12-31', 'ACTIVE'),
(2, 'TICKET5', 5, 'Giam 5 phan tram cho ve cong don', '2026-01-01', '2026-12-31', 'ACTIVE'),
(3, 'FAMILY25', 25, 'Giam 25 phan tram cho combo gia dinh', '2026-01-01', '2026-12-31', 'ACTIVE'),
(4, 'VIP30', 30, 'Giam 30 phan tram cho combo VIP', '2025-01-01', '2025-03-31', 'EXPIRED'),
(5, 'NEWUSER5', 5, 'Giam 5 phan tram cho khach hang moi', '2025-01-01', '2025-12-31', 'ACTIVE');

-- gate_ticket_id la tham chieu logic den ticket_db, khong tao FK cheo service.
CREATE TABLE `promotion_gate_tickets` (
	`id` int NOT NULL AUTO_INCREMENT,
	`promotion_id` int NOT NULL,
	`gate_ticket_id` int NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `uq_promo_ticket` (`promotion_id`, `gate_ticket_id`),
	CONSTRAINT `fk_pgt_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `promotion_gate_tickets` (`id`, `promotion_id`, `gate_ticket_id`) VALUES
(1, 2, 1), (2, 2, 2), (3, 2, 5), (4, 3, 3), (5, 4, 4);
