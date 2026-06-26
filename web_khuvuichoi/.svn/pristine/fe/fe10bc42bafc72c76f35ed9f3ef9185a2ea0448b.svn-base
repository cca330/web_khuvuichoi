<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket Management</title>
  <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/admin.css?v=1.0">
</head>
<body>

<div class="layout">
  <!-- SIDEBAR MENU TRÁI -->
  <aside class="sidebar-menu">
    <h2 class="logo">🎡 Admin</h2>
    <ul class="menu">
        <li><a href="<?=BASE_URL?>/Reports">📄 Báo cáo thống kê</a></li>
        <li><a href="<?=BASE_URL?>/Games">🎮 Quản lý trò chơi</a></li>
        <li><a href="<?=BASE_URL?>/User">👤 Quản lý người dùng</a></li>
        <li><a href="<?=BASE_URL?>/Ticket">🎫 Quản lý vé</a></li>
        <li><a href="<?=BASE_URL?>/Feedback">💬 Đánh giá</a></li>
        <li><a href="<?=BASE_URL?>/Promotions">🎁 Quản lý khuyến mãi</a></li>
        <li><a href="<?=BASE_URL?>/login" >🚪 Đăng xuất</a></li>
    </ul>
  </aside>

  <!-- MAIN CONTENT -->
  <main class="content">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div>
          <h1>Quản lý vé</h1>
          <p>Quản lý và xác nhận tất cả vé trong hệ thống</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats">
        <div class="card blue">
          <span>Tổng số vé</span>
          <h2 id="totalTickets">0</h2>
        </div>
        <div class="card green">
          <span>Chưa sử dụng</span>
          <h2 id="unusedTickets">0</h2>
        </div>
        <div class="card gray">
          <span>Đã sử dụng</span>
          <h2 id="usedTickets">0</h2>
        </div>
        <div class="card purple">
          <span>Tổng doanh thu vé</span>
          <h2 id="totalRevenue">0.00VNĐ</h2>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <input type="text" id="searchInput" placeholder="Search by ticket code...">
        <select>
          <option value="">Tất cả trạng thái</option>
          <option value="UNUSED">Chưa sử dụng</option>
          <option value="USED">Đã sử dụng</option>
        </select>
        <select>
          <option value="">Tất cả loại</option>
          <option value="GATE">Vé cổng</option>
          <option value="GAME">Vé trò chơi</option>
        </select>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
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
          <tbody id="ticketTable">
            <tr>
              <td>TKT528249</td>
              <td>#1023</td>
              <td>GATE</td>
              <td>Adult Ticket</td>
              <td>$45.00</td>
              <td>16/12/2025 00:05</td>
              <td><span class="status used">Used</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <div class="page-rows">
          <label>Trang:</label>
          <span class="muted" id="showingCount"></span>
        </div>
        <div class="page-controls" id="paginationNumbers"></div>
      </div>

    </div>
  </main>
</div>

<script src="public/Js/ticket.js"></script>
</body>
</html>
