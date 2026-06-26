


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/login.css"> 
    <title>Document</title>

    
</head>
<body>
    <div class="panel">
    <form method="POST" action="<?= BASE_URL ?>/login/handleForgotPassword">
        <h1><b>Forgot Password</b></h1>


        <div class="txtbox">
            <input type="text" name="username" placeholder="User name" required>
            <i class='bx bx-user-circle'></i>
        </div>

        <div class="txtbox">
            <input type="email" name="email" placeholder="Email" required>
        </div>


        
        <button class="btnlogin" type="submit" >Xác minh</button>
        

        <div class="taotaikhoan">
            <p>Quay lại <a href="<?= BASE_URL ?>/login">Đăng nhập</a></p>
        </div>


        


    </form>
    </div>
    
    


</body>
</html>