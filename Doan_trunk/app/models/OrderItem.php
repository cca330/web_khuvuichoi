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
                WHERE order_id = ? AND item_type = 'GATE' AND item_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$orderId, $gateId]);
        return $stmt->fetch();
    }

    public static function create($data) {
        $conn = self::db();
        $sql = "INSERT INTO order_items
            (order_id, item_type, item_id, parent_item_id, quantity, price)
            VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $data['order_id'],
            $data['item_type'],
            $data['item_id'],
            $data['parent_item_id'],
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

    public static function findGame($orderId, $gameId, $parentId) {
        $conn = self::db();
        $sql = "
            SELECT * FROM order_items
            WHERE order_id = ?
            AND item_type = 'GAME'
            AND item_id = ?
            AND parent_item_id = ?
        ";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$orderId, $gameId, $parentId]);
        return $stmt->fetch();
    }


    public static function delete($id) {
        $conn = self::db();
        $stmt = $conn->prepare("DELETE FROM order_items WHERE id = ?");
        $stmt->execute([(int)$id]);
    }

    public static function deleteByParent($parentId) {
        $conn = self::db();
        $stmt = $conn->prepare("DELETE FROM order_items WHERE parent_item_id = ?");
        $stmt->execute([(int)$parentId]);
    }

    public static function getGroupedByOrder($orderId) {
        $db = self::db();

        $sql = "
            SELECT * FROM order_items
            WHERE order_id = ?
            ORDER BY item_type DESC, id ASC
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute([$orderId]);
        $result = $stmt->fetchAll();

        $gates = [];
        $games = [];

        foreach ($result as $row) {
            if ($row['item_type'] === 'GATE') {
                $row['games'] = [];
                $gates[$row['id']] = $row;
            } else {
                $games[] = $row;
            }
        }

        foreach ($games as $game) {
            if (isset($gates[$game['parent_item_id']])) {
                $gates[$game['parent_item_id']]['games'][] = $game;
            }
        }

        return $gates;
    }

    public static function findGameByParent($orderId, $gameId, $parentId) {
        $db = self::db();

        $sql = "
            SELECT * FROM order_items
            WHERE order_id = ?
            AND item_type = 'GAME'
            AND item_id = ?
            AND parent_item_id = ?
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute([$orderId, $gameId, $parentId]);
        return $stmt->fetch();
    }


}
