<?php
require_once __DIR__ . "/../models/EventScheduleModel.php";
require_once __DIR__ . "/../models/EventModel.php";

class EventScheduleController extends Controller {
    public function index($eventId) {
        $scheduleModel = new EventScheduleModel();
        $schedules = $scheduleModel->getByEventId($eventId);

        $eventModel = new EventModel();
        $event = $eventModel->findById($eventId);

        $this->view("Master", [
            "page" => "event_schedule/index",
            "schedules" => $schedules,
            "event" => $event
        ]);
    }

    public function create($eventId) {
        $eventModel = new EventModel();
        $event = $eventModel->findById($eventId);

        $this->view("Master", [
            "page" => "event_schedule/create",
            "event" => $event
        ]);
    }

    public function store($eventId) {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $model = new EventScheduleModel();
        $data = [
            'event_id' => $eventId,
            'schedule_time' => $_POST['schedule_time'],
            'title' => $_POST['title'],
            'description' => $_POST['description'],
            'sort_order' => $_POST['sort_order'] ?? 1
        ];

        $model->create($data);
        header("Location: " . BASE_URL . "/EventSchedule/index/" . $eventId);
    }

    public function edit($id) {
        $scheduleModel = new EventScheduleModel();
        $schedule = $scheduleModel->findById($id);

        $eventModel = new EventModel();
        $event = $eventModel->findById($schedule['event_id']);

        $this->view("Master", [
            "page" => "event_schedule/edit",
            "schedule" => $schedule,
            "event" => $event
        ]);
    }

    public function update($id) {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $model = new EventScheduleModel();
        $data = [
            'schedule_time' => $_POST['schedule_time'],
            'title' => $_POST['title'],
            'description' => $_POST['description'],
            'sort_order' => $_POST['sort_order']
        ];

        $model->update($id, $data);
        $schedule = $model->findById($id);
        header("Location: " . BASE_URL . "/EventSchedule/index/" . $schedule['event_id']);
    }

    public function delete($id) {
        $model = new EventScheduleModel();
        $schedule = $model->findById($id);
        $eventId = $schedule['event_id'];
        $model->delete($id);
        header("Location: " . BASE_URL . "/EventSchedule/index/" . $eventId);
    }
}
