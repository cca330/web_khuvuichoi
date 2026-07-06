<div class="container">
  <div class="header">
    <div>
      <h1>Quản lý phản hồi khách hàng</h1>
      <p class="muted">Theo dõi và phân tích đánh giá của khách hàng để nâng cao chất lượng dịch vụ.</p>
    </div>
  </div>

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

  <div class="filters">
    <h3><i class="fa-solid fa-sliders"></i> Lọc đánh giá</h3>
    <div class="filter-grid">
      <div>
        <label>Đánh giá sao</label>
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
  </div>

  <div id="feedbackList"></div>
</div>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<script src="<?= BASE_URL ?>/public/Js/feedback.js?v=1.07"></script>
