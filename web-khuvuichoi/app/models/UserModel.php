<?php
require_once __DIR__ . "/../../core/Database.php";

class UserModel {

    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    /** Lấy toàn bộ tài khoản */
    public function getAllUsers() {
        $sql = "SELECT 
                    id,
                    username,
                    email,
                    status,
                    created_at
                FROM users
                WHERE role ='USER'
                ORDER BY created_at DESC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /** Kiểm tra username */
    public function existsUsername($username) {
        $stmt = $this->pdo->prepare(
            "SELECT 1 FROM users WHERE username = ?"
        );
        $stmt->execute([$username]);

        return $stmt->fetch() ? true : false;
    }

    public function getById($user_id) {
        $sql = "SELECT id, username, email, role, status, created_at 
                FROM users 
                WHERE id = ?";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$user_id]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }


}
