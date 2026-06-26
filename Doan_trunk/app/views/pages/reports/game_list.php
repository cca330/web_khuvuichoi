<?php include "tabs.php"; ?>

<h2>DANH SÁCH GAME <?= $status ? "($status)" : "" ?></h2>

<table>
<tr>
    <th>ID</th>
    <th>Tên game</th>
    <th>Trạng thái</th>
    <th>Giá</th>
    <th>Chi tiết</th>
</tr>

<?php foreach ($games as $g): ?>
<tr onclick="window.location='<?= BASE_URL ?>/Games/show/<?= $g['id'] ?>'">
    <td><?= $g['id'] ?></td>
    <td><?= $g['name'] ?></td>
    <td><?= $g['status'] ?></td>
    <td><?= number_format($g['price']) ?> đ</td>
    <td>➡️</td>
</tr>
<?php endforeach; ?>
</table>
