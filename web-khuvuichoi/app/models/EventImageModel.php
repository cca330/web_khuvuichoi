<?php
require_once __DIR__ . "/../../core/Database.php";

class EventImageModel {
    protected $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    // Lấy tất cả ảnh sự kiện theo event_id
    public function getByEventId($eventId) {
        $sql = "SELECT * FROM event_images WHERE event_id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$eventId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Lấy ảnh theo id
    public function findById($id) {
        $sql = "SELECT * FROM event_images WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Tạo ảnh mới
    public function create($data) {
        $sql = "
            INSERT INTO event_images (event_id, image)
            VALUES (?, ?)
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $data['event_id'],
            $data['image']
        ]);
        return $this->pdo->lastInsertId();
    }

    // Cập nhật ảnh
    public function update($id, $data) {
        $sql = "
            UPDATE event_images
            SET image = ?
            WHERE id = ?
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $data['image'],
            $id
        ]);
        return $stmt->rowCount() > 0;
    }

    // Xóa ảnh
    public function delete($id) {
        $sql = "DELETE FROM event_images WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }
}
