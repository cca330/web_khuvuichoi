<div class="container">
  <div class="header">
    <div>
      <h1>Thêm hình ảnh mới</h1>
      <p class="muted">Thêm hình ảnh cho sự kiện: <?= htmlspecialchars($event['title']) ?></p>
    </div>
  </div>

  <div class="game-form-box">
    <form method="post" action="<?= BASE_URL ?>/EventImages/store/<?= $event['id'] ?>" class="game-form" enctype="multipart/form-data">
      <label class="game-label">Chọn nhiều ảnh từ máy (có thể chọn nhiều file)</label>
      <input type="file" name="images[]" class="game-input" multiple accept="image/*" required>
      <p class="muted" style="font-size: 0.85rem; margin-top: -15px; margin-bottom: 20px;">Định dạng: JPG, PNG, GIF, WEBP</p>

      <div style="margin-top: 20px;">
        <button type="submit" class="btn primary">+ Tải lên tất cả</button>
        <a href="<?= BASE_URL ?>/EventImages/index/<?= $event['id'] ?>" class="btn danger">Quay lại</a>
      </div>
    </form>
  </div>
</div>