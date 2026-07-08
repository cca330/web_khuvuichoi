<div class="container">
  <div class="header">
    <div>
      <h1>Quản lý khuyến mãi</h1>
      <p class="muted">Danh sách tất cả mã khuyến mãi trong hệ thống</p>
    </div>
    <div class="top-buttons">
      <a href="<?=BASE_URL?>/promotions/create" class="btn primary">+ Thêm khuyến mãi</a>
    </div>
  </div>

  <div class="table-wrap admin-table">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Mã</th>
          <th>Giảm (%)</th>
          <th>Thời gian</th>
          <th>Trạng thái</th>
          <th>Phạm vi áp dụng</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($promotions as $p): ?>
        <tr>
          <td><?= $p['id'] ?></td>
          <td><?= htmlspecialchars($p['code']) ?></td>
          <td><?= $p['discount'] ?>%</td>
          <td><?= htmlspecialchars($p['start_date']) ?> → <?= htmlspecialchars($p['end_date']) ?></td>
          <td>
            <span class="badge <?= $p['status'] == 'ACTIVE' ? 'green' : 'red' ?>">
              <?= htmlspecialchars($p['status']) ?>
            </span>
          </td>
          <td>
            <?php // FIX: doi tu $p['type'] (khong con ton tai) sang
                  // scope_names duoc GROUP_CONCAT san trong getAll() ?>
            <?php if (!empty($p['scope_names'])): ?>
              <span class="badge blue"><?= htmlspecialchars($p['scope_names']) ?></span>
            <?php else: ?>
              <span class="badge grey">Tất cả loại vé</span>
            <?php endif; ?>
          </td>
          <td>
            <a class="btn" href="<?= BASE_URL ?>/Promotions/show/<?= $p['id'] ?>">Chi tiết</a>
            <a class="btn" href="<?= BASE_URL ?>/Promotions/edit/<?= $p['id'] ?>">Sửa</a>
            <?php if($p['status']=='ACTIVE'): ?>
              <a class="btn danger"
                 href="<?= BASE_URL ?>/Promotions/disable/<?= $p['id'] ?>"
                 onclick="return confirm('Vô hiệu hóa khuyến mãi này?')">
                 Vô hiệu hóa
              </a>
            <?php endif; ?>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>