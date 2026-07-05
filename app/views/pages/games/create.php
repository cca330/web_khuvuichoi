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

            <div style="margin-top: 15px;">
                <label style="display: block; margin-bottom: 8px; color: #666; font-weight: 500;">📁 Chọn folder chứa ảnh hoặc chọn ảnh riêng:</label>
                <input type="file" id="imageInput" name="images[]" class="game-input" multiple webkitdirectory mozdirectory msdirectory odirectory directory>
                <small style="display: block; margin-top: 5px; color: #999;">Chọn 1 folder có nhiều ảnh hoặc chọn nhiều ảnh riêng lẻ</small>
            </div>

            <div id="filePreview" style="margin-top: 15px; display: none;">
                <label style="display: block; margin-bottom: 8px; color: #666; font-weight: 500;">📸 Ảnh đã chọn (<span id="fileCount">0</span>):</label>
                <div id="fileList" style="background: #f5f5f5; padding: 12px; border-radius: 6px; max-height: 200px; overflow-y: auto;">
                </div>
            </div>

            <button type="submit" class="form-button">➕ Thêm trò chơi</button>
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
