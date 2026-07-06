<div class="container">
  <div class="header">
    <div>
      <h1>Doanh thu</h1>
      <p class="muted">Thống kê doanh thu theo tháng và loại vé</p>
    </div>
  </div>

  <!-- FILTERS -->
  <div class="filters filter-toolbar">
    <form method="get" style="display: flex; gap: 1rem; align-items: center;">
      <label>
        Năm:
        <select name="year" style="padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #ccc;">
          <?php foreach ($availableYears as $year): ?>
            <option value="<?= $year['year'] ?>" <?= $year['year'] == $selectedYear ? 'selected' : '' ?>><?= $year['year'] ?></option>
          <?php endforeach; ?>
        </select>
      </label>

      <label>
        Loại vé:
        <select name="type" style="padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #ccc;">
          <option value="total" <?= $selectedType == 'total' ? 'selected' : '' ?>>Tất cả</option>
          <option value="gate" <?= $selectedType == 'gate' ? 'selected' : '' ?>>Vé cổng</option>
          <option value="game" <?= $selectedType == 'game' ? 'selected' : '' ?>>Vé game</option>
        </select>
      </label>

      <button type="submit" class="btn">Lọc</button>
    </form>
  </div>

  <!-- CHART -->
  <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Biểu đồ doanh thu</h3>
  <canvas id="revenueChart" height="120"></canvas>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script>
    window.revenueLabels = <?= json_encode($labels) ?>;
    window.revenueData   = <?= json_encode($data) ?>;
  </script>
  <script src="<?= BASE_URL ?>/public/Js/chart-revenue.js"></script>

  <!-- TABLES -->
  <?php if ($selectedType == 'total' || $selectedType == 'gate'): ?>
    <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Doanh thu chi tiết vé cổng</h3>
    <div class="table-wrap admin-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên vé cổng</th>
            <th>Giá vé</th>
            <th>Số lượng vé bán</th>
            <th>Tổng doanh thu</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($gateDetails as $item): ?>
            <tr>
              <td><?= $item['id'] ?></td>
              <td><?= htmlspecialchars($item['name']) ?></td>
              <td><?= number_format($item['price']) ?> VNĐ</td>
              <td><?= $item['total_tickets'] ?></td>
              <td><?= number_format($item['revenue']) ?> VNĐ</td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  <?php endif; ?>

  <?php if ($selectedType == 'total' || $selectedType == 'game'): ?>
    <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Doanh thu chi tiết game</h3>
    <div class="table-wrap admin-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên game</th>
            <th>Giá vé</th>
            <th>Số lượng vé bán</th>
            <th>Tổng doanh thu</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($gameDetails as $item): ?>
            <tr>
              <td><?= $item['id'] ?></td>
              <td><?= htmlspecialchars($item['name']) ?></td>
              <td><?= number_format($item['price']) ?> VNĐ</td>
              <td><?= $item['total_tickets'] ?></td>
              <td><?= number_format($item['revenue']) ?> VNĐ</td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  <?php endif; ?>
</div>
