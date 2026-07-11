<?php
require_once __DIR__ . "/../../core/Database.php";

class TicketModel
{
    private function db()
    {
        return Database::getConnection();
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