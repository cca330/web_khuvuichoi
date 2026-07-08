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
    // FIX: model mới chỉ bán VÉ CỔNG (gate_tickets), không còn bán
    // game riêng -> 'total' và 'gate' về bản chất là MỘT, mình vẫn giữ
    // 2 nhánh để tương thích code cũ (nếu UI đang có dropdown chọn),
    // nhưng khuyên bạn bỏ hẳn lựa chọn 'game' ở giao diện vì luôn ra 0.
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
            // FIX: tickets.order_id không còn tồn tại -> join qua
            // order_items. FIX: dùng oi.price (giá tại thời điểm mua)
            // thay vì gt.price (giá hiện tại) để không bị sai lệch
            // khi giá vé thay đổi theo thời gian.
            $sql = "
                SELECT
                    DATE_FORMAT(o.paid_at, '%Y-%m') AS month,
                    DATE_FORMAT(o.paid_at, '%m') AS month_num,
                    DATE_FORMAT(o.paid_at, '%m/%Y') AS month_display,
                    COALESCE(SUM(oi.price), 0) AS total
                FROM tickets t
                JOIN order_items oi ON t.order_item_id = oi.id
                JOIN orders o ON oi.order_id = o.id
                WHERE o.status = 'PAID'
                  AND t.status != 'CANCELLED'
                  AND DATE_FORMAT(o.paid_at, '%Y') = ?
                GROUP BY DATE_FORMAT(o.paid_at, '%Y-%m'), DATE_FORMAT(o.paid_at, '%m'), DATE_FORMAT(o.paid_at, '%m/%Y')
                ORDER BY month_num ASC
            ";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$year]);
        } else { // game
            // FIX: game không còn được bán riêng trong mô hình mới
            // (chỉ mua vé cổng, vào chơi tự do) -> không có doanh thu
            // để tính theo game nữa. Trả về mảng rỗng thay vì query
            // vào cột/bảng không còn hợp lệ.
            // -> Đề xuất: bỏ hẳn lựa chọn "Doanh thu theo game" khỏi
            //    giao diện Revenue, vì luôn trả về rỗng/0.
            return [];
        }
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Doanh thu chi tiết theo loại vé cổng
    // FIX: bỏ t.item_type/t.item_id (không còn) -> dùng thẳng
    // t.gate_ticket_id. FIX: join order_id qua order_items. FIX: dùng
    // COALESCE(SUM(CASE...)) thay vì COUNT(t.id) đơn thuần, vì LEFT
    // JOIN orders với điều kiện lọc trong ON không tự loại được các
    // ticket của đơn chưa PAID ra khỏi COUNT (t.id vẫn khác NULL dù o
    // không khớp) - đây là lỗi tồn tại sẵn trong code gốc, mình sửa
    // luôn cho chắc. Cũng loại trừ vé đã bị CANCELLED khỏi doanh thu.
    public function getGateTicketDetails() {
        $sql = "
            SELECT
                gt.id,
                gt.name,
                gt.price,
                COUNT(CASE WHEN o.status = 'PAID' AND t.status != 'CANCELLED' THEN t.id END) AS total_tickets,
                COALESCE(SUM(CASE WHEN o.status = 'PAID' AND t.status != 'CANCELLED' THEN oi.price END), 0) AS revenue
            FROM gate_tickets gt
            LEFT JOIN tickets t ON t.gate_ticket_id = gt.id
            LEFT JOIN order_items oi ON t.order_item_id = oi.id
            LEFT JOIN orders o ON oi.order_id = o.id
            GROUP BY gt.id, gt.name, gt.price
            ORDER BY gt.id ASC
        ";
        return $this->pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    // Doanh thu chi tiết theo game
    // FIX: game không còn được bán riêng trong mô hình mới -> không
    // còn "doanh thu theo game" để thống kê (t.gate_ticket_id/t.item_*
    // không liên kết gì tới games nữa). Trả về mảng rỗng.
    // -> Nếu bạn vẫn muốn xem game nào được chơi nhiều/đánh giá cao,
    //    nên đổi hàm này sang thống kê từ bảng `feedbacks` (số lượt
    //    đánh giá, điểm trung bình) thay vì doanh thu - báo mình nếu
    //    cần, mình viết lại theo hướng đó.
    public function getGameTicketDetails() {
        return [];
    }
}