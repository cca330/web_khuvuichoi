<?php
require_once __DIR__ . "/../../core/Database.php";

class FeedbackModel {
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    public function getAllFeedbacks() {
        $sql = "
            SELECT 
                f.id,
                f.content,
                f.rating,
                f.created_at,
                u.username,
                u.email
            FROM feedbacks f
            LEFT JOIN users u ON f.user_id = u.id
            ORDER BY f.created_at DESC
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getStats() {
        $sql = "
            SELECT 
                COUNT(*) AS total,
                ROUND(AVG(rating), 1) AS avg_rating
            FROM feedbacks
        ";

        $stmt = $this->pdo->query($sql);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getLatestFeedbacks($limit = 6) {
        $sql = "SELECT content, rating, created_at 
                FROM feedbacks 
                ORDER BY created_at DESC 
                LIMIT :limit";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function save($data) {
        $sql = "INSERT INTO feedbacks (user_id, content, rating) VALUES (:user_id, :content, :rating)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':user_id' => $data['user_id'] ?? null,
            ':content' => $data['content'],
            ':rating'  => $data['rating']
        ]);
        return $stmt->rowCount() > 0;
    }

    public function getDisplayedFeedbacks($limit = 6) {
        $sql = "SELECT content, rating, created_at 
                FROM feedbacks 
                WHERE rating >= 4
                ORDER BY created_at DESC 
                LIMIT :limit";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}