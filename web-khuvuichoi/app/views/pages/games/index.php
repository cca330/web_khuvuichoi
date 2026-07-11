<div class="container">
  <div class="header">
    <div>
      <h1>Quản lý trò chơi</h1>
      <p class="muted">Danh sách tất cả trò chơi trong hệ thống</p>
    </div>
    <div class="top-buttons">
      <a href="<?= BASE_URL ?>/games/create" class="btn primary">+ Thêm game</a>
    </div>
  </div>

  <form method="GET" action="<?= BASE_URL ?>/Games/search" class="search-box">
    <i class='bx bx-search'></i>
    <input
      type="text"
      name="keyword"
      placeholder="Tìm theo tên game..."
      value="<?= htmlspecialchars($data['keyword'] ?? '') ?>"
    >
  </form>

  <div class="table-wrap admin-table">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Độ tuổi</th>
          <th>Loại vé</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($games as $game): ?>
        <tr>
          <td><?= $game['id'] ?></td>
          <td><?= htmlspecialchars($game['name']) ?></td>
          <td><?= $game['recommended_age'] ?>+</td>
          <td><?= $game['allowed_ticket'] ?></td>
          <td>
            <span class="badge <?= $game['status'] == 'OPEN' ? 'green' : 'red' ?>">
              <?= $game['status'] ?>
            </span>
          </td>
          <td>
            <a class="btn" href="<?= BASE_URL ?>/Games/show/<?= $game['id'] ?>">Chi tiết</a>
            <a class="btn" href="<?= BASE_URL ?>/Games/edit/<?= $game['id'] ?>">Sửa</a>
            <?php if ($game['status'] == 'OPEN'): ?>
              <a class="btn danger" href="<?= BASE_URL ?>/Games/close/<?= $game['id'] ?>">Đóng</a>
            <?php else: ?>
              <a class="btn success" href="<?= BASE_URL ?>/Games/open/<?= $game['id'] ?>">Mở</a>
            <?php endif; ?>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>