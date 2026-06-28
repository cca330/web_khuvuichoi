<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tài Khoản Cá Nhân - HG Playground</title>
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

    <?php include 'app/views/Layouts/header.php'; ?>

    <section class="account spad">
        <div class="container">
            <h2 class="text-center mb-5">Tài Khoản Cá Nhân</h2>

            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card shadow p-5">
                        <div class="text-center mb-4">
                            <i class="fa fa-user-circle fa-5x text-primary"></i>
                            <h4 class="mt-3">
                                <?= isset($data['user']) ? 'Xin chào, ' . htmlspecialchars($data['user']['username']) . '!' : 'Tài khoản của bạn' ?>
                            </h4>
                        </div>

                        <div class="row mb-4">
                            <div class="col-md-6">
                                <p><strong>Tên đăng nhập:</strong> 
                                    <?= isset($data['user']) ? htmlspecialchars($data['user']['username']) : 'Chưa có thông tin' ?>
                                </p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Email:</strong> 
                                    <?= isset($data['user']) && !empty($data['user']['email']) ? htmlspecialchars($data['user']['email']) : 'Chưa cập nhật' ?>
                                </p>
                            </div>
                        </div>

                        <div class="row mb-4">
                            <div class="col-md-6">
                                <p><strong>Quyền hạn:</strong> 
                                    <?= isset($data['user']) ? ($data['user']['role'] === 'ADMIN' ? 'Quản trị viên' : 'Người dùng') : 'Chưa có thông tin' ?>
                                </p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Ngày đăng ký:</strong> 
                                    <?= isset($data['user']) ? date('d/m/Y H:i', strtotime($data['user']['created_at'])) : 'Chưa có thông tin' ?>
                                </p>
                            </div>
                        </div>

                        <div class="text-center mt-4">
                            <?php if (isset($data['user'])): ?>
                                <!-- Đã đăng nhập: Hiện nút Đăng xuất và Lịch sử mua hàng -->
                                <a href="<?= BASE_URL ?>/login/logout" class="btn btn-danger btn-lg px-5 me-3">Đăng Xuất</a>
                                <a href="<?= BASE_URL ?>/Order/history" class="btn btn-primary btn-lg px-5">Lịch sử mua hàng</a>
                            <?php else: ?>
                                <!-- Chưa đăng nhập: Ẩn hoặc disable nút -->
                                <p class="text-muted">Vui lòng đăng nhập để xem lịch sử mua hàng và quản lý tài khoản.</p>
                                <a href="<?= BASE_URL ?>/login" class="btn btn-primary btn-lg mt-3">Đăng nhập để tiếp tục</a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php include 'app/views/Layouts/footer.php'; ?>
</body>
</html>
