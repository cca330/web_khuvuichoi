<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../models/Ticket.php';

class UserTicketController extends Controller {

    // =========================
    // XEM VÉ ĐIỆN TỬ
    // =========================
    public function view() {

        if (!isset($_SESSION['user_id'])) {
            echo '<script>
                    alert("Bạn cần đăng nhập để xem vé!");
                    window.location.href = "' . BASE_URL . '/login";
                  </script>';
            exit;
        }

        // Lấy orderId từ GET parameter hoặc session
        $orderId = $_GET['id'] ?? null;
        if (!$orderId && isset($_SESSION['last_order']['order_id'])) {
            $orderId = $_SESSION['last_order']['order_id'];
        }

        if (!$orderId) {
            echo '<script>
                    alert("Không tìm thấy đơn hàng!");
                    window.location.href = "' . BASE_URL . '/trangchu";
                  </script>';
            exit;
        }

        $userId = (int)$_SESSION['user_id'];

        // Lấy thông tin đơn hàng
        $order = Order::find($orderId);
        
        // Kiểm tra đơn hàng có thuộc về user không và đã thanh toán
        if (!$order || $order['user_id'] != $userId || $order['status'] !== 'PAID') {
            echo '<script>
                    alert("Đơn hàng không hợp lệ!");
                    window.location.href = "' . BASE_URL . '/trangchu";
                  </script>';
            exit;
        }

        // Lấy thông tin khách hàng từ session hoặc từ đơn hàng
        $customerInfo = $_SESSION['last_order'] ?? [
            'customer_name' => $_SESSION['username'] ?? '',
            'customer_phone' => '',
            'customer_email' => '',
            'payment_method' => 'vnpay',
            'total_price' => $order['total_price']
        ];

        // Lấy danh sách vé
        $ticketModel = new TicketModel();
        $tickets = $ticketModel->getTicketsByOrder($orderId);

        // Mapping phương thức thanh toán
        $paymentMethods = [
            'vnpay' => 'VNPay',
            'momo' => 'MoMo',
            'zalopay' => 'ZaloPay',
            'bank' => 'Chuyển khoản',
            'counter' => 'Thanh toán tại quầy'
        ];

        $this->view("Master", [
            "page" => "ticket/view",
            "order" => $order,
            "customerInfo" => $customerInfo,
            "tickets" => $tickets,
            "paymentMethods" => $paymentMethods
        ]);
    }

    // =========================
    // LỊCH SỬ ĐƠN HÀNG
    // =========================
    public function history() {

        if (!isset($_SESSION['user_id'])) {
            echo '<script>
                    alert("Bạn cần đăng nhập để xem lịch sử!");
                    window.location.href = "' . BASE_URL . '/login";
                  </script>';
            exit;
        }

        $userId = (int)$_SESSION['user_id'];
        $orders = Order::getPaidByUser($userId);

        $this->view("Master", [
            "page" => "ticket/history",
            "orders" => $orders
        ]);
    }
}
