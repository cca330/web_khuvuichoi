<?php
require_once __DIR__ . "/../models/EventImageModel.php";
require_once __DIR__ . "/../models/EventModel.php";

class EventImagesController extends Controller {
    public function index($eventId) {
        $imageModel = new EventImageModel();
        $images = $imageModel->getByEventId($eventId);

        $eventModel = new EventModel();
        $event = $eventModel->findById($eventId);

        $this->view("Master", [
            "page" => "event_images/index",
            "images" => $images,
            "event" => $event
        ]);
    }

    public function create($eventId) {
        $eventModel = new EventModel();
        $event = $eventModel->findById($eventId);

        $this->view("Master", [
            "page" => "event_images/create",
            "event" => $event
        ]);
    }

    public function store($eventId) {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $model = new EventImageModel();

        // Kiểm tra nếu có file được upload
        if (!empty($_FILES['images']['name'][0])) {
            $uploadDir = __DIR__ . "/../../public/uploads/";

            // Tạo thư mục nếu chưa tồn tại
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $fileCount = count($_FILES['images']['name']);

            for ($i = 0; $i < $fileCount; $i++) {
                if ($_FILES['images']['error'][$i] === UPLOAD_ERR_OK) {
                    $tmpName = $_FILES['images']['tmp_name'][$i];
                    $name = $_FILES['images']['name'][$i];

                    // Tạo tên file duy nhất để tránh trùng lặp
                    $extension = pathinfo($name, PATHINFO_EXTENSION);
                    $newName = time() . '_' . $i . '_' . basename($name);
                    $targetPath = $uploadDir . $newName;

                    if (move_uploaded_file($tmpName, $targetPath)) {
                        // Lưu đường dẫn ảnh vào database
                        $data = [
                            'event_id' => $eventId,
                            'image' => BASE_URL . '/public/uploads/' . $newName
                        ];
                        $model->create($data);
                    }
                }
            }
        }

        header("Location: " . BASE_URL . "/EventImages/index/" . $eventId);
    }

    public function edit($id) {
        $imageModel = new EventImageModel();
        $image = $imageModel->findById($id);

        $eventModel = new EventModel();
        $event = $eventModel->findById($image['event_id']);

        $this->view("Master", [
            "page" => "event_images/edit",
            "image" => $image,
            "event" => $event
        ]);
    }

    public function update($id) {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $model = new EventImageModel();
        $imageModel = new EventImageModel();
        $currentImage = $imageModel->findById($id);
        $imagePath = $currentImage['image'];

        // Kiểm tra nếu có file mới được upload
        if (!empty($_FILES['image']['name']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . "/../../public/uploads/";

            // Tạo thư mục nếu chưa tồn tại
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $tmpName = $_FILES['image']['tmp_name'];
            $name = $_FILES['image']['name'];

            // Tạo tên file duy nhất để tránh trùng lặp
            $newName = time() . '_edit_' . basename($name);
            $targetPath = $uploadDir . $newName;

            if (move_uploaded_file($tmpName, $targetPath)) {
                $imagePath = BASE_URL . '/public/uploads/' . $newName;
            }
        }

        $data = [
            'image' => $imagePath
        ];

        $model->update($id, $data);
        $image = $model->findById($id);
        header("Location: " . BASE_URL . "/EventImages/index/" . $image['event_id']);
    }

    public function delete($id) {
        $model = new EventImageModel();
        $image = $model->findById($id);
        $eventId = $image['event_id'];
        $model->delete($id);
        header("Location: " . BASE_URL . "/EventImages/index/" . $eventId);
    }
}
