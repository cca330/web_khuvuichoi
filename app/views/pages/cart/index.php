<?php require_once __DIR__ . '/../../Layouts/header.php'; ?>
<?php if (!empty($_SESSION['payment_success'])): ?>
<!-- ===== POPUP THANH TOÁN THÀNH CÔNG ===== -->
<div class="modal fade" id="paymentSuccessModal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content payment-success-box">
      <div class="modal-body text-center p-4">
        <div class="success-icon mb-3">🎉</div>
        <h4 class="mb-3">Thanh toán thành công</h4>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
        <button type="button" class="btn btn-success px-4" data-dismiss="modal">
            OK
        </button>
      </div>
    </div>
  </div>
</div>

<script>
    $(document).ready(function () {
        $('#paymentSuccessModal').modal('show');
    });
</script>
<?php unset($_SESSION['payment_success']); endif; ?>

<h2 class="cart-title">🛒 Giỏ hàng</h2>

<!-- ===== THÊM VÉ CỔNG ===== -->
<div class="cart-section">
<h3>🎫 Thêm vé cổng</h3>

<table class="cart-table">
<?php foreach ($gates as $gate): ?>
<tr>
    <td>
        <b><?= htmlspecialchars($gate['name']) ?></b><br>
        <small><?= number_format($gate['price']) ?>đ</small>
    </td>
    <td width="160">
        <button class="btn btn-add" onclick="addGate(<?= $gate['id'] ?>)">➕ Thêm vé</button>
    </td>
</tr>
<?php endforeach; ?>
</table>
</div>

<!-- ===== GIỎ HÀNG ===== -->
<div class="cart-section">
<h3>🧾 Vé trong giỏ</h3>

<div id="cartContent">
    <?php if ($order['total_price'] <= 0): ?>
        <p>Giỏ hàng trống</p>
    <?php else: ?>

    <table class="cart-table">
    <tr>
        <th>Loại</th>
        <th>Tên</th>
        <th>SL</th>
        <th>Giá</th>
        <th>Thao tác</th>
    </tr>

    <?php foreach ($groupedItems as $item): ?>
    <tr>
        <td><span class="badge badge-gate">VÉ</span></td>
        <td>
            <b><?= htmlspecialchars($item['ticket_name']) ?></b>
            <?php if ($item['is_combo']): ?>
                <small class="text-muted">(Combo: <?= $item['admits_adult'] ?> NL + <?= $item['admits_child'] ?> TE)</small>
            <?php endif; ?>
        </td>
        <td><?= $item['quantity'] ?></td>
        <td><?= number_format($item['price']) ?>đ</td>
        <td>
            <button class="btn btn-minus" onclick="updateQty(<?= $item['id'] ?>, 'minus')">−</button>
            <button class="btn btn-plus" onclick="updateQty(<?= $item['id'] ?>, 'plus')">+</button>
            <button class="btn btn-delete" onclick="deleteItem(<?= $item['id'] ?>)">❌</button>
        </td>
    </tr>
    <?php endforeach; ?>
    </table>
    <?php endif; ?>
</div>
</div>

<!-- ===== MÃ GIẢM GIÁ ===== -->
<div class="cart-section">
<h3>🎁 Mã giảm giá</h3>

<p id="promoMsg"></p>

<select id="promoCode">
    <option value="">🎟️ Chọn mã</option>
    <?php foreach ($promotions as $p): ?>
        <option value="<?= $p['code'] ?>">
            <?= $p['code'] ?> (<?= $p['discount'] ?>%<?= !empty($p['scope_names']) ? ' - ' . $p['scope_names'] : '' ?>)
        </option>
    <?php endforeach; ?>
</select>

<button class="btn btn-plus" onclick="applyPromo()">Áp dụng</button>
</div>

<!-- ===== THANH TOÁN ===== -->
<div class="cart-section cart-summary">
<h3>💰 Thanh toán</h3>

<div id="checkoutButton">
<?php
    $finalTotal = max(0, $order['total_price'] - $discountTotal);
?>

<?php if ($finalTotal <= 0): ?>

    <button class="btn btn-secondary btn-lg" disabled
            title="Giỏ hàng đang trống">
        🚫 Không thể thanh toán
    </button>

    <p class="text-muted mt-2">
        Vui lòng thêm vé để tiếp tục thanh toán
    </p>

<?php else: ?>

<button class="btn btn-add btn-lg" onclick="window.location.href='<?= BASE_URL ?>/cart/checkout'">
    🎉 Tiến hành thanh toán
</button>

<?php endif; ?>
</div>

</div>

<!-- ===== AJAX SCRIPTS ===== -->
<script>
const BASE_URL = '<?= BASE_URL ?>';

function reloadCart() {
    $.ajax({
        url: BASE_URL + '/cart/getCartData',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                updateCartDisplay(data);
            }
        }
    });
}

function updateCartDisplay(data) {
    let html = '';

    if (data.total_price <= 0) {
        html = '<p>Giỏ hàng trống</p>';
    } else {
        html = '<table class="cart-table"><tr><th>Loại</th><th>Tên</th><th>SL</th><th>Giá</th><th>Thao tác</th></tr>';

        data.groupedItems.forEach(function(item) {
            let comboInfo = item.is_combo ? ' <small class="text-muted">(Combo: ' + item.admits_adult + ' NL + ' + item.admits_child + ' TE)</small>' : '';
            html += '<tr>' +
                '<td><span class="badge badge-gate">VÉ</span></td>' +
                '<td><b>' + item.ticket_name + '</b>' + comboInfo + '</td>' +
                '<td>' + item.quantity + '</td>' +
                '<td>' + item.price.toLocaleString() + 'đ</td>' +
                '<td>' +
                '<button class="btn btn-minus" onclick="updateQty(' + item.id + ', \'minus\')">−</button> ' +
                '<button class="btn btn-plus" onclick="updateQty(' + item.id + ', \'plus\')">+</button> ' +
                '<button class="btn btn-delete" onclick="deleteItem(' + item.id + ')">❌</button>' +
                '</td></tr>';
        });
        html += '</table>';
    }

    document.getElementById('cartContent').innerHTML = html;

    // Update checkout button
    let checkoutHtml = '';
    if (data.final_total <= 0) {
        checkoutHtml = '<button class="btn btn-secondary btn-lg" disabled title="Giỏ hàng đang trống">🚫 Không thể thanh toán</button><p class="text-muted mt-2">Vui lòng thêm vé để tiếp tục thanh toán</p>';
    } else {
        checkoutHtml = '<button class="btn btn-add btn-lg" onclick="window.location.href=\'' + BASE_URL + '/cart/checkout\'">🎉 Tiến hành thanh toán</button>';
    }
    document.getElementById('checkoutButton').innerHTML = checkoutHtml;
}

function addGate(gateId) {
    $.ajax({
        url: BASE_URL + '/cart/addGate',
        type: 'POST',
        data: { gate_id: gateId },
        success: function() {
            reloadCart();
        }
    });
}


function updateQty(itemId, action) {
    $.ajax({
        url: BASE_URL + '/cart/updateQty',
        type: 'POST',
        data: { item_id: itemId, action: action },
        success: function() {
            reloadCart();
        }
    });
}

function deleteItem(itemId) {
    document.getElementById('confirmDeleteBody').textContent = 'Bạn có chắc muốn xóa vé này không?';
    $('#confirmDeleteModal').modal('show');
    
    document.getElementById('confirmDeleteBtn').onclick = function() {
        $('#confirmDeleteModal').modal('hide');
        
        $.ajax({
            url: BASE_URL + '/cart/deleteItem',
            type: 'POST',
            data: { item_id: itemId },
            success: function() {
                reloadCart();
            }
        });
    };
}

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
        success: function() {
            document.getElementById('promoMsg').textContent = 'Áp mã thành công!';
            reloadCart();
        }
    });
}

function checkout() {
    document.getElementById('confirmCheckoutBody').textContent = 'Xác nhận thanh toán?';
    $('#confirmCheckoutModal').modal('show');
    
    document.getElementById('confirmCheckoutBtn').onclick = function() {
        $('#confirmCheckoutModal').modal('hide');
        
        $.ajax({
            url: BASE_URL + '/cart/checkout',
            type: 'POST',
            success: function() {
                document.getElementById('alertModalBody').textContent = '🎉 Thanh toán thành công!';
                $('#alertModal').modal('show');
                reloadCart();
            },
            error: function() {
                document.getElementById('alertModalBody').textContent = 'Có lỗi xảy ra!';
                $('#alertModal').modal('show');
            }
        });
    };
}
</script>

<!-- Bootstrap Modal for Delete Confirmation -->
<div class="modal fade" id="confirmDeleteModal" tabindex="-1" role="dialog" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="confirmDeleteModalLabel">Xác nhận xóa</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="confirmDeleteBody">
                <!-- Message will be inserted here -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
                <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Xóa</button>
            </div>
        </div>
    </div>
</div>

<!-- Bootstrap Modal for Checkout Confirmation -->
<div class="modal fade" id="confirmCheckoutModal" tabindex="-1" role="dialog" aria-labelledby="confirmCheckoutModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="confirmCheckoutModalLabel">Xác nhận thanh toán</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="confirmCheckoutBody">
                <!-- Message will be inserted here -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
                <button type="button" class="btn btn-primary" id="confirmCheckoutBtn">Xác nhận</button>
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
