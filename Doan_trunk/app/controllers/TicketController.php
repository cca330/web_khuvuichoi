<?php
require_once __DIR__ . "/../models/TicketModel.php";

class TicketController
{
    public function index()
    {
        include __DIR__ . "/../views/pages/admin_ticket.php";
    }

    // API: list tickets
    public function apiList()
    {
        $status = $_GET['status'] ?? "";
        $type   = $_GET['type'] ?? "";

        $model = new TicketModel();
        $data = $model->getTickets($status, $type);

        header("Content-Type: application/json");
        echo json_encode($data);

        
    }

    // API: stats
    public function apiStats()
    {
        $model = new TicketModel();
        $stats = $model->getStats();

        header("Content-Type: application/json");
        echo json_encode($stats);
    }

    // API: check ticket
    public function apiCheck()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['ticket_code'])) {
            echo "INVALID";
            return;
        }

        $model = new TicketModel();
        $ok = $model->useTicket($data['ticket_code']);

        echo $ok ? "OK" : "FAILED";
    }
}
