<?php include "tabs.php"; ?>

<h2>Chi tiết vé game: <?= htmlspecialchars($game) ?></h2>

<a class="btn" href="javascript:history.back()">← Quay lại</a>

<br><br>

<table>
    <tr>
        <th>ID đơn</th>
        <th>Khách hàng</th>
        <th>Số vé game</th>
        <th>Tổng tiền đơn</th>
        <th>Thời gian thanh toán</th>
    </tr>

    <?php foreach ($orders as $o): ?>
    <tr onclick="window.location='<?= BASE_URL ?>/Reports/showod/<?= $o['order_id'] ?>'">
        <td><?= $o['order_id'] ?></td>
        <td><?= $o['username'] ?></td>
        <td><?= $o['ticket_count'] ?></td>
        <td><?= number_format($o['total_price']) ?> đ</td>
        <td><?= $o['paid_at'] ?></td>
    </tr>
    <?php endforeach; ?>
</table>
