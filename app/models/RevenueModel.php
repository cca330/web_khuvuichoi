<?php
require_once __DIR__ . "/../../core/Database.php";

class RevenueModel {
    protected $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    // Lấy danh sách năm có dữ liệu
    public function getAvailableYears() {
        $sql = "
            SELECT DISTINCT DATE_FORMAT(o.paid_at, '%Y') AS year
            FROM orders o
            WHERE o.status = 'PAID'
            ORDER BY year DESC
        ";
        return $this->pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    // Doanh thu tổng hợp theo tháng (có filter loại vé)
    public function getMonthlyRevenue($year, $type = 'total') {
        if ($type === 'total') {
            $sql = "
                SELECT
                    DATE_FORMAT(o.paid_at, '%Y-%m') AS month,
                    DATE_FORMAT(o.paid_at, '%m') AS month_num,
                    DATE_FORMAT(o.paid_at, '%m/%Y') AS month_display,
                    COALESCE(SUM(o.total_price), 0) AS total
                FROM orders o
                WHERE o.status = 'PAID' AND DATE_FORMAT(o.paid_at, '%Y') = ?
                GROUP BY DATE_FORMAT(o.paid_at, '%Y-%m'), DATE_FORMAT(o.paid_at, '%m'), DATE_FORMAT(o.paid_at, '%m/%Y')
                ORDER BY month_num ASC
            ";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$year]);
        } elseif ($type === 'gate') {
            $sql = "
                SELECT
                    DATE_FORMAT(o.paid_at, '%Y-%m') AS month,
                    DATE_FORMAT(o.paid_at, '%m') AS month_num,
                    DATE_FORMAT(o.paid_at, '%m/%Y') AS month_display,
                    COALESCE(SUM(gt.price), 0) AS total
                FROM tickets t
                JOIN orders o ON t.order_id = o.id
                JOIN gate_tickets gt ON t.item_type = 'GATE' AND t.item_id = gt.id
                WHERE o.status = 'PAID' AND DATE_FORMAT(o.paid_at, '%Y') = ?
                GROUP BY DATE_FORMAT(o.paid_at, '%Y-%m'), DATE_FORMAT(o.paid_at, '%m'), DATE_FORMAT(o.paid_at, '%m/%Y')
                ORDER BY month_num ASC
            ";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$year]);
        } else { // game
            $sql = "
                SELECT
                    DATE_FORMAT(o.paid_at, '%Y-%m') AS month,
                    DATE_FORMAT(o.paid_at, '%m') AS month_num,
                    DATE_FORMAT(o.paid_at, '%m/%Y') AS month_display,
                    COALESCE(SUM(g.price), 0) AS total
                FROM tickets t
                JOIN orders o ON t.order_id = o.id
                JOIN games g ON t.item_type = 'GAME' AND t.item_id = g.id
                WHERE o.status = 'PAID' AND DATE_FORMAT(o.paid_at, '%Y') = ?
                GROUP BY DATE_FORMAT(o.paid_at, '%Y-%m'), DATE_FORMAT(o.paid_at, '%m'), DATE_FORMAT(o.paid_at, '%m/%Y')
                ORDER BY month_num ASC
            ";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$year]);
        }
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Doanh thu chi tiết theo loại vé cổng
    public function getGateTicketDetails() {
        $sql = "
            SELECT
                gt.id,
                gt.name,
                gt.price,
                COUNT(t.id) AS total_tickets,
                COUNT(t.id) * gt.price AS revenue
            FROM gate_tickets gt
            LEFT JOIN tickets t ON t.item_type = 'GATE' AND t.item_id = gt.id
            LEFT JOIN orders o ON t.order_id = o.id AND o.status = 'PAID'
            GROUP BY gt.id, gt.name, gt.price
            ORDER BY gt.id ASC
        ";
        return $this->pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    // Doanh thu chi tiết theo game
    public function getGameTicketDetails() {
        $sql = "
            SELECT
                g.id,
                g.name,
                g.price,
                COUNT(t.id) AS total_tickets,
                COUNT(t.id) * g.price AS revenue
            FROM games g
            LEFT JOIN tickets t ON t.item_type = 'GAME' AND t.item_id = g.id
            LEFT JOIN orders o ON t.order_id = o.id AND o.status = 'PAID'
            GROUP BY g.id, g.name, g.price
            ORDER BY g.id ASC
        ";
        return $this->pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }
}
