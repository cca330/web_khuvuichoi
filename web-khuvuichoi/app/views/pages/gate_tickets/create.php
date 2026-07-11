<div class="container">
  <div class="header">
    <div>
      <h1>Thêm loại vé cổng</h1>
      <p class="muted">Tạo loại vé cổng mới</p>
    </div>
  </div>

  <div class="game-form-box">
    <form method="post" action="<?= BASE_URL ?>/gate_tickets/store" class="game-form">
      <input type="text" name="name" placeholder="Tên vé" class="game-input" required>
      <input type="number" name="price" placeholder="Giá vé" class="game-input" required min="0">
      <textarea name="description" placeholder="Mô tả" class="game-input" rows="4"></textarea>
      <select name="status" class="game-input" required>
        <option value="ACTIVE" selected>Hoạt động</option>
        <option value="INACTIVE">Không hoạt động</option>
      </select>
      <select name="type" class="game-input" required>
        <option value="ALL" selected>Tất cả</option>
        <option value="CHILD">Trẻ em</option>
        <option value="ADULT">Người lớn</option>
      </select>

      <button type="submit" class="btn primary">+ Lưu</button>
      <a href="javascript:history.back()" class="btn danger">Quay lại</a>
    </form>
  </div>
</div>
