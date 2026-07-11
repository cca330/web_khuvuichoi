<?php
require_once __DIR__ . "/../models/GateTicketModel.php";

class Gate_ticketsController extends Controller
{
    public function index()
    {
        $model = new GateTicketModel();
        $gateTickets = $model->getAll();

        $this->view("Master", [
            "page" => "gate_tickets/index",
            "gateTickets" => $gateTickets
        ]);
    }

    public function create()
    {
        $this->view("Master", [
            "page" => "gate_tickets/create"
        ]);
    }

    public function store()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $model = new GateTicketModel();
        $data = [
            'name' => $_POST['name'],
            'price' => $_POST['price'],
            'description' => $_POST['description'],
            'status' => $_POST['status'],
            'type' => $_POST['type']
        ];

        $model->create($data);
        header("Location: " . BASE_URL . "/gate_tickets");
    }

    public function edit($id)
    {
        $model = new GateTicketModel();
        $ticket = $model->findById($id);

        $this->view("Master", [
            "page" => "gate_tickets/edit",
            "ticket" => $ticket
        ]);
    }

    public function update($id)
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $model = new GateTicketModel();
        $data = [
            'name' => $_POST['name'],
            'price' => $_POST['price'],
            'description' => $_POST['description'],
            'status' => $_POST['status'],
            'type' => $_POST['type']
        ];

        $model->update($id, $data);
        header("Location: " . BASE_URL . "/gate_tickets");
    }

    public function delete($id)
    {
        $model = new GateTicketModel();
        $model->delete($id);
        header("Location: " . BASE_URL . "/gate_tickets");
    }
}
