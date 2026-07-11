<?php
require_once __DIR__ . "/../../core/Database.php";

class EventModel {
    protected $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    // Lấy tất cả sự kiện
    public function getAll() {
        $sql = "SELECT * FROM events ORDER BY start_datetime DESC";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Lấy sự kiện theo id
    public function findById($id) {
        $sql = "SELECT * FROM events WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Tạo sự kiện mới
    public function create($data) {
        $sql = "
            INSERT INTO events (title, thumbnail, description, location, start_datetime, end_datetime, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $data['title'],
            $data['thumbnail'],
            $data['description'],
            $data['location'],
            $data['start_datetime'],
            $data['end_datetime'],
            $data['status'] ?? 'COMING_SOON'
        ]);
        return $this->pdo->lastInsertId();
    }

    // Cập nhật sự kiện
    public function update($id, $data) {
        $sql = "
            UPDATE events
            SET title = ?, thumbnail = ?, description = ?, location = ?, start_datetime = ?, end_datetime = ?, status = ?
            WHERE id = ?
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $data['title'],
            $data['thumbnail'],
            $data['description'],
            $data['location'],
            $data['start_datetime'],
            $data['end_datetime'],
            $data['status'],
            $id
        ]);
        return $stmt->rowCount() > 0;
    }

    // Xóa sự kiện
    public function delete($id) {
        $sql = "DELETE FROM events WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }
}
