<?php include "tabs.php"; ?>

<h2>BÁO CÁO GAME</h2>

<div class="cards">

    <a href="<?= BASE_URL ?>/Reports/gameList" class="card card-link">
        <p>🎮 Tổng số game</p>
        <h1><?= $totalGames['total'] ?></h1>
    </a>

    <a href="<?= BASE_URL ?>/Reports/gameList?status=OPEN" class="card card-link">
        <p>🟢 Game đang hoạt động</p>
        <h1><?= $openGames['total'] ?></h1>
    </a>

    <a href="<?= BASE_URL ?>/Reports/gameList?status=CLOSE" class="card card-link">
        <p>🔴 Game đóng</p>
        <h1><?= $closedGames['total'] ?></h1>
    </a>

</div>


<h3>Top game theo số vé bán</h3>

<canvas id="gameChart" height="120"></canvas>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
    window.gameLabels = <?= json_encode($labels) ?>;
    window.gameData   = <?= json_encode($data) ?>;
</script>

<script src="<?= BASE_URL ?>/public/Js/chart-game.js?v=<?= time() ?>"></script>

