import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config/api';
import './Admin.css';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!token || !isAdmin) {
            navigate('/login');
            return;
        }
        fetchUsers();
    }, [token, isAdmin, navigate, filter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/admin/karyawan`;
            const params = new URLSearchParams();
            if (filter !== 'all') params.append('status', filter);
            if (search) params.append('search', search);
            if (params.toString()) url += `?${params.toString()}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setUsers(data.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            approved: { class: 'badge-success', label: '✓ Disetujui' },
            pending: { class: 'badge-warning', label: '⏳ Menunggu' },
            rejected: { class: 'badge-danger', label: '✕ Ditolak' }
        };
        const s = statusMap[status] || { class: 'badge', label: status };
        return <span className={`badge ${s.class}`}>{s.label}</span>;
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
                    <Link to="/admin/users" className="nav-item active">
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
                            <h1>Daftar Pengguna</h1>
                            <p>Kelola semua pengguna terdaftar di platform Ta'aruf</p>
                        </div>
                    </div>
                </header>

                {/* Filters */}
                <div className="filters-bar">
                    <div className="filter-tabs">
                        {['all', 'approved', 'pending', 'rejected'].map(f => (
                            <button
                                key={f}
                                className={`filter-tab ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f === 'all' && 'Semua'}
                                {f === 'approved' && '✓ Disetujui'}
                                {f === 'pending' && '⏳ Menunggu'}
                                {f === 'rejected' && '✕ Ditolak'}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="btn-primary">🔍 Cari</button>
                    </form>
                </div>

                {/* Users Table */}
                <section className="admin-section">
                    <div className="section-header">
                        <h2>
                            <span>👥</span> Data Pengguna
                            <span className="section-badge">{users.length}</span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="empty-state">
                            <div className="spinner"></div>
                            <p>Memuat data...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>Tidak Ada Data</h3>
                            <p>Tidak ditemukan pengguna dengan filter ini.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>NIP</th>
                                        <th>Pengguna</th>
                                        <th>Jenis Kelamin</th>
                                        <th>Status</th>
                                        <th>Tanggal Daftar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td><code>{user.nip}</code></td>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar">{getInitials(user.nama)}</div>
                                                    <div className="user-info">
                                                        <span className="user-name">{user.nama}</span>
                                                        <span className="user-email">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${user.jenkel === 'L' ? 'badge-blue' : 'badge-pink'}`}>
                                                    {user.jenkel === 'L' ? '👨 Ikhwan' : user.jenkel === 'P' ? '👩 Akhwat' : '—'}
                                                </span>
                                            </td>
                                            <td>{getStatusBadge(user.status)}</td>
                                            <td>{new Date(user.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default AdminUsers;
