<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MVC</title>
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/Style.css?v=1.6">
    <?php if (empty($hideSidebar)): ?>
        <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/admin.css?v=1.0">
    <?php endif; ?>

    <?php if (!empty($useFormCss)): ?>
        <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/forms.css">
    <?php endif; ?>
    <?php if (!empty($login)): ?>
        <link rel="stylesheet" href="<?= BASE_URL ?>/public/Css/login.css">
    <?php endif; ?>

</head>
<body class="<?= !empty($login) ? 'login-page' : '' ?><?= empty($hideSidebar) ? ' admin-page' : '' ?>">

<div class="layout">

    <!-- SIDEBAR -->
<?php if (empty($hideSidebar)): ?>
    <?php require_once __DIR__ . "/components/sidebar.php"; ?>
<?php endif; ?>

    <!-- MAIN CONTENT -->
    <main class="content">
        <?php
if (isset($page)) {
    require_once __DIR__ . "/pages/" . $page . ".php";
} else {
    echo "<h3>Lỗi: page chưa được truyền từ Controller</h3>";
}
?>
    </main>

</div>

</body>
</html>
