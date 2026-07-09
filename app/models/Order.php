<?php
require_once __DIR__ . "/../../core/Database.php";

class Order {

    private static function db() {
        return Database::getConnection();
    }

    public static function getPendingByUser($userId) {
        $conn = self::db();
        $sql = "SELECT * FROM orders 
                WHERE user_id = ? AND status = 'PENDING'
                LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetch();
    }

    public static function getPaidByUser($userId) {
        $conn = self::db();
        $stmt = $conn->prepare("
            SELECT *
            FROM orders
            WHERE user_id = ? AND status = 'PAID'
            ORDER BY paid_at DESC
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public static function createPending($userId) {
        $conn = self::db();
        $sql = "INSERT INTO orders(user_id, status, total_price)
                VALUES (?, 'PENDING', 0)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$userId]);
        return (int)$conn->lastInsertId();
    }

    // 👉 Tổng giá GỐC (chưa giảm)
    public static function updateTotal($orderId) {
        $conn = self::db();
        $sql = "SELECT SUM(quantity * price) 
                FROM order_items WHERE order_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$orderId]);
        $total = $stmt->fetchColumn();
        $total = $total !== false ? $total : 0;

        $stmt2 = $conn->prepare(
            "UPDATE orders SET total_price = ? WHERE id = ?"
        );
        $stmt2->execute([$total, $orderId]);
    }

    // 👉 SET TOTAL SAU GIẢM (chỉ dùng khi checkout)
    public static function updateFinalTotal($orderId, $finalTotal) {
        $conn = self::db();
        $stmt = $conn->prepare(
            "UPDATE orders SET total_price = ? WHERE id = ?"
        );
        $stmt->execute([$finalTotal, $orderId]);
    }

    public static function markPaid($orderId) {
        $conn = self::db();
        $stmt = $conn->prepare(
            "UPDATE orders 
             SET status = 'PAID', paid_at = NOW()
             WHERE id = ? AND status = 'PENDING'"
        );
        $stmt->execute([$orderId]);
    }

    public static function markFailed($orderId) {
        $conn = self::db();
        $stmt = $conn->prepare(
            "UPDATE orders 
             SET status = 'FAILED'
             WHERE id = ? AND status = 'PENDING'"
        );
        $stmt->execute([$orderId]);
    }

    public static function find($orderId) {
        $conn = self::db();
        $stmt = $conn->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$orderId]);
        return $stmt->fetch();
    }
}
