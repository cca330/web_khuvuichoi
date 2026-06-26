<?php
require_once __DIR__ . "/../../core/Database.php";
require_once __DIR__ . '/Order.php';

class Promotion {

    private static function db() {
        return Database::getConnection();
    }

    // =========================
    // LẤY DANH SÁCH MÃ ACTIVE
    // =========================
    public static function getActivePromotions() {
        $conn = self::db();
        $sql = "
            SELECT * FROM promotions
            WHERE status = 'ACTIVE'
            AND (start_date IS NULL OR start_date <= CURDATE())
            AND (end_date IS NULL OR end_date >= CURDATE())
        ";
        return $conn->query($sql)->fetchAll();
    }

    // =========================
    // LẤY PROMOTION ĐANG ÁP CHO ORDER
    // =========================
    private static function getCurrentPromotion($orderId) {
        $conn = self::db();
        $stmt = $conn->prepare("
            SELECT * FROM promotion_order
            WHERE order_id = ?
            LIMIT 1
        ");
        $stmt->execute([$orderId]);
        return $stmt->fetch();
    }

    // =========================
    // ÁP MÃ GIẢM GIÁ (GHI ĐÈ)
    // =========================
    public static function apply($code, $orderId) {

        if (!$code) {
            return ['error' => ''];
        }

        $conn = self::db();

        // 1️⃣ Lấy promotion hợp lệ
        $stmt = $conn->prepare("
            SELECT * FROM promotions
            WHERE code = ?
            AND status = 'ACTIVE'
            AND (start_date IS NULL OR start_date <= CURDATE())
            AND (end_date IS NULL OR end_date >= CURDATE())
        ");
        $stmt->execute([$code]);
        $promo = $stmt->fetch();

        if (!$promo) {
            return ['error' => 'Mã giảm giá không hợp lệ'];
        }

        // 2️⃣ Xóa promotion cũ (nếu có) – KHÔNG động vào total_price
        $stmt = $conn->prepare("
            DELETE FROM promotion_order WHERE order_id = ?
        ");
        $stmt->execute([$orderId]);

        // 3️⃣ Tính tổng tiền theo loại mã
        switch ($promo['type']) {
            case 'ALL':
                $sql = "
                    SELECT SUM(quantity * price)
                    FROM order_items
                    WHERE order_id = ?
                ";
                break;

            case 'GAME':
                $sql = "
                    SELECT SUM(quantity * price)
                    FROM order_items
                    WHERE order_id = ?
                    AND item_type = 'GAME'
                ";
                break;

            case 'TICKET':
                $sql = "
                    SELECT SUM(quantity * price)
                    FROM order_items
                    WHERE order_id = ?
                    AND item_type = 'GATE'
                ";
                break;

            default:
                return ['error' => 'Loại mã không hợp lệ'];
        }

        $stmt = $conn->prepare($sql);
        $stmt->execute([$orderId]);
        $baseTotal = $stmt->fetchColumn();
        $baseTotal = $baseTotal !== false ? $baseTotal : 0;

        if ($baseTotal <= 0) {
            return ['error' => 'Không có sản phẩm phù hợp để áp mã'];
        }

        // 4️⃣ Tính giảm giá
        $discount = $baseTotal * $promo['discount'] / 100;

        // 5️⃣ Lưu promotion_order
        $stmt = $conn->prepare("
            INSERT INTO promotion_order (promotion_id, order_id, discount_amount)
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$promo['id'], $orderId, $discount]);

        // 6️⃣ Cập nhật lại tổng tiền (qua Order)
        Order::updateTotal($orderId);

        return [
            'success'  => true,
            'discount' => $discount
        ];
    }

    // =========================
    // LẤY SỐ TIỀN ĐÃ GIẢM
    // =========================
    public static function getDiscountByOrder($orderId) {
        $conn = self::db();
        $stmt = $conn->prepare("
            SELECT discount_amount
            FROM promotion_order
            WHERE order_id = ?
            LIMIT 1
        ");
        $stmt->execute([$orderId]);
        $discount = $stmt->fetchColumn();
        return $discount !== false ? $discount : 0;
    }

    // =========================
    // TÍNH LẠI PROMOTION KHI ITEM THAY ĐỔI
    // =========================
    public static function recalculate($orderId) {
        $conn = self::db();

        $current = self::getCurrentPromotion($orderId);
        if (!$current) return;

        // Lấy promotion
        $stmt = $conn->prepare("
            SELECT * FROM promotions WHERE id = ?
        ");
        $stmt->execute([$current['promotion_id']]);
        $promo = $stmt->fetch();

        if (!$promo) {
            self::clearByOrder($orderId);
            return;
        }

        // Tính lại baseTotal theo loại mã
        switch ($promo['type']) {
            case 'ALL':
                $sql = "SELECT SUM(quantity * price) FROM order_items WHERE order_id = ?";
                break;
            case 'GAME':
                $sql = "SELECT SUM(quantity * price) FROM order_items WHERE order_id = ? AND item_type = 'GAME'";
                break;
            case 'TICKET':
                $sql = "SELECT SUM(quantity * price) FROM order_items WHERE order_id = ? AND item_type = 'GATE'";
                break;
            default:
                return;
        }

        $stmt = $conn->prepare($sql);
        $stmt->execute([$orderId]);
        $baseTotal = $stmt->fetchColumn();
        $baseTotal = $baseTotal !== false ? $baseTotal : 0;

        // ❗ Không còn item phù hợp → xóa mã
        if ($baseTotal <= 0) {
            self::clearByOrder($orderId);
            Order::updateTotal($orderId);
            return;
        }

        // Tính lại discount
        $discount = $baseTotal * $promo['discount'] / 100;

        $stmt = $conn->prepare("
            UPDATE promotion_order
            SET discount_amount = ?
            WHERE order_id = ?
        ");
        $stmt->execute([$discount, $orderId]);

        Order::updateTotal($orderId);
    }

    // =========================
    // XÓA PROMOTION KHỎI ORDER
    // =========================
    public static function clearByOrder($orderId) {
        $conn = self::db();
        $stmt = $conn->prepare("
            DELETE FROM promotion_order WHERE order_id = ?
        ");
        $stmt->execute([$orderId]);
    }
}
