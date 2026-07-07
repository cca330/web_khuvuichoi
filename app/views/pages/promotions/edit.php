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
      <select name="type" required>
        <option value="ALL"
            <?= $promotion['type'] == 'ALL' ? 'selected' : '' ?>>
            Giảm tất cả (ALL)
        </option>
        <option value="GAME"
            <?= $promotion['type'] == 'GAME' ? 'selected' : '' ?>>
            Chỉ giảm GAME
        </option>
      </select>

      <button type="submit" class="btn primary">💾 Cập nhật</button>
      <a href="javascript:history.back()" class="btn danger">Quay lại</a>
    </form>
  </div>
</div>
