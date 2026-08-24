-- Co so du lieu cua user-service
USE user_db;
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
