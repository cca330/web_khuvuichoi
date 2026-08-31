import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Game3DCard from "../components/Game3DCard";

import { FaMapMarkerAlt } from "react-icons/fa";
import gamesApi from "../api/gamesApi";
import eventsApi from "../api/eventsApi";
import { getImageUrl } from "../utils/imageUtils";
import "../styles/home.css";

const Home = () => {
  const [games, setGames] = useState([]);
  const [events, setEvents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ─── REF & LOGIC CHO VÒNG CUNG PANORAMA 3D ───
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const autoPlayRef = useRef(null);

  // Tính toán góc xoay & độ cong 3D lòng chảo
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
      const translateZ =
        (1 - Math.cos(clampedDist * Math.PI * 0.45)) * radius - 120;
      const shiftX =
        clampedDist > 0
          ? -Math.pow(clampedDist, 1.8) * 25
          : Math.abs(clampedDist) * 8;
      const translateY = Math.pow(Math.abs(clampedDist), 2) * 12;

      card.style.transform = `translateX(${shiftX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`;
    });
  };

  // Cập nhật vị trí cuộn & Reset mượt mà không gây giật
  const applyOffset = (val) => {
    if (!trackRef.current) return;
    const singleSetWidth = trackRef.current.scrollWidth / 3;
    if (!singleSetWidth) return;

    let newOffset = val;
    let didReset = false;

    // Khi di chuyển quá 1 chu kỳ cụm ảnh, nhảy về vị trí tương ứng
    if (newOffset <= -singleSetWidth * 2) {
      newOffset += singleSetWidth;
      didReset = true;
    } else if (newOffset >= 0) {
      newOffset -= singleSetWidth;
      didReset = true;
    }

    const cards = trackRef.current.querySelectorAll(".panorama-card");

    // Nếu xảy ra reset, tạm thời tắt transition để tránh hiệu ứng nhảy/nảy
    if (didReset) {
      cards.forEach((c) => c.classList.add("no-transition"));
    }

    offsetRef.current = newOffset;
    trackRef.current.style.transform = `translateX(${newOffset}px)`;
    updateCardTransforms();

    // Bật lại transition cho frame kế tiếp
    if (didReset) {
      requestAnimationFrame(() => {
        cards.forEach((c) => c.classList.remove("no-transition"));
      });
    }
  };

  // Tự động di chuyển (Auto-play liên tục)
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        if (!isDragging.current) {
          applyOffset(offsetRef.current - 0.8); // Tốc độ lướt mượt 60fps
        }
      }, 16);
    };

    startAutoPlay();
    return () => clearInterval(autoPlayRef.current);
  }, []);

  // Thao tác kéo tay (Drag)
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

  // ─── KHỞI TẠO TRANG ───
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
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
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
      const [gamesRes, eventsRes] = await Promise.all([
        gamesApi.getAll(),
        eventsApi.getFeatured(),
      ]);

      const gameList = Array.isArray(gamesRes.data) ? gamesRes.data : [];
      setGames(gameList.slice(0, 4));
      setEvents(eventsRes.data || []);

      const collectedFeedbacks = [];

      for (const game of gameList) {
        try {
          const feedbackRes = await gamesApi.getFeedbacks(game.id);
          const arr = Array.isArray(feedbackRes.data) ? feedbackRes.data : [];
          arr.forEach((fb) => {
            collectedFeedbacks.push({
              ...fb,
              name: fb.username || "Khách hàng",
              gameName: game.name,
            });
          });
        } catch (error) {
          console.error(`Error fetching feedbacks for game ${game.id}:`, error);
        }
      }

      const prioritizedFeedbacks = collectedFeedbacks.sort((a, b) => {
        if (Number(b.rating) !== Number(a.rating)) {
          return Number(b.rating) - Number(a.rating);
        }
        return new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at);
      });

      setFeedbacks(prioritizedFeedbacks.slice(0, 5));
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

  const featuredSlides = (events || []).flatMap((event) => {
    const images =
      Array.isArray(event.images) && event.images.length > 0
        ? event.images.map((img) =>
            typeof img === "string" ? img : img.image || img.url || "",
          )
        : [event.thumbnail];

    return images.filter(Boolean).map((image, index) => ({
      id: `${event.id}-${index}`,
      title: event.title,
      description: event.description,
      image: getImageUrl(image || event.thumbnail),
    }));
  });

  const featuredEvents = featuredSlides.length
    ? [...featuredSlides, ...featuredSlides, ...featuredSlides]
    : [];

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
                <img
                  className="img-fluid"
                  src="/img/khuvuichoi.png"
                  alt="Giới thiệu"
                />
              </div>
            </div>
            <div className="col-lg-6 offset-lg-1">
              <div className="content__gioithieu-modern">
                <span className="subtitle-tag">Về Chúng Tôi</span>
                <h3>Giới thiệu về chúng tôi</h3>
                <p className="highlight-text">
                  Tọa lạc ngay tại trung tâm thành phố Biên Hòa,{" "}
                  <strong>HG Playground</strong> là tổ hợp giải trí hiện đại bậc
                  nhất.
                </p>
                <p>
                  Với hàng loạt trò chơi cảm giác mạnh đỉnh cao, khu giải trí
                  trong nhà công nghệ VR cùng tiện ích đa dạng, chúng tôi tự hào
                  mang tới không gian gắn kết trọn vẹn.
                </p>
                <p className="call-action-text">
                  Check-in ngay để cùng nhau "quẩy" hết mình và lưu giữ những
                  khoảnh khắc tuyệt vời nhất nhé!
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
              const imgs = [
                "/img/hapdan.png",
                "/img/xanhmat.png",
                "/img/cotich.png",
                "/img/hiendai.png",
              ];
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
      {/* ─── 4. SỰ KIỆN NỔI BẬT (PANORAMA 3D LIGHT THEME) ─── */}
      <section className="panorama-carousel-wrapper scroll-reveal fade-up">
        <div className="panorama-hero-header">
          <h1 className="hero-title">
            Khám phá thế giới <br />
            sự kiện <span className="highlight-italic">bùng nổ.</span>
          </h1>

          <p className="hero-subtitle">
            Hòa mình vào không gian lễ hội hoành tráng, ánh sáng rực rỡ và những
            khoảnh khắc đáng nhớ nhất tại HG Playground!
          </p>

          <Link to="/booking" className="btn-get-started-light">
            Đặt Vé Tham Gia
          </Link>
        </div>

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
            {featuredEvents.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="panorama-card"
                onClickCapture={handleCardClick}
              >
                <div className="panorama-card-inner">
                  <img
                    src={item.image || "/img/banner.png"}
                    alt={item.title}
                    draggable="false"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ─── 5. TÌM VÉ / GAMES ─── */}
      <section
        id="games-section"
        className="featured spad scroll-reveal fade-up"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center mb-4">
                <h2
                  style={{
                    color: "#fff",
                    textShadow: "0 0 20px rgba(73,229,255,0.3)",
                  }}
                >
                  Tìm một tấm vé hoàn hảo dành cho bạn
                </h2>
              </div>

              <div className="featured__explore-bar">
                <Link to="/games" className="btn-featured-explore">
                  Khám phá ngay
                </Link>
              </div>
            </div>
          </div>

          <div className="row featured__filter mt-3">
            {loading ? (
              <div className="col-12 text-center py-4 text-white">
                Đang tải danh sách trò chơi...
              </div>
            ) : games.length === 0 ? (
              <div className="col-12 text-center py-4 text-white-50">
                Không tìm thấy trò chơi phù hợp!
              </div>
            ) : (
              games.map((game, index) => (
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
                <img
                  src="/img/bn-trainghiem.png"
                  className="img-fluid rounded-4 shadow-lg"
                  alt="Trải nghiệm"
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="content__trainghiem-modern">
                <h3 className="trainghiem-title mb-4">
                  Trải nghiệm tuyệt vời tại HG Playground
                </h3>
                <p className="trainghiem-desc mb-4">
                  Bước vào thế giới vui chơi đầy màu sắc với muôn vàn trò chơi
                  hấp dẫn!
                </p>

                <div className="trainghiem-list">
                  <div className="trainghiem-item d-flex align-items-start mb-3">
                    <img
                      src="/img/check.png"
                      alt="Check"
                      className="check-icon me-3"
                    />
                    <div>
                      <h4>Tàu Lượn Siêu Tốc & Trò Chơi Mạo Hiểm</h4>
                      <p>Thử thách bản thân với tốc độ và độ cao nghẹt thở!</p>
                    </div>
                  </div>
                  <div className="trainghiem-item d-flex align-items-start mb-3">
                    <img
                      src="/img/check.png"
                      alt="Check"
                      className="check-icon me-3"
                    />
                    <div>
                      <h4>Máng Trượt & Khu Vui Chơi Nước Ocean Park</h4>
                      <p>
                        Mát lạnh và phấn khích với công viên nước sảng khoái.
                      </p>
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
      <section className="testimonial-section-modern scroll-reveal fade-up">
        <div className="container">
          <div className="row align-items-center">
            {/* Cột bên trái: Cụm 3 Avatar xếp lớp */}
            <div className="col-lg-5 mb-4 mb-lg-0">
              <div className="avatar-cluster-wrapper">
                <div className="avatar-circle avt-main">
                  <img src="/img/khuvuichoi.png" alt="Khách hàng 1" />
                </div>
                <div className="avatar-circle avt-top">
                  <img src="/img/hapdan.png" alt="Khách hàng 2" />
                </div>
                <div className="avatar-circle avt-bottom">
                  <img src="/img/cotich.png" alt="Khách hàng 3" />
                </div>
                <div className="bubble-decoration bubble-1"></div>
                <div className="bubble-decoration bubble-2"></div>
              </div>
            </div>

            {/* Cột bên phải: Card đánh giá động theo State */}
            <div className="col-lg-7">
              <div className="testimonial-card-box">
                <h3 className="testimonial-card-title">
                  Khách hàng nói gì về chúng tôi?
                </h3>

                {feedbacks.length > 0 && (
                  <>
                    {/* Số sao đánh giá */}
                    <div className="stars-rating mb-3">
                      {renderStars(feedbacks[currentSlide].rating)}
                    </div>

                    {/* Nội dung nhận xét */}
                    <p className="testimonial-quote-text">
                      "{feedbacks[currentSlide].content}"
                    </p>

                    {/* Tên khách hàng & Thanh chỉ số Slide */}
                    <div className="d-flex align-items-center justify-content-between pt-2">
                      <div>
                        <div className="user-name">
                          {feedbacks[currentSlide].name}
                        </div>
                      </div>

                      {/* Thanh gạch chuyển slide tương tác được */}
                      <div className="slider-indicators-dash">
                        {feedbacks.map((_, idx) => (
                          <span
                            key={idx}
                            className={`dash-item ${idx === currentSlide ? "active" : ""}`}
                            onClick={() => setCurrentSlide(idx)}
                          ></span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      s
    </div>
  );
};

export default Home;
