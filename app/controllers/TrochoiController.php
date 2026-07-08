<?php
class TrochoiController {
    private $trochoiModel;

    public function __construct() {
        require_once dirname(__DIR__) . '/models/GameModel.php';
        $this->trochoiModel = new GameModel();
    }

    public function index() {
        // Chỉ lấy những game đang mở (status = 'OPEN')
        $trochoiList = $this->trochoiModel->getByStatus('OPEN');

        // FIX: games khong con luu anh truc tiep (khong con cot
        // `image`) - anh gio nam o bang game_images. Can gan them
        // $game['images'] (mang ten file) cho tung game truoc khi
        // dua vao view, neu khong view se luon fallback ve anh mac
        // dinh cho tat ca game.
        foreach ($trochoiList as &$game) {
            $game['images'] = $this->trochoiModel->getImages($game['id']);
        }
        unset($game); // tranh loi tham chieu con sot lai sau foreach

        // Truyền biến trực tiếp vào view (scope chung)
        require_once __DIR__ . '/../views/page user/Trochoi_View.php';
    }
}