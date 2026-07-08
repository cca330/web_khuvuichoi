<div class="container">
  <div class="header">
    <div>
      <h1>Chi tiết khuyến mãi</h1>
      <p class="muted">Thông tin chi tiết và thống kê của mã khuyến mãi</p>
    </div>
  </div>

  <!-- CARD THÔNG TIN KHUYẾN MÃI -->
  <div class="promo-card">
    <div class="promo-header">
      <h2>🎁 Khuyến mãi</h2>
      <span class="badge <?= $promotion['status'] == 'ACTIVE' ? 'green' : 'red' ?>">
        <?= htmlspecialchars($promotion['status']) ?>
      </span>
    </div>

    <div class="promo-info-grid">
      <div>
        <span>Mã</span>
        <strong><?= htmlspecialchars($promotion['code']) ?></strong>
      </div>

      <div>
        <span>Giảm</span>
        <strong><?= htmlspecialchars($promotion['discount']) ?>%</strong>
      </div>

      <div>
        <span>Phạm vi áp dụng</span>
        <?php // FIX: thay $promotion['type'] (khong con ton tai) bang
              // $scopeNames (mang ten loai ve, do Controller truyen vao) ?>
        <strong>
          <?= !empty($scopeNames) ? htmlspecialchars(implode(', ', $scopeNames)) : 'Tất cả loại vé' ?>
        </strong>
      </div>

      <div>
        <span>Bắt đầu</span>
        <strong><?= date('d/m/Y', strtotime($promotion['start_date'])) ?></strong>
      </div>

      <div>
        <span>Kết thúc</span>
        <strong><?= date('d/m/Y', strtotime($promotion['end_date'])) ?></strong>
      </div>
    </div>
  </div>

  <!-- CARD HIỆU QUẢ -->
  <div class="promo-stats">
    <div class="stat-card">
      <span>Số lần sử dụng</span>
      <strong><?= $totalUsed ?? 0 ?></strong>
    </div>

    <div class="stat-card success">
      <span>Tổng tiền đã giảm</span>
      <strong><?= number_format($totalDiscount ?? 0) ?> VNĐ</strong>
    </div>
  </div>

  <!-- ACTION -->
  <div class="promo-actions">
    <a href="<?= BASE_URL ?>/Promotions/edit/<?= $promotion['id'] ?>" class="btn primary">✏️ Sửa</a>
    <a href="<?= BASE_URL ?>/Promotions" class="btn danger">⬅ Quay lại</a>
  </div>
</div>