<?php include "tabs.php"; ?>
<h2>👤 Người dùng đăng ký hôm nay</h2>
<p>Tổng user mới: <b><?= $userToday['total'] ?></b></p>

<table>
<tr>
    <th>ID</th>
    <th>Tên đăng nhập</th>
    <th>Email</th>
    <th>Thời gian</th>
</tr>

<?php foreach ($users as $u): ?>
<tr>
    <td><?= $u['id'] ?></td>
    <td><?= $u['username'] ?></td>
    <td><?= $u['email'] ?></td>
    <td><?= $u['created_at'] ?></td>
</tr>
<?php endforeach; ?>
</table>
