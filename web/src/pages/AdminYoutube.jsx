import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Admin.css';

function AdminYoutube() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({
        judul: '',
        link: ''
    });
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!token || !isAdmin) {
            navigate('/login');
            return;
        }
        fetchVideos();
    }, [token, isAdmin, navigate]);

    const fetchVideos = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/admin/youtube', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setVideos(data.data || []);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editData
                ? `http://localhost:8000/api/admin/youtube/${editData.id}`
                : 'http://localhost:8000/api/admin/youtube';

            await fetch(url, {
                method: editData ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            setShowModal(false);
            setEditData(null);
            setFormData({ judul: '', link: '' });
            fetchVideos();
        } catch (error) {
            console.error('Error saving video:', error);
        }
    };

    const handleEdit = (item) => {
        setEditData(item);
        setFormData({
            judul: item.judul || '',
            link: item.link || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus video ini?')) return;

        try {
            await fetch(`http://localhost:8000/api/admin/youtube/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchVideos();
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'A';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getEmbedUrl = (url) => {
        if (!url) return null;
        // Convert youtube watch URL to embed URL
        const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
        if (match) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        return url;
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">💍</div>
                    <span className="sidebar-title">Ta'aruf Admin</span>
                </div>

                <nav className="sidebar-nav">
                    <span className="nav-label">Menu Utama</span>
                    <Link to="/admin/dashboard" className="nav-item">
                        <span className="nav-item-icon">📊</span>
                        Dashboard
                    </Link>
                    <Link to="/admin/users" className="nav-item">
                        <span className="nav-item-icon">👥</span>
                        Daftar Pengguna
                    </Link>
                    <Link to="/admin/approvals" className="nav-item">
                        <span className="nav-item-icon">✅</span>
                        Persetujuan
                    </Link>

                    <div className="nav-divider"></div>
                    <span className="nav-label">Konten</span>
                    <Link to="/admin/berita" className="nav-item">
                        <span className="nav-item-icon">📰</span>
                        Berita
                    </Link>
                    <Link to="/admin/youtube" className="nav-item active">
                        <span className="nav-item-icon">🎥</span>
                        Video
                    </Link>

                    <div className="nav-divider"></div>
                    <span className="nav-label">Pengaturan</span>
                    <Link to="/admin/settings" className="nav-item">
                        <span className="nav-item-icon">⚙️</span>
                        Pengaturan
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="admin-profile">
                        <div className="admin-avatar">{getInitials(adminUser.name)}</div>
                        <div className="admin-info">
                            <span className="admin-name">{adminUser.name || 'Admin'}</span>
                            <span className="admin-email">{adminUser.email}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <span>🚪</span> Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-row">
                        <div className="header-content">
                            <h1>Kelola Video</h1>
                            <p>Tambah dan kelola video Youtube untuk ditampilkan di halaman utama</p>
                        </div>
                        <div className="header-actions">
                            <button className="btn-primary" onClick={() => {
                                setEditData(null);
                                setFormData({ judul: '', link: '' });
                                setShowModal(true);
                            }}>
                                + Tambah Video
                            </button>
                        </div>
                    </div>
                </header>

                {/* Video List */}
                <section className="admin-section">
                    <div className="section-header">
                        <h2>
                            <span>🎥</span> Daftar Video
                            <span className="section-badge">{videos.length}</span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="empty-state">
                            <div className="spinner"></div>
                            <p>Memuat data...</p>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>Belum Ada Video</h3>
                            <p>Klik tombol "Tambah Video" untuk menambahkan video baru.</p>
                        </div>
                    ) : (
                        <div className="video-grid">
                            {videos.map(item => (
                                <div key={item.id} className="video-card">
                                    <div className="video-preview">
                                        {item.link ? (
                                            <iframe
                                                src={getEmbedUrl(item.link)}
                                                title={item.judul || 'Video'}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="video-placeholder">🎬</div>
                                        )}
                                    </div>
                                    <div className="video-content">
                                        <h3>{item.judul || 'Video tanpa judul'}</h3>
                                        <p className="video-link">{item.link}</p>
                                    </div>
                                    <div className="video-actions">
                                        <button className="btn-edit" onClick={() => handleEdit(item)}>
                                            ✏️ Edit
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                                            🗑️ Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editData ? 'Edit Video' : 'Tambah Video'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Judul Video</label>
                                <input
                                    type="text"
                                    value={formData.judul}
                                    onChange={e => setFormData({ ...formData, judul: e.target.value })}
                                    placeholder="Masukkan judul video"
                                />
                            </div>
                            <div className="form-group">
                                <label>Link Youtube</label>
                                <input
                                    type="url"
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    required
                                />
                                <small style={{ color: '#64748B', marginTop: '6px', display: 'block' }}>
                                    Paste link video Youtube (watch atau embed)
                                </small>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    Batal
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editData ? 'Simpan Perubahan' : 'Tambah Video'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminYoutube;
