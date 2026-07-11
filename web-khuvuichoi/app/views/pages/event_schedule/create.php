<div class="container">
  <div class="header">
    <div>
      <h1>Thêm lịch trình mới</h1>
      <p class="muted">Thêm lịch trình cho sự kiện: <?= htmlspecialchars($event['title']) ?></p>
    </div>
  </div>

  <div class="game-form-box">
    <form method="post" action="<?= BASE_URL ?>/EventSchedule/store/<?= $event['id'] ?>" class="game-form">
      <label class="game-label">Thời gian</label>
      <input type="time" name="schedule_time" placeholder="Thời gian" class="game-input" required>

      <label class="game-label">Tiêu đề</label>
      <input type="text" name="title" placeholder="Nhập tiêu đề" class="game-input" required>

      <label class="game-label">Mô tả</label>
      <textarea name="description" placeholder="Nhập mô tả" class="game-input" rows="4"></textarea>

      <label class="game-label">Thứ tự</label>
      <input type="number" name="sort_order" placeholder="Thứ tự hiển thị" class="game-input" value="1" min="1">

      <div style="margin-top: 20px;">
        <button type="submit" class="btn primary">+ Lưu</button>
        <a href="<?= BASE_URL ?>/EventSchedule/index/<?= $event['id'] ?>" class="btn danger">Quay lại</a>
      </div>
    </form>
  </div>
</div>