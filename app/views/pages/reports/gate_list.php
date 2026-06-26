<?php include "tabs.php"; ?>

<h2>DANH SÁCH Cổng</h2>

<table>
<tr>
    <th>ID</th>
    <th>Tên cổng</th>
    <th>Giá</th>
    <th>Số lượng</th>
    <th>Thành tiền</th>
</tr>

<?php foreach ($tickets as $t): ?>
<tr onclick="window.location='<?= BASE_URL ?>/Reports/gateOrders/<?= $t['id'] ?>'">
    <td><?=$t['id']?></td>
    <td><?= $t['gate_ticket_name'] ?></td>
    <td><?= number_format($t['price']) ?> đ</td>
    <td><?= $t['total_ticket'] ?></td>
    <td><?= number_format($t['total_amount']) ?> đ</td>
</tr>
<?php endforeach; ?>

</table>