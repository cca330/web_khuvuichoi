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
</head>
<body>    
    <?php include 'app/views/Layouts/header.php'?>


    <!-- Banner -->
    <section class="cafesanvuon">
        <div class="row">
            <div class="col-lg-12">
                <div class="hero__item set-bg" data-setbg="<?= BASE_URL ?>/public/img/banner.png">
                    <div class="hero__text">
                        <span>Khu vui chơi giải trí hàng đầu Việt Nam</span>
                        <h2>HG - Khu vui choi</h2>
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
<section class="from-blog spad">
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

        <!-- TAB MENU -->
        <div class="play">
            <ul class="nav nav-pills row" id="pills-tab" role="tablist">

                <!-- Countdown Năm Mới 2026 -->
                <li class="nav-item col-lg-3 col-md-6 mb-3">
                    <a class="nav-link active" id="countdown-tab" data-toggle="pill" href="#countdown" role="tab">
                        <div class="content">
                            <div class="content-overlay"></div>
                            <div class="box">
                               
                                <p>Countdown 2026</p>
                            </div>
                            <div class="content-details fadeIn-top">
                                <h3>Đêm Countdown Chào Năm Mới 2026</h3>
                                <p>
                                    Pháo hoa rực rỡ, đại nhạc hội với ca sĩ nổi tiếng, DJ bùng nổ,
                                    countdown hoành tráng đón khoảnh khắc giao thừa.
                                </p>
                            </div>
                        </div>
                    </a>
                </li>

                <!-- Lễ Hội Ánh Sáng -->
                <li class="nav-item col-lg-3 col-md-6 mb-3">
                    <a class="nav-link" id="lights-tab" data-toggle="pill" href="#lights" role="tab">
                        <div class="content">
                            <div class="content-overlay"></div>
                            <div class="box">
                                <p>Lễ Hội Ánh Sáng</p>
                            </div>
                            <div class="content-details fadeIn-top">
                                <h3>Lễ Hội Ánh Sáng Magic Light 2025</h3>
                                <p>
                                    Hàng triệu đèn LED lung linh, đường hầm ánh sáng, biểu diễn drone light,
                                    không gian cổ tích sống động mỗi tối cuối tuần.
                                </p>
                            </div>
                        </div>
                    </a>
                </li>

                <!-- Water Splash Festival -->
                <li class="nav-item col-lg-3 col-md-6 mb-3">
                    <a class="nav-link" id="water-tab" data-toggle="pill" href="#water" role="tab">
                        <div class="content">
                            <div class="content-overlay"></div>
                            <div class="box">
                                <p>Water Splash</p>
                            </div>
                            <div class="content-details fadeIn-top">
                                <h3>Water Splash Festival 2026</h3>
                                <p>
                                    Lễ hội té nước lớn nhất năm, DJ pool party, bắn súng nước,
                                    foam party và hàng ngàn phần quà hấp dẫn.
                                </p>
                            </div>
                        </div>
                    </a>
                </li>

                <!-- Halloween Night -->
                <li class="nav-item col-lg-3 col-md-6 mb-3">
                    <a class="nav-link" id="halloween-tab" data-toggle="pill" href="#halloween" role="tab">
                        <div class="content">
                            <div class="content-overlay"></div>
                            <div class="box">
                                <p>Halloween Night</p>
                            </div>
                            <div class="content-details fadeIn-top">
                                <h3>Halloween Horror Night 2025</h3>
                                <p>
                                    Nhà ma kinh dị, hóa trang zombie, diễu hành ma quái,
                                    trò chơi thử thách can đảm và quà tặng bí ẩn.
                                </p>
                            </div>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
        <!-- TAB CONTENT - Carousel ảnh lớn -->
        <div class="tab-content mt-5" id="pills-tabContent">
            <!-- Countdown -->
            <div class="tab-pane fade show active" id="countdown" role="tabpanel">
                <div class="banner5__slider owl-carousel">
                    <img src="<?= BASE_URL ?>/public/img/event-slider-1.png" alt="Countdown pháo hoa">
                    <img src="<?= BASE_URL ?>/public/img/event-slider-2.png" alt="Sân khấu countdown">
                    <img src="<?= BASE_URL ?>/public/img/event-slider-3.png" alt="Đám đông countdown">
                </div>
            </div>

            <!-- Lễ Hội Ánh Sáng -->
            <div class="tab-pane fade" id="lights" role="tabpanel">
                <div class="banner5__slider owl-carousel">
                    <img src="<?= BASE_URL ?>/public/img/event-slider1.png" alt="Đèn LED lung linh">
                    <img src="<?= BASE_URL ?>/public/img/event-slider2.png" alt="Drone light show">
                    <img src="<?= BASE_URL ?>/public/img/event-slider3.png" alt="Đường hầm ánh sáng">
                </div>
            </div>

            <!-- Water Splash -->
            <div class="tab-pane fade" id="water" role="tabpanel">
                <div class="banner5__slider owl-carousel">
                    <img src="<?= BASE_URL ?>/public/img/event-slide1.png.png" alt="Té nước vui nhộn">
                    <img src="<?= BASE_URL ?>/public/img/event-slide2.png.png" alt="Pool party">
                    <img src="<?= BASE_URL ?>/public/img/event-slide3.png" alt="Foam party">
                </div>
            </div>

            <!-- Halloween -->
            <div class="tab-pane fade" id="halloween" role="tabpanel">
                <div class="banner5__slider owl-carousel">
                    <img src="<?= BASE_URL ?>/public/img/event-slid1.png" alt="Nhà ma kinh dị">
                    <img src="<?= BASE_URL ?>/public/img/event-slid2.png" alt="Hóa trang Halloween">
                    <img src="<?= BASE_URL ?>/public/img/event-slid3.png" alt="Diễu hành ma quái">
                </div>
            </div>
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
            <!-- class="col-lg-3 col-md-4 col-sm-6 mix oranges fastfood" -->

<div class="col-lg-3 col-md-4 col-sm-6 mix oranges ">
    <div class="card mb-4">
        <img class="card-img-top" src="<?= BASE_URL ?>/public/img/maohiem.png" alt="Trò chơi mạo hiểm">
        <div class="card-body">
            <h5 class="card-title">Trò chơi mạo hiểm</h5>
            <div class="content pb-2 border-bottom">
                <div class="d-flex align-items-center">
                    <img src="<?= BASE_URL ?>/public/img/ic1.png" alt="">
                    <span class="pl-2" style="font-size:13px;">Trên 12 tuổi</span>
                </div>
                
                <div class="d-flex align-items-center">
                    <img src="<?= BASE_URL ?>/public/img/ic4.png" alt="">
                    <span class="pl-2" style="font-size:13px;">An toàn cao</span>
                </div>
                <div class="d-flex align-items-center">
                    <img src="<?= BASE_URL ?>/public/img/ic4.png" alt="">
                    <span class="pl-2" style="font-size:13px;">Combo 350.000 VND</span>
                </div>
            </div>

            <div class="row pt-4">
                <div class="col-lg-7">
                    <span style="font-size:13px;">Cảm giác mạnh </span>
                </div>
                <div class="col-lg-5">
                    <a class="booknow" href="/Doan/trochoi">Chơi ngay</a>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="col-lg-3 col-md-4 col-sm-6 mix fresh-meat">
    <div class="card mb-4">
        <img class="card-img-top" src="<?= BASE_URL ?>/public/img/giadinh.png" alt="Trò chơi gia đình">
        <div class="card-body">
            <h5 class="card-title">Trò chơi Thư giãn</h5>

            <div class="content pb-2 border-bottom">
                <div class="d-flex align-items-center">
                    <img src="<?= BASE_URL ?>/public/img/ic1.png" alt="">
                    <span class="pl-2" style="font-size:13px;">Mọi lứa tuổi</span>
                </div>

                <div class="d-flex align-items-center">
                    <img src="<?= BASE_URL ?>/public/img/ic4.png" alt="">
                    <span class="pl-2" style="font-size:13px;">An toàn cho trẻ em</span>
                </div>
                <div class="d-flex align-items-center">
                    <img src="<?= BASE_URL ?>/public/img/ic4.png" alt="">
                    <span class="pl-2" style="font-size:13px;">Combo 350.000 VND</span>
                </div>
            </div>

            <div class="row pt-4">
                <div class="col-lg-7">
                    <span style="font-size:13px;">Vui nhộn – gắn kết</span>
                </div>
                <div class="col-lg-5">
                    <a class="booknow" href="/Doan/trochoi">Chơi ngay</a>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="col-lg-3 col-md-4 col-sm-6 mix vegetables">
    <div class="card mb-4">
        <img class="card-img-top" src="<?= BASE_URL ?>/public/img/oceanpark.png" alt="Ocean Park">
        <div class="card-body">
            <h5 class="card-title">Ocean Park</h5>

            <div class="content pb-2 border-bottom">
                <div class="d-flex align-items-center">
                    <img src="<?= BASE_URL ?>/public/img/ic1.png" alt="">
                    <span class="pl-2" style="font-size:13px;">Mọi lứa tuổi</span>
                </div>
                <div class="d-flex align-items-center">
                    <img src="<?= BASE_URL ?>/public/img/ic3.png" alt="">
                    <span class="pl-2" style="font-size:13px;">Trượt nước – hồ sóng</span>
                </div>
                <div class="d-flex align-items-center">
                    <img src="<?= BASE_URL ?>/public/img/ic4.png" alt="">
                    <span class="pl-2" style="font-size:13px;">Nhân viên cứu hộ</span>
                </div>
                <div class="d-flex align-items-center">
                    <img src="<?= BASE_URL ?>/public/img/ic4.png" alt="">
                    <span class="pl-2" style="font-size:13px;">Combo 500.000 VND</span>
                </div>
            </div>

            <div class="row pt-4">
                <div class="col-lg-7">
                    <span style="font-size:13px;">Mát mẻ - năng động</span>
                </div>
                <div class="col-lg-5">
                    <a class="booknow" href="/Doan/trochoi">Khám phá</a>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="col-lg-3 col-md-4 col-sm-6 mix relax">
    <div class="card mb-4">
        <img class="card-img-top" src="<?= BASE_URL ?>/public/img/thugian.png" alt="Trò chơi thư giãn">
        <div class="card-body">
            <h5 class="card-title">Trò chơi trẻ em</h5>

            <div class="content pb-2 border-bottom">
                <div class="d-flex align-items-center">
                    <img src="<?= BASE_URL ?>/public/img/ic1.png" alt="">
                    <span class="pl-2" style="font-size:13px;">3 - 12 tuổi</span>
                </div>
                <div class="d-flex align-items-center">
                    <img src="<?= BASE_URL ?>/public/img/ic3.png" alt="">
                    <span class="pl-2" style="font-size:13px;">Vòng quay – tàu điện</span>
                </div>
                <div class="d-flex align-items-center">
                    <img src="<?= BASE_URL ?>/public/img/ic4.png" alt="">
                    <span class="pl-2" style="font-size:13px;">Không gian thoáng</span>
                </div>
            </div>
            <div class="d-flex align-items-center">
                    <img src="<?= BASE_URL ?>/public/img/ic2.png" alt="">
                    <span class="pl-2" style="font-size:13px;">Combo 200.000 VND</span>
                </div>

            <div class="row pt-4">
                <div class="col-lg-7">
                    <span style="font-size:13px;">Nhẹ nhàng – chill</span>
                </div>
                <div class="col-lg-5">
                    <a class="booknow" href="/Doan/trochoi">Xem thêm</a>
                </div>
            </div>
        </div>
    </div>
</div>

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

</body>
</html>
