<?php
require_once __DIR__ . "/../models/UserModel.php";

class UserController {

    public function index() {
        include __DIR__ . "/../views/pages/user_list.php";
    }

    public function apiList() {
        $model = new UserModel();
        $users = $model->getAllUsers();

        header("Content-Type: application/json");
        echo json_encode($users);
    }

    public function updateStatus() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['user_id']) || empty($data['status'])) {
            http_response_code(400);
            echo "INVALID";
            return;
        }

        $model = new UserModel();
        $ok = $model->updateStatus($data['user_id'], $data['status']);

        echo $ok ? "OK" : "FAIL";
    }
}
