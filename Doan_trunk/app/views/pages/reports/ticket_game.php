<?php include "tabs.php"; ?>

<h2>Vé Game - Danh sách game</h2>

<table>
    <tr>
        <th>Game</th>
        <th>Số vé bán</th>
        <th>Doanh thu</th>
    </tr>

    <?php foreach ($gameTickets as $g): ?>
    <tr onclick="window.location='<?= BASE_URL ?>/Reports/gameOrders/<?= $g['id'] ?>'">
        <td><?= $g['name'] ?></td>
        <td><?= $g['total_ticket'] ?></td>
        <td><?= number_format($g['revenue']) ?> đ</td>
    </tr>
    <?php endforeach; ?>
</table>
