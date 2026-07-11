<?php
class LienheController {
    private $feedbackModel;

    public function __construct() {
        require_once dirname(__DIR__) . '/models/FeedbackModel.php';
        $this->feedbackModel = new FeedbackModel();
    }

    // Hiển thị trang Liên Hệ (GET /lienhe)
    public function index() {
        $feedbacks = $this->feedbackModel->getDisplayedFeedbacks(6);

        $data = [
            'feedbacks' => $feedbacks,
            'success'   => $_SESSION['success'] ?? null,
            'error'     => $_SESSION['error'] ?? null
        ];

        unset($_SESSION['success'], $_SESSION['error']);

        require_once __DIR__ . '/../views/page user/Lienhe_View.php';
    }

    // Xử lý gửi form (POST /lienhe/store)
    public function store() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header("Location: " . BASE_URL . "/lienhe");
            exit();
        }

        $data = [
            'user_id' => $_SESSION['user_id'] ?? null, // nếu đăng nhập
            'content' => trim($_POST['content'] ?? ''),
            'rating'  => (int)($_POST['rating'] ?? 0)
        ];

        $errors = [];
        if (empty($data['content'])) $errors[] = "Vui lòng nhập nội dung phản hồi";
        if ($data['rating'] < 1 || $data['rating'] > 5) $errors[] = "Đánh giá phải từ 1-5 sao";

        if (!empty($errors)) {
            $_SESSION['error'] = implode("<br>", $errors);
        } else {
            if ($this->feedbackModel->save($data)) {
                $_SESSION['success'] = "Cảm ơn bạn đã gửi phản hồi! Chúng tôi sẽ duyệt và hiển thị sớm.";
            } else {
                $_SESSION['error'] = "Gửi thất bại, vui lòng thử lại.";
            }
        }

        header("Location: " . BASE_URL . "/lienhe");
        exit();
    }
}