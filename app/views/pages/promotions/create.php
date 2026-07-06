<div class="container">
  <div class="header">
    <div>
      <h1>Thêm mã khuyến mãi</h1>
      <p class="muted">Tạo mã khuyến mãi mới cho hệ thống</p>
    </div>
  </div>

  <div class="game-form-box">
    <form method="post"
          action="<?= BASE_URL ?>/Promotions/store"
          class="game-form">

      <input type="text"
             name="code"
             placeholder="Mã khuyến mãi"
             required>

      <input type="number"
             name="discount"
             placeholder="Giảm (%)"
             min="1"
             max="100"
             required>

      <input type="date"
             name="start_date"
             required>

      <input type="date"
             name="end_date"
             required>

      <select name="type" required>
        <option value="">-- Chọn loại khuyến mãi --</option>
        <option value="ALL">Giảm tất cả (ALL)</option>
        <option value="GAME">Chỉ giảm GAME</option>
      </select>

      <!-- Status mặc định ACTIVE -->
      <input type="hidden" name="status" value="ACTIVE">

      <button type="submit" class="btn primary">💾 Lưu khuyến mãi</button>
      <a href="javascript:history.back()"
         class="btn danger">Quay lại</a>
    </form>
  </div>
</div>
