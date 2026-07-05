<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trò Chơi - HG Playground</title>

    <!-- CSS từ Public (giữ nguyên như trang chủ) -->
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
        .hero__item {
            height: 70vh;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .game-card {
            transition: all 0.4s;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            margin: 15px 0 30px 0;
            padding: 15px;
            height: 100%;
        }
        .game-card .card {
            height: 100%;
            border: none;
        }
        .game-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        #games-list {
            margin-left: -15px;
            margin-right: -15px;
        }
        #games-list > [class*="col-"] {
            padding-left: 15px;
            padding-right: 15px;
            margin-bottom: 0;
        }
        .slide-wrapper {
            position: relative;
            overflow: hidden;
            height: 250px;
            margin-bottom: 1.5rem;
        }
        .card-body {
            padding: 24px;
        }
        .slider-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 250px;
            object-fit: cover;
            transition: transform 0.8s ease;
        }
        .slider-image.current {
            transform: translateX(0);
            z-index: 2;
        }
        .slider-image.next-slide {
            transform: translateX(100%);
            z-index: 1;
        }
        .slider-image.slide-to-left {
            transform: translateX(-100%);
        }
        .slider-image.slide-to-center {
            transform: translateX(0);
        }
        .badge-maohiem { background: linear-gradient(45deg, #ff416c, #ff4757); }
        .badge-ocean { background: linear-gradient(45deg, #00c6ff, #0072ff); }
        .badge-giadinh { background: linear-gradient(45deg, #11998e, #38ef7d); }
        .badge-thugian { background: linear-gradient(45deg, #667eea, #764ba2); }
        .filter-sidebar { background: #f8f9fa; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    </style>
</head>
<body>

    <?php include 'app/views/Layouts/header.php'; ?>


    <!-- Banner Trò Chơi -->
    <section class="hero">
        <div class="hero__item set-bg" data-setbg="<?= BASE_URL ?>/public/img/banner-trochoi.png">
            <div class="container">
                <div class="hero__text text-center text-white">
                    <span class="text-uppercase">Hàng trăm trò chơi đỉnh cao đang chờ bạn!</span>
                    <h2 class="display-4 font-weight-bold">Khám Phá Trò Chơi Tại HG Playground</h2>
                    <p class="lead">Mạo Hiểm • Ocean Park • Gia Đình • Thư Giãn</p>
                    <a href="#danhsach" class="btn btn-warning btn-lg mt-4 px-5 py-3 rounded-pill shadow">Bắt Đầu Khám Phá</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Danh sách trò chơi từ Database -->
    <section class="trochoi-list spad" id="danhsach">
        <div class="container">
            <h2 class="text-center mb-5 display-4">Danh Sách Trò Chơi</h2>

            <div class="row">
                <!-- Sidebar Filter -->
                <div class="col-lg-3">
                    <div class="filter-sidebar shadow">
                        <h4 class="mb-4">Lọc Trò Chơi</h4>
                        <div class="form-group">
                            <label>Loại trò chơi</label>
                            <select class="form-control" id="categoryFilter">
                                <option value="all">Tất cả</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Độ tuổi tối thiểu: <span id="ageValue">0</span>+</label>
                            <input type="range" class="form-control-range" min="0" max="18" value="0" id="ageFilter">
                        </div>
                        <div class="form-group">
                            <label>Giá vé tối đa: <span id="priceValue">300.000đ</span></label>
                            <input type="range" class="form-control-range" min="0" max="300000" step="10000" value="300000" id="priceFilter">
                        </div>
                        <button class="btn btn-primary btn-block mt-4" onclick="applyFilter()">Áp Dụng Lọc</button>
                    </div>
                </div>

                <!-- Danh sách Card từ Database -->
<div class="col-lg-9">
    <div class="row" id="games-list">
        <?php if (!empty($trochoiList)): ?>
            <?php foreach ($trochoiList as $game): ?>
                <?php
                $category_class = '';
                switch ($game['category']) {
                    case 'Mạo Hiểm':   $category_class = 'badge-maohiem'; break;
                    case 'Ocean Park': $category_class = 'badge-ocean'; break;
                    case 'Gia Đình':   $category_class = 'badge-giadinh'; break;
                    case 'Thư Giãn':   $category_class = 'badge-thugian'; break;
                    default:           $category_class = 'badge-primary';
                }
                
                $defaultImage = BASE_URL . '/public/img/default-game.jpg';
                $slideImages = [];
                $image = $defaultImage;
                
                // Xử lý ảnh từ database (có thể là nhiều ảnh ngăn cách bằng dấu phẩy)
                if (!empty($game['image'])) {
                    $imageList = array_filter(array_map('trim', explode(',', $game['image'])));
                    if (!empty($imageList)) {
                        // Chuyển đổi thành URL đầy đủ
                        foreach ($imageList as $img) {
                            $slideImages[] = BASE_URL . '/public/uploads/' . $img;
                        }
                        // Lấy ảnh đầu tiên làm ảnh chính
                        $image = $slideImages[0];
                    }
                }
                
                // Nếu không có ảnh từ database, dùng ảnh cố định (hardcoded)
                if (empty($slideImages)) {
                    if ($game['name'] === 'VR Game') {
                        $slideImages = [
                            BASE_URL . '/public/img/game/vr1.avif',
                            BASE_URL . '/public/img/game/vr2.jpg',
                            BASE_URL . '/public/img/game/vr3.jpg',
                            BASE_URL . '/public/img/game/vr4.jpg'
                        ];
                        $image = $slideImages[0];
                    } elseif ($game['name'] === 'Bumper Cars') {
                        $slideImages = [
                            BASE_URL . '/public/img/game/pumbercar1.jpg',
                            BASE_URL . '/public/img/game/pumbercar2.jpg',
                            BASE_URL . '/public/img/game/pumbercar3.jpg',
                            BASE_URL . '/public/img/game/pumbercar4.jpeg'
                        ];
                        $image = $slideImages[0];
                    } elseif ($game['name'] === 'Ferris Wheel') {
                        $slideImages = [
                            BASE_URL . '/public/img/game/ferriswheel1.jpeg',
                            BASE_URL . '/public/img/game/ferriswheel2.jpg',
                            BASE_URL . '/public/img/game/ferriswheel3.jpeg',
                            BASE_URL . '/public/img/game/ferriswheel4.jpg'
                        ];
                        $image = $slideImages[0];
                    } elseif ($game['name'] === 'Roller Coaster') {
                        $slideImages = [
                            BASE_URL . '/public/img/game/roller-coaster1.jpg',
                            BASE_URL . '/public/img/game/roller-coaster2.jpg',
                            BASE_URL . '/public/img/game/roller-coaster3.jpg',
                            BASE_URL . '/public/img/game/roller-coaster4.jpg'
                        ];
                        $image = $slideImages[0];
                    } elseif ($game['name'] === 'Haunted House') {
                        $slideImages = [
                            BASE_URL . '/public/img/game/nha-ma1.avif',
                            BASE_URL . '/public/img/game/nha-ma2.jpg',
                            BASE_URL . '/public/img/game/nha-ma3.jpg',
                            BASE_URL . '/public/img/game/nha-ma4.jpg'
                        ];
                        $image = $slideImages[0];
                    }
                }
                ?>
                <div class="col-lg-6 col-md-6 mb-5 game-card" 
                     data-category="<?= htmlspecialchars($game['category']) ?>" 
                     data-age="<?= (int)$game['recommended_age'] ?>" 
                     data-price="<?= (float)$game['price'] ?>">
                    <div class="card h-100 border-0">
                        <div class="slide-wrapper">
                            <img src="<?= htmlspecialchars($image) ?>" class="card-img-top slider-image current" alt="<?= htmlspecialchars($game['name']) ?>" data-slides='<?= htmlspecialchars(json_encode($slideImages), ENT_QUOTES, 'UTF-8') ?>'>
                        </div>
                        <div class="card-body text-center">
                            <span class="badge <?= $category_class ?> text-white px-3 py-2 rounded-pill mb-3">
                                <?= htmlspecialchars($game['category']) ?>
                            </span>
                            <h4><?= htmlspecialchars($game['name']) ?></h4>
                            <p><?= htmlspecialchars(substr($game['description'] ?? 'Chưa có mô tả', 0, 100)) ?>...</p>
                            <p><strong>Giá:</strong> <?= number_format($game['price'], 0, ',', '.') ?>đ | 
                               <strong>Tuổi:</strong> <?= $game['recommended_age'] ?>+</p>
                           
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="col-12 text-center py-5">
                <h4>Chưa có trò chơi nào trong hệ thống.</h4>
                <p>Kiểm tra debug controller: số lượng trò chơi là bao nhiêu?</p>
            </div>
        <?php endif; ?>
    </div>
</div>
            </div>
        </div>
    </section>

    <?php include 'app/views/Layouts/footer.php'; ?>

    <!-- JS -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://code.jquery.com/jquery-migrate-3.4.1.min.js"></script>
    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/js/jquery.nice-select.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/SlickNav/1.0.10/jquery.slicknav.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mixitup/3.3.1/mixitup.min.js"></script>
    <script src="<?= BASE_URL ?>/public/Js/main.js"></script>

    <script>
        // Đợi mọi thứ load xong mới chạy
        jQuery(function($) {
            // Cập nhật giá trị slider
            $('#ageFilter').on('input', function() {
                $('#ageValue').text($(this).val());
            });
            $('#priceFilter').on('input', function() {
                $('#priceValue').text(Number($(this).val()).toLocaleString() + 'đ');
            });

            // Tự động tạo dropdown options từ dữ liệu game thực tế
            setTimeout(function() {
                let categories = new Set();
                $('.game-card').each(function() {
                    let cat = $(this).attr('data-category');
                    if (cat) categories.add(cat);
                });

                console.log('Categories trong database:', Array.from(categories));

                // Xóa hết options cũ (trừ "Tất cả")
                $('#categoryFilter').find('option:not([value="all"])').remove();

                // Thêm options từ database
                categories.forEach(function(cat) {
                    $('#categoryFilter').append('<option value="' + cat + '">' + cat + '</option>');
                });

                console.log('Đã thêm options vào dropdown');
            }, 500); // Đợi 500ms sau khi page load

            // Filter client-side
            window.applyFilter = function() {
                let category = $('#categoryFilter').val();
                let age = parseInt($('#ageFilter').val());
                let price = parseInt($('#priceFilter').val());

                // Xóa thông báo cũ trước khi thêm mới
                $('.no-result').remove();

                let visibleCount = 0;
                $('.game-card').hide();
                $('.game-card').each(function() {
                    let show = true;
                    // Dùng attr thay vì data để tránh vấn đề với tiếng Việt
                    let cardCategory = $(this).attr('data-category');
                    let cardAge = parseInt($(this).attr('data-age'));
                    let cardPrice = parseFloat($(this).attr('data-price'));

                    if (category !== 'all' && cardCategory !== category) show = false;
                    if (cardAge > age) show = false;
                    if (cardPrice > price) show = false;
                    if (show) {
                        $(this).fadeIn();
                        visibleCount++;
                    }
                });

                // Hiển thị thông báo nếu không có kết quả
                if (visibleCount === 0) {
                    $('#games-list').append('<div class="col-12 text-center py-5 no-result"><h4>Không tìm thấy trò chơi nào phù hợp!</h4><p>Thử thay đổi bộ lọc để xem thêm kết quả.</p></div>');
                }
            }

            // Auto filter khi thay đổi dropdown
            $('#categoryFilter').on('change', function() {
                window.applyFilter();
            });
        });

        // Chuyển ảnh tự động cho VR và Bumper Cars
        $('.slider-image.current').each(function() {
            let $current = $(this);
            const slides = JSON.parse($current.attr('data-slides') || '[]');
            if (slides.length === 0) return;

            let currentIndex = 0;
            const $wrapper = $current.closest('.slide-wrapper');

            setInterval(() => {
                const nextIndex = (currentIndex + 1) % slides.length;
                const nextSrc = slides[nextIndex];
                const $next = $current.clone().removeClass('current').addClass('next-slide').attr('src', nextSrc);

                $wrapper.append($next);

                // Force layout before transition
                $next[0].offsetHeight;

                $current.addClass('slide-to-left');
                $next.addClass('slide-to-center');

                setTimeout(() => {
                    $current.remove();
                    $next.removeClass('next-slide slide-to-left slide-to-center').addClass('current');
                    $current = $next;
                    currentIndex = nextIndex;
                }, 900);
            }, 5000);
        });
    </script>
</body>
</html>
