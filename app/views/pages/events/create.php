<div class="container">
  <div class="header">
    <div>
      <h1>Thêm sự kiện mới</h1>
      <p class="muted">Tạo sự kiện mới</p>
    </div>
  </div>

  <div class="game-form-box">
    <form method="post" action="<?= BASE_URL ?>/Events/store" class="game-form" enctype="multipart/form-data">
      <label class="game-label">Tiêu đề sự kiện</label>
      <input type="text" name="title" placeholder="Nhập tiêu đề sự kiện" class="game-input" required>

      <label class="game-label">Ảnh thumbnail</label>
      <input type="file" name="thumbnail" class="game-input" accept="image/*" required>

      <label class="game-label">Mô tả</label>
      <textarea name="description" placeholder="Nhập mô tả sự kiện" class="game-input" rows="4"></textarea>

      <label class="game-label">Địa điểm</label>
      <input type="text" name="location" placeholder="Nhập địa điểm" class="game-input">

      <label class="game-label">Thời gian bắt đầu</label>
      <input type="datetime-local" name="start_datetime" class="game-input" required>

      <label class="game-label">Thời gian kết thúc</label>
      <input type="datetime-local" name="end_datetime" class="game-input" required>

      <label class="game-label">Trạng thái</label>
      <select name="status" class="game-input" required>
        <option value="COMING_SOON">Sắp diễn ra</option>
        <option value="ONGOING">Đang diễn ra</option>
        <option value="FINISHED">Đã kết thúc</option>
        <option value="CANCELLED">Đã hủy</option>
      </select>

      <div style="margin-top: 20px;">
        <button type="submit" class="btn primary">+ Lưu sự kiện</button>
        <a href="<?= BASE_URL ?>/Events" class="btn danger">Quay lại</a>
      </div>
    </form>
  </div>
</div>