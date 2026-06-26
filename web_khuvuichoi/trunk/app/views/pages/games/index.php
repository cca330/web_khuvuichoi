<h2>Quản lý trò chơi</h2>
<a href="<?=BASE_URL?>/games/create" class="btn">+ Thêm game</a>
<form method="GET" action="<?= BASE_URL ?>/Games/search" class="filter">
    <input 
        type="text" 
        name="keyword" 
        placeholder="🔍 Tìm theo tên game..."
        value="<?= $data['keyword'] ?? '' ?>"
    >
    <button type="submit" class="btn">Tìm kiếm</button>
</form>

<table>
<tr>
    <th>ID</th>
    <th>Tên</th>
    <th>Giá</th>
    <th>Độ tuổi</th>
    <th>Loại vé</th>
    <th>Trạng thái</th>
    <th>Hành động</th>
</tr>

<?php foreach($games as $game): ?>
<tr>
    <td><?= $game['id'] ?></td>
    <td><?= $game['name'] ?></td>
    <td><?= number_format($game['price']) ?> đ</td>
    <td><?= $game['recommended_age'] ?>+</td>
    <td><?= $game['allowed_ticket'] ?></td>
    <td>
        <span class="<?= $game['status']=='OPEN'?'badge green':'badge red' ?>">
            <?= $game['status'] ?>
        </span>
    </td>
    <td>
        <a class="btn" href="<?= BASE_URL ?>/Games/show/<?= $game['id'] ?>">Chi tiết</a>
        <a class="btn" href="<?= BASE_URL ?>/Games/edit/<?= $game['id'] ?>">Sửa</a>

        <?php if($game['status']=='OPEN'): ?>
            <a class="btn danger" href="<?= BASE_URL ?>/Games/close/<?= $game['id'] ?>">Đóng</a>
        <?php else: ?>
            <a class="btn success" href="<?= BASE_URL ?>/Games/open/<?= $game['id'] ?>">Mở</a>
        <?php endif; ?>
    </td>
</tr>
<?php endforeach; ?>
</table>
