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
        $this->view("Master", [
            "page" => "promotions/create",
            "useFormCss" => true
        ]);
    }

    public function store() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $model = $this->model("PromotionModel");

        $data = [
            "code" => strtoupper(trim($_POST['code'])),
            "discount" => $_POST['discount'],
            "type" => $_POST['type'],
            "start_date" => $_POST['start_date'],
            "end_date" => $_POST['end_date']
        ];

        $model->create($data);
        header("Location: " . BASE_URL . "/Promotions");
    }

    public function edit($id) {
        $model = $this->model("PromotionModel");
        $promotion = $model->findById($id);

        $this->view("Master", [
            "page" => "promotions/edit",
            "promotion" => $promotion,
            "useFormCss" => true
        ]);
    }

    public function update($id) {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $model = $this->model("PromotionModel");

        $data = [
            "code" => $_POST['code'],
            "discount" => $_POST['discount'],
            "type" => $_POST['type'],
            "start_date" => $_POST['start_date'],
            "end_date" => $_POST['end_date'],
            "status" => $_POST['status']
        ];

        $model->update($id, $data);
        header("Location: " . BASE_URL . "/Promotions");
    }

    public function show($id) {
        $model = $this->model("PromotionModel");

        $promotion = $model->findById($id);
        $totalUsed = $model->totalUsed($id);
        $totalDiscount = $model->totalDiscount($id);

        $this->view("Master", [
            "page" => "promotions/show",
            "promotion" => $promotion,
            "totalUsed" => $totalUsed['total'],
            "totalDiscount" => $totalDiscount['total']
        ]);
    }

    public function disable($id) {
        $model = $this->model("PromotionModel");
        $model->disable($id);

        header("Location: " . BASE_URL . "/Promotions");
    }
}

?>