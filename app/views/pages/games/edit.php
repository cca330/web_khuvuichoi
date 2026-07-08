<div class="page-wrapper">

    <div class="game-form-box">
        <h2 class="game-form-title">✏️ Sửa trò chơi</h2>

        <form method="post"
              enctype="multipart/form-data"
              action="<?= BASE_URL ?>/Games/update/<?= $game['id'] ?>"
              class="game-form">

            <input type="text"
                   name="name"
                   value="<?= htmlspecialchars($game['name']) ?>"
                   placeholder="Tên game"
                   class="game-input"
                   required>

            <textarea name="description"
                      placeholder="Mô tả"
                      class="game-input"><?= htmlspecialchars($game['description']) ?></textarea>

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

            <?php if (!empty($images)): ?>
                <div style="grid-column:1/-1; margin-bottom:10px;">
                    <label style="display: block; margin-bottom: 8px; color: #666; font-weight: 500;">📸 Ảnh hiện tại (<?= count($images) ?>):</label>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <?php foreach($images as $img): ?>
                            <img src="<?= BASE_URL ?>/public/uploads/<?= htmlspecialchars($img) ?>"
                                 width="100"
                                 height="100"
                                 style="border-radius:8px; object-fit:cover;">
                        <?php endforeach; ?>
                    </div>
                    <small style="display:block; margin-top:8px; color:#999;">
                        Nếu bạn chọn ảnh mới bên dưới, TOÀN BỘ ảnh hiện tại sẽ bị thay thế.
                    </small>
                </div>
            <?php else: ?>
                <div style="grid-column:1/-1; margin-bottom:10px;">
                    <p class="muted">Chưa có ảnh nào cho trò chơi này.</p>
                </div>
            <?php endif ?>

            <div style="margin-top: 15px;">
                <label style="display: block; margin-bottom: 8px; color: #666; font-weight: 500;">📁 Thêm ảnh mới (folder hoặc riêng lẻ):</label>
                <input type="file" id="imageInput" name="images[]" class="game-input" multiple webkitdirectory mozdirectory msdirectory odirectory directory>
                <small style="display: block; margin-top: 5px; color: #999;">Chọn 1 folder có nhiều ảnh hoặc chọn nhiều ảnh riêng lẻ</small>
            </div>

            <div id="filePreview" style="margin-top: 15px; display: none;">
                <label style="display: block; margin-bottom: 8px; color: #666; font-weight: 500;">📸 Ảnh mới được chọn (<span id="fileCount">0</span>):</label>
                <div id="fileList" style="background: #f5f5f5; padding: 12px; border-radius: 6px; max-height: 200px; overflow-y: auto;">
                </div>
            </div>

            <button type="submit" class="form-button">💾 Cập nhật</button>
            <a href="javascript:history.back()"
            class="form-button form-button-secondary">Quay lại
</a>


        </form>
    </div>

</div>

<script>
document.getElementById('imageInput').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name));
    
    const filePreviewDiv = document.getElementById('filePreview');
    const fileListDiv = document.getElementById('fileList');
    const fileCountSpan = document.getElementById('fileCount');
    
    fileCountSpan.textContent = imageFiles.length;
    
    if (imageFiles.length === 0) {
        filePreviewDiv.style.display = 'none';
        return;
    }
    
    filePreviewDiv.style.display = 'block';
    fileListDiv.innerHTML = '';
    
    imageFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const item = document.createElement('div');
            item.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-bottom: 8px; padding: 8px; background: white; border-radius: 4px;';
            
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.cssText = 'width: 40px; height: 40px; object-fit: cover; border-radius: 4px;';
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = file.name;
            nameSpan.style.cssText = 'flex: 1; font-size: 12px; color: #666;';
            
            item.appendChild(img);
            item.appendChild(nameSpan);
            fileListDiv.appendChild(item);
        };
        reader.readAsDataURL(file);
    });
});
</script>