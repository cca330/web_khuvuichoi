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
        SELECT
            p.*,
            GROUP_CONCAT(gt.name SEPARATOR ', ') AS scope_names
        FROM promotions p
        LEFT JOIN promotion_gate_tickets pgt ON pgt.promotion_id = p.id
        LEFT JOIN gate_tickets gt ON gt.id = pgt.gate_ticket_id
        WHERE p.status = 'ACTIVE'
          AND (p.start_date IS NULL OR p.start_date <= CURDATE())
          AND (p.end_date IS NULL OR p.end_date >= CURDATE())
        GROUP BY p.id
        ORDER BY p.id DESC
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
    // TÍNH TỔNG TIỀN CÁC ORDER_ITEMS NẰM TRONG PHẠM VI ÁP DỤNG
    // CỦA 1 PROMOTION (dựa vào promotion_gate_tickets).
    // Nếu promotion không có dòng nào trong promotion_gate_tickets
    // => áp dụng cho TẤT CẢ loại vé (ALL).
    // =========================
    private static function getBaseTotal($conn, $orderId, $promotionId) {
        $sql = "
            SELECT SUM(oi.quantity * oi.price) AS total
            FROM order_items oi
            WHERE oi.order_id = ?
              AND (
                    NOT EXISTS (
                        SELECT 1 FROM promotion_gate_tickets
                        WHERE promotion_id = ?
                    )
                    OR oi.gate_ticket_id IN (
                        SELECT gate_ticket_id FROM promotion_gate_tickets
                        WHERE promotion_id = ?
                    )
              )
        ";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$orderId, $promotionId, $promotionId]);
        $total = $stmt->fetchColumn();
        return $total !== false ? (float)$total : 0;
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

        // 3️⃣ Tính tổng tiền các order_items nằm trong phạm vi áp dụng của mã
        $baseTotal = self::getBaseTotal($conn, $orderId, $promo['id']);

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
            Order::updateTotal($orderId);
            return;
        }

        // Tính lại baseTotal theo phạm vi áp dụng (promotion_gate_tickets)
        $baseTotal = self::getBaseTotal($conn, $orderId, $promo['id']);

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