<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sự Kiện Nổi Bật - HG Playground</title>
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/bootstrap.min.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/font-awesome.min.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/style1.css?v=1.0">
    <style>
        .event-banner { height: 70vh; background-size: cover; background-position: center; position: relative; }
        .event-banner .overlay { background: rgba(0,0,0,0.6); position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        .event-title { font-size: 3rem; font-weight: bold; color: #ff416c; margin-bottom: 20px; }
        .price-table th { background: #ff416c; color: white; }
        .price-table td { vertical-align: middle; }
        .buy-btn { background: #ff416c; border: none; padding: 15px 40px; font-size: 1.4rem; border-radius: 50px; box-shadow: 0 10px 20px rgba(255,65,108,0.4); transition: all 0.3s; }
        .buy-btn:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(255,65,108,0.6); }
        .tip-box { background: #fffbe6; border-left: 5px solid #ffc107; padding: 20px; border-radius: 10px; }
        .section-divider { border-bottom: 2px solid #eee; padding-bottom: 60px; margin-bottom: 80px; }
    </style>
</head>
<body>

    <?php include 'app/views/Layouts/header.php'; ?>

   

    <!-- Banner chung trang sự kiện -->
    <section class="event-banner set-bg" data-setbg="<?= BASE_URL ?>/public/img/events/banner-events-total.png">
        <div class="overlay d-flex align-items-center justify-content-center">
            <div class="text-center text-white">
                <h1 class="display-3 font-weight-bold">SỰ KIỆN NỔI BẬT</h1>
                <p class="lead">Trải nghiệm những chương trình đặc biệt nhất tại HG Playground</p>
            </div>
        </div>
    </section>

    <section class="spad bg-light">
        <div class="container">

            <!-- 1. Countdown Năm Mới 2026 -->
            <div class="row section-divider">
                <div class="col-lg-6">
                    <img src="<?= BASE_URL ?>/public/img/event-slider1.png" class="img-fluid rounded shadow" alt="Countdown Năm Mới">
                </div>
                <div class="col-lg-6">
                    <h2 class="event-title">Đêm Countdown Chào Năm Mới 2026</h2>
                    <p><strong>Thời gian:</strong> 16/2/2025 - 17/02/2026 | 19:00 - 00:30</p>
                    <p><strong>Địa điểm:</strong> Sân khấu chính ngoài trời</p>
                    <p class="lead">Pháo hoa rực rỡ, đại nhạc hội với ca sĩ nổi tiếng, DJ bùng nổ, countdown hoành tráng đón khoảnh khắc giao thừa.</p>

                    <h4>Lịch Trình Chi Tiết</h4>
                    <ol>
                        <li>19:00 - Mở cửa đón khách</li>
                        <li>20:00 - Biểu diễn acoustic</li>
                        <li>22:00 - Đại nhạc hội với ca sĩ khách mời</li>
                        <li>23:55 - Countdown chính thức</li>
                        <li>00:00 - Pháo hoa chào năm mới</li>
                    </ol>

                    <div class="text-center mt-5">
                        <a href="#" class="buy-btn text-white">Comming soon</a>
                    </div>
                </div>
            </div>

            <!-- 2. Lễ Hội Ánh Sáng Magic Light 2025 -->
            <div class="row section-divider">
                <div class="col-lg-6 order-lg-2">
                    <img src="<?= BASE_URL ?>/public/img/event-slider-1.png" class="img-fluid rounded shadow" alt="Lễ Hội Ánh Sáng">
                </div>
                <div class="col-lg-6 order-lg-1">
                    <h2 class="event-title">Lễ Hội Ánh Sáng Magic Light 2026</h2>
                    <p><strong>Thời gian:</strong> 10/2/2025 - 15/2/2026 | 17:00 - 22:00 hàng ngày</p>
                    <p><strong>Địa điểm:</strong> Toàn khu công viên</p>
                    <p class="lead">Hàng triệu đèn LED lung linh, đường hầm ánh sáng, biểu diễn drone light, không gian cổ tích sống động mỗi tối cuối tuần.</p>

                    <h4>Lịch Trình Chi Tiết</h4>
                    <ol>
                        <li>17:00 - Mở cửa</li>
                        <li>18:30 - Biểu diễn ánh sáng đầu tiên</li>
                        <li>20:00 - Drone light show (cuối tuần)</li>
                        <li>21:30 - Đỉnh cao ánh sáng toàn khu</li>
                    </ol>


                    <h4>Mẹo Tham Gia</h4>
                    <div class="tip-box">
                        <ul>
                            <li>Mang máy ảnh để chụp ảnh đẹp</li>
                            <li>Đi giày thoải mái vì phải di chuyển nhiều</li>
                            <li>Đến từ 18h để tránh đông</li>
                        </ul>
                    </div>

                    <div class="text-center mt-5">
                        <a href="/datve" class="buy-btn text-white">Coming soon</a>
                    </div>
                </div>
            </div>

            <!-- 3. Water Splash Festival 2026 -->
            <div class="row section-divider">
                <div class="col-lg-6">
                    <img src="<?= BASE_URL ?>/public/img/event-slide2.png.png" class="img-fluid rounded shadow" alt="Water Splash Festival">
                </div>
                <div class="col-lg-6">
                    <h2 class="event-title">Water Splash Festival 2026</h2>
                    <p><strong>Thời gian:</strong> 01/04/2026 - 30/04/2026 | 10:00 - 22:00 hàng ngày</p>
                    <p><strong>Địa điểm:</strong> Khu Ocean Park</p>
                    <p class="lead">Lễ hội té nước lớn nhất năm, DJ pool party, bắn súng nước, foam party và hàng ngàn phần quà hấp dẫn.</p>

                    <h4>Lịch Trình Chi Tiết</h4>
                    <ol>
                        <li>10:00 - Mở cửa khu nước</li>
                        <li>14:00 - Foam party chính</li>
                        <li>16:00 - Trò chơi té nước tập thể</li>
                        <li>20:00 - DJ pool party đêm</li>
                    </ol>

                   
                    <h4>Mẹo Tham Gia</h4>
                    <div class="tip-box">
                        <ul>
                            <li>Mang quần áo bơi và khăn lau</li>
                            <li>Để đồ cá nhân ở tủ đồ miễn phí</li>
                            <li>Uống nhiều nước để tránh mất nước</li>
                        </ul>
                    </div>

                    <div class="text-center mt-5">
                        <a href="#" class="buy-btn text-white">>Coming soon</a>
                    </div>
                </div>
            </div>

            <!-- 4. Halloween Horror Night 2025 -->
            <div class="row section-divider">
                <div class="col-lg-6 order-lg-2">
                    <img src="<?= BASE_URL ?>/public/img/event-slid3.png" class="img-fluid rounded shadow" alt="Halloween Horror Night">
                </div>
                <div class="col-lg-6 order-lg-1">
                    <h2 class="event-title">Halloween Horror Night 2025</h2>
                    <p><strong>Thời gian:</strong> 25/10/2025 - 02/11/2025 | 18:00 - 23:00 hàng ngày</p>
                    <p><strong>Địa điểm:</strong> Khu Horror Zone</p>
                    <p class="lead">Nhà ma kinh dị, hóa trang zombie, diễu hành ma quái, trò chơi thử thách can đảm và quà tặng bí ẩn.</p>

                    <h4>Lịch Trình Chi Tiết</h4>
                    <ol>
                        <li>18:00 - Mở cửa</li>
                        <li>19:00 - Diễu hành zombie</li>
                        <li>20:00 - Nhà ma mở cửa</li>
                        <li>22:00 - Biểu diễn kinh dị cuối</li>
                    </ol>

                    <h4>Mẹo Tham Gia</h4>
                    <div class="tip-box">
                        <ul>
                            <li>Không phù hợp trẻ dưới 12 tuổi</li>
                            <li>Mang giày thể thao để chạy khi cần!</li>
                            <li>Chụp ảnh với zombie miễn phí</li>
                        </ul>
                    </div>

                    <div class="text-center mt-5">
                        <a href="#" class="buy-btn text-white">>Coming soon</a>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <!-- Footer -->
    <?php include 'app/views/Layouts/footer.php' ?>

    <script src="<?= BASE_URL ?>/public/Js/jquery-3.3.1.min.js"></script>
    <script src="<?= BASE_URL ?>/public/Js/bootstrap.min.js"></script>
    <script src="<?= BASE_URL ?>/public/Js/owl.carousel.min.js"></script>
    <script src="<?= BASE_URL ?>/public/Js/main.js"></script>
</body>
</html>