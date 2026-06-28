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
        }
        .game-card:hover { 
            transform: translateY(-10px); 
            box-shadow: 0 20px 40px rgba(0,0,0,0.2); 
        }
        .game-card img { 
            transition: all 0.4s; 
            height: 250px; 
            object-fit: cover; 
        }
        .game-card:hover img { 
            transform: scale(1.1); 
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
                                <option value="Mạo Hiểm">Mạo Hiểm</option>
                                <option value="Ocean Park">Ocean Park</option>
                                <option value="Gia Đình">Gia Đình</option>
                                <option value="Thư Giãn">Thư Giãn</option>
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
                $image = !empty($game['image']) ? $game['image'] : BASE_URL . '/public/img/default-game.jpg';
                ?>
                <div class="col-lg-6 col-md-6 mb-5 game-card" 
                     data-category="<?= htmlspecialchars($game['category']) ?>" 
                     data-age="<?= (int)$game['recommended_age'] ?>" 
                     data-price="<?= (float)$game['price'] ?>">
                    <div class="card h-100 border-0">
                        <img src="<?= htmlspecialchars($image) ?>" class="card-img-top" alt="<?= htmlspecialchars($game['name']) ?>">
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
        // Cập nhật giá trị slider
        $('#ageFilter').on('input', function() {
            $('#ageValue').text($(this).val());
        });
        $('#priceFilter').on('input', function() {
            $('#priceValue').text(Number($(this).val()).toLocaleString() + 'đ');
        });

        // Filter client-side
        function applyFilter() {
            let category = $('#categoryFilter').val();
            let age = parseInt($('#ageFilter').val());
            let price = parseInt($('#priceFilter').val());

            $('.game-card').hide();
            $('.game-card').each(function() {
                let show = true;
                if (category !== 'all' && $(this).data('category') !== category) show = false;
                if ($(this).data('age') > age) show = false;
                if ($(this).data('price') > price) show = false;
                if (show) $(this).fadeIn();
            });
        }
    </script>
</body>
</html>
