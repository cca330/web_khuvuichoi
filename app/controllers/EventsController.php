<?php
require_once __DIR__ . "/../models/EventModel.php";
require_once __DIR__ . "/../models/EventImageModel.php";
require_once __DIR__ . "/../models/EventScheduleModel.php";

class EventsController extends Controller {
    public function index() {
        $model = new EventModel();
        $events = $model->getAll();

        $this->view("Master", [
            "page" => "events/index",
            "events" => $events
        ]);
    }

    public function create() {
        $this->view("Master", [
            "page" => "events/create"
        ]);
    }

    public function store() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $model = new EventModel();
        $thumbnailPath = '';

        // Xử lý upload ảnh thumbnail
        if (!empty($_FILES['thumbnail']['name']) && $_FILES['thumbnail']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . "/../../public/uploads/";

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $tmpName = $_FILES['thumbnail']['tmp_name'];
            $name = $_FILES['thumbnail']['name'];
            $newName = time() . '_thumbnail_' . basename($name);
            $targetPath = $uploadDir . $newName;

            if (move_uploaded_file($tmpName, $targetPath)) {
                $thumbnailPath = BASE_URL . '/public/uploads/' . $newName;
            }
        }

        $data = [
            'title' => $_POST['title'],
            'thumbnail' => $thumbnailPath,
            'description' => $_POST['description'],
            'location' => $_POST['location'],
            'start_datetime' => $_POST['start_datetime'],
            'end_datetime' => $_POST['end_datetime'],
            'status' => $_POST['status']
        ];

        $model->create($data);
        header("Location: " . BASE_URL . "/Events");
    }

    public function edit($id) {
        $model = new EventModel();
        $event = $model->findById($id);

        $this->view("Master", [
            "page" => "events/edit",
            "event" => $event
        ]);
    }

    public function update($id) {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $model = new EventModel();

        // Lấy ảnh thumbnail hiện tại
        $event = $model->findById($id);
        $thumbnailPath = $event['thumbnail'];

        // Xử lý upload ảnh thumbnail mới nếu có
        if (!empty($_FILES['thumbnail']['name']) && $_FILES['thumbnail']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . "/../../public/uploads/";

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $tmpName = $_FILES['thumbnail']['tmp_name'];
            $name = $_FILES['thumbnail']['name'];
            $newName = time() . '_thumbnail_edit_' . basename($name);
            $targetPath = $uploadDir . $newName;

            if (move_uploaded_file($tmpName, $targetPath)) {
                $thumbnailPath = BASE_URL . '/public/uploads/' . $newName;
            }
        }

        $data = [
            'title' => $_POST['title'],
            'thumbnail' => $thumbnailPath,
            'description' => $_POST['description'],
            'location' => $_POST['location'],
            'start_datetime' => $_POST['start_datetime'],
            'end_datetime' => $_POST['end_datetime'],
            'status' => $_POST['status']
        ];

        $model->update($id, $data);
        header("Location: " . BASE_URL . "/Events");
    }

    public function show($id) {
        $model = new EventModel();
        $event = $model->findById($id);

        $imageModel = new EventImageModel();
        $images = $imageModel->getByEventId($id);

        $scheduleModel = new EventScheduleModel();
        $schedules = $scheduleModel->getByEventId($id);

        $this->view("Master", [
            "page" => "events/show",
            "event" => $event,
            "images" => $images,
            "schedules" => $schedules
        ]);
    }

    public function delete($id) {
        $model = new EventModel();
        $model->delete($id);
        header("Location: " . BASE_URL . "/Events");
    }
}
