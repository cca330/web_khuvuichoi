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

    // FIX: bỏ price/image (khong con trong bang games).
    // Tra ve id vua tao de controller dung insert anh vao game_images.
    public function create($data) {
        $sql = "INSERT INTO games(name, description, recommended_age, allowed_ticket, status)
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['description'],
            $data['recommended_age'],
            $data['allowed_ticket'],
            $data['status']
        ]);
        return $this->pdo->lastInsertId();
    }

    // FIX: bo price/image khoi UPDATE (khong con trong bang games).
    public function update($id, $data) {
        $sql = "UPDATE games
                SET name=?, description=?, recommended_age=?, allowed_ticket=?, status=?
                WHERE id=?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['name'],
            $data['description'],
            $data['recommended_age'],
            $data['allowed_ticket'],
            $data['status'],
            $id
        ]);
    }

    // Xóa game (game_images se tu bi xoa theo nho ON DELETE CASCADE,
    // nhung FILE ANH VAT LY thi khong tu xoa - controller phai goi
    // getImages($id) LAY DANH SACH FILE TRUOC KHI GOI ham nay, roi
    // unlink() sau khi xoa xong record).
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

    // ---------------- game_images (gallery nhieu anh / carousel) ----------------

    // Lay danh sach ten file anh cua 1 game, theo dung thu tu hien thi
    public function getImages($gameId) {
        $stmt = $this->pdo->prepare(
            "SELECT image FROM game_images WHERE game_id = ? ORDER BY sort_order ASC"
        );
        $stmt->execute([$gameId]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    // Them nhieu anh moi cho 1 game (khong xoa anh cu)
    public function addImages($gameId, array $filenames) {
        if (empty($filenames)) return;
        $sql = "INSERT INTO game_images (game_id, image, sort_order) VALUES (?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        $order = 1;
        foreach ($filenames as $file) {
            $stmt->execute([$gameId, $file, $order]);
            $order++;
        }
    }

    // Thay toan bo gallery cu bang danh sach anh moi.
    // Tra ve danh sach ten file CU de controller unlink() file vat ly.
    public function replaceImages($gameId, array $newFilenames) {
        $oldFiles = $this->getImages($gameId);

        $stmt = $this->pdo->prepare("DELETE FROM game_images WHERE game_id = ?");
        $stmt->execute([$gameId]);

        $this->addImages($gameId, $newFilenames);

        return $oldFiles;
    }

    // FIX: viet lai hoan toan - tickets khong con item_type/item_id/
    // order_id, va game khong con duoc ban rieng nen "total_tickets"/
    // "revenue" theo game khong con y nghia. Doi sang thong ke danh
    // gia (feedbacks) - thong tin duy nhat con lien ket voi game.
    public function getStats($gameId){
        $sql = "
            SELECT 
                COUNT(f.id) AS total_feedbacks,
                ROUND(AVG(f.rating), 1) AS avg_rating
            FROM feedbacks f
            WHERE f.game_id = ?
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$gameId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Danh sach danh gia chi tiet cua 1 game (dung cho trang Chi tiet)
    public function getFeedbacks($gameId) {
        $sql = "
            SELECT f.id, f.content, f.rating, f.created_at, u.username
            FROM feedbacks f
            JOIN users u ON f.user_id = u.id
            WHERE f.game_id = ?
            ORDER BY f.created_at DESC
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$gameId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}