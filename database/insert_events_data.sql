-- Sample data for events table
INSERT INTO `events` (`title`, `thumbnail`, `description`, `location`, `start_datetime`, `end_datetime`, `status`) VALUES
('Lễ hội Mùa hè 2024', 'https://example.com/images/summer.jpg', 'Lễ hội mùa hè sôi động với nhiều trò chơi hấp dẫn', 'Công viên Thống Nhất', '2024-06-01 08:00:00', '2024-06-05 22:00:00', 'FINISHED'),
('Đêm nhạc Rock', 'https://example.com/images/rock.jpg', 'Đêm nhạc rock với các ban nhạc nổi tiếng', 'Sân khấu Trung tâm', '2024-07-15 19:00:00', '2024-07-15 23:00:00', 'FINISHED'),
('Giải chạy Marathon', 'https://example.com/images/marathon.jpg', 'Giải chạy marathon cộng đồng lần thứ 5', 'Đường chính thành phố', '2024-08-20 05:00:00', '2024-08-20 12:00:00', 'FINISHED'),
('Triển lãm Hoa', 'https://example.com/images/flower.jpg', 'Triển lãm hoa và cây cảnh', 'Trung tâm Triển lãm', '2024-09-10 09:00:00', '2024-09-15 18:00:00', 'FINISHED'),
('Sự kiện Giáng sinh', 'https://example.com/images/christmas.jpg', 'Sự kiện Giáng sinh 2024', 'Quảng trường Trung tâm', '2024-12-20 18:00:00', '2024-12-25 22:00:00', 'FINISHED'),
('Lễ hội Mùa hè 2025', 'https://example.com/images/summer2025.jpg', 'Lễ hội mùa hè 2025 với nhiều hoạt động mới', 'Công viên Thống Nhất', '2025-06-01 08:00:00', '2025-06-30 22:00:00', 'FINISHED'),
('Hội chợ Ẩm thực', 'https://example.com/images/food.jpg', 'Hội chợ ẩm thực với các món ngon từ khắp nơi', 'Khu vực A - Công viên', '2025-07-10 10:00:00', '2025-07-15 21:00:00', 'ONGOING'),
('Đêm Laser Show', 'https://example.com/images/laser.jpg', 'Trình diễn laser ấn tượng', 'Sân vận động Quốc gia', '2025-08-01 20:00:00', '2025-08-01 23:00:00', 'COMING_SOON');

-- Sample data for event_images table
INSERT INTO `event_images` (`event_id`, `image`) VALUES
(1, 'https://example.com/images/summer1.jpg'),
(1, 'https://example.com/images/summer2.jpg'),
(1, 'https://example.com/images/summer3.jpg'),
(2, 'https://example.com/images/rock1.jpg'),
(2, 'https://example.com/images/rock2.jpg'),
(3, 'https://example.com/images/marathon1.jpg'),
(3, 'https://example.com/images/marathon2.jpg'),
(4, 'https://example.com/images/flower1.jpg'),
(4, 'https://example.com/images/flower2.jpg'),
(4, 'https://example.com/images/flower3.jpg'),
(5, 'https://example.com/images/christmas1.jpg'),
(5, 'https://example.com/images/christmas2.jpg'),
(6, 'https://example.com/images/summer2025_1.jpg'),
(6, 'https://example.com/images/summer2025_2.jpg'),
(7, 'https://example.com/images/food1.jpg'),
(7, 'https://example.com/images/food2.jpg'),
(8, 'https://example.com/images/laser1.jpg'),
(8, 'https://example.com/images/laser2.jpg');

-- Sample data for event_schedule table
INSERT INTO `event_schedule` (`event_id`, `schedule_time`, `title`, `description`, `sort_order`) VALUES
(1, '08:00:00', 'Khai mạc', 'Lễ khai mạc lễ hội', 1),
(1, '09:00:00', 'Biểu diễn văn nghệ', 'Các tiết mục văn nghệ đặc sắc', 2),
(1, '14:00:00', 'Trò chơi cộng đồng', 'Các trò chơi dành cho mọi lứa tuổi', 3),
(1, '19:00:00', 'Đêm nhạc', 'Các ca sĩ nổi tiếng biểu diễn', 4),
(1, '22:00:00', 'Bế mạc', 'Lễ bế mạc và pháo hoa', 5),
(2, '19:00:00', 'Mở màn', 'Chương trình mở màn', 1),
(2, '19:30:00', 'Ban nhạc A', 'Biểu diễn rock cổ điển', 2),
(2, '20:30:00', 'Ban nhạc B', 'Biểu diễn rock hiện đại', 3),
(2, '21:30:00', 'Ban nhạc C', 'Biểu diễn rock metal', 4),
(2, '22:30:00', 'Kết thúc', 'Cảm ơn khán giả', 5),
(3, '05:00:00', 'Tập trung', 'Các vận động viên tập trung', 1),
(3, '05:30:00', 'Khởi động', 'Khởi động trước giải', 2),
(3, '06:00:00', 'Xuất phát', 'Xuất phát giải chạy', 3),
(3, '08:00:00', 'Giải thưởng', 'Trao giải cho các VĐV', 4),
(3, '09:00:00', 'Kết thúc', 'Bế mạc giải đấu', 5),
(7, '10:00:00', 'Khai mạc hội chợ', 'Lễ khai mạc', 1),
(7, '11:00:00', 'Thử món ăn', 'Trải nghiệm các món ăn đặc sản', 2),
(7, '13:00:00', 'Nấu ăn trực live', 'Hướng dẫn nấu ăn', 3),
(7, '16:00:00', 'Thi ăn uống', 'Cuộc thi ăn uống', 4),
(7, '19:00:00', 'Biểu diễn ẩm thực', 'Các đầu bếp biểu diễn', 5),
(7, '21:00:00', 'Bế mạc', 'Lễ bế mạc hội chợ', 6),
(8, '20:00:00', 'Bắt đầu', 'Mở màn chương trình', 1),
(8, '20:30:00', 'Phần 1', 'Trình diễn laser phần 1', 2),
(8, '21:15:00', 'Phần 2', 'Trình diễn laser phần 2', 3),
(8, '22:00:00', 'Kết thúc', 'Kết thúc và cảm ơn', 4);