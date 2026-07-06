<?php
require_once __DIR__ . "/../models/FeedbackModel.php";

class FeedbackController extends Controller
{
    public function index()
    {
        $this->view("Master", [
            "page" => "admin_feedback"
        ]);
    }

    // API: list feedback
    public function apiList()
    {
        $model = new FeedbackModel();
        $data = $model->getAllFeedbacks();

        header("Content-Type: application/json");
        echo json_encode($data);
    }

    // API: statistics
    public function apiStats()
    {
        $model = new FeedbackModel();
        $stats = $model->getStats();

        header("Content-Type: application/json");
        echo json_encode($stats);
    }
}