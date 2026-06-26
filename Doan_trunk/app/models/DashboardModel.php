<?php
require_once __DIR__ . "/../../core/Database.php";

class DashboardModel {
    protected $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    // 1. Tổng doanh thu hôm nay
    public function revenueToday() {
        $sql = "SELECT IFNULL(SUM(total_price),0) AS total
                FROM orders
                WHERE status='PAID'
                AND DATE(paid_at)=CURDATE()";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // 2. Số vé bán hôm nay
    public function ticketToday() {
        $sql = "SELECT COUNT(*) AS total
                FROM tickets t
                JOIN orders o ON t.order_id=o.id
                WHERE o.status='PAID'
                AND DATE(o.paid_at)=CURDATE()";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // 3. Người dùng mới hôm nay
    public function userToday() {
        $sql = "SELECT COUNT(*) AS total
                FROM users
                WHERE role='USER'
                AND DATE(created_at)=CURDATE()";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // 4. Đơn hàng mới nhất
    public function latestOrders($limit = 10) {
    $limit = (int)$limit; // đảm bảo là số
    $sql = "SELECT o.id, u.username, o.total_price, o.status, o.paid_at
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.status = 'PAID'
            ORDER BY o.id DESC
            LIMIT $limit";

    $stmt = $this->pdo->query($sql);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function ordersByPeriod($from, $to) {
        $sql = "SELECT o.id, u.username, o.total_price, o.paid_at
                FROM orders o
                JOIN users u ON o.user_id = u.id
                WHERE o.status='PAID'
                AND o.paid_at BETWEEN ? AND ?
                ORDER BY o.paid_at DESC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$from, $to]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
public function ticketsTodayList() {
    $sql = "SELECT t.id, t.item_type, o.id AS order_id, o.paid_at
            FROM tickets t
            JOIN orders o ON t.order_id = o.id
            WHERE o.status='PAID'
            AND DATE(o.paid_at)=CURDATE()
            ORDER BY o.paid_at DESC";

    $stmt = $this->pdo->query($sql);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
public function usersTodayList() {
    $sql = "SELECT id, username, email, created_at
            FROM users
            WHERE role='USER'
            AND DATE(created_at)=CURDATE()
            ORDER BY created_at DESC";

    $stmt = $this->pdo->query($sql);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
public function findWithItems($id) {
    // Thông tin đơn
    $sqlOrder = "SELECT o.*, u.username, u.email
                 FROM orders o
                 JOIN users u ON o.user_id = u.id
                 WHERE o.id = ?";

    $stmt = $this->pdo->prepare($sqlOrder);
    $stmt->execute([$id]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);

    // Vé trong đơn
    $sqlItems = "SELECT 
                    t.id,
                    t.item_type,
                    t.item_id,
                    CASE
                        WHEN t.item_type = 'GAME' THEN g.name
                        WHEN t.item_type = 'GATE' THEN gt.name
                    END AS item_name,
                    COUNT(*) OVER (
                        PARTITION BY t.item_type, t.item_id
                    ) AS quantity
                FROM tickets t
                LEFT JOIN games g 
                    ON t.item_type = 'GAME' AND t.item_id = g.id
                LEFT JOIN gate_tickets gt
                    ON t.item_type = 'GATE' AND t.item_id = gt.id
                WHERE t.order_id = ?;
                ";

    $stmt = $this->pdo->prepare($sqlItems);
    $stmt->execute([$id]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return [
        'order' => $order,
        'items' => $items
    ];
}


}
