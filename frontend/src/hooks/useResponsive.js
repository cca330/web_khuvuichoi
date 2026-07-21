import { useState, useEffect } from "react";

// Khai báo các điểm ngắt (Breakpoints) chuẩn
const BREAKPOINTS = {
  isMobile: "(max-width: 575.98px)",
  isTablet: "(min-width: 576px) and (max-width: 991.98px)",
  isDesktop: "(min-width: 992px)",
};

export default function useResponsive() {
  const [screen, setScreen] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreen({
        isMobile: width < 576,
        isTablet: width >= 576 && width < 992,
        isDesktop: width >= 992,
        width: width,
      });
    };

    // Kiểm tra ngay khi khởi chạy
    handleResize();

    // Lắng nghe sự kiện thay đổi kích thước màn hình
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screen;
}
