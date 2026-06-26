<?php include "tabs.php"; ?>

<h2>BÁO CÁO VÉ</h2>

<div class="cards">
    <a href="<?= BASE_URL ?>/Reports/table_game" class="card card-link">
        <p> Vé Game</p>
        <h1><?= $totalgameTickets['total'] ?></h1>
    </a>
    <a href="<?=BASE_URL ?>/Reports/gateListTickets" class="card card-link">
        <p>Vé Cổng</p>
        <h1><?= $totalgateTickets['total']?></h1>
    </a>
    <a href="<?= BASE_URL ?>/Reports/ticket" class="card card-link">
        <p>Tổng vé</p>
        <h1><?=$totalTickets['total']?></h1>
    </a>
</div>

<h3>Tỉ lệ vé theo loại</h3>

<canvas id="ticketChart" height="120"></canvas>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
    window.ticketLabels = <?= json_encode($labels) ?>;
    window.ticketData   = <?= json_encode($data) ?>;
</script>

<script src="<?= BASE_URL ?>/public/Js/chart-ticket.js?v=<?= time() ?>"></script>
