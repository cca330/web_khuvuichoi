<?php
session_start();
class AccountController {
    private $userModel;

    public function __construct() {
        require_once dirname(__DIR__) . '/models/UserModel.php';
        $this->userModel = new UserModel();
    }

   public function index() {
    $data = ['user' => null];

    if (isset($_SESSION['user_id']) && !empty($_SESSION['user_id'])) {
        $user = $this->userModel->getById($_SESSION['user_id']);
        if ($user) {
            $data['user'] = $user;
        } else {
            session_destroy();
        }
    }

    require_once __DIR__ . '/../views/page user/Account_View.php';
}
}