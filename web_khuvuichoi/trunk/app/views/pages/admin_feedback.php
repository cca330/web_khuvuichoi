<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Quản lý phản hồi khách hàng</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/admin.css?v=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

</head>
<body>

<div class="layout">
  <!-- SIDEBAR -->
  <aside class="sidebar-menu">
    <h2 class="logo">🎡 Admin</h2>
    <ul class="menu">
      <li><a href="<?=BASE_URL?>/Reports">📄 Báo cáo thống kê</a></li>
      <li><a href="<?=BASE_URL?>/Games">🎮 Quản lý trò chơi</a></li>
      <li><a href="<?=BASE_URL?>/User">👤 Quản lý người dùng</a></li>
      <li><a href="<?=BASE_URL?>/Ticket">🎫 Quản lý vé</a></li>
      <li><a href="<?=BASE_URL?>/Feedback" class="active">💬 Đánh giá</a></li>
      <li><a href="<?=BASE_URL?>/Promotions">🎁 Quản lý khuyến mãi</a></li>
      <li><a href="<?=BASE_URL?>/login">🚪 Đăng xuất</a></li>
    </ul>
  </aside>

  <!-- MAIN CONTENT -->
  <main class="content">
    <div class="container">

      <h1>Quản lý phản hồi khách hàng</h1>
      <p class="subtitle">
        Theo dõi và phân tích đánh giá của khách hàng để nâng cao chất lượng dịch vụ.
      </p>

      <!-- Stats -->
      <div class="stats">
        <div class="card">
          <div>
            <p>Tổng đánh giá</p>
            <h2 id="totalReviews">0</h2>
          </div>
          <div class="icon blue"><i class="fa-regular fa-comment"></i></div>
        </div>

        <div class="card">
          <div>
            <p>Đánh giá trung bình</p>
            <h2 id="avgRating">0.0</h2>
          </div>
          <div class="icon yellow"><i class="fa-regular fa-star"></i></div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <h3><i class="fa-solid fa-sliders"></i> Lọc</h3>

        <div class="filter-grid">
          <div>
            <label>Đánh giá</label>
            <select id="ratingFilter">
              <option value="all">Tất cả đánh giá</option>
              <option value="5">★★★★★ 5 Stars</option>
              <option value="4">★★★★☆ 4 Stars</option>
              <option value="3">★★★☆☆ 3 Stars</option>
              <option value="2">★★☆☆☆ 2 Stars</option>
              <option value="1">★☆☆☆☆ 1 Star</option>
            </select>
          </div>
        </div>

        <!-- <div class="count">Showing <b>12</b> reviews</div> -->
      </div>

      <div id="feedbackList"></div>

    </div>
  </main>
</div>

<script src="public/Js/feedback.js?v=1.07"></script>
</body>

</html>