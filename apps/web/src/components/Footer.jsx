import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <a href="/" className="footer-logo">
                            <span className="logo-icon">💍</span>
                            <span className="logo-text">Ta'aruf Jodohku</span>
                        </a>
                        <p className="footer-description">
                            Platform ta'aruf modern yang menghubungkan pegawai YPI Al Azhar dengan
                            pendampingan profesional menuju pernikahan yang berkah.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h4>Menu</h4>
                        <ul>
                            <li><a href="#about">Tentang</a></li>
                            <li><a href="#steps">Cara Kerja</a></li>
                            <li><a href="#testimonials">Testimoni</a></li>
                            <li><a href="#faq">FAQ</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Akun</h4>
                        <ul>
                            <li><a href="/login">Masuk</a></li>
                            <li><a href="/register">Daftar</a></li>
                            <li><a href="/panel">Admin Panel</a></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4>Kontak</h4>
                        <p>📍 Jl. Sisingamaraja, Kebayoran Baru, Jakarta Selatan 12110</p>
                        <p>📧 taarufonline2023@gmail.com</p>
                        <p>📞 (021) 727-83683</p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 Ta'aruf Jodohku - YPI Al Azhar. All rights reserved.</p>
                    <p>Developed by <a href="https://instagram.com/donsiyos" target="_blank" rel="noopener noreferrer">Donar Azhar</a></p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
