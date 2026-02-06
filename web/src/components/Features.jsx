import './Features.css';

const features = [
    {
        icon: '🔒',
        title: 'Eksklusif untuk YPI Al Azhar',
        description: 'Hanya pegawai YPI Al Azhar dengan NIP yang terdaftar yang dapat mengakses platform ini. Memberikan rasa aman dan komunitas yang terpercaya.'
    },
    {
        icon: '👥',
        title: 'Pembimbing Profesional',
        description: 'Didampingi oleh konsultan dan pembimbing berpengalaman yang siap membantu Anda di setiap tahap ta\'aruf hingga menuju pernikahan yang berkah.'
    },
    {
        icon: '🛡️',
        title: 'Privasi Terjamin',
        description: 'Data pribadi Anda dijaga dengan sistem keamanan berlapis. Hanya admin dan pembimbing resmi yang memiliki akses ke informasi Anda.'
    },
    {
        icon: '💕',
        title: 'Fokus pada Pernikahan',
        description: 'Platform ini dirancang dengan tujuan serius menuju pernikahan yang sakinah, mawaddah, warahmah. Bukan sekadar kenalan, tapi menuju komitmen.'
    }
];

function Features() {
    return (
        <section id="about" className="features">
            <div className="container">
                <div className="section-header">
                    <span className="section-badge">Keunggulan Kami</span>
                    <h2 className="section-title">Mengapa Memilih Ta'aruf Jodohku?</h2>
                    <p className="section-description">
                        Platform ta'aruf yang aman, terpercaya, dan sesuai syariat dengan
                        pendampingan profesional untuk membantu Anda menemukan pasangan hidup yang tepat.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;
