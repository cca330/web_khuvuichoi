-- =====================================================================
-- dbweb - THEME PARK MODEL (VinWonders / Sun World / Disneyland style)
-- Generated: 2026-07-08
--
-- BUSINESS MODEL:
--   Khach chi mua VE CONG (nguoi lon / tre em / combo gia dinh / combo
--   VIP) -> thanh toan -> nhan 1 QR -> quet QR o cong -> vao choi tu do
--   TAT CA cac tro choi ben trong, khong can mua ve tung game.
--
-- KEY DECISIONS (theo xac nhan cua ban):
--   - Combo (gia dinh/VIP) dung CHUNG 1 QR cho ca nhom (khong tach
--     thanh nhieu QR rieng cho tung nguoi).
--   - Ve duoc quet RA/VAO NHIEU LAN trong ngay (khong bi khoa sau lan
--     quet dau tien).
--
-- THAY DOI SO VOI BAN TRUOC (dbweb_fixed.sql):
--   1. games: bo cot `price` - khong con la san pham ban rieng, chi la
--      thong tin hien thi + dieu kien do tuoi/loai ve khi vao choi.
--   2. gate_tickets: them `admits_adult`, `admits_child`, `is_combo` de
--      mo ta 1 QR cho phep bao nhieu nguoi/loai nguoi vao.
--   3. order_items: BO item_type/parent_item_id (khong con polymorphic
--      GATE/GAME nua vi chi ban ve cong) -> FK thang toi gate_tickets,
--      DB tu dam bao toan ven du lieu, khong can trigger gia-FK nua.
--   4. tickets: khong con la "1 QR = 1 nguoi, dung 1 lan" ma la "1 QR =
--      1 lan mua (cho ca nhom neu la combo)", them `admits_adult`,
--      `admits_child` (snapshot tu gate_tickets luc mua), `valid_date`,
--      status doi thanh ACTIVE/EXPIRED/CANCELLED (khong con USED).
--   5. THEM BANG MOI `ticket_scans`: log tung lan quet IN/OUT, tach
--      rieng khoi `tickets` de ho tro ra/vao nhieu lan trong ngay.
--   6. promotions: bo cot `type` (ALL/TICKET qua tho). Them bang moi
--      `promotion_gate_tickets` de moi ma khuyen mai co the nham CHINH
--      XAC tung loai ve (vd: TICKET5 chi cho ve don, FAMILY25 chi cho
--      Combo gia dinh, VIP30 chi cho Combo VIP) - moi ma van co %
--      giam gia rieng nhu truoc, chi khac la pham vi ap dung ro rang
--      hon thay vi chia tho ALL/TICKET.
-- =====================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- Module 1: Events (khong lien quan he thong ve, giu nguyen)
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `event_schedule`;
DROP TABLE IF EXISTS `event_images`;
DROP TABLE IF EXISTS `events`;

CREATE TABLE `events` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `thumbnail` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `location` VARCHAR(255),
    `start_datetime` DATETIME NOT NULL,
    `end_datetime` DATETIME NOT NULL,
    `status` ENUM('COMING_SOON','ONGOING','FINISHED','CANCELLED') DEFAULT 'COMING_SOON',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `chk_events_dates` CHECK (`end_datetime` >= `start_datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `event_images` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `event_id` INT NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `event_schedule` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `event_id` INT NOT NULL,
    `schedule_time` TIME,
    `title` VARCHAR(255),
    `description` TEXT,
    `sort_order` INT DEFAULT 1,
    FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- Module 2: He thong ve cong (theme-park model)
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `ticket_scans`;
DROP TABLE IF EXISTS `tickets`;
DROP TABLE IF EXISTS `promotion_order`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `promotion_gate_tickets`;
DROP TABLE IF EXISTS `promotions`;
DROP TABLE IF EXISTS `feedbacks`;
DROP TABLE IF EXISTS `games`;
DROP TABLE IF EXISTS `gate_tickets`;
DROP TABLE IF EXISTS `users`;

-- ---------------- users ----------------
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('USER','ADMIN') DEFAULT 'USER',
  `status` enum('ACTIVE','BLOCK') DEFAULT 'ACTIVE',
  `otp_code` varchar(10) DEFAULT NULL,
  `otp_expired_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=8;

-- Mat khau test cho user1-user4: 123456 (da hash bcrypt)
INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `status`, `otp_code`, `otp_expired_at`, `created_at`) VALUES
(1, 'admin', '$2y$10$ABi/hh1xLqmrj8xflj141ecfBf5srYQTKXTjhYj8OgvG.1t/HVuGe', 'admin@gmail.com', 'ADMIN', 'ACTIVE', NULL, NULL, '2026-01-16 17:22:09'),
(2, 'user1', '$2b$10$PjVpzqWje3adNKVcBIMYfeDLCVJEf3VhyPGPKy4Dz//OlVFQ8TsQy', 'user1@gmail.com', 'USER', 'ACTIVE', NULL, NULL, '2026-01-16 17:22:09'),
(3, 'user2', '$2b$10$PjVpzqWje3adNKVcBIMYfeDLCVJEf3VhyPGPKy4Dz//OlVFQ8TsQy', 'user2@gmail.com', 'USER', 'ACTIVE', NULL, NULL, '2026-01-16 17:22:09'),
(4, 'user3', '$2b$10$PjVpzqWje3adNKVcBIMYfeDLCVJEf3VhyPGPKy4Dz//OlVFQ8TsQy', 'user3@gmail.com', 'USER', 'ACTIVE', NULL, NULL, '2026-01-16 17:22:09'),
(5, 'user4', '$2b$10$PjVpzqWje3adNKVcBIMYfeDLCVJEf3VhyPGPKy4Dz//OlVFQ8TsQy', 'user4@gmail.com', 'USER', 'ACTIVE', NULL, NULL, '2026-01-16 17:22:09'),
(6, 'test', '$2y$10$InzMzRu8ZQAUnTQIBKvZV.OfcSZRKGJbpvTNt2oplUE1zm0z0JI/i', 'test@msalms.com', 'USER', 'ACTIVE', NULL, NULL, '2026-01-16 17:25:31'),
(7, 'manh', '$2y$10$7Ui8L.qK3OU.rR4OSn1BG.Ovd/1lTaLaGjU0NRAJXQ96UITDx4Xxe', 'cnjkj@gmail.com', 'USER', 'ACTIVE', NULL, NULL, '2026-06-14 14:24:01');

-- ---------------- games (khong con ban - chi de hien thi + dieu kien vao choi) ----------------
-- ---------------- games (khong con ban rieng - chi de hien thi + dieu kien vao choi) ----------------
CREATE TABLE `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `recommended_age` int(11) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  -- allowed_ticket: loai VE CONG nao thi duoc choi tro nay (kiem tra
  -- luc VAO CHOI tai tro, khong phai luc mua ve).
  `allowed_ticket` enum('ALL','ADULT') DEFAULT 'ALL',
  `status` enum('OPEN','CLOSE') DEFAULT 'OPEN',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=6;

INSERT INTO `games` (`id`, `name`, `description`, `recommended_age`, `category`, `allowed_ticket`, `status`) VALUES
(1, 'Haunted House', 'Nhà ma kinh dị', 16, 'Horror', 'ADULT', 'OPEN'),
(2, 'Roller Coaster', 'Tàu lượn siêu tốc', 12, 'Adventure', 'ALL', 'OPEN'),
(3, 'Ferris Wheel', 'Vòng quay mặt trời', 5, 'Family', 'ALL', 'OPEN'),
(4, 'Bumper Cars', 'Xe điện đụng', 6, 'Kids', 'ALL', 'OPEN'),
(5, 'VR Game', 'Trò chơi thực tế ảo', 18, 'VR', 'ADULT', 'OPEN');

-- ---------------- game_images (nhieu anh/game, hien thi carousel/slideshow) ----------------
CREATE TABLE `game_images` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `game_id` INT NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `sort_order` INT DEFAULT 1,   -- thu tu hien thi trong slideshow (anh dau tien = bia)
    FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `game_images` (`game_id`, `image`, `sort_order`) VALUES
(1, 'haunted-1.jpg', 1),
(1, 'haunted-2.jpg', 2),
(1, 'haunted-3.jpg', 3),
(2, 'coaster-1.jpg', 1),
(2, 'coaster-2.jpg', 2),
(3, 'wheel-1.jpg', 1),
(4, 'bumper-1.jpg', 1),
(5, 'vr-1.jpg', 1),
(5, 'vr-2.jpg', 2);

-- ---------------- feedbacks (khach van danh gia tung tro sau khi choi) ----------------
CREATE TABLE `feedbacks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_feedback_user` (`user_id`),
  KEY `fk_feedback_game` (`game_id`),
  CONSTRAINT `fk_feedback_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`),
  CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=6;

INSERT INTO `feedbacks` (`id`, `user_id`, `game_id`, `content`, `rating`, `created_at`) VALUES
(1, 2, 1, 'Rất đáng sợ, chơi thích!', 5, '2026-01-16 17:23:45'),
(2, 3, 2, 'Tàu chạy nhanh, hơi chóng mặt', 4, '2026-01-16 17:23:45'),
(3, 4, 3, 'Phù hợp cho gia đình', 5, '2026-01-16 17:23:45'),
(4, 5, 4, 'Trẻ em rất thích', 4, '2026-01-16 17:23:45'),
(5, 2, 5, 'VR hơi đắt nhưng rất đã', 5, '2026-01-16 17:23:45');

-- ---------------- gate_tickets (san pham ban - ve don + combo) ----------------
CREATE TABLE `gate_tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  `type` enum('CHILD','ADULT','ALL') NOT NULL DEFAULT 'ALL',
  -- so nguoi ma 1 QR cua loai ve nay cho vao (ve don = 1, combo = nhieu)
  `admits_adult` int(11) NOT NULL DEFAULT 0,
  `admits_child` int(11) NOT NULL DEFAULT 0,
  `is_combo` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_gate_admits` CHECK (`admits_adult` + `admits_child` >= 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=6;

INSERT INTO `gate_tickets` (`id`, `name`, `price`, `description`, `status`, `type`, `admits_adult`, `admits_child`, `is_combo`) VALUES
(1, 'Vé người lớn', 40000.00, 'Dành cho người lớn', 'ACTIVE', 'ADULT', 1, 0, 0),
(2, 'Vé trẻ em', 20000.00, 'Dành cho trẻ em', 'ACTIVE', 'CHILD', 0, 1, 0),
(3, 'Combo gia đình', 100000.00, '2 người lớn + 2 trẻ em, dùng chung 1 QR', 'ACTIVE', 'ALL', 2, 2, 1),
(4, 'Combo VIP', 150000.00, '2 người lớn, ưu tiên vào cổng, dùng chung 1 QR', 'ACTIVE', 'ADULT', 2, 0, 1),
(5, 'Vé buổi tối', 30000.00, 'Áp dụng sau 18h', 'ACTIVE', 'ALL', 1, 0, 0);

-- ---------------- promotions ----------------
-- FIX: bo cot `type` (ALL/TICKET qua tho) - thay bang bang cau noi
-- `promotion_gate_tickets` ben duoi de nham chinh xac tung loai ve.
CREATE TABLE `promotions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `discount` int(11) NOT NULL,        -- % giam gia
  `description` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('ACTIVE','EXPIRED') DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  CONSTRAINT `chk_promo_dates` CHECK (`end_date` IS NULL OR `start_date` IS NULL OR `end_date` >= `start_date`),
  CONSTRAINT `chk_promo_discount` CHECK (`discount` BETWEEN 1 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=6;

INSERT INTO `promotions` (`id`, `code`, `discount`, `description`, `start_date`, `end_date`, `status`) VALUES
(1, 'SALE10', 10, 'Giảm 10% cho mọi loại vé', '2025-01-01', '2025-12-31', 'ACTIVE'),
(2, 'TICKET5', 5, 'Giảm 5% cho vé cổng đơn (người lớn/trẻ em/buổi tối)', '2026-01-01', '2026-12-31', 'ACTIVE'),
(3, 'FAMILY25', 25, 'Giảm 25% cho Combo gia đình - khuyến khích mua combo', '2026-01-01', '2026-12-31', 'ACTIVE'),
(4, 'VIP30', 30, 'Giảm 30% cho Combo VIP', '2025-01-01', '2025-03-31', 'EXPIRED'),
(5, 'NEWUSER5', 5, 'Giảm 5% cho khách hàng mới, mọi loại vé', '2025-01-01', '2025-12-31', 'ACTIVE');

-- ---------------- promotion_gate_tickets (pham vi ap dung) ----------------
-- Khong co dong nao cho 1 promotion_id  -> ma do ap dung cho TAT CA
-- loai ve (vd SALE10, NEWUSER5).
-- Co dong                                -> ma do CHI ap dung cho dung
-- nhung gate_ticket_id duoc liet ke (vd FAMILY25 chi cho Combo gia dinh).
CREATE TABLE `promotion_gate_tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `promotion_id` int(11) NOT NULL,
  `gate_ticket_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_promo_ticket` (`promotion_id`, `gate_ticket_id`),
  KEY `fk_pgt_ticket` (`gate_ticket_id`),
  CONSTRAINT `fk_pgt_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pgt_ticket` FOREIGN KEY (`gate_ticket_id`) REFERENCES `gate_tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=7;

INSERT INTO `promotion_gate_tickets` (`id`, `promotion_id`, `gate_ticket_id`) VALUES
-- TICKET5 (id=2): chi cho 3 loai ve don - Nguoi lon(1), Tre em(2), Buoi toi(5)
(1, 2, 1),
(2, 2, 2),
(3, 2, 5),
-- FAMILY25 (id=3): chi cho Combo gia dinh (3)
(4, 3, 3),
-- VIP30 (id=4): chi cho Combo VIP (4)
(5, 4, 4);
-- SALE10 (id=1) va NEWUSER5 (id=5): khong co dong nao -> ap dung ALL

-- ---------------- orders ----------------
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `status` enum('PENDING','PAID','FAILED') DEFAULT 'PENDING',
  `total_price` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `paid_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orders_user` (`user_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=6;

INSERT INTO `orders` (`id`, `user_id`, `status`, `total_price`, `created_at`, `paid_at`) VALUES
(1, 2, 'PAID', 100000.00, '2026-07-08 08:00:00', '2026-07-08 08:00:30'),
(2, 3, 'PAID', 100000.00, '2026-07-08 08:10:00', '2026-07-08 08:10:20'),
(3, 4, 'PENDING', 150000.00, '2026-07-08 09:00:00', NULL),
(4, 5, 'FAILED', 40000.00, '2026-07-08 09:05:00', NULL),
(5, 7, 'PENDING', 0.00, '2026-07-08 09:10:00', NULL);

-- ---------------- order_items ----------------
-- FIX: bo item_type/parent_item_id (khong con polymorphic GATE/GAME).
-- Chi ban gate_tickets nen FK thang toi gate_tickets - DB tu dam bao
-- toan ven du lieu, khong can trigger gia-FK nhu ban truoc.
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `gate_ticket_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL CHECK (`quantity` >= 1),
  `price` decimal(10,2) NOT NULL,  -- gia tai thoi diem mua (snapshot)
  PRIMARY KEY (`id`),
  KEY `fk_order_items_order` (`order_id`),
  KEY `fk_order_items_ticket` (`gate_ticket_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_ticket` FOREIGN KEY (`gate_ticket_id`) REFERENCES `gate_tickets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=7;

INSERT INTO `order_items` (`id`, `order_id`, `gate_ticket_id`, `quantity`, `price`) VALUES
(1, 1, 3, 1, 100000.00),                    -- order1: 1x Combo gia đình
(2, 2, 1, 2, 40000.00),                     -- order2: 2x Vé người lớn
(3, 2, 2, 1, 20000.00),                     -- order2: 1x Vé trẻ em
(4, 3, 4, 1, 150000.00),                    -- order3: 1x Combo VIP (chưa thanh toán)
(5, 4, 1, 1, 40000.00);                     -- order4: 1x Vé người lớn (thanh toán thất bại)

-- ---------------- promotion_order ----------------
CREATE TABLE `promotion_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `promotion_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_po_order` (`order_id`), -- 1 don = 1 ma khuyen mai
  KEY `fk_po_promotion` (`promotion_id`),
  CONSTRAINT `fk_po_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`),
  CONSTRAINT `fk_po_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=2;

-- order1 mua Combo gia dinh (100000) va dung ma FAMILY25 (id=3, giam 25%)
-- -> discount_amount = 100000 * 25% = 25000
INSERT INTO `promotion_order` (`id`, `promotion_id`, `order_id`, `discount_amount`, `created_at`) VALUES
(1, 3, 1, 25000.00, '2026-07-08 08:00:15');

-- ---------------- tickets (1 QR = 1 lan mua, co the cho ca nhom) ----------------
-- FIX: khong con "1 QR = 1 nguoi, dung 1 lan" ma la:
--   - moi dong = 1 QR sinh ra tu 1 don vi so luong trong order_items
--     (mua quantity=2 -> sinh 2 dong tickets, moi dong 1 QR rieng)
--   - admits_adult/admits_child: snapshot tu gate_tickets luc mua, de
--     nhan vien cong biet QR nay cho toi da bao nhieu nguoi/loai nao
--   - valid_date: ve chi co hieu luc dung 1 ngay
--   - status: ACTIVE/EXPIRED/CANCELLED (KHONG con USED vi duoc quet
--     ra/vao nhieu lan trong ngay - lich su quet nam o ticket_scans)
CREATE TABLE `tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_item_id` int(11) NOT NULL,
  `gate_ticket_id` int(11) NOT NULL,
  `ticket_code` varchar(100) NOT NULL,
  `admits_adult` int(11) NOT NULL DEFAULT 0,
  `admits_child` int(11) NOT NULL DEFAULT 0,
  `valid_date` date NOT NULL,
  `status` enum('ACTIVE','EXPIRED','CANCELLED') DEFAULT 'ACTIVE',
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_code` (`ticket_code`),
  KEY `fk_tickets_order_item` (`order_item_id`),
  KEY `fk_tickets_gate_ticket` (`gate_ticket_id`),
  CONSTRAINT `fk_tickets_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tickets_gate_ticket` FOREIGN KEY (`gate_ticket_id`) REFERENCES `gate_tickets` (`id`),
  CONSTRAINT `chk_tickets_admits` CHECK (`admits_adult` + `admits_child` >= 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=4;

-- Ve chi duoc sinh ra SAU KHI THANH TOAN THANH CONG (order1, order2).
-- order3 (PENDING) va order4 (FAILED) chua/khong co ve.
INSERT INTO `tickets` (`id`, `order_item_id`, `gate_ticket_id`, `ticket_code`, `admits_adult`, `admits_child`, `valid_date`, `status`, `created_at`) VALUES
(1, 1, 3, 'QR-20260708-0001', 2, 2, '2026-07-08', 'ACTIVE', '2026-07-08 08:00:30'),  -- 1 QR chung cho ca gia dinh (combo)
(2, 2, 1, 'QR-20260708-0002', 1, 0, '2026-07-08', 'ACTIVE', '2026-07-08 08:10:20'),  -- ve nguoi lon #1
(3, 2, 1, 'QR-20260708-0003', 1, 0, '2026-07-08', 'ACTIVE', '2026-07-08 08:10:20'),  -- ve nguoi lon #2 (quantity=2 -> 2 QR)
(4, 3, 2, 'QR-20260708-0004', 0, 1, '2026-07-08', 'ACTIVE', '2026-07-08 08:10:20');  -- ve tre em

-- ---------------- ticket_scans (log ra/vao, ho tro quet nhieu lan/ngay) ----------------
CREATE TABLE `ticket_scans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(11) NOT NULL,
  `scan_type` enum('IN','OUT') NOT NULL,
  `scanned_at` datetime DEFAULT current_timestamp(),
  `gate_name` varchar(100) DEFAULT NULL,   -- vd: "Cổng chính", "Cổng B"
  `staff_id` int(11) DEFAULT NULL,         -- nhan vien thuc hien quet (FK -> users, ADMIN)
  PRIMARY KEY (`id`),
  KEY `fk_scans_ticket` (`ticket_id`),
  KEY `fk_scans_staff` (`staff_id`),
  CONSTRAINT `fk_scans_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_scans_staff` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=6;

-- Minh hoa: ve combo gia dinh (ticket #1) vao buoi sang, ra an trua,
-- quay lai buoi chieu -> 3 lan quet trong cung 1 ngay, van hop le.
INSERT INTO `ticket_scans` (`id`, `ticket_id`, `scan_type`, `scanned_at`, `gate_name`, `staff_id`) VALUES
(1, 1, 'IN', '2026-07-08 09:00:00', 'Cổng chính', 1),
(2, 1, 'OUT', '2026-07-08 12:00:00', 'Cổng chính', 1),
(3, 1, 'IN', '2026-07-08 13:30:00', 'Cổng chính', 1),
(4, 2, 'IN', '2026-07-08 09:15:00', 'Cổng chính', 1),
(5, 3, 'IN', '2026-07-08 09:15:00', 'Cổng chính', 1);

-- Goi y logic ung dung (khong the ep het bang constraint DB thuan):
--   - Truoc khi tao ticket_scans moi, app can kiem tra:
--       + tickets.status = 'ACTIVE' va tickets.valid_date = CURDATE()
--       + neu scan_type = 'IN': lan quet gan nhat (neu co) phai la 'OUT'
--         (tranh quet IN 2 lan lien tiep ma khong OUT)
--   - Cuoi ngay (hoac qua valid_date), 1 job dinh ky nen UPDATE
--     tickets SET status='EXPIRED' WHERE valid_date < CURDATE() AND status='ACTIVE'
--   - Luc tao tickets tu order_items: lap `quantity` lan de sinh dung
--     so QR, moi QR copy admits_adult/admits_child tu gate_tickets.
--
--   - QUAN TRONG ve khuyen mai: 1 don hang co the co NHIEU order_items
--     voi cac gate_ticket_id khac nhau (vd vua mua 1 Ve nguoi lon vua
--     mua 1 Combo gia dinh). Khi khach nhap ma khuyen mai, discount
--     KHONG duoc tinh tren tong ca don, ma phai tinh RIENG tren tung
--     order_item co gate_ticket_id nam trong pham vi cua ma do:
--
--       SELECT oi.id, oi.price * oi.quantity AS line_total
--       FROM order_items oi
--       WHERE oi.order_id = ?
--         AND (
--           NOT EXISTS (SELECT 1 FROM promotion_gate_tickets WHERE promotion_id = ?)
--           OR oi.gate_ticket_id IN (
--                SELECT gate_ticket_id FROM promotion_gate_tickets WHERE promotion_id = ?
--              )
--         );
--
--     discount_amount (luu trong promotion_order) = tong % giam cua
--     ma do tren dung nhung line_total kể trên, khong dung cho line
--     nam ngoai pham vi. Neu can bao cao chi tiet dong nao duoc giam
--     bao nhieu, co the tach them bang promotion_order_items (order_
--     item_id, discount_amount) thay vi chi luu tong o promotion_order.

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
