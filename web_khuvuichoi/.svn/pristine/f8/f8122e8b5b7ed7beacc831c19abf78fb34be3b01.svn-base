<h2>Quản lý Khuyến mãi</h2>
<a href="<?=BASE_URL?>/promotions/create" class="btn">+ Thêm khuyến mãi</a>

<table>
<tr>
  <th>ID</th>
  <th>Mã</th>
  <th>Giảm (%)</th>
  <th>Thời gian</th>
  <th>Trạng thái</th>
  <th>Loại mã</th>
  <th>Hành động</th>
</tr>

<?php foreach ($data['promotions'] as $p): ?>
<tr>
  <td><?= $p['id'] ?></td>
  <td><?= $p['code'] ?></td>
  <td><?= $p['discount'] ?>%</td>
  <td><?= $p['start_date'] ?> → <?= $p['end_date'] ?></td>
  <td><?= $p['status'] ?></td>
  <td><?= $p['type'] ?></td>
  <td>
  <a class="btn" href="<?= BASE_URL ?>/Promotions/show/<?= $p['id'] ?>">👁 Chi tiết</a>
  <a class="btn" href="<?= BASE_URL ?>/Promotions/edit/<?= $p['id'] ?>">✏️ Sửa</a>
  <?php if($p['status']=='ACTIVE'): ?>
    <a class="btn danger"
       href="<?= BASE_URL ?>/Promotions/disable/<?= $p['id'] ?>"
       onclick="return confirm('Vô hiệu hóa khuyến mãi này?')">
       🔒 Vô hiệu hóa
    </a>
  <?php endif ?>
</td>
</tr>
<?php endforeach; ?>
</table>
