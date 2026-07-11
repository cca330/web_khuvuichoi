<?php require_once __DIR__ . '/../../Layouts/header.php'; ?>

<h2 class="cart-title">🎫 Vé điện tử</h2>

<div class="ticket-container">
    <!-- ===== THÔNG BÁO THÀNH CÔNG ===== -->
    <div class="success-banner">
        <div class="success-icon">✅</div>
        <h3>Thanh toán thành công!</h3>
        <p>Cảm ơn bạn đã mua vé. Dưới đây là thông tin vé của bạn.</p>
    </div>

    <!-- ===== THÔNG TIN ĐƠN HÀNG ===== -->
    <div class="ticket-section">
        <h3>📋 Thông tin đơn hàng</h3>
        
        <div class="info-row">
            <label>Mã đơn hàng:</label>
            <span class="order-code">#<?= str_pad($order['id'], 6, '0', STR_PAD_LEFT) ?></span>
        </div>
        
        <div class="info-row">
            <label>Ngày mua:</label>
            <span><?= date('d/m/Y H:i', strtotime($order['paid_at'])) ?></span>
        </div>
        
        <div class="info-row">
            <label>Khách hàng:</label>
            <span><?= htmlspecialchars($customerInfo['customer_name']) ?></span>
        </div>
        
        <div class="info-row">
            <label>Số điện thoại:</label>
            <span><?= htmlspecialchars($customerInfo['customer_phone']) ?></span>
        </div>
        
        <div class="info-row">
            <label>Phương thức thanh toán:</label>
            <span><?= $paymentMethods[$customerInfo['payment_method']] ?? $customerInfo['payment_method'] ?></span>
        </div>
        
        <div class="info-row total-row">
            <label>Tổng thanh toán:</label>
            <span class="total-price"><?= number_format($customerInfo['total_price']) ?>đ</span>
        </div>
    </div>

    <!-- ===== DANH SÁCH VÉ ===== -->
    <div class="ticket-section">
        <h3>🎟️ Danh sách vé</h3>
        
        <?php foreach ($tickets as $ticket): ?>
        <div class="ticket-card">
            <div class="ticket-header">
                <div class="ticket-type">
                    <span class="badge <?= $ticket['is_combo'] ? 'badge-combo' : 'badge-single' ?>">
                        <?= $ticket['is_combo'] ? 'COMBO' : 'VÉ CỔNG' ?>
                    </span>
                </div>
                <div class="ticket-status status-<?= strtolower($ticket['status']) ?>">
                    <?= $ticket['status'] === 'ACTIVE' ? 'Chưa sử dụng' : ($ticket['status'] === 'EXPIRED' ? 'Hết hạn' : 'Đã hủy') ?>
                </div>
            </div>
            
            <div class="ticket-body">
                <h4><?= htmlspecialchars($ticket['gate_ticket_name']) ?></h4>
                
                <div class="ticket-details">
                    <div class="detail-item">
                        <span class="label">Mã vé:</span>
                        <span class="value ticket-code"><?= $ticket['ticket_code'] ?></span>
                    </div>
                    
                    <div class="detail-item">
                        <span class="label">Ngày sử dụng:</span>
                        <span class="value"><?= date('d/m/Y', strtotime($ticket['valid_date'])) ?></span>
                    </div>
                    
                    <div class="detail-item">
                        <span class="label">Số người:</span>
                        <span class="value">
                            <?= $ticket['admits_adult'] ?> NL + <?= $ticket['admits_child'] ?> TE
                        </span>
                    </div>
                </div>
                
                <div class="ticket-qr">
                    <div class="qr-placeholder">
                        <div class="qr-code">
                            <?php 
                            // Tạo QR code đơn giản bằng CSS (trong thực tế dùng thư viện QR)
                            $qrData = $ticket['ticket_code'];
                            ?>
                            <div class="qr-pattern">
                                <div class="qr-cell"></div>
                                <div class="qr-cell"></div>
                                <div class="qr-cell"></div>
                                <div class="qr-cell"></div>
                                <div class="qr-cell"></div>
                                <div class="qr-cell"></div>
                                <div class="qr-cell"></div>
                                <div class="qr-cell"></div>
                                <div class="qr-cell"></div>
                            </div>
                        </div>
                        <div class="qr-text"><?= $ticket['ticket_code'] ?></div>
                    </div>
                </div>
            </div>
        </div>
        <?php endforeach; ?>
    </div>

    <!-- ===== HƯỚNG DẪN ===== -->
    <div class="ticket-section guide-section">
        <h3>📌 Hướng dẫn sử dụng vé</h3>
        
        <ol class="guide-list">
            <li>Hiển thị mã QR hoặc mã vé này cho nhân viên tại cổng kiểm soát</li>
            <li>Nhân viên sẽ quét mã để xác thực vé</li>
            <li>Vé có thể quét nhiều lần trong ngày (vào/ra tự do)</li>
            <li>Vé chỉ có giá trị trong ngày ghi trên vé</li>
            <li>Vui lòng giữ vé an toàn, không chia sẻ mã vé cho người khác</li>
        </ol>
    </div>

    <!-- ===== NÚT HÀNH ĐỘNG ===== -->
    <div class="ticket-actions">
        <button class="btn btn-secondary" onclick="window.print()">
            🖨️ In vé
        </button>
        
        <button class="btn btn-add" onclick="window.location.href='<?= BASE_URL ?>/trangchu'">
            🏠 Về trang chủ
        </button>
        
        <button class="btn btn-secondary" onclick="window.location.href='<?= BASE_URL ?>/cart'">
            🛒 Mua thêm vé
        </button>
    </div>
</div>

<style>
.ticket-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.success-banner {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    margin-bottom: 30px;
}

.success-icon {
    font-size: 60px;
    margin-bottom: 15px;
}

.success-banner h3 {
    margin: 0 0 10px 0;
    font-size: 28px;
}

.ticket-section {
    background: white;
    padding: 25px;
    margin-bottom: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.ticket-section h3 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 20px;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 10px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
    border-bottom: none;
}

.info-row label {
    font-weight: bold;
    color: #666;
}

.info-row.total-row {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-top: 10px;
}

.total-price {
    font-size: 24px;
    font-weight: bold;
    color: #007bff;
}

.order-code {
    font-family: monospace;
    font-size: 18px;
    color: #007bff;
}

.ticket-card {
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    margin-bottom: 20px;
    overflow: hidden;
}

.ticket-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: #f8f9fa;
}

.badge {
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
}

.badge-combo {
    background: #ff6b6b;
    color: white;
}

.badge-single {
    background: #4ecdc4;
    color: white;
}

.ticket-status {
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
}

.status-active {
    background: #51cf66;
    color: white;
}

.status-expired {
    background: #ff6b6b;
    color: white;
}

.status-cancelled {
    background: #868e96;
    color: white;
}

.ticket-body {
    padding: 20px;
}

.ticket-body h4 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 18px;
}

.ticket-details {
    margin-bottom: 20px;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
}

.detail-item .label {
    color: #666;
}

.detail-item .value {
    font-weight: bold;
    color: #333;
}

.ticket-code {
    font-family: monospace;
    font-size: 16px;
    color: #007bff;
}

.ticket-qr {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.qr-placeholder {
    text-align: center;
}

.qr-code {
    width: 150px;
    height: 150px;
    background: white;
    border: 2px solid #333;
    padding: 10px;
    margin: 0 auto 10px;
}

.qr-pattern {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
    width: 100%;
    height: 100%;
}

.qr-cell {
    background: #333;
}

.qr-text {
    font-family: monospace;
    font-size: 14px;
    color: #666;
}

.guide-section {
    background: #fff3cd;
    border: 2px solid #ffc107;
}

.guide-list {
    margin: 0;
    padding-left: 20px;
}

.guide-list li {
    margin-bottom: 10px;
    line-height: 1.6;
}

.ticket-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 30px;
}

.ticket-actions .btn {
    padding: 12px 30px;
    font-size: 16px;
}

@media print {
    .ticket-actions {
        display: none;
    }
    
    .success-banner {
        background: #667eea !important;
        -webkit-print-color-adjust: exact;
    }
}
</style>
