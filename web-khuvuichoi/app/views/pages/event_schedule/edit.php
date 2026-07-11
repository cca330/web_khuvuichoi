<div class="container">
  <div class="header">
    <div>
      <h1>Sửa lịch trình</h1>
      <p class="muted">Sửa lịch trình của sự kiện: <?= htmlspecialchars($event['title']) ?></p>
    </div>
  </div>

  <div class="game-form-box">
    <form method="post" action="<?= BASE_URL ?>/EventSchedule/update/<?= $schedule['id'] ?>" class="game-form">
      <label class="game-label">Thời gian</label>
      <input type="time" name="schedule_time" placeholder="Thời gian" class="game-input" value="<?= $schedule['schedule_time'] ?>" required>

      <label class="game-label">Tiêu đề</label>
      <input type="text" name="title" placeholder="Nhập tiêu đề" class="game-input" value="<?= htmlspecialchars($schedule['title']) ?>" required>

      <label class="game-label">Mô tả</label>
      <textarea name="description" placeholder="Nhập mô tả" class="game-input" rows="4"><?= htmlspecialchars($schedule['description']) ?></textarea>

      <label class="game-label">Thứ tự</label>
      <input type="number" name="sort_order" placeholder="Thứ tự hiển thị" class="game-input" value="<?= $schedule['sort_order'] ?>" min="1">

      <div style="margin-top: 20px;">
        <button type="submit" class="btn primary">Cập nhật</button>
        <a href="<?= BASE_URL ?>/EventSchedule/index/<?= $event['id'] ?>" class="btn danger">Quay lại</a>
      </div>
    </form>
  </div>
</div>