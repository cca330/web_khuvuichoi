<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/login.css?v=1.5"> 
</head>
<body>

<div class="panel">
    


    <h1><b>Login</b></h1>

    <div class="txtbox">
        <input type="text" id="username" placeholder="Username">
        <i class='bx bx-user-circle'></i>
    </div>

    <div class="txtbox">
        <input type="password" id="password" placeholder="Password">
        <i class='bx bxs-lock-alt'></i>
    </div>

    <div id="error" class="error"></div>

    <div class="quenmk">
        <a href="<?= BASE_URL ?>/login/forgotPassword">Quên mật khẩu</a>
    </div>

    <!-- QUAN TRỌNG -->
    <button class="btnlogin" id="btnLogin" type="button">Login</button>

    <div class="taotaikhoan">
        <p>Bạn chưa có tài khoản?
            <a href="<?= BASE_URL ?>/login/register">Tạo tài khoản</a>
        </p>
    </div>

    
</div>

<script src="<?= BASE_URL ?>/public/Js/login.js?v1.4"></script>
</body>
</html>
