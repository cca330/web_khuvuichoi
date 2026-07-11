<?php
require_once __DIR__ . "/../../core/Database.php";

class GateTicket {

    private static function db() {
        return Database::getConnection();
    }

    // =========================
    // LẤY TẤT CẢ VÉ CỔNG
    // =========================
    public static function getAll() {
        $conn = self::db();
        $sql = "SELECT * FROM gate_tickets WHERE status = 'ACTIVE'";
        return $conn->query($sql)->fetchAll();
    }

    // =========================
    // LẤY FULL THÔNG TIN 1 VÉ
    // =========================
    public static function find($id) {
        $conn = self::db();

        $stmt = $conn->prepare("
            SELECT *
            FROM gate_tickets
            WHERE id = ?
            LIMIT 1
        ");

        $stmt->execute([$id]);

        return $stmt->fetch();
    }

    // =========================
    // LẤY GIÁ VÉ
    // =========================
    public static function getPrice($id) {
        $conn = self::db();

        $stmt = $conn->prepare("
            SELECT price
            FROM gate_tickets
            WHERE id = ?
        ");

        $stmt->execute([$id]);

        $price = $stmt->fetchColumn();
        return $price !== false ? $price : 0;
    }

    // =========================
    // ✅ BỔ SUNG: LẤY TÊN VÉ
    // (PHỤC VỤ HIỂN THỊ)
    // =========================
    public static function getName($id) {
        $conn = self::db();

        $stmt = $conn->prepare("
            SELECT name
            FROM gate_tickets
            WHERE id = ?
        ");

        $stmt->execute([$id]);

        $name = $stmt->fetchColumn();
        return $name !== false ? $name : '';
    }
}
