<?php include "tabs.php"; ?>
<h3>Danh sách đơn hàng vé cổng</h3>
<a class="btn" href="javascript:history.back()">← Quay lại</a>
<table class="table table-bordered">
<thead>
<tr>
    <th>Mã đơn</th>
    <th>Người mua</th>
    <th>Số vé</th>
    <th>Giá vé</th>
    <th>Thành tiền</th>
    <th>Ngày thanh toán</th>
</tr>
</thead>
<tbody>
<?php foreach ($orders as $o): ?>
<tr>
    <td>#<?= $o['order_id'] ?></td>
    <td><?= $o['username'] ?></td>
    <td><?= $o['ticket_count'] ?></td>
    <td><?= number_format($o['price']) ?> đ</td>
    <td><?= number_format($o['total_amount']) ?> đ</td>
    <td><?= $o['paid_at'] ?></td>
</tr>
<?php endforeach; ?>
</tbody>
</table>
