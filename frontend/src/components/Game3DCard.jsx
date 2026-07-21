import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function Game3DCard({ game }) {
  const cardRef = useRef(null);
  const target = useRef({ x: 0, y: 0, glowX: 50, glowY: 50 });
  const [isMobile, setIsMobile] = useState(false);

  // State quản lý chỉ số ảnh hiện tại (Slideshow)
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const [transformState, setTransformState] = useState({
    x: 0,
    y: 0,
    glowX: 50,
    glowY: 50,
  });

  // 🔄 LOGIC ĐỔI ẢNH TỰ ĐỘNG SAU MỖI 3 GIÂY
  useEffect(() => {
    // Chỉ chạy nếu game có từ 2 ảnh trở lên
    if (game?.images && game.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImgIndex((prevIndex) => (prevIndex + 1) % game.images.length);
      }, 3000); // Đổi ảnh sau mỗi 3 giây (3000ms)

      return () => clearInterval(interval);
    }
  }, [game]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let rafId;
    let state = { x: 0, y: 0, glowX: 50, glowY: 50 };

    const animate = () => {
      state = {
        x: state.x + (target.current.x - state.x) * 0.1,
        y: state.y + (target.current.y - state.y) * 0.1,
        glowX: state.glowX + (target.current.glowX - state.glowX) * 0.1,
        glowY: state.glowY + (target.current.glowY - state.glowY) * 0.1,
      };

      setTransformState(state);
      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const handlePointerMove = (event) => {
    if (isMobile || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    target.current = {
      x: clamp((0.5 - py) * 20, -12, 12),
      y: clamp((px - 0.5) * 24, -14, 14),
      glowX: clamp(px * 100, 10, 90),
      glowY: clamp(py * 100, 10, 90),
    };
  };

  const resetPointer = () => {
    target.current = { x: 0, y: 0, glowX: 50, glowY: 50 };
  };

  const cardStyle = {
    transform: isMobile
      ? "none"
      : `rotateX(${transformState.x}deg) rotateY(${transformState.y}deg) translateY(-2px)`,
    "--glow-x": `${transformState.glowX}%`,
    "--glow-y": `${transformState.glowY}%`,
  };

  // Lấy danh sách ảnh hoặc dùng ảnh mặc định
  const imagesList =
    game?.images && game.images.length > 0
      ? game.images
      : [{ image: "/img/default-game.jpg" }];

  return (
    <div
      className="game-3d-wrapper"
      ref={cardRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={resetPointer}
      onBlur={resetPointer}
    >
      <div className="game-3d-card" style={cardStyle}>
        <div className="game-3d-glow" />

        {/* Khung ảnh có hiệu ứng đổi ảnh mượt mà */}
        <div className="game-3d-img-container">
          {imagesList.map((imgObj, index) => (
            <img
              key={index}
              className={`game-3d-img ${index === currentImgIndex ? "active" : ""}`}
              src={getImageUrl(imgObj.image || imgObj)}
              alt={game.name}
            />
          ))}

          <span className="game-3d-badge">{game.category || "TRÒ CHƠI"}</span>

          {/* Dấu chấm chỉ số ảnh (Dots indicator) nếu game có nhiều ảnh */}
          {imagesList.length > 1 && (
            <div className="game-card-dots">
              {imagesList.map((_, idx) => (
                <span
                  key={idx}
                  className={`dot ${idx === currentImgIndex ? "active" : ""}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Nội dung thông tin card */}
        <div className="game-3d-body">
          <h5 className="game-3d-title">{game.name}</h5>

          <div className="game-3d-info">
            <img src="/img/ic1.png" alt="" className="game-3d-icon" />
            <span>Từ {game.recommendedAge || 6}+ tuổi</span>
          </div>

          <div className="game-3d-footer">
            <span className="game-3d-category">{game.category}</span>
            <Link className="game-3d-btn" to={`/games/${game.id}`}>
              Chi tiết
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
