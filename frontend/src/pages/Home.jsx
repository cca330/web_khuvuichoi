import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gamesApi from '../api/gamesApi';
import eventsApi from '../api/eventsApi';
import '../styles/style1.css';

const Home = () => {
  const [games, setGames] = useState([]);
  const [events, setEvents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gamesRes, eventsRes] = await Promise.all([
        gamesApi.getAll(),
        eventsApi.getAll()
      ]);

      setGames(gamesRes.data.slice(0, 4));
      setEvents(eventsRes.data.slice(0, 3));

      setFeedbacks([
        { id: 1, name: 'Nguyễn Văn A', rating: 5, content: 'Khu vui chơi tuyệt vời!', created_at: '2024-01-15' },
        { id: 2, name: 'Trần Thị B', rating: 4, content: 'Trẻ em rất thích', created_at: '2024-01-10' },
        { id: 3, name: 'Lê Văn C', rating: 5, content: 'Dịch vụ tốt, giá hợp lý', created_at: '2024-01-05' },
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <i key={i} className={`fa fa-star ${i < rating ? 'filled' : ''}`}></i>
    ));
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'Mạo Hiểm': 'badge-maohiem',
      'Ocean Park': 'badge-ocean',
      'Gia Đình': 'badge-giadinh',
      'Thư Giãn': 'badge-thugian',
    };
    return colors[category] || 'badge-primary';
  };

  const categoryMap = {
    'Adventure': 'oranges',
    'Mạo hiểm': 'oranges',
    'Mạo Hiểm': 'oranges',
    'VR': 'fresh-meat',
    'Relaxation': 'fresh-meat',
    'Thư giãn': 'fresh-meat',
    'Family': 'vegetables',
    'Gia đình': 'vegetables',
    'Kids': 'fastfood',
    'Trẻ em': 'fastfood',
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="home-page">
      {/* Banner */}
      <section className="cafesanvuon">
        <div className="row">
          <div className="col-lg-12">
            <div className="hero__item set-bg" data-setbg="/img/banner.png">
              <div className="hero__text">
                <span>Khu vui chơi giải trí hàng đầu Việt Nam</span>
                <h2>HG - Khu vui chơi giải trí</h2>
                <p>Khám phá nụ cười, gắn kết trái tim!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Giới thiệu */}
      <section className="gioithieu">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-4">
              <img className="img-fluid" src="/img/khuvuichoi.png" alt="gioithieu.png" />
            </div>
            <div className="col-lg-4">
              <div className="content__gioithieu">
                <h3>Giới thiệu về chúng tôi</h3>
                <p>
                  Tọa lạc ngay tại trung tâm thành phố Biên Hòa, HG Playground - khu vui chơi giải trí hiện đại hàng đầu với diện tích rộng lớn hơn 100.000m²,
                  là thiên đường dành riêng cho các trò chơi hấp dẫn và phiêu lưu dành cho mọi lứa tuổi.
                </p>
                <p>
                  Với hàng loạt trò chơi cảm giác mạnh, khu vui chơi trong nhà và ngoài trời cùng dịch vụ chuyên nghiệp,
                  HG Playground là điểm đến lý tưởng để bạn bè và gia đình cùng nhau thỏa sức vui chơi, cười đùa suốt cả ngày trong kỳ nghỉ cuối tuần hay dịp lễ.
                  Check-in ngay để "quẩy" hết mình nào!!!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner nghỉ dưỡng */}
      <section className="bn-nghiduong">
        <div className="container">
          <div className="title">
            <h4>Thiên đường vui chơi hoàn hảo</h4>
            <h3>Khu vui chơi HG - Playground.</h3>
          </div>
          <div className="row">
            <div className="col-lg-3">
              <div className="content">
                <div className="content-overlay"></div>
                <img className="content-image" src="/img/hapdan.png" alt="Hấp dẫn" />
                <div className="content-details fadeIn-top">
                  <h3>Hấp dẫn</h3>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="content">
                <div className="content-overlay"></div>
                <img className="content-image" src="/img/xanhmat.png" alt="Xanh mát" />
                <div className="content-details fadeIn-top">
                  <h3>Xanh mát</h3>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="content">
                <div className="content-overlay"></div>
                <img className="content-image" src="/img/cotich.png" alt="Cổ tích" />
                <div className="content-details fadeIn-top">
                  <h3>Cổ tích</h3>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="content">
                <div className="content-overlay"></div>
                <img className="content-image" src="/img/hiendai.png" alt="Hiện đại" />
                <div className="content-details fadeIn-top">
                  <h3>Hiện đại</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sự kiện nổi bật */}
      <section className="from-blog spad event-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title from-blog__title text-center">
                <h2>Sự kiện nổi bật</h2>
                <p className="mt-4 w-75 mx-auto">
                  HG – Playground không chỉ là khu vui chơi giải trí mà còn là nơi diễn ra
                  nhiều sự kiện đỉnh cao, mang đến những khoảnh khắc bùng nổ cảm xúc cho mọi lứa tuổi.
                </p>
              </div>
            </div>
          </div>

          {events.length > 0 && (
            <div className="event-slider-container">
              <div className="event-slider-wrapper">
                {events.map((event, index) => (
                  <div key={event.id} className={`event-slide ${index === currentSlide ? 'active' : ''}`}>
                    <img src={event.thumbnail || '/img/default-event.jpg'} alt={event.title} />
                    <div className="event-caption">
                      <h3>{event.title}</h3>
                      <p>{new Date(event.startDatetime).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="slider-btn prev-btn" onClick={() => setCurrentSlide(currentSlide === 0 ? events.length - 1 : currentSlide - 1)}>
                <i className="fa fa-chevron-left"></i>
              </button>
              <button className="slider-btn next-btn" onClick={() => setCurrentSlide((currentSlide + 1) % events.length)}>
                <i className="fa fa-chevron-right"></i>
              </button>

              <div className="slider-nav">
                {events.map((_, index) => (
                  <div key={index} className={`slider-dot ${index === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(index)}></div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/events" className="btn btn-danger btn-lg px-5 py-3 rounded-pill shadow">
              <i className="fa fa-ticket"></i> Xem tất cả sự kiện
            </Link>
          </div>
        </div>
      </section>

      {/* Tìm vé / Games */}
      <section className="featured spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Tìm một tấm vé hoàn hảo dành cho bạn</h2>
              </div>
              <div className="featured__controls">
                <ul>
                  <li className="active" data-filter="*">Tất Cả</li>
                  <li data-filter=".oranges">Mạo hiểm</li>
                  <li data-filter=".fresh-meat">Thư giãn</li>
                  <li data-filter=".vegetables">Ocean Park</li>
                  <li data-filter=".fastfood">Trẻ em</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row featured__filter">
            {games.map((game) => (
              <div key={game.id} className={`col-lg-3 col-md-4 col-sm-6 mix ${categoryMap[game.category] || 'oranges'}`}>
                <div className="card mb-4">
                  <img className="card-img-top" src={game.images?.[0] ? `/uploads/${game.images[0]}` : '/img/default-game.jpg'} alt={game.name} style={{ height: '200px', objectFit: 'cover' }} />
                  <div className="card-body">
                    <h5 className="card-title">{game.name}</h5>
                    <div className="content pb-2 border-bottom">
                      <div className="d-flex align-items-center">
                        <img src="/img/ic1.png" alt="" />
                        <span className="pl-2" style={{ fontSize: '13px' }}>Từ {game.recommendedAge}+ tuổi</span>
                      </div>
                    </div>
                    <div className="row pt-4">
                      <div className="col-lg-7">
                        <span style={{ fontSize: '13px' }}>{game.category}</span>
                      </div>
                      <div className="col-lg-5">
                        <Link className="booknow" to="/games">Chi tiết</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trải nghiệm */}
      <section className="trai-nghiem spad">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <img src="/img/bn-trainghiem.png" className="img-fluid w-100 rounded-3 shadow" alt="Trải nghiệm tại HG Playground" />
            </div>
            <div className="col-lg-6">
              <div className="content__about">
                <h3 className="mb-4">Trải nghiệm tuyệt vời tại HG Playground</h3>
                <p className="lead mb-4">
                  Hãy tạm gác lại cuộc sống thường nhật để bước vào thế giới vui chơi đầy màu sắc tại HG Playground!
                  Một ngày trọn vẹn niềm vui, tiếng cười và kỷ niệm bên gia đình & bạn bè đang chờ bạn khám phá.
                </p>
                <div className="content-trainghiem">
                  <div className="d-flex align-items-start mb-4">
                    <img src="/img/check.png" alt="Check" className="me-3" style={{ width: '50px' }} />
                    <div>
                      <h4>Tàu Lượn Siêu Tốc & Trò Chơi Mạo Hiểm</h4>
                      <p>Thử thách bản thân với tốc độ, độ cao và những vòng xoay nghẹt thở!</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-start mb-4">
                    <img src="/img/check.png" alt="Check" className="me-3" style={{ width: '50px' }} />
                    <div>
                      <h4>Máng Trượt & Khu Vui Chơi Nước Ocean Park</h4>
                      <p>Cảm giác mát lạnh, phấn khích khi trượt từ độ cao xuống hồ nước rộng lớn.</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-start mb-4">
                    <img src="/img/check.png" alt="Check" className="me-3" style={{ width: '50px' }} />
                    <div>
                      <h4>Vòng Quay Khổng Lồ & Trò Chơi Gia Đình</h4>
                      <p>Ngắm toàn cảnh khu vui chơi từ trên cao, an toàn và vui vẻ cho cả nhà.</p>
                    </div>
                  </div>
                </div>
                <Link to="/games" className="btn btn-danger btn-lg mt-4 px-5 py-3 rounded-pill shadow">
                  Khám Phá Ngay Các Trò Chơi!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback / Testimonial */}
      <section className="testimonial">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 d-none d-lg-block">
              <ol className="carousel-indicators tabs">
                {feedbacks.map((fb, index) => (
                  <li key={fb.id} data-target="#carouselExampleIndicators" data-slide-to={index} className={index === 0 ? 'active' : ''}>
                    <figure>
                      <img src={`/img/fb${index + 1}.jpg`} className="img-fluid" alt={`Khách hàng ${fb.name}`} />
                    </figure>
                  </li>
                ))}
              </ol>
            </div>
            <div className="col-lg-6 d-flex justify-content-center align-items-center">
              <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                <h1>Khách hàng nói gì về chúng tôi?</h1>
                <div className="carousel-inner">
                  {feedbacks.map((fb, index) => (
                    <div key={fb.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                      <div className="rating">
                        {renderStars(fb.rating)}
                      </div>
                      <div className="quote-wrapper">
                        <p>{fb.content}</p>
                        <h3>{fb.name}</h3>
                        <small>{new Date(fb.created_at).toLocaleDateString('vi-VN')}</small>
                      </div>
                    </div>
                  ))}
                </div>
                <ol className="carousel-indicators indicators">
                  {feedbacks.map((fb, index) => (
                    <li key={fb.id} data-target="#carouselExampleIndicators" data-slide-to={index} className={index === 0 ? 'active' : ''}></li>
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