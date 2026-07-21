import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gamesApi from "../api/gamesApi";
import { getImageUrl } from "../utils/imageUtils";
import "../styles/game.css";

const Games = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Hiệu ứng cuộn trang khi load xong danh sách game
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
        { threshold: 0.1 },
      );

      const elements = document.querySelectorAll(".scroll-reveal");
      elements.forEach((el) => observer.observe(el));
      return () => elements.forEach((el) => observer.unobserve(el));
    }
  }, [loading, filteredGames]);

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [categoryFilter, ageFilter, searchKeyword, games]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await gamesApi.getAll();
      setGames(response.data);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...games];

    if (categoryFilter !== "all") {
      filtered = filtered.filter((game) => game.category === categoryFilter);
    }

    if (ageFilter > 0) {
      filtered = filtered.filter((game) => game.recommendedAge <= ageFilter);
    }

    if (searchKeyword) {
      filtered = filtered.filter((game) =>
        game.name.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
    }

    setFilteredGames(filtered);
  };

  const getCategoryBadge = (category) => {
    const colors = {
      "Mạo Hiểm": "badge-maohiem",
      "Mạo hiểm": "badge-maohiem",
      "Ocean Park": "badge-ocean",
      "Gia Đình": "badge-giadinh",
      "Gia đình": "badge-giadinh",
      "Thư Giãn": "badge-thugian",
      "Thư giãn": "badge-thugian",
    };
    return colors[category] || "badge-primary";
  };

  const getStatusBadge = (status) => {
    return status === "OPEN" ? "status-open" : "status-closed";
  };

  const getCategories = () => {
    const categories = new Set(games.map((game) => game.category));
    return Array.from(categories);
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="games-page-modern">
      {/* ─── BANNER TRÒ CHƠI HOÀNH TRÁNG (TƯƠNG TỰ TRANG CHỦ) ─── */}
      <section className="games-hero-section">
        <div
          className="games-hero-bg"
          style={{ backgroundImage: "url('/img/banner.png')" }}
        >
          <div className="games-hero-overlay"></div>
          <div className="container games-hero-content">
            <span className="games-hero-tagline">
              Thế giới giải trí không giới hạn
            </span>
            <h2 className="games-hero-title">
              Khám Phá Trò Chơi Tại HG Playground
            </h2>
            <p className="games-hero-desc">
              Hàng trăm trò chơi cảm giác mạnh, Ocean Park, Gia Đình và Thư Giãn
              đang chờ bạn chinh phục!
            </p>
          </div>
        </div>
      </section>

      {/* ─── KHU VỰC BỘ LỌC & DANH SÁCH GAME ─── */}
      <section className="games-list-section spad scroll-reveal">
        <div className="container">
          <div className="row">
            {/* Sidebar Filter tinh tế */}
            <div className="col-lg-3 mb-4">
              <div className="modern-filter-sidebar">
                <h4>Bộ Lọc Tìm Kiếm</h4>

                <div className="filter-item">
                  <label>Từ khóa tìm kiếm</label>
                  <input
                    type="text"
                    className="modern-input"
                    placeholder="Nhập tên trò chơi..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>

                <div className="filter-item">
                  <label>Phân loại danh mục</label>
                  <select
                    className="modern-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Tất cả trò chơi</option>
                    {getCategories().map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-item">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="m-0">Độ tuổi tối đa</label>
                    <span className="age-value">
                      {ageFilter > 0 ? `${ageFilter}+ tuổi` : "Tất cả độ tuổi"}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="modern-range"
                    min="0"
                    max="18"
                    value={ageFilter}
                    onChange={(e) => setAgeFilter(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Grid hiển thị danh sách trò chơi */}
            <div className="col-lg-9">
              {filteredGames.length === 0 ? (
                <div className="modern-no-results">
                  <div className="no-results-icon">🔍</div>
                  <h4>Không tìm thấy trò chơi phù hợp!</h4>
                  <p>
                    Bạn hãy thử thay đổi từ khóa hoặc đặt lại bộ lọc để tìm kiếm
                    lại nhé.
                  </p>
                </div>
              ) : (
                <div className="row">
                  {filteredGames.map((game) => (
                    <div
                      key={game.id}
                      className="col-md-6 col-lg-4 mb-4 d-flex"
                    >
                      <div className="modern-game-card">
                        <div className="game-card-img-wrap">
                          <img
                            src={
                              game.images?.[0]
                                ? getImageUrl(game.images[0].image)
                                : "/img/default-game.jpg"
                            }
                            alt={game.name}
                            className="game-card-img"
                          />
                          <span
                            className={`game-card-category ${getCategoryBadge(game.category)}`}
                          >
                            {game.category}
                          </span>
                        </div>

                        <div className="game-card-body">
                          <h3 className="game-card-title">{game.name}</h3>
                          <p className="game-card-desc">
                            {game.description
                              ? `${game.description.substring(0, 75)}...`
                              : "HG Playground mang đến trải nghiệm trò chơi đỉnh cao..."}
                          </p>

                          <div className="game-card-meta">
                            <span className="meta-age">
                              <i className="fa fa-user-circle"></i>{" "}
                              {game.recommendedAge}+ Tuổi
                            </span>
                            <span
                              className={`meta-status ${getStatusBadge(game.status)}`}
                            >
                              <span className="status-dot"></span>
                              {game.status === "OPEN" ? "Đang mở" : "Tạm đóng"}
                            </span>
                          </div>

                          {game.allowedTicket === "ADULT" && (
                            <div className="adult-tag">
                              <i className="fa fa-exclamation-triangle"></i> Chỉ
                              dành cho vé người lớn
                            </div>
                          )}

                          <Link
                            to={`/games/${game.id}`}
                            className="btn-modern-card-detail"
                          >
                            Xem chi tiết <i className="fa fa-arrow-right"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Games;
