import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config/api';
import './Dashboard.css';

function DashboardPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        // Redirect admin to admin dashboard
        if (isAdmin) {
            navigate('/admin/dashboard');
            return;
        }

        fetchProfile();
    }, [token, isAdmin, navigate]);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setUser(data.user);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Memuat dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">💍</div>
                    <span className="sidebar-title">Ta'aruf Jodohku</span>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item active">
                        <span className="nav-icon">🏠</span>
                        Dashboard
                    </Link>
                    <Link to="/profile" className="nav-item">
                        <span className="nav-icon">👤</span>
                        Profil Saya
                    </Link>
                    <Link to="/biodata" className="nav-item">
                        <span className="nav-icon">📝</span>
                        Biodata
                    </Link>
                    <Link to="/kriteria" className="nav-item">
                        <span className="nav-icon">💕</span>
                        Kriteria Pasangan
                    </Link>

                    <div className="nav-divider"></div>

                    <Link to="/explore" className="nav-item">
                        <span className="nav-icon">🔍</span>
                        Cari Pasangan
                    </Link>
                    <Link to="/matches" className="nav-item">
                        <span className="nav-icon">💑</span>
                        Kecocokan
                    </Link>
                    <Link to="/chat" className="nav-item">
                        <span className="nav-icon">💬</span>
                        Pesan
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar-lg">
                            {user?.foto ? (
                                <img src={user.foto} alt={user.nama} />
                            ) : (
                                getInitials(user?.nama)
                            )}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user?.nama}</span>
                            <span className="user-nip">{user?.nip}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        🚪 Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>Selamat Datang, {user?.nama?.split(' ')[0]}! 👋</h1>
                        <p>Semoga hari ini membawa keberkahan dalam pencarian jodoh Anda</p>
                    </div>
                </header>

                {/* Profile Card */}
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user?.foto ? (
                                <img src={user.foto} alt={user.nama} />
                            ) : (
                                <span>{getInitials(user?.nama)}</span>
                            )}
                        </div>
                        <div className="profile-info">
                            <h2>{user?.nama}</h2>
                            <p className="profile-nip">{user?.nip}</p>
                            <span className={`gender-badge ${user?.jenkel === 'L' ? 'male' : 'female'}`}>
                                {user?.jenkel === 'L' ? '👨 Ikhwan' : '👩 Akhwat'}
                            </span>
                        </div>
                    </div>

                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-value">
                                {user?.biodata?.tgllahir ? calculateAge(user.biodata.tgllahir) : '—'}
                            </span>
                            <span className="stat-label">Tahun</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{user?.biodata?.tempatlahir || '—'}</span>
                            <span className="stat-label">Asal</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{user?.biodata?.pekerjaan || '—'}</span>
                            <span className="stat-label">Pekerjaan</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <h3 className="section-title">Menu Cepat</h3>
                <div className="quick-actions">
                    <Link to="/biodata" className="action-card">
                        <div className="action-icon">📝</div>
                        <div className="action-content">
                            <h4>Lengkapi Biodata</h4>
                            <p>Isi data diri Anda untuk meningkatkan peluang</p>
                        </div>
                        <span className="action-arrow">→</span>
                    </Link>

                    <Link to="/kriteria" className="action-card">
                        <div className="action-icon">💕</div>
                        <div className="action-content">
                            <h4>Kriteria Pasangan</h4>
                            <p>Tentukan kriteria pasangan idaman Anda</p>
                        </div>
                        <span className="action-arrow">→</span>
                    </Link>

                    <Link to="/explore" className="action-card">
                        <div className="action-icon">🔍</div>
                        <div className="action-content">
                            <h4>Cari Pasangan</h4>
                            <p>Jelajahi profil calon pasangan</p>
                        </div>
                        <span className="action-arrow">→</span>
                    </Link>
                </div>

                {/* Info Cards */}
                <h3 className="section-title">Informasi</h3>
                <div className="info-grid">
                    <div className="info-card">
                        <div className="info-icon blue">📊</div>
                        <div className="info-content">
                            <span className="info-value">0</span>
                            <span className="info-label">Profil Dilihat</span>
                        </div>
                    </div>
                    <div className="info-card">
                        <div className="info-icon green">💚</div>
                        <div className="info-content">
                            <span className="info-value">0</span>
                            <span className="info-label">Disukai</span>
                        </div>
                    </div>
                    <div className="info-card">
                        <div className="info-icon pink">💑</div>
                        <div className="info-content">
                            <span className="info-value">0</span>
                            <span className="info-label">Kecocokan</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;
