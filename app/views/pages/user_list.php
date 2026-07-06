<div class="container">
  <div class="header">
    <div>
      <h1>Danh sách tài khoản người dùng</h1>
      <p class="muted" id="customerCount"></p>
    </div>
  </div>

  <div class="search-box">
    <i class='bx bx-search'></i>
    <input placeholder="Tìm kiếm người dùng..." />
  </div>

  <div class="filters">
    <div class="filter-btn active" data-status="all">Tất cả</div>
    <div class="filter-btn" data-status="ACTIVE">Đang hoạt động</div>
    <div class="filter-btn" data-status="BLOCK">Khóa</div>
  </div>

  <div class="table-wrap admin-table">
    <table>
      <thead>
        <tr>
          <th>Tên tài khoản</th>
          <th>Mật khẩu</th>
          <th>Email</th>
          <th>Trạng thái</th>
          <th>Thời gian tạo</th>
        </tr>
      </thead>
      <tbody id="customerTableBody"></tbody>
    </table>
  </div>

  <div class="pagination">
    <div class="page-rows">
      <label>Hiển thị:</label>
      <span class="muted" id="showingCount"></span>
    </div>
    <div class="page-controls" id="paginationNumbers"></div>
  </div>
</div>

<div id="sidebar">
  <div class="detail-header">
    <h2>Chi tiết người dùng</h2>
  </div>

  <div class="detail-body">
    <h3 id="detailName"></h3>
    <p id="detailCode" class="muted"></p>

    <div class="detail-status-box">
      <span id="detailStatus" class="status-tag"></span>
    </div>

    <div class="detail-row">
      <i class='bx bx-envelope'></i>
      <p class="x" id="detailEmail"></p>
    </div>

    <div class="detail-row">
      <p class="x" id="detailStatus"></p>
    </div>

    <div class="detail-row">
      <i class='bx bx-location-plus'></i>
      <p class="x" id="detailCreated"></p>
    </div>
  </div>

  <div class="detail-thongso">
    <div class="stat-item">
      <i class='bx bx-cart'></i>
      <p>Transactions</p>
    </div>
    <div class="stat-item">
      <i class='bx bx-dollar'></i>
      <p>Total Spent</p>
    </div>
    <div class="stat-item">
      <i class='bx bx-timer'></i>
      <p>Last Activity</p>
    </div>
  </div>

  <div class="detail-footer">
    <button class="btnsecondary" id="btnOpenUser" type="button">
      <i class='bx bx-edit'></i> Mở tài khoản
    </button>
    <button class="btnremove" id="btnLockUser" type="button">
      Khóa tài khoản
    </button>
  </div>
</div>

<div id="overlay"></div>

<script src="<?= BASE_URL ?>/public/Js/user.js?v=1.06"></script>
