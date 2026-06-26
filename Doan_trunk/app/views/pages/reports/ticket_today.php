<?php include "tabs.php"; ?>
<h2>🎟 Vé bán hôm nay</h2>
<p>Tổng vé: <b><?= $ticketToday['total'] ?></b></p>

<table>
<tr>
    <th>ID vé</th>
    <th>Loại</th>
    <th>Đơn hàng</th>
    <th>Thời gian</th>
</tr>

<?php foreach ($tickets as $t): ?>
<tr>
    <td><?= $t['id'] ?></td>
    <td><?= $t['item_type'] ?></td>
    <td>#<?= $t['order_id'] ?></td>
    <td><?= $t['paid_at'] ?></td>
</tr>
<?php endforeach; ?>
</table>
