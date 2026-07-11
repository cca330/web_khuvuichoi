<?php
require_once __DIR__ . "/../../core/Database.php";

class EventScheduleModel {
    protected $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    // Lấy tất cả lịch trình theo event_id
    public function getByEventId($eventId) {
        $sql = "SELECT * FROM event_schedule WHERE event_id = ? ORDER BY sort_order ASC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$eventId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Lấy lịch trình theo id
    public function findById($id) {
        $sql = "SELECT * FROM event_schedule WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Tạo lịch trình mới
    public function create($data) {
        $sql = "
            INSERT INTO event_schedule (event_id, schedule_time, title, description, sort_order)
            VALUES (?, ?, ?, ?, ?)
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $data['event_id'],
            $data['schedule_time'],
            $data['title'],
            $data['description'],
            $data['sort_order'] ?? 1
        ]);
        return $this->pdo->lastInsertId();
    }

    // Cập nhật lịch trình
    public function update($id, $data) {
        $sql = "
            UPDATE event_schedule
            SET schedule_time = ?, title = ?, description = ?, sort_order = ?
            WHERE id = ?
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $data['schedule_time'],
            $data['title'],
            $data['description'],
            $data['sort_order'],
            $id
        ]);
        return $stmt->rowCount() > 0;
    }

    // Xóa lịch trình
    public function delete($id) {
        $sql = "DELETE FROM event_schedule WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }
}
