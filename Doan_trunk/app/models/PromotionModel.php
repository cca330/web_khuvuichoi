<?php
require_once __DIR__ . "/../../core/Database.php";

class PromotionModel {
    protected $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    // Lấy tất cả khuyến mãi
    public function getAll() {
        $stmt = $this->pdo->query("SELECT * FROM promotions ORDER BY id DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Tìm theo id
    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM promotions WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Tìm theo code hợp lệ
    public function findByCode($code) {
        $sql = "SELECT * FROM promotions 
                WHERE code = ? 
                AND status = 'ACTIVE'
                AND CURDATE() BETWEEN start_date AND end_date";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$code]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Thêm mới
    public function create($data) {
        $sql = "INSERT INTO promotions(code, discount, start_date, end_date, type)
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['code'],
            $data['discount'],
            $data['start_date'],
            $data['end_date'],
            $data['type']
        ]);
    }

    // Cập nhật
    public function update($id, $data) {
        $sql = "UPDATE promotions 
                SET code=?, discount=?, start_date=?, end_date=?, status=?, type=?
                WHERE id=?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['code'],
            $data['discount'],
            $data['start_date'],
            $data['end_date'],
            $data['status'],
            $data['type'],
            $id
        ]);
    }

    // Xóa
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

}
