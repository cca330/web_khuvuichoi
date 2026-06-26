<div class="page-wrapper">

    <div class="game-form-box">
        <h2 class="game-form-title">✏️ Sửa trò chơi</h2>

        <form method="post"
              enctype="multipart/form-data"
              action="<?= BASE_URL ?>/Games/update/<?= $game['id'] ?>"
              class="game-form">

            <input type="text"
                   name="name"
                   value="<?= $game['name'] ?>"
                   placeholder="Tên game"
                   class="game-input"
                   required>

            <textarea name="description"
                      placeholder="Mô tả"
                      class="game-input"><?= $game['description'] ?></textarea>

            <input type="number"
                   name="price"
                   value="<?= $game['price'] ?>"
                   placeholder="Giá"
                   class="game-input"
                   required>

            <input type="number"
                   name="recommended_age"
                   value="<?= $game['recommended_age'] ?>"
                   placeholder="Tuổi khuyến nghị"
                   class="game-input">

            <select name="allowed_ticket" class="game-input">
                <option value="ALL" <?= $game['allowed_ticket']=='ALL'?'selected':'' ?>>
                    Ai cũng chơi
                </option>
                <option value="ADULT" <?= $game['allowed_ticket']=='ADULT'?'selected':'' ?>>
                    Chỉ người lớn
                </option>
            </select>

            <select name="status" class="game-input">
                <option value="OPEN" <?= $game['status']=='OPEN'?'selected':'' ?>>
                    Mở
                </option>
                <option value="CLOSE" <?= $game['status']=='CLOSE'?'selected':'' ?>>
                    Đóng
                </option>
            </select>

            <?php if ($game['image']): ?>
                <div style="grid-column:1/-1; margin-bottom:10px;">
                    <img src="<?= BASE_URL ?>/public/uploads/<?= $game['image'] ?>"
                         width="120"
                         style="border-radius:8px;">
                </div>
            <?php endif ?>

            <input type="hidden" name="old_image" value="<?= $game['image'] ?>">

            <input type="file" name="image" class="game-input">

            <button type="submit" class="form-button">💾 Cập nhật</button>
            <a href="javascript:history.back()"
            class="form-button form-button-secondary">Quay lại
</a>


        </form>
    </div>

</div>
