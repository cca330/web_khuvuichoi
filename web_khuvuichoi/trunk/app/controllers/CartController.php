<?php
session_start();
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../models/OrderItem.php';
require_once __DIR__ . '/../models/GateTicket.php';
require_once __DIR__ . '/../models/Game.php';
require_once __DIR__ . '/../models/Promotion.php';
require_once __DIR__ . '/../models/Ticket.php';

class CartController {

    // =========================
    // HIỂN THỊ GIỎ HÀNG
    // =========================
    public function index() {

        if (!isset($_SESSION['user_id'])) {
            die('Bạn chưa đăng nhập');
        }

        $userId = (int)$_SESSION['user_id'];

        $order = Order::getPendingByUser($userId);
        if (!$order) {
            $orderId = Order::createPending($userId);
            $order   = Order::find($orderId);
        }

        $promotions    = Promotion::getActivePromotions();
        $discountTotal = Promotion::getDiscountByOrder($order['id']);
        $items         = OrderItem::getByOrder($order['id']);

        $groupedItems = [];

        foreach ($items as $item) {
            if ($item['item_type'] === 'GATE') {
                $gateInfo = GateTicket::find($item['item_id']);
                $item['name'] = $gateInfo['name'];

                $groupedItems[$item['id']] = [
                    'gate'            => $item,
                    'gate_type'       => $gateInfo['type'],
                    'games'           => [],
                    'available_games' => Game::getByGate($gateInfo['type'])
                ];
            }
        }

        foreach ($items as $item) {
            if (
                $item['item_type'] === 'GAME' &&
                isset($groupedItems[$item['parent_item_id']])
            ) {
                $gameInfo = Game::find($item['item_id']);
                $item['name'] = $gameInfo['name'];
                $groupedItems[$item['parent_item_id']]['games'][] = $item;
            }
        }

        $gates = GateTicket::getAll();

        require_once __DIR__ . '/../views/pages/cart/index.php';
    }

    // =========================
    // THÊM VÉ CỔNG
    // =========================
    public function addGate() {

        if (!isset($_SESSION['user_id'])) {
            die('Bạn chưa đăng nhập');
        }

        if (!isset($_POST['gate_id'])) {
            die('Thiếu gate_id');
        }

        $userId = $_SESSION['user_id'];
        $gateId = (int)$_POST['gate_id'];

        $order = Order::getPendingByUser($userId);
        if (!$order) {
            $orderId = Order::createPending($userId);
            $order   = Order::find($orderId);
        }

        $orderId = $order['id'];

        $item  = OrderItem::findGate($orderId, $gateId);
        $price = GateTicket::getPrice($gateId);

        if ($item) {
            OrderItem::updateQty($item['id'], $item['quantity'] + 1);
        } else {
            OrderItem::create([
                'order_id'        => $orderId,
                'item_type'       => 'GATE',
                'item_id'         => $gateId,
                'parent_item_id'  => null,
                'quantity'        => 1,
                'price'           => $price
            ]);
        }

        Order::updateTotal($orderId);

        header("Location: /Doan/cart");
        exit;
    }

    // =========================
    // ÁP MÃ GIẢM GIÁ (CHỈ LƯU DISCOUNT)
    // =========================
    public function applyPromo() {

        if (!isset($_SESSION['user_id'])) {
            die('Bạn chưa đăng nhập');
        }

        $code = $_POST['promo_code'] ?? '';

        $order = Order::getPendingByUser($_SESSION['user_id']);
        if (!$order) {
            die('Không có order');
        }

        $result = Promotion::apply($code, $order['id']);

        $_SESSION['promo_msg'] = $result['error'] ?? 'Áp mã thành công';

        header("Location: ?url=cart");
        exit;
    }

    // =========================
    // THANH TOÁN
    // =========================
    public function checkout() {

        if (!isset($_SESSION['user_id'])) {
            die('Bạn chưa đăng nhập');
        }

        $userId = (int)$_SESSION['user_id'];

        $order = Order::getPendingByUser($userId);
        if (!$order) {
            $_SESSION['error'] = 'Không có đơn hàng để thanh toán';
            header("Location: /Doan/cart");
            exit;
        }

        if ($order['status'] !== 'PENDING') {
            die('Order đã được thanh toán');
        }

        // ✅ TÍNH GIÁ SAU GIẢM
        $discount    = Promotion::getDiscountByOrder($order['id']);
        $finalTotal  = max(0, $order['total_price'] - $discount);

        if ($finalTotal <= 0) {
            $_SESSION['error'] = 'Giỏ hàng trống, không thể thanh toán';
            header("Location: /Doan/cart");
            exit;
        }

        // 🔥 LƯU GIÁ ĐÃ GIẢM VÀO ORDER
        Order::updateFinalTotal($order['id'], $finalTotal);

        // Đánh dấu đã thanh toán
        Order::markPaid($order['id']);

        // Sinh ticket
        Ticket::generateByOrder($order['id']);

        // Clear promotion
        //Promotion::clearByOrder($order['id']);

        // Tạo order mới
        Order::createPending($userId);

        $_SESSION['payment_success'] = true;

        header("Location: /Doan/cart");
        exit;
    }

    // =========================
    // THÊM GAME
    // =========================
    public function addGame() {

        $orderId    = (int)$_POST['order_id'];
        $gateItemId = (int)$_POST['gate_item_id'];
        $gameId     = (int)$_POST['game_id'];

        $gateItem = OrderItem::findById($gateItemId);

        if (
            !$gateItem ||
            $gateItem['order_id'] != $orderId ||
            $gateItem['item_type'] !== 'GATE'
        ) {
            die('Vé cổng không hợp lệ');
        }

        $item  = OrderItem::findGame($orderId, $gameId, $gateItemId);
        $price = Game::getPrice($gameId);

        if ($item) {
            OrderItem::updateQty($item['id'], $item['quantity'] + 1);
        } else {
            OrderItem::create([
                'order_id'       => $orderId,
                'item_type'      => 'GAME',
                'item_id'        => $gameId,
                'parent_item_id' => $gateItemId,
                'quantity'       => 1,
                'price'          => $price
            ]);
        }

        Order::updateTotal($orderId);
        header("Location: ?url=cart");
        exit;
    }

    // =========================
    // CẬP NHẬT SỐ LƯỢNG
    // =========================
    public function updateQty() {

        $itemId = (int)$_POST['item_id'];
        $action = $_POST['action'];

        $item = OrderItem::findById($itemId);
        if (!$item) {
            die('Item không tồn tại');
        }

        if ($action === 'plus') {
            OrderItem::updateQty($itemId, $item['quantity'] + 1);
        }

        if ($action === 'minus') {
            $newQty = $item['quantity'] - 1;

            if ($newQty <= 0) {

                if ($item['item_type'] === 'GATE') {
                    OrderItem::deleteByParent($itemId);
                }

                OrderItem::delete($itemId);

            } else {
                OrderItem::updateQty($itemId, $newQty);
            }
        }

        Order::updateTotal($item['order_id']);
        Promotion::clearByOrder($item['order_id']);

        header("Location: ?url=cart");
        exit;
    }

    // =========================
    // XÓA ITEM
    // =========================
    public function deleteItem() {

        $itemId = (int)$_POST['item_id'];

        $item = OrderItem::findById($itemId);
        if (!$item) {
            die('Item không tồn tại');
        }

        if ($item['item_type'] === 'GATE') {
            OrderItem::deleteByParent($itemId);
        }

        OrderItem::delete($itemId);
        Order::updateTotal($item['order_id']);
        Promotion::clearByOrder($item['order_id']);

        header("Location: ?url=cart");
        exit;
    }
}
