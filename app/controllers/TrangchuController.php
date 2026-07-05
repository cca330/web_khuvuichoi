<?php
class TrangchuController extends Controller
{
    private $feedbackModel;
    private $gameModel;

    public function __construct()
    {
        require_once __DIR__ . '/../models/FeedbackModel.php';
        require_once __DIR__ . '/../models/GameModel.php';
        $this->feedbackModel = new FeedbackModel();
        $this->gameModel = new GameModel();
    }

    public function Get_data()
    {
    
        $feedbacks = $this->feedbackModel->getLatestFeedbacks(3);
        // Lấy game đang mở để hiển thị trên trang chủ
        $games = $this->gameModel->getByStatus('OPEN');

        $data = [
            'feedbacks' => $feedbacks,
            'games' => $games
        ];

        $this->view("page user/Trangchu_View", $data);
    }

    public function index()
    {
        $this->Get_data();
    }
}