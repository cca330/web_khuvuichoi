import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import "../styles/style1.css";

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (events.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % events.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length]);

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

      {/* ─── 4. SỰ KIỆN NỔI BẬT ─── */}
      <section className="from-blog spad event-section scroll-reveal fade-up">
        <div className="container">
          <div className="section-title text-center">
            <h2>Sự kiện nổi bật</h2>
            <p className="mt-3 w-75 mx-auto">
              HG – Playground mang đến nhiều sự kiện bùng nổ đỉnh cao.
            </p>
          </div>
          {events.length > 0 && (
            <div className="event-slider-container">
              <div className="event-slider-wrapper">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className={`event-slide ${index === currentSlide ? "active" : ""}`}
                  >
                    <img
                      src={event.thumbnail || "/img/default-event.jpg"}
                      alt={event.title}
                    />
                    <div className="event-caption">
                      <h3>{event.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── 5. TÌM VÉ / GAMES ─── */}
      <section id="games-section" className="featured spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Tìm một tấm vé hoàn hảo dành cho bạn</h2>
              </div>
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
          <div className="row featured__filter">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex"
              >
                <div className="card mb-4 w-100">
                  <img
                    className="card-img-top"
                    src={
                      game.images?.[0]
                        ? `/uploads/${game.images[0]}`
                        : "/img/default-game.jpg"
                    }
                    alt={game.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{game.name}</h5>
                    <div className="content pb-2 border-bottom mb-3">
                      <div className="d-flex align-items-center">
                        <img src="/img/ic1.png" alt="" />
                        <span className="pl-2" style={{ fontSize: "13px" }}>
                          Từ {game.recommendedAge}+ tuổi
                        </span>
                      </div>
                    </div>
                    <div className="row pt-2 mt-auto align-items-center">
                      <div className="col-lg-7 col-md-12">
                        <span
                          style={{ fontSize: "13px", fontWeight: "600" }}
                          className="text-muted"
                        >
                          {game.category}
                        </span>
                      </div>
                      <div className="col-lg-5 col-md-12 text-right mt-2 mt-lg-0">
                        <Link className="booknow" to="/games">
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. TRẢI NGHIỆM ─── */}
      <section className="trai-nghiem spad">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <img
                src="/img/bn-trainghiem.png"
                className="img-fluid w-100 rounded-3 shadow"
                alt="Trải nghiệm tại HG Playground"
              />
            </div>
            <div className="col-lg-6">
              <div className="content__about">
                <h3 className="mb-4">
                  Trải nghiệm tuyệt vời tại HG Playground
                </h3>
                <p className="lead mb-4">
                  Hãy tạm gác lại cuộc sống thường nhật để bước vào thế giới vui
                  chơi đầy màu sắc tại HG Playground! Một ngày trọn vẹn niềm
                  vui, tiếng cười và kỷ niệm bên gia đình & bạn bè đang chờ bạn
                  khám phá.
                </p>
                <div className="content-trainghiem">
                  <div className="d-flex align-items-start mb-4">
                    <img
                      src="/img/check.png"
                      alt="Check"
                      className="me-3"
                      style={{ width: "50px" }}
                    />
                    <div>
                      <h4>Tàu Lượn Siêu Tốc & Trò Chơi Mạo Hiểm</h4>
                      <p>
                        Thử thách bản thân với tốc độ, độ cao và những vòng xoay
                        nghẹt thở!
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-start mb-4">
                    <img
                      src="/img/check.png"
                      alt="Check"
                      className="me-3"
                      style={{ width: "50px" }}
                    />
                    <div>
                      <h4>Máng Trượt & Khu Vui Chơi Nước Ocean Park</h4>
                      <p>
                        Cảm giác mát lạnh, phấn khích khi trượt từ độ cao xuống
                        hồ nước rộng lớn.
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-start mb-4">
                    <img
                      src="/img/check.png"
                      alt="Check"
                      className="me-3"
                      style={{ width: "50px" }}
                    />
                    <div>
                      <h4>Vòng Quay Khổng Lồ & Trò Chơi Gia Đình</h4>
                      <p>
                        Ngắm toàn cảnh khu vui chơi từ trên cao, an toàn và vui
                        vẻ cho cả nhà.
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  to="/games"
                  className="btn btn-danger btn-lg mt-4 px-5 py-3 rounded-pill shadow"
                >
                  Khám Phá Ngay Các Trò Chơi!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. FEEDBACK / TESTIMONIAL ─── */}
      <section className="testimonial">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 d-none d-lg-block">
              <ol className="carousel-indicators tabs">
                {feedbacks.map((fb, index) => (
                  <li
                    key={fb.id}
                    data-target="#carouselExampleIndicators"
                    data-slide-to={index}
                    className={index === 0 ? "active" : ""}
                  >
                    <figure>
                      <img
                        src={`/img/fb${index + 1}.jpg`}
                        className="img-fluid"
                        alt={`Khách hàng ${fb.name}`}
                      />
                    </figure>
                  </li>
                ))}
              </ol>
            </div>
            <div className="col-lg-6 d-flex justify-content-center align-items-center">
              <div
                id="carouselExampleIndicators"
                className="carousel slide"
                data-ride="carousel"
              >
                <h1>Khách hàng nói gì về chúng tôi?</h1>
                <div className="carousel-inner">
                  {feedbacks.map((fb, index) => (
                    <div
                      key={fb.id}
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                    >
                      <div className="rating">{renderStars(fb.rating)}</div>
                      <div className="quote-wrapper">
                        <p>{fb.content}</p>
                        <h3>{fb.name}</h3>
                        <small>
                          {new Date(fb.created_at).toLocaleDateString("vi-VN")}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
                <ol className="carousel-indicators indicators">
                  {feedbacks.map((fb, index) => (
                    <div
                      key={fb.id}
                      data-target="#carouselExampleIndicators"
                      data-slide-to={index}
                      className={index === 0 ? "active" : ""}
                    ></div>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
