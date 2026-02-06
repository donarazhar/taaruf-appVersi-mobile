import './Hero.css';

function Hero() {
    return (
        <section id="hero" className="hero">
            <div className="container hero-content">
                <div className="hero-grid">
                    <div className="hero-text">
                        <div className="hero-badge">
                            <span className="star">✨</span>
                            Platform Ta'aruf Eksklusif
                        </div>
                        <h1 className="hero-title">
                            Temukan <span>Pasangan Hidup</span> yang Tepat
                        </h1>
                        <p className="hero-subtitle">
                            Platform ta'aruf modern khusus pegawai YPI Al Azhar dengan pendampingan profesional menuju pernikahan yang berkah dan bahagia.
                        </p>
                        <div className="hero-buttons">
                            <a href="#download" className="btn btn-primary btn-lg">
                                Download Aplikasi
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 12L8 4M8 12L4 8M8 12L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                            <a href="#about" className="btn btn-secondary btn-lg">
                                Pelajari Lebih Lanjut
                            </a>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img src="/hero-img.png" alt="Ta'aruf Jodohku" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
