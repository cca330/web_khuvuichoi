<?php
class App {
    protected $controller = "TrangchuController";
    protected $action = "index";


    function __construct() {
        $url = $this->processURL();
        $params = [];

        // ===== ƯU TIÊN MVC2 (query string) =====
        if (isset($_GET['controller'])) {
            $this->controller = ucfirst($_GET['controller']) . "Controller";
            $this->action     = $_GET['action'] ?? 'index';

            require_once __DIR__ . "/../app/controllers/" . $this->controller . ".php";
            $this->controller = new $this->controller;

        }
        // ===== MVC1 (base URL) =====
        else if (isset($_GET['url'])) {
            $url = explode("/", trim($_GET['url'], "/"));

            // Controller
            if (isset($url[0])) {
                $this->controller = ucfirst($url[0]) . "Controller";
                unset($url[0]);
            }

            // Kiểm tra file controller tồn tại không
            $controllerFile = __DIR__ . "/../app/controllers/" . $this->controller . ".php";
            if (file_exists($controllerFile)) {
                require_once $controllerFile;
                $this->controller = new $this->controller;
            } else {
                die("Controller {$this->controller} không tồn tại!");
            }

            // Action
            if (isset($url[1]) && method_exists($this->controller, $url[1])) {
                $this->action = $url[1];
                unset($url[1]);
            }

            $params = $url ? array_values($url) : [];
        }
        // ===== Default =====
        else {
            require_once __DIR__ . "/../app/controllers/" . $this->controller . ".php";
            $this->controller = new $this->controller;
        }

        // Gọi action với tham số
        call_user_func_array([$this->controller, $this->action], $params);
    }
    protected function processURL() {
        $arr = '';

        // Ưu tiên $_GET['url'] nếu có
        if (isset($_GET['url'])) {
            $arr = rtrim($_GET['url'], '/');
            $arr = explode('/', filter_var($arr, FILTER_SANITIZE_URL));
        } else {
            // Lấy URL sạch từ REQUEST_URI (hỗ trợ URL đẹp)
            $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            $scriptName = $_SERVER['SCRIPT_NAME'];
            $basePath = rtrim(dirname($scriptName), '/\\');
            $urlPath = trim(str_replace($basePath, '', $requestUri), '/');

            if ($urlPath === '' || $urlPath === 'web_khuvuichoi/' || $urlPath === 'doan/') {
                $urlPath = 'trangchu';
            }

            $arr = explode('/', $urlPath);
        }

        return $arr;
    }
}
