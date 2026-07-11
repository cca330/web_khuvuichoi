<?php
require_once __DIR__ . '/../models/Promotion.php';

class KhuyenmaiController {
    public function index() {
        $promotions = Promotion::getActivePromotions();

        require_once __DIR__ . '/../views/page user/Khuyenmai_View.php';
    }
}
