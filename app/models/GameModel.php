<?php
require_once __DIR__ . "/../../core/Database.php";

class GameModel {
    protected $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    // Lấy tất cả game
    public function getAll() {
        $stmt = $this->pdo->query("SELECT * FROM games ORDER BY id ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Lấy game theo status
    public function getByStatus($status) {
        $stmt = $this->pdo->prepare("SELECT * FROM games WHERE status = ? ORDER BY id ASC");
        $stmt->execute([$status]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Tìm 1 game
    public function find($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM games WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Thêm game
    public function create($data) {
        $sql = "INSERT INTO games(name, description, price, recommended_age, allowed_ticket, status, image)
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['name'],
            $data['description'],
            $data['price'],
            $data['recommended_age'],
            $data['allowed_ticket'],
            $data['status'],
            $data['image']
        ]);
    }

    // Cập nhật game
    public function update($id, $data) {
        $sql = "UPDATE games
                SET name=?, description=?, price=?, recommended_age=?, allowed_ticket=?, status=?, image=?
                WHERE id=?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['name'],
            $data['description'],
            $data['price'],
            $data['recommended_age'],
            $data['allowed_ticket'],
            $data['status'],
            $data['image'],
            $id
        ]);
    }

    // Xóa game
    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM games WHERE id=?");
        return $stmt->execute([$id]);
    }
    // Đóng game
    public function close($id){
        $stmt = $this->pdo->prepare("UPDATE games SET status='CLOSE' WHERE id=?");
        return $stmt->execute([$id]);
    }

    // Mở lại game
    public function open($id){
        $stmt = $this->pdo->prepare("UPDATE games SET status='OPEN' WHERE id=?");
        return $stmt->execute([$id]);
    }
    // Tìm kiếm game theo tên
    public function search($keyword) {
        $sql = "SELECT * 
                FROM games
                WHERE name LIKE ?
                ORDER BY id ASC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['%' . $keyword . '%']);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    public function getStats($gameId){
        $sql = "
            SELECT 
                COUNT(t.id) AS total_tickets,
                SUM(CASE WHEN t.status='USED' THEN 1 ELSE 0 END) AS used_tickets,
                IFNULL(SUM(o.total_price),0) AS revenue
            FROM tickets t
            JOIN orders o ON t.order_id=o.id AND o.status='PAID'
            WHERE t.item_type='GAME' AND t.item_id=?
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$gameId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

}
