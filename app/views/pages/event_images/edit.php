<div class="container">
  <div class="header">
    <div>
      <h1>Sửa hình ảnh</h1>
      <p class="muted">Sửa hình ảnh của sự kiện: <?= htmlspecialchars($event['title']) ?></p>
    </div>
  </div>

  <div class="game-form-box">
    <form method="post" action="<?= BASE_URL ?>/EventImages/update/<?= $image['id'] ?>" class="game-form" enctype="multipart/form-data">
      <label class="game-label">Ảnh hiện tại</label>
      <div class="current-image">
        <img src="<?= htmlspecialchars($image['image']) ?>" alt="Current image" style="max-width: 250px; border-radius: 8px;">
      </div>

      <label class="game-label">Chọn ảnh mới (nếu muốn thay đổi)</label>
      <input type="file" name="image" class="game-input" accept="image/*">
      <p class="muted" style="font-size: 0.85rem; margin-top: -15px; margin-bottom: 20px;">Để trống nếu giữ nguyên ảnh cũ</p>

      <div style="margin-top: 20px;">
        <button type="submit" class="btn primary">Cập nhật</button>
        <a href="<?= BASE_URL ?>/EventImages/index/<?= $event['id'] ?>" class="btn danger">Quay lại</a>
      </div>
    </form>
  </div>
</div>