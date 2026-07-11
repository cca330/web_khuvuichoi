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

      <!-- FIX: thay select "type" (ALL/GAME - khong con hop le) bang
           checkbox chon tung loai ve cu the. Khong tick gi ca = ap
           dung cho TAT CA loai ve. -->
      <div style="grid-column:1/-1;">
        <label style="display:block; margin-bottom:8px; font-weight:500;">
          Phạm vi áp dụng (không chọn gì = áp dụng cho tất cả loại vé)
        </label>
        <div style="display:flex; flex-wrap:wrap; gap:12px;">
          <?php foreach ($gateTickets as $gt): ?>
            <label style="display:flex; align-items:center; gap:6px; font-weight:normal;">
              <input type="checkbox" name="gate_ticket_ids[]" value="<?= $gt['id'] ?>">
              <?= htmlspecialchars($gt['name']) ?>
              <?php if ($gt['is_combo']): ?><span class="badge blue">Combo</span><?php endif; ?>
            </label>
          <?php endforeach; ?>
        </div>
      </div>

      <!-- Status mặc định ACTIVE -->
      <input type="hidden" name="status" value="ACTIVE">

      <button type="submit" class="btn primary">💾 Lưu khuyến mãi</button>
      <a href="javascript:history.back()"
         class="btn danger">Quay lại</a>
    </form>
  </div>
</div>