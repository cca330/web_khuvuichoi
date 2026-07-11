<?php
require_once __DIR__ . "/../../core/Database.php";

class LoginModel extends Database {

    public function __construct() {
        parent::__construct(); // khởi tạo $this->pdo
    }

    public function checkLogin($username, $password) {

        $stmt = $this->pdo->prepare("
            SELECT * FROM users 
            WHERE username = ?
            LIMIT 1
        ");

        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if (!$user) return false;

        if ($user['status'] === 'BLOCK') return "blocked";

        if (!password_verify($password, $user['password'])) {
            return false;
        }

        return $user;
    }

    public function checkForgotPassword($username, $email) {
        $stmt = $this->pdo->prepare("
            SELECT * FROM users 
            WHERE username = ? AND email = ?
            LIMIT 1
        ");
        $stmt->execute([$username, $email]);
        return $stmt->fetch();
    }

    public function updatePassword($username, $newPass) {
        $hashed = password_hash($newPass, PASSWORD_DEFAULT);

        $stmt = $this->pdo->prepare("
            UPDATE users 
            SET password = ?
            WHERE username = ?
        ");

        return $stmt->execute([$hashed, $username]);
    }

    public function createAccount($username, $password, $email) {

        $stmt = $this->pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$username]);
        if ($stmt->fetch()) return "exists";

        $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) return "exists";

        $hashed = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $this->pdo->prepare("
            INSERT INTO users (username, password, email, role, status)
            VALUES (?, ?, ?, 'USER', 'ACTIVE')
        ");

        return $stmt->execute([$username, $hashed, $email])
            ? "success"
            : "fail";
    }
}
