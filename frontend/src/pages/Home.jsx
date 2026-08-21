import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Game3DCard from "../components/Game3DCard";

import { FaMapMarkerAlt } from "react-icons/fa";
import gamesApi from "../api/gamesApi";
import eventsApi from "../api/eventsApi";
import "../styles/home.css";

// ─── DỮ LIỆU SỰ KIỆN GỐC ───
const rawEventsData = [
  { id: 1, img: "/img/event-slider-33.jpg", title: "Đêm Countdown 2026", desc: "Pháo hoa rực rỡ, đại nhạc hội" },
  { id: 2, img: "/img/event-slider-2.png", title: "Countdown Party", desc: "DJ bùng nổ đón giao thừa" },
  { id: 3, img: "/img/event-slider-34.webp", title: "Giao Thừa Rực Rỡ", desc: "Khoảnh khắc đáng nhớ" },
  { id: 4, img: "/img/event-slider1.png", title: "Lễ Hội Ánh Sáng", desc: "Hàng triệu đèn LED lung linh" },
  { id: 5, img: "/img/event-slider2.png", title: "Drone Light Show", desc: "Trình diễn ánh sáng không gian" },
  { id: 6, img: "/img/event-slider3.png", title: "Magic Light Park", desc: "Không gian cổ tích sống động" },
  { id: 7, img: "/img/event-slide1.png.png", title: "Water Splash 2026", desc: "Lễ hội té nước lớn nhất năm" },
  { id: 8, img: "/img/event-slide2.png.png", title: "DJ Pool Party", desc: "Sôi động cùng âm nhạc" },
  { id: 9, img: "/img/event-slid1.png", title: "Halloween Horror", desc: "Trải nghiệm nhà ma kinh dị" },
  { id: 10, img: "/img/event-slid2.png", title: "Zombie Walk", desc: "Hóa trang ma quái" },
];

// Nhân bản mảng dữ liệu để tạo hiệu ứng cuộn lặp vô tận (Infinite Loop)
const eventsData = [...rawEventsData, ...rawEventsData, ...rawEventsData];

const Home = () => {
  const [games, setGames] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState("*");

  // ─── REF & STATE CHO PANORAMA CAROUSEL VÒNG CUNG ───
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const autoPlayRef = useRef(null);

  // 1. Hàm tính toán độ cong 3D lòng chảo
  const updateCardTransforms = () => {
    if (!viewportRef.current || !trackRef.current) return;
    const cards = trackRef.current.querySelectorAll(".panorama-card");
    const containerRect = viewportRef.current.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;

    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const distanceFromCenter = cardCenterX - centerX;

      const normalizedDist = distanceFromCenter / (containerRect.width / 2);
      const clampedDist = Math.max(-1.5, Math.min(1.5, normalizedDist));

      const rotateY = -clampedDist * 28; 
      const radius = 220;
      const translateZ = (1 - Math.cos(clampedDist * Math.PI * 0.45)) * radius - 120;
      const shiftX = clampedDist > 0 ? -Math.pow(clampedDist, 1.8) * 25 : Math.abs(clampedDist) * 8;
      const translateY = Math.pow(Math.abs(clampedDist), 2) * 12;

      card.style.transform = `translateX(${shiftX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`;
    });
  };

  // 2. Cập nhật vị trí cuộn & Xử lý vô tận (Infinite Reset)
  const applyOffset = (val) => {
    if (!trackRef.current) return;
    const singleSetWidth = trackRef.current.scrollWidth / 3;

    let newOffset = val;
    // Nếu trượt quá dải giữa bên trái -> Nhảy về dải giữa
    if (newOffset > -singleSetWidth * 0.2) {
      newOffset -= singleSetWidth;
    }
    // Nếu trượt quá dải giữa bên phải -> Nhảy về dải giữa
    else if (newOffset < -singleSetWidth * 1.8) {
      newOffset += singleSetWidth;
    }

    offsetRef.current = newOffset;
    trackRef.current.style.transform = `translateX(${newOffset}px)`;
    requestAnimationFrame(updateCardTransforms);
  };

  // 3. Tự động chạy Carousel mượt mà (Auto-play)
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        if (!isDragging.current) {
          applyOffset(offsetRef.current - 1.5); // Tốc độ trượt
        }
      }, 16); // ~60fps
    };

    startAutoPlay();
    return () => clearInterval(autoPlayRef.current);
  }, []);

  // 4. Sự kiện kéo/thả bằng chuột hoặc vuốt tay
  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragMoved.current = false;
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    startOffset.current = offsetRef.current;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const deltaX = clientX - startX.current;
    if (Math.abs(deltaX) > 4) dragMoved.current = true;
    applyOffset(startOffset.current + deltaX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleCardClick = (e) => {
    if (dragMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // ─── KHỞI TẠO DỮ LIỆU TRANG CHỦ ───
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-visible");
            } else {
              if (entry.boundingClientRect.top > 0) {
                entry.target.classList.remove("reveal-visible");
              }
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );

      const elements = document.querySelectorAll(".scroll-reveal");
      elements.forEach((el) => observer.observe(el));

      return () => elements.forEach((el) => observer.unobserve(el));
    }
  }, [loading, games]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (feedbacks.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % feedbacks.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [feedbacks]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gamesRes] = await Promise.all([
        gamesApi.getAll(),
        eventsApi.getAll(),
      ]);

      setGames(gamesRes.data.slice(0, 4));

      setFeedbacks([
        { id: 1, name: "Nguyễn Văn A", rating: 5, content: "Khu vui chơi tuyệt vời!", created_at: "2024-01-15" },
        { id: 2, name: "Trần Thị B", rating: 4, content: "Trẻ em rất thích", created_at: "2024-01-10" },
        { id: 3, name: "Lê Văn C", rating: 5, content: "Dịch vụ tốt, giá hợp lý", created_at: "2024-01-05" },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <i key={i} className={`fa fa-star ${i < rating ? "filled" : ""}`}></i>
      ));
  };

  const categoryMap = {
    Adventure: "oranges",
    "Mạo hiểm": "oranges",
    "Mạo Hiểm": "oranges",
    VR: "fresh-meat",
    Relaxation: "fresh-meat",
    "Thư giãn": "fresh-meat",
    Family: "vegetables",
    "Gia đình": "vegetables",
    Kids: "fastfood",
    "Trẻ em": "fastfood",
  };

  const filteredGames =
    activeFilter === "*"
      ? games
      : games.filter((game) => categoryMap[game.category] === activeFilter);

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="home-page-lucid">
      {/* ─── 1. HERO BANNER ─── */}
      <section className="hero-section-modern">
        <div
          className="hero-background-image"
          style={{ backgroundImage: "url('/img/banner.png')" }}
        >
          <div className="hero-dark-overlay"></div>
          <div className="hero-container-inner">
            <div className="hero-text-modern">
              <h1 className="hero-title-main anim-group-2">HG Playground</h1>
              <p className="hero-slogan-text anim-group-3">
                Khám phá nụ cười, gắn kết trái tim!
              </p>
              <div className="hero-buttons-wrapper anim-group-4">
                <Link to="/booking" className="btn-hero-booking">
                  Đặt Vé Ngay
                </Link>
                <a href="#games-section" className="btn-hero-explore">
                  Khám Phá Trò Chơi
                </a>
              </div>
            </div>

            <div className="hero-info-status-card anim-group-5">
              <div className="status-item-new">
                <span className="live-pulse-dot"></span>
                <div>
                  <strong>Đang mở cửa</strong>
                  <span>08:00 - 22:00</span>
                </div>
              </div>
              <div className="status-card-separator"></div>
              <div className="status-item-new">
                <FaMapMarkerAlt className="status-marker-icon" />
                <div>
                  <strong>Địa điểm</strong>
                  <span>Biên Hòa, Đồng Nai</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. GIỚI THIỆU ─── */}
      <section className="gioithieu spad scroll-reveal fade-up">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-5 mb-4 mb-lg-0">
              <div className="gioithieu__img-wrapper">
                <img className="img-fluid" src="/img/khuvuichoi.png" alt="Giới thiệu" />
              </div>
            </div>
            <div className="col-lg-6 offset-lg-1">
              <div className="content__gioithieu-modern">
                <span className="subtitle-tag">Về Chúng Tôi</span>
                <h3>Giới thiệu về chúng tôi</h3>
                <p className="highlight-text">
                  Tọa lạc ngay tại trung tâm thành phố Biên Hòa, <strong>HG Playground</strong> là tổ hợp giải trí hiện đại bậc nhất.
                </p>
                <p>
                  Với hàng loạt trò chơi cảm giác mạnh đỉnh cao, khu giải trí trong nhà công nghệ VR cùng tiện ích đa dạng, chúng tôi tự hào mang tới không gian gắn kết trọn vẹn.
                </p>
                <p className="call-action-text">
                  Check-in ngay để cùng nhau "quẩy" hết mình và lưu giữ những khoảnh khắc tuyệt vời nhất nhé!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. BANNER NGHỈ DƯỠNG ─── */}
      <section className="bn-nghiduong scroll-reveal fade-up">
        <div className="container">
          <div className="title">
            <h4>Thiên đường vui chơi hoàn hảo</h4>
            <h3>Khu vui chơi HG - Playground.</h3>
          </div>
          <div className="row">
            {["Hấp dẫn", "Xanh mát", "Cổ tích", "Hiện đại"].map((item, idx) => {
              const imgs = ["/img/hapdan.png", "/img/xanhmat.png", "/img/cotich.png", "/img/hiendai.png"];
              return (
                <div key={idx} className="col-lg-3 col-md-6 mb-4">
                  <div className="content">
                    <div className="content-overlay"></div>
                    <img className="content-image" src={imgs[idx]} alt={item} />
                    <div className="content-details">
                      <h3>{item}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 4. SỰ KIỆN NỔI BẬT (FORM SÁNG & AUTO-PLAY VÒNG CUNG) ─── */}
      <section className="panorama-carousel-wrapper light-theme scroll-reveal fade-up">
        {/* Header Hero Section - Đã xóa nút Sự kiện nổi bật & Chuyển màu tối cho nền sáng */}
        <div className="panorama-hero-header">
          <h1 className="hero-title" style={{ color: "#111" }}>
            Khám phá thế giới <br />
            sự kiện <span className="highlight-italic" style={{ color: "#d63384" }}>bùng nổ.</span>
          </h1>
          
          <p className="hero-subtitle" style={{ color: "#555" }}>
            Hòa mình vào không gian lễ hội hoành tráng, ánh sáng rực rỡ và những khoảnh khắc đáng nhớ nhất tại HG Playground!
          </p>

          <Link to="/booking" className="btn-get-started-light">
            Đặt Vé Tham Gia
          </Link>
        </div>

        {/* Slider Panorama 3D Lòng Chảo */}
        <div ref={viewportRef} className="panorama-viewport">
          <div
            ref={trackRef}
            className="panorama-track"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            {eventsData.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="panorama-card"
                onClickCapture={handleCardClick}
              >
                <div className="panorama-card-inner">
                  <img src={item.img} alt={item.title} draggable="false" />
                  <div className="panorama-card-overlay">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. TÌM VÉ / GAMES ─── */}
      <section id="games-section" className="featured spad scroll-reveal fade-up">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center mb-4">
                <h2 style={{ color: "#fff", textShadow: "0 0 20px rgba(73,229,255,0.3)" }}>
                  Tìm một tấm vé hoàn hảo dành cho bạn
                </h2>
              </div>

              <div className="featured__controls">
                <ul>
                  <li className={activeFilter === "*" ? "active" : ""} onClick={() => setActiveFilter("*")}>Tất Cả</li>
                  <li className={activeFilter === "oranges" ? "active" : ""} onClick={() => setActiveFilter("oranges")}>Mạo hiểm</li>
                  <li className={activeFilter === "fresh-meat" ? "active" : ""} onClick={() => setActiveFilter("fresh-meat")}>Thư giãn</li>
                  <li className={activeFilter === "vegetables" ? "active" : ""} onClick={() => setActiveFilter("vegetables")}>Ocean Park</li>
                  <li className={activeFilter === "fastfood" ? "active" : ""} onClick={() => setActiveFilter("fastfood")}>Trẻ em</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row featured__filter mt-3" key={activeFilter}>
            {loading ? (
              <div className="col-12 text-center py-4 text-white">Đang tải danh sách trò chơi...</div>
            ) : filteredGames.length === 0 ? (
              <div className="col-12 text-center py-4 text-white-50">Không tìm thấy trò chơi phù hợp!</div>
            ) : (
              filteredGames.map((game, index) => (
                <div
                  key={game.id}
                  className="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex filter-animate-item"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <Game3DCard game={game} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─── 6. TRẢI NGHIỆM TUYỆT VỜI ─── */}
      <section className="trai-nghiem-section spad scroll-reveal fade-up">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="trainghiem-img-box">
                <img src="/img/bn-trainghiem.png" className="img-fluid rounded-4 shadow-lg" alt="Trải nghiệm" />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="content__trainghiem-modern">
                <h3 className="trainghiem-title mb-4">Trải nghiệm tuyệt vời tại HG Playground</h3>
                <p className="trainghiem-desc mb-4">
                  Bước vào thế giới vui chơi đầy màu sắc với muôn vàn trò chơi hấp dẫn!
                </p>

                <div className="trainghiem-list">
                  <div className="trainghiem-item d-flex align-items-start mb-3">
                    <img src="/img/check.png" alt="Check" className="check-icon me-3" />
                    <div>
                      <h4>Tàu Lượn Siêu Tốc & Trò Chơi Mạo Hiểm</h4>
                      <p>Thử thách bản thân với tốc độ và độ cao nghẹt thở!</p>
                    </div>
                  </div>
                  <div className="trainghiem-item d-flex align-items-start mb-3">
                    <img src="/img/check.png" alt="Check" className="check-icon me-3" />
                    <div>
                      <h4>Máng Trượt & Khu Vui Chơi Nước Ocean Park</h4>
                      <p>Mát lạnh và phấn khích với công viên nước sảng khoái.</p>
                    </div>
                  </div>
                </div>

                <Link to="/booking" className="btn-explore-pink mt-4">
                  Khám Phá Ngay Các Trò Chơi!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. FEEDBACK KHÁCH HÀNG ─── */}
      <section className="testimonial-section-modern spad scroll-reveal fade-up">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-5 col-md-6 mb-5 mb-md-0 position-relative">
              <div className="avatar-cluster-wrapper">
                <div className="avatar-circle avt-main"><img src="/img/fb1.jpg" alt="Feedback 1" /></div>
                <div className="avatar-circle avt-top"><img src="/img/fb2.jpg" alt="Feedback 2" /></div>
                <div className="avatar-circle avt-bottom"><img src="/img/fb3.jpg" alt="Feedback 3" /></div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 offset-lg-1">
              <div className="testimonial-card-box">
                <h2 className="testimonial-card-title">Khách hàng nói gì về chúng tôi?</h2>
                {feedbacks.length > 0 && (
                  <div className="testimonial-content-slider">
                    <div className="stars-rating mb-3">{renderStars(feedbacks[currentSlide]?.rating || 5)}</div>
                    <p className="testimonial-quote-text">"{feedbacks[currentSlide]?.content}"</p>
                    <div className="testimonial-user-info">
                      <h4 className="user-name">{feedbacks[currentSlide]?.name}</h4>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;