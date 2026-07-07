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

    <?php foreach ($groupedItems as $group): ?>

    <tr class="cart-group-row">
        <td><span class="badge badge-gate">GATE</span></td>
        <td><?= htmlspecialchars($group['gate']['name']) ?></td>
        <td><?= $group['gate']['quantity'] ?></td>
        <td><?= number_format($group['gate']['price']) ?>đ</td>
        <td>
            <button class="btn btn-minus" onclick="updateQty(<?= $group['gate']['id'] ?>, 'minus')">−</button>
            <button class="btn btn-plus" onclick="updateQty(<?= $group['gate']['id'] ?>, 'plus')">+</button>
            <button class="btn btn-delete" onclick="deleteItem(<?= $group['gate']['id'] ?>)">❌</button>
        </td>
    </tr>

    <?php foreach ($group['games'] as $game): ?>
    <tr>
        <td><span class="badge badge-game">GAME</span></td>
        <td><?= htmlspecialchars($game['name']) ?></td>
        <td><?= $game['quantity'] ?></td>
        <td><?= number_format($game['price']) ?>đ</td>
        <td>
            <button class="btn btn-minus" onclick="updateQty(<?= $game['id'] ?>, 'minus')">−</button>
            <button class="btn btn-plus" onclick="updateQty(<?= $game['id'] ?>, 'plus')">+</button>
            <button class="btn btn-delete" onclick="deleteItem(<?= $game['id'] ?>)">❌</button>
        </td>
    </tr>
    <?php endforeach; ?>

    <tr>
    <td colspan="5">
        <select id="gameSelect_<?= $group['gate']['id'] ?>">
            <option value="">🎮 Chọn game</option>
            <?php foreach ($group['available_games'] as $g): ?>
                <option value="<?= $g['id'] ?>">
                    <?= htmlspecialchars($g['name']) ?> (<?= number_format($g['price']) ?>đ)
                </option>
            <?php endforeach; ?>
        </select>
        <button class="btn btn-add" onclick="addGame(<?= $order['id'] ?>, <?= $group['gate']['id'] ?>)">➕ Thêm game</button>
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
            <?= $p['code'] ?> (<?= $p['discount'] ?>% - <?= $p['type'] ?>)
        </option>
    <?php endforeach; ?>
</select>

<button class="btn btn-plus" onclick="applyPromo()">Áp dụng</button>
</div>

<!-- ===== THANH TOÁN ===== -->
<div class="cart-section cart-summary">
<h3>💰 Thanh toán</h3>

<p><b>Tạm tính:</b> <span id="totalPrice"><?= number_format($order['total_price']) ?>đ</span></p>
<p><b>Giảm giá:</b> <span id="discountTotal"><?= number_format($discountTotal) ?>đ</span></p>

<?php
    $finalTotal = max(0, $order['total_price'] - $discountTotal);
?>

<p class="total">
    Tổng thanh toán: <span id="finalTotal"><?= number_format($finalTotal) ?>đ</span>
</p>

<?php if ($finalTotal <= 0): ?>

    <button class="btn btn-secondary btn-lg" disabled
            title="Giỏ hàng đang trống">
        🚫 Không thể thanh toán
    </button>

    <p class="text-muted mt-2">
        Vui lòng thêm vé hoặc trò chơi để tiếp tục thanh toán
    </p>

<?php else: ?>

<button class="btn btn-add btn-lg" onclick="checkout()">
    🎉 Thanh toán
</button>

<?php endif; ?>

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

        for (let gateId in data.groupedItems) {
            let group = data.groupedItems[gateId];
            html += '<tr class="cart-group-row">' +
                '<td><span class="badge badge-gate">GATE</span></td>' +
                '<td>' + group.gate.name + '</td>' +
                '<td>' + group.gate.quantity + '</td>' +
                '<td>' + group.gate.price.toLocaleString() + 'đ</td>' +
                '<td>' +
                '<button class="btn btn-minus" onclick="updateQty(' + group.gate.id + ', \'minus\')">−</button> ' +
                '<button class="btn btn-plus" onclick="updateQty(' + group.gate.id + ', \'plus\')">+</button> ' +
                '<button class="btn btn-delete" onclick="deleteItem(' + group.gate.id + ')">❌</button>' +
                '</td></tr>';

            for (let i = 0; i < group.games.length; i++) {
                let game = group.games[i];
                html += '<tr>' +
                    '<td><span class="badge badge-game">GAME</span></td>' +
                    '<td>' + game.name + '</td>' +
                    '<td>' + game.quantity + '</td>' +
                    '<td>' + game.price.toLocaleString() + 'đ</td>' +
                    '<td>' +
                    '<button class="btn btn-minus" onclick="updateQty(' + game.id + ', \'minus\')">−</button> ' +
                    '<button class="btn btn-plus" onclick="updateQty(' + game.id + ', \'plus\')">+</button> ' +
                    '<button class="btn btn-delete" onclick="deleteItem(' + game.id + ')">❌</button>' +
                    '</td></tr>';
            }
        }
        html += '</table>';
    }

    document.getElementById('cartContent').innerHTML = html;
    document.getElementById('totalPrice').textContent = data.total_price.toLocaleString() + 'đ';
    document.getElementById('discountTotal').textContent = data.discount.toLocaleString() + 'đ';
    document.getElementById('finalTotal').textContent = data.final_total.toLocaleString() + 'đ';
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

function addGame(orderId, gateItemId) {
    const gameId = document.getElementById('gameSelect_' + gateItemId).value;
    if (!gameId) {
        alert('Vui lòng chọn game!');
        return;
    }

    $.ajax({
        url: BASE_URL + '/cart/addGame',
        type: 'POST',
        data: { order_id: orderId, gate_item_id: gateItemId, game_id: gameId },
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
    if (!confirm('Xóa item này?')) return;

    $.ajax({
        url: BASE_URL + '/cart/deleteItem',
        type: 'POST',
        data: { item_id: itemId },
        success: function() {
            reloadCart();
        }
    });
}

function applyPromo() {
    const promoCode = document.getElementById('promoCode').value;
    if (!promoCode) {
        alert('Vui lòng chọn mã giảm giá!');
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
    if (!confirm('Xác nhận thanh toán?')) return;

    $.ajax({
        url: BASE_URL + '/cart/checkout',
        type: 'POST',
        success: function() {
            alert('🎉 Thanh toán thành công!');
            reloadCart();
        },
        error: function() {
            alert('Có lỗi xảy ra!');
        }
    });
}
</script>
