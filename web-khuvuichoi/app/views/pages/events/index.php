<div class="container">
  <div class="header">
    <div>
      <h1>Quản lý sự kiện</h1>
      <p class="muted">Danh sách tất cả sự kiện</p>
    </div>
    <div class="top-buttons">
      <a href="<?= BASE_URL ?>/Events/create" class="btn primary">+ Thêm sự kiện</a>
    </div>
  </div>

  <div class="table-wrap admin-table">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tiêu đề</th>
          <th>Địa điểm</th>
          <th>Thời gian bắt đầu</th>
          <th>Thời gian kết thúc</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($events as $event): ?>
          <tr>
            <td><?= $event['id'] ?></td>
            <td><?= htmlspecialchars($event['title']) ?></td>
            <td><?= htmlspecialchars($event['location']) ?></td>
            <td><?= $event['start_datetime'] ?></td>
            <td><?= $event['end_datetime'] ?></td>
            <td>
              <span class="badge 
                <?= $event['status'] == 'COMING_SOON' ? 'green' : 
                   ($event['status'] == 'ONGOING' ? 'blue' : 
                   ($event['status'] == 'FINISHED' ? 'gray' : 'red')) ?>">
                <?= $event['status'] ?>
              </span>
            </td>
            <td>
              <a class="btn" href="<?= BASE_URL ?>/Events/show/<?= $event['id'] ?>">Chi tiết</a>
              <a class="btn" href="<?= BASE_URL ?>/Events/edit/<?= $event['id'] ?>">Sửa</a>
              <a class="btn danger" href="<?= BASE_URL ?>/Events/delete/<?= $event['id'] ?>" 
                 onclick="return confirm('Bạn có chắc muốn xóa sự kiện này?')">Xóa</a>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>
