import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config/api';
import './Admin.css';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!token || !isAdmin) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [token, isAdmin, navigate]);

    const fetchData = async () => {
        try {
            const [statsRes, pendingRes] = await Promise.all([
                fetch(`${API_URL}/admin/dashboard/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_URL}/admin/registrations/pending`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const statsData = await statsRes.json();
            const pendingData = await pendingRes.json();

            setStats(statsData);
            setPendingUsers(pendingData.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            await fetch(`${API_URL}/admin/registrations/${id}/approve`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error('Error approving:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        setActionLoading(id);
        try {
            await fetch(`${API_URL}/admin/registrations/${id}/reject`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error('Error rejecting:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('is_admin');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'A';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p className="loading-text">Memuat dashboard...</p>
            </div>
        );
    }

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
                    <Link to="/admin/dashboard" className="nav-item active">
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
                        {pendingUsers.length > 0 && (
                            <span className="section-badge">{pendingUsers.length}</span>
                        )}
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
                            <h1>Dashboard</h1>
                            <p>Selamat datang kembali, {adminUser.name?.split(' ')[0] || 'Admin'}! 👋</p>
                        </div>
                        <div className="header-actions">
                            <button className="btn-secondary" onClick={fetchData}>
                                🔄 Refresh
                            </button>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon blue">👥</div>
                        </div>
                        <div className="stat-value">{stats?.total_karyawan || 0}</div>
                        <div className="stat-label">Total Pengguna</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon green">👨</div>
                        </div>
                        <div className="stat-value">{stats?.total_pria || 0}</div>
                        <div className="stat-label">Ikhwan</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon pink">👩</div>
                        </div>
                        <div className="stat-value">{stats?.total_wanita || 0}</div>
                        <div className="stat-label">Akhwat</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon orange">⏳</div>
                        </div>
                        <div className="stat-value">{stats?.pending_approval || 0}</div>
                        <div className="stat-label">Menunggu Approval</div>
                    </div>
                </div>

                {/* Pending Registrations */}
                <section className="admin-section">
                    <div className="section-header">
                        <h2>
                            <span>📋</span> Pendaftaran Menunggu Persetujuan
                            {pendingUsers.length > 0 && (
                                <span className="section-badge">{pendingUsers.length}</span>
                            )}
                        </h2>
                    </div>

                    {pendingUsers.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">✅</div>
                            <h3>Semua Sudah Diproses!</h3>
                            <p>Tidak ada pendaftaran yang menunggu persetujuan saat ini.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>NIP</th>
                                        <th>Pengguna</th>
                                        <th>Jenis Kelamin</th>
                                        <th>Tanggal Daftar</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingUsers.map(user => (
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
                                            <td>{new Date(user.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-approve"
                                                        onClick={() => handleApprove(user.id)}
                                                        disabled={actionLoading === user.id}
                                                    >
                                                        {actionLoading === user.id ? '...' : '✓ Setujui'}
                                                    </button>
                                                    <button
                                                        className="btn-reject"
                                                        onClick={() => handleReject(user.id)}
                                                        disabled={actionLoading === user.id}
                                                    >
                                                        {actionLoading === user.id ? '...' : '✕ Tolak'}
                                                    </button>
                                                </div>
                                            </td>
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

export default AdminDashboard;
