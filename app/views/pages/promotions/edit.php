<div class="page-wrapper">

    <div class="game-form-box">
        <h2 class="game-form-title">✏️ Sửa khuyến mãi</h2>

        <form method="post"
              action="<?= BASE_URL ?>/Promotions/update/<?= $promotion['id'] ?>"
              class="game-form">

            <input type="text"
                   name="code"
                   value="<?= $promotion['code'] ?>"
                   placeholder="Mã khuyến mãi"
                   class="game-input"
                   readonly>

            <input type="number"
                   name="discount"
                   value="<?= $promotion['discount'] ?>"
                   placeholder="Giảm (%)"
                   class="game-input"
                   min="1"
                   max="100"
                   required>

            <input type="date"
                   name="start_date"
                   value="<?= $promotion['start_date'] ?>"
                   class="game-input"
                   required>

            <input type="date"
                   name="end_date"
                   value="<?= $promotion['end_date'] ?>"
                   class="game-input"
                   required>

            <select name="status" class="game-input" required>
                <option value="ACTIVE"
                    <?= $promotion['status'] === 'ACTIVE' ? 'selected' : '' ?>>
                    ACTIVE
                </option>
                <option value="EXPIRED"
                    <?= $promotion['status'] === 'EXPIRED' ? 'selected' : '' ?>>
                    EXPIRED
                </option>
            </select>
            <select name="type" class="game-input" required>
                <option value="ALL"
                    <?= $promotion['type'] === 'ALL' ? 'selected' : '' ?>>
                    Giảm tất cả (ALL)
                </option>

                <option value="GAME"
                    <?= $promotion['type'] === 'GAME' ? 'selected' : '' ?>>
                    Chỉ giảm GAME
                </option>
            </select>

            <button type="submit" class="form-button">💾 Cập nhật</button>
            <a href="javascript:history.back()"
            class="form-button form-button-secondary">Quay lại
</a>


        </form>
    </div>

</div>
