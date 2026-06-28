<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liên Hệ & Đánh Giá - HG Playground</title>
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/bootstrap.min.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/style1.css?v=1.2">
    <style>
        .contact-form { background: #fff; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .star-rating { font-size: 2rem; color: #ddd; cursor: pointer; }
        .star-rating .filled { color: #ffc107; }
    </style>
</head>
<body>

    <?php include 'app/views/Layouts/header.php'; ?>

    <section class="spad">
        <div class="container">
            <div class="row">
                <!-- Thông tin liên hệ -->
                <div class="col-lg-6 mb-5">
                    <h2 class="mb-4">Thông Tin Liên Hệ</h2>
                    <p><i class="fa fa-map-marker fa-2x text-primary"></i> <strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
                    <p><i class="fa fa-phone fa-2x text-primary"></i> <strong>Hotline:</strong> 1900 1234</p>
                    <p><i class="fa fa-envelope fa-2x text-primary"></i> <strong>Email:</strong> info@hgplayground.vn</p>
                    <p><i class="fa fa-clock-o fa-2x text-primary"></i> <strong>Giờ mở cửa:</strong> 8:00 - 22:00 tất cả các ngày</p>

                    <h3 class="mt-5">Bản đồ</h3>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.669568431188!2d106.62966331480095!3d10.759922092332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b7c3bd91b%3A0x5a5b5b3b5b5b5b5b!2sVincom+Center!5e0!3m2!1svi!2s!4v1630000000000" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                </div>

                <!-- Form đánh giá & liên hệ -->
                <div class="col-lg-6">
                    <div class="contact-form">
                        <h2 class="mb-4">Gửi Đánh Giá & Phản Hồi</h2>

                        <?php if (isset($data['success'])): ?>
                            <div class="alert alert-success"><?= htmlspecialchars($data['success']) ?></div>
                        <?php endif; ?>

                        <?php if (isset($data['error'])): ?>
                            <div class="alert alert-danger"><?= htmlspecialchars($data['error']) ?></div>
                        <?php endif; ?>

                        <form action="<?= BASE_URL ?>/lienhe/store" method="POST">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label>Họ tên (tùy chọn)</label>
                                    <input type="text" name="name" class="form-control">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label>Email (tùy chọn)</label>
                                    <input type="email" name="email" class="form-control">
                                </div>
                            </div>

                            <div class="mb-3">
                                <label>Đánh giá của bạn *</label>
                                <div class="star-rating" id="starRating">
                                    <i class="fa fa-star" data-value="1"></i>
                                    <i class="fa fa-star" data-value="2"></i>
                                    <i class="fa fa-star" data-value="3"></i>
                                    <i class="fa fa-star" data-value="4"></i>
                                    <i class="fa fa-star" data-value="5"></i>
                                </div>
                                <input type="hidden" name="rating" id="ratingValue" value="5" required>
                            </div>

                            <div class="mb-3">
                                <label>Nội dung phản hồi *</label>
                                <textarea name="content" rows="6" class="form-control" required placeholder="Chia sẻ trải nghiệm của bạn tại HG Playground..."></textarea>
                            </div>

                            <div class="text-center">
                                <button type="submit" class="btn btn-danger btn-lg px-5 py-3 rounded-pill">GỬI PHẢN HỒI</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Hiển thị phản hồi đã duyệt (tùy chọn) -->
            <?php if (!empty($data['feedbacks'])): ?>
                <div class="row mt-5">
                    <div class="col-12">
                        <h3>Phản hồi từ khách hàng</h3>
                        <div class="row">
                            <?php foreach ($data['feedbacks'] as $fb): ?>
                                <div class="col-md-6 mb-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title"><?= $fb['rating'] ?> sao</h5>
                                            <p class="card-text"><?= htmlspecialchars($fb['content']) ?></p>
                                            <small class="text-muted"><?= date('d/m/Y H:i', strtotime($fb['created_at'])) ?></small>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </section>

    <?php include 'app/views/Layouts/footer.php'; ?>

    <script>
        // Star rating interactive
        const stars = document.querySelectorAll('#starRating .fa-star');
        const ratingValue = document.getElementById('ratingValue');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.getAttribute('data-value');
                ratingValue.value = value;
                stars.forEach(s => {
                    s.classList.toggle('filled', s.getAttribute('data-value') <= value);
                });
            });
        });
    </script>
</body>
</html>
