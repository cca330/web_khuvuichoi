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
            // Hiện thông báo và chuyển đến trang đăng nhập
            echo '<script>
                    alert("Bạn cần đăng nhập để xem giỏ hàng!");
                    window.location.href = "' . BASE_URL . '/login";
                  </script>';
            exit;
        }

        $userId = (int)$_SESSION['user_id'];

        $order = Order::getPendingByUser($userId);
        if (!$order) {
            $orderId = Order::createPending($userId);
            $order   = Order::find($orderId);
        }

        $promotions    = Promotion::getActivePromotions();
        $discountTotal = Promotion::getDiscountByOrder($order['id']);
        $groupedItems  = OrderItem::getGroupedByOrder($order['id']);
        $gates         = GateTicket::getAll();

        require_once __DIR__ . '/../views/pages/cart/index.php';
    }

    // =========================
    // TRANG THANH TOÁN
    // =========================
    public function checkout() {

        if (!isset($_SESSION['user_id'])) {
            echo '<script>
                    alert("Bạn cần đăng nhập để thanh toán!");
                    window.location.href = "' . BASE_URL . '/login";
                  </script>';
            exit;
        }

        $userId = (int)$_SESSION['user_id'];

        $order = Order::getPendingByUser($userId);
        if (!$order || $order['total_price'] <= 0) {
            echo '<script>
                    alert("Giỏ hàng trống!");
                    window.location.href = "' . BASE_URL . '/cart";
                  </script>';
            exit;
        }

        $promotions    = Promotion::getActivePromotions();
        $discountTotal = Promotion::getDiscountByOrder($order['id']);
        $groupedItems  = OrderItem::getGroupedByOrder($order['id']);

        require_once __DIR__ . '/../views/pages/cart/checkout.php';
    }

    // =========================
    // XỬ LÝ THANH TOÁN
    // =========================
    public function processPayment() {

        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'error' => 'Chưa đăng nhập']);
            exit;
        }

        $userId = (int)$_SESSION['user_id'];

        $order = Order::getPendingByUser($userId);
        if (!$order) {
            echo json_encode(['success' => false, 'error' => 'Không tìm thấy đơn hàng']);
            exit;
        }

        // Lấy thông tin khách hàng
        $customerName = $_POST['customer_name'] ?? '';
        $customerPhone = $_POST['customer_phone'] ?? '';
        $customerEmail = $_POST['customer_email'] ?? '';
        $paymentMethod = $_POST['payment_method'] ?? 'vnpay';

        // Giả lập thanh toán thành công (trong thực tế sẽ gọi API cổng thanh toán)
        // Ở đây mình mặc định thành công để demo
        $success = true;

        if ($success) {
            // Cập nhật trạng thái đơn hàng
            Order::markPaid($order['id']);

            // Sinh ticket
            require_once __DIR__ . '/../models/Ticket.php';
            TicketModel::generateByOrder($order['id']);

            // Lưu thông tin khách hàng vào session để hiển thị trên trang vé
            $_SESSION['last_order'] = [
                'order_id' => $order['id'],
                'customer_name' => $customerName,
                'customer_phone' => $customerPhone,
                'customer_email' => $customerEmail,
                'payment_method' => $paymentMethod,
                'total_price' => $order['total_price']
            ];

            echo json_encode(['success' => true, 'order_id' => $order['id']]);
        } else {
            Order::markFailed($order['id']);
            echo json_encode(['success' => false, 'error' => 'Thanh toán thất bại']);
        }
    }

    // =========================
    // THÊM VÉ CỔNG
    // =========================
    public function addGate() {

        if (!isset($_SESSION['user_id'])) {
            // Hiện thông báo và chuyển đến trang đăng nhập
            echo '<script>
                    alert("Bạn cần đăng nhập để thêm vé cổng!");
                    window.location.href = "' . BASE_URL . '/login";
                  </script>';
            exit;
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
                'gate_ticket_id'   => $gateId,
                'quantity'        => 1,
                'price'           => $price
            ]);
        }

        Order::updateTotal($orderId);

        header("Location: " . BASE_URL . "/cart");
        exit;
    }

    // =========================
    // ÁP MÃ GIẢM GIÁ (CHỈ LƯU DISCOUNT)
    // =========================
    public function applyPromo() {

        if (!isset($_SESSION['user_id'])) {
            // Hiện thông báo và chuyển đến trang đăng nhập
            echo '<script>
                    alert("Bạn cần đăng nhập để sử dụng mã giảm giá!");
                    window.location.href = "' . BASE_URL . '/login";
                  </script>';
            exit;
        }

        $code = $_POST['promo_code'] ?? '';

        $order = Order::getPendingByUser($_SESSION['user_id']);
        if (!$order) {
            die('Không có order');
        }

        $result = Promotion::apply($code, $order['id']);

        $_SESSION['promo_msg'] = $result['error'] ?? 'Áp mã thành công';

        header("Location: " . BASE_URL . "/cart");
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
                OrderItem::delete($itemId);
            } else {
                OrderItem::updateQty($itemId, $newQty);
            }
        }

        Order::updateTotal($item['order_id']);
        Promotion::clearByOrder($item['order_id']);

        header("Location: " . BASE_URL . "/cart");
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

        OrderItem::delete($itemId);
        Order::updateTotal($item['order_id']);
        Promotion::clearByOrder($item['order_id']);

        header("Location: " . BASE_URL . "/cart");
        exit;
    }

    // =========================
    // AJAX: LẤY DỮ LIỆU GIỎ HÀNG
    // =========================
    public function getCartData() {
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['error' => 'Chưa đăng nhập']);
            exit;
        }

        $userId = (int)$_SESSION['user_id'];
        $order = Order::getPendingByUser($userId);
        $discountTotal = $order ? Promotion::getDiscountByOrder($order['id']) : 0;
        $groupedItems = $order ? OrderItem::getGroupedByOrder($order['id']) : [];

        $finalTotal = $order ? max(0, $order['total_price'] - $discountTotal) : 0;

        echo json_encode([
            'success' => true,
            'order' => $order,
            'groupedItems' => $groupedItems,
            'total_price' => $order ? $order['total_price'] : 0,
            'discount' => $discountTotal,
            'final_total' => $finalTotal
        ]);
        exit;
    }
}
