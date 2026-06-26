<div class="page-wrapper">

    <div class="game-form-box">
        <h2 class="game-form-title">🎮 Thêm trò chơi</h2>

        <form class="game-form" method="post" enctype="multipart/form-data"
              action="<?=BASE_URL?>/Games/store">

            <input type="text" name="name" placeholder="Tên game" class="game-input" required>

            <textarea name="description" placeholder="Mô tả" class="game-input"></textarea>

            <input type="number" name="price" placeholder="Giá trò chơi" class="game-input" required>

            <input type="number" name="recommended_age" placeholder="Tuổi khuyến nghị" value="0" class="game-input">

            <select name="allowed_ticket" class="game-input">
                <option value="ALL">Ai cũng chơi</option>
                <option value="ADULT">Chỉ người lớn</option>
            </select>

            <select name="status" class="game-input">
                <option value="OPEN" selected>Mở</option>
                <option value="CLOSE">Đóng</option>
            </select>


            <input type="file" name="image" class="game-input">

            <button class="form-button">➕ Thêm trò chơi</button>
            <a href="javascript:history.back()"
            class="form-button form-button-secondary">Quay lại
</a>

        </form>
    </div>

</div>
