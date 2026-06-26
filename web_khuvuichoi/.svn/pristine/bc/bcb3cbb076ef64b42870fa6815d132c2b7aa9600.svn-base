<?php include "tabs.php"; ?>

<h2>DANH SÁCH ĐƠN HÀNG THEO DOANH THU</h2>

<?php if(isset($from, $to)): ?>
    <p>
        Từ <b><?= $from ?></b> đến <b><?= $to ?></b>
    </p>
<?php endif; ?>

<h3>Tổng doanh thu: <?= number_format($revenue['total']) ?> đ</h3>

<table>
    <tr>
        <th>ID</th>
        <th>Khách hàng</th>
        <th>Tổng tiền</th>
        <th>Thời gian thanh toán</th>
    </tr>

    <?php if(empty($orders)): ?>
        <tr>
            <td colspan="4" align="center">Không có dữ liệu</td>
        </tr>
    <?php else: ?>
        <?php foreach($orders as $o): ?>
        <tr class="row-click"
            data-href="<?= BASE_URL ?>/Reports/showod/<?= $o['id'] ?>">
            <td><?= $o['id'] ?></td>
            <td><?= $o['username'] ?></td>
            <td><?= number_format($o['total_price']) ?> đ</td>
            <td><?= $o['paid_at'] ?></td>
        </tr>
        <?php endforeach; ?>
    <?php endif; ?>
</table>

<script>
document.querySelectorAll(".row-click").forEach(row => {
    row.addEventListener("click", () => {
        window.location = row.dataset.href;
    });
});
</script>
