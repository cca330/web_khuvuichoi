<?php
class TrangchuController extends Controller
{
    private $feedbackModel;

    public function __construct()
    {
        require_once __DIR__ . '/../models/FeedbackModel.php';
        $this->feedbackModel = new FeedbackModel();
    }

    public function Get_data()
    {
    
        $feedbacks = $this->feedbackModel->getLatestFeedbacks(3);

        $data = [
            'feedbacks' => $feedbacks
        ];

        $this->view("page user/Trangchu_View", $data);
    }

    public function index()
    {
        $this->Get_data();
    }
}