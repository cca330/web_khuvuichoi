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

    // 2. Số vé (QR) bán hôm nay
    // FIX: tickets không còn cột order_id trực tiếp nữa -> phải join
    // qua order_items để lấy được order_id / trạng thái đơn hàng.
    public function ticketToday() {
        $sql = "SELECT COUNT(*) AS total
                FROM tickets t
                JOIN order_items oi ON t.order_item_id = oi.id
                JOIN orders o ON oi.order_id = o.id
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

    // FIX: t.item_type không còn tồn tại -> đổi sang lấy tên vé qua
    // gate_tickets (join bằng t.gate_ticket_id), và join order_id qua
    // order_items như trên.
    public function ticketsTodayList() {
        $sql = "SELECT t.id, t.ticket_code, gt.name AS gate_ticket_name,
                       o.id AS order_id, o.paid_at
                FROM tickets t
                JOIN order_items oi ON t.order_item_id = oi.id
                JOIN orders o ON oi.order_id = o.id
                JOIN gate_tickets gt ON t.gate_ticket_id = gt.id
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

    // FIX: viết lại hoàn toàn theo schema mới.
    // - Không còn WHERE t.order_id = ? (cột không tồn tại) -> đổi
    //   sang lấy trực tiếp từ order_items.order_id (đúng ngữ nghĩa
    //   hơn: mỗi order_item mới là "1 dòng sản phẩm trong đơn").
    // - Không còn nhánh GAME/GATE -> chỉ còn gate_tickets, nên bỏ hẳn
    //   CASE WHEN + LEFT JOIN games.
    // - quantity lấy trực tiếp từ order_items.quantity (số lượng đã
    //   mua) thay vì đếm ngược qua tickets bằng window function.
    // - ticket_count: đếm thực tế số QR đã được sinh ra cho dòng đó
    //   (sẽ NULL/0 nếu đơn đang PENDING và chưa có ticket nào).
    public function findWithItems($id) {
        // Thông tin đơn
        $sqlOrder = "SELECT o.*, u.username, u.email
                     FROM orders o
                     JOIN users u ON o.user_id = u.id
                     WHERE o.id = ?";

        $stmt = $this->pdo->prepare($sqlOrder);
        $stmt->execute([$id]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        // Các dòng vé trong đơn
        $sqlItems = "SELECT
                        oi.id AS order_item_id,
                        gt.id AS gate_ticket_id,
                        gt.name AS item_name,
                        gt.is_combo,
                        oi.quantity,
                        oi.price,
                        (SELECT COUNT(*)
                         FROM tickets t
                         WHERE t.order_item_id = oi.id) AS ticket_count
                     FROM order_items oi
                     JOIN gate_tickets gt ON oi.gate_ticket_id = gt.id
                     WHERE oi.order_id = ?";

        $stmt = $this->pdo->prepare($sqlItems);
        $stmt->execute([$id]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'order' => $order,
            'items' => $items
        ];
    }

}