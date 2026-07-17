export default function Footer() {
  return (
    <footer className="footer spad">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="footer__about">
              <div className="footer__about__logo">
                <a href="/">
                  <img src="/img/logo.png" alt="logo" />
                </a>
              </div>
              <ul>
                <li>
                  Địa chỉ: 76 Lê A, Khu phố Suối Chồn, phường Bảo Vinh, TP.Long
                  Khánh, Đồng Nai
                </li>
                <li>Điện thoại: 0251 7770 888</li>
                <li>Email: gardenthaodien@gmail.com</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-6 offset-lg-1">
            <div className="footer__widget">
              <h6>Thông tin</h6>
              <ul>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">About Our Shop</a>
                </li>
                <li>
                  <a href="#">Secure Shopping</a>
                </li>
                <li>
                  <a href="#">Delivery information</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Our Sitemap</a>
                </li>
              </ul>
              <ul>
                <li>
                  <a href="#">Who We Are</a>
                </li>
                <li>
                  <a href="#">Our Services</a>
                </li>
                <li>
                  <a href="#">Projects</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
                <li>
                  <a href="#">Innovation</a>
                </li>
                <li>
                  <a href="#">Testimonials</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4 col-md-12">
            <div className="footer__widget">
              <h6>Hỗ trợ khách hàng</h6>
              <p>Quý khách điền email và gửi thông tin hỗ trợ</p>
              <form onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Nhập mail" />
                <button type="submit" className="site-btn">
                  Gửi ngay
                </button>
              </form>
              <div className="footer__widget__social">
                <a href="#">
                  <i className="fa fa-facebook"></i>
                </a>
                <a href="#">
                  <i className="fa fa-instagram"></i>
                </a>
                <a href="#">
                  <i className="fa fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fa fa-pinterest"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="footer__copyright">
              <div className="footer__copyright__text">
                <p>Copyright © 2025 HG Playground. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
