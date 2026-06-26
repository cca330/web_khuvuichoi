<?php
require_once __DIR__ . "/../../core/Database.php";

class GameReportModel {
    protected $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    // Tổng số game
    public function totalGames() {
        $stmt = $this->pdo->query("SELECT COUNT(*) AS total FROM games");
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Game đang mở
    public function openGames() {
        $stmt = $this->pdo->query("SELECT COUNT(*) AS total FROM games WHERE status='OPEN'");
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Game đóng
    public function closedGames() {
        $stmt = $this->pdo->query("SELECT COUNT(*) AS total FROM games WHERE status='CLOSE'");
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Top game theo số vé bán
    public function ticketByGame($limit = 5) {
        $limit = (int)$limit; // đảm bảo là số nguyên

        $sql = "
            SELECT g.name, COUNT(t.id) AS total
            FROM games g
            LEFT JOIN tickets t 
                ON t.item_type = 'GAME' AND t.item_id = g.id
            LEFT JOIN orders o 
                ON t.order_id = o.id AND o.status = 'PAID'
            GROUP BY g.id
            ORDER BY total DESC
            LIMIT $limit
        ";

        $stmt = $this->pdo->query($sql); // dùng query thay vì prepare + execute
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
// Danh sách game theo trạng thái (ALL | OPEN | CLOSE)
public function listGames($status = null) {

    $sql = "
        SELECT g.id, g.name, g.status, g.price
        FROM games g
    ";

    if ($status) {
        $sql .= " WHERE g.status = ? ";
    }

    $sql .= " ORDER BY g.id ASC";

    $stmt = $this->pdo->prepare($sql);

    if ($status) {
        $stmt->execute([$status]);
    } else {
        $stmt->execute();
    }

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
public function findGame($id) {
    $sql = "SELECT * FROM games WHERE id = ?";
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}


}
