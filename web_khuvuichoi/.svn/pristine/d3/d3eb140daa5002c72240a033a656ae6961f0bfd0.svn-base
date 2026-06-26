<?php require_once __DIR__ . '/../../Layouts/header.php'; ?>

<h2 class="cart-title">📜 Lịch sử mua hàng</h2>
<a href="<?= BASE_URL ?>/Order/exportHistoryExcel"
   class="btn btn-success">
    📊 Xuất Excel lịch sử mua
</a>

<div class="cart-section">

<?php if (empty($orders)): ?>

    <p class="history-empty">
        😢 Bạn chưa có đơn hàng nào được thanh toán
    </p>

<?php else: ?>

<table class="cart-table">
<tr>
    <th>Mã đơn</th>
    <th>Ngày thanh toán</th>
    <th>Trạng thái</th>
    <th>Tổng tiền</th>
    <th>Chi tiết</th>
</tr>

<?php foreach ($orders as $o): ?>
<tr>
    <td><b>#<?= $o['id'] ?></b></td>

    <td>
        <?= date('d/m/Y H:i', strtotime($o['paid_at'])) ?>
    </td>

    <td>
        <span class="badge badge-paid">Đã thanh toán</span>
    </td>

    <td>
        <b class="text-success">
            <?= number_format($o['total_price']) ?>đ
        </b>
    </td>

    <td>
        <a href="<?= BASE_URL ?>/Order/detail?id=<?= $o['id'] ?>" class="btn btn-add">
            🔍 Xem chi tiết
        </a>
    </td>
</tr>
<?php endforeach; ?>

</table>

<?php endif; ?>

</div>


