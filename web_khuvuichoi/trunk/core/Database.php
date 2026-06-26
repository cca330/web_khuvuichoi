<?php
class Database {
    protected $pdo;
    private static $sharedPdo = null;

    public function __construct() {
        $this->pdo = self::getConnection();
    }

    public function getPDO() {
        return $this->pdo;
    }

    public static function getConnection() {
        if (self::$sharedPdo === null) {
            self::$sharedPdo = new PDO(
    "mysql:host=db;dbname=dbweb;charset=utf8",
    "root",
    "123456"
);
            self::$sharedPdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$sharedPdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        }

        return self::$sharedPdo;
    }
}
