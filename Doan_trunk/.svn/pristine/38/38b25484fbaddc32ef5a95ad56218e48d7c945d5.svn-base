<?php include "tabs.php"; ?>
<h2>📦 Chi tiết đơn hàng #<?= $order['id'] ?></h2>

<div class="order-summary">

    <!-- 👤 Khách hàng -->
    <div class="summary-card">
        <h3>👤 Khách hàng</h3>

        <div class="customer-box">
            <div class="customer-avatar">
                <?= strtoupper(substr($order['username'], 0, 1)) ?>
            </div>

            <div>
                <div class="customer-name">
                    <?= htmlspecialchars($order['username']) ?>
                </div>
                <div class="customer-email">
                    📧 <?= htmlspecialchars($order['email']) ?>
                </div>
            </div>
        </div>
    </div>

    <!-- 💰 Thông tin đơn -->
    <div class="summary-card">
        <h3>💰 Thông tin đơn</h3>

        <ul class="order-info">
            <li>
                <span>Tổng tiền</span>
                <b class="price"><?= number_format($order['total_price']) ?> VNĐ</b>
            </li>
            <li>
                <span>Trạng thái</span>
                <span class="status <?= strtolower($order['status']) ?>">
                    <?= $order['status'] ?>
                </span>
            </li>
            <li>
                <span>Thanh toán lúc</span>
                <span><?= $order['paid_at'] ?: 'Chưa thanh toán' ?></span>
            </li>
        </ul>
    </div>

</div>

<h3>🎟 Vé trong đơn</h3>

<table>
<tr>
    <th>ID đơn</th>
    <th>Loại</th>
    <th>Tên vé</th>
    <th>Item ID</th>
    <th>Số lượng</th>
</tr>

<?php foreach ($items as $item): ?>
<tr>
    <td><?= $item['id'] ?></td>
    <td><?= $item['item_type'] ?></td>
    <td><?=$item['item_name'] ?></td>
    <td><?= $item['item_id'] ?></td>
    <td><?=$item['quantity']?></td>
</tr>
<?php endforeach; ?>
</table>

<a href="javascript:history.back()" class="btn">⬅ Quay lại</a>
