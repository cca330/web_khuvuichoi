<?php
require_once __DIR__ . "/../../core/Database.php";

class TicketModel
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    // Lấy danh sách vé (có filter)
    public function getTickets($status = "", $type = "")
    {
        $sql = "
            SELECT 
                t.id,
                t.ticket_code,
                t.order_id,
                t.item_type,
                t.item_id,
                t.status,
                t.created_at,
                t.used_at,
                CASE 
                    WHEN t.item_type = 'GATE' THEN gt.name
                    ELSE 'Game Ticket'
                END AS item_name,
                CASE 
                    WHEN t.item_type = 'GATE' THEN gt.price
                    ELSE 0
                END AS price
            FROM tickets t
            LEFT JOIN gate_tickets gt 
                ON t.item_type = 'GATE' AND t.item_id = gt.id
            WHERE 1
        ";

        $params = [];

        if ($status !== "") {
            $sql .= " AND t.status = ?";
            $params[] = $status;
        }

        if ($type !== "") {
            $sql .= " AND t.item_type = ?";
            $params[] = $type;
        }

        $sql .= " ORDER BY t.created_at DESC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll();
    }

    // Thống kê
    public function getStats()
    {
        $sql = "
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN t.status = 'UNUSED' THEN 1 ELSE 0 END) AS unused,
                SUM(CASE WHEN t.status = 'USED' THEN 1 ELSE 0 END) AS used,
                SUM(
                    CASE 
                        WHEN t.item_type = 'GATE' THEN gt.price
                        ELSE 0
                    END
                ) AS revenue
            FROM tickets t
            LEFT JOIN gate_tickets gt 
                ON t.item_type = 'GATE' AND t.item_id = gt.id
        ";

        return $this->pdo->query($sql)->fetch();
    }

    // Check vé (QR)
    public function useTicket($code)
    {
        $stmt = $this->pdo->prepare("
            UPDATE tickets 
            SET status = 'USED', used_at = NOW()
            WHERE ticket_code = ? AND status = 'UNUSED'
        ");

        $stmt->execute([$code]);

        return $stmt->rowCount() > 0; // true nếu update thành công
    }
}
