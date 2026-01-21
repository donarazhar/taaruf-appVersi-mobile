import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Admin.css';

function AdminBerita() {
    const [berita, setBerita] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({
        judul: '',
        subjudul: '',
        isi: '',
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
        fetchBerita();
    }, [token, isAdmin, navigate]);

    const fetchBerita = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/admin/berita', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setBerita(data.data || []);
        } catch (error) {
            console.error('Error fetching berita:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editData
                ? `http://localhost:8000/api/admin/berita/${editData.id}`
                : 'http://localhost:8000/api/admin/berita';

            const response = await fetch(url, {
                method: editData ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowModal(false);
                setEditData(null);
                setFormData({ judul: '', subjudul: '', isi: '', link: '' });
                fetchBerita();
            }
        } catch (error) {
            console.error('Error saving berita:', error);
        }
    };

    const handleEdit = (item) => {
        setEditData(item);
        setFormData({
            judul: item.judul || '',
            subjudul: item.subjudul || '',
            isi: item.isi || '',
            link: item.link || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus berita ini?')) return;

        try {
            await fetch(`http://localhost:8000/api/admin/berita/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchBerita();
        } catch (error) {
            console.error('Error deleting berita:', error);
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
                    <Link to="/admin/berita" className="nav-item active">
                        <span className="nav-item-icon">📰</span>
                        Berita
                    </Link>
                    <Link to="/admin/youtube" className="nav-item">
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
                            <h1>Kelola Berita</h1>
                            <p>Buat dan edit berita untuk ditampilkan di halaman utama</p>
                        </div>
                        <div className="header-actions">
                            <button className="btn-primary" onClick={() => {
                                setEditData(null);
                                setFormData({ judul: '', subjudul: '', isi: '', link: '' });
                                setShowModal(true);
                            }}>
                                + Tambah Berita
                            </button>
                        </div>
                    </div>
                </header>

                {/* Berita List */}
                <section className="admin-section">
                    <div className="section-header">
                        <h2>
                            <span>📰</span> Daftar Berita
                            <span className="section-badge">{berita.length}</span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="empty-state">
                            <div className="spinner"></div>
                            <p>Memuat data...</p>
                        </div>
                    ) : berita.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>Belum Ada Berita</h3>
                            <p>Klik tombol "Tambah Berita" untuk membuat berita baru.</p>
                        </div>
                    ) : (
                        <div className="berita-grid">
                            {berita.map(item => (
                                <div key={item.id} className="berita-card">
                                    <div className="berita-content">
                                        <h3>{item.judul}</h3>
                                        {item.subjudul && <p className="berita-subtitle">{item.subjudul}</p>}
                                        <p className="berita-excerpt">
                                            {item.isi?.substring(0, 120)}...
                                        </p>
                                    </div>
                                    <div className="berita-actions">
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
                            <h2>{editData ? 'Edit Berita' : 'Tambah Berita'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Judul</label>
                                <input
                                    type="text"
                                    value={formData.judul}
                                    onChange={e => setFormData({ ...formData, judul: e.target.value })}
                                    placeholder="Masukkan judul berita"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Subjudul</label>
                                <input
                                    type="text"
                                    value={formData.subjudul}
                                    onChange={e => setFormData({ ...formData, subjudul: e.target.value })}
                                    placeholder="Masukkan subjudul (opsional)"
                                />
                            </div>
                            <div className="form-group">
                                <label>Isi Berita</label>
                                <textarea
                                    value={formData.isi}
                                    onChange={e => setFormData({ ...formData, isi: e.target.value })}
                                    placeholder="Masukkan isi berita"
                                    rows="5"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Link (Opsional)</label>
                                <input
                                    type="url"
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    Batal
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editData ? 'Simpan Perubahan' : 'Tambah Berita'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminBerita;
