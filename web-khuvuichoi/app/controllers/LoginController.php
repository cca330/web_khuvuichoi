<?php
require_once __DIR__ . "/../models/LoginModel.php";

class loginController {
    public function index() {
    $this->showLoginPage();
}

    public function showLoginPage() {
        include __DIR__ . "/../views/pages/logins/login.php";
        
    }

    public function register() {
        include __DIR__ . "/../views/pages/logins/login_createaccount.php";
    }

    public function forgotPassword() {
        include __DIR__ . "/../views/pages/logins/login_forgetPass.php";
    }

    public function showNhapLaiPass() {
        include __DIR__ . "/../views/pages/logins/login_nhapmatkhaumoi.php";
    }

    public function logout() {
        session_start();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params['path'], $params['domain'],
                $params['secure'], $params['httponly']
            );
        }
        session_destroy();

        header("Location: " . BASE_URL . "/login");
        exit;
    }

    // =========================
    // LOGIN HANDLE
    // =========================
    public function handleLogin() {
    session_start();

    $username = $_POST["username"] ?? "";
    $password = $_POST["password"] ?? "";

    $model = new LoginModel();
    $result = $model->checkLogin($username, $password);

    if ($result === false) {
        echo "Sai username hoặc mật khẩu";
        return;
    }

    if ($result === "blocked") {
        echo "Tài khoản đã bị khóa";
        return;
    }

    $_SESSION["user_id"]  = $result["id"];
    $_SESSION["username"] = $result["username"];
    $_SESSION["role"]     = $result["role"];

    // TRẢ KẾT QUẢ CHO JS
    echo $result["role"]; // ADMIN hoặc USER
}


    // =========================
    // FORGOT PASSWORD
    // =========================
    public function handleForgotPassword() {
        session_start();

        $username = $_POST["username"] ?? "";
        $email    = $_POST["email"] ?? "";

        $model = new LoginModel();
        $user = $model->checkForgotPassword($username, $email);

        if (!$user) {
            echo "<script>alert('Sai thông tin');history.back();</script>";
            return;
        }

        $_SESSION["reset_username"] = $user["username"];
        header("Location: index.php?controller=login&action=showNhapLaiPass");
        exit;
    }

    // =========================
    // UPDATE PASSWORD
    // =========================
    public function updatePassword() {
        session_start();

        if (!isset($_SESSION["reset_username"])) {
            echo "Lỗi xác thực";
            return;
        }

        $newPass = $_POST["newPass"] ?? "";
        $rePass  = $_POST["rePass"] ?? "";

        if ($newPass !== $rePass) {
            echo "<script>alert('Mật khẩu không trùng');history.back();</script>";
            return;
        }

        $model = new LoginModel();
        $model->updatePassword($_SESSION["reset_username"], $newPass);

        unset($_SESSION["reset_username"]);

        echo "<script>
            alert('Đổi mật khẩu thành công');
            window.location.href='index.php?controller=login&action=showLoginPage';
        </script>";
    }

    // =========================
    // REGISTER
    // =========================
    public function handleRegister() {
        $username = $_POST["username"] ?? "";
        $password = $_POST["password"] ?? "";
        $repass   = $_POST["repass"] ?? "";
        $email    = $_POST["email"] ?? "";

        if ($password !== $repass) {
            echo "<script>alert('Mật khẩu không trùng');history.back();</script>";
            return;
        }

        $model = new LoginModel();
        $result = $model->createAccount($username, $password, $email);

        if ($result === "exists") {
            echo "<script>alert('Username hoặc Email đã tồn tại');history.back();</script>";
        } else if ($result === "success") {
            echo "<script>
                alert('Đăng ký thành công');
                window.location.href='index.php?controller=login&action=showLoginPage';
            </script>";
        } else {
            echo "<script>alert('Lỗi tạo tài khoản');</script>";
        }
    }
}
