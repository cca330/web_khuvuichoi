<?php
class GamesController extends Controller{

    // Thu muc luu anh - dung duong dan tuyet doi (__DIR__) nhat quan
    // o moi noi, tranh loi phu thuoc vao working directory luc chay.
    private function uploadDir(){
        return __DIR__ . '/../../public/uploads/';
    }

    // Xu ly upload nhieu file, tra ve mang ten file da luu thanh cong
    private function handleUploadedImages($filesField){
        $imageNames = [];

        if(!isset($_FILES[$filesField]) || empty($_FILES[$filesField]['name'][0])){
            return $imageNames;
        }

        $targetDir = $this->uploadDir();
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        for($i = 0; $i < count($_FILES[$filesField]['name']); $i++){
            $fileType = strtolower(pathinfo($_FILES[$filesField]['name'][$i], PATHINFO_EXTENSION));

            if(in_array($fileType, $allowedTypes) && $_FILES[$filesField]['error'][$i] == 0){
                $fileName = basename($_FILES[$filesField]['name'][$i]);
                $fileName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $fileName);
                $fileName = time() . '_' . $i . '_' . $fileName;

                $targetFile = $targetDir . $fileName;

                if(move_uploaded_file($_FILES[$filesField]['tmp_name'][$i], $targetFile)){
                    $imageNames[] = $fileName;
                }
            }
        }

        return $imageNames;
    }

    // Xoa vat ly cac file anh (dung khi thay/xoa gallery)
    private function deletePhysicalImages(array $filenames){
        $targetDir = $this->uploadDir();
        foreach ($filenames as $file) {
            $path = $targetDir . $file;
            if (is_file($path)) {
                @unlink($path);
            }
        }
    }

    public function index(){
        $model=$this->model("GameModel");
        $games=$model->getAll();
        $this->view("Master",[
            "page" => "games/index",
            "games" => $games
        ]);
    }

    public function create(){
        $this->view("Master",[
            "page" => "games/create",
            "useFormCss" => true
        ]);
    }

    public function store(){
        if($_SERVER['REQUEST_METHOD'] !== 'POST') return;
        $model=$this->model("GameModel");

        // FIX: bo 'price' (khong con trong bang games)
        $data=[
            "name" => $_POST['name'],
            "description" => $_POST['description'],
            "recommended_age" => $_POST['recommended_age'],
            "allowed_ticket" => $_POST['allowed_ticket'],
            "status" => $_POST['status']
        ];

        // create() gio tra ve id vua tao (xem GameModel::create)
        $gameId = $model->create($data);

        // FIX: luu tung anh thanh 1 dong rieng trong game_images,
        // thay vi noi chuoi implode(',', ...) vao 1 cot nhu truoc.
        $imageNames = $this->handleUploadedImages('images');
        if(!empty($imageNames)){
            $model->addImages($gameId, $imageNames);
        }

        header("Location: " . BASE_URL . "/Games");
    }

    public function edit($id){
        $model=$this->model("GameModel");
        $game=$model->find($id);
        $images = $model->getImages($id); // FIX: lay gallery de hien thi trong form sua

        $this->view("Master",[
            "page" => "games/edit",
            "game" => $game,
            "images" => $images,
            "useFormCss" => true
        ]);
    }

    public function update($id){
        if($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $model = $this->model("GameModel");

        // FIX: bo price/image khoi payload (khong con trong bang games)
        $data = [
            "name" => $_POST['name'],
            "description" => $_POST['description'],
            "recommended_age" => $_POST['recommended_age'],
            "allowed_ticket" => $_POST['allowed_ticket'],
            "status" => $_POST['status']
        ];

        $model->update($id, $data);

        // FIX: neu co anh moi -> THAY TOAN BO gallery cu bang anh moi
        // (xoa record cu trong DB + xoa file vat ly cu), neu khong co
        // anh moi thi GIU NGUYEN gallery hien tai (khong dong gi ca).
        $imageNames = $this->handleUploadedImages('images');
        if(!empty($imageNames)){
            $oldFiles = $model->replaceImages($id, $imageNames);
            $this->deletePhysicalImages($oldFiles);
        }

        header("Location: " . BASE_URL . "/Games");
        exit();
    }

    public function delete($id){
        $model=$this->model("GameModel");

        // FIX: lay danh sach file TRUOC khi xoa game (sau khi xoa,
        // game_images se bi ON DELETE CASCADE xoa theo trong DB, luc
        // do khong con truy van ra ten file de unlink() duoc nua).
        $oldFiles = $model->getImages($id);

        $model->delete($id);

        $this->deletePhysicalImages($oldFiles);

        header("Location: " . BASE_URL . "/Games");
    }

    public function close($id){
        $model = $this->model("GameModel");
        $model->close($id);
        header("Location: " . BASE_URL . "/Games");
    }

    public function search(){
        $model = $this->model("GameModel");

        $keyword = $_GET['keyword'] ?? '';

        if ($keyword === '') {
            $games = $model->getAll();
        } else {
            $games = $model->search($keyword);
        }

        $this->view("Master", [
            "page" => "games/index",
            "games" => $games,
            "keyword" => $keyword
        ]);
    }

    public function open($id){
        $model = $this->model("GameModel");
        $model->open($id);
        header("Location: " . BASE_URL . "/Games");
    }

    public function show($id){
        $model = $this->model("GameModel");

        $game = $model->find($id);
        $images = $model->getImages($id);          // FIX: cho carousel
        $stats = $model->getStats($id);             // FIX: doi sang thong ke feedback
        $feedbacks = $model->getFeedbacks($id);      // danh sach danh gia chi tiet

        $this->view("Master",[
            "page" => "games/show",
            "game" => $game,
            "images" => $images,
            "stats" => $stats,
            "feedbacks" => $feedbacks
        ]);
    }

}