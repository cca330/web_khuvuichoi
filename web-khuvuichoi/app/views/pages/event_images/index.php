<div class="container">
  <div class="header">
    <div>
      <h1>Quản lý hình ảnh sự kiện</h1>
      <p class="muted">Danh sách hình ảnh của sự kiện: <?= htmlspecialchars($event['title']) ?></p>
    </div>
    <div class="top-buttons">
      <a href="<?= BASE_URL ?>/EventImages/create/<?= $event['id'] ?>" class="btn primary">+ Thêm hình ảnh</a>
      <a href="<?= BASE_URL ?>/Events" class="btn">Quay lại sự kiện</a>
    </div>
  </div>

  <div class="table-wrap admin-table">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Hình ảnh</th>
          <th>Link ảnh</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <?php if (!empty($images)): ?>
          <?php foreach ($images as $image): ?>
            <tr>
              <td><?= $image['id'] ?></td>
              <td>
                <img src="<?= htmlspecialchars($image['image']) ?>" alt="Event Image" style="width: 80px; height: 60px; object-fit: cover; border-radius: 4px;">
              </td>
              <td><?= htmlspecialchars($image['image']) ?></td>
              <td>
                <a class="btn" href="<?= BASE_URL ?>/EventImages/edit/<?= $image['id'] ?>">Sửa</a>
                <a class="btn danger" href="<?= BASE_URL ?>/EventImages/delete/<?= $image['id'] ?>"
                   onclick="return confirm('Bạn có chắc muốn xóa hình ảnh này?')">Xóa</a>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php else: ?>
          <tr>
            <td colspan="4" style="text-align: center; padding: 20px;">Chưa có hình ảnh nào</td>
          </tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>