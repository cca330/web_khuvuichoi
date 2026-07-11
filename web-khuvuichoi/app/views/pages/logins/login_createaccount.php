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
        <form method="POST" action="<?= BASE_URL ?>/login/handleRegister">
        <h1><b>Create Account</b></h1>


        <div class="txtbox">
            <input type="text" name="username" placeholder="User name" required>
            <i class='bx bx-user-circle'></i>
        </div>


        <div class="txtbox">
            <input type="password" name="password" placeholder="Password" required>
            <i class='bx bxs-lock-alt' ></i>
        </div>

        
        <div class="txtbox">
            <input type="password" name="repass" placeholder="Nhập lại password" required>
            <i class='bx bxs-lock-alt' ></i>

        </div>


        <div class="txtbox">
            <input type="email" name="email" placeholder="Email" required>
        </div>

        <div class="quenmk">
            <p>Lưu ý mỗi tài khoản chỉ được liên kết với 1 email!</p>
        </div>

        <button class="btnlogin" type="submit">Tạo tài khoản</button>

        <div class="taotaikhoan">
            <p>Bạn đã có tài khoản? <a href="<?= BASE_URL ?>/login">Đăng nhập</a></p>
        </div>
        </form>
    </div>
    
</body>
</html>