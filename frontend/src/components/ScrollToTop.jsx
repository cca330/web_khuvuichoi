import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Tắt tính năng tự động khôi phục vị trí cuộn của trình duyệt
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // 2. Ép cuộn lên đỉnh đầu ngay lập tức mỗi khi đổi tuyến đường (pathname)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Hoặc "smooth" nếu bạn muốn cuộn mượt
    });
  }, [pathname]);

  return null; // Component này chỉ chạy logic, không render ra HTML
}
