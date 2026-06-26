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
        <form method="post" action="?url=cart/addGate">
            <input type="hidden" name="order_id" value="<?= $order['id'] ?>">
            <input type="hidden" name="gate_id" value="<?= $gate['id'] ?>">
            <button class="btn btn-add" type="submit">➕ Thêm vé</button>
        </form>
    </td>
</tr>
<?php endforeach; ?>
</table>
</div>

<!-- ===== GIỎ HÀNG ===== -->
<div class="cart-section">
<h3>🧾 Vé trong giỏ</h3>

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
        <form method="post" action="?url=cart/updateQty" class="qty-form">
            <input type="hidden" name="item_id" value="<?= $group['gate']['id'] ?>">
            <button class="btn btn-minus" name="action" value="minus">−</button>
            <button class="btn btn-plus" name="action" value="plus">+</button>
        </form>

          <form method="post" action="?url=cart/deleteItem"
              onsubmit="return confirm('Xóa vé cổng này?')">
            <input type="hidden" name="item_id" value="<?= $group['gate']['id'] ?>">
            <button class="btn btn-delete" type="submit">❌</button>
        </form>
    </td>
</tr>

<?php foreach ($group['games'] as $game): ?>
<tr>
    <td><span class="badge badge-game">GAME</span></td>
    <td><?= htmlspecialchars($game['name']) ?></td>
    <td><?= $game['quantity'] ?></td>
    <td><?= number_format($game['price']) ?>đ</td>
    <td>
        <form method="post" action="?url=cart/updateQty" class="qty-form">
            <input type="hidden" name="item_id" value="<?= $game['id'] ?>">
            <button class="btn btn-minus" name="action" value="minus">−</button>
            <button class="btn btn-plus" name="action" value="plus">+</button>
        </form>

          <form method="post" action="?url=cart/deleteItem"
              onsubmit="return confirm('Xóa game này?')">
            <input type="hidden" name="item_id" value="<?= $game['id'] ?>">
            <button class="btn btn-delete" type="submit">❌</button>
        </form>
    </td>
</tr>
<?php endforeach; ?>

<tr>
<td colspan="5">
<form method="post" action="?url=cart/addGame">
    <input type="hidden" name="order_id" value="<?= $order['id'] ?>">
    <input type="hidden" name="gate_item_id" value="<?= $group['gate']['id'] ?>">

    <select name="game_id" required>
        <option value="">🎮 Chọn game</option>
        <?php foreach ($group['available_games'] as $g): ?>
            <option value="<?= $g['id'] ?>">
                <?= htmlspecialchars($g['name']) ?> (<?= number_format($g['price']) ?>đ)
            </option>
        <?php endforeach; ?>
    </select>

    <button class="btn btn-add" type="submit">➕ Thêm game</button>
</form>
</td>
</tr>

<?php endforeach; ?>
</table>
<?php endif; ?>
</div>

<!-- ===== MÃ GIẢM GIÁ ===== -->
<div class="cart-section">
<h3>🎁 Mã giảm giá</h3>

<?php if (!empty($_SESSION['promo_msg'])): ?>
<p><b><?= $_SESSION['promo_msg'] ?></b></p>
<?php unset($_SESSION['promo_msg']); endif; ?>

<form method="post" action="?url=cart/applyPromo">
    <input type="hidden" name="order_id" value="<?= $order['id'] ?>">

    <select name="promo_code">
        <option value="">🎟️ Chọn mã</option>
        <?php foreach ($promotions as $p): ?>
            <option value="<?= $p['code'] ?>">
                <?= $p['code'] ?> (<?= $p['discount'] ?>% - <?= $p['type'] ?>)
            </option>
        <?php endforeach; ?>
    </select>

    <button class="btn btn-plus" type="submit">Áp dụng</button>
</form>
</div>

<!-- ===== THANH TOÁN ===== -->
<div class="cart-section cart-summary">
<h3>💰 Thanh toán</h3>

<p><b>Tạm tính:</b> <?= number_format($order['total_price']) ?>đ</p>

<?php if ($discountTotal > 0): ?>
    <p><b>Giảm giá:</b> −<?= number_format($discountTotal) ?>đ</p>
<?php else: ?>
    <p><b>Giảm giá:</b> 0đ</p>
<?php endif; ?>

<?php
    $finalTotal = max(0, $order['total_price'] - $discountTotal);
?>

<p class="total">
    Tổng thanh toán: <?= number_format($finalTotal) ?>đ
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

<form method="post" action="?url=cart/checkout">
    <button class="btn btn-add" type="submit">
        🎉 Thanh toán
    </button>
</form>

<?php endif; ?>

</div>


