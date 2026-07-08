<div class="container">
  <div class="header">
    <div>
      <h1>Sửa khuyến mãi</h1>
      <p class="muted">Chỉnh sửa thông tin mã khuyến mãi</p>
    </div>
  </div>

  <div class="game-form-box">
    <form method="post"
          action="<?= BASE_URL ?>/Promotions/update/<?= $promotion['id'] ?>"
          class="game-form">

      <input type="text"
             name="code"
             value="<?= htmlspecialchars($promotion['code']) ?>"
             placeholder="Mã khuyến mãi"
             readonly>

      <input type="number"
             name="discount"
             value="<?= htmlspecialchars($promotion['discount']) ?>"
             placeholder="Giảm (%)"
             min="1"
             max="100"
             required>

      <input type="date"
             name="start_date"
             value="<?= htmlspecialchars($promotion['start_date']) ?>"
             required>

      <input type="date"
             name="end_date"
             value="<?= htmlspecialchars($promotion['end_date']) ?>"
             required>

      <select name="status" required>
        <option value="ACTIVE"
            <?= $promotion['status'] == 'ACTIVE' ? 'selected' : '' ?>>
            ACTIVE
        </option>
        <option value="EXPIRED"
            <?= $promotion['status'] == 'EXPIRED' ? 'selected' : '' ?>>
            EXPIRED
        </option>
      </select>

      <!-- FIX: thay select "type" (ALL/GAME - khong con hop le) bang
           checkbox chon tung loai ve cu the, tick san theo scope hien
           tai ($selectedScope do Controller truyen vao). -->
      <div style="grid-column:1/-1;">
        <label style="display:block; margin-bottom:8px; font-weight:500;">
          Phạm vi áp dụng (không chọn gì = áp dụng cho tất cả loại vé)
        </label>
        <div style="display:flex; flex-wrap:wrap; gap:12px;">
          <?php foreach ($gateTickets as $gt): ?>
            <label style="display:flex; align-items:center; gap:6px; font-weight:normal;">
              <input type="checkbox" name="gate_ticket_ids[]" value="<?= $gt['id'] ?>"
                <?= in_array($gt['id'], $selectedScope ?? []) ? 'checked' : '' ?>>
              <?= htmlspecialchars($gt['name']) ?>
              <?php if ($gt['is_combo']): ?><span class="badge blue">Combo</span><?php endif; ?>
            </label>
          <?php endforeach; ?>
        </div>
      </div>

      <button type="submit" class="btn primary">💾 Cập nhật</button>
      <a href="javascript:history.back()" class="btn danger">Quay lại</a>
    </form>
  </div>
</div>