<div class="container">
  <div class="header">
    <div>
      <h1>Sửa sự kiện</h1>
      <p class="muted">Cập nhật thông tin sự kiện</p>
    </div>
  </div>

  <div class="game-form-box">
    <form method="post" action="<?= BASE_URL ?>/Events/update/<?= $event['id'] ?>" class="game-form" enctype="multipart/form-data">
      <label class="game-label">Tiêu đề sự kiện</label>
      <input type="text" name="title" value="<?= htmlspecialchars($event['title']) ?>" placeholder="Nhập tiêu đề sự kiện" class="game-input" required>

      <label class="game-label">Ảnh thumbnail hiện tại</label>
      <div class="current-image">
        <img src="<?= htmlspecialchars($event['thumbnail']) ?>" alt="Thumbnail" style="max-width: 250px; border-radius: 8px;">
      </div>

      <label class="game-label">Chọn ảnh thumbnail mới (nếu muốn thay đổi)</label>
      <input type="file" name="thumbnail" class="game-input" accept="image/*">

      <label class="game-label">Mô tả</label>
      <textarea name="description" placeholder="Nhập mô tả sự kiện" class="game-input" rows="4"><?= htmlspecialchars($event['description']) ?></textarea>

      <label class="game-label">Địa điểm</label>
      <input type="text" name="location" value="<?= htmlspecialchars($event['location']) ?>" placeholder="Nhập địa điểm" class="game-input">

      <label class="game-label">Thời gian bắt đầu</label>
      <input type="datetime-local" name="start_datetime" value="<?= date('Y-m-d\TH:i', strtotime($event['start_datetime'])) ?>" class="game-input" required>

      <label class="game-label">Thời gian kết thúc</label>
      <input type="datetime-local" name="end_datetime" value="<?= date('Y-m-d\TH:i', strtotime($event['end_datetime'])) ?>" class="game-input" required>

      <label class="game-label">Trạng thái</label>
      <select name="status" class="game-input" required>
        <option value="COMING_SOON" <?= $event['status'] == 'COMING_SOON' ? 'selected' : '' ?>>Sắp diễn ra</option>
        <option value="ONGOING" <?= $event['status'] == 'ONGOING' ? 'selected' : '' ?>>Đang diễn ra</option>
        <option value="FINISHED" <?= $event['status'] == 'FINISHED' ? 'selected' : '' ?>>Đã kết thúc</option>
        <option value="CANCELLED" <?= $event['status'] == 'CANCELLED' ? 'selected' : '' ?>>Đã hủy</option>
      </select>

      <div style="margin-top: 20px;">
        <button type="submit" class="btn primary">💾 Cập nhật</button>
        <a href="<?= BASE_URL ?>/Events" class="btn danger">Quay lại</a>
      </div>
    </form>
  </div>
</div>