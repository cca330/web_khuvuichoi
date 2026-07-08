<?php
require_once __DIR__ . "/../../core/Database.php";

class PromotionModel {
    protected $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    // Lấy tất cả khuyến mãi
    // FIX: JOIN thêm promotion_gate_tickets + gate_tickets để gộp sẵn
    // tên các loại vé mà mã được áp dụng (scope_names). NULL/rỗng
    // nghĩa là mã đó áp dụng cho TẤT CẢ loại vé.
    public function getAll() {
        $sql = "
            SELECT
                p.*,
                GROUP_CONCAT(gt.name SEPARATOR ', ') AS scope_names
            FROM promotions p
            LEFT JOIN promotion_gate_tickets pgt ON pgt.promotion_id = p.id
            LEFT JOIN gate_tickets gt ON gt.id = pgt.gate_ticket_id
            GROUP BY p.id
            ORDER BY p.id DESC
        ";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Tìm theo id
    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM promotions WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Tìm theo code hợp lệ (dùng lúc khách nhập mã ở trang thanh toán)
    public function findByCode($code) {
        $sql = "SELECT * FROM promotions 
                WHERE code = ? 
                AND status = 'ACTIVE'
                AND CURDATE() BETWEEN start_date AND end_date";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$code]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // FIX: bỏ 'type' (không còn cột này). Trả về id vừa tạo để
    // Controller gọi tiếp setScope() gán phạm vi áp dụng.
    public function create($data) {
        $sql = "INSERT INTO promotions(code, discount, start_date, end_date)
                VALUES (?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $data['code'],
            $data['discount'],
            $data['start_date'],
            $data['end_date']
        ]);
        return $this->pdo->lastInsertId();
    }

    // FIX: bỏ 'type' khỏi UPDATE.
    public function update($id, $data) {
        $sql = "UPDATE promotions 
                SET code=?, discount=?, start_date=?, end_date=?, status=?
                WHERE id=?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['code'],
            $data['discount'],
            $data['start_date'],
            $data['end_date'],
            $data['status'],
            $id
        ]);
    }

    // Vô hiệu hóa (giữ nguyên, không đổi)
    public function disable($id) {
        $stmt = $this->pdo->prepare("UPDATE promotions SET status ='EXPIRED' WHERE id = ?");
        return $stmt->execute([$id]);
    }

    // Tổng số lần sử dụng
    public function totalUsed($promotionId) {
        $sql = "SELECT COUNT(*) AS total
                FROM promotion_order
                WHERE promotion_id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$promotionId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Tổng tiền đã giảm
    public function totalDiscount($promotionId) {
        $sql = "SELECT IFNULL(SUM(discount_amount),0) AS total
                FROM promotion_order
                WHERE promotion_id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$promotionId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ---------------- Phạm vi áp dụng (promotion_gate_tickets) ----------------

    // Danh sách gate_ticket_id mà mã này ĐANG bị giới hạn áp dụng
    // (rỗng = áp dụng cho TẤT CẢ loại vé). Dùng để tick sẵn checkbox
    // khi mở form Sửa.
    public function getScope($promotionId) {
        $stmt = $this->pdo->prepare(
            "SELECT gate_ticket_id FROM promotion_gate_tickets WHERE promotion_id = ?"
        );
        $stmt->execute([$promotionId]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    // Tên các loại vé mà mã này áp dụng (dùng để hiển thị ở trang Chi tiết)
    public function getScopeNames($promotionId) {
        $sql = "SELECT gt.name
                FROM promotion_gate_tickets pgt
                JOIN gate_tickets gt ON gt.id = pgt.gate_ticket_id
                WHERE pgt.promotion_id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$promotionId]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    // Thay TOÀN BỘ phạm vi áp dụng bằng danh sách gate_ticket_id mới.
    // Truyền mảng rỗng = áp dụng cho TẤT CẢ loại vé.
    public function setScope($promotionId, array $gateTicketIds) {
        $del = $this->pdo->prepare("DELETE FROM promotion_gate_tickets WHERE promotion_id = ?");
        $del->execute([$promotionId]);

        if (empty($gateTicketIds)) return;

        $sql = "INSERT INTO promotion_gate_tickets (promotion_id, gate_ticket_id) VALUES (?, ?)";
        $stmt = $this->pdo->prepare($sql);
        foreach ($gateTicketIds as $gtId) {
            $stmt->execute([$promotionId, (int)$gtId]);
        }
    }

    // Danh sách loại vé để build checkbox trong form Thêm/Sửa.
    // NOTE: nếu bạn đã có sẵn 1 GateTicketModel riêng thì nên chuyển
    // hàm này qua đó cho đúng trách nhiệm, đây chỉ là cách nhanh gọn.
    public function getAllGateTickets() {
        $stmt = $this->pdo->query(
            "SELECT id, name, is_combo FROM gate_tickets WHERE status = 'ACTIVE' ORDER BY id ASC"
        );
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}