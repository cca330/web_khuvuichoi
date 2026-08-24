-- Co so du lieu cua event-service
USE event_db;

CREATE TABLE `events` (
	`id` int NOT NULL AUTO_INCREMENT,
	`title` varchar(255) NOT NULL,
	`thumbnail` varchar(255) NOT NULL,
	`is_featured` tinyint(1) NOT NULL DEFAULT 0,
	`description` text,
	`location` varchar(255),
	`start_datetime` datetime NOT NULL,
	`end_datetime` datetime NOT NULL,
	`status` enum('COMING_SOON','ONGOING','FINISHED','CANCELLED') DEFAULT 'COMING_SOON',
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`),
	CONSTRAINT `chk_events_dates` CHECK (`end_datetime` >= `start_datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `event_images` (
	`id` int NOT NULL AUTO_INCREMENT,
	`event_id` int NOT NULL,
	`image` varchar(255) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `idx_event_images_event` (`event_id`),
	CONSTRAINT `fk_event_images_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `event_schedule` (
	`id` int NOT NULL AUTO_INCREMENT,
	`event_id` int NOT NULL,
	`schedule_time` time,
	`title` varchar(255),
	`description` text,
	`sort_order` int DEFAULT 1,
	PRIMARY KEY (`id`),
	KEY `idx_event_schedule_event` (`event_id`),
	CONSTRAINT `fk_event_schedule_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
