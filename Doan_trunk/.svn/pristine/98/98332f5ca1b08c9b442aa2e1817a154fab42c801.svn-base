<?php include "tabs.php"; ?>
<h2>Tổng quan Khu Vui Chơi</h2>
<a href="<?= BASE_URL ?>/Reports/exportDashboard" class="btn">Xuất Excel</a>

<div class="cards">

    <a href="<?= BASE_URL ?>/Reports/revenueToday" class="card card-link">
        <p>💰 Doanh thu hôm nay</p>
        <h1><?= number_format($revenueToday['total']) ?> đ</h1>
    </a>

    <a href="<?= BASE_URL ?>/Reports/ticketToday" class="card card-link">
        <p>🎟 Vé bán hôm nay</p>
        <h1><?= number_format($ticketToday['total']) ?></h1>
    </a>

    <a href="<?= BASE_URL ?>/Reports/userToday" class="card card-link">
        <p>👤 Người dùng mới</p>
        <h1><?= number_format($userToday['total']) ?></h1>
    </a>

</div>


<h3>Đơn hàng mới nhất</h3>

<table>
    <tr>
        <th>ID</th>
        <th>Khách hàng</th>
        <th>Tổng tiền</th>
        <th>Trạng thái</th>
        <th>Thời gian</th>
    </tr>

    <?php foreach($latestOrders as $order): ?>
    <tr onclick="window.location='<?= BASE_URL ?>/Reports/showod/<?= $order['id'] ?>'"
        style="cursor:pointer;">
        <td><?= $order['id'] ?></td>
        <td><?= $order['username'] ?></td>
        <td><?= number_format($order['total_price']) ?> VNĐ</td>
        <td><?= $order['status'] ?></td>
        <td><?= $order['paid_at'] ?></td>
    </tr>
    <?php endforeach; ?>

</table>
