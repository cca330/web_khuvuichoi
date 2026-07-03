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
    <style>
        .account {
            padding: 80px 0;
            background: #f4f8ff;
        }
        .account .card {
            border: none;
            border-radius: 28px;
            overflow: hidden;
            box-shadow: 0 24px 80px rgba(63,69,81,0.08);
        }
        .account .profile-header {
            background: linear-gradient(135deg, #4f8cff 0%, #55e3c0 100%);
            color: #ffffff;
            padding: 40px 30px;
            border-radius: 28px 28px 0 0;
        }
        .account .profile-header i {
            font-size: 4.5rem;
            margin-bottom: 20px;
        }
        .account .profile-title {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 0;
        }
        .account .profile-list p {
            margin-bottom: 1.25rem;
            color: #4a5568;
            font-size: 1rem;
        }
        .account .profile-list strong {
            color: #111827;
        }
        .account .btn-primary {
            background: linear-gradient(135deg, #4f8cff 0%, #55e3c0 100%);
            border: none;
            box-shadow: 0 12px 30px rgba(79,140,255,0.18);
        }
        .account .btn-danger {
            min-width: 170px;
        }
        .account .btn-group {
            gap: 15px;
        }
    </style>
</head>
<body>

    <?php include 'app/views/Layouts/header.php'; ?>

    <section class="account spad">
        <div class="container">
            <h2 class="text-center mb-5">Tài Khoản Cá Nhân</h2>

            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card shadow">
                        <div class="profile-header text-center">
                            <i class="fa fa-user-circle"></i>
                            <h4 class="profile-title">
                                <?= isset($data['user']) ? 'Xin chào, ' . htmlspecialchars($data['user']['username']) . '!' : 'Tài khoản của bạn' ?>
                            </h4>
                        </div>

                        <div class="card-body profile-list">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <p><strong>Tên đăng nhập:</strong><br>
                                        <?= isset($data['user']) ? htmlspecialchars($data['user']['username']) : 'Chưa có thông tin' ?>
                                    </p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Email:</strong><br>
                                        <?= isset($data['user']) && !empty($data['user']['email']) ? htmlspecialchars($data['user']['email']) : 'Chưa cập nhật' ?>
                                    </p>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-12">
                                    <p><strong>Ngày đăng ký:</strong><br>
                                        <?= isset($data['user']) ? date('d/m/Y H:i', strtotime($data['user']['created_at'])) : 'Chưa có thông tin' ?>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="text-center mt-4 btn-group d-flex justify-content-center flex-wrap">
                            <?php if (isset($data['user'])): ?>
                                <a href="<?= BASE_URL ?>/login/logout" class="btn btn-danger btn-lg px-5">Đăng Xuất</a>
                                <a href="<?= BASE_URL ?>/Order/history" class="btn btn-primary btn-lg px-5">Lịch sử mua hàng</a>
                            <?php else: ?>
                                <div class="w-100 text-center">
                                    <p class="text-muted mb-3">Vui lòng đăng nhập để xem lịch sử mua hàng và quản lý tài khoản.</p>
                                    <a href="<?= BASE_URL ?>/login" class="btn btn-primary btn-lg px-5">Đăng nhập để tiếp tục</a>
                                </div>
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
