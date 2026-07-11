<?php
require_once __DIR__ . "/../models/TicketModel.php";

class TicketController extends Controller
{
    public function index()
    {
        $this->view("Master", [
            "page" => "admin_ticket"
        ]);
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
    // API: check ticket (quet tai cong)
    public function apiCheck()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['ticket_code'])) {
            header("Content-Type: application/json");
            echo json_encode(['ok' => false, 'message' => 'INVALID_INPUT']);
            return;
        }

        $staffId  = $_SESSION['user_id'] ?? null; // tuy vao he thong auth cua ban
        $gateName = $data['gate_name'] ?? null;

        $model = new TicketModel();
        $result = $model->useTicket($data['ticket_code'], $staffId, $gateName);

        header("Content-Type: application/json");
        echo json_encode($result);
    }
}
