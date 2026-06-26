<?php require_once __DIR__ . '/../../Layouts/header.php'; ?>

<div class="invoice-wrapper">

    <div class="invoice-header">
        <h2>🧾 Chi tiết đơn hàng #<?= $order['id'] ?></h2>
        <p>Thanh toán lúc <?= date('d/m/Y H:i', strtotime($order['paid_at'])) ?></p>
    </div>

    <?php foreach ($groupedItems as $block): ?>
        <div class="gate-card">
            <div class="gate-title">
                🎟️ <?= htmlspecialchars($block['gate']['name']) ?>
            </div>

            <table class="invoice-table">
                <tr>
                    <th>Loại</th>
                    <th>Tên</th>
                    <th>SL</th>
                    <th>Giá</th>
                </tr>

                <tr>
                    <td><span class="badge badge-gate">GATE</span></td>
                    <td><?= htmlspecialchars($block['gate']['name']) ?></td>
                    <td><?= $block['gate']['quantity'] ?></td>
                    <td class="price"><?= number_format($block['gate']['price']) ?>đ</td>
                </tr>

                <?php foreach ($block['games'] as $game): ?>
                <tr>
                    <td><span class="badge badge-game">GAME</span></td>
                    <td class="ticket-indent">🎮 <?= htmlspecialchars($game['name']) ?></td>
                    <td><?= $game['quantity'] ?></td>
                    <td class="price"><?= number_format($game['price']) ?>đ</td>
                </tr>
                <?php endforeach; ?>
            </table>
        </div>
    <?php endforeach; ?>

    <div class="summary">
        <div class="summary-row">
            <span>Tạm tính</span>
            <span><?= number_format($order['total_price'] + $discount) ?>đ</span>
        </div>
        <div class="summary-row">
            <span>Giảm giá</span>
            <span class="discount-value">−<?= number_format($discount) ?>đ</span>
        </div>
        <div class="summary-row total">
            <span>Tổng thanh toán</span>
            <span><?= number_format($order['total_price']) ?>đ</span>
        </div>
    </div>

</div>


