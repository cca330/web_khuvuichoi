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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Montserrat:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Css Styles -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/smoothness/jquery-ui.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/slicknav.min.css"> 
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/header.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/style1.css?v=1.0">
</head>
<body>

   
    <!-- Header chính -->
    <header class="header">
        <div class="container">
            <div class="row d-flex justify-content-between">
                <div>
                    <div class="header__logo">
                        <a href="<?= BASE_URL ?>/trangchu"><img src="<?= BASE_URL ?>/public/img/lg3.png" width="100px" height="100px" alt="logo nhỏ"></a>
                    </div>
                </div>
                <div class="col-lg-9">
                    <nav class="header__menu">
                        <ul>
                            <li class="active"><a href="<?= BASE_URL ?>/trangchu">Trang Chủ</a></li>
                            <li><a href="<?= BASE_URL ?>/trochoi">Trò Chơi</a></li>
                            <li><a href="<?= BASE_URL ?>/tintuc">Tin Tức & Sự Kiện</a></li>
                            <li><a href="<?= BASE_URL ?>/cart">Giỏ Hàng</a></li>
                            <li><a href="<?= BASE_URL ?>/Khuyenmai">Khuyến Mãi</a></li>
                            <li><a href="<?= BASE_URL ?>/lienhe">Liên Hệ & Phản Hồi</a></li>
                        </ul>
                    </nav>
                </div>
               <!-- Phần Account trong header - LUÔN HIỆN nút Tài khoản -->
                <div class="dropdown ms-3">
                    <a class="btn btn-outline-primary dropdown-toggle d-flex align-items-center" 
                        href="<?= BASE_URL ?>/account" 
                        role="button">
                        <i class="fa fa-user me-2"></i>
                        Tài khoản
                    </a>
                </div>
            </div>
        </div>
    </header>
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