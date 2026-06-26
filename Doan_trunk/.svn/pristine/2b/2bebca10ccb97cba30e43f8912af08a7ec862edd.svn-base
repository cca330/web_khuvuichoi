<?php
require_once __DIR__ . "/../../core/Database.php";

class RevenueModel {
    protected $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    // Tổng doanh thu toàn hệ thống
    public function totalRevenue() {
        $stmt = $this->pdo->query("SELECT IFNULL(SUM(total_price),0) AS total FROM orders WHERE status='PAID'");
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ===== KHÔNG LỌC =====
    public function revenueLast30Days() {
        $sql = "
            SELECT IFNULL(SUM(total_price),0) AS total
            FROM orders
            WHERE status='PAID'
            AND paid_at >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)
        ";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function chartLast30Days() {
        $sql = "
            SELECT DATE(created_at) AS day, SUM(total_price) AS revenue
            FROM orders
            WHERE status='PAID'
            AND paid_at >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)
            GROUP BY day
            ORDER BY day
        ";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ===== CÓ LỌC =====
    public function revenueByPeriod($from, $to) {
        $sql = "
            SELECT IFNULL(SUM(total_price),0) AS total
            FROM orders
            WHERE status='PAID'
            AND paid_at BETWEEN ? AND ?
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$from, $to]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function chartByPeriod($from, $to) {
        $sql = "
            SELECT DATE(created_at) AS day, SUM(total_price) AS revenue
            FROM orders
            WHERE status='PAID'
            AND paid_at BETWEEN ? AND ?
            GROUP BY day
            ORDER BY day
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$from, $to]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function ordersByPeriod($from, $to) {
        $sql = "
            SELECT o.id, o.total_price, o.created_at, o.paid_at,
                u.username
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.status = 'PAID'
            AND o.paid_at BETWEEN ? AND ?
            ORDER BY o.paid_at DESC
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$from, $to]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}
