<?php
require_once __DIR__ . "/../models/RevenueModel.php";

class RevenueController extends Controller {
    public function index() {
        $model = new RevenueModel();

        // Lấy năm hiện tại nếu không được chọn
        $currentYear = date('Y');
        $selectedYear = $_GET['year'] ?? $currentYear;
        $selectedType = $_GET['type'] ?? 'total';

        $availableYears = $model->getAvailableYears();
        $monthlyRevenue = $model->getMonthlyRevenue($selectedYear, $selectedType);

        // Chuẩn bị dữ liệu cho biểu đồ
        $labels = [];
        $data = [];

        // Điền dữ liệu cho tất cả tháng
        for ($month = 1; $month <= 12; $month++) {
            $monthNum = str_pad($month, 2, '0', STR_PAD_LEFT);
            $monthDisplay = $monthNum . '/' . $selectedYear;
            $labels[] = $monthDisplay;
            $data[$monthDisplay] = 0;
        }

        // Điền dữ liệu từ kết quả truy vấn
        foreach ($monthlyRevenue as $month) {
            if (isset($data[$month['month_display']])) {
                $data[$month['month_display']] = (int)$month['total'];
            }
        }

        $gateDetails = $model->getGateTicketDetails();
        $gameDetails = $model->getGameTicketDetails();

        $this->view("Master", [
            "page" => "revenue/index",
            "availableYears" => $availableYears,
            "selectedYear" => $selectedYear,
            "selectedType" => $selectedType,
            "labels" => $labels,
            "data" => array_values($data),
            "gateDetails" => $gateDetails,
            "gameDetails" => $gameDetails
        ]);
    }
}
