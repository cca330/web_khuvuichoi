<?php
define(
    "BASE_URL",
    "http://" . $_SERVER['HTTP_HOST'] . rtrim(dirname($_SERVER['SCRIPT_NAME']), '/')
);
require_once __DIR__ . "/core/App.php";
require_once __DIR__ . "/core/Controller.php";
require_once __DIR__ . "/public/Classes/PHPExcel.php";
new App();
?>
