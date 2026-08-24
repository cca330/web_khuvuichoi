-- Co so du lieu cua game-service
USE game_db;

CREATE TABLE `games` (
	`id` int NOT NULL AUTO_INCREMENT,
	`name` varchar(100) NOT NULL,
	`description` text,
	`recommended_age` int,
	`category` varchar(50),
	`allowed_ticket` enum('ALL','ADULT') DEFAULT 'ALL',
	`status` enum('OPEN','CLOSE') DEFAULT 'OPEN',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `games` (`id`, `name`, `description`, `recommended_age`, `category`, `allowed_ticket`, `status`) VALUES
(1, 'Nha ma', 'Trai nghiem nha ma kinh di', 16, 'Kinh di', 'ADULT', 'OPEN'),
(2, 'Tau luon sieu toc', 'Tau luon sieu toc toc do cao', 12, 'Mao hiem', 'ALL', 'OPEN'),
(3, 'Vong quay mat troi', 'Vong quay phu hop cho gia dinh', 5, 'Gia dinh', 'ALL', 'OPEN'),
(4, 'Xe dien dung', 'Tro choi xe dien danh cho tre em', 6, 'Tre em', 'ALL', 'OPEN'),
(5, 'Tro choi VR', 'Trai nghiem thuc te ao', 18, 'VR', 'ADULT', 'OPEN');

CREATE TABLE `game_images` (
	`id` int NOT NULL AUTO_INCREMENT,
	`game_id` int NOT NULL,
	`image` varchar(255) NOT NULL,
	`sort_order` int DEFAULT 1,
	PRIMARY KEY (`id`),
	KEY `idx_game_images_game` (`game_id`),
	CONSTRAINT `fk_game_images_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `game_images` (`game_id`, `image`, `sort_order`) VALUES
(1, 'haunted-1.jpg', 1), (1, 'haunted-2.jpg', 2), (1, 'haunted-3.jpg', 3),
(2, 'coaster-1.jpg', 1), (2, 'coaster-2.jpg', 2), (3, 'wheel-1.jpg', 1),
(4, 'bumper-1.jpg', 1), (5, 'vr-1.jpg', 1), (5, 'vr-2.jpg', 2);

CREATE TABLE `feedbacks` (
	`id` int NOT NULL AUTO_INCREMENT,
	`user_id` int DEFAULT NULL,
	`game_id` int DEFAULT NULL,
	`content` text,
	`rating` int DEFAULT NULL CHECK (`rating` between 1 and 5),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`),
	KEY `idx_feedbacks_game` (`game_id`),
	CONSTRAINT `fk_feedbacks_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `feedbacks` (`id`, `user_id`, `game_id`, `content`, `rating`, `created_at`) VALUES
(1, 2, 1, 'Rat dang so, choi rat thich!', 5, '2026-01-16 17:23:45'),
(2, 3, 2, 'Tau chay nhanh, hoi chong mat', 4, '2026-01-16 17:23:45'),
(3, 4, 3, 'Phu hop cho gia dinh', 5, '2026-01-16 17:23:45'),
(4, 5, 4, 'Tre em rat thich', 4, '2026-01-16 17:23:45'),
(5, 2, 5, 'VR hoi dat nhung rat da', 5, '2026-01-16 17:23:45');
