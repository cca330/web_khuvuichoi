-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 14, 2026 lúc 10:21 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `dbweb`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `user_id`, `game_id`, `content`, `rating`, `created_at`) VALUES
(1, 2, 1, 'Rất đáng sợ, chơi thích!', 5, '2026-01-16 17:23:45'),
(2, 3, 2, 'Tàu chạy nhanh, hơi chóng mặt', 4, '2026-01-16 17:23:45'),
(3, 4, 3, 'Phù hợp cho gia đình', 5, '2026-01-16 17:23:45'),
(4, 5, 4, 'Trẻ em rất thích', 4, '2026-01-16 17:23:45'),
(5, 2, 5, 'VR hơi đắt nhưng rất đã', 5, '2026-01-16 17:23:45');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `recommended_age` int(11) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `allowed_ticket` enum('ALL','ADULT') DEFAULT 'ALL',
  `status` enum('OPEN','CLOSE') DEFAULT 'OPEN',
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `games`
--

INSERT INTO `games` (`id`, `name`, `description`, `price`, `recommended_age`, `category`, `allowed_ticket`, `status`, `image`) VALUES
(1, 'Haunted House', 'Nhà ma kinh dị', 50000.00, 16, 'Horror', 'ADULT', 'OPEN', 'haunted.jpg'),
(2, 'Roller Coaster', 'Tàu lượn siêu tốc', 70000.00, 12, 'Adventure', 'ALL', 'OPEN', 'coaster.jpg'),
(3, 'Ferris Wheel', 'Vòng quay mặt trời', 30000.00, 5, 'Family', 'ALL', 'OPEN', 'wheel.jpg'),
(4, 'Bumper Cars', 'Xe điện đụng', 40000.00, 6, 'Kids', 'ALL', 'OPEN', 'bumper.jpg'),
(5, 'VR Game', 'Trò chơi thực tế ảo', 80000.00, 18, 'VR', 'ADULT', 'OPEN', 'vr.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `gate_tickets`
--

CREATE TABLE `gate_tickets` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  `type` enum('CHILD','ADULT','ALL') NOT NULL DEFAULT 'ALL'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `gate_tickets`
--

INSERT INTO `gate_tickets` (`id`, `name`, `price`, `description`, `status`, `type`) VALUES
(1, 'Vé cổng trẻ em', 20000.00, 'Dành cho trẻ em', 'ACTIVE', 'CHILD'),
(2, 'Vé cổng người lớn', 40000.00, 'Dành cho người lớn', 'ACTIVE', 'ADULT'),
(3, 'Vé cổng gia đình', 100000.00, 'Áp dụng mọi đối tượng', 'ACTIVE', 'ALL'),
(4, 'Vé cổng VIP', 150000.00, 'Vé ưu tiên', 'ACTIVE', 'ALL'),
(5, 'Vé cổng buổi tối', 30000.00, 'Áp dụng sau 18h', 'ACTIVE', 'ALL');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('PENDING','PAID','FAILED') DEFAULT 'PENDING',
  `total_price` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `paid_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `status`, `total_price`, `created_at`, `paid_at`) VALUES
(1, 2, 'PAID', 160000.00, '2026-01-16 17:22:37', '2026-01-16 17:22:37'),
(2, 3, 'PAID', 110000.00, '2026-01-16 17:22:37', '2026-01-16 17:22:37'),
(3, 4, 'PENDING', 70000.00, '2026-01-16 17:22:37', NULL),
(4, 5, 'FAILED', 40000.00, '2026-01-16 17:22:37', NULL),
(5, 2, 'PAID', 200000.00, '2026-01-16 17:22:37', '2026-01-16 17:22:37'),
(6, 2, 'PAID', 160000.00, '2026-01-16 17:23:04', '2026-01-16 17:23:04'),
(7, 3, 'PAID', 110000.00, '2026-01-16 17:23:04', '2026-01-16 17:23:04'),
(8, 4, 'PENDING', 70000.00, '2026-01-16 17:23:04', NULL),
(9, 5, 'FAILED', 40000.00, '2026-01-16 17:23:04', NULL),
(10, 2, 'PAID', 200000.00, '2026-01-16 17:23:04', '2026-01-16 17:23:04'),
(11, 7, 'PENDING', 0.00, '2026-06-14 15:02:11', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `item_type` enum('GATE','GAME') NOT NULL,
  `item_id` int(11) NOT NULL,
  `parent_item_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL CHECK (`quantity` >= 0),
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `item_type`, `item_id`, `parent_item_id`, `quantity`, `price`) VALUES
(1, 1, 'GATE', 2, NULL, 1, 40000.00),
(2, 1, 'GAME', 1, 1, 1, 50000.00),
(3, 1, 'GAME', 2, 1, 1, 70000.00),
(4, 2, 'GATE', 1, NULL, 1, 20000.00),
(5, 2, 'GAME', 3, 4, 1, 30000.00),
(6, 2, 'GAME', 4, 4, 1, 40000.00),
(7, 5, 'GATE', 4, NULL, 1, 150000.00),
(8, 5, 'GAME', 5, 7, 1, 80000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotions`
--

CREATE TABLE `promotions` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount` int(11) NOT NULL,
  `type` enum('ALL','GAME','TICKET') NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('ACTIVE','EXPIRED') DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `promotions`
--

INSERT INTO `promotions` (`id`, `code`, `discount`, `type`, `start_date`, `end_date`, `status`) VALUES
(1, 'SALE10', 10, 'ALL', '2025-01-01', '2025-12-31', 'ACTIVE'),
(2, 'GAME20', 20, 'GAME', '2025-01-01', '2025-06-30', 'ACTIVE'),
(3, 'TICKET15', 15, 'TICKET', '2025-01-01', '2025-05-31', 'ACTIVE'),
(4, 'VIP30', 30, 'ALL', '2025-01-01', '2025-03-31', 'EXPIRED'),
(5, 'NEWUSER5', 5, 'ALL', '2025-01-01', '2025-12-31', 'ACTIVE');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotion_order`
--

CREATE TABLE `promotion_order` (
  `id` int(11) NOT NULL,
  `promotion_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `promotion_order`
--

INSERT INTO `promotion_order` (`id`, `promotion_id`, `order_id`, `discount_amount`, `created_at`) VALUES
(1, 1, 1, 16000.00, '2026-01-16 17:24:02'),
(2, 2, 2, 22000.00, '2026-01-16 17:24:02'),
(3, 5, 5, 10000.00, '2026-01-16 17:24:02');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `order_item_id` int(11) NOT NULL,
  `item_type` enum('GATE','GAME') NOT NULL,
  `item_id` int(11) NOT NULL,
  `ticket_code` varchar(100) NOT NULL,
  `status` enum('UNUSED','USED') DEFAULT 'UNUSED',
  `created_at` datetime DEFAULT current_timestamp(),
  `used_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tickets`
--

INSERT INTO `tickets` (`id`, `order_id`, `order_item_id`, `item_type`, `item_id`, `ticket_code`, `status`, `created_at`, `used_at`) VALUES
(1, 1, 1, 'GATE', 2, 'GATE-0001', 'USED', '2026-01-16 17:23:40', NULL),
(2, 1, 2, 'GAME', 1, 'GAME-0001', 'UNUSED', '2026-01-16 17:23:40', NULL),
(3, 1, 3, 'GAME', 2, 'GAME-0002', 'UNUSED', '2026-01-16 17:23:40', NULL),
(4, 2, 4, 'GATE', 1, 'GATE-0002', 'USED', '2026-01-16 17:23:40', NULL),
(5, 2, 5, 'GAME', 3, 'GAME-0003', 'UNUSED', '2026-01-16 17:23:40', NULL),
(6, 2, 6, 'GAME', 4, 'GAME-0004', 'UNUSED', '2026-01-16 17:23:40', NULL),
(7, 5, 7, 'GATE', 4, 'GATE-0003', 'UNUSED', '2026-01-16 17:23:40', NULL),
(8, 5, 8, 'GAME', 5, 'GAME-0005', 'UNUSED', '2026-01-16 17:23:40', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('USER','ADMIN') DEFAULT 'USER',
  `status` enum('ACTIVE','BLOCK') DEFAULT 'ACTIVE',
  `otp_code` varchar(10) DEFAULT NULL,
  `otp_expired_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `status`, `otp_code`, `otp_expired_at`, `created_at`) VALUES
(1, 'admin', '$2y$10$ABi/hh1xLqmrj8xflj141ecfBf5srYQTKXTjhYj8OgvG.1t/HVuGe', 'admin@gmail.com', 'ADMIN', 'ACTIVE', NULL, NULL, '2026-01-16 17:22:09'),
(2, 'user1', '1', 'user1@gmail.com', 'USER', 'ACTIVE', NULL, NULL, '2026-01-16 17:22:09'),
(3, 'user2', '1', 'user2@gmail.com', 'USER', 'ACTIVE', NULL, NULL, '2026-01-16 17:22:09'),
(4, 'user3', '1', 'user3@gmail.com', 'USER', 'ACTIVE', NULL, NULL, '2026-01-16 17:22:09'),
(5, 'user4', '1', 'user4@gmail.com', 'USER', 'ACTIVE', NULL, NULL, '2026-01-16 17:22:09'),
(6, 'test', '$2y$10$InzMzRu8ZQAUnTQIBKvZV.OfcSZRKGJbpvTNt2oplUE1zm0z0JI/i', 'test@msalms.com', 'USER', 'ACTIVE', NULL, NULL, '2026-01-16 17:25:31'),
(7, 'manh', '$2y$10$7Ui8L.qK3OU.rR4OSn1BG.Ovd/1lTaLaGjU0NRAJXQ96UITDx4Xxe', 'cnjkj@gmail.com', 'USER', 'ACTIVE', NULL, NULL, '2026-06-14 14:24:01');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_feedback_user` (`user_id`),
  ADD KEY `fk_feedback_game` (`game_id`);

--
-- Chỉ mục cho bảng `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `gate_tickets`
--
ALTER TABLE `gate_tickets`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orders_user` (`user_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order_items_order` (`order_id`),
  ADD KEY `fk_order_items_parent` (`parent_item_id`);

--
-- Chỉ mục cho bảng `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Chỉ mục cho bảng `promotion_order`
--
ALTER TABLE `promotion_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_po_promotion` (`promotion_id`),
  ADD KEY `fk_po_order` (`order_id`);

--
-- Chỉ mục cho bảng `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ticket_code` (`ticket_code`),
  ADD KEY `fk_tickets_order` (`order_id`),
  ADD KEY `fk_tickets_order_item` (`order_item_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `gate_tickets`
--
ALTER TABLE `gate_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `promotion_order`
--
ALTER TABLE `promotion_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `fk_feedback_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`),
  ADD CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_order_items_parent` FOREIGN KEY (`parent_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `promotion_order`
--
ALTER TABLE `promotion_order`
  ADD CONSTRAINT `fk_po_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `fk_po_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`);

--
-- Các ràng buộc cho bảng `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `fk_tickets_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `fk_tickets_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
