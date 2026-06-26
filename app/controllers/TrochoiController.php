<?php
class TrochoiController {
    private $trochoiModel;

    public function __construct() {
        require_once dirname(__DIR__) . '/models/GameModel.php';
        $this->trochoiModel = new GameModel();
    }

    public function index() {
    $trochoiList = $this->trochoiModel->getAll();


    // Truyền biến trực tiếp vào view (scope chung)
    require_once __DIR__ . '/../views/page user/Trochoi_View.php';
}
}