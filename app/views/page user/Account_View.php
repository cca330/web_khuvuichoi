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
            background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
            min-height: 100vh;
        }
        .account .page-title {
            font-size: 2rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 40px;
            text-align: center;
            position: relative;
        }
        .account .page-title::after {
            content: '';
            display: block;
            width: 60px;
            height: 4px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 15px auto 0;
            border-radius: 2px;
        }
        .account .card {
            border: none;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .account .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.2);
        }
        .account .profile-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            color: #ffffff;
            padding: 50px 30px;
            border-radius: 24px 24px 0 0;
            position: relative;
            overflow: hidden;
        }
        .account .profile-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
            animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .account .profile-header .avatar-wrapper {
            position: relative;
            display: inline-block;
        }
        .account .profile-header i {
            font-size: 5rem;
            margin-bottom: 15px;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }
        .account .profile-title {
            font-size: 1.85rem;
            font-weight: 700;
            margin-bottom: 5px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .account .profile-subtitle {
            font-size: 0.95rem;
            opacity: 0.9;
            font-weight: 400;
        }
        .account .profile-list {
            padding: 35px;
        }

        @media (max-width: 767px) {
            .account {
                padding: 40px 0;
            }

            .account .page-title {
                font-size: 1.6rem;
                margin-bottom: 24px;
            }

            .account .profile-header {
                padding: 32px 20px;
            }

            .account .profile-title {
                font-size: 1.35rem;
            }

            .account .profile-subtitle {
                font-size: 0.9rem;
            }

            .account .profile-list {
                padding: 20px;
            }

            .account .info-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }

            .account .info-icon {
                width: 44px;
                height: 44px;
                margin-right: 0;
            }

            .account .info-value {
                font-size: 1rem;
                word-break: break-word;
            }

            .account .btn-group {
                padding: 20px;
                gap: 10px;
            }

            .account .btn-group .btn {
                width: 100%;
            }

            .account .user-guest {
                padding: 36px 18px;
            }
        }
        .account .info-item {
            display: flex;
            align-items: flex-start;
            padding: 20px 0;
            border-bottom: 1px solid #edf2f7;
            transition: background 0.2s ease;
        }
        .account .info-item:last-child {
            border-bottom: none;
        }
        .account .info-item:hover {
            background: linear-gradient(90deg, rgba(102,126,234,0.05) 0%, transparent 100%);
            margin: 0 -20px;
            padding-left: 20px;
            padding-right: 20px;
            border-radius: 12px;
        }
        .account .info-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
            flex-shrink: 0;
            box-shadow: 0 4px 15px rgba(102,126,234,0.3);
        }
        .account .info-icon i {
            font-size: 1.3rem;
            color: white;
        }
        .account .info-content {
            flex: 1;
        }
        .account .info-label {
            font-size: 0.85rem;
            color: #718096;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .account .info-value {
            font-size: 1.1rem;
            color: #2d3748;
            font-weight: 600;
        }
        .account .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            padding: 14px 35px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            box-shadow: 0 8px 25px rgba(102,126,234,0.35);
            transition: all 0.3s ease;
        }
        .account .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(102,126,234,0.45);
            background: linear-gradient(135deg, #5a71d1 0%, #6a4190 100%);
        }
        .account .btn-danger {
            background: linear-gradient(135deg, #fc5c7d 0%, #e91e63 100%);
            border: none;
            padding: 14px 35px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            box-shadow: 0 8px 25px rgba(236,92,125,0.35);
            transition: all 0.3s ease;
            min-width: 170px;
        }
        .account .btn-danger:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(236,92,125,0.45);
            background: linear-gradient(135deg, #e8456a 0%, #d81557 100%);
        }
        .account .btn-group {
            gap: 15px;
            padding: 25px 35px 35px;
            background: #f7fafc;
            border-top: 1px solid #edf2f7;
        }
        .account .welcome-badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 0.9rem;
            margin-bottom: 10px;
            backdrop-filter: blur(10px);
        }
        .account .user-guest {
            padding: 60px 30px;
            text-align: center;
        }
        .account .user-guest i {
            font-size: 4rem;
            color: #cbd5e0;
            margin-bottom: 20px;
        }
        .account .user-guest p {
            color: #718096;
            font-size: 1.1rem;
            margin-bottom: 25px;
        }

        /* Animation */
        .account .info-item {
            animation: fadeInUp 0.5s ease forwards;
            opacity: 0;
        }
        .account .info-item:nth-child(1) { animation-delay: 0.1s; }
        .account .info-item:nth-child(2) { animation-delay: 0.2s; }
        .account .info-item:nth-child(3) { animation-delay: 0.3s; }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>

    <?php include 'app/views/Layouts/header.php'; ?>

    <section class="account spad">
        <div class="container">
            <h2 class="page-title">Tài Khoản Cá Nhân</h2>

            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card shadow">
                        <div class="profile-header text-center">
                            <div class="avatar-wrapper">
                                <i class="fa fa-user-circle"></i>
                            </div>
                            <div class="welcome-badge">
                                <i class="fa fa-wave-hand mr-2"></i>Thành viên
                            </div>
                            <h4 class="profile-title">
                                <?= isset($data['user']) ? 'Xin chào, ' . htmlspecialchars($data['user']['username']) . '!' : 'Tài khoản của bạn' ?>
                            </h4>
                            <p class="profile-subtitle">
                                <?= isset($data['user']) ? 'Cảm ơn bạn đã sử dụng dịch vụ của HG Playground' : 'Vui lòng đăng nhập để tiếp tục' ?>
                            </p>
                        </div>

                        <?php if (isset($data['user'])): ?>
                        <div class="profile-list">
                            <div class="info-item">
                                <div class="info-icon">
                                    <i class="fa fa-user"></i>
                                </div>
                                <div class="info-content">
                                    <div class="info-label">Tên đăng nhập</div>
                                    <div class="info-value"><?= htmlspecialchars($data['user']['username']) ?></div>
                                </div>
                            </div>

                            <div class="info-item">
                                <div class="info-icon">
                                    <i class="fa fa-envelope"></i>
                                </div>
                                <div class="info-content">
                                    <div class="info-label">Email</div>
                                    <div class="info-value"><?= !empty($data['user']['email']) ? htmlspecialchars($data['user']['email']) : '<span class="text-muted">Chưa cập nhật</span>' ?></div>
                                </div>
                            </div>

                            <div class="info-item">
                                <div class="info-icon">
                                    <i class="fa fa-calendar-alt"></i>
                                </div>
                                <div class="info-content">
                                    <div class="info-label">Ngày đăng ký</div>
                                    <div class="info-value"><?= date('d/m/Y H:i', strtotime($data['user']['created_at'])) ?></div>
                                </div>
                            </div>
                        </div>

                        <div class="btn-group d-flex justify-content-center flex-wrap">
                            <a href="<?= BASE_URL ?>/Order/history" class="btn btn-primary">
                                <i class="fa fa-shopping-bag mr-2"></i>Lịch sử mua hàng
                            </a>
                            <a href="<?= BASE_URL ?>/login/logout" class="btn btn-danger">
                                <i class="fa fa-sign-out-alt mr-2"></i>Đăng Xuất
                            </a>
                        </div>
                        <?php else: ?>
                        <div class="user-guest">
                            <i class="fa fa-user-clock"></i>
                            <p>Vui lòng đăng nhập để xem lịch sử mua hàng và quản lý tài khoản.</p>
                            <a href="<?= BASE_URL ?>/login" class="btn btn-primary">
                                <i class="fa fa-sign-in-alt mr-2"></i>Đăng nhập ngay
                            </a>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php include 'app/views/Layouts/footer.php'; ?>
</body>
</html>
