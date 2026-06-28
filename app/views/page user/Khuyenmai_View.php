<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Khuyến Mãi - HG Playground</title>
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/style1.css?v=1.2">
</head>
<body>

<?php include 'app/views/Layouts/header.php'; ?>

<section class="spad">
    <div class="container">
        <div class="section-title text-center">
            <h2>Khuyến Mãi Đang Áp Dụng</h2>
            <p>Các mã giảm giá đang hoạt động cho khách hàng.</p>
        </div>

        <?php if (empty($promotions)): ?>
            <div class="cart-section text-center">
                <h4>Hiện chưa có khuyến mãi nào đang hoạt động.</h4>
                <p>Hãy quay lại sau để xem các ưu đãi mới.</p>
            </div>
        <?php else: ?>
            <div class="row">
                <?php foreach ($promotions as $promotion): ?>
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card h-100">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h5 class="card-title mb-0"><?= htmlspecialchars($promotion['code']) ?></h5>
                                    <span class="badge badge-paid"><?= htmlspecialchars($promotion['type']) ?></span>
                                </div>

                                <p class="mb-2"><strong>Giảm giá:</strong> <?= (int)$promotion['discount'] ?>%</p>
                                <p class="mb-2"><strong>Bắt đầu:</strong> <?= date('d/m/Y', strtotime($promotion['start_date'])) ?></p>
                                <p class="mb-2"><strong>Kết thúc:</strong> <?= date('d/m/Y', strtotime($promotion['end_date'])) ?></p>
                                <p class="mb-0"><strong>Trạng thái:</strong> <?= htmlspecialchars($promotion['status']) ?></p>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</section>

<?php include 'app/views/Layouts/footer.php'; ?>

</body>
</html>
