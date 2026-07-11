<div class="container">
  <div class="header">
    <div>
      <h1>Sửa loại vé cổng</h1>
      <p class="muted">Cập nhật thông tin loại vé</p>
    </div>
  </div>

  <div class="game-form-box">
    <form method="post" action="<?= BASE_URL ?>/gate_tickets/update/<?= $ticket['id'] ?>" class="game-form">
      <input type="text" name="name" value="<?= htmlspecialchars($ticket['name']) ?>" placeholder="Tên vé" class="game-input" required>
      <input type="number" name="price" value="<?= htmlspecialchars($ticket['price']) ?>" placeholder="Giá vé" class="game-input" required min="0">
      <textarea name="description" placeholder="Mô tả" class="game-input" rows="4"><?= htmlspecialchars($ticket['description']) ?></textarea>
      <select name="status" class="game-input" required>
        <option value="ACTIVE" <?= $ticket['status'] == 'ACTIVE' ? 'selected' : '' ?>>Hoạt động</option>
        <option value="INACTIVE" <?= $ticket['status'] == 'INACTIVE' ? 'selected' : '' ?>>Không hoạt động</option>
      </select>
      <select name="type" class="game-input" required>
        <option value="ALL" <?= $ticket['type'] == 'ALL' ? 'selected' : '' ?>>Tất cả</option>
        <option value="CHILD" <?= $ticket['type'] == 'CHILD' ? 'selected' : '' ?>>Trẻ em</option>
        <option value="ADULT" <?= $ticket['type'] == 'ADULT' ? 'selected' : '' ?>>Người lớn</option>
      </select>

      <button type="submit" class="btn primary">💾 Cập nhật</button>
      <a href="javascript:history.back()" class="btn danger">Quay lại</a>
    </form>
  </div>
</div>
