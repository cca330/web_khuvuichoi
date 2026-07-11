<div class="container">
  <div class="header">
    <div>
      <h1>Quản lý vé</h1>
      <p class="muted">Quản lý và xác nhận tất cả vé trong hệ thống</p>
    </div>
  </div>

  <div class="stats">
    <div class="card blue">
      <span>Tổng số vé</span>
      <h2 id="totalTickets">0</h2>
    </div>
    <div class="card green">
      <span>Còn hiệu lực</span>
      <h2 id="unusedTickets">0</h2>
    </div>
    <div class="card gray">
      <span>Hết hạn / Đã hủy</span>
      <h2 id="usedTickets">0</h2>
    </div>
    <div class="card purple">
      <span>Tổng doanh thu vé</span>
      <h2 id="totalRevenue">0.00VNĐ</h2>
    </div>
  </div>

  <div class="filters filter-toolbar">
    <input type="text" id="searchInput" placeholder="Tìm theo mã vé...">
    <select id="statusSelect">
      <option value="">Tất cả trạng thái</option>
      <option value="ACTIVE">Còn hiệu lực</option>
      <option value="EXPIRED">Hết hạn</option>
      <option value="CANCELLED">Đã hủy</option>
    </select>
    <select id="typeSelect">
      <option value="">Tất cả loại</option>
      <option value="SINGLE">Vé đơn</option>
      <option value="COMBO">Combo</option>
    </select>
  </div>

  <div class="table-wrap admin-table">
    <table>
      <thead>
        <tr>
          <th>Mã vé</th>
          <th>Mã đơn hàng</th>
          <th>Loại</th>
          <th>Tên vé</th>
          <th>Giá vé</th>
          <th>Thời gian tạo</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody id="ticketTable"></tbody>
    </table>
  </div>

  <div class="pagination">
    <div class="page-rows">
      <label>Trang:</label>
      <span class="muted" id="showingCount"></span>
    </div>
    <div class="page-controls" id="paginationNumbers"></div>
  </div>
</div>

<script src="<?= BASE_URL ?>/public/Js/ticket.js"></script>
