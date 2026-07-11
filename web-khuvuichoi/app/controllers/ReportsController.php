<?php
require_once __DIR__ . '/../helpers/ExcelHelper.php';
class ReportsController extends Controller {

    public function index() {
        $model = $this->model("DashboardModel");

        $revenueToday = $model->revenueToday();
        $ticketToday  = $model->ticketToday();
        $userToday    = $model->userToday();

        $latestOrders = $model->latestOrders(5);

        $this->view("Master", [
            "page"          => "reports/index",
            "active" => "dashboard",
            "revenueToday"  => $revenueToday,
            "ticketToday"   => $ticketToday,
            "userToday"     => $userToday,
            "latestOrders"  => $latestOrders
        ]);
    }
    public function revenue(){
        $model = $this->model("RevenueModel");

        $hasFilter = isset($_GET['from'], $_GET['to']);

        if ($hasFilter) {
            $from = $_GET['from'];
            $to   = $_GET['to'];

            if ($from > $to) {
                [$from, $to] = [$to, $from];
            }
        } else {
            $to   = date('Y-m-d');
            $from = date('Y-m-d', strtotime('-29 days'));
        }

        $fromDB = $from . ' 00:00:00';
        $toDB   = $to   . ' 23:59:59';

        $revenuePeriod = $model->revenueByPeriod($fromDB, $toDB);
        $totalRevenue  = $model->totalRevenue();

        $labels = [];
        $data   = [];

        $period = new DatePeriod(
            new DateTime($from),
            new DateInterval('P1D'),
            (new DateTime($to))->modify('+1 day')
        );

        foreach ($period as $d) {
            $key = $d->format('Y-m-d');
            $labels[] = $d->format('d/m');
            $data[$key] = 0;
        }

        $chart = $model->chartByPeriod($fromDB, $toDB);

        foreach ($chart as $row) {
            if (isset($data[$row['day']])) {
                $data[$row['day']] = (int)$row['revenue'];
            }
        }


        $this->view("Master", [
            "page" => "reports/revenue",
            "active" => "revenue",
            "from" => $hasFilter ? $from : '',
            "to"   => $hasFilter ? $to   : '',
            "revenuePeriod" => $revenuePeriod,
            "totalRevenue"  => $totalRevenue,
            "labels" => $labels,
            "data"   => array_values($data)
        ]);
    }
    public function game() {

        $model = $this->model("GameReportModel");

        $totalGames  = $model->totalGames();
        $openGames   = $model->openGames();
        $closedGames = $model->closedGames();

        $labels = [];
        $data   = [];

        $chart = $model->ticketByGame();

        foreach ($chart as $row) {
            $labels[] = $row['name'];
            $data[]   = (int)$row['total'];
        }

        $this->view("Master", [
            "page"        => "reports/game",
            "active"      => "game",
            "totalGames"  => $totalGames,
            "openGames"   => $openGames,
            "closedGames" => $closedGames,
            "labels"      => $labels,
            "data"        => $data
        ]);
    }


public function ticket() {

    $model = $this->model("TicketReportModel");

    $totalTickets = $model->totalTickets();
    $totalgameTickets= $model->totalgameTickets();
    $totalgateTickets = $model->totalgateTickets();

    $labels = [];
    $data   = [];

    $chart = $model->ticketByType();
    foreach ($chart as $row) {
        $labels[] = $row['item_type'] == 'GAME' ? 'Vé Game' : 'Vé Cổng';
        $data[]   = (int)$row['total'];
    }

    $this->view("Master", [
        "page"         => "reports/ticket",
        "active"       => "ticket",
        "totalTickets" => $totalTickets,
        "totalgameTickets"  => $totalgameTickets,
        "totalgateTickets"  => $totalgateTickets,
        "labels"       => $labels,
        "data"         => $data
    ]);
}
public function table_game(){
    $model= $this->model("TicketReportModel");
    $gameTickets= $model->gameTickets();
    $this->view("Master",[
        "page" =>"reports/ticket_game",
        "active" => "ticket",
        "gameTickets" => $gameTickets
    ]);
}
public function revenueToday() {

    $model = $this->model("DashboardModel");

    $from = date('Y-m-d') . ' 00:00:00';
    $to   = date('Y-m-d') . ' 23:59:59';

    $revenueToday = $model->revenueToday();
    $ordersToday  = $model->ordersByPeriod($from, $to);

    $this->view("Master", [
        "page"          => "reports/revenue_today",
        "active"        => "dashboard",
        "revenueToday"  => $revenueToday,
        "ordersToday"   => $ordersToday
    ]);
}
public function ticketToday() {

    $model = $this->model("DashboardModel");

    $ticketToday = $model->ticketToday();
    $tickets     = $model->ticketsTodayList();

    $this->view("Master", [
        "page"        => "reports/ticket_today",
        "active"      => "dashboard",
        "ticketToday" => $ticketToday,
        "tickets"     => $tickets
    ]);
}
public function userToday() {

    $model = $this->model("DashboardModel");

    $userToday = $model->userToday();
    $users     = $model->usersTodayList();

    $this->view("Master", [
        "page"      => "reports/user_today",
        "active"    => "dashboard",
        "userToday" => $userToday,
        "users"     => $users
    ]);
}
public function showod($id) {
        $model = $this->model("DashboardModel");

        $data = $model->findWithItems($id);

        if (!$data['order']) {
            die("Đơn hàng không tồn tại");
        }

        $this->view("Master", [
            "page"  => "reports/showod",
            "order" => $data['order'],
            "items" => $data['items']
        ]);
    }
public function revenueOrders() {

    $model = $this->model("DashboardModel");

    if (isset($_GET['from'], $_GET['to'])) {
        $from = $_GET['from'] . ' 00:00:00';
        $to   = $_GET['to']   . ' 23:59:59';
    } else {
        $to   = date('Y-m-d') . ' 23:59:59';
        $from = date('Y-m-d', strtotime('-29 days')) . ' 00:00:00';
    }

    $revenue = [
        'total' => array_sum(
            array_column(
                $model->ordersByPeriod($from, $to),
                'total_price'
            )
        )
    ];

    $orders = $model->ordersByPeriod($from, $to);

    $this->view("Master", [
        "page"    => "reports/revenue_orders",
        "active"  => "revenue",
        "orders"  => $orders,
        "revenue" => $revenue,
        "from"    => substr($from, 0, 10),
        "to"      => substr($to, 0, 10)
    ]);
}
public function gameList() {

    $model = $this->model("GameReportModel");

    $status = $_GET['status'] ?? null; // OPEN | CLOSE | null

    $games = $model->listGames($status);

    $this->view("Master", [
        "page"   => "reports/game_list",
        "active" => "game",
        "games"  => $games,
        "status" => $status
    ]);
}

public function gameOrders($gameId) {

    $model = $this->model("TicketReportModel");

    $orders = $model->ordersByGame($gameId);

    if (empty($orders)) {
        die("Game không tồn tại hoặc chưa có vé bán");
    }

    $this->view("Master", [
        "page"   => "reports/game_orders",
        "active" => "ticket",
        "orders" => $orders,
        "game"   => $orders[0]['game_name']
    ]);
}
public function gateListTickets() {

    $model = $this->model("TicketReportModel");


    $tickets = $model->listGateTickets();

    $this->view("Master", [
        "page"   => "reports/gate_list",
        "active" => "ticket",
        "tickets"  => $tickets
    ]);
}
public function gateOrders($gateTicketId) {

    $model = $this->model("TicketReportModel");

    $orders = $model->ordersByGateTicket($gateTicketId);

    if (empty($orders)) {
        die("Loại vé cổng chưa có đơn hàng");
    }

    $this->view("Master", [
        "page"   => "reports/gate_orders",
        "active" => "ticket",
        "orders" => $orders
    ]);
}

public function exportDashboard() {

    $model = $this->model("DashboardModel");

    ExcelHelper::export(
        'dashboard.xlsx',
        [
            [
                'title'  => 'Báo cáo',
                'header' => ['Chỉ số', 'Giá trị'],
                'data'   => [
                    ['Doanh thu hôm nay', $model->revenueToday()['total']],
                    ['Vé bán hôm nay',    $model->ticketToday()['total']],
                    ['Người dùng mới',    $model->userToday()['total']],
                ]
            ],
            [
                'title'  => 'Đơn hàng gần nhất',
                'header' => ['Mã đơn', 'Người dùng', 'Tổng tiền', 'Trạng thái', 'Thanh toán'],
                'data'   => $model->latestOrders(10)
            ]
        ]
    );
}


}
