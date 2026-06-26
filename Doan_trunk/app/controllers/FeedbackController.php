<?php
require_once __DIR__ . "/../models/FeedbackModel.php";

class FeedbackController {

    public function index() {
        include __DIR__ . "/../views/pages/admin_feedback.php";
    }

    // API: list feedback
    public function apiList() {
        $model = new FeedbackModel();
        $data = $model->getAllFeedbacks();

        header("Content-Type: application/json");
        echo json_encode($data);
    }

    // API: statistics
    public function apiStats() {
        $model = new FeedbackModel();
        $stats = $model->getStats();

        header("Content-Type: application/json");
        echo json_encode($stats);
    }
}
