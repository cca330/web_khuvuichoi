<?php
require_once __DIR__ . "/../../core/Database.php";

class Game {

    private static function db() {
        return Database::getConnection();
    }

    /**
     * Lấy game phù hợp với loại vé cổng
     * $gateType: 'ADULT' | 'CHILD'
     */
    public static function getByGate($gateType) {
        $conn = self::db();

        $sql = "
            SELECT *
            FROM games
            WHERE status = 'OPEN'
              AND allowed_ticket IN ('ALL', ?)
        ";

        $stmt = $conn->prepare($sql);
        $stmt->execute([$gateType]);

        return $stmt->fetchAll();
    }

    // =========================
    // ✅ BỔ SUNG: LẤY TÊN GAME
    // (PHỤC VỤ HIỂN THỊ)
    // =========================
    public static function getName($id) {
        $conn = self::db();

        $stmt = $conn->prepare("
            SELECT name
            FROM games
            WHERE id = ?
        ");

        $stmt->execute([$id]);

        $name = $stmt->fetchColumn();
        return $name !== false ? $name : '';
    }

    // =========================
    // (OPTIONAL – AN TOÀN)
    // LẤY FULL GAME
    // =========================
    public static function find($id) {
        $conn = self::db();

        $stmt = $conn->prepare("
            SELECT *
            FROM games
            WHERE id = ?
            LIMIT 1
        ");

        $stmt->execute([$id]);

        return $stmt->fetch();
    }
}
