<?php
require_once __DIR__ . "/../models/EventModel.php";
require_once __DIR__ . "/../models/EventImageModel.php";
require_once __DIR__ . "/../models/EventScheduleModel.php";

class TintucController {

    public function index() {
        $eventModel = new EventModel();
        $imageModel = new EventImageModel();
        $scheduleModel = new EventScheduleModel();

        // Lấy tất cả sự kiện
        $events = $eventModel->getAll();

        // Lấy hình ảnh và lịch trình cho mỗi sự kiện
        $eventData = [];
        foreach ($events as $event) {
            $eventId = $event['id'];
            $eventData[$eventId] = [
                'event' => $event,
                'images' => $imageModel->getByEventId($eventId),
                'schedules' => $scheduleModel->getByEventId($eventId)
            ];
        }

        require_once __DIR__ . '/../views/page user/Tintuc_View.php';
    }
}