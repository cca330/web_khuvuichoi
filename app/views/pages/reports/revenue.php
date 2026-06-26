<?php include "tabs.php"; ?>
<h2>BÁO CÁO DOANH THU</h2>

<!-- ===== FILTER ===== -->
<form method="get" class="filter">
    <label>
        Từ ngày:
        <input type="date" name="from" value="<?= $from ?? '' ?>">
    </label>

    <label>
        Đến ngày:
        <input type="date" name="to" value="<?= $to ?? '' ?>">
    </label>

    <button type="submit" class="btn">Lọc</button>

    <?php if($from && $to): ?>
        <a href="<?= BASE_URL ?>/Reports/revenue">❌ Bỏ lọc</a>
    <?php endif; ?>
</form>

<!-- ===== CARDS ===== -->
<div class="cards">

    <a href="<?= BASE_URL ?>/Reports/revenueOrders<?= $from && $to ? "?from=$from&to=$to" : "" ?>" class="card card-link">
        <p>💰 Doanh thu <?= ($from && $to) ? 'theo lọc' : '30 ngày gần nhất' ?></p>
        <h1><?= number_format($revenuePeriod['total']) ?> đ</h1>
    </a>

    <a href="<?= BASE_URL ?>/Reports/revenueOrders" class="card card-link">
        <p>💵 Tổng doanh thu</p>
        <h1><?= number_format($totalRevenue['total']) ?> đ</h1>
    </a>

</div>

<!-- ===== CHART ===== -->
<h3>Biểu đồ doanh thu</h3>

<canvas id="revenueChart" height="120"></canvas>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
    window.revenueLabels = <?= json_encode($labels) ?>;
    window.revenueData   = <?= json_encode($data) ?>;
</script>

<script src="<?= BASE_URL ?>/public/Js/chart-revenue.js"></script>