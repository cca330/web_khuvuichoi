<?php
class GamesController extends Controller{
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
        
        // Xử lý upload nhiều ảnh
        $imageNames = [];
        
        if(isset($_FILES['images'])){
            $targetDir = "public/uploads/";
            
            // Tạo folder nếu chưa tồn tại
            if (!file_exists($targetDir)) {
                mkdir($targetDir, 0777, true);
            }
            
            // Xử lý từng file
            for($i = 0; $i < count($_FILES['images']['name']); $i++){
                // Chỉ xử lý những file ảnh hợp lệ
                $fileType = strtolower(pathinfo($_FILES['images']['name'][$i], PATHINFO_EXTENSION));
                $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                
                if(in_array($fileType, $allowedTypes) && $_FILES['images']['error'][$i] == 0){
                    // Tạo tên file unique
                    $fileName = basename($_FILES['images']['name'][$i]);
                    $fileName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $fileName);
                    $fileName = time() . '_' . $i . '_' . $fileName;
                    
                    $targetFile = $targetDir . $fileName;
                    
                    if(move_uploaded_file($_FILES['images']['tmp_name'][$i], $targetFile)){
                        $imageNames[] = $fileName;
                    }
                }
            }
        }
        
        // Lưu danh sách ảnh (ngăn cách bằng dấu phẩy)
        $imageString = !empty($imageNames) ? implode(',', $imageNames) : '';
        
        $data=[
            "name" => $_POST['name'],
            "description" => $_POST['description'],
            "price" => $_POST['price'],
            "recommended_age" => $_POST['recommended_age'],
            "allowed_ticket" => $_POST['allowed_ticket'],
            "status" => $_POST['status'],
            "image" => $imageString
        ];
        $model->create($data);
        header("Location: " . BASE_URL . "/Games");
    }
    public function edit($id){
        $model=$this->model("GameModel");
        $game=$model->find($id);
        $this->view("Master",[
            "page" => "games/edit",
            "game" => $game,
            "useFormCss" => true
        ]);
    }
    public function update($id){
        if($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $model = $this->model("GameModel");

        // Xử lý upload ảnh
        $image = $_POST['old_image'] ?? null; // mặc định giữ ảnh cũ

        // Kiểm tra nếu có ảnh mới được upload
        if(isset($_FILES['images']) && !empty($_FILES['images']['name'][0])){
            $imageNames = [];
            $targetDir = __DIR__ . '/../../public/uploads/';

            // Tạo folder nếu chưa tồn tại
            if (!file_exists($targetDir)) {
                mkdir($targetDir, 0777, true);
            }

            // Xử lý từng file
            for($i = 0; $i < count($_FILES['images']['name']); $i++){
                // Chỉ xử lý những file ảnh hợp lệ
                $fileType = strtolower(pathinfo($_FILES['images']['name'][$i], PATHINFO_EXTENSION));
                $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                
                if(in_array($fileType, $allowedTypes) && $_FILES['images']['error'][$i] == 0){
                    // Tạo tên file unique
                    $fileName = basename($_FILES['images']['name'][$i]);
                    $fileName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $fileName);
                    $fileName = time() . '_' . $i . '_' . $fileName;
                    
                    $targetFile = $targetDir . $fileName;
                    
                    if(move_uploaded_file($_FILES['images']['tmp_name'][$i], $targetFile)){
                        $imageNames[] = $fileName;
                    }
                }
            }

            // Nếu có ảnh mới, lưu danh sách ảnh mới
            if(!empty($imageNames)){
                $image = implode(',', $imageNames);
            }
        }

        // Dữ liệu gửi vào DB
        $data = [
            "name" => $_POST['name'],
            "description" => $_POST['description'],
            "price" => $_POST['price'],
            "recommended_age" => $_POST['recommended_age'],
            "allowed_ticket" => $_POST['allowed_ticket'],
            "status" => $_POST['status'],
            "image" => $image
        ];

        $model->update($id, $data);

        header("Location: " . BASE_URL . "/Games");
        exit();
    }

    public function delete($id){
        $model=$this->model("GameModel");
        $model->delete($id);
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

        // Nếu không nhập gì → load toàn bộ
        if ($keyword === '') {
            $games = $model->getAll();
        } else {
            $games = $model->search($keyword);
        }

        $this->view("Master", [
            "page" => "games/index",
            "games" => $games,
            "keyword" => $keyword // để giữ lại ô search
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
        $stats = $model->getStats($id);

        $this->view("Master",[
            "page" => "games/show",
            "game" => $game,
            "stats" => $stats
        ]);
    }

}
?>