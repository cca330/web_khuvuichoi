<?php
class PromotionsController extends Controller {

    public function index() {
        $model = $this->model("PromotionModel");
        $promotions = $model->getAll();

        $this->view("Master", [
            "page" => "promotions/index",
            "promotions" => $promotions
        ]);
    }

    public function create() {
        $model = $this->model("PromotionModel");
        // FIX: can danh sach loai ve de nguoi dung tick chon pham vi
        // ap dung (khong tick gi = ap dung cho TAT CA loai ve).
        $gateTickets = $model->getAllGateTickets();

        $this->view("Master", [
            "page" => "promotions/create",
            "gateTickets" => $gateTickets,
            "useFormCss" => true
        ]);
    }

    public function store() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $model = $this->model("PromotionModel");

        // FIX: bo 'type' (khong con cot nay trong promotions)
        $data = [
            "code" => strtoupper(trim($_POST['code'])),
            "discount" => (int)$_POST['discount'],
            "start_date" => $_POST['start_date'],
            "end_date" => $_POST['end_date']
        ];

        // create() gio tra ve id vua tao (xem PromotionModel::create)
        $promotionId = $model->create($data);

        // FIX: gate_ticket_ids[] la mang id duoc tick trong form (neu
        // co checkbox name="gate_ticket_ids[]"). Khong tick gi -> mang
        // rong -> ap dung cho TAT CA loai ve.
        $gateTicketIds = $_POST['gate_ticket_ids'] ?? [];
        $model->setScope($promotionId, $gateTicketIds);

        header("Location: " . BASE_URL . "/Promotions");
    }

    public function edit($id) {
        $model = $this->model("PromotionModel");
        $promotion = $model->findById($id);
        $gateTickets = $model->getAllGateTickets();
        // FIX: danh sach gate_ticket_id dang duoc ap dung, de tick san
        // checkbox tuong ung trong form Sua.
        $selectedScope = $model->getScope($id);

        $this->view("Master", [
            "page" => "promotions/edit",
            "promotion" => $promotion,
            "gateTickets" => $gateTickets,
            "selectedScope" => $selectedScope,
            "useFormCss" => true
        ]);
    }

    public function update($id) {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $model = $this->model("PromotionModel");

        // FIX: bo 'type' khoi payload
        $data = [
            "code" => strtoupper(trim($_POST['code'])),
            "discount" => (int)$_POST['discount'],
            "start_date" => $_POST['start_date'],
            "end_date" => $_POST['end_date'],
            "status" => $_POST['status']
        ];

        $model->update($id, $data);

        $gateTicketIds = $_POST['gate_ticket_ids'] ?? [];
        $model->setScope($id, $gateTicketIds);

        header("Location: " . BASE_URL . "/Promotions");
    }

    public function show($id) {
        $model = $this->model("PromotionModel");

        $promotion = $model->findById($id);
        $totalUsed = $model->totalUsed($id);
        $totalDiscount = $model->totalDiscount($id);
        // FIX: lay ten cac loai ve ma ma nay ap dung, de hien thi ro
        // rang o trang Chi tiet (rong = ap dung cho tat ca).
        $scopeNames = $model->getScopeNames($id);

        $this->view("Master", [
            "page" => "promotions/show",
            "promotion" => $promotion,
            "totalUsed" => $totalUsed['total'],
            "totalDiscount" => $totalDiscount['total'],
            "scopeNames" => $scopeNames
        ]);
    }

    public function disable($id) {
        $model = $this->model("PromotionModel");
        $model->disable($id);

        header("Location: " . BASE_URL . "/Promotions");
    }
}