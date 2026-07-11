<?php
session_start();
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../models/OrderItem.php';
require_once __DIR__ . '/../models/GateTicket.php';
require_once __DIR__ . '/../models/Game.php';
require_once __DIR__ . '/../models/Promotion.php';
require_once __DIR__ . '/../helpers/ExcelHelper.php';

class OrderController {

    /* ================= LỊCH SỬ MUA ================= */
    public function history() {
        if (!isset($_SESSION['user_id'])) {
            die('Chưa đăng nhập');
        }

        $orders = Order::getPaidByUser($_SESSION['user_id']);
        require_once __DIR__ . '/../views/pages/order/history.php';
    }

    /* ================= CHI TIẾT ĐƠN ================= */
    public function detail() {
        if (!isset($_SESSION['user_id'])) {
            die('Chưa đăng nhập');
        }

        $orderId = (int)($_GET['id'] ?? 0);
        $order   = Order::find($orderId);

        if (!$order || $order['user_id'] != $_SESSION['user_id']) {
            die('Đơn hàng không hợp lệ');
        }

        $items    = OrderItem::getByOrder($orderId);
        $discount = Promotion::getDiscountByOrder($orderId);

        /**
         * groupedItems = [
         *   gate_item_id => [
         *      gate => [id, name, quantity, price],
         *      games => []
         *   ]
         * ]
         */
        $groupedItems = [];

        /* ========= GATE ========= */
        foreach ($items as $item) {
            if ($item['item_type'] === 'GATE') {

                $gate = GateTicket::find($item['item_id']);
                if (!$gate) continue;

                $groupedItems[$item['id']] = [
                    'gate' => [
                        'name'     => $gate['name'],
                        'quantity' => $item['quantity'],
                        'price'    => $item['price']
                    ],
                    'games' => []
                ];
            }
        }

        /* ========= GAME ========= */
        foreach ($items as $item) {
            if (
                $item['item_type'] === 'GAME' &&
                isset($groupedItems[$item['parent_item_id']])
            ) {
                $game = Game::find($item['item_id']);
                if (!$game) continue;

                $groupedItems[$item['parent_item_id']]['games'][] = [
                    'name'     => $game['name'],
                    'quantity' => $item['quantity'],
                    'price'    => $item['price']
                ];
            }
        }

        require_once __DIR__ . '/../views/pages/order/detail.php';
    }

    /* ================= EXPORT EXCEL LỊCH SỬ MUA ================= */
    public function exportHistoryExcel() {
        if (!isset($_SESSION['user_id'])) {
            die('Chưa đăng nhập');
        }

        $userId = $_SESSION['user_id'];

        // Lấy danh sách order đã thanh toán
        $orders = Order::getPaidByUser($userId);

        if (empty($orders)) {
            die('Không có dữ liệu');
        }

        $rows = [];

        foreach ($orders as $order) {

            // Lấy discount theo từng order
            $discount = Promotion::getDiscountByOrder($order['id']) ?? 0;

            $rows[] = [
                'Order ID'    => $order['id'],
                'Paid At'  => $order['paid_at'],
                'Total Price' => $order['total_price'],
                'Discount'    => $discount,
                'Final Total' => $order['total_price'] - $discount,
                'Status'      => $order['status']
            ];
        }

        // Gọi ExcelHelper bạn đã viết
        ExcelHelper::export(
            'order_history.xlsx',
            [
                [
                    'title'  => 'Order History',
                    'header' => [
                        'Mã đơn',
                        'Ngày thanh toán',
                        'Tổng tiền',
                        'Giảm giá',
                        'Thành tiền',
                        'Trạng thái'
                    ],
                    'data' => $rows
                ]
            ]
        );
    }

}
