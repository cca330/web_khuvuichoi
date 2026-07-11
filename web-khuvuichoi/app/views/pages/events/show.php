<div class="container">
  <div class="header">
    <div>
      <h1>Chi tiết sự kiện</h1>
      <p class="muted"><?= htmlspecialchars($event['title']) ?></p>
    </div>
  </div>

  <div class="promo-card">
    <div class="promo-header">
      <h2><?= htmlspecialchars($event['title']) ?></h2>
      <span class="badge 
        <?= $event['status'] == 'COMING_SOON' ? 'green' : 
           ($event['status'] == 'ONGOING' ? 'blue' : 
           ($event['status'] == 'FINISHED' ? 'gray' : 'red')) ?>">
        <?= $event['status'] ?>
      </span>
    </div>
    <div class="promo-info-grid">
      <div>
        <span>Địa điểm</span>
        <strong><?= htmlspecialchars($event['location']) ?></strong>
      </div>
      <div>
        <span>Thời gian bắt đầu</span>
        <strong><?= $event['start_datetime'] ?></strong>
      </div>
      <div>
        <span>Thời gian kết thúc</span>
        <strong><?= $event['end_datetime'] ?></strong>
      </div>
    </div>
    <p style="margin-top: 1rem;"><?= htmlspecialchars($event['description']) ?></p>
    <div style="margin-top: 1rem;">
      <img src="<?= htmlspecialchars($event['thumbnail']) ?>" 
           alt="<?= htmlspecialchars($event['title']) ?>" 
           style="max-width: 100%; border-radius: 0.5rem;">
    </div>
  </div>

  <!-- Ảnh sự kiện -->
  <div class="header" style="margin-top: 2rem;">
    <div>
      <h3>Ảnh sự kiện</h3>
    </div>
    <div class="top-buttons">
      <a href="<?= BASE_URL ?>/EventImages/create/<?= $event['id'] ?>" class="btn primary">+ Thêm ảnh</a>
      <a href="<?= BASE_URL ?>/EventImages/index/<?= $event['id'] ?>" class="btn">Xem tất cả</a>
    </div>
  </div>
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
    <?php foreach ($images as $image): ?>
      <div style="border: 1px solid #e2e8f0; border-radius: 0.5rem; overflow: hidden;">
        <img src="<?= htmlspecialchars($image['image']) ?>" 
             style="width: 100%; height: 150px; object-fit: cover;">
      </div>
    <?php endforeach; ?>
  </div>

  <!-- Lịch trình -->
  <div class="header" style="margin-top: 2rem;">
    <div>
      <h3>Lịch trình</h3>
    </div>
    <div class="top-buttons">
      <a href="<?= BASE_URL ?>/EventSchedule/create/<?= $event['id'] ?>" class="btn primary">+ Thêm lịch trình</a>
      <a href="<?= BASE_URL ?>/EventSchedule/index/<?= $event['id'] ?>" class="btn">Xem tất cả</a>
    </div>
  </div>
  <div class="table-wrap admin-table">
    <table>
      <thead>
        <tr>
          <th>Thời gian</th>
          <th>Tiêu đề</th>
          <th>Mô tả</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($schedules as $schedule): ?>
          <tr>
            <td><?= $schedule['schedule_time'] ?></td>
            <td><?= htmlspecialchars($schedule['title']) ?></td>
            <td><?= htmlspecialchars($schedule['description']) ?></td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>

  <div class="promo-actions">
    <a href="<?= BASE_URL ?>/Events/edit/<?= $event['id'] ?>" class="btn primary">✏️ Sửa</a>
    <a href="<?= BASE_URL ?>/Events" class="btn danger">← Quay lại</a>
  </div>
</div>
