<?php require_once __DIR__ . '/../../Layouts/header.php'; ?>

<h2 class="cart-title">💳 Thanh toán</h2>

<div class="checkout-container">
    <!-- ===== THÔNG TIN KHÁCH HÀNG ===== -->
    <div class="checkout-section">
        <h3>👤 Thông tin khách hàng</h3>
        
        <div class="form-group">
            <label>Họ tên:</label>
            <input type="text" id="customerName" value="<?= htmlspecialchars($_SESSION['username'] ?? '') ?>" class="form-control">
            <div id="errorName" class="error-message"></div>
        </div>
        
        <div class="form-group">
            <label>Số điện thoại:</label>
            <input type="tel" id="customerPhone" value="" class="form-control" placeholder="Nhập số điện thoại" pattern="[0-9]{10,11}" title="Số điện thoại phải là 10-11 chữ số" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
            <div id="errorPhone" class="error-message"></div>
        </div>
        
        <div class="form-group">
            <label>Email:</label>
            <input type="email" id="customerEmail" value="" class="form-control" placeholder="Nhập email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Email không đúng định dạng">
            <div id="errorEmail" class="error-message"></div>
        </div>
    </div>

    <!-- ===== DANH SÁCH ĐƠN HÀNG ===== -->
    <div class="checkout-section">
        <h3>🧾 Danh sách đơn hàng</h3>
        
        <table class="cart-table">
            <tr>
                <th>Tên vé</th>
                <th>SL</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
            </tr>
            
            <?php foreach ($groupedItems as $item): ?>
            <tr>
                <td>
                    <b><?= htmlspecialchars($item['ticket_name']) ?></b>
                    <?php if ($item['is_combo']): ?>
                        <small class="text-muted">(Combo: <?= $item['admits_adult'] ?> NL + <?= $item['admits_child'] ?> TE)</small>
                    <?php endif; ?>
                </td>
                <td><?= $item['quantity'] ?></td>
                <td><?= number_format($item['price']) ?>đ</td>
                <td><?= number_format($item['quantity'] * $item['price']) ?>đ</td>
            </tr>
            <?php endforeach; ?>
        </table>
    </div>

    

    <!-- ===== PHƯƠNG THỨC THANH TOÁN ===== -->
    <div class="checkout-section">
        <h3>💳 Phương thức thanh toán</h3>
        
        <div class="payment-methods">
            <label class="payment-method">
                <input type="radio" name="paymentMethod" value="vnpay" checked>
                <span class="payment-icon">🏦</span>
                <span>VNPay</span>
            </label>
            
            <label class="payment-method">
                <input type="radio" name="paymentMethod" value="momo">
                <span class="payment-icon">📱</span>
                <span>MoMo</span>
            </label>
            
            <label class="payment-method">
                <input type="radio" name="paymentMethod" value="zalopay">
                <span class="payment-icon">💙</span>
                <span>ZaloPay</span>
            </label>
            
            <label class="payment-method">
                <input type="radio" name="paymentMethod" value="bank">
                <span class="payment-icon">🏧</span>
                <span>Chuyển khoản</span>
            </label>
            
            <label class="payment-method">
                <input type="radio" name="paymentMethod" value="counter">
                <span class="payment-icon">🏪</span>
                <span>Thanh toán tại quầy</span>
            </label>
        </div>
    </div>

    <!-- ===== TỔNG TIỀN ===== -->
    <div class="checkout-section checkout-summary">
        <h3>💰 Tổng thanh toán</h3>
        
        <p><b>Tạm tính:</b> <span id="totalPrice"><?= number_format($order['total_price']) ?>đ</span></p>
        <p><b>Giảm giá:</b> <span id="discountTotal"><?= number_format($discountTotal) ?>đ</span></p>
        
        <?php
            $finalTotal = max(0, $order['total_price'] - $discountTotal);
        ?>
        
        <p class="total">
            Tổng thanh toán: <span id="finalTotal"><?= number_format($finalTotal) ?>đ</span>
        </p>
        
        <button class="btn btn-add btn-lg" onclick="processPayment()">
            ✅ Xác nhận thanh toán
        </button>
        
        <button class="btn btn-secondary btn-lg" onclick="window.location.href='<?= BASE_URL ?>/cart'">
            ← Quay lại giỏ hàng
        </button>
    </div>
</div>

<script>
const BASE_URL = '<?= BASE_URL ?>';
const ORDER_ID = <?= $order['id'] ?? 0 ?>;

function applyPromo() {
    const promoCode = document.getElementById('promoCode').value;
    if (!promoCode) {
        document.getElementById('alertModalBody').textContent = 'Vui lòng chọn mã giảm giá!';
        $('#alertModal').modal('show');
        return;
    }

    $.ajax({
        url: BASE_URL + '/cart/applyPromo',
        type: 'POST',
        data: { promo_code: promoCode },
        success: function(response) {
            const data = JSON.parse(response);
            if (data.error) {
                document.getElementById('promoMsg').textContent = data.error;
                document.getElementById('promoMsg').style.color = 'red';
            } else {
                document.getElementById('promoMsg').textContent = 'Áp mã thành công! Giảm: ' + data.discount.toLocaleString() + 'đ';
                document.getElementById('promoMsg').style.color = 'green';
                location.reload();
            }
        },
        error: function() {
            document.getElementById('alertModalBody').textContent = 'Có lỗi xảy ra!';
            $('#alertModal').modal('show');
        }
    });
}

function processPayment() {
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Xóa tất cả thông báo lỗi cũ
    document.getElementById('errorName').textContent = '';
    document.getElementById('errorName').style.display = 'none';
    document.getElementById('errorPhone').textContent = '';
    document.getElementById('errorPhone').style.display = 'none';
    document.getElementById('errorEmail').textContent = '';
    document.getElementById('errorEmail').style.display = 'none';
    
    let hasError = false;
    let firstErrorField = null;

    // Validate họ tên
    if (!customerName) {
        document.getElementById('errorName').textContent = 'Vui lòng nhập họ tên!';
        document.getElementById('errorName').style.display = 'block';
        hasError = true;
        if (!firstErrorField) firstErrorField = document.getElementById('customerName');
    }

    // Validate số điện thoại
    if (!customerPhone) {
        document.getElementById('errorPhone').textContent = 'Vui lòng nhập số điện thoại!';
        document.getElementById('errorPhone').style.display = 'block';
        hasError = true;
        if (!firstErrorField) firstErrorField = document.getElementById('customerPhone');
    } else {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(customerPhone)) {
            document.getElementById('errorPhone').textContent = 'Số điện thoại phải là 10-11 chữ số!';
            document.getElementById('errorPhone').style.display = 'block';
            hasError = true;
            if (!firstErrorField) firstErrorField = document.getElementById('customerPhone');
        }
    }

    // Validate email nếu có nhập
    if (customerEmail) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(customerEmail)) {
            document.getElementById('errorEmail').textContent = 'Email không đúng định dạng!';
            document.getElementById('errorEmail').style.display = 'block';
            hasError = true;
            if (!firstErrorField) firstErrorField = document.getElementById('customerEmail');
        }
    }

    // Nếu có lỗi, cuộn đến ô nhập đầu tiên bị lỗi
    if (hasError) {
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Hiển thị modal xác nhận thanh toán
    document.getElementById('confirmationModalBody').textContent = 'Xác nhận thanh toán ' + document.getElementById('finalTotal').textContent + '?';
    $('#confirmationModal').modal('show');
    
    // Xử lý khi người dùng bấm xác nhận
    document.getElementById('confirmPaymentBtn').onclick = function() {
        $('#confirmationModal').modal('hide');
        
        $.ajax({
            url: BASE_URL + '/cart/processPayment',
            type: 'POST',
            data: {
                order_id: ORDER_ID,
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_email: customerEmail,
                payment_method: paymentMethod
            },
            success: function(response) {
                const data = JSON.parse(response);
                if (data.success) {
                    window.location.href = BASE_URL + '/index.php?controller=UserTicket&action=showTicket&id=' + data.order_id;
                } else {
                    document.getElementById('alertModalBody').textContent = data.error || 'Thanh toán thất bại!';
                    $('#alertModal').modal('show');
                }
            },
            error: function() {
                document.getElementById('alertModalBody').textContent = 'Có lỗi xảy ra!';
                $('#alertModal').modal('show');
            }
        });
    };
}
</script>

<style>
.checkout-container {
    max-width: 800px;
    margin: 0 auto;
}

.checkout-section {
    background: white;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.checkout-section h3 {
    margin-bottom: 15px;
    color: #333;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.payment-methods {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
}

.payment-method {
    display: flex;
    align-items: center;
    padding: 15px;
    border: 2px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
}

.payment-method:hover {
    border-color: #007bff;
}

.payment-method input[type="radio"] {
    margin-right: 10px;
}

.payment-icon {
    font-size: 24px;
    margin-right: 10px;
}

.checkout-summary {
    background: #f8f9fa;
    border: 2px solid #007bff;
}

.checkout-summary .total {
    font-size: 24px;
    font-weight: bold;
    color: #007bff;
    margin: 20px 0;
}

.error-message {
    color: #dc3545;
    font-size: 13px;
    margin-top: 10px;
    display: none;
}
</style>

<!-- Bootstrap Modal for Confirmation -->
<div class="modal fade" id="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="confirmationModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="confirmationModalLabel">Xác nhận thanh toán</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="confirmationModalBody">
                <!-- Message will be inserted here -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
                <button type="button" class="btn btn-primary" id="confirmPaymentBtn">Xác nhận</button>
            </div>
        </div>
    </div>
</div>

<!-- Bootstrap Modal for Alerts -->
<div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-labelledby="alertModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="alertModalLabel">Thông báo</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="alertModalBody">
                <!-- Message will be inserted here -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Đóng</button>
            </div>
        </div>
    </div>
</div>
