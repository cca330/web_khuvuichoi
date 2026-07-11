<div class="container">
  <div class="header">
    <div>
      <h1>Quản lý lịch trình sự kiện</h1>
      <p class="muted">Danh sách lịch trình của sự kiện: <?= htmlspecialchars($event['title']) ?></p>
    </div>
    <div class="top-buttons">
      <a href="<?= BASE_URL ?>/EventSchedule/create/<?= $event['id'] ?>" class="btn primary">+ Thêm lịch trình</a>
      <a href="<?= BASE_URL ?>/Events" class="btn">Quay lại sự kiện</a>
    </div>
  </div>

  <div class="table-wrap admin-table">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Thời gian</th>
          <th>Tiêu đề</th>
          <th>Mô tả</th>
          <th>Thứ tự</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <?php if (!empty($schedules)): ?>
          <?php foreach ($schedules as $schedule): ?>
            <tr>
              <td><?= $schedule['id'] ?></td>
              <td><?= $schedule['schedule_time'] ?></td>
              <td><?= htmlspecialchars($schedule['title']) ?></td>
              <td><?= htmlspecialchars($schedule['description']) ?></td>
              <td><?= $schedule['sort_order'] ?></td>
              <td>
                <a class="btn" href="<?= BASE_URL ?>/EventSchedule/edit/<?= $schedule['id'] ?>">Sửa</a>
                <a class="btn danger" href="<?= BASE_URL ?>/EventSchedule/delete/<?= $schedule['id'] ?>"
                   onclick="return confirm('Bạn có chắc muốn xóa lịch trình này?')">Xóa</a>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php else: ?>
          <tr>
            <td colspan="6" style="text-align: center; padding: 20px;">Chưa có lịch trình nào</td>
          </tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>