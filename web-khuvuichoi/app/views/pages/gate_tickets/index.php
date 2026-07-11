<div class="container">
  <div class="header">
    <div>
      <h1>Quản lý loại vé cổng</h1>
      <p class="muted">Danh sách tất cả loại vé cổng</p>
    </div>
    <div class="top-buttons">
      <a href="<?= BASE_URL ?>/gate_tickets/create" class="btn primary">+ Thêm loại vé</a>
    </div>
  </div>

  <div class="table-wrap admin-table">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên vé</th>
          <th>Giá</th>
          <th>Mô tả</th>
          <th>Loại</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($gateTickets as $ticket): ?>
        <tr>
          <td><?= $ticket['id'] ?></td>
          <td><?= htmlspecialchars($ticket['name']) ?></td>
          <td><?= number_format($ticket['price']) ?> VNĐ</td>
          <td><?= htmlspecialchars($ticket['description']) ?></td>
          <td><?= $ticket['type'] ?></td>
          <td>
            <span class="badge <?= $ticket['status'] == 'ACTIVE' ? 'green' : 'red' ?>">
              <?= $ticket['status'] ?>
            </span>
          </td>
          <td>
            <a class="btn" href="<?= BASE_URL ?>/gate_tickets/edit/<?= $ticket['id'] ?>">Sửa</a>
            <a class="btn danger" href="<?= BASE_URL ?>/gate_tickets/delete/<?= $ticket['id'] ?>" onclick="return confirm('Bạn có chắc muốn xóa vé này?')">Xóa</a>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>
