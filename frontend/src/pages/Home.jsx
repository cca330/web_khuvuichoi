import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Game3DCard from "../components/Game3DCard";
import {
  FaTicketAlt,
  FaRegClock,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
} from "react-icons/fa";
import gamesApi from "../api/gamesApi";
import eventsApi from "../api/eventsApi";
import { getImageUrl } from "../utils/imageUtils";
import "../styles/home.css";
import RevealOverlay from "../components/RevealOverlay";

const Home = () => {
  const [games, setGames] = useState([]);
  const [events, setEvents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState("*");

  // KHẮC PHỤC LỖI TỰ CUỘN XUỐNG CUỐI KHI RESET TRANG
  useEffect(() => {
    // 1. Tắt tính năng tự khôi phục vị trí cuộn lộn xộn của trình duyệt
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // 2. Ép trình duyệt cuộn lên đỉnh đầu ngay khi Component được mount
    window.scrollTo(0, 0);
  }, []);

  // KÍCH HOẠT HIỆU ỨNG XUẤT HIỆN KHI CUỘN TRANG (LẶP LẠI KHI CUỘN LÊN/XUỐNG)
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
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        },
      );

      const elements = document.querySelectorAll(".scroll-reveal");
      elements.forEach((el) => observer.observe(el));

      return () => elements.forEach((el) => observer.unobserve(el));
    }
  }, [loading, games, events]);

  useEffect(() => {
    fetchData();
  }, []);

  // TỰ ĐỘNG CHUYỂN SLIDE SAU 4 GIÂY & RESET BỘ ĐẾM KHI NGƯỜI DÙNG TƯƠNG TÁC
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 11);
    }, 4000); // 4000ms = 4 giây

    // Dọn dẹp Timer cũ mỗi khi currentSlide thay đổi (để đếm lại từ đầu 4 giây)
    return () => clearInterval(timer);
  }, [currentSlide]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gamesRes, eventsRes] = await Promise.all([
        gamesApi.getAll(),
        eventsApi.getAll(),
      ]);

      setGames(gamesRes.data.slice(0, 4));
      setEvents(eventsRes.data.slice(0, 3));

      setFeedbacks([
        {
          id: 1,
          name: "Nguyễn Văn A",
          rating: 5,
          content: "Khu vui chơi tuyệt vời!",
          created_at: "2024-01-15",
        },
        {
          id: 2,
          name: "Trần Thị B",
          rating: 4,
          content: "Trẻ em rất thích",
          created_at: "2024-01-10",
        },
        {
          id: 3,
          name: "Lê Văn C",
          rating: 5,
          content: "Dịch vụ tốt, giá hợp lý",
          created_at: "2024-01-05",
        },
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
      {/* ─── HERO BANNER ─── */}
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

      {/* ─── 2. GIỚI THIỆU SỬA ĐỔI ─── */}
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
                  nhất với quy mô rộng lớn.
                </p>
                <p>
                  Với hàng loạt trò chơi cảm giác mạnh đỉnh cao, khu giải trí
                  trong nhà ứng dụng công nghệ thực tế ảo cùng các khu tiện ích
                  đa dạng, chúng tôi tự hào mang tới không gian gắn kết trọn vẹn
                  lý tưởng dành cho gia đình, bạn bè và mọi lứa tuổi vào mỗi kỳ
                  nghỉ.
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

      {/* ─── 4. SỰ KIỆN NỔI BẬT (FULL-WIDTH CONTAINER) ─── */}
      <section className="from-blog spad event-section scroll-reveal fade-up">
        {/* Tiêu đề in đậm đặc biệt */}
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center mb-4">
                <span className="subtitle-tag-pink">Hoạt Động Bùng Nổ</span>
                <h2 className="section-main-heading">SỰ KIỆN NỔI BẬT</h2>
                <p className="mt-3 w-75 mx-auto section-sub-desc">
                  HG – Playground không chỉ là khu vui chơi giải trí mà còn là
                  nơi diễn ra nhiều sự kiện đỉnh cao, mang đến những khoảnh khắc
                  bùng nổ cảm xúc cho mọi lứa tuổi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Khung Slider tràn rộng gần hết màn hình (Container-Fluid) */}
        <div className="container-fluid px-2 px-md-5">
          <div className="event-slider-container full-width-slider">
            <div className="event-slider-wrapper">
              <div
                className={`event-slide ${currentSlide === 0 ? "active" : ""}`}
              >
                <img src="/img/event-slider-33.jpg" alt="Countdown pháo hoa" />
                <div className="event-caption">
                  <h3>Đêm Countdown Chào Năm Mới 2026</h3>
                  <p>Pháo hoa rực rỡ, đại nhạc hội với ca sĩ nổi tiếng</p>
                </div>
              </div>

              <div
                className={`event-slide ${currentSlide === 1 ? "active" : ""}`}
              >
                <img src="/img/event-slider-2.png" alt="Sân khấu countdown" />
                <div className="event-caption">
                  <h3>Đêm Countdown Chào Năm Mới 2026</h3>
                  <p>DJ bùng nổ, countdown hoành tráng đón giao thừa</p>
                </div>
              </div>

              <div
                className={`event-slide ${currentSlide === 2 ? "active" : ""}`}
              >
                <img src="/img/event-slider-34.webp" alt="Đám đông countdown" />
                <div className="event-caption">
                  <h3>Đêm Countdown Chào Năm Mới 2026</h3>
                  <p>Khoảnh khắc giao thừa đáng nhớ</p>
                </div>
              </div>

              <div
                className={`event-slide ${currentSlide === 3 ? "active" : ""}`}
              >
                <img src="/img/event-slider1.png" alt="Đèn LED lung linh" />
                <div className="event-caption">
                  <h3>Lễ Hội Ánh Sáng Magic Light</h3>
                  <p>Hàng triệu đèn LED lung linh</p>
                </div>
              </div>

              <div
                className={`event-slide ${currentSlide === 4 ? "active" : ""}`}
              >
                <img src="/img/event-slider2.png" alt="Drone light show" />
                <div className="event-caption">
                  <h3>Lễ Hội Ánh Sáng Magic Light</h3>
                  <p>Biểu diễn drone light show</p>
                </div>
              </div>

              <div
                className={`event-slide ${currentSlide === 5 ? "active" : ""}`}
              >
                <img src="/img/event-slider3.png" alt="Đường hầm ánh sáng" />
                <div className="event-caption">
                  <h3>Lễ Hội Ánh Sáng Magic Light</h3>
                  <p>Không gian cổ tích sống động</p>
                </div>
              </div>

              <div
                className={`event-slide ${currentSlide === 6 ? "active" : ""}`}
              >
                <img src="/img/event-slide1.png.png" alt="Té nước vui nhộn" />
                <div className="event-caption">
                  <h3>Water Splash Festival 2026</h3>
                  <p>Lễ hội té nước lớn nhất năm</p>
                </div>
              </div>

              <div
                className={`event-slide ${currentSlide === 7 ? "active" : ""}`}
              >
                <img src="/img/event-slide2.png.png" alt="Pool party" />
                <div className="event-caption">
                  <h3>Water Splash Festival 2026</h3>
                  <p>DJ pool party bùng nổ</p>
                </div>
              </div>

              <div
                className={`event-slide ${currentSlide === 8 ? "active" : ""}`}
              >
                <img src="/img/event-slid1.png" alt="Nhà ma kinh dị" />
                <div className="event-caption">
                  <h3>Halloween Horror Night</h3>
                  <p>Nhà ma kinh dị</p>
                </div>
              </div>

              <div
                className={`event-slide ${currentSlide === 9 ? "active" : ""}`}
              >
                <img src="/img/event-slid2.png" alt="Hóa trang Halloween" />
                <div className="event-caption">
                  <h3>Halloween Horror Night</h3>
                  <p>Hóa trang zombie, ma quái</p>
                </div>
              </div>

              <div
                className={`event-slide ${currentSlide === 10 ? "active" : ""}`}
              >
                <img src="/img/event-slid3.png" alt="Diễu hành ma quái" />
                <div className="event-caption">
                  <h3>Halloween Horror Night</h3>
                  <p>Diễu hành ma quái</p>
                </div>
              </div>
            </div>

            {/* Nút Prev / Next */}
            <button
              className="slider-btn prev-btn"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + 11) % 11)}
            >
              <FaChevronLeft />
            </button>
            <button
              className="slider-btn next-btn"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % 11)}
            >
              <FaChevronRight />
            </button>

            {/* Chấm điều hướng */}
            <div className="slider-nav">
              {Array.from({ length: 11 }).map((_, idx) => (
                <span
                  key={idx}
                  className={`dot-item ${currentSlide === idx ? "active" : ""}`}
                  onClick={() => setCurrentSlide(idx)}
                ></span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link to="/events" className="btn-explore-pink">
            <FaTicketAlt className="me-2" /> Xem tất cả sự kiện
          </Link>
        </div>
      </section>

      {/* ─── 6. TÌM VÉ / GAMES (ĐÃ THÊM SCROLL REVEAL & FILTER ANIMATION) ─── */}
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

              {/* Các nút lọc danh mục */}
              <div className="featured__controls">
                <ul>
                  <li
                    className={activeFilter === "*" ? "active" : ""}
                    onClick={() => setActiveFilter("*")}
                  >
                    Tất Cả
                  </li>
                  <li
                    className={activeFilter === "oranges" ? "active" : ""}
                    onClick={() => setActiveFilter("oranges")}
                  >
                    Mạo hiểm
                  </li>
                  <li
                    className={activeFilter === "fresh-meat" ? "active" : ""}
                    onClick={() => setActiveFilter("fresh-meat")}
                  >
                    Thư giãn
                  </li>
                  <li
                    className={activeFilter === "vegetables" ? "active" : ""}
                    onClick={() => setActiveFilter("vegetables")}
                  >
                    Ocean Park
                  </li>
                  <li
                    className={activeFilter === "fastfood" ? "active" : ""}
                    onClick={() => setActiveFilter("fastfood")}
                  >
                    Trẻ em
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Danh sách các card game có animation khi đổi tab */}
          <div className="row featured__filter mt-3" key={activeFilter}>
            {loading ? (
              <div className="col-12 text-center py-4 text-white">
                Đang tải danh sách trò chơi...
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="col-12 text-center py-4 text-white-50">
                Không tìm thấy trò chơi phù hợp!
              </div>
            ) : (
              filteredGames.map((game, index) => (
                <div
                  key={game.id}
                  className="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex filter-animate-item"
                  style={{
                    animationDelay: `${index * 0.08}s`,
                  }} /* Tạo hiệu ứng xuất hiện lần lượt */
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
            {/* Ảnh bên trái */}
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="trainghiem-img-box">
                <img
                  src="/img/bn-trainghiem.png"
                  className="img-fluid rounded-4 shadow-lg"
                  alt="Trải nghiệm tại HG Playground"
                />
              </div>
            </div>

            {/* Nội dung danh sách 5 mục bên phải */}
            <div className="col-lg-6">
              <div className="content__trainghiem-modern">
                <h3 className="trainghiem-title mb-4">
                  Trải nghiệm tuyệt vời tại HG Playground
                </h3>
                <p className="trainghiem-desc mb-4">
                  Hãy tạm gác lại cuộc sống thường nhật để bước vào thế giới vui
                  chơi đầy màu sắc tại HG Playground! Một ngày trọn vẹn niềm
                  vui, tiếng cười và kỷ niệm bên gia đình & bạn bè đang chờ bạn
                  khám phá.
                </p>

                <div className="trainghiem-list">
                  {/* Mục 1 */}
                  <div className="trainghiem-item d-flex align-items-start mb-3">
                    <img
                      src="/img/check.png"
                      alt="Check"
                      className="check-icon me-3"
                    />
                    <div>
                      <h4>Tàu Lượn Siêu Tốc & Trò Chơi Mạo Hiểm</h4>
                      <p>
                        Thử thách bản thân với tốc độ, độ cao và những vòng xoay
                        nghẹt thở!
                      </p>
                    </div>
                  </div>

                  {/* Mục 2 */}
                  <div className="trainghiem-item d-flex align-items-start mb-3">
                    <img
                      src="/img/check.png"
                      alt="Check"
                      className="check-icon me-3"
                    />
                    <div>
                      <h4>Máng Trượt & Khu Vui Chơi Nước Ocean Park</h4>
                      <p>
                        Cảm giác mát lạnh, phấn khích khi trượt từ độ cao xuống
                        hồ nước rộng lớn.
                      </p>
                    </div>
                  </div>

                  {/* Mục 3 */}
                  <div className="trainghiem-item d-flex align-items-start mb-3">
                    <img
                      src="/img/check.png"
                      alt="Check"
                      className="check-icon me-3"
                    />
                    <div>
                      <h4>Vòng Quay Khổng Lồ & Trò Chơi Gia Đình</h4>
                      <p>
                        Ngắm toàn cảnh khu vui chơi từ trên cao, an toàn và vui
                        vẻ cho cả nhà.
                      </p>
                    </div>
                  </div>

                  {/* Mục 4 */}
                  <div className="trainghiem-item d-flex align-items-start mb-3">
                    <img
                      src="/img/check.png"
                      alt="Check"
                      className="check-icon me-3"
                    />
                    <div>
                      <h4>Khu Vui Chơi Trẻ Em & Vòng Quay Ngựa Gỗ</h4>
                      <p>
                        Thế giới cổ tích với trò chơi nhẹ nhàng, phù hợp cho bé
                        và gia đình.
                      </p>
                    </div>
                  </div>

                  {/* Mục 5 */}
                  <div className="trainghiem-item d-flex align-items-start mb-3">
                    <img
                      src="/img/check.png"
                      alt="Check"
                      className="check-icon me-3"
                    />
                    <div>
                      <h4>Show Biểu Diễn & Sự Kiện Đặc Biệt</h4>
                      <p>
                        Pháo hoa, nhạc sống, biểu diễn xiếc - những khoảnh khắc
                        đáng nhớ mỗi ngày!
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

      {/* ─── 7. KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI (TESTIMONIAL DESIGN MỚI) ─── */}
      <section className="testimonial-section-modern spad scroll-reveal fade-up">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            {/* Cột trái: 3 Ảnh đại diện Avatar tròn xếp tầng nghệ thuật */}
            <div className="col-lg-5 col-md-6 mb-5 mb-md-0 position-relative">
              <div className="avatar-cluster-wrapper">
                <div className="avatar-circle avt-main">
                  <img src="/img/fb1.jpg" alt="Khách hàng 1" />
                </div>
                <div className="avatar-circle avt-top">
                  <img src="/img/fb2.jpg" alt="Khách hàng 2" />
                </div>
                <div className="avatar-circle avt-bottom">
                  <img src="/img/fb3.jpg" alt="Khách hàng 3" />
                </div>

                {/* Bong bóng trang trí màu xanh nhạt */}
                <span className="bubble-decoration bubble-1"></span>
                <span className="bubble-decoration bubble-2"></span>
              </div>
            </div>

            {/* Cột phải: Thẻ nội dung nhận xét */}
            <div className="col-lg-6 col-md-6 offset-lg-1">
              <div className="testimonial-card-box">
                <h2 className="testimonial-card-title">
                  Khách hàng nói gì về chúng tôi?
                </h2>

                {feedbacks.length > 0 && (
                  <div className="testimonial-content-slider">
                    <div className="stars-rating mb-3">
                      {renderStars(feedbacks[currentSlide]?.rating || 5)}
                    </div>

                    <p className="testimonial-quote-text">
                      "
                      {feedbacks[currentSlide]?.content ||
                        "Khu vui chơi rất tuyệt vời, gia đình tôi đã có khoảng thời gian rất vui vẻ!"}
                      "
                    </p>

                    <div className="testimonial-user-info">
                      <h4 className="user-name">
                        {feedbacks[currentSlide]?.name || "KHÁCH HÀNG"}
                      </h4>
                      <span className="user-date">
                        {feedbacks[currentSlide]?.created_at
                          ? new Date(
                              feedbacks[currentSlide].created_at,
                            ).toLocaleDateString("vi-VN")
                          : "16/01/2026"}
                      </span>
                    </div>

                    {/* Thanh gạch ngang nhỏ định vị Slide */}
                    <div className="slider-indicators-dash mt-4">
                      {feedbacks.map((_, idx) => (
                        <span
                          key={idx}
                          className={`dash-item ${idx === currentSlide ? "active" : ""}`}
                          onClick={() => setCurrentSlide(idx)}
                        ></span>
                      ))}
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
