<?php
require_once __DIR__ . "/../../core/Database.php";

class TicketReportModel {
    protected $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    // Tổng vé
    public function totalTickets() {
         $sql = "
            SELECT COUNT(*) AS total
            FROM tickets t
            JOIN orders o ON t.order_id = o.id
            WHERE o.status = 'PAID'
        ";
        return $this->pdo->query($sql)->fetch(PDO::FETCH_ASSOC);
    }
    //Vé game
    public function totalgameTickets(){
        $sql = "
            SELECT COUNT(*) AS total
            FROM tickets t
            JOIN orders o ON t.order_id = o.id
            WHERE o.status = 'PAID'
            AND t.item_type = 'GAME'
        ";
        return $this->pdo->query($sql)->fetch(PDO::FETCH_ASSOC);
    }
        // Vé CỔNG
    public function totalgateTickets() {
        $sql = "
            SELECT COUNT(*) AS total
            FROM tickets t
            JOIN orders o ON t.order_id = o.id
            WHERE o.status = 'PAID'
            AND t.item_type = 'GATE'
        ";
        return $this->pdo->query($sql)->fetch(PDO::FETCH_ASSOC);
    }

    // Vé theo loại
    public function ticketByType() {
        $stmt = $this->pdo->query("
            SELECT item_type, COUNT(*) AS total
            FROM tickets t
            JOIN orders o ON t.order_id = o.id
            WHERE o.status='PAID'
            GROUP BY item_type
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function gameTickets(){
        $sql="SELECT g.id, g.name, COUNT(t.id) AS total_ticket, SUM(o.total_price) AS revenue 
        FROM games g 
        JOIN tickets t ON t.item_type = 'GAME' AND t.item_id = g.id 
        JOIN orders o ON t.order_id = o.id AND o.status = 'PAID' 
        GROUP BY g.id, g.name 
        ORDER BY `total_ticket` DESC";
        return $this->pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }
public function ordersByGame($gameId) {
    $sql = "
        SELECT 
            o.id AS order_id,
            u.username,
            g.name AS game_name,
            COUNT(t.id) AS ticket_count,
            o.total_price,
            o.paid_at
        FROM tickets t
        JOIN orders o ON t.order_id = o.id
        JOIN users u  ON o.user_id = u.id
        JOIN games g  ON t.item_id = g.id
        WHERE t.item_type = 'GAME'
        AND t.item_id = ?
        AND o.status = 'PAID'
        GROUP BY o.id, g.name
        ORDER BY o.paid_at DESC
    ";

    $stmt = $this->pdo->prepare($sql);
    $stmt->execute([$gameId]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

public function listGateTickets(){
    $sql="
        SELECT 
            gt.id,
            gt.name AS gate_ticket_name,
            gt.price,
            COUNT(t.id) AS total_ticket,
            COUNT(t.id) * gt.price AS total_amount
        FROM gate_tickets gt
        LEFT JOIN tickets t 
            ON t.item_type = 'GATE'
            AND t.item_id = gt.id
        LEFT JOIN orders o 
            ON t.order_id = o.id
        WHERE o.status = 'PAID'
        GROUP BY gt.id, gt.name, gt.price
        ORDER BY gt.id ASC;
    ";
    return $this->pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
}
public function ordersByGateTicket($gateTicketId) {

    $sql = "
        SELECT 
            o.id AS order_id,
            u.username,
            COUNT(t.id) AS ticket_count,
            gt.price,
            COUNT(t.id) * gt.price AS total_amount,
            o.paid_at
        FROM tickets t
        JOIN orders o ON t.order_id = o.id
        JOIN users u  ON o.user_id = u.id
        JOIN gate_tickets gt ON t.item_id = gt.id
        WHERE t.item_type = 'GATE'
        AND gt.id = ?
        AND o.status = 'PAID'
        GROUP BY o.id, u.username, gt.price, o.paid_at
        ORDER BY o.paid_at DESC
    ";

    $stmt = $this->pdo->prepare($sql);
    $stmt->execute([$gateTicketId]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}


}
