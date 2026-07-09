<?php
require_once __DIR__ . "/../../core/Database.php";

class OrderItem {

    private static function db() {
        return Database::getConnection();
    }

    public static function getByOrder($orderId) {
        $conn = self::db();
        $stmt = $conn->prepare(
            "SELECT * FROM order_items WHERE order_id = ?"
        );
        $stmt->execute([$orderId]);
        return $stmt->fetchAll();
    }

    public static function findGate($orderId, $gateId) {
        $conn = self::db();
        $sql = "SELECT * FROM order_items
                WHERE order_id = ? AND gate_ticket_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$orderId, $gateId]);
        return $stmt->fetch();
    }

    public static function create($data) {
        $conn = self::db();
        $sql = "INSERT INTO order_items
            (order_id, gate_ticket_id, quantity, price)
            VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $data['order_id'],
            $data['gate_ticket_id'],
            $data['quantity'],
            $data['price']
        ]);
    }

    public static function updateQty($itemId, $qty) {
        $conn = self::db();
        if ($qty <= 0) {
            $stmt = $conn->prepare("DELETE FROM order_items WHERE id = ?");
            $stmt->execute([$itemId]);
        } else {
            $stmt = $conn->prepare(
                "UPDATE order_items SET quantity = ? WHERE id = ?"
            );
            $stmt->execute([$qty, $itemId]);
        }
    }
    public static function findById($id) {
        $conn = self::db();
        $stmt = $conn->prepare("SELECT * FROM order_items WHERE id = ?");
        $stmt->execute([(int)$id]);
        return $stmt->fetch();
    }



    public static function delete($id) {
        $conn = self::db();
        $stmt = $conn->prepare("DELETE FROM order_items WHERE id = ?");
        $stmt->execute([(int)$id]);
    }


    public static function getGroupedByOrder($orderId) {
        $db = self::db();

        $sql = "
            SELECT oi.*, gt.name as ticket_name, gt.type as ticket_type, gt.admits_adult, gt.admits_child, gt.is_combo
            FROM order_items oi
            JOIN gate_tickets gt ON oi.gate_ticket_id = gt.id
            WHERE order_id = ?
            ORDER BY oi.id ASC
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute([$orderId]);
        return $stmt->fetchAll();
    }



}
