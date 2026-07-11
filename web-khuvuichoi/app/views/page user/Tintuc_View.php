<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sự Kiện Nổi Bật - HG Playground</title>
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/bootstrap.min.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/font-awesome.min.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/style1.css?v=1.2">
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

            <?php if (!empty($eventData)): ?>
                <?php foreach ($eventData as $data): ?>
                    <?php $event = $data['event']; ?>
                    <?php $images = $data['images']; ?>
                    <?php $schedules = $data['schedules']; ?>

                    <!-- Lấy ảnh đầu tiên làm ảnh chính -->
                    <?php $mainImage = !empty($images) ? $images[0]['image'] : BASE_URL . '/public/img/events/default.png'; ?>

                    <div class="row section-divider">
                        <!-- Ảnh sự kiện -->
                        <div class="col-lg-6">
                            <img src="<?= htmlspecialchars($mainImage) ?>" class="img-fluid rounded shadow" alt="<?= htmlspecialchars($event['title']) ?>">
                        </div>

                        <!-- Thông tin sự kiện -->
                        <div class="col-lg-6">
                            <h2 class="event-title"><?= htmlspecialchars($event['title']) ?></h2>

                            <p><strong>Thời gian:</strong>
                                <?= date('d/m/Y', strtotime($event['start_datetime'])) ?> - <?= date('d/m/Y', strtotime($event['end_datetime'])) ?>
                                | <?= date('H:i', strtotime($event['start_datetime'])) ?> - <?= date('H:i', strtotime($event['end_datetime'])) ?>
                            </p>
                            <p><strong>Địa điểm:</strong> <?= htmlspecialchars($event['location'] ?? 'Chưa cập nhật') ?></p>
                            <p class="lead"><?= htmlspecialchars($event['description'] ?? 'Chưa có mô tả') ?></p>

                            <!-- Lịch trình chi tiết -->
                            <?php if (!empty($schedules)): ?>
                                <h4>Lịch Trình Chi Tiết</h4>
                                <ol>
                                    <?php foreach ($schedules as $schedule): ?>
                                        <li><?= htmlspecialchars($schedule['schedule_time']) ?> - <?= htmlspecialchars($schedule['title']) ?></li>
                                    <?php endforeach; ?>
                                </ol>
                            <?php endif; ?>

                            <!-- Nút mua vé -->
                            <div class="text-center mt-5">
                                <?php if ($event['status'] == 'COMING_SOON'): ?>
                                    <a href="#" class="buy-btn text-white">Coming soon</a>
                                <?php elseif ($event['status'] == 'ONGOING'): ?>
                                    <a href="/datve" class="buy-btn text-white">Đặt vé ngay</a>
                                <?php elseif ($event['status'] == 'FINISHED'): ?>
                                    <button class="btn btn-secondary" disabled>Đã kết thúc</button>
                                <?php else: ?>
                                    <button class="btn btn-danger" disabled>Đã hủy</button>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>

                <?php endforeach; ?>
            <?php else: ?>
                <div class="text-center py-5">
                    <h3 class="text-muted">Hiện chưa có sự kiện nào</h3>
                    <p>Vui lòng quay lại sau!</p>
                </div>
            <?php endif; ?>

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