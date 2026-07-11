<h2>Chi tiết trò chơi</h2>

<div class="card">
    <?php if (!empty($images)): ?>
    <div class="game-carousel">
        <?php foreach ($images as $i => $img): ?>
            <img
                src="<?= BASE_URL ?>/public/uploads/<?= htmlspecialchars($img) ?>"
                alt="<?= htmlspecialchars($game['name']) ?>"
                class="carousel-slide <?= $i === 0 ? 'active' : '' ?>"
            >
        <?php endforeach; ?>
    </div>
    <?php else: ?>
        <p class="muted">Chưa có ảnh cho trò chơi này.</p>
    <?php endif; ?>

    <h3><?= htmlspecialchars($game['name']) ?></h3>
    <p><?= nl2br(htmlspecialchars($game['description'])) ?></p>
    <p>Độ tuổi: <?= (int)$game['recommended_age'] ?>+</p>
    <p>Loại vé được vào chơi: <?= htmlspecialchars($game['allowed_ticket']) ?></p>
    <p>Trạng thái:
        <span class="badge <?= $game['status'] == 'OPEN' ? 'green' : 'red' ?>">
            <?= $game['status'] ?>
        </span>
    </p>
</div>

<h3>Thống kê đánh giá</h3>
<div class="stats">
    <div class="stat-card">💬 Số lượt đánh giá: <?= (int)($stats['total_feedbacks'] ?? 0) ?></div>
    <div class="stat-card">⭐ Điểm trung bình: <?= $stats['avg_rating'] !== null ? $stats['avg_rating'] : '—' ?>/5</div>
</div>

<h3>Đánh giá của khách</h3>
<?php if (!empty($feedbacks)): ?>
    <div class="feedback-list">
        <?php foreach ($feedbacks as $fb): ?>
            <div class="feedback-item">
                <b><?= htmlspecialchars($fb['username']) ?></b>
                — <?= str_repeat('⭐', (int)$fb['rating']) ?>
                <p><?= htmlspecialchars($fb['content']) ?></p>
                <small class="muted"><?= $fb['created_at'] ?></small>
            </div>
        <?php endforeach; ?>
    </div>
<?php else: ?>
    <p class="muted">Chưa có đánh giá nào.</p>
<?php endif; ?>

<a href="javascript:history.back()" class="btn">← Quay lại</a>