<div class="page-wrapper">
  <div class="game-form-box">
    <h2 class="game-form-title">🎁 Thêm mã khuyến mãi</h2>

    <form method="post"
          action="<?= BASE_URL ?>/Promotions/store"
          class="game-form">

      <input type="text"
             name="code"
             placeholder="Mã khuyến mãi"
             class="game-input"
             required>

      <input type="number"
             name="discount"
             placeholder="Giảm (%)"
             min="1"
             max="100"
             class="game-input"
             required>

      <input type="date"
             name="start_date"
             class="game-input"
             required>

      <input type="date"
             name="end_date"
             class="game-input"
             required>

      <select name="type" class="game-input" required>
        <option value="">-- Chọn loại khuyến mãi --</option>
        <option value="ALL">Giảm tất cả (ALL)</option>
        <option value="GAME">Chỉ giảm GAME</option>
      </select>

      <!-- Status mặc định ACTIVE -->
      <input type="hidden" name="status" value="ACTIVE">

      <button type="submit" class="form-button">💾 Lưu khuyến mãi</button>
      <a href="javascript:history.back()"
         class="form-button form-button-secondary">Quay lại</a>
    </form>
  </div>
</div>
