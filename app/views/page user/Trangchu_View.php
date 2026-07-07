<!DOCTYPE html>
<html lang="zxx">

<head>
    <meta charset="UTF-8">
    <meta name="description" content="Ogani Template">
    <meta name="keywords" content="Ogani, unica, creative, html">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>HG - Khu vui chơi</title>

    <!-- Google Font -->
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Montserrat:wght@200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">

    <!-- Css Styles -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/smoothness/jquery-ui.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/slicknav.min.css"> 
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/style1.css?v=1.2">
    <style>
        /* ===== PHẦN SỰ KIỆN NỔI BẬT - THIẾT KẾ MỚI ===== */
        .event-section {
            padding: 80px 0;
            background: linear-gradient(180deg, #f8f9fa 0%, #e8ecf1 100%);
            position: relative;
        }

        .event-section .section-title h2 {
            font-size: 2.5rem;
            font-weight: 800;
            color: #1a202c;
            margin-bottom: 20px;
        }

        .event-section .section-title p {
            font-size: 1.1rem;
            color: #718096;
            line-height: 1.8;
        }

        /* Event Slider Container */
        .event-slider-container {
            position: relative;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 60px rgba(0,0,0,0.2);
            margin-top: 30px;
        }

        .event-slider-wrapper {
            position: relative;
            height: 520px;
            overflow: hidden;
        }

        .event-slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 1s ease-in-out;
        }

        .event-slide.active {
            opacity: 1;
        }

        .event-slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Event Caption - Hiển thị trên ảnh */
        .event-caption {
            position: absolute;
            bottom: 60px;
            left: 50px;
            right: 50px;
            padding: 25px 35px;
            background: linear-gradient(135deg, rgba(102,126,234,0.9) 0%, rgba(118,75,162,0.9) 100%);
            border-radius: 16px;
            color: #fff;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.5s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .event-slide.active .event-caption {
            transform: translateY(0);
            opacity: 1;
        }

        .event-caption h3 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .event-caption p {
            font-size: 1rem;
            margin-bottom: 0;
            opacity: 0.9;
        }

        /* Nút prev/next */
        .slider-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 55px;
            height: 55px;
            background: rgba(255,255,255,0.9);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }

        .slider-btn:hover {
            background: #fff;
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        .slider-btn i {
            font-size: 1.2rem;
            color: #333;
        }

        .prev-btn {
            left: 20px;
        }

        .next-btn {
            right: 20px;
        }

        /* Chấm điều hướng */
        .slider-nav {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 10;
        }

        .slider-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(255,255,255,0.5);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .slider-dot.active {
            background: #fff;
            transform: scale(1.3);
        }

        .slider-dot:hover {
            background: rgba(255,255,255,0.8);
        }

        /* Button */
        .event-section .btn-danger {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            font-weight: 600;
            font-size: 1rem;
            padding: 14px 35px;
            border-radius: 50px;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(102,126,234,0.35);
        }

        .event-section .btn-danger:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(102,126,234,0.45);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .event-section {
                padding: 50px 0;
            }

            .event-section .section-title h2 {
                font-size: 1.8rem;
            }

            .event-slider-wrapper {
                height: 350px;
            }

            .event-caption {
                left: 20px;
                right: 20px;
                bottom: 50px;
                padding: 20px;
                transform: translateY(0);
                opacity: 1;
            }

            .event-caption h3 {
                font-size: 1.2rem;
            }

            .event-caption p {
                font-size: 0.9rem;
            }

            .slider-btn {
                width: 45px;
                height: 45px;
            }

            .prev-btn {
                left: 10px;
            }

            .next-btn {
                right: 10px;
            }
        }
    </style>
</head>
<body>    
    <?php include 'app/views/Layouts/header.php'?>


    <!-- Banner -->
    <section class="cafesanvuon">
        <div class="row">
            <div class="col-lg-12">
                <div class="hero__item set-bg" data-setbg="<?= BASE_URL ?>/public/img/banner.png">
                    <div class="hero__text">
                        <span>Kh vui chơi giải trí hàng đầu Việt Nam</span>
                        <h2>HG - Khu vui chơi giải trí</h2>
                        <p> Khám phá nụ cười, gắn kết trái tim!</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Banner End -->

    <!-- Giới thiệu -->
    <section class="gioithieu">
        <div class="container">
            <div class="row d-flex justify-content-center ">
                <div class="col-lg-4">
                    <img  class="img-fluid" src="<?= BASE_URL ?>/public/img/khuvuichoi.png" alt="gioithieu.png">
                </div>
                <div class="col-lg-4">
                    <div class="content__gioithieu">
                        <h3>Giới thiệu về chúng tôi</h3>
                        <p>
                            Tọa lạc ngay tại trung tâm thành phố Biên Hòa, HG Playground - khu vui chơi giải trí hiện đại hàng đầu với diện tích rộng lớn hơn 100.000m², 
                            là thiên đường dành riêng cho các trò chơi hấp dẫn và phiêu lưu dành cho mọi lứa tuổi.
                        </p>
                        <p>
                           Với hàng loạt trò chơi cảm giác mạnh, khu vui chơi trong nhà và ngoài trời cùng dịch vụ chuyên nghiệp,
                           HG Playground là điểm đến lý tưởng để bạn bè và gia đình cùng nhau thỏa sức vui chơi, cười đùa suốt cả ngày trong kỳ nghỉ cuối tuần hay dịp lễ.
                           Check-in ngay để "quẩy" hết mình nào!!!
                        </p>
                        <p>Không gian nơi đây sôi động và đầy màu sắc với các khu trò chơi đa dạng: máng trượt khổng lồ, nhà banh liên hoàn, trò chơi điện tử hiện đại,
                             khu phiêu lưu mạo hiểm và sân chơi vận động ngoài trời. HG Playground là lựa chọn hàng đầu của giới trẻ và gia đình, 
                            nơi bạn có thể tạm quên nhịp sống bận rộn để đắm chìm trong niềm vui bất tận, tham gia các trò chơi thử thách, 
                            chụp ảnh sống ảo hay tổ chức tiệc sinh nhật, team building sôi động cùng mọi người.
                        </p>
                    </div>
                </div>
            </div>
         
        </div>
    </section>
    <!-- Giới thiệu End -->

   
    <!-- banner nghỉ dưỡng -->
    <section class="bn-nghiduong">
        <div class="container">
            <div class="title">
                <h4>Thiên đường vui chơi hoàn hảo</h4>
                <h3>Khu vui chơi HG - Playground.</h3>
            </div>
            <div class="row">
                <div class="col-lg-3">
                    <div class="content">
                        <a href="#" target="_blank">
                            <div class="content-overlay"></div>
                            <img class="content-image" src="<?= BASE_URL ?>/public/img/hapdan.png">
                            <div class="content-details fadeIn-top">
                                <h3>Hấp dẫn</h3>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="content">
                        <a href="#" target="_blank">
                            <div class="content-overlay"></div>
                            <img class="content-image" src="<?= BASE_URL ?>/public/img/xanhmat.png">
                            <div class="content-details fadeIn-top">
                                <h3>Xanh mát</h3>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="content">
                        <a href="#" target="_blank">
                            <div class="content-overlay"></div>
                            <img class="content-image" src="<?= BASE_URL ?>/public/img/cotich.png">
                            <div class="content-details fadeIn-top">
                                <h3>Cổ tích</h3>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="content">
                        <a href="#" target="_blank">
                            <div class="content-overlay"></div>
                            <img class="content-image" src="<?= BASE_URL ?>/public/img/hiendai.png">
                            <div class="content-details fadeIn-top">
                                <h3>Hiện đại</h3>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- banner nghỉ dưỡng end -->

    
    <!-- ================= SỰ KIỆN NỔI BẬT ================= -->
<section class="from-blog spad event-section">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="section-title from-blog__title text-center">
                    <h2>Sự kiện nổi bật</h2>
                    <p class="mt-4 w-75 mx-auto">
                        HG – Playground không chỉ là khu vui chơi giải trí mà còn là nơi diễn ra
                        nhiều sự kiện đỉnh cao, mang đến những khoảnh khắc bùng nổ cảm xúc cho mọi lứa tuổi.
                    </p>
                </div>
            </div>
        </div>

        <!-- SLIDER TỔNG HỢP - Tất cả sự kiện -->
        <div class="event-slider-container">
            <div class="event-slider-wrapper" id="slider-events">
                <!-- Countdown 2026 -->
                <div class="event-slide active">
                    <img src="<?= BASE_URL ?>/public/img/event-slider-33.jpg" alt="Countdown pháo hoa">
                    <div class="event-caption">
                        <h3>Đêm Countdown Chào Năm Mới 2026</h3>
                        <p>Pháo hoa rực rỡ, đại nhạc hội với ca sĩ nổi tiếng</p>
                    </div>
                </div>
                <div class="event-slide">
                    <img src="<?= BASE_URL ?>/public/img/event-slider-2.png" alt="Sân khấu countdown">
                    <div class="event-caption">
                        <h3>Đêm Countdown Chào Năm Mới 2026</h3>
                        <p>DJ bùng nổ, countdown hoành tráng đón giao thừa</p>
                    </div>
                </div>
                <div class="event-slide">
                    <img src="<?= BASE_URL ?>/public/img/event-slider-34.webp" alt="Đám đông countdown">
                    <div class="event-caption">
                        <h3>Đêm Countdown Chào Năm Mới 2026</h3>
                        <p>Khoảnh khắc giao thừa đáng nhớ</p>
                    </div>
                </div>
                <!-- Lễ Hội Ánh Sáng -->
                <div class="event-slide">
                    <img src="<?= BASE_URL ?>/public/img/event-slider1.png" alt="Đèn LED lung linh">
                    <div class="event-caption">
                        <h3>Lễ Hội Ánh Sáng Magic Light</h3>
                        <p>Hàng triệu đèn LED lung linh</p>
                    </div>
                </div>
                <div class="event-slide">
                    <img src="<?= BASE_URL ?>/public/img/event-slider2.png" alt="Drone light show">
                    <div class="event-caption">
                        <h3>Lễ Hội Ánh Sáng Magic Light</h3>
                        <p>Biểu diễn drone light show</p>
                    </div>
                </div>
                <div class="event-slide">
                    <img src="<?= BASE_URL ?>/public/img/event-slider3.png" alt="Đường hầm ánh sáng">
                    <div class="event-caption">
                        <h3>Lễ Hội Ánh Sáng Magic Light</h3>
                        <p>Không gian cổ tích sống động</p>
                    </div>
                </div>
                <!-- Water Splash -->
                <div class="event-slide">
                    <img src="<?= BASE_URL ?>/public/img/event-slide1.png.png" alt="Té nước vui nhộn">
                    <div class="event-caption">
                        <h3>Water Splash Festival 2026</h3>
                        <p>Lễ hội té nước lớn nhất năm</p>
                    </div>
                </div>
                <div class="event-slide">
                    <img src="<?= BASE_URL ?>/public/img/event-slide2.png.png" alt="Pool party">
                    <div class="event-caption">
                        <h3>Water Splash Festival 2026</h3>
                        <p>DJ pool party bùng nổ</p>
                    </div>
                </div>
                
                <!-- Halloween -->
                <div class="event-slide">
                    <img src="<?= BASE_URL ?>/public/img/event-slid1.png" alt="Nhà ma kinh dị">
                    <div class="event-caption">
                        <h3>Halloween Horror Night</h3>
                        <p>Nhà ma kinh dị</p>
                    </div>
                </div>
                <div class="event-slide">
                    <img src="<?= BASE_URL ?>/public/img/event-slid2.png" alt="Hóa trang Halloween">
                    <div class="event-caption">
                        <h3>Halloween Horror Night</h3>
                        <p>Hóa trang zombie, ma quái</p>
                    </div>
                </div>
                <div class="event-slide">
                    <img src="<?= BASE_URL ?>/public/img/event-slid3.png" alt="Diễu hành ma quái">
                    <div class="event-caption">
                        <h3>Halloween Horror Night</h3>
                        <p>Diễu hành ma quái</p>
                    </div>
                </div>
            </div>

            <!-- Nút prev/next -->
            <button class="slider-btn prev-btn" onclick="changeSlide(-1)">
                <i class="fa fa-chevron-left"></i>
            </button>
            <button class="slider-btn next-btn" onclick="changeSlide(1)">
                <i class="fa fa-chevron-right"></i>
            </button>

            <!-- Chấm điều hướng -->
            <div class="slider-nav" id="nav-events"></div>
        </div>

        <!-- NÚT XEM TẤT CẢ SỰ KIỆN -->
        <div class="text-center mt-5">
            <a href="<?= BASE_URL ?>/tintuc" class="btn btn-danger btn-lg px-5 py-3 rounded-pill shadow">
                <i class="fa fa-ticket"></i> Xem tất cả sự kiện
            </a>
        </div>
    </div>
</section>
<!-- ================= END SỰ KIỆN NỔI BẬT ================= -->

    <!-- Tìm vé -->
    <section class="featured spad">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="section-title">
                        <h2>Tìm một tấm vé hoàn hảo dành cho bạn dành cho bạn</h2>
                    </div>
                    <div class="featured__controls">
                        <ul>
                            <li data-mixitup-control class="active" data-filter="*">Tất Cả</li>
                            <li data-mixitup-control data-filter=".oranges">Mạo hiểm </li>
                            <li data-mixitup-control data-filter=".fresh-meat">Thư giãn</li>
                            <li data-mixitup-control data-filter=".vegetables">Ocean Park</li>
                            <li data-mixitup-control data-filter=".fastfood">Chirldren</li>
                        </ul>
                    </div>
                </div>
            </div>
        <div class="row featured__filter">
            <?php
            // Map category từ database sang class filter
            $categoryMap = [
                'Adventure' => 'oranges',
                'Mạo hiểm' => 'oranges',
                'Mạo Hiểm' => 'oranges',
                'VR' => 'fresh-meat',
                'Relaxation' => 'fresh-meat',
                'Thư giãn' => 'fresh-meat',
                'Family' => 'vegetables',
                'Gia đình' => 'vegetables',
                'Kids' => 'fastfood',
                'Trẻ em' => 'fastfood',
                'Horror' => 'relax',
            ];
            
            if (!empty($games)): 
                $count = 0;
                foreach ($games as $game):
                    if ($count >= 4) break; // Chỉ hiển thị 4 trò chơi
                    $count++;
                    
                    $filterClass = $categoryMap[$game['category']] ?? 'oranges';
                    $gameName = $game['name'] ?? 'Trò chơi';
                    $description = substr($game['description'] ?? '', 0, 60);
                    $price = number_format($game['price'] ?? 0, 0, ',', '.');
                    $age = $game['recommended_age'] ?? 0;
                    
                    // Lấy ảnh đầu tiên từ danh sách ảnh
                    $image = '';
                    if (!empty($game['image'])) {
                        $images = explode(',', $game['image']);
                        $image = BASE_URL . '/public/uploads/' . trim($images[0]);
                    } else {
                        $image = BASE_URL . '/public/img/default-game.jpg';
                    }
            ?>
            <div class="col-lg-3 col-md-4 col-sm-6 mix <?= $filterClass ?>">
                <div class="card mb-4">
                    <img class="card-img-top" src="<?= $image ?>" alt="<?= htmlspecialchars($gameName) ?>" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title"><?= htmlspecialchars($gameName) ?></h5>
                        <div class="content pb-2 border-bottom">
                            <div class="d-flex align-items-center">
                                <img src="<?= BASE_URL ?>/public/img/ic1.png" alt="">
                                <span class="pl-2" style="font-size:13px;">Từ <?= $age ?>+ tuổi</span>
                            </div>
                            <div class="d-flex align-items-center">
                                <img src="<?= BASE_URL ?>/public/img/ic4.png" alt="">
                                <span class="pl-2" style="font-size:13px;"><?= htmlspecialchars($description) ?></span>
                            </div>
                            <div class="d-flex align-items-center">
                                <img src="<?= BASE_URL ?>/public/img/ic4.png" alt="">
                                <span class="pl-2" style="font-size:13px;"><?= $price ?>đ</span>
                            </div>
                        </div>

                        <div class="row pt-4">
                            <div class="col-lg-7">
                                <span style="font-size:13px;"><?= htmlspecialchars($game['category'] ?? 'Trò chơi') ?></span>
                            </div>
                            <div class="col-lg-5">
                                <a class="booknow" href="<?= BASE_URL ?>/Trochoi">Chi tiết</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
            <?php else: ?>
            <div class="col-12 text-center py-5">
                <p>Chưa có trò chơi nào để hiển thị</p>
            </div>
            <?php endif; ?>
        </div>
    </div>
</section>

    <!-- Blog Section End -->


   <!-- ================== Trải nghiệm tại khu vui chơi =================== -->
<section class="trai-nghiem spad">
    <div class="container">
        <div class="row align-items-center">
            <!-- Ảnh bên trái (trải nghiệm vui chơi) -->
            <div class="col-lg-6 mb-5 mb-lg-0">
                <img src="<?= BASE_URL ?>/public/img/bn-trainghiem.png" class="img-fluid w-100 rounded-3 shadow" alt="Trải nghiệm tại HG Playground">
            </div>

            <!-- Nội dung bên phải -->
            <div class="col-lg-6">
                <div class="content__about">
                    <h3 class="mb-4">Trải nghiệm tuyệt vời tại HG Playground</h3>
                    <p class="lead mb-4">
                        Hãy tạm gác lại cuộc sống thường nhật để bước vào thế giới vui chơi đầy màu sắc tại HG Playground! 
                        Một ngày trọn vẹn niềm vui, tiếng cười và kỷ niệm bên gia đình & bạn bè đang chờ bạn khám phá.
                    </p>

                    <div class="content-trainghiem">
                        <div class="d-flex align-items-start mb-4">
                            <img src="<?= BASE_URL ?>/public/img/check.png" alt="Check" class="me-3" style="width: 50px;">
                            <div>
                                <h4>Tàu Lượn Siêu Tốc & Trò Chơi Mạo Hiểm</h4>
                                <p>Thử thách bản thân với tốc độ, độ cao và những vòng xoay nghẹt thở!</p>
                            </div>
                        </div>

                        <div class="d-flex align-items-start mb-4">
                            <img src="<?= BASE_URL ?>/public/img/check.png" alt="Check" class="me-3" style="width: 50px;">
                            <div>
                                <h4>Máng Trượt & Khu Vui Chơi Nước Ocean Park</h4>
                                <p>Cảm giác mát lạnh, phấn khích khi trượt từ độ cao xuống hồ nước rộng lớn.</p>
                            </div>
                        </div>

                        <div class="d-flex align-items-start mb-4">
                            <img src="<?= BASE_URL ?>/public/img/check.png" alt="Check" class="me-3" style="width: 50px;">
                            <div>
                                <h4>Vòng Quay Khổng Lồ & Trò Chơi Gia Đình</h4>
                                <p>Ngắm toàn cảnh khu vui chơi từ trên cao, an toàn và vui vẻ cho cả nhà.</p>
                            </div>
                        </div>

                        <div class="d-flex align-items-start mb-4">
                            <img src="<?= BASE_URL ?>/public/img/check.png" alt="Check" class="me-3" style="width: 50px;">
                            <div>
                                <h4>Khu Vui Chơi Trẻ Em & Vòng Quay Ngựa Gỗ</h4>
                                <p>Thế giới cổ tích với trò chơi nhẹ nhàng, phù hợp cho bé và gia đình.</p>
                            </div>
                        </div>

                        <div class="d-flex align-items-start mb-4">
                            <img src="<?= BASE_URL ?>/public/img/check.png" alt="Check" class="me-3" style="width: 50px;">
                            <div>
                                <h4>Show Biểu Diễn & Sự Kiện Đặc Biệt</h4>
                                <p>Pháo hoa, nhạc sống, biểu diễn xiếc – những khoảnh khắc đáng nhớ mỗi ngày!</p>
                            </div>
                        </div>
                    </div>

                    <a href="/Doan/trochoi" class="btn btn-danger btn-lg mt-4 px-5 py-3 rounded-pill shadow">
                        Khám Phá Ngay Các Trò Chơi!
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- ===================================== -->

    <section class="testimonial">
    <div class="container">
        <div class="row">
            <div class="col-lg-6 d-none d-lg-block">
                <ol class="carousel-indicators tabs">
                    <?php foreach ($data['feedbacks'] as $index => $fb): ?>
                        <li data-target="#carouselExampleIndicators" data-slide-to="<?= $index ?>" class="<?= $index === 0 ? 'active' : '' ?>">
                            <figure>
                                <!-- Ảnh đại diện (nếu có cột avatar trong DB thì dùng, hiện tại dùng ảnh mặc định) -->
                                <img src="<?= BASE_URL ?>/public/img/fb<?= $index + 1 ?>.jpg" class="img-fluid" alt="Khách hàng <?= htmlspecialchars($fb['name'] ?? 'Khách hàng') ?>">
                            </figure>
                        </li>
                    <?php endforeach; ?>
                </ol>
            </div>

            <div class="col-lg-6 d-flex justify-content-center align-items-center">
                <div id="carouselExampleIndicators" data-interval="false" class="carousel slide" data-ride="carousel">
                    <h1>Khách hàng nói gì về chúng tôi?</h1>
                    <div class="carousel-inner">
                        <?php foreach ($data['feedbacks'] as $index => $fb): ?>
                            <div class="carousel-item <?= $index === 0 ? 'active' : '' ?>">
                                <div class="rating">
                                    <?php for ($i = 1; $i <= 5; $i++): ?>
                                        <i class="fa fa-star <?= $i <= $fb['rating'] ? 'filled' : '' ?>" aria-hidden="true"></i>
                                    <?php endfor; ?>
                                </div>
                                <div class="quote-wrapper">
                                    <p><?= htmlspecialchars($fb['content']) ?></p>
                                    <h3><?= htmlspecialchars($fb['name'] ?? 'Khách hàng') ?></h3>
                                    <small><?= date('d/m/Y', strtotime($fb['created_at'])) ?></small>
                                </div>
                            </div>
                        <?php endforeach; ?>

                        <?php if (empty($data['feedbacks'])): ?>
                            <div class="carousel-item active">
                                <div class="rating">
                                    <i class="fa fa-star filled"></i>
                                    <i class="fa fa-star filled"></i>
                                    <i class="fa fa-star filled"></i>
                                    <i class="fa fa-star filled"></i>
                                    <i class="fa fa-star filled"></i>
                                </div>
                                <div class="quote-wrapper">
                                    <p>Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!</p>
                                    <h3>Khách hàng HG Playground</h3>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>

                    <ol class="carousel-indicators indicators">
                        <?php foreach ($data['feedbacks'] as $index => $fb): ?>
                            <li data-target="#carouselExampleIndicators" data-slide-to="<?= $index ?>" class="<?= $index === 0 ? 'active' : '' ?>"></li>
                        <?php endforeach; ?>
                    </ol>
                </div>
            </div>
        </div>
    </div>
</section>

    <!-- Footer-->
    <?php include 'app/views/Layouts/footer.php' ?>
    <!-- Footer -->

    <!-- Js Plugins -->
    
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://code.jquery.com/jquery-migrate-3.4.1.min.js"></script>
    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/js/jquery.nice-select.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/SlickNav/1.0.10/jquery.slicknav.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mixitup/3.3.1/mixitup.min.js"></script>
    <script src="<?= BASE_URL ?>/public/Js/main.js"></script>

    <!-- Script hiệu ứng auto-slide cho phần sự kiện -->
    <script>
        // Slider tổng hợp
        (function() {
            const wrapper = document.getElementById('slider-events');
            const nav = document.getElementById('nav-events');
            if (!wrapper || !nav) return;

            const slides = wrapper.querySelectorAll('.event-slide');
            let currentIndex = 0;
            let autoPlayInterval;

            // Tạo các nút dot
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
                dot.addEventListener('click', () => goToSlide(index));
                nav.appendChild(dot);
            });

            // Hàm chuyển slide
            function goToSlide(index) {
                slides.forEach(slide => slide.classList.remove('active'));
                nav.querySelectorAll('.slider-dot').forEach(dot => dot.classList.remove('active'));

                slides[index].classList.add('active');
                nav.children[index].classList.add('active');
                currentIndex = index;
            }

            // Hàm chuyển slide tiếp theo
            function nextSlide() {
                const nextIndex = (currentIndex + 1) % slides.length;
                goToSlide(nextIndex);
            }

            // Hàm chuyển slide khi click prev/next
            window.changeSlide = function(direction) {
                stopAutoPlay();
                let newIndex = currentIndex + direction;
                if (newIndex < 0) newIndex = slides.length - 1;
                if (newIndex >= slides.length) newIndex = 0;
                goToSlide(newIndex);
                startAutoPlay();
            }

            // Auto play - chuyển mỗi 4 giây
            function startAutoPlay() {
                autoPlayInterval = setInterval(nextSlide, 4000);
            }

            function stopAutoPlay() {
                clearInterval(autoPlayInterval);
            }

            // Sự kiện hover thì tạm dừng
            wrapper.addEventListener('mouseenter', stopAutoPlay);
            wrapper.addEventListener('mouseleave', startAutoPlay);

            // Bắt đầu auto play
            startAutoPlay();
        })();
    </script>

</body>
</html>
