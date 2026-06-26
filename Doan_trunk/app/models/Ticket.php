<?php
require_once __DIR__ . "/../../core/Database.php";

class Ticket {

    private static function db() {
        return Database::getConnection();
    }

    public static function generateByOrder($orderId) {
        $conn = self::db();
        $stmt = $conn->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $stmt->execute([$orderId]);
        $items = $stmt->fetchAll();

        foreach ($items as $item) {
            for ($i = 0; $i < $item['quantity']; $i++) {
                $code = uniqid("TICKET-");
                $stmt = $conn->prepare(
                    "INSERT INTO tickets
                    (order_id, order_item_id, item_type, item_id, ticket_code)
                    VALUES (?, ?, ?, ?, ?)"
                );
                $stmt->execute([
                    $orderId,
                    $item['id'],
                    $item['item_type'],
                    $item['item_id'],
                    $code
                ]);
            }
        }
    }
}
