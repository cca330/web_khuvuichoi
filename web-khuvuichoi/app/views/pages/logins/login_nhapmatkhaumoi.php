<?php
session_start();

if (!isset($_SESSION["reset_username"])) {
    die("Không có dữ liệu để đặt mật khẩu mới!");
}

$username = $_SESSION["reset_username"];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/login.css?v=1.5"> 
    <title>Document</title>
</head>
<body>
    <div class="panel">
        <form method="POST" action="<?= BASE_URL ?>/login/updatePassword">
        <h1><b>Nhập mật khẩu mới </b></h1>

        <div class="txtbox">
            <input type="text" name="newPass" placeholder="Mật khẩu mới" required>
        </div>

        <div class="txtbox">
            <input type="password" name="rePass" placeholder="Nhập lại mật khẩu" required>
            <i class='bx bxs-lock-alt' ></i>
        </div>

        <button class="btnlogin" type="submit">Thay đổi</button>

        <div class="taotaikhoan">
            <p>Quay lại <a href="<?= BASE_URL ?>/login">Đăng nhập</a></p>
        </div>
        </form>
    </div>
</body>
</html>