<?php include "tabs.php"; ?>
<h2>📊 Doanh thu hôm nay</h2>

<div class="cards">
    <div class="card">
        <p>Tổng doanh thu hôm nay</p>
        <h1><?= number_format($revenueToday['total']) ?> đ</h1>
    </div>
</div>

<h3>📋 Danh sách đơn hàng</h3>

<table width="100%" cellpadding="8" cellspacing="0">
<tr>
    <th>ID</th>
    <th>Khách hàng</th>
    <th>Tổng tiền</th>
    <th>Thời gian</th>
</tr>

<?php if (empty($ordersToday)): ?>
<tr>
    <td colspan="4" style="text-align:center">Không có đơn hàng hôm nay</td>
</tr>
<?php endif; ?>

<?php foreach ($ordersToday as $o): ?>
<tr>
    <td><?= $o['id'] ?></td>
    <td><?= $o['username'] ?></td>
    <td><?= number_format($o['total_price']) ?> đ</td>
    <td><?= $o['paid_at'] ?></td>
</tr>
<?php endforeach; ?>
</table>
