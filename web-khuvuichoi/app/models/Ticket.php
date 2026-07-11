<?php
require_once __DIR__ . "/../../core/Database.php";

class TicketModel
{
    private function db()
    {
        return Database::getConnection();
    }

    /**
     * Lay danh sach ve theo order_id
     * @param int $orderId
     * @return array
     */
    public function getTicketsByOrder($orderId)
    {
        $conn = $this->db();

        $sql = "SELECT
                    t.id, t.ticket_code, t.status, t.admits_adult, t.admits_child,
                    t.valid_date, t.created_at,
                    gt.name AS gate_ticket_name, gt.type AS gate_ticket_type, gt.is_combo
                FROM tickets t
                JOIN order_items oi ON oi.id = t.order_item_id
                JOIN gate_tickets gt ON gt.id = t.gate_ticket_id
                WHERE oi.order_id = ?
                ORDER BY t.id ASC";

        $stmt = $conn->prepare($sql);
        $stmt->execute([$orderId]);
        return $stmt->fetchAll();
    }

    /**
     * Danh sach ve da ban (chi lay ve thuoc don da PAID).
     * $status: '' | ACTIVE | EXPIRED | CANCELLED
     * $type:   '' | SINGLE | COMBO
     */
    public function getTickets($status = "", $type = "")
    {
        $conn = $this->db();

        $sql = "SELECT
                    t.id, t.ticket_code, t.status, t.admits_adult, t.admits_child,
                    t.valid_date, t.created_at,
                    o.id AS order_id,
                    gt.name AS gate_ticket_name, gt.type AS gate_ticket_type, gt.is_combo,
                    oi.price
                FROM tickets t
                JOIN order_items oi ON oi.id = t.order_item_id
                JOIN orders o ON o.id = oi.order_id
                JOIN gate_tickets gt ON gt.id = t.gate_ticket_id
                WHERE o.status = 'PAID'";

        $params = [];

        if ($status !== "") {
            $sql .= " AND t.status = ?";
            $params[] = $status;
        }

        if ($type === "SINGLE") {
            $sql .= " AND gt.is_combo = 0";
        } elseif ($type === "COMBO") {
            $sql .= " AND gt.is_combo = 1";
        }

        $sql .= " ORDER BY t.created_at DESC";

        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Thong ke tong quan cho trang doanh thu ve.
     */
    /**
     * Thong ke tong quan cho trang doanh thu ve.
     * Luu y: 'unused' = ve con hieu luc (status=ACTIVE), 'used' = ve
     * het han/da huy (EXPIRED/CANCELLED). Day KHONG phai la da-quet-
     * hay-chua (1 ve ACTIVE co the da duoc quet IN/OUT nhieu lan trong
     * ngay). Neu can thong ke theo da-quet, phai join ticket_scans.
     */
    public function getStats()
    {
        $conn = $this->db();

        $sql = "SELECT
                    COUNT(*) AS total,
                    SUM(CASE WHEN t.status = 'ACTIVE' THEN 1 ELSE 0 END) AS unused,
                    SUM(CASE WHEN t.status IN ('EXPIRED','CANCELLED') THEN 1 ELSE 0 END) AS used,
                    COALESCE(SUM(oi.price), 0) AS revenue
                FROM tickets t
                JOIN order_items oi ON oi.id = t.order_item_id
                JOIN orders o ON o.id = oi.order_id
                WHERE o.status = 'PAID'";

        $row = $conn->query($sql)->fetch();

        return [
            'total'   => (int)($row['total'] ?? 0),
            'unused'  => (int)($row['unused'] ?? 0),
            'used'    => (int)($row['used'] ?? 0),
            'revenue' => (float)($row['revenue'] ?? 0),
        ];
    }

    /**
     * Sinh ticket tu order sau khi thanh toan thanh cong.
     * Moi order_item voi quantity > 0 se sinh quantity dong tickets.
     * @param int $orderId
     */
    public static function generateByOrder($orderId)
    {
        $conn = Database::getConnection();
        $conn->beginTransaction();

        try {
            // Lay cac order_items cua order
            $stmt = $conn->prepare("
                SELECT oi.id, oi.gate_ticket_id, oi.quantity, oi.price,
                       gt.admits_adult, gt.admits_child
                FROM order_items oi
                JOIN gate_tickets gt ON gt.id = oi.gate_ticket_id
                WHERE oi.order_id = ?
            ");
            $stmt->execute([$orderId]);
            $items = $stmt->fetchAll();

            $validDate = date('Y-m-d');
            $prefix = 'QR-' . date('Ymd') . '-';

            foreach ($items as $item) {
                // Sinh quantity tickets cho moi order_item
                for ($i = 0; $i < $item['quantity']; $i++) {
                    // Tao ticket code unique
                    $ticketCode = $prefix . str_pad(rand(0, 99999), 5, '0', STR_PAD_LEFT);

                    // Kiem tra trung lap (rare case)
                    $checkStmt = $conn->prepare("SELECT id FROM tickets WHERE ticket_code = ?");
                    $checkStmt->execute([$ticketCode]);
                    if ($checkStmt->fetch()) {
                        // Neu trung, tiep tuc random
                        $i--;
                        continue;
                    }

                    $insertStmt = $conn->prepare("
                        INSERT INTO tickets 
                        (order_item_id, gate_ticket_id, ticket_code, admits_adult, admits_child, valid_date, status)
                        VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')
                    ");
                    $insertStmt->execute([
                        $item['id'],
                        $item['gate_ticket_id'],
                        $ticketCode,
                        $item['admits_adult'],
                        $item['admits_child'],
                        $validDate
                    ]);
                }
            }

            $conn->commit();
        } catch (Exception $e) {
            $conn->rollBack();
            throw $e;
        }
    }

    /**
     * Quet ve tai cong: xac nhan hop le roi tu dong ghi log
     * ticket_scans (IN neu lan truoc la OUT hoac chua tung quet,
     * OUT neu lan truoc la IN). Khong con thay doi tickets.status
     * vi ve duoc dung nhieu lan/ngay.
     *
     * @param string $ticketCode
     * @param int|null $staffId  id nhan vien thuc hien quet (neu co)
     * @param string|null $gateName ten cong quet
     * @return array ['ok' => bool, 'message' => string, 'scan_type' => string|null]
     */
    public function useTicket($ticketCode, $staffId = null, $gateName = null)
    {
        $conn = $this->db();
        $conn->beginTransaction();

        try {
            // Khoa dong ve lai de tranh 2 request quet trung nhau cung luc
            $stmt = $conn->prepare(
                "SELECT * FROM tickets WHERE ticket_code = ? FOR UPDATE"
            );
            $stmt->execute([$ticketCode]);
            $ticket = $stmt->fetch();

            if (!$ticket) {
                $conn->rollBack();
                return ['ok' => false, 'message' => 'TICKET_NOT_FOUND', 'scan_type' => null];
            }

            if ($ticket['status'] !== 'ACTIVE') {
                $conn->rollBack();
                return ['ok' => false, 'message' => 'TICKET_' . $ticket['status'], 'scan_type' => null];
            }

            if ($ticket['valid_date'] !== date('Y-m-d')) {
                $conn->rollBack();
                return ['ok' => false, 'message' => 'TICKET_NOT_VALID_TODAY', 'scan_type' => null];
            }

            // Lay lan quet gan nhat de biet ve dang O TRONG hay O NGOAI
            $stmt = $conn->prepare(
                "SELECT scan_type FROM ticket_scans
                 WHERE ticket_id = ?
                 ORDER BY scanned_at DESC, id DESC
                 LIMIT 1"
            );
            $stmt->execute([$ticket['id']]);
            $lastScan = $stmt->fetch();

            // Chua quet lan nao hoac lan truoc la OUT -> lan nay la IN
            // Lan truoc la IN -> lan nay la OUT
            $scanType = (!$lastScan || $lastScan['scan_type'] === 'OUT') ? 'IN' : 'OUT';

            $stmt = $conn->prepare(
                "INSERT INTO ticket_scans (ticket_id, scan_type, gate_name, staff_id)
                 VALUES (?, ?, ?, ?)"
            );
            $stmt->execute([$ticket['id'], $scanType, $gateName, $staffId]);

            $conn->commit();

            return ['ok' => true, 'message' => 'SCANNED', 'scan_type' => $scanType];
        } catch (Exception $e) {
            $conn->rollBack();
            return ['ok' => false, 'message' => 'ERROR', 'scan_type' => null];
        }
    }
}